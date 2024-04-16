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

function saveAppointment() {
  const namen = $("#name").val() as string;
  const titel = $("#titel").val() as string;
  const date = $("#date").val() as string;
  const beginTime = $("#beginTime").val() as string;
  const dauer = $("#dauer").val() as string;
  const ort = $("#ort").val() as string;
  const beschreibung = $("#beschreibung").val() as string;

  const appointmentData = {
    namen,
    titel,
    date,
    beginTime,
    dauer,
    ort,
    beschreibung,
  };

  if (
    namen === "" ||
    titel === "" ||
    date === "" ||
    beginTime === "" ||
    dauer === "" ||
    ort === "" ||
    beschreibung === ""
  ) {
    alert("Bitte füllen Sie alle Felder aus!");
    return;
  } else {
    $.post("/create-appointment.php", appointmentData, (data) => {
      console.log(data);
    });
  }
}
