describe("filter: file-size", function(){
  var $filter; 
  beforeEach(module("file-list.file-size"));
  beforeEach(inject(function(_$filter_){
    $filter = _$filter_;
  }));
  it("should convert bytes number to string in kb", function(){
    var result = $filter('filesize')(10000);
    expect(result).toBe('10 KB');
  });
  it("should convert bytes number to string in kb", function(){
    var result = $filter('filesize')(10000000);
    expect(result).toBe('10 MB');
  });
  it("should convert bytes number to string in kb", function(){
    var result = $filter('filesize')(10000000000);
    expect(result).toBe('10 GB');
  });
  it("should convert bytes number to string in kb", function(){
    var result = $filter('filesize')(10);
    expect(result).toBe('10 B');
  });
});
