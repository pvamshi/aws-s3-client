angular.module("filter-size", [])
  .component("filterSize", {
    controller: FilterSizeCtl,
    controllerAs: "vm",
    bindings: {
      filterSettings: "<",
      updateFiles: "&"
    },
    templateUrl: "filter-size/filter-size.tpl.html"
  });

function FilterSizeCtl() {
  const vm = this;
  vm.filterFiles = filterFiles;

  vm.options = [{
    text: 'B',
    value: 1
  }, {
    text: 'KB',
    value: 1000
  }, {
    text: 'MB',
    value: 1000000
  }];

  function filterFiles() {
    vm.updateFiles({
      filterSettings: vm.filterSettings
    });
  }
}
