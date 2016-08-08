describe("component : files", function() {
  var $componentController;
  var $rootScope;
  var $q;
  var mockS3;
  beforeEach(function() {
    //Nullifying all module dependencies
    angular.module("file-upload", []);
    angular.module("file-list", []);
    angular.module("page-size", []);
    angular.module("breadcrumbs", []);
    angular.module("pagination", []);
    angular.module("create-folder", []);
    angular.module("filter-size", []);
    angular.module("s3",[]);
  });

  beforeEach(module("files"));
  beforeEach(module("files/files.tpl.html"));


  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it("should get files count on init", function() {
    //creating a simple mock service
    mockS3 = {
      getTotalFilesCount: function() {
        return $q.when(4);
      }
    };
    var vm = $componentController('files', {
      s3Service: mockS3
    }, {});
    vm.$onInit();
    $rootScope.$apply();
    expect(vm.totalFilesCount).toBe(4);
  });
});
