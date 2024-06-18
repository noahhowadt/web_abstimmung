<?php
include "common/sendResponse.php";
include "common/db.php";
include "common/allowedMethods.php";
include "common/body.php";

allowedMethods(["POST"]);

if (!isset($body["appointmentId"]) || !isset($body["selectedOptions"]) || !isset($body["name"])) {
  sendResponse(400, ["error" => "Bad Request"]);
  return;
}

$appointmentStmt = $db->prepare("SELECT * FROM appointments WHERE id = ?");
$appointmentStmt->bind_param("i", $body["appointmentId"]);
$appointmentStmt->execute();
$result = $appointmentStmt->get_result();
$appointment = $result->fetch_assoc();
$appointmentStmt->close();

if (!$appointment) {
  sendResponse(404, ["error" => "Not Found 1"]);
  return;
}

if ($appointment["expires_at"] < date("Y-m-d H:i:s")) {
  sendResponse(400, ["error" => "Appointment has expired"]);
  return;
}

$selectedOptions = $body["selectedOptions"];

$optionStmt = $db->prepare("SELECT * FROM votings WHERE appointment_id = ? AND name = ?");
$voteStmt = $db->prepare("INSERT INTO votings (name, comment, voting_option, appointment_id) VALUES (?, ?, ?, ?)");
for ($i = 0; $i < count($selectedOptions); $i++) {
  $optionStmt->bind_param("ii", $selectedOptions[$i], $body["appointmentId"]);
  $optionStmt->execute();
  $result = $optionStmt->get_result();
  $option = $result->fetch_assoc();

  if (!$option) {
    sendResponse(404, ["error" =>  "Not Found 2"]);
    return;
  }

  $voteStmt->bind_param("ssii", $body["name"], $body["comment"], $selectedOptions[$i], $body["appointmentId"]);
  $voteStmt->execute();
}
$optionStmt->close();
$voteStmt->close();

sendResponse(200, ["message" => count($selectedOptions)]);
