<?php
include "common/sendResponse.php";
include "common/db.php";
include "common/allowedMethods.php";

allowedMethods(["DELETE"]);

if (!isset($_GET["id"])) {
  sendResponse(400, ["error" => "Bad Request"]);
}

$appointmentId = $db->real_escape_string($_GET["id"]);

// delete votes
$stmt = $db->prepare("DELETE FROM votings WHERE appointment_id = ?");
$stmt->bind_param("i", $appointmentId);
$stmt->execute();
$stmt->close();

// delete voting options
$stmt = $db->prepare("DELETE FROM voting_options WHERE appointment_id = ?");
$stmt->bind_param("i", $appointmentId);
$stmt->execute();
$stmt->close();

// delete appointment
$stmt = $db->prepare("DELETE FROM appointments WHERE id = ?");
$stmt->bind_param("i", $appointmentId);
$stmt->execute();
$stmt->close();


sendResponse(200);
