angular.module("file-list", [
    "file-list.file-size"
  ])
  .component("fileList", {
    controller: FileListCtrl,
    controllerAs: "vm",
    bindings: {
      files: "<",
      sort: "<",
      setSortSettings: "&",
      setRootFolder: "&"
    },
    templateUrl: "file-list/file-list.template.html"
  });

function FileListCtrl() {
  const vm = this;

  vm.sortFileByNames = sortFile("name");
  vm.sortFileBySize = sortFile("size");
  vm.sortFileByDate = sortFile("lastModified");
  vm.setRoot = setRoot;
  vm.showFolderInput = true;
  //===============================

  function sortFile(param) {
    return () => vm.setSortSettings({
      sortSettings: {
        [param]: vm.sort[param] === "desc" ? "asc" : "desc"
      }
    });
  }

  function setRoot(file){
    vm.setRootFolder({
      root: file.folderPath+'/'+file.name
    });
  }
}
