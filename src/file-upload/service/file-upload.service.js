angular.module('file-upload.service', [])
  .service('fileUploadService', FileUploadService);

FileUploadService.$inject = ['$q'];

function FileUploadService($q) {

  this.getFiles = getFiles;
  this.uploadFile = uploadFile;
  //===========================================================//
  AWS.config.update({
  });
  const bucket = new AWS.S3({
    params: {
      Bucket: 'pvamshi'
    }
  });

  function getFiles(params) {
    let files = sessionStorage.getItem('files');
    if (files) {
      if (!params || params.pageSize < 1 || params.pageNumber < 1) {
        return $q.when({
          meta: params,
          files: files
        });
      }
      let totalFiles = JSON.parse(files);
      let resultFiles = processFiles(totalFiles, params);
      params.totalPages = ~~(totalFiles.length / params.pageSize) + 1;
      return $q.when({
        meta: params,
        files: resultFiles
      });
    }
    const deferred = $q.defer();
    bucket.listObjects((err, data) => {
      //TODO: Refactor this silly conditions
      if (err) {
        deferred.reject(err);
      } else {
        if (data && data.Contents) {
          sessionStorage.setItem('files', JSON.stringify(data.Contents));
          deferred.resolve(processFiles(data.Contents, params));
        } else {
          //TODO: Send proper error
          deferred.reject('no content in data');
        }
      }
    });
    return deferred.promise;
  }

  function processFiles(files, params) {
    if (!!params.searchStr) {
      let regex = new RegExp(params.searchStr.replace(/\./g,'\\.').replace(/\*/g,'.*'));
      files = files.filter(file => regex.test(file.Key));
    }
    if (!params || params.pageNumber < 1 || params.pageSize < 1) {
      return files;
    }
    if (!!params.sortFiles) {
      files = _.orderBy(files, ['Key'], [params.sortFiles > 0 ? 'asc' : 'desc']);
    }
    return files.splice(params.pageSize * (params.pageNumber - 1), params.pageSize);
  }

  function uploadFile(file) {
    const deferred = $q.defer();
    bucket.upload(file)
      .on('httpUploadProgress', evt => deferred.notify(getPercent(evt)))
      .send((err, data) => err ? deferred.reject(err) : deferred.resolve(data));
    return deferred.promise;
  }

  function getPercent(evt) {
    return parseInt((evt.loaded * 100) / evt.total);
  }
}
