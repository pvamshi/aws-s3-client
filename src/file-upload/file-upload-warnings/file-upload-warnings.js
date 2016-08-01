angular.module('file-upload.file-upload-warnings', [])
  .component('fileUploadWarnings', {
    controller: FileUploadWarning,
    controllerAs: 'vm',
    bindings: {
      files: '<',
      validFileLength: '@'
    },
    templateUrl: 'file-upload/file-upload-warnings/file-upload-warnings.template.html'
  });

function FileUploadWarning() {
  const vm = this;

  vm.$onInit = vm.$onChanges = init;

  function init() {
    vm.invalidFiles = vm.files.filter(file => !file.validity.valid);
    vm.showError = vm.invalidFiles.length === vm.files.length;
    //TODO: bug: Closing window hides the error page even for next iteration
    
    vm.showDialog = true;
  }
}
