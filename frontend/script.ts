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
