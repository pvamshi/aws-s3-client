angular.module('file-service', [])
  .service('S3Service', S3Service);

S3Service.$inject = ['$q'];

function S3Service($q) {
  this.getFiles = getFiles;
  this.uploadFile = uploadFile;
  //===========================================================//
  AWS.config.update({
    accessKeyId: 'AKIAI5WWDSC5K62JXLLQ',
    secretAccessKey: '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'
  });
  const bucket = new AWS.S3({
    params: {
      Bucket: 'pvamshi'
    }
  });

  function getFiles() {
    const deferred = $q.defer();
    bucket.listObjects((err, data) => {
      //TODO: Refactor this silly conditions
      if (err) {
        deferred.reject(err);
      } else {
        if (data && data.Contents) {
          deferred.resolve(data.Contents);
        } else {
          //TODO: Send proper error
          deferred.reject('no content in data');
        }
      }
    });
    return deferred.promise;
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
