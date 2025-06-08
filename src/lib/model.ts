import * as tf from "@tensorflow/tfjs";

const categories = {
  age: ["below18", "18-22", "23-26", "27-30", "above30"],
  gender: ["male", "female", "preferNotToSay"],
  academicYear: ["firstYear", "secondYear", "thirdYear", "fourthYear", "other"],
  gpa: [
    "below2.50",
    "2.50-2.99",
    "3.00-3.39",
    "3.40-3.79",
    "3.80-4.00",
    "other",
  ],
  scholarship: [false, true],
};

export interface AssessmentAnswers {
  phq9Answers: number[];
  gad7Answers: number[];
  pssAnswers: number[];
}

export interface DemographicData {
  age: string;
  gender: string;
  academicYear: string;
  gpa: string;
  scholarship: boolean | null;
}

export interface PredictionResults {
  depression: {
    label: string;
    probability: number;
    probabilities: { label: string; probability: number }[];
  };
  anxiety: {
    label: string;
    probability: number;
    probabilities: { label: string; probability: number }[];
  };
  stress: {
    label: string;
    probability: number;
    probabilities: { label: string; probability: number }[];
  };
}

interface ScalerParams {
  mean: number[];
  std: number[];
}

function encodeCategory(
  value: string | boolean | null,
  categoryOptions: Array<string | boolean>
) {
  const oneHot = new Array(categoryOptions.length).fill(0);
  const index = categoryOptions.indexOf(value as string | boolean);
  if (index !== -1) {
    oneHot[index] = 1;
  }
  return oneHot;
}

let model: tf.GraphModel | null = null;
let scalerParams: ScalerParams | null = null;

export async function loadModel() {
  if (model) return model;

  try {
    model = await tf.loadGraphModel("/inference/tfjs_model/model.json");
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw new Error("Failed to load the prediction model.");
  }
}

export async function loadScalerParams() {
  if (scalerParams) return scalerParams;

  try {
    const response = await fetch("/inference/assets/scaler_params.json");
    const data = await response.json();
    scalerParams = data as ScalerParams;
    return scalerParams;
  } catch (error) {
    console.error("Error loading scaler parameters:", error);
    throw new Error("Failed to load scaler parameters.");
  }
}

export function preprocessData(
  demographicData: DemographicData,
  assessmentAnswers: AssessmentAnswers
) {
  if (!scalerParams) {
    throw new Error("Scaler parameters not loaded");
  }

  const { age, gender, academicYear, gpa, scholarship } = demographicData;

  const ageEncoded = encodeCategory(age, categories.age);
  const genderEncoded = encodeCategory(gender, categories.gender);
  const academicYearEncoded = encodeCategory(
    academicYear,
    categories.academicYear
  );
  const gpaEncoded = encodeCategory(gpa, categories.gpa);
  const scholarshipEncoded = encodeCategory(
    scholarship,
    categories.scholarship
  );

  const categoricalFeatures = [
    ...ageEncoded,
    ...genderEncoded,
    ...academicYearEncoded,
    ...gpaEncoded,
    ...scholarshipEncoded,
  ];

  const { phq9Answers, gad7Answers, pssAnswers } = assessmentAnswers;

  const numericalFeatures = [...gad7Answers, ...pssAnswers, ...phq9Answers];

  const { mean, std } = scalerParams;
  const numericalStandardized = numericalFeatures.map((value, i) => {
    return (value - mean[i]) / (std[i] + 1e-8);
  });

  const inputArray = [...numericalStandardized, ...categoricalFeatures];

  return tf.tensor2d([inputArray]);
}

export async function processPredictions(
  predictions: tf.Tensor | tf.Tensor[]
): Promise<PredictionResults> {
  let data: number[] = [];

  if (predictions instanceof tf.Tensor) {
    data = Array.from(await predictions.data());
  } else if (Array.isArray(predictions)) {
    for (const tensor of predictions) {
      if (tensor instanceof tf.Tensor) {
        const tensorData = await tensor.data();
        data.push(...Array.from(tensorData as Float32Array));
      }
    }
  } else {
    throw new Error("Unsupported prediction output format.");
  }

  if (data.length !== 13) {
    throw new Error(
      `Unexpected output length. Expected 13, got ${data.length}`
    );
  }

  const stressProbs = data.slice(0, 3);
  const anxietyProbs = data.slice(3, 7);
  const depressionProbs = data.slice(7, 13);

  const normalize = (probs: number[]) => {
    const sum = probs.reduce((a, b) => a + b, 0);
    return sum > 0
      ? probs.map((p) => p / sum)
      : probs.map((_, i) => (i === 0 ? 1 : 0));
  };

  const depressionLabels = [
    "Mild Depression",
    "Minimal Depression",
    "Moderate Depression",
    "Moderately Severe Depression",
    "No Depression",
    "Severe Depression",
  ];

  const anxietyLabels = [
    "Mild Anxiety",
    "Minimal Anxiety",
    "Moderate Anxiety",
    "Severe Anxiety",
  ];

  const stressLabels = [
    "High Perceived Stress",
    "Low Stress",
    "Moderate Stress",
  ];

  const depProbs = normalize(depressionProbs);
  const anxProbs = normalize(anxietyProbs);
  const strProbs = normalize(stressProbs);

  const depressionLabel =
    depressionLabels[depProbs.indexOf(Math.max(...depProbs))];
  const anxietyLabel = anxietyLabels[anxProbs.indexOf(Math.max(...anxProbs))];
  const stressLabel = stressLabels[strProbs.indexOf(Math.max(...strProbs))];

  return {
    depression: {
      label: depressionLabel,
      probability: Math.max(...depProbs),
      probabilities: depressionLabels.map((label, i) => ({
        label,
        probability: depProbs[i],
      })),
    },
    anxiety: {
      label: anxietyLabel,
      probability: Math.max(...anxProbs),
      probabilities: anxietyLabels.map((label, i) => ({
        label,
        probability: anxProbs[i],
      })),
    },
    stress: {
      label: stressLabel,
      probability: Math.max(...strProbs),
      probabilities: stressLabels.map((label, i) => ({
        label,
        probability: strProbs[i],
      })),
    },
  };
}

export function getLabelColor(condition: string, label: string): string {
  if (condition === "depression") {
    switch (label) {
      case "No Depression":
      case "Minimal Depression":
        return "bg-green-500";
      case "Mild Depression":
        return "bg-yellow-500";
      case "Moderate Depression":
        return "bg-orange-500";
      case "Moderately Severe Depression":
        return "bg-orange-500";
      case "Severe Depression":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  } else if (condition === "anxiety") {
    switch (label) {
      case "Minimal Anxiety":
        return "bg-green-500";
      case "Mild Anxiety":
        return "bg-yellow-500";
      case "Moderate Anxiety":
        return "bg-orange-500";
      case "Severe Anxiety":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  } else if (condition === "stress") {
    switch (label) {
      case "Low Stress":
        return "bg-green-500";
      case "Moderate Stress":
        return "bg-yellow-500";
      case "High Perceived Stress":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  }
  return "bg-muted";
}
