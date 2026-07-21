"use strict";

angular.module("mimiau.inventory").component("inventoryCatItem", {
  templateUrl: "inventory/inventory-cats/inventory-cat-item.template.html",
  bindings: {
    cat: "<",
  },
  controller: [InventoryCatItemController],
  controllerAs: "$ctrl",
});

function InventoryCatItemController() {
  var $ctrl = this;

  $ctrl.getLevelStars = function () {
    if (!$ctrl.cat) {
      return [];
    }

    var maxLevel = $ctrl.cat.maxLevel || $ctrl.cat.level;
    var stars = [];

    for (var i = 0; i < maxLevel; i += 1) {
      stars.push(i < $ctrl.cat.level);
    }

    return stars;
  };
}
