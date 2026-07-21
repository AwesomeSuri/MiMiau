"use strict";

angular.module("mimiau.room").component("room", {
  templateUrl: "room/room.template.html",
  controller: [
    "$scope",
    "GameStateService",
    "RoomGrid",
    "ItemsApiService",
    RoomController,
  ],
  controllerAs: "$ctrl",
});

function RoomController($scope, GameStateService, RoomGrid, ItemsApiService) {
  var $ctrl = this;

  $ctrl.gameStateService = GameStateService;

  $ctrl.cellSize = RoomGrid.CELL_SIZE;
  $ctrl.placedItems = [];
  $ctrl.columns = GameStateService.roomWidth;
  $ctrl.rows = GameStateService.roomLength;
  $ctrl.width = $ctrl.columns * $ctrl.cellSize;
  $ctrl.height = $ctrl.rows * $ctrl.cellSize;
  $ctrl.cells = buildCells($ctrl.columns, $ctrl.rows, $ctrl.placedItems);

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

  $ctrl.$onInit = function () {
    GameStateService.load().then(function () {
      syncRoomSize();
      $ctrl.loadItems();
    });

    $scope.$on("gacha:closed", function () {
      syncRoomSize();
      $ctrl.loadItems();
    });
  };

  $ctrl.loadItems = function () {
    ItemsApiService.getUserItems().then(function (items) {
      $ctrl.placedItems = items.filter(function (item) {
        return item.placedInRoom;
      });
      $ctrl.cells = buildCells($ctrl.columns, $ctrl.rows, $ctrl.placedItems);
    });
  };

  function syncRoomSize() {
    $ctrl.columns = GameStateService.roomWidth;
    $ctrl.rows = GameStateService.roomLength;
    $ctrl.width = $ctrl.columns * $ctrl.cellSize;
    $ctrl.height = $ctrl.rows * $ctrl.cellSize;
    $ctrl.cells = buildCells($ctrl.columns, $ctrl.rows, $ctrl.placedItems);
  }
}

function buildCells(cols, rows, items) {
  var cells = [];

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var itemsInPos = items.filter(function (item) {
        return item.gridX === x && item.gridY === y;
      });
      cells.push({ x: x, y: y, item: itemsInPos.length > 0 ? itemsInPos[0] : null });
    }
  }

  return cells;
}
