angular.module('file-upload.file-upload-input', [])
  .directive('fileUploadInput', FileUploadInput);

function FileUploadInput() {
  var directive = {
    scope: {
      setFileList: '&',
      setInvalidFiles: '&'
    },
    link: function(scope, elem) {
      const fileInput = elem.find('input')[0];
      fileInput.addEventListener('change', () => {
        let files = fileInput.files;
        // let validFilesList = [];
        let filesList = [];
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          let fileValidity = validateFile(file);
          filesList.push({
            validity: fileValidity,
            file: file
          });
        }
        scope.setFileList({
          files: filesList
        });
        scope.$apply();
      });

      function validateFile(file) {
        var fileValidity = {
          valid: true,
          reason: ''
        };
        // if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
        if(!(/.*\.csv$/.test(file.name) || /.*\.xls$/.test(file.name)) ){
          fileValidity.valid = false;
          fileValidity.reason = "File type need to be either .csv or .xls";
          return fileValidity;
        }
        if (file.size === 0) {
          fileValidity.valid = false;
          fileValidity.reason = "File size cannot be 0";
          return fileValidity;
        }
        if (file.size > 10000000) {
          fileValidity.valid = false;
          fileValidity.reason = "File size cannot exceed 10MB";
        }
        return fileValidity;
      }
    },
    templateUrl: 'file-upload/file-upload-input/file-upload-input.template.html'
  };
  return directive;
}
