angular.module("app", [
    "file-upload",
    "files"
  ])
  .component("app", {
    controller: AppCtrl,
    templateUrl: "app/app.tpl.html",
    controllerAs: "vm"
  });


function AppCtrl() {
  const vm = this;
}

angular.element(document).ready(() => {
  angular.bootstrap(document, ["app"]);
});
