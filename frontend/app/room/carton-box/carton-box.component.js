"use strict";

angular.module("mimiau.room").component("cartonBox", {
  templateUrl: "room/carton-box/carton-box.template.html",
  controller: ["RoomGrid", CartonBoxController],
  controllerAs: "$ctrl",
});

function CartonBoxController(RoomGrid) {
  var $ctrl = this;

  $ctrl.getStyles = function () {
    return {
      width: RoomGrid.CELL_SIZE + "px",
      height: RoomGrid.CELL_SIZE * 2 + "px",
      transform: "translateY(" + -RoomGrid.CELL_SIZE * 1.5 + "px)",
    };
  };

  $ctrl.onClick = function ($event) {
    $event.stopPropagation();
  };
}
