<?php
//show details of an appointment with all date options
include "common/sendResponse.php";
include "common/db.php";
include "common/allowedMethods.php";

allowedMethods(["GET"]);

if (!isset($_GET["id"])) {
  sendResponse(400, ["error" => "Bad Request"]);
}

$appointmentId = $db->real_escape_string($_GET["id"]);

$sql = "SELECT * FROM appointments WHERE id = $appointmentId";
$result = $db->query($sql);
$appointment = $result->fetch_assoc();

if (!$appointment) {
  sendResponse(404, ["error" => "Not Found"]);
}

$sql = "SELECT * FROM voting_options WHERE appointment_id = $appointmentId";
$result = $db->query($sql);
$options = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    array_push($options, $row);
  }
}

$appointment["options"] = $options;

sendResponse(200, $appointment);