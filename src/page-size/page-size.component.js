angular.module("page-size", [])
  .component("pageSize", {
    controller: PageSizeCtrl,
    controllerAs: "vm",
    bindings: {
      setPageSize: "&"
    },
    templateUrl: "page-size/page-size.tpl.html"
  });

function PageSizeCtrl() {
  const vm          = this;

  vm.$onInit        = updatePageSize;
  vm.pageOptions    = [5,10, 20, 50];
  vm.pageSize       = vm.pageOptions[0];
  vm.updatePageSize = updatePageSize;

  function updatePageSize(){
    vm.setPageSize({
      pageSize: vm.pageSize
    });
  }
}
