"use strict";

angular.module("mimiau.auth").component("forgotPasswordView", {
  templateUrl: "auth/forgot-password/forgot-password.template.html",
  controller: ["AuthService", ForgotPasswordController],
  controllerAs: "$ctrl",
});

function ForgotPasswordController(AuthService) {
  var $ctrl = this;

  $ctrl.email = "";
  $ctrl.message = "";
  $ctrl.errorMessage = "";
  $ctrl.isLoading = false;

  $ctrl.requestReset = function () {
    if ($ctrl.forgotPasswordForm.$invalid) return;

    $ctrl.message = "";
    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.requestPasswordReset($ctrl.email)
      .then(function (res) {
        $ctrl.message =
          res.message ||
          "Check your email box! If the account exists, your reset link is on its way.";
        $ctrl.isLoading = false;
      })
      .catch(function (err) {
        $ctrl.errorMessage =
          (err.data && err.data.error) || "Failed to send a request.";
        $ctrl.isLoading = false;
      });
  };
}
