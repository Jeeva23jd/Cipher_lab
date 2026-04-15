// modules/playfair.js - Playfair Cipher Module

function generatePlayfairMatrix(key) {
    const cleaned = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const seen = new Set();
    const keyChars = [];

    for (let char of cleaned) {
        if (!seen.has(char)) {
            keyChars.push(char);
            seen.add(char);
        }
    }

    for (let i = 65; i <= 90; i++) {
        const c = String.fromCharCode(i);
        if (c !== 'J' && !seen.has(c)) {
            keyChars.push(c);
            seen.add(c);
        }
    }

    const matrix = [];
    for (let i = 0; i < 5; i++) {
        matrix.push(keyChars.slice(i * 5, i * 5 + 5));
    }
    return matrix;
}

function playfairCipher(text, key, decrypt = false) {
    const matrix = generatePlayfairMatrix(key);
    let prepared = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const pairs = [];

    // Create pairs
    for (let i = 0; i < prepared.length; i += 2) {
        let a = prepared[i];
        let b = prepared[i + 1];
        
        if (!b) {
            b = 'Z'; // Add Z if odd length
        } else if (a === b) {
            b = 'X'; // Insert X between same letters
            i--; // Re-process this character
        }
        
        pairs.push([a, b]);
    }

    let result = '';
    
    // Helper function to find position in matrix
    function findPosition(char) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (matrix[row][col] === char) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    pairs.forEach(pair => {
        const [a, b] = pair;
        const posA = findPosition(a);
        const posB = findPosition(b);
        
        if (!posA || !posB) {
            result += a + b; // Fallback for safety
            return;
        }

        let newA, newB;

        if (posA.row === posB.row) {
            // Same row - move right (or left for decrypt)
            const direction = decrypt ? -1 : 1;
            newA = matrix[posA.row][(posA.col + direction + 5) % 5];
            newB = matrix[posB.row][(posB.col + direction + 5) % 5];
        } else if (posA.col === posB.col) {
            // Same column - move down (or up for decrypt)
            const direction = decrypt ? -1 : 1;
            newA = matrix[(posA.row + direction + 5) % 5][posA.col];
            newB = matrix[(posB.row + direction + 5) % 5][posB.col];
        } else {
            // Rectangle - swap columns
            newA = matrix[posA.row][posB.col];
            newB = matrix[posB.row][posA.col];
        }

        result += newA + newB;
    });

    return { text: result, matrix: matrix };
}

function displayPlayfairResult(result, text, key, decrypt = false) {
    const resultDiv = document.getElementById('playfair-result');
    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    resultDiv.innerHTML = `<strong>${operation}:</strong> <span style="color:#00ff80;">${result.text}</span>`;

    // Add matrix display
    if (result.matrix && result.matrix.length > 0) {
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'matrix-display';
        matrixDiv.innerHTML = `
            <h4>🔤 Playfair Matrix (Key: ${key})</h4>
            <div class="matrix-grid">
                ${result.matrix.map(row => 
                    `<div class="matrix-row">
                        ${row.map(char => 
                            `<span class="matrix-cell">${char}</span>`
                        ).join('')}
                    </div>`
                ).join('')}
            </div>
        `;
        resultDiv.appendChild(matrixDiv);
    }
}

window.playfairCipher = playfairCipher;
window.displayPlayfairResult = displayPlayfairResult;