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

$appointmentStmt = $db->prepare("SELECT * FROM appointments WHERE id = ?");
$appointmentStmt->bind_param("i", $appointmentId);
$appointmentStmt->execute();
$result = $appointmentStmt->get_result();
$appointment = $result->fetch_assoc();
$appointmentStmt->close();

if (!$appointment) {
  return sendResponse(404, ["error" => "Not Found"]);
}

$optionsStmt = $db->prepare("SELECT * FROM voting_options WHERE appointment_id = ?");
$optionsStmt->bind_param("i", $appointmentId);
$optionsStmt->execute();
$result = $optionsStmt->get_result();
$optionsStmt->close();
$options = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    array_push($options, $row);
  }
}

$votesStmt = $db->prepare("SELECT * FROM votings WHERE appointment_id = ?");
$votesStmt->bind_param("i", $appointmentId);
$votesStmt->execute();
$result = $votesStmt->get_result();
$votesStmt->close();
$votes = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    array_push($votes, $row);
  }
}

for ($i = 0; $i < count($options); $i++) {
  $options[$i]["votes"] = [];
  for ($j = 0; $j < count($votes); $j++) {
    if ($votes[$j]["voting_option"] == $options[$i]["id"]) {
      array_push($options[$i]["votes"], $votes[$j]);
    }
  }
}

$appointment["options"] = $options;

sendResponse(200, $appointment);
