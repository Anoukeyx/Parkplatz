<?php

require 'config.php';

// Define the start and end dates for the timespan
$start_date = $_GET['start_date']; // Assuming you pass this in the URL in 'YYYY-MM-DD' format
$end_date = $_GET['end_date']; // Assuming you pass this in the URL in 'YYYY-MM-DD' format
$parkplatz = isset($_GET['parkplatz']) ? $_GET['parkplatz'] : null; // Optional parkplatz parameter

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Modify the query to include both created and auslastung_prozent in the GROUP_CONCAT
    $query = "SELECT title, GROUP_CONCAT(CONCAT(created, '|', auslastung_prozent) ORDER BY created) AS created_auslastung
              FROM Park_Data
              WHERE DATE(created) BETWEEN :start_date AND :end_date";

    if ($parkplatz) {
        $query .= " AND title = :parkplatz";
    }

    $query .= " GROUP BY title";
    
    $statement = $pdo->prepare($query);
    $statement->bindParam(':start_date', $start_date);
    $statement->bindParam(':end_date', $end_date);
    if ($parkplatz) {
        $statement->bindParam(':parkplatz', $parkplatz);
    }
    $statement->execute();
    $results = $statement->fetchAll(PDO::FETCH_ASSOC);

    // Process the results to create the desired array of objects
    foreach ($results as &$result) {
        $created_auslastung = explode(',', $result['created_auslastung']);
        $data = [];
        foreach ($created_auslastung as $item) {
            list($created, $auslastung_prozent) = explode('|', $item);
            $data[] = [
                'created' => $created,
                'auslastung_prozent' => $auslastung_prozent
            ];
        }
        $result['data'] = $data;
        unset($result['created_auslastung']);
    }

    echo json_encode($results);
} catch (PDOException $e) {
    // Return an error message if something goes wrong
    echo json_encode(['error' => $e->getMessage()]);
}
