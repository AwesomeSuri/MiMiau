"use strict";

angular.module("mimiau.home").component("homeView", {
  templateUrl: "home/home.template.html",
  controller: ["GachaService", "GameStateService", HomeController],
  controllerAs: "$ctrl",
});

function HomeController(GachaService, GameStateService) {
  var $ctrl = this;

  $ctrl.gachaService = GachaService;
  $ctrl.gameStateService = GameStateService;
  $ctrl.isProfileOpen = false;
  $ctrl.isInventoryOpen = false;

  $ctrl.$onInit = function () {
    GameStateService.load();
  };

  $ctrl.toggleProfile = function () {
    $ctrl.isProfileOpen = !$ctrl.isProfileOpen;
    if ($ctrl.isInventoryOpen) {
      $ctrl.closeInventory();
    }
  };

  $ctrl.closeProfile = function () {
    $ctrl.isProfileOpen = false;
  };

  $ctrl.toggleInventory = function () {
    $ctrl.isInventoryOpen = !$ctrl.isInventoryOpen;
    if ($ctrl.isProfileOpen) {
      $ctrl.closeProfile();
    }
  };

  $ctrl.closeInventory = function () {
    $ctrl.isInventoryOpen = false;
  };

  $ctrl.onBackgroundClick = function () {
    if ($ctrl.isProfileOpen) {
      $ctrl.closeProfile();
    } else if ($ctrl.isInventoryOpen) {
      $ctrl.closeInventory();
    }
  };
}
