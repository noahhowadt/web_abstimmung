<?php
include "common/sendResponse.php";
include "common/db.php";
include "common/allowedMethods.php";
include "common/body.php";

allowedMethods(["POST"]);

if (!isset($body["appointmentId"]) || !isset($body["selectedOptions"]) || !isset($body["name"])) {
  return sendResponse(400, ["error" => "Bad Request"]);
}

$appointmentStmt = $db->prepare("SELECT * FROM appointments WHERE id = ?");
$appointmentStmt->bind_param("i", $body["appointmentId"]);
$appointmentStmt->execute();
$result = $appointmentStmt->get_result();
$appointment = $result->fetch_assoc();
$appointmentStmt->close();

if (!$appointment) {
  return sendResponse(404, ["error" => "Not Found 1"]);
}

$selectedOptions = $body["selectedOptions"];

for ($i = 0; $i < count($selectedOptions); $i++) {
  $optionStmt = $db->prepare("SELECT * FROM voting_options WHERE id = ? AND appointment_id = ?");
  $optionStmt->bind_param("ii", $selectedOptions[$i], $body["appointmentId"]);
  $optionStmt->execute();
  $result = $optionStmt->get_result();
  $option = $result->fetch_assoc();

  if (!$option) {
    return sendResponse(404, ["error" =>  "Not Found 2"]);
  }

  $voteStmt = $db->prepare("INSERT INTO votings (name, comment, voting_option, appointment_id) VALUES (?, ?, ?, ?)");
  $voteStmt->bind_param("ssii", $body["name"], $body["comment"], $selectedOptions[$i], $body["appointmentId"]);
  $voteStmt->execute();
}
$optionStmt->close();
$voteStmt->close();

sendResponse(200, ["message" => count($selectedOptions)]);
