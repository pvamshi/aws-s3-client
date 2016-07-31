angular.module("create-folder", ["s3"])
  .component("createFolder", {
    controller: CreateFolderCtrl,
    controllerAs: "vm",
    bindings: {
      root: "<"
    },
    templateUrl: "create-folder/create-folder.tpl.html"
  });

CreateFolderCtrl.$inject = ["s3Service"];

function CreateFolderCtrl(s3) {
  const vm = this;

  vm.folderExists = false;
  vm.folderName = "";

  vm.checkFolder = checkFolder;
  vm.createFolder = createFolder;

  function checkFolder() {
    let settings = {
      pageNumber: 1,
      pageSize: 5,
      queryString: "^" + vm.folderName + "$"
    };
    s3.getFilesForSettings(vm.root, settings)
      .then(files => vm.folderExists = files.length > 0);
  }

  function createFolder() {
    s3.createFolder(vm.root, vm.folderName)
      .then(files => console.info("uploaded files" + files));
  }
}
