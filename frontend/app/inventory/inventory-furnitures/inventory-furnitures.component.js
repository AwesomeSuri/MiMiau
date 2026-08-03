"use strict";

angular.module("mimiau.inventory").component("inventoryFurnitures", {
  templateUrl:
    "inventory/inventory-furnitures/inventory-furnitures.template.html",
  controller: ["ItemsApiService", InventoryFurnituresController],
  controllerAs: "$ctrl",
});

function InventoryFurnituresController(ItemsApiService) {
  var $ctrl = this;

  $ctrl.allFurnitures = [];
  $ctrl.displayedItems = [];
  $ctrl.showPlacedItems = false;
  $ctrl.isLoading = true;
  $ctrl.error = null;

  $ctrl.$onInit = function () {
    ItemsApiService.getUserFurnitures()
      .then(function (items) {
        $ctrl.allFurnitures = items;
        updateDisplayedItems();
      })
      .catch(function () {
        $ctrl.error = "Could not load your furniture.";
      })
      .finally(function () {
        $ctrl.isLoading = false;
      });
  };

  $ctrl.onShowPlacedChange = function () {
    updateDisplayedItems();
  };

  $ctrl.getEmptyMessage = function () {
    if ($ctrl.showPlacedItems) {
      return "No furniture placed in the room.";
    }

    return "No furniture in inventory.";
  };

  function updateDisplayedItems() {
    if ($ctrl.showPlacedItems) {
      $ctrl.displayedItems = $ctrl.allFurnitures.filter(function (item) {
        return item.placedInRoom;
      });
      return;
    }

    $ctrl.displayedItems = groupFurnitureByType($ctrl.allFurnitures);
  }

  function groupFurnitureByType(items) {
    var groupsByItemId = {};

    items.forEach(function (item) {
      if (!groupsByItemId[item.itemId]) {
        groupsByItemId[item.itemId] = {
          itemId: item.itemId,
          name: item.name,
          image: item.image,
          spriteSheet: item.spriteSheet,
          baseGain: item.baseGain,
          baseDurationSec: item.baseDurationSec,
          inventoryCount: 0,
          placedCount: 0,
        };
      }

      if (item.placedInRoom) {
        groupsByItemId[item.itemId].placedCount += 1;
      } else {
        groupsByItemId[item.itemId].inventoryCount += 1;
      }
    });

    return Object.keys(groupsByItemId).map(function (itemId) {
      return groupsByItemId[itemId];
    });
  }
}
