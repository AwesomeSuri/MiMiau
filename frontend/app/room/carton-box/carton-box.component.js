"use strict";

angular.module("mimiau.room").component("cartonBox", {
  templateUrl: "room/carton-box/carton-box.template.html",
  controller: [
    "$timeout",
    "GachaService",
    "RoomGrid",
    "CartonBoxSprite",
    CartonBoxController,
  ],
  controllerAs: "$ctrl",
});

function CartonBoxController($timeout, GachaService, RoomGrid, CartonBoxSprite) {
  var $ctrl = this;

  var frameIndex = 0;
  var frameTimeout = null;

  $ctrl.spriteCol = 0;
  $ctrl.spriteRow = 0;

  $ctrl.$onInit = function () {
    showFrame(frameIndex);
    scheduleNextFrame();
  };

  $ctrl.$onDestroy = function () {
    if (frameTimeout) {
      $timeout.cancel(frameTimeout);
    }
  };

  function showFrame(index) {
    var frame = CartonBoxSprite.ANIMATION_FRAMES[index];
    $ctrl.spriteCol = frame.col;
    $ctrl.spriteRow = frame.row;
  }

  function scheduleNextFrame() {
    var currentFrame = CartonBoxSprite.ANIMATION_FRAMES[frameIndex];

    frameTimeout = $timeout(function () {
      frameIndex = (frameIndex + 1) % CartonBoxSprite.ANIMATION_FRAMES.length;
      showFrame(frameIndex);
      scheduleNextFrame();
    }, currentFrame.duration);
  }

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

    return {
      width: RoomGrid.CELL_SIZE + "px",
      height: RoomGrid.CELL_SIZE * 2 + "px",
      pointerEvents: "none",
      backgroundImage: "url('" + CartonBoxSprite.SHEET_PATH + "')",
      backgroundRepeat: "no-repeat",
      backgroundSize: sheetCols * 100 + "% " + sheetRows * 100 + "%",
      backgroundPosition:
        ($ctrl.spriteCol / (sheetCols - 1)) * 100 +
        "% " +
        ($ctrl.spriteRow / (sheetRows - 1)) * 100 +
        "%",
      imageRendering: "pixelated",
    };
  };

  $ctrl.onClick = function ($event) {
    $event.stopPropagation();
    GachaService.open().catch(angular.noop);
  };
}
