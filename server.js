const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Basic health check route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Advanced forecast route
app.post('/api/forecast', (req, res) => {
    const { q1, q2, q3, q4 } = req.body;

    // Ensure all quarters are numbers
    const quarterlySales = [q1, q2, q3, q4].map(Number);

    // Calculate growth rates
    const growthRates = [];
    for (let i = 1; i < quarterlySales.length; i++) {
        const growth = ((quarterlySales[i] - quarterlySales[i - 1]) / quarterlySales[i - 1]) * 100;
        growthRates.push(growth);
    }

    const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
    const totalSales = quarterlySales.reduce((a, b) => a + b, 0);
    const avgQuarterlySales = totalSales / 4;

    // Project next year's sales
    let nextQuarter = quarterlySales[3] * (1 + avgGrowthRate / 100);
    const projectedQuarters = [nextQuarter];
    for (let i = 1; i < 4; i++) {
        nextQuarter *= (1 + avgGrowthRate / 100);
        projectedQuarters.push(nextQuarter);
    }

    const totalForecastedSales = projectedQuarters.reduce((a, b) => a + b, 0);

    res.json({
        avgGrowthRate: avgGrowthRate.toFixed(2),
        totalSales: totalSales.toFixed(2),
        avgQuarterlySales: avgQuarterlySales.toFixed(2),
        projectedQuarters: projectedQuarters.map(q => q.toFixed(2)),
        totalForecastedSales: totalForecastedSales.toFixed(2),
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
