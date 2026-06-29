"use strict";

angular.module("mimiau.auth").component("resetPasswordView", {
  templateUrl: "auth/reset-password/reset-password.template.html",
  controller: ["AuthService", "$location", ResetPasswordController],
  controllerAs: "$ctrl",
});

function ResetPasswordController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.token = $location.search().token || null;
  $ctrl.password = "";
  $ctrl.passwordConfirm = "";
  $ctrl.message = "";
  $ctrl.errorMessage = "";
  $ctrl.isLoading = false;

  if (!$ctrl.token) {
    $ctrl.errorMessage =
      "Reset parameters are missing. Make sure you use the reset password link from your email.";
  }

  $ctrl.passwordsMatch = function () {
    return $ctrl.password === $ctrl.passwordConfirm;
  };

  $ctrl.resetPassword = function () {
    if ($ctrl.resetPasswordForm.$invalid || !$ctrl.passwordsMatch()) return;

    if (!$ctrl.token) {
      $ctrl.errorMessage =
        "Reset parameters are missing. Make sure you use the reset password link from your email.";
      return;
    }

    $ctrl.message = "";
    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.resetPassword($ctrl.token, $ctrl.password)
      .then(function (res) {
        $ctrl.message =
          res.message || "Your password has been updated.";
        $ctrl.isLoading = false;
      })
      .catch(function (err) {
        $ctrl.errorMessage =
          (err.data && err.data.error) ||
          "Your password could not be updated.";
        $ctrl.isLoading = false;
      });
  };
}
