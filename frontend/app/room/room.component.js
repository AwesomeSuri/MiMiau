"use strict";

angular.module("mimiau.room").component("room", {
  templateUrl: "room/room.template.html",
  controller: [
    "$scope",
    "GameStateService",
    "RoomGrid",
    "GridCoords",
    "ItemsApiService",
    "SelectionService",
    RoomController,
  ],
  controllerAs: "$ctrl",
});

function RoomController(
  $scope,
  GameStateService,
  RoomGrid,
  GridCoords,
  ItemsApiService,
  SelectionService,
) {
  var $ctrl = this;

  $ctrl.gameStateService = GameStateService;

  $ctrl.cellSize = RoomGrid.CELL_SIZE;
  $ctrl.placedItems = [];
  $ctrl.columns = GameStateService.roomWidth;
  $ctrl.rows = GameStateService.roomLength;
  $ctrl.width = $ctrl.columns * $ctrl.cellSize;
  $ctrl.height = $ctrl.rows * $ctrl.cellSize;
  $ctrl.cells = buildCells(
    $ctrl.columns,
    $ctrl.rows,
    $ctrl.placedItems,
    GridCoords,
  );

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

  $ctrl.onBackgroundClick = function () {
    SelectionService.clear();
  };

  $ctrl.loadItems = function () {
    ItemsApiService.getUserItems().then(function (items) {
      $ctrl.placedItems = items.filter(function (item) {
        return item.placedInRoom;
      });
      $ctrl.cells = buildCells(
        $ctrl.columns,
        $ctrl.rows,
        $ctrl.placedItems,
        GridCoords,
      );
      clearSelectionIfMissing($ctrl.placedItems);
    });
  };

  function clearSelectionIfMissing(placedItems) {
    var selectedItem = SelectionService.getSelectedItem();

    if (!selectedItem) {
      return;
    }

    var stillPlaced = placedItems.some(function (item) {
      return item.userItemId === selectedItem.userItemId;
    });

    if (!stillPlaced) {
      SelectionService.clear();
    }
  }

  function syncRoomSize() {
    $ctrl.columns = GameStateService.roomWidth;
    $ctrl.rows = GameStateService.roomLength;
    $ctrl.width = $ctrl.columns * $ctrl.cellSize;
    $ctrl.height = $ctrl.rows * $ctrl.cellSize;
    $ctrl.cells = buildCells(
    $ctrl.columns,
    $ctrl.rows,
    $ctrl.placedItems,
    GridCoords,
  );
  }
}

function buildCells(cols, rows, items, GridCoords) {
  var cells = [];

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var centered = GridCoords.indexToCentered(x, y, cols, rows);
      var itemsInPos = items.filter(function (item) {
        return item.gridX === centered.gridX && item.gridY === centered.gridY;
      });
      cells.push({ x: x, y: y, item: itemsInPos.length > 0 ? itemsInPos[0] : null });
    }
  }

  return cells;
}
