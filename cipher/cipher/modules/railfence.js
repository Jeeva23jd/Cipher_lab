// modules/railfence.js

function railFenceCipher(text, rails, decrypt = false) {
    if (decrypt) return decryptRailFence(text, rails);

    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const fence = Array.from({length: rails}, () => []);
    let rail = 0, direction = 1;

    for (let char of cleanText) {
        fence[rail].push(char);
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }

    const result = fence.flat().join('');

    return { text: result, rails: rails, originalText: cleanText };
}

function decryptRailFence(ciphertext, rails) {
    const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    if (rails <= 1 || rails >= cleanText.length) return { text: cleanText, rails: rails };
    
    // Create the fence pattern
    const fence = Array.from({length: rails}, () => []);
    let rail = 0, direction = 1;
    
    // Mark positions in the fence
    for (let i = 0; i < cleanText.length; i++) {
        fence[rail].push(i);
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }
    
    // Fill the fence with ciphertext
    let textIndex = 0;
    for (let r = 0; r < rails; r++) {
        for (let i = 0; i < fence[r].length; i++) {
            fence[r][i] = cleanText[textIndex++];
        }
    }
    
    // Read the fence in zigzag pattern
    let result = '';
    rail = 0;
    direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
        result += fence[rail].shift();
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }
    
    return { text: result, rails: rails, originalText: ciphertext };
}

function displayRailResult(result, text, rails, decrypt = false) {
    const resultDiv = document.getElementById('rail-result');
    resultDiv.innerHTML = `<strong>${decrypt ? 'Decrypted' : 'Encrypted'}:</strong> <span style="color:#00ff80;">${result.text}</span>`;

    if (typeof createD3RailFenceVisualization === 'function') {
        createD3RailFenceVisualization(rails, text, result.text);
    }
}

window.railFenceCipher = railFenceCipher;
window.displayRailResult = displayRailResult;