document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('parkingChart').getContext('2d');
    let chart;
    const parkhausDropdown = document.createElement('select');
    parkhausDropdown.id = 'parkhausDropdown';
    document.getElementById('button_ph').after(parkhausDropdown);

    // Funktion zum Abrufen und Aktualisieren der Daten
    const fetchDataAndUpdateChart = async (startDate, endDate, parkhaus = null) => {
        let url = `https://781199-5.web.fhgr.ch/endpoint2.php?start_date=${startDate}&end_date=${endDate}`;
        if (parkhaus) {
            url += `&parkplatz=${encodeURIComponent(parkhaus)}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            const labels = [];
            const usagePercentage = [];

            data.forEach(item => {
                item.data.forEach(entry => {
                    labels.push(entry.created);
                    usagePercentage.push(entry.auslastung_prozent);
                });
            });

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'line',
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
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Usage Percentage'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    };

    // Funktion zum Abrufen und Anzeigen der Parkhausnamen im Dropdown
    const fetchAndPopulateDropdown = async () => {
        const url = `https://781199-5.web.fhgr.ch/endpoint2.php?start_date=2024-01-01&end_date=2024-12-31`; // Example dates to get all data

        try {
            const response = await fetch(url);
            const data = await response.json();

            const parkhausNamen = new Set();

            data.forEach(item => {
                parkhausNamen.add(item.title);
            });

            parkhausDropdown.innerHTML = '';

            parkhausNamen.forEach(parkhaus => {
                const option = document.createElement('option');
                option.value = parkhaus;
                option.textContent = parkhaus;
                parkhausDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching the parkhaus names:', error);
        }
    };

    // Event Listener für den Button "1M"
    document.getElementById('button_m').addEventListener('click', () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        const formattedStartOfMonth = startOfMonth.toISOString().split('T')[0];
        const formattedEndOfMonth = endOfMonth.toISOString().split('T')[0];
        const selectedParkhaus = parkhausDropdown.value;

        fetchDataAndUpdateChart(formattedStartOfMonth, formattedEndOfMonth, selectedParkhaus);
    });

    // Event Listener für den Dropdown zum Abrufen der Daten des ausgewählten Parkhauses
    parkhausDropdown.addEventListener('change', () => {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7); // Default to last 7 days
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const selectedParkhaus = parkhausDropdown.value;

        fetchDataAndUpdateChart(formattedStartDate, endDate, selectedParkhaus);
    });

    // Initial Load
    await fetchAndPopulateDropdown();
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // Default to last 7 days
    const formattedStartDate = startDate.toISOString().split('T')[0];
    fetchDataAndUpdateChart(formattedStartDate, endDate, parkhausDropdown.value);
});

