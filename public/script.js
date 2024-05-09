
const rows = 9;
const cols = 16;
const size = rows * cols;
let imageParts = [];
let imageWidth = 640; // Width of the original image
let imageHeight = 360; // Height of the original image

window.onload = function() {
    initImageParts();
    renderGrid();
    document.getElementById('shuffleButton').addEventListener('click', shuffle);
}

function initImageParts() {
    const partWidth = imageWidth / cols;
    const partHeight = imageHeight / rows;

    for (let i = 0; i < size; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const xPos = -(col * partWidth);
        const yPos = -(row * partHeight);
        imageParts.push({ x: xPos, y: yPos });
    }
}

function renderGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';

    for (let i = 0; i < size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = `${imageWidth / cols}px`; // Set cell width
        cell.style.height = `${imageHeight / rows}px`; // Set cell height
        cell.style.backgroundImage = `url('/image/beach.jpg')`;
        cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`; // Set background size
        cell.style.backgroundPosition = `${imageParts[i].x}px ${imageParts[i].y}px`;
        gridContainer.appendChild(cell);
    }
}

function shuffle() {
    for (let i = imageParts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageParts[i], imageParts[j]] = [imageParts[j], imageParts[i]];
    }
    renderGrid();
}