// modules/product.js

// Main Product Cipher Function
function encryptProductCipher(plaintext, substitution, transposition, rounds) {
    let current = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const steps = [];

    for (let round = 1; round <= rounds; round++) {
        const beforeSub = current;

        // Apply Substitution
        current = applySubstitution(current, substitution);
        const afterSub = current;

        // Apply Transposition
        current = applyTransposition(current, transposition);
        const afterTrans = current;

        steps.push({
            round: round,
            beforeSubstitution: beforeSub,
            afterSubstitution: afterSub,
            afterTransposition: afterTrans
        });
    }

    return {
        plaintext: plaintext,
        ciphertext: current,
        steps: steps,
        substitution: substitution,
        transposition: transposition,
        rounds: rounds
    };
}

// Main Product Cipher Decryption Function
function decryptProductCipher(ciphertext, substitution, transposition, rounds) {
    let current = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    const steps = [];

    for (let round = rounds; round >= 1; round--) {
        const beforeTransInv = current;

        // Apply Inverse Transposition
        current = applyInverseTransposition(current, transposition);
        const afterTransInv = current;

        // Apply Inverse Substitution
        current = applyInverseSubstitution(current, substitution);
        const afterSubInv = current;

        steps.push({
            round: round,
            beforeTranspositionInverse: beforeTransInv,
            afterTranspositionInverse: afterTransInv,
            afterSubstitutionInverse: afterSubInv
        });
    }

    return {
        ciphertext: ciphertext,
        plaintext: current,
        steps: steps,
        substitution: substitution,
        transposition: transposition,
        rounds: rounds
    };
}

// Apply chosen substitution
function applySubstitution(text, method) {
    switch (method) {
        case 'caesar':
            const shift = parseInt(document.getElementById('caesar-shift').value) || 3;
            return caesarCipher(text, shift).text;

        case 'vigenere':
            const vkey = document.getElementById('vigenere-key').value || 'KEY';
            return vigenereCipher(text, vkey).text;

        case 'monoalphabetic':
            const mkey = document.getElementById('mono-key').value || generateRandomKey();
            return monoalphabeticCipher(text, mkey).text;

        case 'playfair':
            const pkey = document.getElementById('playfair-key').value || 'MONARCHY';
            return playfairCipher(text, pkey).text;

        case 'hill':
            const size = parseInt(document.getElementById('hill-matrix-size').value) || 2;
            const hkey = document.getElementById('hill-key').value || '2,1,1,1';
            return hillCipher(text, parseMatrix(hkey, size)).text;

        case 'otp':
            const otpkey = document.getElementById('otp-key').value || generateRandomOTPKey(text.length);
            return oneTimePad(text, otpkey).text;

        default:
            return text;
    }
}

// Apply chosen transposition
function applyTransposition(text, method) {
    switch (method) {
        case 'railfence':
            const rails = parseInt(document.getElementById('railfence-rails').value) || 3;
            return railFenceCipher(text, rails).text;

        case 'columnar':
            const ckey = document.getElementById('columnar-key').value || 'KEY';
            return columnarCipher(text, ckey).text;

        default:
            return text;
    }
}

// Apply inverse substitution for decryption
function applyInverseSubstitution(text, method) {
    switch (method) {
        case 'caesar':
            const shift = parseInt(document.getElementById('caesar-shift').value) || 3;
            return caesarCipher(text, shift, true).text;

        case 'vigenere':
            const vkey = document.getElementById('vigenere-key').value || 'KEY';
            return vigenereCipher(text, vkey, true).text;

        case 'monoalphabetic':
            const mkey = document.getElementById('mono-key').value || generateRandomKey();
            return monoalphabeticCipher(text, mkey, true).text;

        case 'playfair':
            const pkey = document.getElementById('playfair-key').value || 'MONARCHY';
            return playfairCipher(text, pkey, true).text;

        case 'hill':
            const size = parseInt(document.getElementById('hill-matrix-size').value) || 2;
            const hkey = document.getElementById('hill-key').value || '2,1,1,1';
            return hillCipher(text, parseMatrix(hkey, size), true).text;

        case 'otp':
            const otpkey = document.getElementById('otp-key').value || generateRandomOTPKey(text.length);
            return oneTimePad(text, otpkey, true).text;

        default:
            return text;
    }
}

// Apply inverse transposition for decryption
function applyInverseTransposition(text, method) {
    switch (method) {
        case 'railfence':
            const rails = parseInt(document.getElementById('railfence-rails').value) || 3;
            return railFenceCipher(text, rails, true).text;

        case 'columnar':
            const ckey = document.getElementById('columnar-key').value || 'KEY';
            return columnarCipher(text, ckey, true).text;

        default:
            return text;
    }
}

// Display Result with Excellent Explanation
function displayProductCipherResult(result) {
    const resultDiv = document.getElementById('result-display');

    let html = `
        <div class="result-summary">
            <h3>Product Cipher Result</h3>
            <p><strong>Plaintext:</strong> ${result.plaintext}</p>
            <p><strong>Ciphertext:</strong> <span style="color:#00ff80;font-size:1.3rem;">${result.ciphertext}</span></p>
            <p><strong>Method:</strong> ${getCipherDisplayName(result.substitution)} + ${getCipherDisplayName(result.transposition)}</p>
            <p><strong>Rounds:</strong> ${result.rounds}</p>
        </div>

        <h4>🔍 Detailed Round-by-Round Execution</h4>
    `;

    result.steps.forEach(step => {
        html += `
            <div class="round-card">
                <div class="round-header">Round ${step.round}</div>
                <div class="flow">
                    <div><strong>Input →</strong> ${step.beforeSubstitution}</div>
                    <div class="arrow">Substitution (${getCipherDisplayName(result.substitution)})</div>
                    <div><strong>→</strong> ${step.afterSubstitution}</div>
                    <div class="arrow">Transposition (${getCipherDisplayName(result.transposition)})</div>
                    <div><strong>→ Final for this round:</strong> ${step.afterTransposition}</div>
                </div>
            </div>
        `;
    });

    resultDiv.innerHTML = html;

    // Visualization
    if (typeof createD3ProductCipherVisualization === 'function') {
        createD3ProductCipherVisualization(result);
    }
}

// Product Cipher Avalanche Testing
function testProductCipherAvalanche(plaintext, substitution, transposition, rounds) {
    console.log('testProductCipherAvalanche called with:', { plaintext, substitution, transposition, rounds });
    
    if (!plaintext) {
        console.log('No plaintext provided');
        return { error: 'Please enter plaintext for avalanche test' };
    }
    
    // Create modified plaintext by flipping one bit
    const modifiedPlaintext = flipOneBit(plaintext);
    console.log('Modified plaintext:', modifiedPlaintext);
    
    // Encrypt both original and modified plaintext
    console.log('Encrypting original plaintext...');
    const originalResult = encryptProductCipher(plaintext, substitution, transposition, rounds);
    console.log('Original result:', originalResult);
    
    console.log('Encrypting modified plaintext...');
    const modifiedResult = encryptProductCipher(modifiedPlaintext, substitution, transposition, rounds);
    console.log('Modified result:', modifiedResult);
    
    // Calculate avalanche effect
    const avalanche = calculateProductAvalanche(originalResult.ciphertext, modifiedResult.ciphertext);
    console.log('Avalanche calculation:', avalanche);
    
    const result = {
        originalText: plaintext,
        modifiedText: modifiedPlaintext,
        originalCipher: originalResult.ciphertext,
        modifiedCipher: modifiedResult.ciphertext,
        avalanche: avalanche,
        substitution: substitution,
        transposition: transposition,
        rounds: rounds,
        originalSteps: originalResult.steps,
        modifiedSteps: modifiedResult.steps
    };
    
    console.log('Final avalanche result:', result);
    return result;
}

function flipOneBit(text) {
    if (text.length === 0) return text;
    
    // Convert to binary representation, flip one bit, then convert back
    const textBytes = [];
    for (let i = 0; i < text.length; i++) {
        textBytes.push(text.charCodeAt(i));
    }
    
    // Flip one bit in the first byte
    if (textBytes.length > 0) {
        textBytes[0] ^= 1; // Flip the least significant bit
    }
    
    // Convert back to text
    let modifiedText = '';
    for (const byte of textBytes) {
        modifiedText += String.fromCharCode(byte);
    }
    
    return modifiedText;
}

function calculateProductAvalanche(original, modified) {
    if (original.length !== modified.length) {
        return { percentage: 0, changedBits: 0, totalBits: 0 };
    }
    
    let changedBits = 0;
    let totalBits = 0;
    
    for (let i = 0; i < original.length; i++) {
        const originalByte = original.charCodeAt(i);
        const modifiedByte = modified.charCodeAt(i);
        
        // XOR to find different bits
        let diff = originalByte ^ modifiedByte;
        
        // Count set bits (changed bits)
        while (diff > 0) {
            changedBits += diff & 1;
            diff >>= 1;
        }
        
        totalBits += 8; // 8 bits per character
    }
    
    const percentage = totalBits > 0 ? (changedBits / totalBits * 100) : 0;
    
    return {
        percentage: percentage.toFixed(2),
        changedBits,
        totalBits
    };
}

function displayProductAvalancheResults(result) {
    const resultDiv = document.getElementById('result-display');
    
    if (result.error) {
        resultDiv.innerHTML = `<strong style="color: #ff6b6b;">Error:</strong> ${result.error}`;
        return;
    }
    
    const avalanche = result.avalanche;
    
    resultDiv.innerHTML = `
        <div class="result-summary">
            <h3>Product Cipher Avalanche Test Results</h3>
            <p><strong>Avalanche Percentage:</strong> <span style="color: #00ff80; font-size: 1.3rem;">${avalanche.percentage}%</span></p>
            <p><strong>Changed Bits:</strong> ${avalanche.changedBits} / ${avalanche.totalBits}</p>
            <p><strong>Method:</strong> ${getCipherDisplayName(result.substitution)} + ${getCipherDisplayName(result.transposition)}</p>
            <p><strong>Rounds:</strong> ${result.rounds}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div class="round-card">
                <div class="round-header">Original Plaintext</div>
                <p style="font-family: monospace; color: #80c8ff; word-break: break-all;">${result.originalText}</p>
            </div>
            
            <div class="round-card">
                <div class="round-header">Modified Plaintext (1 bit flipped)</div>
                <p style="font-family: monospace; color: #ff8080; word-break: break-all;">${result.modifiedText}</p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div class="round-card">
                <div class="round-header">Original Ciphertext</div>
                <p style="font-family: monospace; color: #00ff80; word-break: break-all;">${result.originalCipher}</p>
            </div>
            
            <div class="round-card">
                <div class="round-header">Modified Ciphertext</div>
                <p style="font-family: monospace; color: #ff8080; word-break: break-all;">${result.modifiedCipher}</p>
            </div>
        </div>
        
        <div style="background: rgba(0, 120, 255, 0.1); border-radius: 10px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #b0d8ff;">
                <strong>Product Cipher Avalanche Analysis:</strong> 
                ${avalanche.percentage >= 60 ? 
                    'Excellent avalanche effect! Multiple rounds and algorithm combination provide strong diffusion.' : 
                    avalanche.percentage >= 40 ? 
                    'Good avalanche effect. Product cipher provides reasonable diffusion through multiple operations.' : 
                    avalanche.percentage >= 25 ? 
                    'Moderate avalanche effect. Consider increasing rounds or using stronger substitution ciphers.' : 
                    'Weak avalanche effect. Product cipher may need more rounds or different algorithm combinations.'}
            </p>
            <p style="color: #80c8ff; margin-top: 10px; font-size: 0.9rem;">
                <strong>Round-by-Round Analysis:</strong> Each round applies ${getCipherDisplayName(result.substitution)} followed by ${getCipherDisplayName(result.transposition)}, 
                compounding the avalanche effect through ${result.rounds} iterations.
            </p>
        </div>
        
        <h4 style="color: #00d4ff; margin-bottom: 15px;">Detailed Round Comparison</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h5 style="color: #80c8ff; margin-bottom: 10px;">Original Encryption Path</h5>
                ${result.originalSteps.map(step => `
                    <div style="background: rgba(10, 30, 65, 0.95); border: 1px solid rgba(0, 180, 255, 0.3); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                        <div style="color: #80c8ff; font-size: 0.9rem;">
                            <strong>Round ${step.round}:</strong> ${step.beforeSubstitution} 
                            <span style="color: #00ff80;">${step.afterSubstitution}</span> 
                            <span style="color: #00d4ff;">${step.afterTransposition}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div>
                <h5 style="color: #ff8080; margin-bottom: 10px;">Modified Encryption Path</h5>
                ${result.modifiedSteps.map(step => `
                    <div style="background: rgba(10, 30, 65, 0.95); border: 1px solid rgba(255, 128, 128, 0.3); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                        <div style="color: #ff8080; font-size: 0.9rem;">
                            <strong>Round ${step.round}:</strong> ${step.beforeSubstitution} 
                            <span style="color: #ff8080;">${step.afterSubstitution}</span> 
                            <span style="color: #ff8080;">${step.afterTransposition}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Helper function to get cipher display names
function getCipherDisplayName(method) {
    const names = {
        caesar: "Caesar Cipher",
        vigenere: "Vigenère Cipher",
        monoalphabetic: "Monoalphabetic Cipher",
        playfair: "Playfair Cipher",
        hill: "Hill Cipher",
        otp: "One-Time Pad",
        railfence: "Rail Fence Cipher",
        columnar: "Columnar Transposition"
    };
    return names[method] || method;
}

// Display Decryption Result
function displayProductCipherDecryptionResult(result) {
    const resultDiv = document.getElementById('result-display');

    let html = `
        <div class="result-summary">
            <h3>Product Cipher Decryption Result</h3>
            <p><strong>Ciphertext:</strong> ${result.ciphertext}</p>
            <p><strong>Plaintext:</strong> <span style="color:#00ff80;font-size:1.3rem;">${result.plaintext}</span></p>
            <p><strong>Method:</strong> ${getCipherDisplayName(result.substitution)} + ${getCipherDisplayName(result.transposition)}</p>
            <p><strong>Rounds:</strong> ${result.rounds}</p>
        </div>

        <h4>Decryption Process (Reverse Order)</h4>
    `;

    // Display steps in reverse order (from last round to first)
    result.steps.slice().reverse().forEach(step => {
        html += `
            <div class="round-card">
                <div class="round-header">Round ${step.round} (Decryption)</div>
                <div class="flow">
                    <div><strong>Ciphertext Input:</strong> ${step.beforeTranspositionInverse}</div>
                    <div class="arrow">Inverse Transposition (${getCipherDisplayName(result.transposition)})</div>
                    <div><strong>After Inverse Transposition:</strong> ${step.afterTranspositionInverse}</div>
                    <div class="arrow">Inverse Substitution (${getCipherDisplayName(result.substitution)})</div>
                    <div><strong>Output for this round:</strong> ${step.afterSubstitutionInverse}</div>
                </div>
            </div>
        `;
    });

    resultDiv.innerHTML = html;

    // Visualization
    if (typeof createD3ProductCipherVisualization === 'function') {
        createD3ProductCipherVisualization(result);
    }
}

// Export functions so main script can use them
window.encryptProductCipher = encryptProductCipher;
window.decryptProductCipher = decryptProductCipher;
window.displayProductCipherResult = displayProductCipherResult;
window.displayProductCipherDecryptionResult = displayProductCipherDecryptionResult;
window.testProductCipherAvalanche = testProductCipherAvalanche;
window.displayProductAvalancheResults = displayProductAvalancheResults;
window.getCipherDisplayName = getCipherDisplayName;