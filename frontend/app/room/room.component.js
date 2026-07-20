"use strict";

angular.module("mimiau.room").component("room", {
  templateUrl: "room/room.template.html",
  controller: ["GameStateService", "RoomGrid", RoomController],
  controllerAs: "$ctrl",
});

function RoomController(GameStateService, RoomGrid) {
  var $ctrl = this;

  $ctrl.gameStateService = GameStateService;

  $ctrl.cellSize = RoomGrid.CELL_SIZE;
  $ctrl.columns = RoomGrid.COLUMNS;
  $ctrl.rows = RoomGrid.ROWS;
  $ctrl.width = $ctrl.columns * $ctrl.cellSize;
  $ctrl.height = $ctrl.rows * $ctrl.cellSize;

  $ctrl.cells = buildCells($ctrl.columns, $ctrl.rows);

  $ctrl.getGridStyle = function () {
    var colTemplate = "";
    for (var i = 0; i < $ctrl.columns; i++) {
      colTemplate += "1fr ";
    }
    var rowTemplate = "";
    for (var i = 0; i < $ctrl.rows; i++) {
      rowTemplate += "1fr ";
    }
    return {
      width: $ctrl.width + "px",
      height: $ctrl.height + "px",
      gridTemplateColumns: colTemplate,
      gridTemplateRows: rowTemplate,
    };
  };
}

function buildCells(cols, rows) {
  var cells = [];

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      cells.push({ x: x, y: y });
    }
  }

  return cells;
}
