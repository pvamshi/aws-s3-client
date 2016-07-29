angular.module('file-list.pagination', [])
  .component('pagination', {
    controller:   PaginationCtrl,
    controllerAs: 'vm',
    bindings: {
      files:           '<',
      totalFilesCount: '<',
      pageSize:        '<',
      updateFileList:  '<'
    },
    templateUrl: 'html/file-list/pagination/pagination.template.html'
  });

function PaginationCtrl() {
  const vm      = this;

  vm.$onInit    = init;
  vm.$onChanges = changed;
  vm.goToPage   = goToPage;

  vm.pages      = [];
  vm.pageNumber = 1;

  function init() {
    let totalPages             = vm.totalFilesCount / vm.pageSize;
    let startingPageNumber     = (~~((vm.pageNumber - 1) / 10)) * 10 + 1;
    let nextStartingPageNumber = totalPages < startingPageNumber + 10 ? totalPages + 1 : startingPageNumber + 10;
    vm.pages                   = _.range(startingPageNumber, nextStartingPageNumber);
    vm.previousPageGroupExists = startingPageNumber !== 1;
    vm.nextPageGroupExists     = !(nextStartingPageNumber > totalPages);
    vm.startingPageNumber      = startingPageNumber;
    vm.nextStartingPageNumber  = nextStartingPageNumber;
  }

  function changed() {
    init();
  }

  function goToPage(pageNumber) {
    vm.pageNumber = pageNumber;
    if (pageNumber < vm.startingPageNumber || pageNumber === vm.nextStartingPageNumber || pageNumber > vm.nextStartingPageNumber) {
      init();
    }
  }

}
