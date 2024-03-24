<?php
include "common/sendResponse.php";
include "common/body.php";
include "common/db.php";
include "common/allowedMethods.php";

// check if request method is POST
allowedMethods(["POST"]);

// check if required fields are set
if (!isset($body["title"]) || !isset($body["location"]) || !isset($body["expires_at"]) || !isset($body["options"]) || !is_array($body["options"]) || count($body["options"]) < 2) {
  sendResponse(400, ["error" => "Bad Request"]);
}

// create appointment
$stmt = $db->prepare("INSERT INTO appointments (title, location, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $body["title"], $body["location"], $body["expires_at"]);
$stmt->execute();
$stmt->close();

// add voting options
$appointmentId = $db->insert_id;
foreach ($body["options"] as $option) {
  $stmt = $db->prepare("INSERT INTO voting_options (appointment_id, date) VALUES (?, ?)");
  $stmt->bind_param("is", $appointmentId, $option);
  $stmt->execute();
  $stmt->close();
}

sendResponse(201);
