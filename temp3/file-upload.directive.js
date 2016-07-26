angular.module('file-upload.directive', [])
  .directive('fileUploads', FileUploadDirective);

function FileUploadDirective() {
  return {
    scope: {
      setFileList: '&'
    },
    link: function(scope, elem) {
      const fileInput = elem.find('input')[0];
      fileInput.addEventListener('change', () => {
        let files = fileInput.files;
        let filesList = [];
        for(let i =0; i< files.length; i++){
          filesList.push(files[i]);
        }
        scope.setFileList({
          files: filesList
        });
        scope.$apply();
      });
    },
    template: `
      <label class="label" for="file" >Upload file</label>
      <p class="control">
        <input type="file" accept=".xls,.csv" multiple="multiple" />
      </p>
    `
  };
};
