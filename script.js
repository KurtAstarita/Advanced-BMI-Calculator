document.addEventListener("DOMContentLoaded", function() {

    const calculateButton = document.getElementById("calculate-adv-bmi");
    const bmiResultDisplay = document.getElementById("adv-bmi-result");
    const bmiInterpretationDisplay = document.getElementById("adv-bmi-interpretation");

    // Helper function for sanitizing input (using DOMPurify if available)
    function sanitizeInput(input) {
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(input);
        }
        console.warn("DOMPurify not loaded, input not sanitized.");
        return input;
    }

    // Function to handle unit conversions
    function convertUnits(value, unit, targetUnit) {
        if (unit === targetUnit) {
            return value;
        }

        switch (unit) {
            case "inches":
                if (targetUnit === "cm") return value * 2.54;
                break;
            case "lbs":
                if (targetUnit === "kg") return value / 2.205;
                break;
            case "cm":
                if (targetUnit === "inches") return value / 2.54;
                break;
            case "kg":
                if (targetUnit === "lbs") return value * 2.205;
                break;
        }
        return value; // Should not happen if units are properly handled
    }

    // Function to calculate BMI
    function calculateBMI(weightKg, heightCm) {
        // Height needs to be in meters for BMI formula
        const heightMeters = heightCm / 100;
        return weightKg / (heightMeters * heightMeters);
    }

    // Function to get waist circumference interpretation
    function getWaistInterpretation(waistCm, activityLevel, gender) {
        // --- NEW DEBUGGING LOGS INSIDE THIS FUNCTION ---
        console.log("--- Inside getWaistInterpretation ---");
        console.log("waistCm received:", waistCm);
        console.log("activityLevel received:", activityLevel);
        console.log("gender received:", gender);
        // --- END NEW DEBUGGING LOGS ---

        let interpretation = "";
        const waistRiskThresholdMale = 102; // cm (approx 40 inches)
        const waistRiskThresholdFemale = 88; // cm (approx 35 inches)

        if (gender === "male") {
            console.log("Gender is male. Checking waist against male threshold (" + waistRiskThresholdMale + "cm)");
            if (waistCm > waistRiskThresholdMale) {
                interpretation += "Your waist circumference is high and suggests increased health risks for men. ";
                if (activityLevel < 1.725) { // Moderately Active (1.55) or below
                    interpretation += "Your current activity level may further increase this risk. ";
                }
                console.log("Waist (male) is HIGH. Current interpretation:", interpretation);
            } else {
                interpretation += "Your waist circumference appears to be within a healthy range for men. ";
                console.log("Waist (male) is HEALTHY. Current interpretation:", interpretation);
            }
        } else if (gender === "female") {
            console.log("Gender is female. Checking waist against female threshold (" + waistRiskThresholdFemale + "cm)");
            if (waistCm > waistRiskThresholdFemale) {
                interpretation += "Your waist circumference is high and suggests increased health risks for women. ";
                if (activityLevel < 1.725) { // Moderately Active (1.55) or below
                    interpretation += "Your current activity level may further increase this risk. ";
                }
                console.log("Waist (female) is HIGH. Current interpretation:", interpretation);
            } else {
                interpretation += "Your waist circumference appears to be within a healthy range for women. ";
                console.log("Waist (female) is HEALTHY. Current interpretation:", interpretation);
            }
        }
        console.log("getWaistInterpretation returning:", interpretation);
        console.log("--- End getWaistInterpretation ---");
        return interpretation;
    }

    // Function to get BMI interpretation
    function getBMIInterpretation(bmi) {
        let interpretation = "";
        if (bmi < 18.5) {
            interpretation = "Your BMI indicates you are underweight. ";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            interpretation = "Your BMI is within a healthy weight range. ";
        } else if (bmi >= 25 && bmi < 29.9) {
            interpretation = "Your BMI indicates you are overweight. ";
        } else { // bmi >= 30
            interpretation = "Your BMI indicates you are obese. ";
        }
        return interpretation;
    }

    // Function to get the muscular disclaimer
    function getMuscularDisclaimer(bmi, waistInches, activityLevel) {
        // High BMI but healthy waist and active
        if (bmi >= 25 && waistInches <= 35 && activityLevel >= 1.55) {
            return "Note: BMI may overestimate body fat in athletes and very muscular individuals. Consult a healthcare professional for a more accurate body composition assessment. ";
        }
        return "";
    }

    // Function to display results
    function displayResults(bmi, interpretation) {
        bmiResultDisplay.textContent = "BMI: " + bmi.toFixed(2);
        bmiInterpretationDisplay.textContent = interpretation;
    }

    // Main calculation logic
    calculateButton.addEventListener("click", function() {
        // 1. Get and sanitize input values
        const heightInput = sanitizeInput(document.getElementById("height-adv").value);
        const weightInput = sanitizeInput(document.getElementById("weight-adv").value);
        const waistInput = sanitizeInput(document.getElementById("waist-adv").value);

        // 2. Parse and get unit selections
        let height = parseFloat(heightInput);
        const heightUnit = document.getElementById("height-unit-adv").value;
        let weight = parseFloat(weightInput);
        const weightUnit = document.getElementById("weight-unit-adv").value;
        let waist = parseFloat(waistInput);
        const waistUnit = document.getElementById("waist-unit-adv").value;
        const activity = parseFloat(document.getElementById("activity-adv").value);
        const gender = document.getElementById("gender-adv").value;

        // 3. Input Validation
        if (isNaN(height) || isNaN(weight) || isNaN(waist) || isNaN(activity)) {
            displayResults(NaN, "Please enter valid numbers.");
            return;
        }
        if (height <= 0 || weight <= 0 || waist <= 0 || activity <= 0) {
            displayResults(NaN, "Height, weight, waist, and activity must be greater than zero.");
            return;
        }

        // 4. Convert all inputs to standard units (cm, kg) for calculations
        const heightCm = convertUnits(height, heightUnit, "cm");
        const weightKg = convertUnits(weight, weightUnit, "kg");
        const waistCm = convertUnits(waast, waistUnit, "cm"); // **** POTENTIAL BUG: TYPO 'waast' should be 'waist' ****
        const waistInchesForDisclaimer = convertUnits(waist, waistUnit, "inches"); // Keep inches for disclaimer logic

        // --- GLOBAL DEBUGGING VALUES ---
        console.log("--- DEBUGGING VALUES (Global Scope) ---");
        console.log("Height (cm):", heightCm);
        console.log("Weight (kg):", weightKg);
        console.log("Waist (cm) AFTER CONVERSION:", waistCm); // Verify this is correct before passing to function
        console.log("Waist Unit (selected):", waistUnit);
        console.log("Activity:", activity);
        console.log("Gender:", gender);
        console.log("------------------------");

        // 5. Perform BMI Calculation
        const bmi = calculateBMI(weightKg, heightCm);

        // 6. Generate Interpretations
        const waistInterpretation = getWaistInterpretation(waistCm, activity, gender);
        const bmiInterpretation = getBMIInterpretation(bmi);
        const muscularDisclaimer = getMuscularDisclaimer(bmi, waistInchesForDisclaimer, activity);

        // 7. Combine all interpretations
        let finalInterpretation = waistInterpretation + bmiInterpretation + muscularDisclaimer;

        // 8. Handle empty interpretation (should be rare with this structure)
        if (finalInterpretation === "") {
            finalInterpretation = "Could not generate a full interpretation. Please ensure all fields are correctly filled.";
        }

        // 9. Display the results
        displayResults(bmi, finalInterpretation);
    });
});
