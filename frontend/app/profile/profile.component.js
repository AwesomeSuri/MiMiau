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

  $ctrl.username = AuthService.getUsername();
  $ctrl.email = AuthService.getEmail();
  $ctrl.isLoading = false;
  $ctrl.errorMessage = "";

  $ctrl.close = function () {
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
