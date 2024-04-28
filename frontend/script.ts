// handle the view of the app
let view: "home" | "create" | "view";

const homePage = $("#home-page");
const createPage = $("#create-page");
const viewPage = $("#view-page");


$(".home-link").on("click", () => changeView("home"));
$(".create-link").on("click", () => changeView("create"));
$(".view-link").on("click", () => changeView("view"));


changeView("home");

function changeView(newView: "home" | "create" | "view") {
  view = newView;
  homePage.hide();
  createPage.hide();
  viewPage.hide();

  if (view === "home") homePage.show(), getAppointments();
  if (view === "create") createPage.show();
  if (view === "view") viewPage.show();
}

// handle create appointment
$("#save-appointment").on("click", saveAppointment);
function saveAppointment(e: JQuery.Event) {
  e.preventDefault();
  console.log("save appointment");
  const name = $("#name").val() as string;
  const title = $("#title").val() as string;
  const duration = $("#duration").val() as string;
  const location = $("#location").val() as string;
  const description = $("#description").val() as string;
  const votingEndDate = $("#votingEndDate").val() as string;
  const votingEndTime = $("#votingEndTime").val() as string;

  const [day, month, year] = votingEndDate.split(".");
  const formattedDate = `${month}/${day}/${year} ${votingEndTime}`;

  const expires_at = new Date(formattedDate);

  const appointmentData = {
    name,
    title,
    duration,
    location,
    description,
    expires_at,
    options: dateOptions.map((date) => date.toISOString()),
  };

  if (
    name === "" ||
    title === "" ||
    duration === "" ||
    location === "" ||
    description === "" ||
    votingEndDate === "" ||
    votingEndTime === "" ||
    dateOptions.length < 2
  ) {
    alert("Bitte füllen Sie alle Felder aus!");
    return;
  } else {
    $.ajax({
      url: "../backend/create-appointment.php",
      type: "POST",
      data: JSON.stringify(appointmentData),
      contentType: "application/json",
      success: function (data) {
        console.log(data);
      },
    });
  }
}

//Appointments als Liste anzeigen
function getAppointments() {
  $.get("../backend/get-appointments.php", (data) => {
    console.log(data);
    $("#home-page").empty();
    for (const appointment of JSON.parse(data)) {
      const appointmentElement = $(`
      <div class="appointment">
          <h3>${appointment.title}</h3>
          <p>${appointment.duration} Stunden</p>
          <p>${appointment.location}</p>
          <p>${appointment.description}</p>
          <p>Abstimmung bis ${new Date(
            appointment.expires_at
          ).toDateString()} um ${new Date(
          appointment.expires_at
        ).toTimeString()} Uhr</p>
    <!--incoming added by Dicle-->
          <button type="button" class="app">Details</button>
    <!--end-->
      </div>`);
      $("#home-page").append(appointmentElement);
    }
  });
  $(document).on('click', '.app', function() {
    const appointmentId = $(this).data('id');
    $.get(`../backend/showDetails.php?id=${appointmentId}`, function(data) {
      // Handle the data returned from showDetails.php
      console.log(data);
    });
  });
}

// handle date options
const dateOptions: Array<Date> = [];
const dateOptionsList = $("#date-options-list");

$("#add-date-option").on("click", () => {
  const dateInputVal = $("#add-date-option-date").val() as string;
  const timeInputVal = $("#add-date-option-time").val() as string;
  // dateInputVal is in format 18.09.2023
  const day = dateInputVal.split(".")[0];
  const month = dateInputVal.split(".")[1];
  const year = dateInputVal.split(".")[2];
  // timeInputVal is in format 14:00
  const hours = timeInputVal.split(":")[0];
  const minutes = timeInputVal.split(":")[1];

  // create date object
  const dateObj = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );
  if (dateObj.toString() === "Invalid Date") {
    alert("Invalid date or time");
    return;
  }
  dateOptions.push(dateObj);
  // show date and time in list
  const dateOption = $(
    `<li class="list-group-item">${dateObj.toDateString()} ${dateObj.toLocaleTimeString()}</li>`
  );
  dateOptionsList.append(dateOption);

  console.log(dateOptions);

  // clear inputs
  $("#add-date-option-date").val("");
  $("#add-date-option-time").val("");
});
