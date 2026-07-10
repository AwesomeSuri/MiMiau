"use strict";

angular.module("mimiau.room").component("cartonBox", {
  templateUrl: "room/carton-box/carton-box.template.html",
  controller: ["RoomGrid", "CartonBoxSprite", CartonBoxController],
  controllerAs: "$ctrl",
});

function CartonBoxController(RoomGrid, CartonBoxSprite) {
  var $ctrl = this;

  $ctrl.getStyles = function () {
    return {
      width: RoomGrid.CELL_SIZE + "px",
      height: RoomGrid.CELL_SIZE + "px",
      display: "flex",
      alignItems: "end",
    };
  };

  $ctrl.getVisualStyles = function () {
    var sheetCols = CartonBoxSprite.SHEET_COLUMNS;
    var sheetRows = CartonBoxSprite.SHEET_ROWS;
    var spriteCol = CartonBoxSprite.SPRITE_COLUMN;
    var spriteRow = CartonBoxSprite.SPRITE_ROW;

    return {
      width: RoomGrid.CELL_SIZE + "px",
      height: RoomGrid.CELL_SIZE * 2 + "px",
      pointerEvents: "none",
      backgroundImage: "url('assets/spritesheets/carton-box-sheet.png')",
      backgroundRepeat: "no-repeat",
      backgroundSize: sheetCols * 100 + "% " + sheetRows * 100 + "%",
      backgroundPosition:
        (spriteCol / (sheetCols - 1)) * 100 +
        "% " +
        (spriteRow / (sheetRows - 1)) * 100 +
        "%",
      imageRendering: "pixelated",
    };
  };

  $ctrl.onClick = function ($event) {
    $event.stopPropagation();
  };
}
