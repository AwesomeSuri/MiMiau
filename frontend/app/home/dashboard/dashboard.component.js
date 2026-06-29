"use strict";

angular.module("mimiau.home").component("dashboardView", {
  templateUrl: "home/dashboard/dashboard.template.html",
  controller: ["AuthService", "$location", DashboardController],
  controllerAs: "$ctrl",
});

function DashboardController(AuthService, $location) {
  var $ctrl = this;

  $ctrl.errorMessage = "";
  $ctrl.isLoading = false;

  $ctrl.logout = function () {
    $ctrl.errorMessage = "";
    $ctrl.isLoading = true;

    AuthService.logout()
      .then(function () {
        $location.path("/login");
      })
      .catch(function (err) {
        $ctrl.errorMessage =
          (err.data && err.data.error) || "Logout failed.";
        $ctrl.isLoading = false;
      });
  };
}
