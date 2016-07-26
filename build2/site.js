
(function(){
'use strict';

angular.module('mainModule', ['file-upload']).component('app', {
  controller: controller,
  templateUrl: 'html/app.template.html',
  controllerAs: 'vm'
});
function controller(s) {
  var vm = this;
  vm.greetMe = 'Worlde';
  vm.fileUploadFiles = [];
  vm.setFileList = function (files) {
    console.log(files);
    vm.fileUploadFiles = files;
  };
}
angular.element(document).ready(function () {
  angular.bootstrap(document, ['mainModule']);
});
})();

(function(){
'use strict';

angular.module('file-list', []).component('file-list', {
	template: '\n\t\t\t<table class = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class = "mdl-data-table__cell--non-numeric"> Material </th>\n\t\t\t\t\t\t<th>Quantity</th>\n\t\t\t\t\t\t<th> Unit price </th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>\n\t\t\t\t\t\t<td> 25 </td>\n\t\t\t\t\t\t<td>$2.90</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">Plywood (Birch)</td>\n\t\t\t\t\t\t<td> 50 </td>\n\t\t\t\t\t\t<td>$1.25</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">Laminate (Gold on Blue)</td>\n\t\t\t\t\t\t<td> 10 </td>\n\t\t\t\t\t\t<td>$2.35</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n    ',
	controller: FileListCtrl,
	controllerAs: 'vm'
});

function FileListCtrl() {
	var vm = this;
}
})();

(function(){
'use strict';

angular.module('file-list', ['file-service']).component('fileList', {
	template: '\n\t\t\t<table ng-if="vm.files && vm.files.length" class="table is-striped">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class = "mdl-data-table__cell--non-numeric"> File Name \n\t\t\t\t\t\t\t<i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t\t<th>Owner</th>\n\t\t\t\t\t\t<th> Size </th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr ng-repeat="file in vm.files">\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">{{file.Key}}</td>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">{{file.Owner && file.Owner.DisplayName}}</td>\n\t\t\t\t\t\t<td>{{file.Size}}</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n    ',
	controller: FileListCtrl,
	controllerAs: 'vm'
});

FileListCtrl.$inject = ['S3Service'];

function FileListCtrl(s3) {
	var vm = this;
	//===============================

	vm.$onInit = function () {
		s3.getFiles().then(addFiles).catch(function (err) {
			return console.log(err);
		});
	};

	function addFiles(files) {
		console.log(files);
		vm.files = files;
	}
}
})();

(function(){
"use strict";
})();

(function(){
'use strict';

angular.module('file-uploads', ['file-service']).component('fileUploadStatusList', {
  controller: FileUploadStatusList,
  controllerAs: 'vm',
  bindings: {
    fileList: '<'
  },
  template: '\n      <div class="control" ng-repeat="file in vm.uploadFiles">\n        <file-upload-status file= \'file\'  ></file-upload-status>\n      </div>\n      <p class="control">\n        <button type="button"  ng-click="vm.upload()" value="Upload" class="button is-primary">Upload All </button>\n      </p>\n    '
}).component('fileUploadStatus', {
  controller: FileUploadStatus,
  controllerAs: 'vm',
  bindings: {
    file: '<'
  },
  template: '\n        <p class="control" >\n          <label class="label" >{{vm.file.name}}</label>\n        </p>\n        <p class="control" >\n          <progress class="progress is-success" ng-hide="vm.file.status.done"  value="{{vm.file.status.percent}}" max="100">{{vm.file.status.percent}}%</progress>\n          <span ng-show="vm.file.status.done"> Uploaded <i class="fa fa-check is-success" aria-hidden="true"></i> </span>\n        </p>\n        <button type="button"  ng-click="vm.file.upload()" value="Upload" class="button is-primary">Upload</button>\n    '
});

function FileUploadStatusList() {
  var _this = this;

  this.uploadFiles = this.fileList.map(function (file) {
    var fileObj = Object.create(file);
    fileObj.status = {
      done: false,
      percent: 0,
      text: ''
    };
    fileObj.upload = function () {
      s3.uploadFile({
        Key: _this.name,
        ContentType: _this.type,
        Body: file
      }).then(success, error, status);

      function success(data) {
        this.status.text = "done";
        this.status.done = true;
      }

      function error(err) {
        console.log('err' + err);
        this.status.text = "ughhh !! something went wrong";
      }

      function status(percent) {
        console.log('percent' + percent);
        this.status.percent = percent;
      }
    };
    return fileObj;
  });
}

FileUploadStatus.$inject = ['S3Service'];

function FileUploadStatus(s3) {};
})();

(function(){
'use strict';

angular.module('file-upload.directive', []).directive('fileUploads', FileUploadDirective);

function FileUploadDirective() {
  return {
    scope: {
      setFileList: '&'
    },
    link: function link(scope, elem) {
      var fileInput = elem.find('input')[0];
      fileInput.addEventListener('change', function () {
        var files = fileInput.files;
        var filesList = [];
        for (var i = 0; i < files.length; i++) {
          filesList.push(files[i]);
        }
        scope.setFileList({
          files: filesList
        });
        scope.$apply();
      });
    },
    template: '\n      <label class="label" for="file" >Upload file</label>\n      <p class="control">\n        <input type="file" accept=".xls,.csv" multiple="multiple" />\n      </p>\n    '
  };
};
})();

(function(){
'use strict';

angular.module('file-upload', []).component('fileUpload', {
  controller: FileUpload,
  controllerAs: 'vm',
  templateUrl: 'html/file-list/file-list.template.html'
});

function FileUpload() {
  var vm = this;
}
})();

(function(){
'use strict';

var templateHtml = ' \n\t<div class="container">\n    <!--\n    <div class="box">\n        <file-list></file-list>\n    </div>\n    -->\n    <div class="box">\n        <file-upload set-file-list="vm.setFileList(files)" ></file-upload>\n    </div>\n      <div class="box">\n        <file-upload-status-list file-list=\'vm.fileUploadFiles\'> </file-upload-status>\n      </div>\n\n  </div>\n ';
angular.module('mainModule', ['file-list', 'file-upload', 'file-upload.directive']).component('app', {
  controller: controller,
  templateUrl: 'html/app.template.html',
  controllerAs: 'vm'
});
controller.$inject = ['$scope'];
function controller(s) {
  var vm = this;
  vm.greetMe = 'Worlde';
  vm.fileUploadFiles = [];
  vm.setFileList = function (files) {
    console.log(files);
    vm.fileUploadFiles = files;
  };
}
angular.element(document).ready(function () {
  angular.bootstrap(document, ['mainModule']);
});
})();

(function(){
'use strict';

angular.module('file-list', []).component('file-list', {
	template: '\n\t\t\t<table class = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class = "mdl-data-table__cell--non-numeric"> Material </th>\n\t\t\t\t\t\t<th>Quantity</th>\n\t\t\t\t\t\t<th> Unit price </th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>\n\t\t\t\t\t\t<td> 25 </td>\n\t\t\t\t\t\t<td>$2.90</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">Plywood (Birch)</td>\n\t\t\t\t\t\t<td> 50 </td>\n\t\t\t\t\t\t<td>$1.25</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">Laminate (Gold on Blue)</td>\n\t\t\t\t\t\t<td> 10 </td>\n\t\t\t\t\t\t<td>$2.35</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n    ',
	controller: FileListCtrl,
	controllerAs: 'vm'
});

function FileListCtrl() {
	var vm = this;
}
})();

(function(){
'use strict';

angular.module('file-list', ['file-service']).component('fileList', {
	template: '\n\t\t\t<table ng-if="vm.files && vm.files.length" class="table is-striped">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th class = "mdl-data-table__cell--non-numeric"> File Name \n\t\t\t\t\t\t\t<i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>\n\t\t\t\t\t\t</th>\n\t\t\t\t\t\t<th>Owner</th>\n\t\t\t\t\t\t<th> Size </th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr ng-repeat="file in vm.files">\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">{{file.Key}}</td>\n\t\t\t\t\t\t<td class="mdl-data-table__cell--non-numeric">{{file.Owner && file.Owner.DisplayName}}</td>\n\t\t\t\t\t\t<td>{{file.Size}}</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n    ',
	controller: FileListCtrl,
	controllerAs: 'vm'
});

FileListCtrl.$inject = ['S3Service'];

function FileListCtrl(s3) {
	var vm = this;
	//===============================

	vm.$onInit = function () {
		s3.getFiles().then(addFiles).catch(function (err) {
			return console.log(err);
		});
	};

	function addFiles(files) {
		console.log(files);
		vm.files = files;
	}
}
})();

(function(){
"use strict";
})();

(function(){
'use strict';

angular.module('file-upload', ['file-service']).component('fileUploadStatusList', {
  controller: FileUploadStatusList,
  controllerAs: 'vm',
  bindings: {
    fileList: '<'
  },
  template: '\n      <div class="control" ng-repeat="file in vm.uploadFiles">\n        <file-upload-status file= \'file\'  ></file-upload-status>\n      </div>\n      <p class="control">\n        <button type="button"  ng-click="vm.upload()" value="Upload" class="button is-primary">Upload All </button>\n      </p>\n    '
}).component('fileUploadStatus', {
  controller: FileUploadStatus,
  controllerAs: 'vm',
  bindings: {
    file: '<'
  },
  template: '\n        <p class="control" >\n          <label class="label" >{{vm.file.name}}</label>\n        </p>\n        <p class="control" >\n          <progress class="progress is-success" ng-hide="vm.file.status.done"  value="{{vm.file.status.percent}}" max="100">{{vm.file.status.percent}}%</progress>\n          <span ng-show="vm.file.status.done"> Uploaded <i class="fa fa-check is-success" aria-hidden="true"></i> </span>\n        </p>\n        <button type="button"  ng-click="vm.file.upload()" value="Upload" class="button is-primary">Upload</button>\n    '
});

function FileUploadStatusList() {
  var _this = this;

  this.uploadFiles = this.fileList.map(function (file) {
    var fileObj = Object.create(file);
    fileObj.status = {
      done: false,
      percent: 0,
      text: ''
    };
    fileObj.upload = function () {
      s3.uploadFile({
        Key: _this.name,
        ContentType: _this.type,
        Body: file
      }).then(success, error, status);

      function success(data) {
        this.status.text = "done";
        this.status.done = true;
      }

      function error(err) {
        console.log('err' + err);
        this.status.text = "ughhh !! something went wrong";
      }

      function status(percent) {
        console.log('percent' + percent);
        this.status.percent = percent;
      }
    };
    return fileObj;
  });
}

FileUploadStatus.$inject = ['S3Service'];

function FileUploadStatus(s3) {};
})();

(function(){
'use strict';

angular.module('file-upload.directive', []).directive('fileUpload', FileUploadDirective);

function FileUploadDirective() {
  return {
    scope: {
      setFileList: '&'
    },
    link: function link(scope, elem) {
      var fileInput = elem.find('input')[0];
      fileInput.addEventListener('change', function () {
        var files = fileInput.files;
        var filesList = [];
        for (var i = 0; i < files.length; i++) {
          filesList.push(files[i]);
        }
        scope.setFileList({
          files: filesList
        });
        scope.$apply();
      });
    },
    template: '\n      <label class="label" for="file" >Upload file</label>\n      <p class="control">\n        <input type="file" accept=".xls,.csv" multiple="multiple" />\n      </p>\n    '
  };
};
})();

(function(){
'use strict';

angular.module('file-service', []).service('S3Service', S3Service);

S3Service.$inject = ['$q'];

function S3Service($q) {
  this.getFiles = getFiles;
  this.uploadFile = uploadFile;
  //===========================================================//
  AWS.config.update({
    accessKeyId: 'AKIAI5WWDSC5K62JXLLQ',
    secretAccessKey: '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'
  });
  var bucket = new AWS.S3({
    params: {
      Bucket: 'pvamshi'
    }
  });

  function getFiles() {
    var deferred = $q.defer();
    bucket.listObjects(function (err, data) {
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
    var deferred = $q.defer();
    bucket.upload(file).on('httpUploadProgress', function (evt) {
      return deferred.notify(getPercent(evt));
    }).send(function (err, data) {
      return err ? deferred.reject(err) : deferred.resolve(data);
    });
    return deferred.promise;
  }

  function getPercent(evt) {
    return parseInt(evt.loaded * 100 / evt.total);
  }
}
})();

(function(){
'use strict';

var abc = function abc(path) {
  return path + 'hello';
};
})();

(function(){
'use strict';

angular.module('file-service', []).service('S3Service', S3Service);

S3Service.$inject = ['$q'];

function S3Service($q) {
  this.getFiles = getFiles;
  this.uploadFile = uploadFile;
  //===========================================================//
  AWS.config.update({
    accessKeyId: 'AKIAI5WWDSC5K62JXLLQ',
    secretAccessKey: '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'
  });
  var bucket = new AWS.S3({
    params: {
      Bucket: 'pvamshi'
    }
  });

  function getFiles() {
    var deferred = $q.defer();
    bucket.listObjects(function (err, data) {
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
    var deferred = $q.defer();
    bucket.upload(file).on('httpUploadProgress', function (evt) {
      return deferred.notify(getPercent(evt));
    }).send(function (err, data) {
      return err ? deferred.reject(err) : deferred.resolve(data);
    });
    return deferred.promise;
  }

  function getPercent(evt) {
    return parseInt(evt.loaded * 100 / evt.total);
  }
}
})();

(function(){
'use strict';

var abc = function abc(path) {
  return path + 'hello';
};
})();
