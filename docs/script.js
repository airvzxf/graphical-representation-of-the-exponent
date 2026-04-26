const canvas = document.getElementById('exponentCanvas');
const ctx = canvas.getContext('2d');
const baseInput = document.getElementById('base-input');
const baseVal = document.getElementById('base-val');
const exponentSlider = document.getElementById('exponent-slider');
const exponentVal = document.getElementById('exponent-val');
const mathDisplay = document.getElementById('math-display');
const formulaText = document.getElementById('formula-text');
const resultExplanation = document.getElementById('result-explanation');

let width, height;
let base = parseInt(baseInput.value);
let exponent = parseInt(exponentSlider.value);

// Animación
let targetZoom = 1;
let currentZoom = 0.01;

const groupColors = [
    '#38bdf8', // Paso 0 (Azul)
    '#818cf8', // Paso 1 (Indigo)
    '#c084fc', // Paso 2 (Violeta)
    '#fb7185', // Paso 3 (Rosa)
    '#fbbf24', // Paso 4 (Ámbar)
    '#34d399', // Paso 5 (Esmeralda)
];
function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    if (width === 0 || height === 0) {
        width = 400;
        height = 400;
    }

    // Ajustar el búfer del canvas a la resolución de pantalla
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    // NO asignamos canvas.style.height/width aquí para dejar que CSS (100%) controle el aspecto visual
    // y evitar que el contenedor se deforme al salir de pantalla completa.

    const scale = window.devicePixelRatio;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}


window.addEventListener('resize', resize);
resize();
setTimeout(resize, 100);

function updateUI() {
    base = parseInt(baseInput.value);
    exponent = parseInt(exponentSlider.value);
    baseVal.textContent = base;
    exponentVal.textContent = exponent;

    let result = Math.pow(base, exponent);
    let formattedResult = result < 0.0001 ? result.toExponential(4) : (Number.isInteger(result) ? result.toLocaleString() : result.toFixed(4));

    if (base === 0 && exponent < 0) {
        formattedResult = "Indefinido";
        resultExplanation.textContent = "La división por cero no está definida.";
        formulaText.textContent = "1 / 0";
    } else {
        if (exponent > 0) {
            formulaText.textContent = Array(exponent).fill(base).join(' * ');
            resultExplanation.textContent = `La unidad se expande. Tienes ${formattedResult} unidades de valor 1.`;
        } else if (exponent < 0) {
            formulaText.textContent = `1 / (${Array(Math.abs(exponent)).fill(base).join(' * ')})`;
            resultExplanation.textContent = `La unidad se comprime. Tienes ${Math.pow(base, Math.abs(exponent))} partes de valor ${formattedResult}.`;
        } else {
            formulaText.textContent = "1";
            resultExplanation.textContent = "Representas la unidad base (1).";
        }
    }
    mathDisplay.innerHTML = `${base}<sup>${exponent}</sup> = ${formattedResult}`;

    // Lógica de Zoom Unificada
    const margin = 0.8;
    const minDim = Math.min(width, height) * margin;
    const unitSize = 200;

    // Calculamos cuántos cuadros hay en total (n^|k|)
    const count = Math.max(1, Math.pow(base, Math.abs(exponent)));
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    targetZoom = minDim / Math.max(cols * unitSize, rows * unitSize);
    targetZoom = Math.min(Math.max(targetZoom, 0.01), 1); // No necesitamos zoom mayor a 1 para unidades
}

function drawBlock(x, y, size, color, alpha = 1, label = "") {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = Math.max(0.5, 1 / currentZoom);

    const padding = size * 0.05;
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(x + padding, y + padding, size - padding * 2, size - padding * 2, size * 0.1);
    } else {
        ctx.rect(x + padding, y + padding, size - padding * 2, size - padding * 2);
    }
    ctx.fill();
    ctx.stroke();

    if (label && currentZoom * size > 15) {
        ctx.fillStyle = 'white';
        // Ajustar tamaño de fuente dinámicamente según la longitud del texto
        let fontSize = size * 0.4;
        if (label.length > 3) {
            fontSize = size * (1.2 / label.length);
        }
        // Limitar tamaño mínimo y máximo razonable
        fontSize = Math.min(fontSize, size * 0.4);

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + size / 2, y + size / 2);
    }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    currentZoom += (targetZoom - currentZoom) * 0.1;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(currentZoom, currentZoom);

    const unitSize = 200;

    if (base === 0 && exponent !== 0) {
        // Caso Base 0
        const color = exponent > 0 ? '#334155' : '#ef4444';
        const label = exponent > 0 ? "0" : "!";
        drawBlock(-unitSize/2, -unitSize/2, unitSize, color, 0.5, label);
    } else {
        // Lógica Unificada para Positivos, Negativos y Cero
        const absExponent = Math.abs(exponent);
        const count = Math.pow(base, absExponent);
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const totalW = cols * unitSize;
        const totalH = rows * unitSize;

        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const x = (c * unitSize) - totalW / 2;
            const y = (r * unitSize) - totalH / 2;

            // Lógica de Agrupación Exponencial (Colores)
            let groupIndex = 0;
            if (i > 0 && base > 1) {
                groupIndex = Math.floor(Math.log(i + 0.0001) / Math.log(base)) + 1;
            } else if (i > 0) {
                groupIndex = i;
            }

            const label = exponent < 0 ? `${i + 1}/${count}` : `${i + 1}`;

            drawBlock(x, y, unitSize, groupColors[groupIndex % groupColors.length], 1, label);
        }
    }

    ctx.restore();
    requestAnimationFrame(draw);
}

baseInput.addEventListener('input', updateUI);
exponentSlider.addEventListener('input', updateUI);

// --- FULLSCREEN LOGIC ---
const container = document.getElementById('main-container');
const fsBtn = document.getElementById('fullscreen-btn');

fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Error al intentar activar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// Redimensionar canvas cuando cambia el estado de pantalla completa
document.addEventListener('fullscreenchange', () => {
    setTimeout(resize, 100);
    updateUI();
});

updateUI();
draw();
