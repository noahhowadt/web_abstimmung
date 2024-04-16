<?php
function sendResponse($status, $data = null)
{
  http_response_code($status);
  if ($data == null) exit();

  echo json_encode($data);
}
