document.getElementById("calculate-adv-bmi").addEventListener("click", function() {
    function sanitizeInput(input) {
        return DOMPurify.sanitize(input);
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

    if (heightUnit === "inches") {
        height = height * 2.54;
    }
    if (weightUnit === "lbs") {
        weight = weight / 2.205;
    }
    if (waistUnit === "inches") {
        waist = waist * 2.54;
    }

    var bmi = weight / ((height / 100) * (height / 100));

    document.getElementById("adv-bmi-result").textContent = "BMI: " + bmi.toFixed(2);

var interpretation = "";
    var waistInches = waist / 2.54; // Waist is already in CM from conversion earlier

    var waistRiskThresholdMale = 102; // cm (approx 40 inches)
    var waistRiskThresholdFemale = 88; // cm (approx 35 inches)

    // Waist circumference interpretation
    if (gender === "male") {
        if (waist > waistRiskThresholdMale) {
            interpretation += "Your waist circumference is high and suggests increased health risks for men. ";
            if (activity < 1.725) {
                interpretation += "Low activity level further increases this risk. ";
            }
        } else {
            interpretation += "Your waist circumference appears to be within a healthy range for men. ";
        }
    } else if (gender === "female") {
        if (waist > waistRiskThresholdFemale) {
            interpretation += "Your waist circumference is high and suggests increased health risks for women. ";
            if (activity < 1.725) {
                interpretation += "Low activity level further increases this risk. ";
            }
        } else {
            interpretation += "Your waist circumference appears to be within a healthy range for women. ";
        }
    }

    // BMI interpretation (same as before)
    if (bmi < 18.5) {
        interpretation += "Your BMI indicates you are underweight. ";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        // If the waist part already said 'healthy range', avoid redundancy
        if (!interpretation.includes("healthy range for")) { // Check for either "healthy range for men" or "healthy range for women"
             interpretation += "Your BMI is within a healthy weight range. ";
        }
    } else if (bmi >= 25 && bmi < 29.9) {
        interpretation += "Your BMI indicates you are overweight. ";
    } else { // bmi >= 30
        interpretation += "Your BMI indicates you are obese. ";
    }

    // Add a disclaimer about BMI for muscular individuals
    // This is still important regardless of gender, but threshold might be slightly adjusted for context.
    if (bmi >= 25 && waistInches < 38 && activity >= 1.55) { // Using waistInches for general context here
        interpretation += "Note: BMI may overestimate body fat in athletes and very muscular individuals. Consult a healthcare professional for a more accurate assessment. ";
    }
    
    // Final fallback
    if (interpretation === "") {
        interpretation = "Please re-check your inputs or consult a professional for interpretation.";
    }

    document.getElementById("adv-bmi-interpretation").textContent = interpretation;
       });

}); // End of DOMContentLoaded listener
