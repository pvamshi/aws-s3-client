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

  //===============================
  vm.pageOptions = [2, 5, 10, 20, 50];
  vm.pageSize = vm.pageOptions[0];
  vm.fetchFiles = fetchFiles;
  // vm.$onInit = () => vm.fetchFiles();
  vm.totalPages = 0;
  vm.goToPage = goToPage;
  vm.pageNumber = 1;
  vm.sortFilesAsc = sortFilesAsc;
  vm.sortFilesDesc = sortFilesDesc;
  vm.ascending = 0;
  vm.search = search;
  vm.root = '';
  vm.getFiles = getFiles;
  vm.settings = {};
  vm.settings.pagination = {
    pageSize: 2
  };
  vm.updatePaginationSettings = function(pagination) {
    vm.settings.pagination = pagination;
    fetchFiles();
  }

  vm.updatePageSize = function() {
    vm.settings.pagination.pageSize = vm.pageSize;
  }


  function init() {
    s3.getTotalFilesCount().then(count => vm.totalFilesCount = count);
  }

  function fetchFiles() {
    console.log('fetched files');
    s3.getFiles(vm.root, {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNumber,
        sortFiles: vm.ascending,
        searchStr: vm.queryString
      })
      .then(addFiles)
      .catch(err => console.log(err));
  }

  function goToPage(pageNumber) {
    vm.pageNumber = pageNumber;
    fetchFiles();
  }

  function sortFilesAsc() {
    vm.ascending = 1;
    fetchFiles();
  }

  function sortFilesDesc() {
    vm.ascending = -1;
    fetchFiles();
  }

  function search() {
    fetchFiles();
  }

  function addFiles(data) {
    vm.files = data.files;
    setPageLimits(data.meta);
  }

  function getFiles(folder) {
    vm.root = folder;
    fetchFiles();
  }

  function setPageLimits(meta) {
    vm.pages = {};
    vm.pages.pageNumber = meta.pageNumber;
    vm.pageNumber = meta.pageNumber;
    vm.totalPages = meta.totalPages;
    vm.pages.startingPages = [];
    let startingPageNumber = (~~((meta.pageNumber - 1) / 10)) * 10 + 1;
    let endingPageNumber = meta.totalPages < startingPageNumber + 10 ? meta.totalPages + 1 : startingPageNumber + 10;
    vm.pages.startingPages = _.range(startingPageNumber, endingPageNumber);
    vm.pages.previousPageGroupExists = startingPageNumber !== 1;
    vm.pages.nextPageGroupExists = !(endingPageNumber > meta.totalPages);
  }

}
