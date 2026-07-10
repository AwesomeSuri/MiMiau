"use strict";

angular.module("mimiau.profile").component("profileOverview", {
  templateUrl: "profile/overview/profile-overview.template.html",
  bindings: {
    onShowChangePassword: "&",
    onShowDeleteAccount: "&",
  },
  controller: ["AuthService", "$location", ProfileOverviewController],
  controllerAs: "$ctrl",
});

function ProfileOverviewController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.username = AuthService.getUsername();
  $ctrl.email = AuthService.getEmail();
  $ctrl.isLoading = false;
  $ctrl.errorMessage = "";

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
