angular.module('file-list', [
    'file-upload.service',
    'file-list.file-size',
    'file-list.pagination'
  ])
  .component('fileList', {
    controller: FileListCtrl,
    controllerAs: 'vm',
    templateUrl: 'html/file-list/file-list.template.html'
  });

FileListCtrl.$inject = ['fileUploadService'];

function FileListCtrl(s3) {
  const vm = this;
  vm.totalFilesCount = 0;
  vm.$onInit = init;
  vm.updatePageNumber = updatePageNumber;
  vm.fetchFiles = fetchFiles;
  vm.setRoot = setRoot;
  vm.breadCrumbs = [];
  vm.setFolder = setFolder;
  vm.root = '';
  //===============================
  vm.pageOptions = [2, 5, 10, 20, 50];
  vm.pageSize = vm.pageOptions[0];
  vm.root = '';
  vm.settings = {
    pageSize: vm.pageOptions[0]
  };

  vm.updatePageSize = function() {
    vm.settings.pageSize = vm.pageSize;
  }

  function updatePageNumber(pageNumber) {
    vm.settings.pageNumber = pageNumber;
    fetchFiles();
  }

  function init() {
    vm.settings.queryString = '';
    s3.getTotalFilesCount(vm.root).then(count => vm.totalFilesCount = count);
  }

  function fetchFiles() {
    s3.getFilesForSettings(vm.root, vm.settings)
      .then(addFiles)
      .catch(err => console.log(err));
  }

  function sortFilesAsc() {
    vm.ascending = 1;
    fetchFiles();
  }

  function sortFilesDesc() {
    vm.ascending = -1;
    fetchFiles();
  }

  function addFiles(data) {
    vm.files = data;
  }

  function setRoot(file) {
    vm.root = file.folderPath + '/' + file.name;
    setBreadCrumbs();
    init();
  }

  function setBreadCrumbs() {
    if (!vm.root) {
      return;
    }
    let folders = vm.root.split('/');
    let breadCrumbs = folders.reduce(aggregatepath, []);

    function aggregatepath(finalArray, folder) {
      if (finalArray.length == 0) {
        finalArray.push(folder);
      } else {
        let lastElem = finalArray[finalArray.length - 1];
        finalArray.push(lastElem + '/' + folder);
      }
      return finalArray;
    }
    vm.breadCrumbs = _.zip(folders, breadCrumbs);
  }
  function setFolder(folder){
    vm.root=folder;
    setBreadCrumbs();
    init();
  }
}
