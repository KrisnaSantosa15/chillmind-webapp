import * as tf from "@tensorflow/tfjs";

// Categories for one-hot encoding
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

// Interface for assessment answers
export interface AssessmentAnswers {
  phq9Answers: number[];
  gad7Answers: number[];
  pssAnswers: number[];
}

// Interface for demographics data
export interface DemographicData {
  age: string;
  gender: string;
  academicYear: string;
  gpa: string;
  scholarship: boolean | null;
}

// Interface for prediction results
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

// Interface for scaler parameters
interface ScalerParams {
  mean: number[];
  std: number[];
}

// Helper function for one-hot encoding
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

// Load and initialize the model
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

// Preprocess the data for prediction
export function preprocessData(
  demographicData: DemographicData,
  assessmentAnswers: AssessmentAnswers
) {
  if (!scalerParams) {
    throw new Error("Scaler parameters not loaded");
  }

  // Extract categorical features
  const { age, gender, academicYear, gpa, scholarship } = demographicData;

  // One-hot encode categorical features
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

  // Combine categorical features
  const categoricalFeatures = [
    ...ageEncoded,
    ...genderEncoded,
    ...academicYearEncoded,
    ...gpaEncoded,
    ...scholarshipEncoded,
  ];

  // Extract numerical features
  const { phq9Answers, gad7Answers, pssAnswers } = assessmentAnswers;

  // Combine all numerical features in the right order
  const numericalFeatures = [
    ...gad7Answers, // 7 features (anxiety_q1-7)
    ...pssAnswers, // 10 features (stress_q1-10)
    ...phq9Answers, // 9 features (depression_q1-9)
  ];

  // Apply standardization using mean and std from scalerParams
  const { mean, std } = scalerParams;
  const numericalStandardized = numericalFeatures.map((value, i) => {
    return (value - mean[i]) / (std[i] + 1e-8); // Add small epsilon to avoid division by zero
  });

  // Combine features in the order expected by the model
  // Note: order might need adjustment based on the model training
  const inputArray = [...numericalStandardized, ...categoricalFeatures];

  return tf.tensor2d([inputArray]);
}

// Process prediction output
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

  // Extract probabilities for each condition
  const stressProbs = data.slice(0, 3); // Low, Moderate, High (3 classes)
  const anxietyProbs = data.slice(3, 7); // Minimal, Mild, Moderate, Severe (4 classes)
  const depressionProbs = data.slice(7, 13); // Six classes for depression

  // Normalize probabilities to ensure they sum to 1
  const normalize = (probs: number[]) => {
    const sum = probs.reduce((a, b) => a + b, 0);
    return sum > 0
      ? probs.map((p) => p / sum)
      : probs.map((_, i) => (i === 0 ? 1 : 0));
  };

  // Label mappings for each condition
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

  // Normalize probabilities
  const depProbs = normalize(depressionProbs);
  const anxProbs = normalize(anxietyProbs);
  const strProbs = normalize(stressProbs);

  // Find the most likely label for each condition
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

// Helper function to get color for a label
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
