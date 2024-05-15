document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('parkingChart').getContext('2d');

    try {
        const response = await fetch('https://781199-5.web.fhgr.ch/endpoint.php');
        const data = await response.json();

        const labels = data.map(item => item.title);
        const usagePercentage = data.map(item => item.auslastung_prozent);

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Auslastung in Prozent',
                        data: usagePercentage,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
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
                    x: {
                        type: 'category',
                        display: true,
                        title: {
                            display: true,
                            text: 'Parking Lots'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Usage Percentage'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                }
            }
        });

         // Event Listener für den Button "Parkhaus wählen"
         document.getElementById('button_ph').addEventListener('click', async () => {
            // Skript script2.js dynamisch laden und ausführen
            const script = document.createElement('script');
            script.src = 'script2.js';
            document.body.appendChild(script);
        });

    } catch (error) {
        console.error('Error fetching the data:', error);
    }
});
