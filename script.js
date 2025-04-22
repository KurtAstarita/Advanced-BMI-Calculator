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

    if (waist > 102 && activity < 1.725) {
        interpretation += "High waist circumference and low activity suggest increased health risks. ";
    } else if (waist > 88 && activity < 1.725) {
        interpretation += "High waist circumference and low activity suggest increased health risks. ";
    }

    if (bmi >= 25) {
        interpretation += "BMI indicates potential overweight or obesity. ";
    }

    if (interpretation === "") {
        interpretation = "BMI and waist circumference suggest a healthy range. ";
    }

    document.getElementById("adv-bmi-interpretation").textContent = interpretation;
});
