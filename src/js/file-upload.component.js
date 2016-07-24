angular.module('file-upload', ['file-service'])
  .directive('fileUpload', FileUploadDirective);

FileUploadController.$inject = ['S3Service'];

function FileUploadController(s3) {
  const vm = this;
  vm.upload = function() {
    console.log(vm.file);
  };
}

function link(scope, elem, attr) {
  const vm = scope.vm = {};
  vm.upload = function() {
    console.log(elem.find('input')[0].files);
    const file = elem.find('input')[0].files[0];
    s3.uploadFile({
        Key: file.name,
        ContentType: file.type,
        Body: file
      })
      .then(success, error, status);
    vm.log = '';

    function success(data) {
      vm.status = "done";
    }

    function error(err) {
      vm.status = "ughhh !! something went wrong";
    }

    function status(percent) {
      vm.log += percent + '...';
      vm.status = percent + "% uploaded";
    }
  };
}

FileUploadDirective.$inject = ['S3Service']

function FileUploadDirective(s3) {
  return {
    link: function(scope, elem, attr) {
      const vm = scope.vm = {};
      vm.readyForUpload = function() {
        return elem.find('input').length > 0;
      };
      vm.upload = function() {
        console.log(elem.find('input')[0].files);
        const file = elem.find('input')[0].files[0];
        s3.uploadFile({
            Key: file.name,
            ContentType: file.type,
            Body: file
          })
          .then(success, error, status);
        vm.log = '';

        function success(data) {
          vm.status = "done";
        }

        function error(err) {
          vm.status = "ughhh !! something went wrong";
        }

        function status(percent) {
          vm.log += percent + '...';
          vm.percent = percent;
        }
      };
    },
    template: `
    <form>
      <label class="label" for="file" >Upload file</label>
      <p class="control">
        <input type="file" ng-model="vm.file" accept=".xls,.csv" />
      </p>
      <p class="control">
        <button type="submit"  ng-click="vm.upload()" value="Upload" class="button is-primary">Upload</button>
      </p>
      <p class="control">
        <progress class="progress is-success" value="{{vm.percent}}" max="100">vm.percent%</progress>
      </p>
      <p class="control">
			Status : {{vm.status}}
			Log : {{vm.log}}
      </p>
    </form>
    `
  };
};
