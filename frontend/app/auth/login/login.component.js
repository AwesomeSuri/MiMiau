"use strict";

angular.module("mimiau.auth").component("loginView", {
  templateUrl: "auth/login/login.template.html",
  controller: ["AuthService", "$location", LoginController],
  controllerAs: "$ctrl",
});

function LoginController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.email = "";
  $ctrl.password = "";
  $ctrl.errorMessage = "";
  $ctrl.isLoading = false;

  $ctrl.login = function () {
    if ($ctrl.loginForm.$invalid) return;

    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.login($ctrl.email, $ctrl.password)
      .then(function () {
        $location.path("/");
      })
      .catch(function (err) {
        $ctrl.errorMessage =
          (err.data && err.data.error) ||
          "Login failed. Please check your credentials.";
        $ctrl.isLoading = false;
      });
  };
}
