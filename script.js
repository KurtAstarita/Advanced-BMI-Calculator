// script.js

document.getElementById('calculate-adv-bmi').addEventListener('click', function () {
    const height = parseFloat(document.getElementById('height-adv').value);
    const heightUnit = document.getElementById('height-unit-adv').value;
    const weight = parseFloat(document.getElementById('weight-adv').value);
    const weightUnit = document.getElementById('weight-unit-adv').value;
    const waist = parseFloat(document.getElementById('waist-adv').value);
    const waistUnit = document.getElementById('waist-unit-adv').value;
    const activity = parseFloat(document.getElementById('activity-adv').value);
    const gender = document.getElementById('gender-adv').value;

    if (isNaN(height) || isNaN(weight) || isNaN(waist)) {
        displayResult('Please enter valid numbers for height, weight, and waist.', '');
        return;
    }

    // Unit conversions
    const heightCm = heightUnit === 'inches' ? height * 2.54 : height;
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const waistCm = waistUnit === 'inches' ? waist * 2.54 : waist;

    // BMI calculation
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Waist-to-height ratio
    const whtr = waistCm / heightCm;

    // Adjusted BMI factoring in WHtR
    let adjustedBMI = bmi;
    if (whtr > 0.5) adjustedBMI += 1.5;
    if (whtr < 0.4) adjustedBMI -= 1.0;

    let interpretation = '';
    if (adjustedBMI < 18.5) {
        interpretation = 'Underweight';
    } else if (adjustedBMI < 24.9) {
        interpretation = 'Normal weight';
    } else if (adjustedBMI < 29.9) {
        interpretation = 'Overweight';
    } else {
        interpretation = 'Obese';
    }

    displayResult(
        `Adjusted BMI: ${adjustedBMI.toFixed(1)} (includes waist-to-height ratio)`,
        `Interpretation: ${interpretation}`
    );
});

function displayResult(bmiText, interpretationText) {
    document.getElementById('adv-bmi-result').textContent = bmiText;
    document.getElementById('adv-bmi-interpretation').textContent = interpretationText;
}
