// modules/columnar.js - Columnar Transposition Module

function columnarCipher(text, key, decrypt = false) {
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!keyUpper) return { text: text };

    if (decrypt) {
        return decryptColumnar(text, keyUpper);
    }
    return encryptColumnar(text.toUpperCase().replace(/[^A-Z]/g, ''), keyUpper);
}

function encryptColumnar(msg, key) {
    const col = key.length;
    const row = Math.ceil(msg.length / col);
    const msgLst = msg.split('');
    while (msgLst.length < row * col) msgLst.push('_');

    const matrix = [];
    for (let i = 0; i < msgLst.length; i += col) {
        matrix.push(msgLst.slice(i, i + col));
    }

    const keyLst = key.split('').sort();
    let cipher = '';
    for (let k of keyLst) {
        const idx = key.indexOf(k);
        for (let r of matrix) {
            cipher += r[idx];
        }
    }

    return { text: cipher, matrix: matrix, key: key };
}

function decryptColumnar(cipher, key) {
    const col = key.length;
    const row = Math.ceil(cipher.length / col);
    const keyLst = key.split('').sort();
    const matrix = Array.from({ length: row }, () => Array(col).fill(null));

    let idx = 0;
    for (let k of keyLst) {
        const colIdx = key.indexOf(k);
        for (let r = 0; r < row; r++) {
            matrix[r][colIdx] = cipher[idx++];
        }
    }

    let result = matrix.flat().join('').replace(/_+$/, '');
    return { text: result, matrix: matrix, key: key };
}

function displayColumnarResult(result, text, key, decrypt = false) {
    const resultDiv = document.getElementById('col-result');
    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    resultDiv.innerHTML = `<strong>${operation}:</strong> <span style="color:#00ff80;">${result.text}</span>`;

    if (typeof createD3ColumnarVisualization === 'function') {
        createD3ColumnarVisualization(key, text, result.text);
    }
}

window.columnarCipher = columnarCipher;
window.displayColumnarResult = displayColumnarResult;