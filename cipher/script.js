// script.js - Main File

// Enhanced Output Display Helper
function createEnhancedOutput(type, content, metadata = {}) {
    const container = document.createElement('div');
    container.className = `output-container output-type-${type} fade-in`;
    
    const header = document.createElement('div');
    header.className = 'output-header';
    
    const label = document.createElement('div');
    label.className = 'output-label';
    
    const icon = document.createElement('div');
    icon.className = 'output-icon';
    icon.textContent = type === 'encrypted' ? '🔒' : '🔓';
    
    const labelText = document.createElement('span');
    labelText.textContent = type === 'encrypted' ? 'Encrypted' : 'Decrypted';
    
    label.appendChild(icon);
    label.appendChild(labelText);
    header.appendChild(label);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'output-content';
    contentDiv.textContent = content;
    
    container.appendChild(header);
    container.appendChild(contentDiv);
    
    if (Object.keys(metadata).length > 0) {
        const metaDiv = document.createElement('div');
        metaDiv.className = 'output-meta';
        
        Object.entries(metadata).forEach(([key, value]) => {
            const metaItem = document.createElement('div');
            metaItem.className = 'output-meta-item';
            metaItem.textContent = `${key}: ${value}`;
            metaDiv.appendChild(metaItem);
        });
        
        container.appendChild(metaDiv);
    }
    
    return container;
}

document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupProductCipher();

    // Setup individual ciphers
    setupCaesarCipher();
    setupVigenereCipher();
    setupMonoalphabeticCipher();
    setupRailFenceCipher();
    setupPlayfairCipher();
    setupHillCipher();
    setupOneTimePadCipher();
    setupColumnarCipher();
});

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const pageId = link.dataset.page + '-page';
            const page = document.getElementById(pageId);
            if (page) page.classList.add('active');
        });
    });
}

function setupProductCipher() {
    // Setup cipher method change listeners
    document.getElementById('substitution')?.addEventListener('change', showHideKeyFields);
    document.getElementById('transposition')?.addEventListener('change', showHideKeyFields);
    
    // Initial setup
    showHideKeyFields();
    
    document.getElementById('encrypt-btn')?.addEventListener('click', () => {
        const plaintext = document.getElementById('plaintext').value.trim();
        if (!plaintext) return alert("Please enter plaintext");

        const substitution = document.getElementById('substitution').value;
        const transposition = document.getElementById('transposition').value;
        const rounds = parseInt(document.getElementById('rounds').value) || 1;

        const result = encryptProductCipher(plaintext, substitution, transposition, rounds);
        displayProductCipherResult(result);
        // Add animated D3 visualization
        if (typeof createAnimatedProductCipherVisualization === 'function') {
            createAnimatedProductCipherVisualization(result);
        }
    });

    document.getElementById('decrypt-btn')?.addEventListener('click', () => {
        const ciphertext = document.getElementById('plaintext').value.trim();
        if (!ciphertext) return alert("Please enter ciphertext to decrypt");

        const substitution = document.getElementById('substitution').value;
        const transposition = document.getElementById('transposition').value;
        const rounds = parseInt(document.getElementById('rounds').value) || 1;

        const result = decryptProductCipher(ciphertext, substitution, transposition, rounds);
        displayProductCipherDecryptionResult(result);
        // Add animated D3 visualization for decryption
        if (typeof createAnimatedProductCipherVisualization === 'function') {
            createAnimatedProductCipherVisualization(result);
        }
    });

    document.getElementById('avalanche-btn')?.addEventListener('click', () => {
        console.log('Avalanche button clicked!');
        
        const plaintext = document.getElementById('plaintext').value.trim();
        console.log('Plaintext:', plaintext);
        
        if (!plaintext) return alert("Please enter plaintext");

        const substitution = document.getElementById('substitution').value;
        const transposition = document.getElementById('transposition').value;
        const rounds = parseInt(document.getElementById('rounds').value) || 1;
        
        console.log('Cipher settings:', { substitution, transposition, rounds });
        console.log('testProductCipherAvalanche function:', typeof testProductCipherAvalanche);
        console.log('displayProductAvalancheResults function:', typeof displayProductAvalancheResults);

        try {
            const avalancheResult = testProductCipherAvalanche(plaintext, substitution, transposition, rounds);
            console.log('Avalanche result:', avalancheResult);
            displayProductAvalancheResults(avalancheResult);
        } catch (error) {
            console.error('Avalanche test error:', error);
            alert('Error during avalanche test: ' + error.message);
        }
    });
}

function showHideKeyFields() {
    // Hide all key groups first
    document.querySelectorAll('[id$="-key-group"], [id$="-rails-group"]').forEach(group => {
        group.style.display = 'none';
    });
    
    // Show relevant key groups based on selection
    const substitution = document.getElementById('substitution').value;
    const transposition = document.getElementById('transposition').value;
    
    // Show substitution key groups
    switch(substitution) {
        case 'caesar':
            document.getElementById('caesar-key-group').style.display = 'block';
            break;
        case 'vigenere':
            document.getElementById('vigenere-key-group').style.display = 'block';
            break;
        case 'monoalphabetic':
            document.getElementById('mono-key-group').style.display = 'block';
            break;
        case 'playfair':
            document.getElementById('playfair-key-group').style.display = 'block';
            break;
        case 'hill':
            document.getElementById('hill-key-group').style.display = 'block';
            break;
        case 'otp':
            document.getElementById('otp-key-group').style.display = 'block';
            break;
    }
    
    // Show transposition key groups
    switch(transposition) {
        case 'railfence':
            document.getElementById('railfence-rails-group').style.display = 'block';
            break;
        case 'columnar':
            document.getElementById('columnar-key-group').style.display = 'block';
            break;
    }
}

function setupCaesarCipher() {
    document.getElementById('caesar-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('caesar-input').value.trim();
        const shift = parseInt(document.getElementById('caesar-shift-input').value) || 3;
        if (!text) return alert("Please enter text");
        const result = caesarCipher(text, shift);
        displayCaesarResult(result, text, shift);
        // Add D3 visualization
        if (typeof createD3CaesarVisualization === 'function') {
            createD3CaesarVisualization(shift, text, result.text);
        }
    });
    
    document.getElementById('caesar-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('caesar-input').value.trim();
        const shift = parseInt(document.getElementById('caesar-shift-input').value) || 3;
        if (!text) return alert("Please enter text");
        const result = caesarCipher(text, shift, true);
        displayCaesarResult(result, text, shift, true);
        // Add D3 visualization
        if (typeof createD3CaesarVisualization === 'function') {
            createD3CaesarVisualization(shift, result.text, text);
        }
    });
}

function setupVigenereCipher() {
    document.getElementById('vigenere-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('vigenere-input').value.trim();
        const key = document.getElementById('vigenere-key-input').value || 'KEY';
        if (!text) return alert("Please enter text");
        const result = vigenereCipher(text, key);
        displayVigenereResult(result, text, key);
        // Add D3 visualization
        if (typeof createD3VigenereVisualization === 'function') {
            createD3VigenereVisualization(key, text, result.text);
        }
    });
    
    document.getElementById('vigenere-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('vigenere-input').value.trim();
        const key = document.getElementById('vigenere-key-input').value || 'KEY';
        if (!text) return alert("Please enter text");
        const result = vigenereCipher(text, key, true);
        displayVigenereResult(result, text, key, true);
        // Add D3 visualization
        if (typeof createD3VigenereVisualization === 'function') {
            createD3VigenereVisualization(key, result.text, text);
        }
    });
}

function setupMonoalphabeticCipher() {
    document.getElementById('mono-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('mono-input').value.trim();
        const key = document.getElementById('mono-key-input').value || 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
        if (!text) return alert("Please enter text");
        const result = monoalphabeticCipher(text, key);
        const resultDiv = document.getElementById('mono-result');
        resultDiv.innerHTML = '';
        resultDiv.appendChild(createEnhancedOutput('encrypted', result.text, {Key: key}));
        // Add D3 visualization
        if (typeof createD3MonoalphabeticVisualization === 'function') {
            createD3MonoalphabeticVisualization(key, text, result.text);
        }
    });
    
    document.getElementById('mono-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('mono-input').value.trim();
        const key = document.getElementById('mono-key-input').value || 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
        if (!text) return alert("Please enter text");
        const result = monoalphabeticCipher(text, key, true);
        const resultDiv = document.getElementById('mono-result');
        resultDiv.innerHTML = '';
        resultDiv.appendChild(createEnhancedOutput('decrypted', result.text, {Key: key}));
        // Add D3 visualization
        if (typeof createD3MonoalphabeticVisualization === 'function') {
            createD3MonoalphabeticVisualization(key, result.text, text);
        }
    });
    
    // Add generate key button functionality
    document.getElementById('mono-generate-key-btn')?.addEventListener('click', () => {
        const randomKey = generateRandomKey();
        document.getElementById('mono-key-input').value = randomKey;
    });
}

function setupPlayfairCipher() {
    document.getElementById('playfair-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('playfair-input').value.trim();
        const key = document.getElementById('playfair-key-input').value || 'MONARCHY';
        if (!text) return alert("Please enter text");
        const result = playfairCipher(text, key);
        displayPlayfairResult(result, text, key);
        // Add D3 visualization
        if (typeof createD3PlayfairVisualization === 'function') {
            createD3PlayfairVisualization(key, result.matrix);
        }
    });
    
    document.getElementById('playfair-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('playfair-input').value.trim();
        const key = document.getElementById('playfair-key-input').value || 'MONARCHY';
        if (!text) return alert("Please enter text");
        const result = playfairCipher(text, key, true);
        displayPlayfairResult(result, text, key, true);
        // Add D3 visualization
        if (typeof createD3PlayfairVisualization === 'function') {
            createD3PlayfairVisualization(key, result.matrix);
        }
    });
}

function setupHillCipher() {
    document.getElementById('hill-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('hill-input').value.trim();
        const size = parseInt(document.getElementById('hill-matrix-size-input').value) || 2;
        const keyStr = document.getElementById('hill-key-input').value || '2,1,1,1';
        const keyMatrix = parseMatrix(keyStr, size);
        if (!text) return alert("Please enter text");
        if (!keyMatrix) return alert("Invalid key matrix");
        const result = hillCipher(text, keyMatrix);
        displayHillResult(result, text, keyMatrix);
        // Add D3 visualization
        if (typeof createD3HillVisualization === 'function') {
            createD3HillVisualization(keyMatrix, text, result.text);
        }
    });
    
    document.getElementById('hill-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('hill-input').value.trim();
        const size = parseInt(document.getElementById('hill-matrix-size-input').value) || 2;
        const keyStr = document.getElementById('hill-key-input').value || '2,1,1,1';
        const keyMatrix = parseMatrix(keyStr, size);
        if (!text) return alert("Please enter text");
        if (!keyMatrix) return alert("Invalid key matrix");
        const result = hillCipher(text, keyMatrix, true);
        displayHillResult(result, text, keyMatrix, true);
        // Add D3 visualization
        if (typeof createD3HillVisualization === 'function') {
            createD3HillVisualization(keyMatrix, result.text, text);
        }
    });
}

function setupOneTimePadCipher() {
    document.getElementById('otp-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('otp-input').value.trim();
        const key = document.getElementById('otp-key-input').value;
        if (!text) return alert("Please enter text");
        if (!key) return alert("Please enter a key");
        const result = oneTimePad(text, key);
        displayOTPResult(result, text, key);
        // Add D3 visualization
        if (typeof createD3OTPVisualization === 'function') {
            createD3OTPVisualization(key, text, result.text);
        }
    });
    
    document.getElementById('otp-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('otp-input').value.trim();
        const key = document.getElementById('otp-key-input').value;
        if (!text) return alert("Please enter text");
        if (!key) return alert("Please enter a key");
        const result = oneTimePad(text, key, true);
        displayOTPResult(result, text, key, true);
        // Add D3 visualization
        if (typeof createD3OTPVisualization === 'function') {
            createD3OTPVisualization(key, result.text, text);
        }
    });
    
    document.getElementById('otp-generate-btn')?.addEventListener('click', () => {
        const text = document.getElementById('otp-input').value.trim();
        if (!text) return alert("Please enter text first");
        const key = generateRandomOTPKey(text.length);
        document.getElementById('otp-key-input').value = key;
    });
}

function setupRailFenceCipher() {
    document.getElementById('railfence-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('railfence-input').value.trim();
        const rails = parseInt(document.getElementById('railfence-rails-input').value) || 3;
        if (!text) return alert("Please enter text");
        const result = railFenceCipher(text, rails);
        const resultDiv = document.getElementById('railfence-result');
        resultDiv.innerHTML = '';
        resultDiv.appendChild(createEnhancedOutput('encrypted', result.text, {Rails: rails}));
        // Add D3 visualization
        if (typeof createD3RailFenceVisualization === 'function') {
            createD3RailFenceVisualization(text, rails);
        }
    });
    
    document.getElementById('railfence-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('railfence-input').value.trim();
        const rails = parseInt(document.getElementById('railfence-rails-input').value) || 3;
        if (!text) return alert("Please enter text");
        const result = railFenceCipher(text, rails, true);
        const resultDiv = document.getElementById('railfence-result');
        resultDiv.innerHTML = '';
        resultDiv.appendChild(createEnhancedOutput('decrypted', result.text, {Rails: rails}));
        // Add D3 visualization
        if (typeof createD3RailFenceVisualization === 'function') {
            createD3RailFenceVisualization(result.text, rails);
        }
    });
}

function setupColumnarCipher() {
    document.getElementById('columnar-encrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('columnar-input').value.trim();
        const key = document.getElementById('columnar-key-input').value || 'KEY';
        if (!text) return alert("Please enter text");
        const result = columnarCipher(text, key);
        displayColumnarResult(result, text, key);
        // Add D3 visualization
        if (typeof createD3ColumnarVisualization === 'function') {
            createD3ColumnarVisualization(key, text, result.text);
        }
    });
    
    document.getElementById('columnar-decrypt-btn')?.addEventListener('click', () => {
        const text = document.getElementById('columnar-input').value.trim();
        const key = document.getElementById('columnar-key-input').value || 'KEY';
        if (!text) return alert("Please enter text");
        const result = columnarCipher(text, key, true);
        displayColumnarResult(result, text, key, true);
        // Add D3 visualization
        if (typeof createD3ColumnarVisualization === 'function') {
            createD3ColumnarVisualization(key, result.text, text);
        }
    });
}

function testAvalancheEffect(plaintext, substitution, transposition, rounds) {
    // Create modified plaintext by flipping one bit
    const modifiedPlaintext = flipOneBit(plaintext);
    
    // Encrypt both original and modified plaintext
    const originalResult = encryptProductCipher(plaintext, substitution, transposition, rounds);
    const modifiedResult = encryptProductCipher(modifiedPlaintext, substitution, transposition, rounds);
    
    // Calculate avalanche effect
    const avalanche = calculateAvalanche(originalResult.text, modifiedResult.text);
    
    // Display avalanche test results
    displayAvalancheResults(plaintext, modifiedPlaintext, originalResult.text, modifiedResult.text, avalanche);
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

function calculateAvalanche(original, modified) {
    if (original.length !== modified.length) {
        return { percentage: 0, changedBits: 0, totalBits: 0 };
    }
    
    let changedBits = 0;
    let totalBits = 0;
    
    for (let i = 0; i < original.length; i++) {
        const originalByte = original.charCodeAt(i);
        const modifiedByte = modified.charCodeAt(i);
        
        // XOR to find different bits
        const diff = originalByte ^ modifiedByte;
        
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

function displayAvalancheResults(originalText, modifiedText, originalCipher, modifiedCipher, avalanche) {
    const resultDiv = document.getElementById('result-display');
    if (!resultDiv) return;
    
    resultDiv.innerHTML = `
        <div class="result-summary">
            <h3> Avalanche Effect Test Results</h3>
            <p><strong>Avalanche Percentage:</strong> <span style="color: #00ff80;">${avalanche.percentage}%</span></p>
            <p><strong>Changed Bits:</strong> ${avalanche.changedBits} / ${avalanche.totalBits}</p>
        </div>
        
        <div class="round-card">
            <div class="round-header">Original Plaintext</div>
            <p style="font-family: monospace; color: #80c8ff;">${originalText}</p>
        </div>
        
        <div class="round-card">
            <div class="round-header">Modified Plaintext (1 bit flipped)</div>
            <p style="font-family: monospace; color: #ff8080;">${modifiedText}</p>
        </div>
        
        <div class="round-card">
            <div class="round-header">Original Ciphertext</div>
            <p style="font-family: monospace; color: #00ff80;">${originalCipher}</p>
        </div>
        
        <div class="round-card">
            <div class="round-header">Modified Ciphertext</div>
            <p style="font-family: monospace; color: #ff8080;">${modifiedCipher}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(0, 120, 255, 0.1); border-radius: 10px;">
            <p style="color: #b0d8ff;">
                <strong>Avalanche Effect Analysis:</strong> 
                ${avalanche.percentage >= 50 ? 
                    'Good avalanche effect! Small input changes cause significant output changes.' : 
                    avalanche.percentage >= 25 ? 
                    'Moderate avalanche effect. Consider using more rounds or stronger ciphers.' : 
                    'Weak avalanche effect. Output changes too little for input changes.'}
            </p>
        </div>
    `;
}

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