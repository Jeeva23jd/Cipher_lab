// modules/caesar.js - Caesar Cipher Module

function caesarCipher(text, shift, decrypt = false) {
    const actualShift = decrypt ? -shift : shift;
    const steps = [];

    const result = text.replace(/[A-Z]/g, char => {
        const p = char.charCodeAt(0) - 65;
        let c = (p + actualShift + 26 * 10) % 26; // +26*10 to handle negative safely
        const resultChar = String.fromCharCode(c + 65);

        steps.push({
            original: char,
            position: p,
            shift: actualShift,
            result: resultChar,
            formula: decrypt ? 
                `(${p} - ${shift} + 26) % 26 = ${c}` : 
                `(${p} + ${shift}) % 26 = ${c}`
        });

        return resultChar;
    });

    return { text: result, steps: steps };
}

function displayCaesarResult(result, text, shift, decrypt = false) {
    const resultDiv = document.getElementById('caesar-result');
    const vizDiv = document.getElementById('caesar-alphabet-map');

    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    resultDiv.innerHTML = `<strong>${operation}:</strong> <span style="color:#00ff80; font-weight:bold;">${result.text}</span>`;

    let html = `
        <h4>Caesar Cipher Algorithm</h4>
        <div class="math-formula">
            Encryption: C = (P + k) mod 26<br>
            Decryption: P = (C - k + 26) mod 26<br>
            Shift (k) = ${shift}
        </div>
        <p>Each letter in the alphabet is shifted by ${shift} positions.</p>
    `;

    vizDiv.innerHTML = html;

    // Call visualization if available
    if (typeof createD3CaesarVisualization === 'function') {
        createD3CaesarVisualization(shift, text, result.text);
    }
}

// Export to global scope
window.caesarCipher = caesarCipher;
window.displayCaesarResult = displayCaesarResult;