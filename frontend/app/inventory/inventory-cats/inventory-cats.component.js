"use strict";

angular.module("mimiau.inventory").component("inventoryCats", {
  templateUrl: "inventory/inventory-cats/inventory-cats.template.html",
  controller: ["CatsApiService", InventoryCatsController],
  controllerAs: "$ctrl",
});

function InventoryCatsController(CatsApiService) {
  var $ctrl = this;

  $ctrl.cats = [];
  $ctrl.isLoading = true;
  $ctrl.error = null;

  $ctrl.$onInit = function () {
    CatsApiService.getUserCats()
      .then(function (cats) {
        $ctrl.cats = cats;
      })
      .catch(function () {
        $ctrl.error = "Could not load your cats.";
      })
      .finally(function () {
        $ctrl.isLoading = false;
      });
  };
}
