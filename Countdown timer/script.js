document.addEventListener('DOMContentLoaded', function() {
    const preview = document.getElementById('preview');
    const gradientType = document.getElementById('gradientType');
    const angle = document.getElementById('angle');
    const angleValue = document.getElementById('angleValue');
    const angleControl = document.getElementById('angleControl');
    const colorStops = document.getElementById('colorStops');
    const addColorBtn = document.getElementById('addColor');
    const randomizeBtn = document.getElementById('randomize');
    const presets = document.getElementById('presets');
    const cssOutput = document.getElementById('cssOutput');
    const copyCssBtn = document.getElementById('copyCss');

    let colors = ['#ff0000', '#0000ff'];

    function createColorStop(color, index) {
        const colorStop = document.createElement('div');
        colorStop.className = 'color-stop';
        colorStop.innerHTML = `
            <input type="color" value="${color}" data-index="${index}">
            <input type="range" min="0" max="100" value="${index === 0 ? 0 : 100}" data-index="${index}">
            <span>${index === 0 ? '0%' : '100%'}</span>
            ${index > 1 ? '<button class="remove-color">Remove</button>' : ''}
        `;
        colorStops.appendChild(colorStop);

        colorStop.querySelector('input[type="color"]').addEventListener('input', updateBackground);
        colorStop.querySelector('input[type="range"]').addEventListener('input', updateColorStopPercentage);
        if (index > 1) {
            colorStop.querySelector('.remove-color').addEventListener('click', removeColorStop);
        }
    }

    function updateColorStopPercentage(e) {
        const percentage = e.target.value;
        e.target.nextElementSibling.textContent = `${percentage}%`;
        updateBackground();
    }

    function removeColorStop(e) {
        const colorStop = e.target.closest('.color-stop');
        const index = Array.from(colorStops.children).indexOf(colorStop);
        colors.splice(index, 1);
        colorStop.remove();
        updateBackground();
    }

    function updateBackground() {
        let backgroundCSS;
        const colorValues = Array.from(colorStops.querySelectorAll('input[type="color"]')).map(input => input.value);
        const colorPercentages = Array.from(colorStops.querySelectorAll('input[type="range"]')).map(input => input.value);

        if (gradientType.value === 'linear') {
            backgroundCSS = `linear-gradient(${angle.value}deg, ${colorValues.map((color, i) => `${color} ${colorPercentages[i]}%`).join(', ')})`;
        } else if (gradientType.value === 'radial') {
            backgroundCSS = `radial-gradient(circle, ${colorValues.map((color, i) => `${color} ${colorPercentages[i]}%`).join(', ')})`;
        } else {
            backgroundCSS = `conic-gradient(from ${angle.value}deg, ${colorValues.map((color, i) => `${color} ${colorPercentages[i]}%`).join(', ')})`;
        }
        
        preview.style.background = backgroundCSS;
        cssOutput.textContent = `background: ${backgroundCSS};`;
    }

    gradientType.addEventListener('change', function() {
        angleControl.style.display = gradientType.value === 'radial' ? 'none' : 'flex';
        updateBackground();
    });

    angle.addEventListener('input', function() {
        angleValue.textContent = `${this.value}°`;
        updateBackground();
    });

    addColorBtn.addEventListener('click', function() {
        const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        colors.push(newColor);
        createColorStop(newColor, colors.length - 1);
        updateBackground();
    });

    randomizeBtn.addEventListener('click', function() {
        colors = colors.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));
        colorStops.innerHTML = '';
        colors.forEach((color, index) => createColorStop(color, index));
        updateBackground();
    });

    presets.addEventListener('change', function() {
        switch(this.value) {
            case 'sunset':
                colors = ['#ff7e5f', '#feb47b'];
                break;
            case 'ocean':
                colors = ['#2193b0', '#6dd5ed'];
                break;
            case 'forest':
                colors = ['#00b09b', '#96c93d'];
                break;
            default:
                return;
        }
        colorStops.innerHTML = '';
        colors.forEach((color, index) => createColorStop(color, index));
        updateBackground();
    });

    copyCssBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(cssOutput.textContent).then(() => {
            alert('CSS copied to clipboard!');
        });
    });

    // Initialize color stops
    colors.forEach((color, index) => createColorStop(color, index));
    updateBackground();
});