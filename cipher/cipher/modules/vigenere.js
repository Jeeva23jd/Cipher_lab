// modules/vigenere.js - Vigenère Cipher Module

function vigenereCipher(text, key, decrypt = false) {
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!keyUpper) return { text: text, steps: [] };

    let result = '';
    const steps = [];
    let keyIndex = 0;

    const repeatedKey = text.split('').map(char => {
        if (/[A-Z]/.test(char)) {
            const k = keyUpper[keyIndex % keyUpper.length];
            keyIndex++;
            return k;
        }
        return ' ';
    }).join('');

    keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Z]/.test(char)) {
            const p = char.charCodeAt(0) - 65;
            const k = repeatedKey[i].charCodeAt(0) - 65;
            let c = decrypt ? (p - k + 26) % 26 : (p + k) % 26;
            const resultChar = String.fromCharCode(c + 65);

            result += resultChar;

            steps.push({
                position: i + 1,
                original: char,
                keyChar: repeatedKey[i],
                p: p,
                k: k,
                c: c,
                result: resultChar,
                formula: decrypt ? `(${p} - ${k} + 26) % 26 = ${c}` : `(${p} + ${k}) % 26 = ${c}`
            });
        } else {
            result += char;
        }
    }

    return { text: result, steps: steps, repeatedKey: repeatedKey };
}

function displayVigenereResult(result, text, key, decrypt = false) {
    const resultDiv = document.getElementById('vigenere-result');
    const vizDiv = document.getElementById('vigenere-visualization');

    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    resultDiv.innerHTML = `<strong>${operation}:</strong> <span style="color:#00ff80; font-weight:bold;">${result.text}</span>`;

    if (typeof createD3VigenereVisualization === 'function') {
        createD3VigenereVisualization(key, text, result.text);
    }
}

window.vigenereCipher = vigenereCipher;
window.displayVigenereResult = displayVigenereResult;