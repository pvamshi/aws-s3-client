angular.module("app", [
    "file-upload",
    "files",
    "settings"
  ])
  .component("app", {
    controller: AppCtrl,
    templateUrl: "app/app.tpl.html",
    controllerAs: "vm"
  });


function AppCtrl() {
  const vm = this;

  vm.showSettings = true;
  vm.showUpload = true;
  vm.showFiles = false;

  vm.toggleDisplay = toggleDisplay;
  vm.setShowSettings = setShowSettings;

  function toggleDisplay(upload){
    vm.showUpload = upload;
    vm.showFiles = !upload;
  }

  function setShowSettings(showSettings){
    vm.showSettings = showSettings;
  }
}

angular.element(document).ready(() => {
  angular.bootstrap(document, ["app"]);
});
