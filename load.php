<?php
include 'extract.php';
require_once 'config.php';

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    $sql = "INSERT INTO Park_Data (latitude, longitude, title, free_spaces, total_spaces, auslastung_prozent) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    foreach ($park_data as $item) {
        $stmt->execute([
            $item['latitude'],
            $item['longitude'],
            $item['title'],
            $item['free_spaces'],
            $item['total_spaces'],
            $item['auslastung_prozent']
        ]);

        //echo "Daten erfolgreich eingefügt.";
    }
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}
