angular.module('file-upload', [
    'file-upload.file-upload-input',
    'file-upload.file-upload-status',
    'file-upload.file-upload-warnings',
    'file-upload.service'
  ])
  .component('fileUpload', {
    controller: FileUploadCtrl,
    controllerAs: 'vm',
    templateUrl: 'file-upload/file-upload.template.html'
  });

FileUploadCtrl.$inject = ['fileUploadService'];

function FileUploadCtrl(fileUploadService) {
  const vm            = this;
  vm.fileUploadStatus = [];
  vm.invalidFiles     = [];

  vm.setFileList      = fileList => vm.fileUploadStatus = fileList.map(file => new FileUpload(file));
  vm.setInvalidFiles  = files => vm.invalidFiles = files;
  vm.uploadAll        = () => vm.fileUploadStatus.forEach(fs => fs.uploadFile());
  vm.uploadAllInvalid = () => vm.fileUploadStatus.every(fileStatus => fileStatus.uploadStarted);

  class FileUpload {
    constructor(file) {
      this.file          = file;
      this.uploadDone    = false;
      this.uploadStarted = false;
      this.percent       = 0;
      this.error         = null;
    }
    uploadFile() {
      if (this.uploadStarted) {
        return;
      }
      this.uploadStarted = true;
      fileUploadService.uploadFile({
          Key:         this.file.name,
          ContentType: this.file.type,
          Body:        this.file
        })
        .then(
          data    => this.uploadDone = true,
          err     => this.error = err,
          percent => this.percent = percent
        );
    }
  }
}
