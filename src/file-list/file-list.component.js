angular.module('file-list',[
])
  .component('fileList', {
    controller: FileListCtrl,
    controllerAs: 'vm',
    template: 'html/file-list/file-list.template.html'
  });

function FileListCtrl(){
}
