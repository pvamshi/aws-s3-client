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
    s3.getTotalFilesCount().then(count => vm.totalFilesCount = count);
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
}
