exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }

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

            const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
            const totalSales = quarterlySales.reduce((sum, sale) => sum + sale, 0);
            const avgQuarterlySales = totalSales / 4;

            const forecastedSales = quarterlySales[3] * (1 + avgGrowthRate / 100);
            const projectedQuarters = [];
            let currentQuarterSales = forecastedSales;
            for (let i = 0; i < 4; i++) {
                currentQuarterSales *= (1 + avgGrowthRate / 100);
                projectedQuarters.push(currentQuarterSales);
            }

            const totalForecastedSales = projectedQuarters.reduce((sum, sale) => sum + sale, 0);

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({
                    avgGrowthRate: avgGrowthRate.toFixed(2),
                    totalSales: totalSales.toFixed(2),
                    avgQuarterlySales: avgQuarterlySales.toFixed(2),
                    projectedQuarters: projectedQuarters.map((q) => q.toFixed(2)),
                    totalForecastedSales: totalForecastedSales.toFixed(2),
                }),
            };
        } catch (error) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ error: 'Invalid input data' }),
            };
        }
    } else {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
};