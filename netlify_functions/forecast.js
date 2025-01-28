exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const { q1, q2, q3, q4 } = body;

            const quarterlySales = [q1, q2, q3, q4].map(Number);
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

            return {
                statusCode: 200,
                body: JSON.stringify({
                    avgGrowthRate: avgGrowthRate.toFixed(2),
                    totalSales: totalSales.toFixed(2),
                    avgQuarterlySales: avgQuarterlySales.toFixed(2),
                    projectedQuarters: projectedQuarters.map(q => q.toFixed(2)),
                    totalForecastedSales: totalForecastedSales.toFixed(2),
                }),
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input data' }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
};
