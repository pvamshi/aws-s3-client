angular.module('file-upload.file-upload-status',[])
  .component('fileUploadStatus', {
    controller: FileUploadStatus,
    controllerAs: 'vm',
    bindings: {
      fileStatus : '<'
    },
    templateUrl: 'html/file-upload/file-upload-status/file-upload-status.template.html'
  });

function FileUploadStatus(){}
