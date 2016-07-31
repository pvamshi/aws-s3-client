angular.module("app", [
    "file-upload",
    "file-list",
    "page-size",
    "breadcrumbs",
    "pagination",
    "s3"
  ])
  .component("app", {
    controller: AppCtrl,
    templateUrl: "app/app.tpl.html",
    controllerAs: "vm"
  });

AppCtrl.$inject = ["s3Service"];

function AppCtrl(s3) {
  const vm = this;

  vm.$onInit = init;
  vm.setPageSize = setPageSize;
  vm.setFolder = setFolder;
  vm.updatePageNumber = updatePageNumber;
  vm.fetchFiles = fetchFiles;
  vm.setSortSettings = setSortSettings;
  vm.setRootFolder = setRootFolder;
  vm.settings = {};
  vm.totalFilesCount = 0;
  vm.settings.sort = {};

  function setPageSize(pageSize) {
    vm.settings.pageSize = pageSize;
  }

  function setFoler(folder) {
    vm.root = folder;
  }

  function init() {
    vm.settings.queryString = "";
    s3.getTotalFilesCount(vm.root).then(count => vm.totalFilesCount = count);
  }

  function updatePageNumber(pageNumber) {
    vm.settings.pageNumber = pageNumber;
    fetchFiles();
  }

  function fetchFiles() {
    s3.getFilesForSettings(vm.root, vm.settings)
      .then(files => vm.files = files)
      .catch(err => console.log(err));
  }

  function setFolder(folder) {
    vm.root = folder;
    init();
  }

  function setSortSettings(sortSettings) {
    vm.settings.sort = sortSettings;
    fetchFiles();
  }

  function setRootFolder(root) {
    vm.root = root;
    init();
  }

}


angular.element(document).ready(() => {
  angular.bootstrap(document, ["app"]);
});
