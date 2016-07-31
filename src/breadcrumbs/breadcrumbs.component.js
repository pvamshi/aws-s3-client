angular.module("breadcrumbs", [])
  .component("breadcrumbs", {
    controller: BreadcrumbsCtrl,
    controllerAs: "vm",
    bindings: {
      root: "<",
      setFolder: "&"
    },
    templateUrl: "breadcrumbs/breadcrumbs.tpl.html"
  });

function BreadcrumbsCtrl() {
  const vm = this;

  vm.$onInit = init;
  vm.$onChanges = init;
  vm.openFolder = openFolder;

  function init() {
    if (!vm.root) {
      return;
    }
    let folders = vm.root.split("/");
    let breadCrumbs = folders.reduce(aggregatepath, []);
    vm.breadCrumbs = _.zip(folders, breadCrumbs);

    function aggregatepath(finalArray, folder) {
      const lastElem = finalArray[finalArray.length - 1];
      finalArray.push(finalArray.length === 0 ? folder : lastElem + "/" + folder);
      return finalArray;
    }
  }

  function openFolder(folder) {
    vm.setFolder({
      folder: folder
    });
  }
}
