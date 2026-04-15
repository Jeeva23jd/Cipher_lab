// modules/otp.js - One-Time Pad (Unbreakable when used correctly)

function generateRandomOTPKey(length) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return key;
}

function oneTimePad(text, key, decrypt = false) {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');

    if (cleanText.length !== cleanKey.length) {
        return { 
            error: "Key must be same length as plaintext", 
            text: "" 
        };
    }

    let result = '';
    const steps = [];

    for (let i = 0; i < cleanText.length; i++) {
        const p = cleanText.charCodeAt(i) - 65;
        const k = cleanKey.charCodeAt(i) - 65;

        let c;
        if (decrypt) {
            c = (p - k + 26) % 26;
        } else {
            c = (p + k) % 26;
        }

        result += String.fromCharCode(c + 65);

        steps.push({
            position: i + 1,
            original: cleanText[i],
            keyChar: cleanKey[i],
            value: decrypt ? p : c,
            formula: decrypt ? 
                `(${p} - ${k} + 26) % 26 = ${c}` : 
                `(${p} + ${k}) % 26 = ${c}`
        });
    }

    return { text: result, steps: steps };
}

function displayOTPResult(result, text, key, decrypt = false) {
    const resultDiv = document.getElementById('otp-result');
    const vizDiv = document.getElementById('otp-visualization');

    if (result.error) {
        resultDiv.innerHTML = `<p style="color: red;">${result.error}</p>`;
        return;
    }

    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    resultDiv.innerHTML = `<strong>${operation}:</strong> <span style="color:#00ff80; font-weight:bold;">${result.text}</span>`;

    // Enhanced visualization with step-by-step breakdown
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanCipher = result.text.toUpperCase().replace(/[^A-Z]/g, '');
    
    let html = `<div class="otp-summary">`;
    html += `<h4>🔐 One-Time Pad ${operation}</h4>`;
    html += `<div class="otp-details">`;
    html += `<p><strong>Input Validation:</strong> ${cleanText.length === cleanKey.length ? '✅ Key length matches text length' : '❌ Key length mismatch - OTP requires same length'}</p>`;
    html += `<p><strong>Text Length:</strong> ${cleanText.length} characters</p>`;
    html += `<p><strong>Key Length:</strong> ${cleanKey.length} characters</p>`;
    html += `</div>`;
    html += `</div>`;
    
    vizDiv.innerHTML = html;
}

window.oneTimePad = oneTimePad;
window.displayOTPResult = displayOTPResult;
window.generateRandomOTPKey = generateRandomOTPKey;