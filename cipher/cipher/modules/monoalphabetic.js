// modules/monoalphabetic.js - Monoalphabetic Cipher Module

function generateRandomKey() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').sort(() => Math.random() - 0.5).join('');
}

function monoalphabeticCipher(text, key, decrypt = false) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');

    if (keyUpper.length !== 26) {
        return { text: text, valid: false };
    }

    let result = '';
    const steps = [];

    if (decrypt) {
        // Decryption: reverse mapping
        const reverseMap = {};
        for (let i = 0; i < 26; i++) {
            reverseMap[keyUpper[i]] = alphabet[i];
        }
        for (let char of text) {
            if (/[A-Z]/.test(char)) {
                const mapped = reverseMap[char] || char;
                result += mapped;
                steps.push({ original: char, mapped: mapped });
            } else {
                result += char;
            }
        }
    } else {
        // Encryption
        for (let char of text) {
            if (/[A-Z]/.test(char)) {
                const idx = char.charCodeAt(0) - 65;
                const mapped = keyUpper[idx] || char;
                result += mapped;
                steps.push({ original: char, mapped: mapped });
            } else {
                result += char;
            }
        }
    }

    return { text: result, key: keyUpper, steps: steps, valid: true };
}

function displayMonoResult(result, text, key, decrypt = false) {
    const resultDiv = document.getElementById('mono-result');
    const vizDiv = document.getElementById('mono-mapping');

    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    resultDiv.innerHTML = `<strong>${operation}:</strong> <span style="color:#00ff80; font-weight:bold;">${result.text}</span>`;

    if (!result.valid) {
        vizDiv.innerHTML = `<p style="color:red;">Invalid key! Must be exactly 26 unique letters.</p>`;
        return;
    }

    let html = `
        <h4>Monoalphabetic Cipher Algorithm</h4>
        <div class="math-formula">
            Each letter is replaced according to a fixed permutation (key).<br>
            Key: ${result.key}
        </div>
    `;

    vizDiv.innerHTML = html;
}

window.monoalphabeticCipher = monoalphabeticCipher;
window.displayMonoResult = displayMonoResult;
window.generateRandomKey = generateRandomKey;