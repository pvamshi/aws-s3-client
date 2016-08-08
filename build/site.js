
(function(){
"use strict";

angular.module("app", ["file-upload", "files", "settings"]).component("app", {
  controller: AppCtrl,
  templateUrl: "app/app.tpl.html",
  controllerAs: "vm"
});

function AppCtrl() {
  var vm = this;

  vm.showSettings = true;
  vm.showUpload = true;
  vm.showFiles = false;

  vm.toggleDisplay = toggleDisplay;
  vm.setShowSettings = setShowSettings;

  function toggleDisplay(upload) {
    vm.showUpload = upload;
    vm.showFiles = !upload;
  }

  function setShowSettings(showSettings) {
    vm.showSettings = showSettings;
  }
}

angular.element(document).ready(function () {
  angular.bootstrap(document, ["app"]);
});
})();

(function(){
"use strict";

angular.module("breadcrumbs", []).component("breadcrumbs", {
  controller: BreadcrumbsCtrl,
  controllerAs: "vm",
  bindings: {
    root: "<",
    setFolder: "&"
  },
  templateUrl: "breadcrumbs/breadcrumbs.tpl.html"
});

function BreadcrumbsCtrl() {
  var vm = this;

  vm.$onInit = init;
  vm.$onChanges = init;
  vm.openFolder = openFolder;

  function init() {
    if (!vm.root) {
      return;
    }
    var folders = vm.root.split("/");
    var breadCrumbs = folders.reduce(aggregatepath, []);
    vm.breadCrumbs = _.zip(folders, breadCrumbs);

    function aggregatepath(finalArray, folder) {
      var lastElem = finalArray[finalArray.length - 1];
      finalArray.push(finalArray.length === 0 ? folder : lastElem + "/" + folder);
      return finalArray;
    }
  }

  function openFolder(folder) {
    vm.setFolder({
      folder: folder
    });
  }
}
})();

(function(){
"use strict";

angular.module("create-folder", ["s3"]).component("createFolder", {
  controller: CreateFolderCtrl,
  controllerAs: "vm",
  bindings: {
    root: "<"
  },
  templateUrl: "create-folder/create-folder.tpl.html"
});

CreateFolderCtrl.$inject = ["s3Service"];

function CreateFolderCtrl(s3) {
  var vm = this;

  vm.folderExists = false;
  vm.folderName = "";

  vm.checkFolder = checkFolder;
  vm.createFolder = createFolder;

  function checkFolder() {
    var settings = {
      pageNumber: 1,
      pageSize: 5,
      queryString: "^" + vm.folderName + "$"
    };
    s3.getFilesForSettings(vm.root, settings).then(function (files) {
      return vm.folderExists = files.length > 0;
    });
  }

  function createFolder() {
    s3.createFolder(vm.root, vm.folderName).then(function (files) {
      return console.info("uploaded files" + files);
    });
  }
}
})();

(function(){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module("file-list", ["file-list.file-size"]).component("fileList", {
  controller: FileListCtrl,
  controllerAs: "vm",
  bindings: {
    files: "<",
    sort: "<",
    setSortSettings: "&",
    setRootFolder: "&"
  },
  templateUrl: "file-list/file-list.template.html"
});

function FileListCtrl() {
  var vm = this;

  vm.sortFileByNames = sortFile("name");
  vm.sortFileBySize = sortFile("size");
  vm.sortFileByDate = sortFile("lastModified");
  vm.setRoot = setRoot;
  vm.showFolderInput = true;
  //===============================

  function sortFile(param) {
    return function () {
      return vm.setSortSettings({
        sortSettings: _defineProperty({}, param, vm.sort[param] === "desc" ? "asc" : "desc")
      });
    };
  }

  function setRoot(file) {
    vm.setRootFolder({
      root: file.folderPath + '/' + file.name
    });
  }
}
})();

(function(){
'use strict';

angular.module('file-list.file-size', []).filter('filesize', fileSize);

function fileSize() {
  return function (sizeInBytes) {
    if (sizeInBytes / 1000000000 > 1) {
      return _.round(sizeInBytes / 1000000000) + ' GB';
    } else if (sizeInBytes / 1000000 > 1) {
      return _.round(sizeInBytes / 1000000) + ' MB';
    } else if (sizeInBytes / 1000 > 1) {
      return _.round(sizeInBytes / 1000) + ' KB';
    } else {
      return sizeInBytes + ' B';
    }
  };
}
})();

(function(){
'use strict';

angular.module('file-upload.file-upload-status', []).component('fileUploadStatus', {
  controller: FileUploadStatus,
  controllerAs: 'vm',
  bindings: {
    fileStatus: '<'
  },
  templateUrl: 'file-upload/file-upload-status/file-upload-status.template.html'
});

function FileUploadStatus() {}
})();

(function(){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('file-upload', ['file-upload.file-upload-input', 'file-upload.file-upload-status', 'file-upload.file-upload-warnings', 's3']).component('fileUpload', {
  controller: FileUploadCtrl,
  controllerAs: 'vm',
  templateUrl: 'file-upload/file-upload.template.html'
});

FileUploadCtrl.$inject = ['s3Service'];

function FileUploadCtrl(fileUploadService) {
  var vm = this;
  vm.validFiles = [];
  vm.invalidFiles = [];
  vm.mainCheckBox = false;

  vm.setFileList = function (fileList) {
    return vm.validFiles = fileList.map(function (file) {
      return new FileUpload(file);
    });
  };
  vm.setInvalidFiles = function (files) {
    return vm.invalidFiles = files;
  };
  vm.uploadAll = function () {
    return vm.validFiles.filter(function (fs) {
      return fs.validity.valid && fs.selected;
    }).forEach(function (fs) {
      return fs.uploadFile();
    });
  };
  vm.uploadAllValid = uploadAllValid;
  vm.selectAll = selectAll;
  vm.abort = abort;

  var FileUpload = function () {
    function FileUpload(file) {
      _classCallCheck(this, FileUpload);

      this.file = file.file;
      this.uploadDone = false;
      this.uploadStarted = false;
      this.percent = 0;
      this.error = null;
      this.selected = false;
      this.validity = file.validity;
    }

    _createClass(FileUpload, [{
      key: 'select',
      value: function select(selected) {
        this.selected = this.validity.valid && selected;
      }
    }, {
      key: 'uploadFile',
      value: function uploadFile() {
        var _this = this;

        if (this.uploadStarted) {
          return;
        }
        this.uploadStarted = true;
        fileUploadService.uploadFile({
          Key: this.file.name,
          ContentType: this.file.type,
          Body: this.file
        }).then(function (data) {
          return _this.uploadDone = true;
        }, function (err) {
          return _this.error = err;
        }, function (percent) {
          return _this.percent = percent;
        });
      }
    }]);

    return FileUpload;
  }();

  function uploadAllValid() {
    var validFiles = vm.validFiles.filter(function (fs) {
      return fs.validity.valid && fs.selected && !fs.uploadDone;
    });
    return validFiles.length > 0 && validFiles.every(function (file) {
      return !file.uploadStarted;
    });
  }

  function selectAll() {
    vm.validFiles.forEach(function (file) {
      return file.select(vm.mainCheckBox);
    });
  }

  function abort() {
    fileUploadService.abortUpload();
  }
}
})();

(function(){
"use strict";

angular.module("files", ["file-upload", "file-list", "page-size", "breadcrumbs", "pagination", "create-folder", "filter-size", "s3"]).component("files", {
  controller: AppCtrl,
  templateUrl: "files/files.tpl.html",
  controllerAs: "vm"
});

AppCtrl.$inject = ["s3Service"];

function AppCtrl(s3) {
  var vm = this;

  vm.$onInit = init;
  vm.setPageSize = setPageSize;
  vm.setFolder = setFolder;
  vm.updatePageNumber = updatePageNumber;
  vm.fetchFiles = fetchFiles;
  vm.setSortSettings = setSortSettings;
  vm.setRootFolder = setRootFolder;
  vm.setSizeFilter = setSizeFilter;
  vm.settings = {};
  vm.totalFilesCount = 0;
  vm.settings.sort = {};
  vm.settings.filter = {};
  vm.settings.filter.name = "";
  vm.settings.filter.size = {
    min: "",
    minTimes: 1,
    max: "",
    maxTimes: 1
  };

  vm.root = "root";

  function setPageSize(pageSize) {
    vm.settings.pageSize = pageSize;
  }

  function setFoler(folder) {
    vm.root = folder;
  }

  function init() {
    console.log('init');
    vm.settings.queryString = "";
    vm.settings.filterSize = "";
    s3.getTotalFilesCount(vm.root).then(function (count) {
      return vm.totalFilesCount = count;
    });
  }

  function updatePageNumber(pageNumber) {
    vm.settings.pageNumber = pageNumber;
    fetchFiles();
  }

  function fetchFiles() {
    s3.getFilesForSettings(vm.root, vm.settings).then(function (files) {
      return vm.files = files;
    }).catch(function (err) {
      return console.log(err);
    });
  }

  function setFolder(folder) {
    vm.root = folder;
    init();
  }

  function setSortSettings(sortSettings) {
    vm.settings.sort = sortSettings;
    fetchFiles();
  }

  function setRootFolder(root) {
    vm.root = root;
    init();
  }

  function setSizeFilter(filterSettings) {
    vm.settings.filter.size = filterSettings;
    fetchFiles();
  }
}
})();

(function(){
"use strict";

angular.module("filter-size", []).component("filterSize", {
  controller: FilterSizeCtl,
  controllerAs: "vm",
  bindings: {
    filterSettings: "<",
    updateFiles: "&"
  },
  templateUrl: "filter-size/filter-size.tpl.html"
});

function FilterSizeCtl() {
  var vm = this;
  vm.filterFiles = filterFiles;

  vm.options = [{
    text: 'B',
    value: 1
  }, {
    text: 'KB',
    value: 1000
  }, {
    text: 'MB',
    value: 1000000
  }];

  function filterFiles() {
    vm.updateFiles({
      filterSettings: vm.filterSettings
    });
  }
}
})();

(function(){
"use strict";

angular.module("page-size", []).component("pageSize", {
  controller: PageSizeCtrl,
  controllerAs: "vm",
  bindings: {
    setPageSize: "&"
  },
  templateUrl: "page-size/page-size.tpl.html"
});

function PageSizeCtrl() {
  var vm = this;

  vm.$onInit = updatePageSize;
  vm.pageOptions = [5, 10, 20, 50];
  vm.pageSize = vm.pageOptions[0];
  vm.updatePageSize = updatePageSize;

  function updatePageSize() {
    vm.setPageSize({
      pageSize: vm.pageSize
    });
  }
}
})();

(function(){
"use strict";

angular.module("pagination", []).component("pagination", {
  controller: PaginationCtrl,
  controllerAs: "vm",
  bindings: {
    totalFilesCount: "<",
    pageSize: "<",
    updateFileList: "&"
  },
  templateUrl: "pagination/pagination.tpl.html"
});

function PaginationCtrl() {
  var vm = this;
  var PAGECOUNT = 10;

  vm.$onInit = init;
  vm.$onChanges = changed;
  vm.goToPage = goToPage;

  vm.pages = [];
  vm.pageNumber = 1;

  //============================================//

  function init() {
    vm.totalPages = ~~(vm.totalFilesCount / vm.pageSize) + 1;
    vm.startingPageNumber = ~~((vm.pageNumber - 1) / PAGECOUNT) * PAGECOUNT + 1;
    vm.nextStartingPageNumber = vm.totalPages < vm.startingPageNumber + PAGECOUNT ? vm.totalPages + 1 : vm.startingPageNumber + PAGECOUNT;
    vm.pages = _.range(vm.startingPageNumber, vm.nextStartingPageNumber);
    vm.previousPageGroupExists = vm.startingPageNumber !== 1;
    vm.nextPageGroupExists = !(vm.nextStartingPageNumber > vm.totalPages);

    updateFileList();
  }

  function changed() {
    vm.pageNumber = 1;
    init();
  }

  function goToPage(pageNumber) {
    vm.pageNumber = pageNumber;
    if (pageNumber < vm.startingPageNumber || pageNumber === vm.nextStartingPageNumber || pageNumber > vm.nextStartingPageNumber) {
      init();
    }
    updateFileList();
  }

  function updateFileList() {
    if (vm.totalFilesCount && vm.totalFilesCount !== 0) {
      vm.updateFileList({
        pageNumber: vm.pageNumber
      });
    }
  }
}
})();

(function(){
"use strict";

angular.module("settings", ["s3"]).component("settings", {
  controller: SettingsCtrl,
  controllerAs: "vm",
  bindings: {
    showSettings: "<",
    setShowSettings: "&"
  },
  templateUrl: "settings/settings.tpl.html"
});

SettingsCtrl.$inject = ['s3Service'];

function SettingsCtrl(s3) {
  var vm = this;

  vm.$onInit = init;
  vm.$onChanges = init;
  vm.saveSettings = saveSettings;
  vm.updateShowSettings = updateShowSettings;
  vm.testSettings = testSettings;

  vm.settings;
  vm.loading = false;
  vm.loadingTest = false;

  function init() {
    vm.settings = s3.getSettings;
  }

  function saveSettings() {
    vm.loading = true;
    s3.setSettings({
      accessKeyId: vm.accessKey,
      secretAccessKey: vm.secretKey,
      bucket: vm.bucket
    });
    vm.loading = false;
    vm.updateShowSettings(false);
  }

  function updateShowSettings(show) {
    vm.setShowSettings({
      showSettings: show
    });
  }

  function testSettings() {
    vm.loadingTest = true;
    s3.testSettings({
      accessKeyId: vm.accessKey,
      secretAccessKey: vm.secretKey,
      bucket: vm.bucket
    });
  }
}
})();
