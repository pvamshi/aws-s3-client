angular.module('file-list', [
    'file-upload.service'
  ])
  .component('fileList', {
    controller: FileListCtrl,
    controllerAs: 'vm',
    templateUrl: 'html/file-list/file-list.template.html'
  });

FileListCtrl.$inject = ['fileUploadService'];

function FileListCtrl(s3) {
  const vm = this;
  //===============================
  vm.pageOptions = [5, 10, 20, 50];
  vm.pageSize = vm.pageOptions[0];
  vm.fetchFiles = fetchFiles;
  vm.$onInit = () => vm.fetchFiles();
  vm.totalPages = 0;
  vm.goToPage = goToPage;
  vm.pageNumber = 1;
  vm.sortFilesAsc = sortFilesAsc;
  vm.sortFilesDesc = sortFilesDesc;
  vm.ascending = 0;
  vm.search  = search;

  function fetchFiles() {
    console.log('fetched files');
    s3.getFiles({
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

  function setPageLimits(meta) {
    vm.pages = {};
    // vm.pages.firstSpace = true;
    // vm.pages.lastSpace = true;
    // vm.pages.endPages = false;
    // vm.pages.pageNumber = meta.pageNumber;
    // const total = meta.totalPages;
    // if (total < 11) {
    //   vm.pages.firstSpace = false;
    //   vm.pages.lastSpace = false;
    //   vm.pages.startingPages = _.range(1, total + 1);
    // } else {
    //   vm.pages.startingPages = [1];
    //   vm.pages.lastPages = [total];
    //   if (meta.pageNumber === 2) {
    //     vm.pages.firstSpace = false;
    //   }
    //   if (meta.pageNumber === meta.total - 1) {
    //     vm.pages.lastSpace = false;
    //   }
    //   if (meta.pageNumber == 1 || meta.pageNumber == total){
    //     vm.pages.startingPages=[1,2];
    //     vm.pages.endPages = true;
    //   }
    // }
    vm.pages.pageNumber = meta.pageNumber;
    vm.pageNumber = meta.pageNumber;
    vm.totalPages = meta.totalPages;
    vm.pages.startingPages = [];
    if (meta.pageNumber < 11) {
      vm.pages.startingPages = _.range(1, meta.totalPages < 11 ? meta.totalPages : 11);
    } else if (meta.pageNumber > meta.totalPages - 10) {
      vm.pages.startingPages = _.range(meta.totalPages - 10, meta.totalPages);
    } else {

    }
  }

}
