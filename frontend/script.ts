interface Appointment {
  id: number;
  name: string;
  title: string;
  duration: number;
  location: string;
  description: string;
  expires_at: string;
  options: Array<{
    id: number;
    date: string;
    votes: Array<{ id: number; name: string; comment: string }>;
  }>;
}

// handle the view of the app
let view: "home" | "create" | "view";

const homePage = $("#home-page");
const createPage = $("#create-page");
const viewPage = $("#view-page");
let viewId: null | number = null;
let viewData: null | Appointment = null;

$(".home-link").on("click", () => changeView("home"));
$(".create-link").on("click", () => changeView("create"));
$(".view-link").on("click", () => changeView("view"));

changeView("home");

function changeView(newView: "home" | "create" | "view", id?: number) {
  view = newView;
  homePage.hide();
  createPage.hide();
  viewPage.hide();
  viewId = null;
  viewData = null;

  if (view === "home") homePage.show(), getAppointments();
  if (view === "create") createPage.show();
  if (view === "view") {
    viewPage.show();
    viewId = id || null;

    // get appointment details
    $.get(`../backend/showDetails.php?id=${viewId}`, function (data) {
      // Handle the data returned from showDetails.php
      viewData = JSON.parse(data);
      if (!viewData) {
        alert("Appointment not found");
        changeView("home");
        return;
      }
      $("#view-title").text(viewData.title);
      $("#view-name").text(viewData.name);
      $("#view-duration").text(`Duration: ${viewData.duration} hours`);
      $("#view-location").text(viewData.location);
      $("#view-description").text(viewData.description);
      $("#view-expires_at").text(
        new Date(viewData.expires_at).toLocaleString()
      );
      // fill table body with options checkbox, date, time and votes
      const optionsTableBody = $("#voting-options");
      optionsTableBody.empty();
      for (const option of viewData.options) {
        const optionRow = $(`
          <tr>
            <td>
            <div class="form-check">
            <input type="checkbox" class="form-check-input" data-option-id="${
              option.id
            }">
            </div>
            </td>
            <td>${new Date(option.date).toDateString()}</td>
            <td>${new Date(option.date).toLocaleTimeString()}</td>
            <td>
            Count: <span class="vote-count">
              ${option.votes.length}
            </span>
            <div> ------------------ </div>
            <div class="votes">
              ${option.votes
                .map((vote) => `<div>${vote.name}: ${vote.comment}</div>`)
                .join("")}
            </div>
            </td>
          </tr>
        `);
        optionsTableBody.append(optionRow);
      }
    });
  }
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
        // clear form
        $("#name").val("");
        $("#title").val("");
        $("#duration").val("");
        $("#location").val("");
        $("#description").val("");
        $("#votingEndDate").val("");
        $("#votingEndTime").val("");
        dateOptions.length = 0;
        dateOptionsList.empty();

        changeView("view", JSON.parse(data).id);
      },
    });
  }
}

//Appointments als Liste anzeigen
function getAppointments() {
  $.get("../backend/get-appointments.php", (data) => {
    console.log(data);
    $("#home-page").empty();
    for (const appointment of JSON.parse(data) as Array<Appointment>) {
      const appointmentElement = $(`
      <div class="appointment">
          <h3>${appointment.title} ${
        new Date(appointment.expires_at).getTime() < new Date().getTime()
          ? "(abgelaufen)"
          : ""
      }</h3>
          <p>${appointment.duration} Stunden</p>
          <p>${appointment.location}</p>
          <p>${appointment.description}</p>
          <p>Abstimmung bis ${new Date(
            appointment.expires_at
          ).toDateString()} um ${new Date(
        appointment.expires_at
      ).toTimeString()} Uhr</p>
    <!--incoming added by Dicle-->
          <button type="button" class="details btn btn-secondary" data-id="${
            appointment.id
          }">Details</button>
          <button type="button" class="btn btn-danger delete-appointment" data-id="${
            appointment.id
          }">Löschen</button>
    <!--end-->
      </div>`);
      $("#home-page").append(appointmentElement);
    }
  });
  $(document).on("click", ".details", function () {
    const appointmentId = $(this).data("id");
    changeView("view", appointmentId);
  });

  $(document).on("click", ".delete-appointment", function () {
    $.ajax({
      url: `../backend/delete-appointment.php?id=${$(this).data("id")}`,
      type: "DELETE",
      data: JSON.stringify({ appointmentId: viewId }),
      contentType: "application/json",
      success: function (data) {
        console.log(data);
        changeView("home");
      },
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

$("#vote-btn").on("click", (e) => {
  e.preventDefault();
  // get all checked checkboxes
  const checkedCheckboxes = $("#voting-options input[type=checkbox]:checked");
  const optionIds = checkedCheckboxes
    .map((_, el) => $(el).data("option-id"))
    .get();

  // get name and comment
  const name = $("#vote-name").val() as string;
  const comment = $("#vote-comment").val() as string;

  // check if name is empty
  if (name === "") {
    alert("Bitte geben Sie Ihren Namen ein!");
    return;
  }

  // check if no option is selected
  if (optionIds.length === 0) {
    alert("Bitte wählen Sie mindestens eine Option aus!");
    return;
  }

  // clear form
  $("#vote-name").val("");
  $("#vote-comment").val("");
  checkedCheckboxes.prop("checked", false);

  // send vote
  $.ajax({
    url: "../backend/vote.php",
    type: "POST",
    data: JSON.stringify({
      selectedOptions: optionIds,
      name,
      comment,
      appointmentId: viewId,
    }),
    contentType: "application/json",
    success: function (data) {
      console.log(data);
      changeView("view", viewId as number);
    },
  });
});
