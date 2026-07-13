"use strict";

angular.module("mimiau.home").component("homeView", {
  templateUrl: "home/home.template.html",
  controller: ["GachaService", HomeController],
  controllerAs: "$ctrl",
});

function HomeController(GachaService) {
  var $ctrl = this;

  $ctrl.gachaService = GachaService;
  $ctrl.isProfileOpen = false;

  $ctrl.toggleProfile = function () {
    $ctrl.isProfileOpen = !$ctrl.isProfileOpen;
  };

  $ctrl.closeProfile = function () {
    $ctrl.isProfileOpen = false;
  };

  $ctrl.onBackgroundClick = function () {
    if ($ctrl.isProfileOpen) {
      $ctrl.closeProfile();
    }
  };
}
