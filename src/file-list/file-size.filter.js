angular.module('file-list.file-size', [])
  .filter('filesize', fileSize);

function fileSize() {
  return sizeInBytes => {
    if (sizeInBytes / 1000000000 > 1) {
      return _.round((sizeInBytes / 1000000000)) + ' GB';
    } else if (sizeInBytes / 1000000 > 1) {
      return _.round((sizeInBytes / 1000000)) + ' MB';
    } else if (sizeInBytes / 1000 > 1) {
      return _.round((sizeInBytes / 1000)) + ' KB';
    } else {
      return sizeInBytes + ' B';
    }
  }
}
