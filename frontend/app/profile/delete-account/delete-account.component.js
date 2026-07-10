"use strict";

angular.module("mimiau.profile").component("deleteAccount", {
  templateUrl: "profile/delete-account/delete-account.template.html",
  controller: ["AuthService", "$location", DeleteAccountController],
  controllerAs: "$ctrl",
});

function DeleteAccountController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.password = "";
  $ctrl.isLoading = false;
  $ctrl.errorMessage = "";

  $ctrl.deleteAccount = function () {
    if ($ctrl.deleteAccountForm.$invalid || $ctrl.isLoading) {
      return;
    }

    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.deleteAccount($ctrl.password)
      .then(function () {
        $location.path("/login");
      })
      .catch(function (err) {
        $ctrl.errorMessage =
          (err.data && err.data.error) || "Failed to delete account.";
        $ctrl.isLoading = false;
      });
  };
}
