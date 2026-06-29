"use strict";

angular.module("mimiau.auth").component("registerView", {
  templateUrl: "auth/register/register.template.html",
  controller: ["AuthService", "$location", RegisterController],
  controllerAs: "$ctrl",
});

function RegisterController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.username = "";
  $ctrl.email = "";
  $ctrl.verificationCode = "";
  $ctrl.verificationToken = "";
  $ctrl.password = "";
  $ctrl.passwordConfirm = "";
  $ctrl.errorMessage = "";
  $ctrl.sendCodeError = "";
  $ctrl.isLoading = false;
  $ctrl.isSendingCode = false;

  $ctrl.passwordsMatch = function () {
    return $ctrl.password === $ctrl.passwordConfirm;
  };

  $ctrl.sendCode = function () {
    if ($ctrl.registerForm.email.$invalid) return;

    $ctrl.isSendingCode = true;
    $ctrl.sendCodeError = "";

    AuthService.sendVerificationCode($ctrl.email)
      .then(function (res) {
        $ctrl.verificationToken = res.verificationToken;
        $ctrl.isSendingCode = false;
      })
      .catch(function (err) {
        $ctrl.sendCodeError =
          (err.data && err.data.error) || "Code could not be sent.";
        $ctrl.isSendingCode = false;
      });
  };

  $ctrl.register = function () {
    if ($ctrl.registerForm.$invalid || !$ctrl.passwordsMatch()) return;

    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.register(
      $ctrl.username,
      $ctrl.email,
      $ctrl.password,
      $ctrl.verificationCode,
      $ctrl.verificationToken,
    )
      .then(function () {
        return AuthService.login($ctrl.email, $ctrl.password);
      })
      .then(function () {
        $location.path("/");
      })
      .catch(function (err) {
        if (err.data && err.data.error) {
          if (typeof err.data.error === "string") {
            $ctrl.errorMessage = err.data.error;
          } else if (err.data.error.code === "ER_DUP_ENTRY") {
            $ctrl.errorMessage = "This email address is already in use.";
          } else {
            $ctrl.errorMessage = "Registration failed.";
          }
        } else {
          $ctrl.errorMessage = "Registration failed.";
        }
        $ctrl.isLoading = false;
      });
  };
}
