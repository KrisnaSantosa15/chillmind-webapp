document.addEventListener('DOMContentLoaded', function() {
    // Form navigation
    const sections = ['section-1', 'section-2', 'section-3', 'section-4'];
    let currentSection = 0;
    
    // Progress bar update
    function updateProgressBar() {
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = ((currentSection + 1) / sections.length) * 100;
        
        progressFill.style.width = `${progressPercentage}%`;
        
        const sectionTitles = [
            "Section 1/4: Personal Details",
            "Section 2/4: Anxiety Assessment",
            "Section 3/4: Stress Assessment",
            "Section 4/4: Depression Assessment"
        ];
        progressText.textContent = sectionTitles[currentSection];
    }
    
    // Navigation buttons
    document.getElementById('next-btn-1').addEventListener('click', function() {
        if (validateSection('section-1')) {
            navigateToSection(1);
        }
    });
    
    document.getElementById('next-btn-2').addEventListener('click', function() {
        if (validateSection('section-2')) {
            navigateToSection(2);
        }
    });
    
    document.getElementById('next-btn-3').addEventListener('click', function() {
        if (validateSection('section-3')) {
            navigateToSection(3);
        }
    });
    
    document.getElementById('prev-btn-2').addEventListener('click', function() {
        navigateToSection(0);
    });
    
    document.getElementById('prev-btn-3').addEventListener('click', function() {
        navigateToSection(1);
    });
    
    document.getElementById('prev-btn-4').addEventListener('click', function() {
        navigateToSection(2);
    });
    
    function navigateToSection(index) {
        document.getElementById(sections[currentSection]).classList.add('hidden');
        currentSection = index;
        document.getElementById(sections[currentSection]).classList.remove('hidden');
        updateProgressBar();
    }
    
    // Form validation
    function validateSection(sectionId) {
        const section = document.getElementById(sectionId);
        const inputs = section.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            showError('Please fill in all required fields.');
        }
        
        return isValid;
    }
    
    // Error handling
    function showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
    
    // Load sample data - SAMPLE 1
    // document.getElementById('load-data-btn').addEventListener('click', function () {
    //     // Personal Details
    //     document.getElementById('age').value = '18-22';
    //     document.getElementById('gender').value = 'Male';
    //     document.getElementById('academic_year').value = 'Third Year or Equivalent';
    //     document.getElementById('cgpa').value = '3.00 - 3.39';
    //     document.getElementById('got_scholarship').value = 'No';

    //     // Load assessment data using a more generic approach
    //     const assessmentData = {
    //         anxiety: [3, 3, 2, 3, 3, 2, 3],
    //         stress: [4, 4, 4, 3, 1, 2, 1, 2, 4, 4],
    //         depression: [3, 3, 3, 3, 2, 3, 3, 2, 3]
    //     };

    //     // Fill in the assessment forms
    //     for (const [category, values] of Object.entries(assessmentData)) {
    //         values.forEach((value, i) => {
    //             const radio = document.querySelector(`input[name="${category}_q${i + 1}"][value="${value}"]`);
    //             if (radio) radio.checked = true;
    //         });
    //     }
    // });

    // Load sample data - SAMPLE 2
    document.getElementById('load-data-btn').addEventListener('click', function () {
        // Personal Details dari index ke-1
        document.getElementById('age').value = '23-26';
        document.getElementById('gender').value = 'Female';
        document.getElementById('academic_year').value = 'Fourth Year or Equivalent';
        document.getElementById('cgpa').value = '3.40 - 3.79';
        document.getElementById('got_scholarship').value = 'Yes';

        // Load assessment data dari index ke-1
        const assessmentData = {
            anxiety: [1, 1, 1, 1, 1, 1, 1],
            stress: [1, 2, 2, 1, 3, 3, 3, 3, 1, 1],
            depression: [1, 1, 1, 1, 1, 1, 1, 1, 1]
        };

        for (const [category, values] of Object.entries(assessmentData)) {
            values.forEach((value, i) => {
                const radio = document.querySelector(`input[name="${category}_q${i + 1}"][value="${value}"]`);
                if (radio) radio.checked = true;
            });
        }
    });


    let model = null;
    const MODEL_URL = 'tfjs_model/model.json';
    let scalerParams = null;

    // Load model on page load
    async function loadModel() {
        try {
            model = await tf.loadGraphModel(MODEL_URL);
            console.log('Model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
            showError('Failed to load the prediction model. Please try again later.');
            console.error('Model URL:', MODEL_URL);
        }
    }

    // Load scaler parameters
    async function loadScalerParams() {
        try {
            const response = await fetch('assets/scaler_params.json');
            scalerParams = await response.json();
            console.log("Scaler parameters loaded:", scalerParams);
        } catch (error) {
            console.error("Failed to load scaler parameters:", error);
        }
    }

    // Initialize model and parameters
    loadModel();
    loadScalerParams();

    // Form submission
    document.getElementById('submit-btn').addEventListener('click', async function () {
        if (!validateSection('section-4')) return;

        document.getElementById('loading').classList.remove('hidden');

        try {
            const formData = {
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                academic_year: document.getElementById('academic_year').value,
                cgpa: document.getElementById('cgpa').value,
                got_scholarship: document.getElementById('got_scholarship').value,
            };

            // Add assessment answers
            for (const assessment of ['anxiety', 'stress', 'depression']) {
                const questionCount = assessment === 'anxiety' ? 7 : 
                                     assessment === 'stress' ? 10 : 9;
                
                for (let i = 1; i <= questionCount; i++) {
                    const radioSelector = `input[name="${assessment}_q${i}"]:checked`;
                    const selectedRadio = document.querySelector(radioSelector);
                    
                    if (selectedRadio) {
                        formData[`${assessment}_q${i}`] = parseInt(selectedRadio.value);
                    } else {
                        showError(`Please answer all ${assessment} assessment questions.`);
                        document.getElementById('loading').classList.add('hidden');
                        return;
                    }
                }
            }

            if (!model) throw new Error('Model not loaded yet');

            const processedData = preprocessData(formData);
            const predictions = model.predict(processedData);

            const results = await processPredictions(predictions);
            displayResults(results);

        } catch (error) {
            console.error('Error during prediction:', error);
            showError('An error occurred during prediction. Please try again.');
        } finally {
            document.getElementById('loading').classList.add('hidden');
        }
    });

    // Helper function for one-hot encoding -> kategorikal
    function encodeCategory(value, categories) {
        const oneHot = new Array(categories.length).fill(0);
        const index = categories.indexOf(value);
        if (index !== -1) {
            oneHot[index] = 1;
        } else {
            console.warn(`Value "${value}" not found in categories:`, categories);
        }
        return oneHot;
    }

    // Standardize numeric values -> numerikal
    function standardize(value, mean, std) {
        const epsilon = 1e-8; // Atau nilai kecil lainnya
        return (value - mean) / (std + epsilon);
    }

    function preprocessData(formData) {
        // The categorical features need to be processed first based on the Python ColumnTransformer
        const categoricalFeatures = [
            "age",
            "gender",
            "academic_year",
            "cgpa",
            "got_scholarship"
        ];
        
        const categories = {
            "age": ["18-22", "23-26", "27-30", "Above 30", "Below 18"],
            "gender": ["Female", "Male", "Prefer not to say"],
            "academic_year": [
                "First Year or Equivalent",
                "Fourth Year or Equivalent",
                "Other",
                "Second Year or Equivalent",
                "Third Year or Equivalent"
            ],
            "cgpa": [
                "2.50 - 2.99",
                "3.00 - 3.39",
                "3.40 - 3.79",
                "3.80 - 4.00",
                "Below 2.50",
                "Other"
            ],
            "got_scholarship": ["No", "Yes"]
        };
        
        // Build categorical features part of the input vector
        let categoryFeatures = [];
        for (const feature of categoricalFeatures) {
            const oneHot = encodeCategory(formData[feature], categories[feature]);
            categoryFeatures = categoryFeatures.concat(oneHot);
        }
        
        // The numerical features in the exact order from Python
        const numericalFeatures = [
            "anxiety_q1", "anxiety_q2", "anxiety_q3", "anxiety_q4", "anxiety_q5", "anxiety_q6", "anxiety_q7",
            "stress_q1", "stress_q2", "stress_q3", "stress_q4", "stress_q5", "stress_q6", "stress_q7", "stress_q8", "stress_q9", "stress_q10",
            "depression_q1", "depression_q2", "depression_q3", "depression_q4", "depression_q5", "depression_q6", "depression_q7", "depression_q8", "depression_q9"
        ];
        
        // The exact means from the Python StandardScaler
        const means = scalerParams.mean;
        
        // The exact standard deviations from the Python StandardScaler
        const stds = scalerParams.std;
        
        // Process numerical features with exact standardization
        let numericalStandardized = [];
        for (let i = 0; i < numericalFeatures.length; i++) {
            // Make sure to get the correct feature name and value
            const featureName = numericalFeatures[i];
            // Parse as integer instead of float since these are discrete values 1-4
            const value = parseFloat(formData[featureName], 10);
            
            // Verify we have a valid value
            if (isNaN(value)) {
                console.error(`Invalid value for ${featureName}:`, formData[featureName]);
                throw new Error(`Missing or invalid value for ${featureName}`);
            }
            
            // Apply standardization
            const standardizedValue = (value - means[i]) / stds[i];
            numericalStandardized.push(standardizedValue);
        }
        
        // IMPORTANT: In the Python pipeline, categorical features are processed BEFORE numerical features
        // So we need to combine them in that order: categorical first, then numerical
        const inputArray = [
            
            ...numericalStandardized,
            ...categoryFeatures
        ];
        
        console.log("Input to model:", inputArray);
        console.log("Input length:", inputArray.length);
        
        
        return tf.tensor2d([inputArray]);
    }

    async function processPredictions(predictions) {
        let data = [];

        if (predictions instanceof tf.Tensor) {
            data = Array.from(await predictions.data());
        } else if (Array.isArray(predictions)) {
            for (const tensor of predictions) {
                if (tensor instanceof tf.Tensor) {
                    const tensorData = await tensor.data();
                    data.push(...tensorData);
                }
            }
        } else {
            throw new Error("Unsupported prediction output format.");
        }

        if (data.length !== 13) {
            throw new Error(`Unexpected output length. Expected 13, got ${data.length}`);
        }

        const stressProbs = data.slice(0, 3);        // output_2
        const anxietyProbs = data.slice(3, 7);       // output_1
        const depressionProbs = data.slice(7, 13);   // output_0


        const normalize = (probs) => {
            const sum = probs.reduce((a, b) => a + b, 0);
            return sum > 0 ? probs.map(p => p / sum) : probs.map((_, i) => i === 0 ? 1 : 0);
        };

        const depressionLabels = [
            'Mild Depression',
            'Minimal Depression',
            'Moderate Depression',
            'Moderately Severe Depression',
            'No Depression',
            'Severe Depression'
        ];

        const anxietyLabels = [
            'Mild Anxiety',
            'Minimal Anxiety',
            'Moderate Anxiety',
            'Severe Anxiety'
        ];

        const stressLabels = [
            'High Perceived Stress',
            'Low Stress',
            'Moderate Stress'
        ];


        const depProbs = normalize(depressionProbs);
        const anxProbs = normalize(anxietyProbs);
        const strProbs = normalize(stressProbs);

        return {
            depression: {
                label: depressionLabels[depProbs.indexOf(Math.max(...depProbs))],
                probability: Math.max(...depProbs),
                probabilities: depressionLabels.map((label, i) => ({
                    label,
                    probability: depProbs[i]
                }))
            },
            anxiety: {
                label: anxietyLabels[anxProbs.indexOf(Math.max(...anxProbs))],
                probability: Math.max(...anxProbs),
                probabilities: anxietyLabels.map((label, i) => ({
                    label,
                    probability: anxProbs[i]
                }))
            },
            stress: {
                label: stressLabels[strProbs.indexOf(Math.max(...strProbs))],
                probability: Math.max(...strProbs),
                probabilities: stressLabels.map((label, i) => ({
                    label,
                    probability: strProbs[i]
                }))
            }
        };
    }


    function displayResults(results) {
        const resultsDiv = document.getElementById('results-content');
        resultsDiv.innerHTML = '';
        
        const table = document.createElement('table');
        
        const headerRow = table.insertRow();
        const conditionHeader = headerRow.insertCell(0);
        const statusHeader = headerRow.insertCell(1);
        const confidenceHeader = headerRow.insertCell(2);
        
        conditionHeader.textContent = 'Condition';
        statusHeader.textContent = 'Status';
        confidenceHeader.textContent = 'Confidence';
        
        for (const [condition, data] of Object.entries(results)) {
            const row = table.insertRow();
            const conditionCell = row.insertCell(0);
            const statusCell = row.insertCell(1);
            const confidenceCell = row.insertCell(2);

            conditionCell.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);

            const statusSpan = document.createElement('span');
            statusSpan.textContent = data.label;
            statusSpan.className = `status-indicator ${data.label.toLowerCase().replace(/\s+/g, '-')}`;
            statusCell.appendChild(statusSpan);

            // Use the main probability for this label directly
            confidenceCell.textContent = `${(data.probability * 100).toFixed(1)}%`;
        }
        
        resultsDiv.appendChild(table);
        
        const detailsDiv = document.createElement('div');
        detailsDiv.style.marginTop = '20px';
        detailsDiv.innerHTML = '<h4>Detailed Probabilities</h4>';

        for (const [condition, data] of Object.entries(results)) {
            const conditionDiv = document.createElement('div');
            conditionDiv.style.marginBottom = '15px';
            
            const title = document.createElement('strong');
            title.textContent = `${condition.charAt(0).toUpperCase() + condition.slice(1)}: `;
            conditionDiv.appendChild(title);
            
            const probsText = data.probabilities.map(p => 
                `${p.label}: ${(p.probability * 100).toFixed(1)}%`
            ).join(', ');
            
            conditionDiv.appendChild(document.createTextNode(probsText));
            detailsDiv.appendChild(conditionDiv);
        }

        resultsDiv.appendChild(detailsDiv);
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
});