angular.module('file-list', ['file-service'])
  .component('fileList', {
    template: `
			<table ng-if="vm.files && vm.files.length" class="table is-striped">
				<thead>
					<tr>
						<th class = "mdl-data-table__cell--non-numeric"> File Name 
							<i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>
						</th>
						<th>Owner</th>
						<th> Size </th>
					</tr>
				</thead>
				<tbody>
					<tr ng-repeat="file in vm.files">
						<td class="mdl-data-table__cell--non-numeric">{{file.Key}}</td>
						<td class="mdl-data-table__cell--non-numeric">{{file.Owner && file.Owner.DisplayName}}</td>
						<td>{{file.Size}}</td>
					</tr>
				</tbody>
			</table>
    `,
    controller: FileListCtrl,
    controllerAs: 'vm'
  });

FileListCtrl.$inject = ['S3Service'];

function FileListCtrl(s3) {
  const vm = this;
  //===============================

  vm.$onInit = () => {
    s3.getFiles()
      .then(addFiles)
      .catch(err => console.log(err));

  };

  function addFiles(files) {
    console.log(files);
    vm.files = files;
  }
}
