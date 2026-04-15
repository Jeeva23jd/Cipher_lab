// modules/visualizations.js - D3.js Visualizations for Cipher Algorithms

// Caesar Cipher Alphabet Mapping Visualization
function createD3CaesarVisualization(shift, plaintext, ciphertext) {
    const container = d3.select("#caesar-alphabet-map");
    container.html(""); // Clear previous visualization
    
    const width = 1200;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Create alphabet data
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const data = alphabet.map((letter, i) => {
        const originalPos = i;
        const shiftedPos = (i + shift) % 26;
        const shiftedLetter = alphabet[shiftedPos];
        const isInPlaintext = plaintext.toUpperCase().includes(letter);
        const isInCiphertext = ciphertext.toUpperCase().includes(shiftedLetter);
        
        return {
            original: letter,
            originalPos: originalPos,
            shifted: shiftedLetter,
            shiftedPos: shiftedPos,
            isInPlaintext: isInPlaintext,
            isInCiphertext: isInCiphertext
        };
    });
    
    // Create scales
    const xScale = d3.scaleBand()
        .domain(alphabet)
        .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top]);
    
    // Create groups for original and shifted alphabets
    const originalGroup = svg.append("g")
        .attr("transform", `translate(0, ${margin.top})`);
    
    const shiftedGroup = svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom - 100})`);
    
    // Original alphabet with animation
    const originalLetters = originalGroup.selectAll(".original-letter")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "original-letter")
        .attr("x", d => xScale(d.original))
        .attr("y", yScale(0))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", d => d.isInCiphertext ? "bold" : "normal")
        .attr("fill", d => d.isInPlaintext ? "#00ff80" : "#80c8ff")
        .attr("opacity", 0)
        .text(d => d.original);
    
    // Animate original letters
    originalLetters.transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .attr("opacity", 1)
        .attr("transform", d => d.isInPlaintext ? "scale(1.2)" : "scale(1)")
        .transition()
        .duration(400)
        .attr("transform", "scale(1)");
    
    // Shifted alphabet with animation
    const shiftedLetters = shiftedGroup.selectAll(".shifted-letter")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "shifted-letter")
        .attr("x", d => xScale(d.original))
        .attr("y", yScale(0))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", d => d.isInCiphertext ? "bold" : "normal")
        .attr("fill", d => d.isInPlaintext ? "#00ff80" : "#80c8ff")
        .attr("opacity", 0)
        .text(d => d.shifted);
    
    // Animate shifted letters with delay
    shiftedLetters.transition()
        .duration(800)
        .delay((d, i) => i * 50 + 400) // Delay after original letters
        .attr("opacity", 1)
        .attr("transform", d => d.isInCiphertext ? "scale(1.2)" : "scale(1)")
        .transition()
        .duration(400)
        .attr("transform", "scale(1)");
    
    // Draw curved arrows for mapped letters
    const arrowGroup = svg.append("g")
        .attr("class", "arrows");
    
    // Animated curved arrows for mapped letters
    data.forEach((d, i) => {
        if (d.isInPlaintext || d.isInCiphertext) {
            const startX = xScale(d.original) + 8;
            const startY = margin.top + 20;
            const endX = xScale(d.original) + 8;
            const endY = height - margin.bottom - 80;
            const controlY = (startY + endY) / 2;
            const curveOffset = 30; // Curve the arrow
            
            // Create curved path using quadratic Bezier curve
            const curvedPath = `M ${startX} ${startY} Q ${startX + curveOffset} ${controlY} ${endX} ${endY}`;
            
            const arrow = arrowGroup.append("path")
                .attr("d", curvedPath)
                .attr("stroke", "#00d4ff")
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .attr("marker-end", "url(#arrowhead)")
                .attr("opacity", 0)
                .attr("stroke-dasharray", "5,5");
            
            // Add transformation label (h → k)
            const transformLabel = arrowGroup.append("text")
                .attr("x", startX + curveOffset/2)
                .attr("y", controlY)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("font-weight", "bold")
                .attr("fill", "#ff9900")
                .attr("opacity", 0)
                .text(`${d.original} → ${d.shifted}`);
            
            // Animate arrow appearance
            arrow.transition()
                .duration(600)
                .delay(i * 50 + 800) // After letters appear
                .attr("opacity", 1)
                .attrTween("stroke-dashoffset", function() {
                    const length = this.getTotalLength();
                    return d3.interpolate(length, 0);
                });
            
            // Animate transformation label
            transformLabel.transition()
                .duration(600)
                .delay(i * 50 + 800)
                .attr("opacity", 1);
        }
    });
    
    // Add arrow marker
    svg.append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "#00d4ff");
    
    // Add labels
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top - 10)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .text("Original Alphabet");
    
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", height - margin.bottom - 110)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .text("Shifted Alphabet");
    
    }

// Vigenère Cipher Visualization
function createD3VigenereVisualization(key, plaintext, ciphertext) {
    const container = d3.select("#vigenere-visualization");
    container.html(""); // Clear previous visualization
    
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 100, left: 40 };
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Step 1: Show animated title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .attr("opacity", 0)
        .text(" Vigenère Cipher - Polyalphabetic Substitution")
        .transition()
        .duration(800)
        .attr("opacity", 1);
    
    // Prepare data with key repetition
    const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanCipher = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    
    const data = cleanText.split('').map((char, i) => ({
        position: i,
        original: char,
        keyChar: cleanKey[i % cleanKey.length],
        encrypted: cleanCipher[i] || '',
        charCode: char.charCodeAt(0) - 65,
        keyCode: cleanKey[i % cleanKey.length] ? cleanKey[i % cleanKey.length].charCodeAt(0) - 65 : 0,
        cipherCode: cleanCipher[i] ? cleanCipher[i].charCodeAt(0) - 65 : 0
    }));
    
    const xScale = d3.scaleBand()
        .domain(data.map((d, i) => i))
        .range([margin.left, width - margin.right])
        .padding(0.05);
    
    const yScale = d3.scaleBand()
        .domain(['Plaintext', 'Key (Repeated)', 'Math Operations', 'Ciphertext'])
        .range([margin.top + 40, height - margin.bottom])
        .padding(0.3);
    
    // Step 2: Show plaintext with animation
    const plaintextGroup = svg.append("g")
        .attr("transform", `translate(0, ${yScale('Plaintext')})`);
    
        
    const plaintextBoxes = plaintextGroup.selectAll(".plaintext-box")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "plaintext-box")
        .attr("x", d => xScale(d.position))
        .attr("y", 0)
        .attr("width", xScale.bandwidth() * 0.9)
        .attr("height", yScale.bandwidth())
        .attr("fill", "rgba(0, 120, 255, 0.2)")
        .attr("stroke", "#0099ff")
        .attr("stroke-width", 2)
        .attr("rx", 4)
        .attr("opacity", 0)
        .attr("transform", "scale(0.8)");
    
    plaintextBoxes.transition()
        .duration(600)
        .delay((d, i) => i * 40)
        .attr("opacity", 1)
        .attr("transform", "scale(1)");
    
    const plaintextTexts = plaintextGroup.selectAll(".plaintext-text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "plaintext-text")
        .attr("x", d => xScale(d.position) + xScale.bandwidth() / 2)
        .attr("y", yScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#e0f0ff")
        .attr("opacity", 0)
        .text(d => d.original);
    
    plaintextTexts.transition()
        .duration(500)
        .delay((d, i) => i * 40 + 200)
        .attr("opacity", 1);
    
    // Step 3: Show repeated key with animation
    setTimeout(() => {
        const keyGroup = svg.append("g")
            .attr("transform", `translate(0, ${yScale('Key (Repeated)')})`);
        
                
        const keyBoxes = keyGroup.selectAll(".key-box")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "key-box")
            .attr("x", d => xScale(d.position))
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 0.9)
            .attr("height", yScale.bandwidth())
            .attr("fill", "rgba(0, 200, 255, 0.2)")
            .attr("stroke", "#00ccff")
            .attr("stroke-width", 2)
            .attr("rx", 4)
            .attr("opacity", 0)
            .attr("transform", "scale(0.8)");
        
        keyBoxes.transition()
            .duration(600)
            .delay((d, i) => i * 40)
            .attr("opacity", 1)
            .attr("transform", "scale(1)");
        
        const keyTexts = keyGroup.selectAll(".key-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "key-text")
            .attr("x", d => xScale(d.position) + xScale.bandwidth() / 2)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#e0f0ff")
            .attr("opacity", 0)
            .text(d => d.keyChar);
        
        keyTexts.transition()
            .duration(500)
            .delay((d, i) => i * 40 + 200)
            .attr("opacity", 1);
    }, 600);
    
    // Step 4: Show mathematical operations with animation
    setTimeout(() => {
        const mathGroup = svg.append("g")
            .attr("transform", `translate(0, ${yScale('Math Operations')})`);
        
                
        const mathBoxes = mathGroup.selectAll(".math-box")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "math-box")
            .attr("x", d => xScale(d.position))
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 0.9)
            .attr("height", yScale.bandwidth())
            .attr("fill", "rgba(255, 153, 0, 0.1)")
            .attr("stroke", "#ff9900")
            .attr("stroke-width", 2)
            .attr("rx", 4)
            .attr("opacity", 0)
            .attr("transform", "scale(0.8)");
        
        mathBoxes.transition()
            .duration(600)
            .delay((d, i) => i * 40)
            .attr("opacity", 1)
            .attr("transform", "scale(1)");
        
        const mathTexts = mathGroup.selectAll(".math-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "math-text")
            .attr("x", d => xScale(d.position) + xScale.bandwidth() / 2)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#e0f0ff")
            .attr("opacity", 0)
            .text(d => `(${d.charCode}+${d.keyCode})%26=${(d.charCode + d.keyCode) % 26}`);
        
        mathTexts.transition()
            .duration(500)
            .delay((d, i) => i * 40 + 200)
            .attr("opacity", 1);
    }, 1200);
    
    // Step 5: Show ciphertext with animation
    setTimeout(() => {
        const cipherGroup = svg.append("g")
            .attr("transform", `translate(0, ${yScale('Ciphertext')})`);
        
                
        const cipherBoxes = cipherGroup.selectAll(".cipher-box")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cipher-box")
            .attr("x", d => xScale(d.position))
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 0.9)
            .attr("height", yScale.bandwidth())
            .attr("fill", "rgba(0, 255, 128, 0.2)")
            .attr("stroke", "#00ff80")
            .attr("stroke-width", 2)
            .attr("rx", 4)
            .attr("opacity", 0)
            .attr("transform", "scale(0.8)");
        
        cipherBoxes.transition()
            .duration(600)
            .delay((d, i) => i * 40)
            .attr("opacity", 1)
            .attr("transform", "scale(1)");
        
        const cipherTexts = cipherGroup.selectAll(".cipher-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "cipher-text")
            .attr("x", d => xScale(d.position) + xScale.bandwidth() / 2)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#e0f0ff")
            .attr("opacity", 0)
            .text(d => d.encrypted);
        
        cipherTexts.transition()
            .duration(500)
            .delay((d, i) => i * 40 + 200)
            .attr("opacity", 1);
    }, 1800);
    
    // Add connecting arrows
    setTimeout(() => {
        data.forEach((d, i) => {
            const arrow1 = svg.append("path")
                .attr("d", `M ${xScale(d.position) + xScale.bandwidth()/2} ${yScale('Plaintext') + yScale.bandwidth()/2} L ${xScale(d.position) + xScale.bandwidth()/2} ${yScale('Math Operations') + yScale.bandwidth()/2}`)
                .attr("stroke", "#00d4ff")
                .attr("stroke-width", 1.5)
                .attr("fill", "none")
                .attr("marker-end", "url(#arrowhead)")
                .attr("opacity", 0)
                .attr("stroke-dasharray", "3,3");
            
            arrow1.transition()
                .duration(400)
                .delay(i * 30 + 2000)
                .attr("opacity", 0.7)
                .attrTween("stroke-dashoffset", function() {
                    const length = this.getTotalLength();
                    return d3.interpolate(length, 0);
                });
            
            const arrow2 = svg.append("path")
                .attr("d", `M ${xScale(d.position) + xScale.bandwidth()/2} ${yScale('Math Operations') + yScale.bandwidth()/2} L ${xScale(d.position) + xScale.bandwidth()/2} ${yScale('Ciphertext') + yScale.bandwidth()/2}`)
                .attr("stroke", "#00ff80")
                .attr("stroke-width", 1.5)
                .attr("fill", "none")
                .attr("marker-end", "url(#arrowhead)")
                .attr("opacity", 0)
                .attr("stroke-dasharray", "3,3");
            
            arrow2.transition()
                .duration(400)
                .delay(i * 30 + 2100)
                .attr("opacity", 0.7)
                .attrTween("stroke-dashoffset", function() {
                    const length = this.getTotalLength();
                    return d3.interpolate(length, 0);
                });
        });
    }, 2400);
}

// One-Time Pad Visualization
function createD3OTPVisualization(key, plaintext, ciphertext) {
    const container = d3.select("#otp-visualization");
    container.html(""); // Clear previous visualization
    
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 80, left: 40 };
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Prepare data
    const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanCipher = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    
    const data = cleanText.split('').map((char, i) => ({
        position: i,
        original: char,
        keyChar: cleanKey[i] || '',
        encrypted: cleanCipher[i] || '',
        charCode: char.charCodeAt(0) - 65,
        keyCode: cleanKey[i] ? cleanKey[i].charCodeAt(0) - 65 : 0,
        cipherCode: cleanCipher[i] ? cleanCipher[i].charCodeAt(0) - 65 : 0
    }));
    
    const xScale = d3.scaleBand()
        .domain(data.map((d, i) => i))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    const yScale = d3.scaleBand()
        .domain(['Plaintext', 'Key', 'Operation', 'Ciphertext'])
        .range([margin.top, height - margin.bottom])
        .padding(0.3);
    
    // Create groups
    const groups = ['Plaintext', 'Key', 'Operation', 'Ciphertext'];
    groups.forEach((group, groupIndex) => {
        const g = svg.append("g")
            .attr("transform", `translate(0, ${yScale(group)})`);
        
                
        // Add letter boxes with animation
        const letterBoxes = g.selectAll(".letter")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "letter-box")
            .attr("x", d => xScale(d.position))
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 0.9)
            .attr("height", yScale.bandwidth())
            .attr("fill", (d, i) => {
                if (group === 'Plaintext') return "rgba(0, 120, 255, 0.2)";
                if (group === 'Key') return "rgba(0, 200, 255, 0.2)";
                if (group === 'Operation') return "rgba(255, 200, 0, 0.1)";
                return "rgba(0, 255, 128, 0.2)";
            })
            .attr("stroke", (d, i) => {
                if (group === 'Plaintext') return "#0099ff";
                if (group === 'Key') return "#00ccff";
                if (group === 'Operation') return "#ff9900";
                return "#00ff80";
            })
            .attr("stroke-width", 2)
            .attr("rx", 4)
            .attr("opacity", 0)
            .attr("transform", "scale(0.8)");
        
        // Animate letter boxes
        letterBoxes.transition()
            .duration(600)
            .delay((d, i) => i * 100 + groupIndex * 200)
            .attr("opacity", 1)
            .attr("transform", "scale(1)")
            .transition()
            .duration(200)
            .attr("transform", d => group === 'Operation' ? "scale(1.05)" : "scale(1)");
        
        // Add letters with animation
        const letterTexts = g.selectAll(".letter-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "letter-text")
            .attr("x", d => xScale(d.position) + xScale.bandwidth() / 2)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#e0f0ff")
            .attr("opacity", 0)
            .text(d => {
                if (group === 'Plaintext') return d.original;
                if (group === 'Key') return d.keyChar;
                if (group === 'Operation') return `${d.charCode}+${d.keyCode}=${(d.charCode + d.keyCode) % 26}`;
                return d.encrypted;
            });
        
        // Animate letter text with staggered timing
        letterTexts.transition()
            .duration(500)
            .delay((d, i) => i * 100 + groupIndex * 200 + 300)
            .attr("opacity", 1)
            .attr("transform", "scale(1.1)")
            .transition()
            .duration(300)
            .attr("transform", "scale(1)");
    });
    
    // Add mathematical formula section
    const formulaY = height - 50;
    svg.append("rect")
        .attr("x", margin.left)
        .attr("y", formulaY - 25)
        .attr("width", width - margin.left - margin.right)
        .attr("height", 40)
        .attr("fill", "rgba(5, 15, 40, 0.95)")
        .attr("stroke", "#00b4ff")
        .attr("stroke-width", 1)
        .attr("rx", 8);
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", formulaY - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .text("One-Time Pad Formula");
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", formulaY + 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#80e8ff")
        .text("Cᵢ = (Pᵢ + Kᵢ) mod 26 | Pᵢ = (Cᵢ - Kᵢ + 26) mod 26");
    
    // Add mapping labels at the bottom for Vigenère cipher
    const mappingY = height - 40;
    data.forEach((d, i) => {
        // Ensure we have the encrypted character
        const encryptedChar = d.encrypted || cleanCipher[i] || '?';
        console.log(`Mapping: ${d.original}->${encryptedChar}`); // Debug log
        const mappingLabel = svg.append("text")
            .attr("x", xScale(d.position) + xScale.bandwidth() / 2)
            .attr("y", mappingY)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#ff6b6b")
            .attr("opacity", 1) // Make immediately visible
            .text(`${d.original}->${encryptedChar}`);
    });
    
    // Add security note
    if (cleanText.length !== cleanKey.length) {
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", height - 60)
            .attr("width", width - margin.left - margin.right)
            .attr("height", 30)
            .attr("fill", "rgba(255, 0, 0, 0.1)")
            .attr("stroke", "#ff6b6b")
            .attr("stroke-width", 2)
            .attr("rx", 6);
        
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 45)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#ff6b6b")
            .text("⚠️ Key length must equal plaintext length!");
    }
}

function createD3RailFenceVisualization(text, rails) {
    const container = d3.select("#rail-visualization");
    container.html(""); // Clear previous visualization
}

// Product Cipher Multi-Round Flow Visualization
function createD3ProductCipherVisualization(result) {
    const container = d3.select("#visualization");
    container.html(""); // Clear previous visualization
    
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Create flow diagram
    const steps = result.steps || [];
    const xScale = d3.scaleLinear()
        .domain([0, steps.length - 1])
        .range([margin.left + 100, width - margin.right - 100]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 2])
        .range([margin.top + 50, height - margin.bottom]);
    
    // Draw flow
    steps.forEach((step, i) => {
        const y = yScale(i % 2);
        
        // Round box
        svg.append("rect")
            .attr("x", xScale(i))
            .attr("y", y - 20)
            .attr("width", 80)
            .attr("height", 40)
            .attr("fill", "rgba(0, 120, 255, 0.2)")
            .attr("stroke", "#0099ff")
            .attr("stroke-width", 2)
            .attr("rx", 8);
        
        // Round label
        svg.append("text")
            .attr("x", xScale(i) + 40)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#00d4ff")
            .text(`Round ${step.round}`);
        
        // Cipher type
        svg.append("text")
            .attr("x", xScale(i) + 40)
            .attr("y", y + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "#80c8ff")
            .text(`${result.substitution} + ${result.transposition}`);
        
        svg.append("text")
            .attr("x", xScale(i) + 40)
            .attr("y", y + 195)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#00ff80")
            .text(step.afterTransposition);
        
        // Arrow to next round
        if (i < steps.length - 1) {
            svg.append("path")
                .attr("d", `M ${xScale(i) + 80 - 10} ${y + 250} L ${xScale(i) + 80 + 10} ${y + 250}`)
                .attr("stroke", "#00d4ff")
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .attr("marker-end", "url(#flowarrow)")
                .attr("opacity", 0.8);
        }
    });
    
    // Add arrow marker
    svg.append("defs")
        .append("marker")
        .attr("id", "flowarrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 9)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "#00d4ff");
}

// Slideshow-style Product Cipher Visualization
function createAnimatedProductCipherVisualization(result) {
    const container = d3.select("#visualization");
    container.html(""); // Clear previous visualization
    
    const width = 900;
    const height = 600;
    
    // Create main container
    const mainContainer = container.append("div")
        .style("position", "relative")
        .style("width", width + "px")
        .style("height", height + "px")
        .style("background", "linear-gradient(135deg, rgba(10, 25, 55, 0.95), rgba(0, 50, 100, 0.9))")
        .style("border", "1px solid rgba(0, 180, 255, 0.3)")
        .style("border-radius", "16px")
        .style("overflow", "hidden");
    
    // Create slide container
    const slideContainer = mainContainer.append("div")
        .style("position", "relative")
        .style("width", "100%")
        .style("height", "calc(100% - 80px)")
        .style("overflow", "hidden");
    
    // Create control panel
    const controlPanel = mainContainer.append("div")
        .style("position", "absolute")
        .style("bottom", "20px")
        .style("left", "50%")
        .style("transform", "translateX(-50%)")
        .style("background", "rgba(10, 25, 55, 0.9)")
        .style("border", "1px solid rgba(0, 180, 255, 0.3)")
        .style("border-radius", "12px")
        .style("padding", "15px 25px")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "15px")
        .style("z-index", "10");
    
    // Navigation buttons
    controlPanel.append("button")
        .attr("id", "prev-btn")
        .text("Previous")
        .style("background", "#00b4ff")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("border-radius", "6px")
        .style("cursor", "pointer")
        .style("font-size", "14px")
        .style("font-weight", "bold");
    
    controlPanel.append("button")
        .attr("id", "play-pause-btn")
        .text("Play")
        .style("background", "#00ff80")
        .style("color", "#001a33")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("border-radius", "6px")
        .style("cursor", "pointer")
        .style("font-size", "14px")
        .style("font-weight", "bold");
    
    controlPanel.append("button")
        .attr("id", "next-btn")
        .text("Next")
        .style("background", "#00b4ff")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("border-radius", "6px")
        .style("cursor", "pointer")
        .style("font-size", "14px")
        .style("font-weight", "bold");
    
    // Slide indicator
    const slideIndicator = controlPanel.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "8px");
    
    slideIndicator.append("span")
        .attr("id", "slide-counter")
        .text("1 / 1")
        .style("color", "#80c8ff")
        .style("font-size", "14px")
        .style("font-weight", "bold");
    
    // Progress bar
    const progressBar = slideIndicator.append("div")
        .style("width", "100px")
        .style("height", "6px")
        .style("background", "rgba(0, 180, 255, 0.2)")
        .style("border-radius", "3px")
        .style("overflow", "hidden");
    
    progressBar.append("div")
        .attr("id", "progress-fill")
        .style("width", "0%")
        .style("height", "100%")
        .style("background", "#00ff80")
        .style("transition", "width 0.3s ease");
    
    // Animation state
    let currentSlide = 0;
    let isPlaying = false;
    let autoPlayTimer = null;
    const autoPlayDelay = 2000;
    
    const steps = result.steps || [];
    const totalSlides = steps.length * 2 + 1; // +1 for title slide
    
    // Create slides
    const slides = [];
    
    // Title slide
    const titleSlide = slideContainer.append("div")
        .attr("class", "slide")
        .style("position", "absolute")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("opacity", 0);
    
    titleSlide.append("h1")
        .style("color", "#00d4ff")
        .style("font-size", "36px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .style("margin-bottom", "20px")
        .text("Product Cipher");
    
    titleSlide.append("h2")
        .style("color", "#80c8ff")
        .style("font-size", "24px")
        .style("text-align", "center")
        .style("margin-bottom", "30px")
        .text(`${getCipherDisplayName(result.substitution)} + ${getCipherDisplayName(result.transposition)}`);
    
    titleSlide.append("div")
        .style("color", "#00ff80")
        .style("font-size", "20px")
        .style("text-align", "center")
        .style("margin-bottom", "15px")
        .text(`${result.rounds} Rounds`);
    
    // Check if this is decryption (has inverse properties)
    const isDecryption = steps.length > 0 && steps[0].beforeTranspositionInverse !== undefined;
    
    titleSlide.append("div")
        .style("color", "#b0d8ff")
        .style("font-size", "18px")
        .style("text-align", "center")
        .style("font-style", "italic")
        .text(`${isDecryption ? 'Ciphertext' : 'Plaintext'}: ${isDecryption ? (result.ciphertext || '') : (result.plaintext || '')}`);
    
    slides.push(titleSlide);
    
    // Create operation slides
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Check if this is decryption (has inverse properties)
        const isDecryption = step.beforeTranspositionInverse !== undefined;
        
        // Substitution slide
        const subSlide = slideContainer.append("div")
            .attr("class", "slide")
            .style("position", "absolute")
            .style("width", "100%")
            .style("height", "100%")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("opacity", 0);
        
        subSlide.append("h2")
            .style("color", "#00d4ff")
            .style("font-size", "28px")
            .style("font-weight", "bold")
            .style("margin-bottom", "20px")
            .text(`Round ${i + 1} - ${isDecryption ? 'Inverse Substitution' : 'Substitution'}`);
        
        subSlide.append("div")
            .style("color", "#ff9900")
            .style("font-size", "20px")
            .style("margin-bottom", "30px")
            .style("text-align", "center")
            .text(getCipherDisplayName(result.substitution));
        
        subSlide.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "30px")
            .style("margin-bottom", "20px");
        
        subSlide.select("div").append("div")
            .style("color", "#80c8ff")
            .style("font-size", "18px")
            .text("Input:");
        
        subSlide.select("div").append("div")
            .style("color", "#00ff80")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("font-family", "monospace")
            .text(isDecryption ? step.afterTranspositionInverse : step.beforeSubstitution);
                
        subSlide.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "30px");
        
        subSlide.select("div:last-child").append("div")
            .style("color", "#80c8ff")
            .style("font-size", "18px")
            .text("Output:");
        
        subSlide.select("div:last-child").append("div")
            .style("color", "#00ff80")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("font-family", "monospace")
            .text(isDecryption ? step.afterSubstitutionInverse : step.afterSubstitution);
        
        slides.push(subSlide);
        
        // Transposition slide
        const transSlide = slideContainer.append("div")
            .attr("class", "slide")
            .style("position", "absolute")
            .style("width", "100%")
            .style("height", "100%")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("opacity", 0);
        
        transSlide.append("h2")
            .style("color", "#00d4ff")
            .style("font-size", "28px")
            .style("font-weight", "bold")
            .style("margin-bottom", "20px")
            .text(`Round ${i + 1} - ${isDecryption ? 'Inverse Transposition' : 'Transposition'}`);
        
        transSlide.append("div")
            .style("color", "#ff9900")
            .style("font-size", "20px")
            .style("margin-bottom", "30px")
            .style("text-align", "center")
            .text(getCipherDisplayName(result.transposition));
        
        transSlide.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "30px")
            .style("margin-bottom", "20px");
        
        transSlide.select("div").append("div")
            .style("color", "#80c8ff")
            .style("font-size", "18px")
            .text("Input:");
        
        transSlide.select("div").append("div")
            .style("color", "#00ff80")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("font-family", "monospace")
            .text(isDecryption ? step.beforeTranspositionInverse : step.afterSubstitution);
                
        transSlide.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "30px");
        
        transSlide.select("div:last-child").append("div")
            .style("color", "#80c8ff")
            .style("font-size", "18px")
            .text("Output:");
        
        transSlide.select("div:last-child").append("div")
            .style("color", "#00ff80")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("font-family", "monospace")
            .text(isDecryption ? step.afterTranspositionInverse : step.afterTransposition);
        
        slides.push(transSlide);
    }
    
    // Slideshow functions
    function showSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        // Hide all slides
        slides.forEach((slide, i) => {
            slide.transition()
                .duration(300)
                .style("opacity", 0);
        });
        
        // Show current slide
        slides[index].transition()
            .delay(300)
            .duration(500)
            .style("opacity", 1);
        
        currentSlide = index;
        updateSlideIndicator();
    }
    
    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }
    
    function startAutoPlay() {
        isPlaying = true;
        d3.select("#play-pause-btn").text("Pause");
        autoPlay();
    }
    
    function stopAutoPlay() {
        isPlaying = false;
        d3.select("#play-pause-btn").text("Play");
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }
    }
    
    function autoPlay() {
        if (isPlaying) {
            if (currentSlide < slides.length - 1) {
                nextSlide();
                autoPlayTimer = setTimeout(autoPlay, autoPlayDelay);
            } else {
                stopAutoPlay();
            }
        }
    }
    
    function updateSlideIndicator() {
        d3.select("#slide-counter").text(`${currentSlide + 1} / ${slides.length}`);
        d3.select("#progress-fill").style("width", `${((currentSlide + 1) / slides.length) * 100}%`);
    }
    
    // Event listeners
    d3.select("#next-btn").on("click", nextSlide);
    d3.select("#prev-btn").on("click", prevSlide);
    
    d3.select("#play-pause-btn").on("click", () => {
        if (isPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === " ") {
            e.preventDefault();
            if (isPlaying) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        }
    });
    
    // Initialize
    showSlide(0);
    setTimeout(() => startAutoPlay(), 1000);
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

// Columnar Transposition Visualization
function createD3ColumnarVisualization(key, plaintext, ciphertext) {
    const container = d3.select("#col-visualization");
    container.html(""); // Clear previous visualization
    
    const width = 900;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 80, left: 40 };
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Step 1: Animated title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .attr("opacity", 0)
        .text("Columnar Transposition - Column Reordering")
        .transition()
        .duration(800)
        .attr("opacity", 1);
    
    const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const numCols = cleanKey.length;
    const cellSize = 40;
    const startX = margin.left + 50;
    const startY = margin.top + 60;
    
    // Step 2: Show key and column order
    setTimeout(() => {
        svg.append("text")
            .attr("x", startX - 30)
            .attr("y", startY - 30)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#00ccff")
            .text("Key & Column Order:");
        
        // Calculate column order
        const keyLetters = cleanKey.split('');
        const sortedKey = [...keyLetters].sort();
        const columnOrder = keyLetters.map(letter => sortedKey.indexOf(letter) + 1);
        
        // Show key letters
        keyLetters.forEach((letter, i) => {
            const keyCell = svg.append("rect")
                .attr("class", "key-cell")
                .attr("x", startX + i * cellSize)
                .attr("y", startY - 20)
                .attr("width", cellSize)
                .attr("height", 30)
                .attr("fill", "rgba(0, 200, 255, 0.2)")
                .attr("stroke", "#00ccff")
                .attr("stroke-width", 2)
                .attr("rx", 4)
                .attr("opacity", 0)
                .attr("transform", "scale(0.8)");
            
            keyCell.transition()
                .duration(400)
                .delay(i * 100)
                .attr("opacity", 1)
                .attr("transform", "scale(1)");
            
            const keyText = svg.append("text")
                .attr("class", "key-text")
                .attr("x", startX + i * cellSize + cellSize/2)
                .attr("y", startY - 5)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "14px")
                .attr("font-weight", "bold")
                .attr("fill", "#e0f0ff")
                .attr("opacity", 0)
                .text(letter);
            
            keyText.transition()
                .duration(300)
                .delay(i * 100 + 200)
                .attr("opacity", 1);
            
            const orderText = svg.append("text")
                .attr("class", "order-text")
                .attr("x", startX + i * cellSize + cellSize/2)
                .attr("y", startY + 10)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#ff9900")
                .attr("opacity", 0)
                .text(`Order: ${columnOrder[i]}`);
            
            orderText.transition()
                .duration(300)
                .delay(i * 100 + 300)
                .attr("opacity", 1);
        });
    }, 800);
    
    // Step 3: Show matrix filling
    setTimeout(() => {
        svg.append("text")
            .attr("x", startX - 30)
            .attr("y", startY + 40)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#00d4ff")
            .text("Matrix (Row-wise Filling):");
        
        const numRows = Math.ceil(cleanText.length / numCols);
        
        // Create matrix grid
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const matrixCell = svg.append("rect")
                    .attr("class", "matrix-cell")
                    .attr("x", startX + col * cellSize)
                    .attr("y", startY + 60 + row * cellSize)
                    .attr("width", cellSize)
                    .attr("height", cellSize)
                    .attr("fill", "rgba(0, 120, 255, 0.1)")
                    .attr("stroke", "#0099ff")
                    .attr("stroke-width", 1)
                    .attr("rx", 4)
                    .attr("opacity", 0)
                    .attr("transform", "scale(0.8)");
                
                matrixCell.transition()
                    .duration(400)
                    .delay((row * numCols + col) * 30)
                    .attr("opacity", 1)
                    .attr("transform", "scale(1)");
                
                // Fill with text
                const textIndex = row * numCols + col;
                if (textIndex < cleanText.length) {
                    const matrixText = svg.append("text")
                        .attr("class", "matrix-text")
                        .attr("x", startX + col * cellSize + cellSize/2)
                        .attr("y", startY + 60 + row * cellSize + cellSize/2)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "#e0f0ff")
                        .attr("opacity", 0)
                        .text(cleanText[textIndex]);
                    
                    matrixText.transition()
                        .duration(300)
                        .delay((row * numCols + col) * 30 + 100)
                        .attr("opacity", 1);
                }
            }
        }
    }, 1500);
    
    // Step 4: Show column reordering
    setTimeout(() => {
        svg.append("text")
            .attr("x", startX - 30)
            .attr("y", startY + 60 + numRows * cellSize + 30)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#ff9900")
            .text("Column Reordering (Read by Order):");
        
        // Show reordered columns
        columnOrder.forEach((order, colIndex) => {
            const targetCol = order - 1;
            const x = startX + colIndex * cellSize;
            
            // Draw column
            for (let row = 0; row < numRows; row++) {
                const textIndex = row * numCols + targetCol;
                if (textIndex < cleanText.length) {
                    const reorderedCell = svg.append("rect")
                        .attr("class", "reordered-cell")
                        .attr("x", x)
                        .attr("y", startY + 60 + numRows * cellSize + 60 + row * cellSize)
                        .attr("width", cellSize)
                        .attr("height", cellSize)
                        .attr("fill", "rgba(255, 153, 0, 0.2)")
                        .attr("stroke", "#ff9900")
                        .attr("stroke-width", 2)
                        .attr("rx", 4)
                        .attr("opacity", 0)
                        .attr("transform", "scale(0.8)");
                    
                    reorderedCell.transition()
                        .duration(400)
                        .delay(colIndex * 200 + row * 50)
                        .attr("opacity", 1)
                        .attr("transform", "scale(1)");
                    
                    const reorderedText = svg.append("text")
                        .attr("class", "reordered-text")
                        .attr("x", x + cellSize/2)
                        .attr("y", startY + 60 + numRows * cellSize + 60 + row * cellSize + cellSize/2)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "#e0f0ff")
                        .attr("opacity", 0)
                        .text(cleanText[textIndex]);
                    
                    reorderedText.transition()
                        .duration(300)
                        .delay(colIndex * 200 + row * 50 + 100)
                        .attr("opacity", 1);
                }
            }
            
            // Add column label
            const colLabel = svg.append("text")
                .attr("class", "col-label")
                .attr("x", x + cellSize/2)
                .attr("y", startY + 60 + numRows * cellSize + 50)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", "#ff9900")
                .attr("opacity", 0)
                .text(`Col ${order}`);
            
            colLabel.transition()
                .duration(300)
                .delay(colIndex * 200)
                .attr("opacity", 1);
        });
    }, 2500);
    
    // Step 5: Show final ciphertext
    setTimeout(() => {
        svg.append("text")
            .attr("x", startX - 30)
            .attr("y", startY + 60 + numRows * cellSize + 60 + numRows * cellSize + 30)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#00ff80")
            .text("Final Ciphertext (Read Top-to-Bottom):");
        
        // Show final result
        const resultText = svg.append("text")
            .attr("class", "final-ciphertext")
            .attr("x", startX)
            .attr("y", startY + 60 + numRows * cellSize + 60 + numRows * cellSize + 50)
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "#00ff80")
            .attr("opacity", 0)
            .text(ciphertext);
        
        resultText.transition()
            .duration(600)
            .delay(3500)
            .attr("opacity", 1)
            .attr("transform", "scale(1.1)")
            .transition()
            .duration(300)
            .attr("transform", "scale(1)");
    }, 3500);
}

// Export all visualization functions
window.createD3CaesarVisualization = createD3CaesarVisualization;
// Monoalphabetic Cipher Visualization
function createD3MonoalphabeticVisualization(key, plaintext, ciphertext) {
    const container = d3.select("#mono-mapping");
    container.html(""); // Clear previous visualization
    
    const width = 700;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 80, left: 40 };
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Step 1: Show key mapping
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const mapping = {};
    key.toUpperCase().split('').forEach((char, i) => {
        if (char !== ' ') {
            mapping[alphabet[i]] = char;
        }
    });
    
    const data = alphabet.map((letter, i) => ({
        original: letter,
        mapped: mapping[letter] || letter,
        isUsed: plaintext.toUpperCase().includes(letter),
        position: i
    }));
    
    const xScale = d3.scaleBand()
        .domain(alphabet)
        .range([margin.left, width - margin.right])
        .padding(0.05);
    
    const yScale = d3.scaleBand()
        .domain(['Original Alphabet', 'Key Mapping'])
        .range([margin.top, height - margin.bottom])
        .padding(0.3);
    
    // Animated title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .attr("opacity", 0)
        .text("🔐 Monoalphabetic Cipher - Step-by-Step Mapping")
        .transition()
        .duration(800)
        .attr("opacity", 1);
    
    // Step 2: Show original alphabet
    const originalGroup = svg.append("g")
        .attr("transform", `translate(0, ${yScale('Original Alphabet')})`);
    
    originalGroup.append("text")
        .attr("x", margin.left - 10)
        .attr("y", yScale.bandwidth() / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#00d4ff")
        .text("Original");
    
    // Animate original letters
    const originalBoxes = originalGroup.selectAll(".original-box")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "original-box")
        .attr("x", d => xScale(d.original))
        .attr("y", 0)
        .attr("width", xScale.bandwidth() * 0.9)
        .attr("height", yScale.bandwidth())
        .attr("fill", d => d.isUsed ? "rgba(0, 120, 255, 0.3)" : "rgba(0, 100, 200, 0.1)")
        .attr("stroke", "#0099ff")
        .attr("stroke-width", 2)
        .attr("rx", 4)
        .attr("opacity", 0)
        .attr("transform", "scale(0.8)");
    
    originalBoxes.transition()
        .duration(600)
        .delay((d, i) => i * 30)
        .attr("opacity", 1)
        .attr("transform", "scale(1)");
    
    const originalTexts = originalGroup.selectAll(".original-text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "original-text")
        .attr("x", d => xScale(d.original) + xScale.bandwidth() / 2)
        .attr("y", yScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#e0f0ff")
        .attr("opacity", 0)
        .text(d => d.original);
    
    originalTexts.transition()
        .duration(500)
        .delay((d, i) => i * 30 + 200)
        .attr("opacity", 1);
    
    // Step 3: Show mapping arrows
    setTimeout(() => {
        data.forEach((d, i) => {
            if (d.isUsed) {
                const arrow = svg.append("path")
                    .attr("d", `M ${xScale(d.original) + xScale.bandwidth()} ${yScale('Original Alphabet') + yScale.bandwidth()/2} Q ${xScale(d.original) + xScale.bandwidth()/2} ${yScale('Key Mapping') + yScale.bandwidth()/2}`)
                    .attr("stroke", "#00d4ff")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
                    .attr("marker-end", "url(#arrowhead)")
                    .attr("opacity", 0)
                    .attr("stroke-dasharray", "5,5");
                
                arrow.transition()
                    .duration(600)
                    .delay(i * 50)
                    .attr("opacity", 1)
                    .attrTween("stroke-dashoffset", function() {
                        const length = this.getTotalLength();
                        return d3.interpolate(length, 0);
                    });
            }
        });
    }, 800);
    
    // Step 4: Show mapped alphabet
    setTimeout(() => {
        const mappedGroup = svg.append("g")
            .attr("transform", `translate(0, ${yScale('Key Mapping')})`);
        
        mappedGroup.append("text")
            .attr("x", margin.left - 10)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#00ff80")
            .text("Mapped");
        
        const mappedBoxes = mappedGroup.selectAll(".mapped-box")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "mapped-box")
            .attr("x", d => xScale(d.original))
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 0.9)
            .attr("height", yScale.bandwidth())
            .attr("fill", d => d.isUsed ? "rgba(0, 255, 128, 0.3)" : "rgba(0, 200, 200, 0.1)")
            .attr("stroke", d => d.isUsed ? "#00ff80" : "#00ccff")
            .attr("stroke-width", 2)
            .attr("rx", 4)
            .attr("opacity", 0)
            .attr("transform", "scale(0.8)");
        
        mappedBoxes.transition()
            .duration(600)
            .delay((d, i) => i * 30)
            .attr("opacity", 1)
            .attr("transform", d => d.isUsed ? "scale(1.1)" : "scale(1)");
        
        const mappedTexts = mappedGroup.selectAll(".mapped-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "mapped-text")
            .attr("x", d => xScale(d.original) + xScale.bandwidth() / 2)
            .attr("y", yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#e0f0ff")
            .attr("opacity", 0)
            .text(d => d.mapped);
        
        mappedTexts.transition()
            .duration(500)
            .delay((d, i) => i * 30 + 200)
            .attr("opacity", 1);
    }, 1200);
    
    // Add arrow marker
    svg.append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5")
        .attr("fill", "#00d4ff");
}

window.createD3VigenereVisualization = createD3VigenereVisualization;
window.createD3PlayfairVisualization = createD3PlayfairVisualization;
window.createD3RailFenceVisualization = createD3RailFenceVisualization;
window.createD3ProductCipherVisualization = createD3ProductCipherVisualization;
window.createD3MonoalphabeticVisualization = createD3MonoalphabeticVisualization;
window.createD3ColumnarVisualization = createD3ColumnarVisualization;
window.createD3HillVisualization = createD3HillVisualization;
