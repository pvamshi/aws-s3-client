const templateHtml = ` 
	<div class="container">
    <div class="box">
        <file-upload></file-upload>
    </div>
    <!--<div class="box">
        <file-list></file-list>
    </div>
    -->
  </div>
 `;
angular.module('mainModule', [
    'file-list',
    'file-upload'
  ])
  .component('app', {
    controller: controller,
    template: templateHtml,
    controllerAs: 'vm'
  });

function controller() {
  let vm = this;
  vm.greetMe = 'Worlde';
}
angular.element(document).ready(()=>{
  angular.bootstrap(document, ['mainModule']);
});
