angular.module('file-upload', [
    'file-upload.file-upload-input',
    'file-upload.file-upload-status',
    'file-upload.file-upload-warnings',
    's3'
  ])
  .component('fileUpload', {
    controller: FileUploadCtrl,
    controllerAs: 'vm',
    templateUrl: 'file-upload/file-upload.template.html'
  });

FileUploadCtrl.$inject = ['s3Service'];

function FileUploadCtrl(fileUploadService) {
  const vm            = this;
  vm.validFiles = [];
  vm.invalidFiles     = [];
  vm.mainCheckBox     = false;

  vm.setFileList      = fileList => vm.validFiles = fileList.map(file => new FileUpload(file));
  vm.setInvalidFiles  = files => vm.invalidFiles = files;
  vm.uploadAll        = () => vm.validFiles.filter(fs=>fs.validity.valid && fs.selected).forEach(fs => fs.uploadFile());
  vm.uploadAllValid = uploadAllValid;
  vm.selectAll        = selectAll;
  vm.abort = abort;


  class FileUpload {
    constructor(file) {
      this.file          = file.file;
      this.uploadDone    = false;
      this.uploadStarted = false;
      this.percent       = 0;
      this.error         = null;
      this.selected      = false;
      this.validity      = file.validity;
    }
    select(selected){
      this.selected = this.validity.valid && selected;
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

  function uploadAllValid(){
    let validFiles =  vm.validFiles.filter(fs=>fs.validity.valid && fs.selected && !fs.uploadDone);
    return validFiles.length>0 && validFiles.every(file => !file.uploadStarted );
  }

  function selectAll(){
    vm.validFiles.forEach(file => file.select(vm.mainCheckBox));
  }

  function abort(){
    fileUploadService.abortUpload();
  }
}
