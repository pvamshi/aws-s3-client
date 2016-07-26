angular.module('mainModule', [
    'file-upload'
  ])
  .component('app', {
    controller: controller,
    templateUrl: 'html/app/app.template.html',
    controllerAs: 'vm'
  });
function controller() {
  let vm = this;
  vm.fileUploadFiles = [];
  vm.setFileList = function(files) {
    console.log(files);
    vm.fileUploadFiles= files;
  };
}
angular.element(document).ready(() => {
  angular.bootstrap(document, ['mainModule']);
});
