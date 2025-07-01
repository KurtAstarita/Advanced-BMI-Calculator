document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calculate-adv-bmi").addEventListener("click", function() {

        function sanitizeInput(input) {
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(input);
            }
            console.warn("DOMPurify not loaded, input not sanitized.");
            return input;
        }

        var heightInput = sanitizeInput(document.getElementById("height-adv").value);
        var weightInput = sanitizeInput(document.getElementById("weight-adv").value);
        var waistInput = sanitizeInput(document.getElementById("waist-adv").value);

        var height = parseFloat(heightInput);
        var heightUnit = document.getElementById("height-unit-adv").value;
        var weight = parseFloat(weightInput);
        var weightUnit = document.getElementById("weight-unit-adv").value;
        var waist = parseFloat(waistInput);
        var waistUnit = document.getElementById("waist-unit-adv").value;
        var activity = parseFloat(document.getElementById("activity-adv").value);
        var gender = document.getElementById("gender-adv").value;

        // --- Input Validation ---
        if (isNaN(height) || isNaN(weight) || isNaN(waist) || isNaN(activity)) {
            document.getElementById("adv-bmi-result").textContent = "Please enter valid numbers.";
            document.getElementById("adv-bmi-interpretation").textContent = "";
            return;
        }

        if (height <= 0 || weight <= 0 || waist <= 0 || activity <= 0) {
            document.getElementById("adv-bmi-result").textContent = "Height, weight, waist, and activity must be greater than zero.";
            document.getElementById("adv-bmi-interpretation").textContent = "";
            return;
        }

        // --- Unit Conversions to CM and KG ---
        if (heightUnit === "inches") {
            height = height * 2.54; // Convert inches to cm
        }
        if (weightUnit === "lbs") {
            weight = weight / 2.205; // Convert lbs to kg
        }
        if (waistUnit === "inches") {
            waist = waist * 2.54; // Convert inches to cm
        }

        // --- ADD THESE CONSOLE.LOGS ---
        console.log("--- DEBUGGING VALUES ---");
        console.log("Height (cm):", height);
        console.log("Weight (kg):", weight);
        console.log("Waist (cm):", waist);
        console.log("Waist Unit (selected):", waistUnit);
        console.log("Activity:", activity);
        console.log("Gender:", gender);
        console.log("------------------------");

        // --- BMI Calculation ---
        var bmi = weight / ((height / 100) * (height / 100)); // Height is in cm, convert to meters for BMI

        document.getElementById("adv-bmi-result").textContent = "BMI: " + bmi.toFixed(2);

        // --- Interpretation Logic ---
        var interpretation = "";
        var waistInches = waist / 2.54; // Convert waist back to inches for display context in interpretation

        var waistRiskThresholdMale = 102; // cm (approx 40 inches)
        var waistRiskThresholdFemale = 88; // cm (approx 35 inches)

        // Waist circumference interpretation
        if (gender === "male") {
            if (waist > waistRiskThresholdMale) {
                interpretation += "Your waist circumference is high and suggests increased health risks for men. ";
                if (activity < 1.725) { // Moderately Active (1.55) or below
                    interpretation += "Your current activity level may further increase this risk. ";
                }
            } else {
                interpretation += "Your waist circumference appears to be within a healthy range for men. ";
            }
        } else if (gender === "female") {
            if (waist > waistRiskThresholdFemale) {
                interpretation += "Your waist circumference is high and suggests increased health risks for women. ";
                if (activity < 1.725) { // Moderately Active (1.55) or below
                    interpretation += "Your current activity level may further increase this risk. ";
                }
            } else {
                interpretation += "Your waist circumference appears to be within a healthy range for women. ";
            }
        }

        // BMI interpretation (THIS IS THE MODIFIED SECTION)
        if (bmi < 18.5) {
            interpretation += "Your BMI indicates you are underweight. ";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            interpretation += "Your BMI is within a healthy weight range. "; // Always add this if true
        } else if (bmi >= 25 && bmi < 29.9) {
            interpretation += "Your BMI indicates you are overweight. ";
        } else { // bmi >= 30
            interpretation += "Your BMI indicates you are obese. ";
        }

        // Add a disclaimer about BMI for muscular individuals, considering both BMI and a healthy waist
        // Adjusted the waistInches threshold for the disclaimer to be more generally applicable for a "jacked" person
        if (bmi >= 25 && waistInches <= 35 && activity >= 1.55) { // High BMI but healthy waist and active
            interpretation += "Note: BMI may overestimate body fat in athletes and very muscular individuals. Consult a healthcare professional for a more accurate body composition assessment. ";
        }

        // Final fallback if no specific interpretation was generated (though with the changes, this should be rare)
        if (interpretation === "") {
            interpretation = "Could not generate a full interpretation. Please ensure all fields are correctly filled.";
        }

        document.getElementById("adv-bmi-interpretation").textContent = interpretation;
    });
});
