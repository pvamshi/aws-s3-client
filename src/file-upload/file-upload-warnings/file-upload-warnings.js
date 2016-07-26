angular.module('file-upload.file-upload-warnings',[])
  .component('fileUploadWarnings',{
    controller:FileUploadWarning,
    controllerAs: 'vm',
    bindings: {
      warnings: '<',
      validFileLength:'@'
    },
    templateUrl:'html/file-upload/file-upload-warnings/file-upload-warnings.template.html'
  });
function FileUploadWarning(){
  const vm = this;
  vm.showError = () => (+vm.validFileLength) === 0;  //convert string to number and compare
  vm.showDialog = true;
}
