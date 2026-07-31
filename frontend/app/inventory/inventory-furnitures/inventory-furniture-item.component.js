"use strict";

angular.module("mimiau.inventory").component("inventoryFurnitureItem", {
  templateUrl:
    "inventory/inventory-furnitures/inventory-furniture-item.template.html",
  bindings: {
    item: "<",
    count: "<",
    showCoordinates: "<",
  },
  controller: ["CartonBoxSprite", InventoryFurnitureItemController],
  controllerAs: "$ctrl",
});

function InventoryFurnitureItemController(CartonBoxSprite) {
  var $ctrl = this;

  var displaySize = 64;

  $ctrl.getVisualStyles = function () {
    if (!$ctrl.item) {
      return {};
    }

    var sheetCols = CartonBoxSprite.SHEET_COLUMNS;
    var sheetRows = CartonBoxSprite.SHEET_ROWS;
    var frame = CartonBoxSprite.FURNITURE_FRAME;

    return {
      width: displaySize + "px",
      height: displaySize * 2 + "px",
      backgroundImage: "url('" + $ctrl.item.spriteSheet + "')",
      backgroundRepeat: "no-repeat",
      backgroundSize: sheetCols * 100 + "% " + sheetRows * 100 + "%",
      backgroundPosition:
        (frame.col / (sheetCols - 1)) * 100 +
        "% " +
        (frame.row / (sheetRows - 1)) * 100 +
        "%",
      imageRendering: "pixelated",
    };
  };
}
