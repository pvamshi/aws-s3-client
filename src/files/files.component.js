
angular.module("files", [
    "file-upload",
    "file-list",
    "page-size",
    "breadcrumbs",
    "pagination",
    "create-folder",
    "filter-size",
    "s3"
  ])
  .component("files", {
    controller: AppCtrl,
    templateUrl: "files/files.tpl.html",
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
  vm.setSizeFilter = setSizeFilter;
  vm.settings = {};
  vm.totalFilesCount = 0;
  vm.settings.sort = {};
  vm.settings.filter = {};
  vm.settings.filter.name = "";
  vm.settings.filter.size = {
    min: "",
    minTimes:1,
    max: "",
    maxTimes:1
  };

  vm.root = "root";

  function setPageSize(pageSize) {
    vm.settings.pageSize = pageSize;
  }

  function setFoler(folder) {
    vm.root = folder;
  }

  function init() {
    console.log('init');
    vm.settings.queryString = "";
    vm.settings.filterSize = "";
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

  function setSizeFilter(filterSettings){
    vm.settings.filter.size = filterSettings;
    fetchFiles();
  }

}

