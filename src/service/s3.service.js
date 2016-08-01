angular.module("s3", [])
  .service("s3Service", FileUploadService);

FileUploadService.$inject = ["$q"];

function FileUploadService($q) {
  this.uploadFile = uploadFile;
  this.getTotalFilesCount = getTotalFilesCount;
  this.getFilesForSettings = getFilesForSettings;
  this.createFolder = createFolder;
  this.abortUpload = abortUpload;
  this.getSettings = getSettings;
  this.setSettings = setSettings;

  let storedSettings;

  //===========================================================//

  let bucket;

  function getFilesForSettings(folder, settings) {
    let files = getFilesFromStorage(folder);
    files = filterFiles(files, settings.filter);
    files = sort(files, settings.sort);
    return $q.when(files.splice(settings.pageSize * (settings.pageNumber - 1), settings.pageSize));
  }

  function sort(files, sortSettings) {
    if (!sortSettings) {
      return files;
    }
    return _.orderBy(files, _.keys(sortSettings), _.keys(sortSettings).map(k => sortSettings[k]));
  }

  function getTotalFilesCount(folder) {
    const files = getFilesFromStorage(folder);
    if (files) {
      return $q.when(files.length);
    }
    return fetchFiles().then(response => response && response.files && response.files.length);
  }

  function getFilesFromStorage(folder) {
    const storageFileJsonStr = sessionStorage.getItem(folder || "root");
    try {
      return JSON.parse(storageFileJsonStr);
    } catch (e) {
      console.error("error while parsing storage json");
    }
    return;

  }

  function filterFiles(files, filterSettings) {
    if (filterSettings && filterSettings.name && files) {
      let regex = new RegExp(filterSettings.name.replace(/\./g, "\\.").replace(/\*/g, ".*"));
      files = files.filter(file => regex.test(file.name));
    }
    if (filterSettings && files && filterSettings.size) {
      if (filterSettings.size.min && filterSettings.size.min > 0) {
        files = files.filter(file => file.size > (filterSettings.size.min * filterSettings.size.minTimes));
      }
      if (filterSettings.size.max && filterSettings.size.max > 0) {
        files = files.filter(file => file.size < (filterSettings.size.max * filterSettings.size.maxTimes));
      }
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
            files: JSON.parse(sessionStorage.getItem("root")),
            meta: {}
          });
        } else {
          //TODO: Send proper error
          deferred.reject("no content in data");
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
    let folder = false;
    let keySplit = file.Key.split("/");
    let fileName = keySplit.pop();
    if (fileName == "") {
      folder = true;
      fileName = keySplit.pop();
    }
    let parent = "root" + (keySplit.length > 0 ? "/" + keySplit.join("/") : "");
    return new File(folder, parent, fileName, file.LastModified, file.Size);
  }

  class File {
    constructor(folder, folderPath, name, lastModified, size) {
      this.folder = folder;
      this.folderPath = folderPath;
      this.name = name;
      this.lastModified = new Date(lastModified).getTime();
      this.size = size;
    }
  }

  let req;

  function uploadFile(file) {
    const deferred = $q.defer();
    req = bucket.putObject(file)
      .on("httpUploadProgress", evt => deferred.notify(getPercent(evt)))
      .send((err, data) => err ? deferred.reject(err) : deferred.resolve(data));
    return deferred.promise;
  }

  function abortUpload() {
    req.request.abort();
  }

  function createFolder(root, folder) {
    let folderKey = "";
    if (root && root !== "root") {
      folderKey = root + "/" + folder + "/";
    } else {
      folderKey = "pvamshi/" + folder + "/";
    }
    bucket.createBucket({
      Bucket: folderKey
    }, function(err, data) {
      console.log("bucket creation: " + err ? "FAIL" : "SUCCESS");
    });
  }

  function getPercent(evt) {
    return parseInt((evt.loaded * 100) / evt.total);
  }

  function getSettings() {
    return storedSettings;
  }

  function setSettings(settings) {
    storedSettings = settings;
    AWS.config.update({
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey
    });
    bucket = new AWS.S3({
      params: {
        Bucket: "pvamshi"
      }
    });

  }

}
