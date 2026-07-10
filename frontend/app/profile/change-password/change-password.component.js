"use strict";

angular.module("mimiau.profile").component("changePassword", {
  templateUrl: "profile/change-password/change-password.template.html",
  controller: ["AuthService", ChangePasswordController],
  controllerAs: "$ctrl",
});

function ChangePasswordController(AuthService) {
  var $ctrl = this;

  $ctrl.currentPassword = "";
  $ctrl.newPassword = "";
  $ctrl.confirmPassword = "";
  $ctrl.isLoading = false;
  $ctrl.errorMessage = "";
  $ctrl.successMessage = "";

  $ctrl.passwordsMatch = function () {
    return $ctrl.newPassword === $ctrl.confirmPassword;
  };

  $ctrl.resetChangePasswordForm = function () {
    $ctrl.currentPassword = "";
    $ctrl.newPassword = "";
    $ctrl.confirmPassword = "";
    if ($ctrl.changePasswordForm) {
      $ctrl.changePasswordForm.$setPristine();
      $ctrl.changePasswordForm.$setUntouched();
    }
  };

  $ctrl.changePassword = function () {
    if (
      $ctrl.changePasswordForm.$invalid ||
      !$ctrl.passwordsMatch() ||
      $ctrl.isLoading
    ) {
      return;
    }

    $ctrl.errorMessage = "";
    $ctrl.successMessage = "";
    $ctrl.isLoading = true;

    AuthService.changePassword($ctrl.currentPassword, $ctrl.newPassword)
      .then(function (res) {
        $ctrl.successMessage =
          (res && res.message) || "Password changed successfully!";
        $ctrl.resetChangePasswordForm();
      })
      .catch(function (err) {
        $ctrl.errorMessage =
          (err.data && err.data.error) || "Failed to change password.";
      })
      .finally(function () {
        $ctrl.isLoading = false;
      });
  };
}
