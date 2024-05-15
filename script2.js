


document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('parkingChart').getContext('2d');
    let chart;
    const parkhausDropdown = document.createElement('select');
    parkhausDropdown.id = 'parkhausDropdown';
    document.getElementById('button_ph').after(parkhausDropdown);

    // h1 Element befüllen
    const updateTitle = (parkhausName) => {
        const titleElement = document.getElementById('parkhausTitle');
        titleElement.textContent = `Auslastung vom ${parkhausName}`;
    };

    

    // Function für Data Fetch und Chart Update
    const fetchDataAndUpdateChart = async (startDate, endDate, parkhaus = null, displayTime = true, lineColor = 'rgba(255, 159, 64, 1)') => {
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
                    const date = new Date(entry.created);
                    let formattedDate = '';
                    if (displayTime) {
                        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                        formattedDate = date.toLocaleString('de-DE', options);
                    } else {
                        formattedDate = date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
                    }
    
                    labels.push(formattedDate);
                    usagePercentage.push(entry.auslastung_prozent);
                });
            });

    // Mobil Anpassung Charthöhe
    let canvasHeight = 500; // Default height
        if (window.innerWidth < 576) {
        canvasHeight = 500; // Adjust for smaller screens
        }

    // Canvas höhe
    ctx.canvas.height = canvasHeight;
            

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: usagePercentage,
                            borderColor: lineColor,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 

                    title: {
                        display: true,
                        text: 'Parking Data',
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Zeitpunkt',
                                color: 'rgba(232, 224, 204, 1)',
                                font: {
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                color: 'rgba(232, 224, 204, 0.2)' 
                            },
                            ticks: {
                                color: 'rgba(232, 224, 204, 1)' 
                            }
                            
                        },
                        
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Auslastung in Prozent',
                                color: 'rgba(232, 224, 204, 1)',
                                font: {
                                    weight: 'bold'
                                }
                            },
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(232, 224, 204, 0.2)'
                            },
                            ticks: {
                                color: 'rgba(232, 224, 204, 1)' 
                            }
                        },
                        
                    },
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: 'rgba(232, 224, 204, 1)'
                            }
                        }
                    },
                }
            });

            // Parkhaus Name im Titel aktualisieren
            if (parkhaus) {
                updateTitle(parkhaus);
            }

        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    };

    // Funktion Dropdown mit Parkhaus namen
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

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = ' ';
            parkhausDropdown.appendChild(emptyOption);

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

    // Fetch Data für ausgewähltes Parkhaus
    parkhausDropdown.addEventListener('change', () => {
        const selectedParkhaus = parkhausDropdown.value;
        if (selectedParkhaus !== '') { 
            const today = new Date();
            const endDate = today.toISOString().split('T')[0];
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - 7); // Default to last 7 days
            const formattedStartDate = startDate.toISOString().split('T')[0];
            fetchDataAndUpdateChart(formattedStartDate, endDate, selectedParkhaus);
        }
    });

    // Event listener für "1M" button
    document.getElementById('button_m').addEventListener('click', () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        const formattedStartOfMonth = startOfMonth.toISOString().split('T')[0];
        const formattedEndOfMonth = endOfMonth.toISOString().split('T')[0];
        const selectedParkhaus = parkhausDropdown.value;

        fetchDataAndUpdateChart(formattedStartOfMonth, formattedEndOfMonth, selectedParkhaus, false, 'rgba(242, 120, 92)'); // Set line color to rgba(242, 120, 92)
    });

    // Event listener für "1W" button
    document.getElementById('button_w').addEventListener('click', () => {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7); // Current week
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const selectedParkhaus = parkhausDropdown.value;

        fetchDataAndUpdateChart(formattedStartDate, endDate, selectedParkhaus, false, 'rgba(250, 140, 153)'); 
    });

    // Event listener für "24H" button
    document.getElementById('button_h').addEventListener('click', () => {
        const endDate = new Date().toISOString(); // Current date and time
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1); // Date 24 hours ago
        const formattedStartDate = startDate.toISOString();
        const selectedParkhaus = parkhausDropdown.value;

        fetchDataAndUpdateChart(formattedStartDate, endDate, selectedParkhaus), 'rgba(242, 186, 92)'; // Show time
    });

    // Laden der Seite
    await fetchAndPopulateDropdown();
});

