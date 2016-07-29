angular.module('file-upload.service', [])
  .service('fileUploadService', FileUploadService);

FileUploadService.$inject = ['$q'];

function FileUploadService($q) {

  this.getFiles = getFiles;
  this.uploadFile = uploadFile;
  this.getTotalFilesCount = getTotalFilesCount;
  this.getFilesForSettings = getFilesForSettings;
  //===========================================================//
  AWS.config.update({
    accessKeyId: 'AKIAJJNYFH2AX6L3KXSQ',
    secretAccessKey: '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'
  });
  const bucket = new AWS.S3({
    params: {
      Bucket: 'pvamshi'
    }
  });

  function getFilesForSettings(folder, settings){
    
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

  function getFiles(root) {
    let files = sessionStorage.getItem(root || 'root');
    if (files) {
      return $q.when({
        meta: {},
        files: JSON.parse(files)
      });
    }
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

  function processFiles(files, params) {
    return files;
    if (!!params.searchStr) {
      let regex = new RegExp(params.searchStr.replace(/\./g, '\\.').replace(/\*/g, '.*'));
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
