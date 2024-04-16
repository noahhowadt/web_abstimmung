<?php
include "common/sendResponse.php";
include "common/db.php";
include "common/allowedMethods.php";

allowedMethods(["GET"]);

$sql = "SELECT * FROM appointments";
$result = $db->query($sql);
$appointments = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    array_push($appointments, $row);
  }
}

sendResponse(200, $appointments);
