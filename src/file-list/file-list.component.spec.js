describe("Component: file-list", function() {
  var $componentController;
  beforeEach(module("file-list"));
  beforeEach(module("file-list.file-size"));
  beforeEach(module("file-list/file-list.template.html"));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  var filesMock = [{
    folder: false,
    folderPath: 'root',
    name: 'file.csv',
    size: 1234,
    lastModified: (new Date()).getTime()
  }];
  it("should sort files by name desc when no sort is set", function() {
    var setSortSettingsSpy = jasmine.createSpy('setSortSettings');
    var bindings = {
      files: filesMock,
      sort: {},
      setSortSettings: setSortSettingsSpy,
      setRootFolder: function() {}
    };
    var vm = $componentController('fileList', null, bindings);
    vm.sortFileByNames();
    expect(setSortSettingsSpy).toHaveBeenCalledWith({
      sortSettings: {
        name: "desc"
      }
    });
  });


  it("should sort files by name 'desc' when its asc", function() {
    var setSortSettingsSpy = jasmine.createSpy('setSortSettings');
    var bindings = {
      files: filesMock,
      sort: {
        name: 'asc'
      },
      setSortSettings: setSortSettingsSpy,
      setRootFolder: function() {}
    };
    var vm = $componentController('fileList', null, bindings);
    vm.sortFileByNames();
    expect(setSortSettingsSpy).toHaveBeenCalledWith({
      sortSettings: {
        name: "desc"
      }
    });
  });

  it("should sort files by name 'asc' when its desc", function() {
    var setSortSettingsSpy = jasmine.createSpy('setSortSettings');
    var bindings = {
      files: filesMock,
      sort: {
        name: 'desc'
      },
      setSortSettings: setSortSettingsSpy,
      setRootFolder: function() {}
    };
    var vm = $componentController('fileList', null, bindings);
    vm.sortFileByNames();
    expect(setSortSettingsSpy).toHaveBeenCalledWith({
      sortSettings: {
        name: "asc"
      }
    });
  });

  it("should sort files by size 'asc' when its desc", function() {
    var setSortSettingsSpy = jasmine.createSpy('setSortSettings');
    var bindings = {
      files: filesMock,
      sort: {
        size: 'desc'
      },
      setSortSettings: setSortSettingsSpy,
      setRootFolder: function() {}
    };
    var vm = $componentController('fileList', null, bindings);
    vm.sortFileBySize();
    expect(setSortSettingsSpy).toHaveBeenCalledWith({
      sortSettings: {
        size: "asc"
      }
    });
  });

  it("should sort files by lastModified 'asc' when its desc", function() {
    var setSortSettingsSpy = jasmine.createSpy('setSortSettings');
    var bindings = {
      files: filesMock,
      sort: {
        lastModified: 'desc'
      },
      setSortSettings: setSortSettingsSpy,
      setRootFolder: function() {}
    };
    var vm = $componentController('fileList', null, bindings);
    vm.sortFileByDate();
    expect(setSortSettingsSpy).toHaveBeenCalledWith({
      sortSettings: {
        lastModified: "asc"
      }
    });
  });

  it("should set root folder to selected folder when clicked", function() {

    var setRootSpy = jasmine.createSpy('setRoot');
    var bindings = {
      files: [{
        folder: true,
        folderPath: 'root',
        name: 'folder',
        size: 0,
        lastModified: (new Date()).getTime()
      }],
      sort: {
        lastModified: 'desc'
      },
      setSortSettings:function() {},
      setRootFolder: setRootSpy
    };
    var vm = $componentController('fileList', null, bindings);
    vm.setRoot(bindings.files[0]);
    expect(setRootSpy).toHaveBeenCalledWith({
      root: 'root/folder'
    });
  });

});
