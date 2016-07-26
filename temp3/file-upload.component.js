angular.module('file-uploads', ['file-service'])
  .component('fileUploadStatusList', {
    controller: FileUploadStatusList,
    controllerAs: 'vm',
    bindings: {
      fileList: '<'
    },
    template: `
      <div class="control" ng-repeat="file in vm.uploadFiles">
        <file-upload-status file= 'file'  ></file-upload-status>
      </div>
      <p class="control">
        <button type="button"  ng-click="vm.upload()" value="Upload" class="button is-primary">Upload All </button>
      </p>
    `
  })
  .component('fileUploadStatus', {
    controller: FileUploadStatus,
    controllerAs: 'vm',
    bindings: {
      file: '<'
    },
    template: `
        <p class="control" >
          <label class="label" >{{vm.file.name}}</label>
        </p>
        <p class="control" >
          <progress class="progress is-success" ng-hide="vm.file.status.done"  value="{{vm.file.status.percent}}" max="100">{{vm.file.status.percent}}%</progress>
          <span ng-show="vm.file.status.done"> Uploaded <i class="fa fa-check is-success" aria-hidden="true"></i> </span>
        </p>
        <button type="button"  ng-click="vm.file.upload()" value="Upload" class="button is-primary">Upload</button>
    `
  });

function FileUploadStatusList() {
  this.uploadFiles = this.fileList.map(file => {
    var fileObj = Object.create(file);
    fileObj.status = {
      done: false,
      percent: 0,
      text: '',
    };
    fileObj.upload = () => {
      s3.uploadFile({
          Key: this.name,
          ContentType: this.type,
          Body: file
        })
        .then(success, error, status);

      function success(data) {
        this.status.text = "done";
        this.status.done = true;
      }

      function error(err) {
        console.log('err' + err);
        this.status.text = "ughhh !! something went wrong";
      }

      function status(percent) {
        console.log('percent' + percent);
        this.status.percent = percent;
      }
    };
    return fileObj;
  });
}

FileUploadStatus.$inject = ['S3Service']

function FileUploadStatus(s3) {
};
