<?php

function sendResponse($status = 200, $data)
{
  http_response_code($status);
  echo json_encode($data);
}
