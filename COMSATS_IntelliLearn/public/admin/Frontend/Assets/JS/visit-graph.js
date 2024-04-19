// Sample data for weekly, monthly, and yearly visits (replace with actual data)
const weeklyData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
        label: 'Weekly Visits',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: [100, 150, 200, 180, 250, 300, 280], // Replace with actual weekly visit data
    }]
};

const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Monthly Visits',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: [1200, 1500, 1800, 2000, 2200, 2500, 2800, 3000, 2700, 3000, 3200, 3500], // Replace with actual monthly visit data
    }]
};

const yearlyData = {
    labels: ['2021', '2022', '2023'], // Add more years as needed
    datasets: [{
        label: 'Yearly Visits',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [25000, 28000, 32000], // Replace with actual yearly visit data
    }]
};

// Function to create a chart
function createChart(chartId, chartData, chartType) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const myChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create the yearly, monthly, and weekly charts
createChart('yearlyChart', yearlyData, 'bar');
createChart('monthlyChart', monthlyData, 'bar');
createChart('weeklyChart', weeklyData, 'bar');
