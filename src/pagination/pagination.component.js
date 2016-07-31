angular.module("pagination", [])
  .component("pagination", {
    controller: PaginationCtrl,
    controllerAs: "vm",
    bindings: {
      totalFilesCount: "<",
      pageSize: "<",
      updateFileList: "&"
    },
    templateUrl: "pagination/pagination.tpl.html"
  });

function PaginationCtrl() {
  const vm = this;
  const PAGECOUNT = 10;

  vm.$onInit = init;
  vm.$onChanges = changed;
  vm.goToPage = goToPage;

  vm.pages = [];
  vm.pageNumber = 1;

  //============================================//

  function init() {
    vm.totalPages = ~~(vm.totalFilesCount / vm.pageSize)+1;
    vm.startingPageNumber = (~~((vm.pageNumber - 1) / PAGECOUNT)) * PAGECOUNT + 1;
    vm.nextStartingPageNumber = vm.totalPages < vm.startingPageNumber + PAGECOUNT ? vm.totalPages + 1 : vm.startingPageNumber + PAGECOUNT;
    vm.pages = _.range(vm.startingPageNumber, vm.nextStartingPageNumber);
    vm.previousPageGroupExists = vm.startingPageNumber !== 1;
    vm.nextPageGroupExists = !(vm.nextStartingPageNumber > vm.totalPages);

    updateFileList();
  }

  function changed() {
    vm.pageNumber = 1;
    init();
  }

  function goToPage(pageNumber) {
    vm.pageNumber = pageNumber;
    if (pageNumber < vm.startingPageNumber ||
      pageNumber === vm.nextStartingPageNumber ||
      pageNumber > vm.nextStartingPageNumber) {
      init();
    }
    updateFileList();
  }

  function updateFileList() {
    if (vm.totalFilesCount && vm.totalFilesCount !== 0) {
      vm.updateFileList({
        pageNumber: vm.pageNumber
      });
    }
  }

}
