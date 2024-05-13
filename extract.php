<?php

$url = "https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20";

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$output = curl_exec($ch);

curl_close($ch);

$rawdata = json_decode($output, true);
$data = $rawdata['results'];


//echo json_encode($data, JSON_PRETTY_PRINT);
//print_r($data);

$park_data = [];

//echo json_encode ( $data[0]['geo_point_2d']['lat'], true);
foreach ($data as $item) { // Die Schleife "foreach" nimmt jeden Ort in dieser Liste und schaut sich Informationen darüber an
    

if(isset($item['geo_point_2d']['lat']) && isset($item['geo_point_2d']['lon'])&& isset($item['title'])&& isset($item['anteil_frei'])&& isset($item['total'])&& isset($item['auslastung_prozent'])){


//echo $item;
    $latitude = $item['geo_point_2d']['lat'];
    $longitude = $item['geo_point_2d']['lon'];
    $title = $item['title'];
    $free_spaces = $item['free'];
    $total_spaces = $item['total'];
    $auslastung_prozent = $item['auslastung_prozent'];

    $park_data[] = [
        'latitude' => $latitude,
        'longitude' => $longitude, 
        'title' => $title,
        'free_spaces' => $free_spaces,
        'total_spaces' => $total_spaces,
        'auslastung_prozent' => $auslastung_prozent
    ];
    // echo '<br>'.'iteration'.$i.'<br>';
    // echo json_encode ( $item['geo_point_2d']['lat']);
} 

}

echo json_encode($park_data, JSON_PRETTY_PRINT);  
//print_r(json_encode($park_data, JSON_PRETTY_PRINT))

return $park_data;

?>