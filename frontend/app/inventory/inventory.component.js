"use strict";

angular.module("mimiau.inventory").component("inventoryWindow", {
  templateUrl: "inventory/inventory.template.html",
  bindings: {
    onClose: "&",
  },
  controller: [InventoryController],
  controllerAs: "$ctrl",
});

function InventoryController() {
  var $ctrl = this;

  $ctrl.view = "cats";

  $ctrl.showCats = function () {
    $ctrl.view = "cats";
  };

  $ctrl.showFurnitures = function () {
    $ctrl.view = "furnitures";
  };

  $ctrl.showToys = function () {
    $ctrl.view = "toys";
  };

  $ctrl.close = function () {
    $ctrl.onClose();
  };
}
