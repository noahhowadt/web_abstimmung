// handle the view of the app
let view: "home" | "create" | "view" = "home";

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

  if (view === "home") homePage.show();
  if (view === "create") createPage.show();
  if (view === "view") viewPage.show();
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
