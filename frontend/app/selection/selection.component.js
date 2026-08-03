"use strict";

angular.module("mimiau.selection").component("selectionOverlay", {
  templateUrl: "selection/selection.template.html",
  controller: [
    "$scope",
    "SelectionService",
    "ViewportTransformService",
    "GameStateService",
    "RoomGrid",
    SelectionOverlayController,
  ],
  controllerAs: "$ctrl",
});

function SelectionOverlayController(
  $scope,
  SelectionService,
  ViewportTransformService,
  GameStateService,
  RoomGrid,
) {
  var $ctrl = this;

  $ctrl.selectedItem = null;

  $ctrl.$onInit = function () {
    syncSelection();

    $scope.$on("selection:changed", syncSelection);
    $scope.$on("viewport:transform-changed", function () {
      // Trigger re-evaluation of getLabelStyle on pan/zoom.
      syncSelection();
    });
  };

  $ctrl.getLabelStyle = function () {
    if (!$ctrl.selectedItem) {
      return { display: "none" };
    }

    var transform = ViewportTransformService.get();
    var cellSize = RoomGrid.CELL_SIZE;
    var column =
      $ctrl.selectedItem.gridX + Math.floor(GameStateService.roomWidth / 2);
    var row =
      $ctrl.selectedItem.gridY + Math.floor(GameStateService.roomLength / 2);
    var roomCenterX = column * cellSize + cellSize / 2;
    var roomTopY = row * cellSize;

    return {
      left: transform.translateX + roomCenterX * transform.scale + "px",
      top: transform.translateY + roomTopY * transform.scale + "px",
      transform: "translate(-50%, -100%)",
    };
  };

  function syncSelection() {
    $ctrl.selectedItem = SelectionService.getSelectedItem();
  }
}
