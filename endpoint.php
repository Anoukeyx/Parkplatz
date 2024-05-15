<?php

require 'config.php';

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  

    $query = "SELECT title, free_spaces, total_spaces, auslastung_prozent  
    FROM Park_Data
    ORDER BY created DESC
    LIMIT 16";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $results = $statement->fetchAll();

echo json_encode($results);
} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
} 


?>