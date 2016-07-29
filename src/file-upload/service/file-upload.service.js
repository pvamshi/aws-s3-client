angular.module('file-upload.service', [])
  .service('fileUploadService', FileUploadService);

FileUploadService.$inject = ['$q'];

function FileUploadService($q) {
  this.uploadFile = uploadFile;
  this.getTotalFilesCount = getTotalFilesCount;
  this.getFilesForSettings = getFilesForSettings;
  //===========================================================//
  AWS.config.update({
  });
  const bucket = new AWS.S3({
    params: {
      Bucket: 'pvamshi'
    }
  });

  function getFilesForSettings(folder, settings) {
    let files = getFilesFromStorage(folder);
    files = filterFiles(files, settings.queryString);
    return $q.when(files.splice(settings.pageSize * (settings.pageNumber - 1), settings.pageSize));
  }

  function getTotalFilesCount(folder) {
    const files = getFilesFromStorage(folder);
    if (files) {
      return $q.when(files.length);
    }
    return fetchFiles().then(response => response && response.files && response.files.length);
  }

  function getFilesFromStorage(folder) {
    const storageFileJsonStr = sessionStorage.getItem(folder || 'root');
    try {
      return JSON.parse(storageFileJsonStr);
    } catch (e) {
      console.error('error while parsing storage json');
    }
    return;

  }

  function filterFiles(files, queryString) {
    if (queryString && files) {
      let regex = new RegExp(queryString.replace(/\./g, '\\.').replace(/\*/g, '.*'));
      files = files.filter(file => regex.test(file.name));
    }
    return files;
  }

  function fetchFiles() {

    const deferred = $q.defer();
    bucket.listObjects((err, data) => {
      if (err) {
        deferred.reject(err);
      } else {
        if (data && data.Contents) {
          saveFiles(data.Contents);
          deferred.resolve({
            files: JSON.parse(sessionStorage.getItem('root')),
            meta: {}
          });
        } else {
          //TODO: Send proper error
          deferred.reject('no content in data');
        }
      }
    });
    return deferred.promise;
  }

  function saveFiles(files) {
    _.chain(files).map(file => getFile(file))
      .reduce(mapFiles, {})
      .forOwn((fileArr, parent) => sessionStorage.setItem(parent, JSON.stringify(fileArr))).value();
  }

  function mapFiles(dataObj, file) {
    dataObj[file.folderPath] = dataObj[file.folderPath] || [];
    dataObj[file.folderPath].push(file);
    return dataObj;
  }

  function getFile(file) {
    console.log(file);
    let folder = false;
    let keySplit = file.Key.split('/');
    let fileName = keySplit.pop();
    if (fileName == '') {
      folder = true;
      fileName = keySplit.pop();
    }
    let parent = 'root' + (keySplit.length > 0 ? '/' + keySplit.join('/') : '');
    return new File(folder, parent, fileName, file.LastModified, file.Size);
  }

  class File {
    constructor(folder, folderPath, name, lastModified, size) {
      this.folder = folder;
      this.folderPath = folderPath;
      this.name = name;
      this.lastModified = lastModified;
      this.size = size;
    }
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
