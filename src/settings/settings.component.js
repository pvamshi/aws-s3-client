angular.module("settings", ["s3"])
  .component("settings", {
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
  const vm = this;

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
