"use strict";

angular.module("mimiau.room").component("roomItem", {
  templateUrl: "room/room-item/room-item.template.html",
  bindings: {
    item: "<",
    cellSize: "<",
  },
  controller: ["CartonBoxSprite", RoomItemController],
  controllerAs: "$ctrl",
});

function RoomItemController(CartonBoxSprite) {
  var $ctrl = this;

  $ctrl.getContainerStyle = function () {
    if ($ctrl.item) {
      return {
        position: "absolute",
        width: $ctrl.cellSize + "px",
        height: $ctrl.cellSize + "px",
        left: $ctrl.item.gridX * $ctrl.cellSize + "px",
        top: $ctrl.item.gridY * $ctrl.cellSize + "px",
        display: "flex",
        alignItems: "end",
        pointerEvents: "none",
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
      };
    }

    return {};
  };
}
