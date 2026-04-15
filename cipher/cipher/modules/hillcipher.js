// modules/hill.js - Hill Cipher Module

// Modular arithmetic helper functions
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null; // No inverse exists
}

function determinant(matrix, size) {
    if (size === 1) return matrix[0][0];
    if (size === 2) return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
    
    // For larger matrices (3x3 and above)
    let det = 0;
    for (let j = 0; j < size; j++) {
        let minor = [];
        for (let i = 1; i < size; i++) {
            let row = [];
            for (let k = 0; k < size; k++) {
                if (k !== j) row.push(matrix[i][k]);
            }
            minor.push(row);
        }
        det += (j % 2 === 0 ? 1 : -1) * matrix[0][j] * determinant(minor, size - 1);
    }
    return ((det % 26) + 26) % 26;
}

function inverseMatrix(matrix, size) {
    const det = determinant(matrix, size);
    const detInv = modInverse(det, 26);
    
    if (!detInv) {
        return null; // Matrix is not invertible modulo 26
    }
    
    if (size === 1) {
        return [[detInv]];
    }
    
    if (size === 2) {
        const inv = [
            [(matrix[1][1] * detInv) % 26, ((-matrix[0][1] * detInv) % 26 + 26) % 26],
            [((-matrix[1][0] * detInv) % 26 + 26) % 26, (matrix[0][0] * detInv) % 26]
        ];
        return inv;
    }
    
    // For larger matrices - calculate adjugate matrix
    const adjugate = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // Calculate minor
            const minor = [];
            for (let mi = 0; mi < size; mi++) {
                if (mi === i) continue;
                const minorRow = [];
                for (let mj = 0; mj < size; mj++) {
                    if (mj === j) continue;
                    minorRow.push(matrix[mi][mj]);
                }
                minor.push(minorRow);
            }
            const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor, size - 1);
            row.push(((cofactor * detInv) % 26 + 26) % 26);
        }
        adjugate.push(row);
    }
    
    return adjugate;
}

function matrixMultiply(matrix, vector, size) {
    const result = [];
    for (let i = 0; i < size; i++) {
        let sum = 0;
        for (let j = 0; j < size; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push(sum % 26);
    }
    return result;
}

function parseMatrix(input, size) {
    const values = input.split(',').map(v => parseInt(v.trim()));
    if (values.length !== size * size) return null;
    
    // Apply modulo 26 to all values
    const modValues = values.map(v => ((v % 26) + 26) % 26);
    
    const matrix = [];
    for (let i = 0; i < size; i++) {
        matrix.push(modValues.slice(i * size, (i + 1) * size));
    }
    return matrix;
}

function hillCipher(text, keyMatrix, decrypt = false) {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanText) {
        return { text: '', error: 'No valid text to process' };
    }
    
    const size = keyMatrix.length;
    
    // For decryption, we need the inverse matrix
    const matrix = decrypt ? inverseMatrix(keyMatrix, size) : keyMatrix;
    if (!matrix) {
        return { text: '', error: 'Matrix is not invertible (determinant has no inverse modulo 26)' };
    }
    
    // Pad text if necessary
    const paddedText = cleanText.padEnd(Math.ceil(cleanText.length / size) * size, 'X');
    
    let result = '';
    const steps = [];
    
    // Process text in blocks
    for (let i = 0; i < paddedText.length; i += size) {
        const block = paddedText.substr(i, size);
        
        // Convert letters to numbers (A=0, B=1, ..., Z=25)
        const vector = block.split('').map(char => char.charCodeAt(0) - 65);
        
        // Matrix multiplication
        const resultVector = matrixMultiply(matrix, vector, size);
        
        // Convert back to letters
        const blockResult = resultVector.map(num => String.fromCharCode(num + 65)).join('');
        result += blockResult;
        
        steps.push({
            input: block,
            vector: vector,
            resultVector: resultVector,
            output: blockResult,
            matrix: decrypt ? 'Inverse Matrix' : 'Key Matrix'
        });
    }
    
    return { 
        text: result, 
        steps: steps,
        matrix: matrix,
        size: size
    };
}

function displayHillResult(result, text, keyMatrix, decrypt = false) {
    const resultDiv = document.getElementById('hill-result');
    const operation = decrypt ? 'Decrypted' : 'Encrypted';
    
    if (result.error) {
        resultDiv.innerHTML = `<strong style="color: #ff6b6b;">Error:</strong> ${result.error}`;
        return;
    }
    
    let html = `<strong>${operation}:</strong> <span style="color:#00ff80;font-size:1.2rem;">${result.text}</span>`;
    
    if (result.steps && result.steps.length > 0) {
        html += '<div style="margin-top: 15px;">';
        html += '<h5 style="color: #00d4ff;">Detailed Steps:</h5>';
        
        result.steps.forEach((step, index) => {
            html += `
                <div style="margin: 10px 0; padding: 10px; background: rgba(0, 120, 255, 0.1); border-radius: 8px;">
                    <div><strong>Block ${index + 1}:</strong> ${step.input}</div>
                    <div><strong>Numeric Vector:</strong> [${step.vector.join(', ')}]</div>
                    <div><strong>Result Vector:</strong> [${step.resultVector.join(', ')}]</div>
                    <div><strong>Output:</strong> ${step.output}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    resultDiv.innerHTML = html;
}

// Export functions
window.hillCipher = hillCipher;
window.displayHillResult = displayHillResult;
window.parseMatrix = parseMatrix;