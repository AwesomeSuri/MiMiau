"use strict";

angular.module("mimiau.profile").component("profile", {
  templateUrl: "profile/profile.template.html",
  bindings: {
    onClose: "&",
  },
  controller: ["AuthService", "$location", ProfileController],
  controllerAs: "$ctrl",
});

function ProfileController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.view = "overview";
  $ctrl.username = AuthService.getUsername();
  $ctrl.email = AuthService.getEmail();
  $ctrl.isLoading = false;
  $ctrl.errorMessage = "";

  $ctrl.showOverview = function () {
    $ctrl.view = "overview";
  };

  $ctrl.showChangePassword = function () {
    $ctrl.view = "change-password";
  };

  $ctrl.close = function () {
    $ctrl.showOverview();
    $ctrl.onClose();
  };

  $ctrl.logout = function () {
    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.logout()
      .then(function () {
        $location.path("/login");
      })
      .catch(function (err) {
        $ctrl.errorMessage = (err.data && err.data.error) || "Logout failed.";
        $ctrl.isLoading = false;
      });
  };
}
