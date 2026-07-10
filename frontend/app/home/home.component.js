"use strict";

angular.module("mimiau.home").component("homeView", {
  templateUrl: "home/home.template.html",
  controller: [HomeController],
  controllerAs: "$ctrl",
});

function HomeController() {
  var $ctrl = this;

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
