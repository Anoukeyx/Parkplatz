// document.addEventListener('DOMContentLoaded', () => {
//     const apiUrl = 'https://781199-5.web.fhgr.ch/endpoint.php';
//     const apiUrl2 = 'https://781199-5.web.fhgr.ch/endpoint2.php?start_date=2024-05-13&end_date=2024-05-14'

document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('parkingChart').getContext('2d');

    try {
        const response = await fetch('https://781199-5.web.fhgr.ch/endpoint.php');
        const data = await response.json();

        const labels = data.map(item => item.title);
        const freeSpaces = data.map(item => item.free_spaces);
        const totalSpaces = data.map(item => item.total_spaces);
        const usagePercentage = data.map(item => item.auslastung_prozent);

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Auslastung in Prozent',
                        data: usagePercentage,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Parking Data'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Parking Lots'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Spaces'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    } catch (error) {
        console.error('Error fetching the data:', error);
    }
});

