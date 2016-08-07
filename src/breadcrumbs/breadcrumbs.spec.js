describe("Component: breadcrumbs",function(){
  var $componentController;
  beforeEach(module("breadcrumbs"));
  beforeEach(module("breadcrumbs/breadcrumbs.tpl.html"));
  beforeEach(inject(function(_$componentController_){
    $componentController = _$componentController_;
  }));

  it("should build breadcrumbs object",function(){
    var bindings = {root:'abc/def/ghi', setFolder:function(){}};
    var vm = $componentController('breadcrumbs',null,bindings);
    vm.$onInit();
    console.log(vm.breadCrumbs);
    expect(vm.breadCrumbs.length).toBe(3);
    expect(vm.breadCrumbs).toEqual([['abc','abc'],['def','abc/def'],['ghi','abc/def/ghi']]);
  });
  it("should build breadcrumbs object",function(){
    var bindings = {root:'abc', setFolder:function(){}};
    var vm = $componentController('breadcrumbs',null,bindings);
    vm.$onInit();
    console.log(vm.breadCrumbs);
    expect(vm.breadCrumbs.length).toBe(1);
    expect(vm.breadCrumbs).toEqual([['abc','abc']]);
  });
});

describe("Component: breadcrumbs : html", function() {
  var element;
  var scope;
  var compile;

  beforeEach(module("breadcrumbs"));
  beforeEach(module("breadcrumbs/breadcrumbs.tpl.html"));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
    scope.vm = {};
  }));

  it("should display breadcrumbs properly", function() {
    init("abc/def/ghi");
    var breadCrumbText = element.find("a");
    expect(breadCrumbText.length).toBe(3);
    expect(breadCrumbText[0].text).toBe("abc /");
    expect(breadCrumbText[1].text).toBe("def /");
    expect(breadCrumbText[2].text).toBe("ghi /");
    console.log(element.scope().vm);
  });

  it("should not display breadcrumbs when root is falsy", function() {
    init("");
    var breadCrumbText = element.find("a");
    expect(breadCrumbText.length).toBe(0);
  });

  it("should not display breadcrumbs when root is 'root'", function() {
    init("root");
    var breadCrumbDiv = element.find("div");
    expect(breadCrumbDiv.length).toBe(1);
    expect(breadCrumbDiv[0].className).toBeTruthy();
    expect(breadCrumbDiv[0].className.split(' ')).toContain('ng-hide');

  });

  function init(root) {
    scope.vm.setFolder = function(folder) {};
    element = compile(angular.element("<breadcrumbs root='vm.root' set-folder = 'vm.setFolder(folder)' ><breadcrumbs>"))(scope);
    scope.vm.root = root;
    scope.$apply();
  }

});

