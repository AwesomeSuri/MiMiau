"use strict";

angular.module("mimiau.inventory").component("inventoryFurnitureItem", {
  templateUrl:
    "inventory/inventory-furnitures/inventory-furniture-item.template.html",
  bindings: {
    item: "<",
    showCoordinates: "<",
  },
  controller: [
    "CartonBoxSprite",
    "TimeFormatService",
    InventoryFurnitureItemController,
  ],
  controllerAs: "$ctrl",
});

function InventoryFurnitureItemController(CartonBoxSprite, TimeFormatService) {
  var $ctrl = this;

  $ctrl.formatDuration = TimeFormatService.formatDuration;

  $ctrl.getVisualStyles = function () {
    if (!$ctrl.item) {
      return {};
    }

    var sheetCols = CartonBoxSprite.SHEET_COLUMNS;
    var sheetRows = CartonBoxSprite.SHEET_ROWS;
    var frame = CartonBoxSprite.FURNITURE_FRAME;

    return {
      width: "64px",
      height: "64px",
      backgroundImage: "url('" + $ctrl.item.spriteSheet + "')",
      backgroundRepeat: "no-repeat",
      backgroundSize: sheetCols * 100 + "% " + sheetRows * 2 * 100 + "%",
      backgroundPosition:
        (frame.col / (sheetCols - 1)) * 100 +
        "% " +
        (frame.row / (sheetRows - 1)) * 100 +
        "%",
      imageRendering: "pixelated",
    };
  };
}
