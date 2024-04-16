<?php
function allowedMethods($methods)
{
  if (!in_array($_SERVER['REQUEST_METHOD'], $methods)) {
    sendResponse(405, ["error" => "Method Not Allowed"]);
    exit();
  }
}
