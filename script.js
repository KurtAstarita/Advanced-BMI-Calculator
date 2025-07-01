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
    const bodyFatInput = document.getElementById('bodyfat-adv');
    const bodyFat = bodyFatInput ? parseFloat(bodyFatInput.value) : null;

    if (isNaN(height) || isNaN(weight) || isNaN(waist)) {
        displayResult('Please enter valid numbers for height, weight, and waist.', '');
        return;
    }

    const heightCm = heightUnit === 'inches' ? height * 2.54 : height;
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const waistCm = waistUnit === 'inches' ? waist * 2.54 : waist;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    const whtr = waistCm / heightCm;

    let whtrAdjustment = (whtr - 0.5) * 10;
    whtrAdjustment = Math.max(Math.min(whtrAdjustment, 3), -2);

    let adjustedBMI = bmi + whtrAdjustment;

    if (!isNaN(bodyFat) && bodyFat > 0 && bodyFat < 70) {
        const bfAdjustment = (bodyFat - 18) / 10;
        adjustedBMI += bfAdjustment;
    }

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

    let advisory = '';
    if (adjustedBMI >= 25 && whtr < 0.52 && (isNaN(bodyFat) || bodyFat < 18)) {
        advisory = 'Note: Your BMI is high, but your waist-to-height ratio and/or body fat percentage suggest you may have high muscle mass rather than excess fat.';
    }

    if (adjustedBMI >= 25 && activity >= 1.55 && (whtr < 0.52 || (!isNaN(bodyFat) && bodyFat < 18))) {
        advisory += (advisory ? ' ' : '') + 'Your high activity level may also indicate greater lean mass.';
    }

    let resultText = `Raw BMI: ${bmi.toFixed(1)}, Adjusted BMI: ${adjustedBMI.toFixed(1)} (WHtR: ${whtr.toFixed(2)})`;
    if (!isNaN(bodyFat)) {
        resultText += `, Body Fat %: ${bodyFat.toFixed(1)}`;
    }

    displayResult(
        resultText,
        `Interpretation: ${interpretation}${advisory ? ' \n' + advisory : ''}`
    );
});

function displayResult(bmiText, interpretationText) {
    document.getElementById('adv-bmi-result').textContent = bmiText;
    document.getElementById('adv-bmi-interpretation').textContent = interpretationText;
}
