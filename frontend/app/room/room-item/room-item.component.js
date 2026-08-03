"use strict";

angular.module("mimiau.room").component("roomItem", {
  templateUrl: "room/room-item/room-item.template.html",
  bindings: {
    item: "<",
    cellSize: "<",
  },
  controller: ["CartonBoxSprite", "SelectionService", RoomItemController],
  controllerAs: "$ctrl",
});

function RoomItemController(CartonBoxSprite, SelectionService) {
  var $ctrl = this;

  $ctrl.onSelect = function ($event) {
    $event.stopPropagation();
    SelectionService.select($ctrl.item);
  };

  $ctrl.isSelected = function () {
    return SelectionService.isSelected($ctrl.item.userItemId);
  };

  $ctrl.getContainerStyle = function () {
    if ($ctrl.item) {
      return {
        width: $ctrl.cellSize + "px",
        height: $ctrl.cellSize + "px",
        display: "flex",
        alignItems: "end",
        cursor: "pointer",
      };
    }

    return {};
  };

  $ctrl.getVisualStyles = function () {
    var sheetCols = CartonBoxSprite.SHEET_COLUMNS;
    var sheetRows = CartonBoxSprite.SHEET_ROWS;
    var frame = CartonBoxSprite.FURNITURE_FRAME;

    if ($ctrl.item) {
      return {
        width: $ctrl.cellSize + "px",
        height: $ctrl.cellSize * 2 + "px",
        backgroundImage: "url('" + $ctrl.item.spriteSheet + "')",
        backgroundRepeat: "no-repeat",
        backgroundSize: sheetCols * 100 + "% " + sheetRows * 100 + "%",
        backgroundPosition:
          (frame.col / (sheetCols - 1)) * 100 +
          "% " +
          (frame.row / (sheetRows - 1)) * 100 +
          "%",
        imageRendering: "pixelated",
        pointerEvents: "none",
      };
    }

    return {};
  };
}
