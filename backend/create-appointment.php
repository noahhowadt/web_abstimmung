<?php
include "common/sendResponse.php";
include "common/body.php";
include "common/db.php";
include "common/allowedMethods.php";

// check if request method is POST
allowedMethods(["POST"]);

// check if required fields are set
if (!isset($body["name"]) || !isset($body["titel"]) || !isset($body["beschreibung"]) || !isset($body["dauer"]) || !isset($body["ort"]) || !isset($body["votingEndDate"]) || !isset($body["votingEndTime"]) || !isset($body["options"]) || !is_array($body["options"]) || count($body["options"]) < 2) {
  return sendResponse(400, ["error" => "Bad Request"]);
}

// create appointment
$stmt = $db->prepare("INSERT INTO appointments (name, title, description, duration, location, expires_at) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiss", $body["name"], $body["title"], $body["description"], $body["duration"], $body["location"], $body["expires_at"]);
$stmt->execute();
$stmt->close();

// add voting options
$appointmentId = $db->insert_id;
foreach ($body["options"] as $option) {
  if (!isset($option["date"])) {
    sendResponse(400, ["error" => "Bad Request"]);
  }
  $stmt = $db->prepare("INSERT INTO voting_options (appointment_id, date) VALUES (?, ?)");
  $stmt->bind_param("is", $appointmentId, $option["date"]);
  $stmt->execute();
  $stmt->close();
}

sendResponse(201);
