const board = document.querySelector('.game-board');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart');
let score = 0;

function initGame() {
    score = 0;
    scoreDisplay.textContent = score;
    board.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        board.appendChild(tile);
    }
    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    const tiles = document.querySelectorAll('.tile');
    const emptyTiles = Array.from(tiles).filter(tile => !tile.textContent);
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    randomTile.textContent = Math.random() < 0.9 ? 2 : 4;
}

restartButton.addEventListener('click', initGame);

initGame();

// Initialize chart variables
let currentChart = null;
let chartType = 'bar';

// DOM Elements
const form = document.getElementById('calculatorForm');
const spendSlider = document.getElementById('marketingSpend');
const recognitionSlider = document.getElementById('brandRecognition');
const qualitySlider = document.getElementById('contentQuality');
const modelSelect = document.getElementById('modelSelect');
const pieChartBtn = document.getElementById('pieChartBtn');
const barChartBtn = document.getElementById('barChartBtn');
const generateReportBtn = document.getElementById('generateReport');

// Update display values
spendSlider.addEventListener('input', () => {
    document.getElementById('spendValue').textContent = spendSlider.value;
    updateChart();
});

recognitionSlider.addEventListener('input', () => {
    document.getElementById('recognitionValue').textContent = recognitionSlider.value;
    updateChart();
});

qualitySlider.addEventListener('input', () => {
    const qualityLabels = ['Boring', 'Very Dull', 'Dull', 'Basic', 'Average', 'Interesting', 'Engaging', 'Very Engaging', 'Exciting', 'Viral'];
    document.getElementById('qualityValue').textContent = qualityLabels[qualitySlider.value - 1];
    updateChart();
});

modelSelect.addEventListener('change', updateChart);
pieChartBtn.addEventListener('click', () => {
    chartType = 'pie';
    updateChart();
});
barChartBtn.addEventListener('click', () => {
    chartType = 'bar';
    updateChart();
});

// Calculate market reach based on different models
const calculateReach = (spend, recognition, quality, model) => {
    const baseReach = spend * recognition * quality;
    
    switch(model) {
        case 'linear':
            return baseReach * 1.1;
        case 'exponential':
            return baseReach * Math.pow(1.15, quality);
        case 'logarithmic':
            return baseReach * Math.log10(recognition);
        case 'compound':
            return baseReach * (1 + (spend / 10000));
        case 'hybrid':
            return baseReach * (1 + (quality / 10)) * Math.log10(recognition);
        default:
            return baseReach;
    }
};

// Update chart visualization
const updateChart = () => {
    const spend = parseInt(spendSlider.value);
    const recognition = parseInt(recognitionSlider.value);
    const quality = parseInt(qualitySlider.value);
    
    const models = ['linear', 'exponential', 'logarithmic', 'compound', 'hybrid'];
    const reaches = models.map(model => calculateReach(spend, recognition, quality, model));
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    const ctx = document.getElementById('resultChart').getContext('2d');
    const chartConfig = {
        type: chartType,
        data: {
            labels: ['Linear', 'Exponential', 'Logarithmic', 'Compound', 'Hybrid'],
            datasets: [{
                data: reaches,
                backgroundColor: [
                    '#3498db',
                    '#e74c3c',
                    '#2ecc71',
                    '#f1c40f',
                    '#9b59b6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    };
    
    currentChart = new Chart(ctx, chartConfig);
};

// Generate and send PDF report
generateReportBtn.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('emailModal'));
    modal.show();
});

document.getElementById('sendReport').addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    if (!email) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Here you would typically make an API call to your backend to generate and send the PDF
    alert('Report will be sent to ' + email + '\nNote: Backend implementation required for actual PDF generation and email sending');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
    modal.hide();
});

// Initialize the chart on page load
updateChart();
