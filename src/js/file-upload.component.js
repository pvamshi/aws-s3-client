angular.module('file-upload',['file-service'])
  .component('fileUpload', {
    controller: FileUploadController,
    controllerAs:'vm',
    template: `
    <form>
      <label class="label" for="file" >Upload file</label>
      <p class="control">
        <input type="file" ng-model="vm.file" />
      </p>
      <p class="control">
        <button type="submit" ng-click="vm.upload()" value="Upload" class="button is-primary">Upload</button>
      </p>
    </form>
    `
  });

FileUploadController.$inject = ['S3Service'];
function FileUploadController(s3){
  const vm = this;
  vm.upload = function(){
    console.log(vm.file);
  };
}
