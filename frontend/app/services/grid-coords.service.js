"use strict";

angular.module("mimiau.room").factory("GridCoords", [
  function () {
    function getCenteredBounds(roomWidth, roomLength) {
      var minX = -Math.floor(roomWidth / 2);
      var minY = -Math.floor(roomLength / 2);

      return {
        minX: minX,
        maxX: minX + roomWidth - 1,
        minY: minY,
        maxY: minY + roomLength - 1,
      };
    }

    function indexToCentered(indexX, indexY, roomWidth, roomLength) {
      return {
        gridX: indexX - Math.floor(roomWidth / 2),
        gridY: indexY - Math.floor(roomLength / 2),
      };
    }

    return {
      getCenteredBounds: getCenteredBounds,
      indexToCentered: indexToCentered,
    };
  },
]);
