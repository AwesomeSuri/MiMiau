"use strict";

angular.module("mimiau.home").component("gameViewport", {
  templateUrl: "home/game-viewport/game-viewport.template.html",
  controller: [
    "$element",
    "$window",
    "$scope",
    "$timeout",
    "RoomGrid",
    GameViewportController,
  ],
  controllerAs: "$ctrl",
});

function GameViewportController($element, $window, $scope, $timeout, RoomGrid) {
  var $ctrl = this;

  var ROOM_WIDTH = RoomGrid.COLUMNS * RoomGrid.CELL_SIZE;
  var ROOM_HEIGHT = RoomGrid.ROWS * RoomGrid.CELL_SIZE;
  var MIN_SCALE = 0.2;
  var MAX_SCALE = 3;
  var MINIMAP_WIDTH = 128;
  var MINIMAP_HEIGHT = 88;
  var ZOOM_SPEED = 0.02;

  var viewportEl = null;
  var removeWheelListener = angular.noop;
  var removeTouchStartListener = angular.noop;
  var removeTouchMoveListener = angular.noop;
  var removeTouchEndListener = angular.noop;

  $ctrl.roomWidth = ROOM_WIDTH;
  $ctrl.roomHeight = ROOM_HEIGHT;
  $ctrl.minimapWidth = MINIMAP_WIDTH;
  $ctrl.minimapHeight = MINIMAP_HEIGHT;

  $ctrl.scale = 1;
  $ctrl.translateX = 0;
  $ctrl.translateY = 0;
  $ctrl.fitScale = 1;
  $ctrl.fitTranslateX = 0;
  $ctrl.fitTranslateY = 0;
  $ctrl.viewportWidth = 0;
  $ctrl.viewportHeight = 0;

  $ctrl.isDragging = false;
  $ctrl.dragStartX = 0;
  $ctrl.dragStartY = 0;
  $ctrl.lastTouchDistance = 0;

  $ctrl.$postLink = function () {
    $timeout(function () {
      measureViewport();
      $ctrl.resetView();
    });
  };

  $ctrl.$onInit = function () {
    viewportEl = $element[0].querySelector("[game-viewport]");
    measureViewport();
    $ctrl.resetView();
    bindViewportEvents();

    angular.element($window).on("resize", onResize);
    angular.element($window).on("mousemove", onMouseMove);
    angular.element($window).on("mouseup", onMouseUp);

    $scope.$on("$destroy", function () {
      angular.element($window).off("resize", onResize);
      angular.element($window).off("mousemove", onMouseMove);
      angular.element($window).off("mouseup", onMouseUp);
      removeWheelListener();
      removeTouchStartListener();
      removeTouchMoveListener();
      removeTouchEndListener();
    });
  };

  function bindViewportEvents() {
    if (!viewportEl) {
      return;
    }

    var onWheel = function (event) {
      event.preventDefault();

      if (event.metaKey || event.ctrlKey) {
        var direction = event.deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
        zoomAt(event.clientX, event.clientY, direction);
      } else {
        $ctrl.translateX -= event.deltaX;
        $ctrl.translateY -= event.deltaY;
        constrainPan();
      }

      $scope.$applyAsync();
    };

    var onTouchStart = function (event) {
      if (event.touches.length === 1) {
        $ctrl.isDragging = true;
        $ctrl.dragStartX = event.touches[0].clientX - $ctrl.translateX;
        $ctrl.dragStartY = event.touches[0].clientY - $ctrl.translateY;
      } else if (event.touches.length === 2) {
        $ctrl.isDragging = false;
        $ctrl.lastTouchDistance = getTouchDistance(event);
      }
      $scope.$applyAsync();
    };

    var onTouchMove = function (event) {
      event.preventDefault();

      if ($ctrl.isDragging && event.touches.length === 1) {
        $ctrl.translateX = event.touches[0].clientX - $ctrl.dragStartX;
        $ctrl.translateY = event.touches[0].clientY - $ctrl.dragStartY;
        constrainPan();
      } else if (event.touches.length === 2) {
        var distance = getTouchDistance(event);
        var centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        var centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        var oldScale = $ctrl.scale;
        var factor = distance / $ctrl.lastTouchDistance;
        var newScale = clamp(oldScale * factor, MIN_SCALE, MAX_SCALE);

        zoomAt(centerX, centerY, newScale - oldScale);
        $ctrl.lastTouchDistance = distance;
      }

      $scope.$applyAsync();
    };

    var onTouchEnd = function () {
      $ctrl.isDragging = false;
      $ctrl.lastTouchDistance = 0;
      $scope.$applyAsync();
    };

    viewportEl.addEventListener("wheel", onWheel, { passive: false });
    viewportEl.addEventListener("touchstart", onTouchStart, { passive: true });
    viewportEl.addEventListener("touchmove", onTouchMove, { passive: false });
    viewportEl.addEventListener("touchend", onTouchEnd);
    viewportEl.addEventListener("touchcancel", onTouchEnd);

    removeWheelListener = function () {
      viewportEl.removeEventListener("wheel", onWheel);
    };
    removeTouchStartListener = function () {
      viewportEl.removeEventListener("touchstart", onTouchStart);
    };
    removeTouchMoveListener = function () {
      viewportEl.removeEventListener("touchmove", onTouchMove);
    };
    removeTouchEndListener = function () {
      viewportEl.removeEventListener("touchend", onTouchEnd);
      viewportEl.removeEventListener("touchcancel", onTouchEnd);
    };
  }

  function onResize() {
    measureViewport();
    constrainPan();
    $scope.$applyAsync();
  }

  function measureViewport() {
    if (!viewportEl) {
      return;
    }

    $ctrl.viewportWidth = viewportEl.clientWidth;
    $ctrl.viewportHeight = viewportEl.clientHeight;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function constrainPan() {
    if (!$ctrl.viewportWidth || !$ctrl.viewportHeight || !$ctrl.scale) {
      return;
    }

    var centerRoomX =
      ($ctrl.viewportWidth / 2 - $ctrl.translateX) / $ctrl.scale;
    var centerRoomY =
      ($ctrl.viewportHeight / 2 - $ctrl.translateY) / $ctrl.scale;

    var clampedCenterX = clamp(centerRoomX, 0, ROOM_WIDTH);
    var clampedCenterY = clamp(centerRoomY, 0, ROOM_HEIGHT);

    $ctrl.translateX = $ctrl.viewportWidth / 2 - clampedCenterX * $ctrl.scale;
    $ctrl.translateY = $ctrl.viewportHeight / 2 - clampedCenterY * $ctrl.scale;
  }

  function applyFitView() {
    if (!$ctrl.viewportWidth || !$ctrl.viewportHeight) {
      return;
    }

    var scaleX = $ctrl.viewportWidth / ROOM_WIDTH;
    var scaleY = $ctrl.viewportHeight / ROOM_HEIGHT;
    var scale = Math.min(scaleX, scaleY);

    $ctrl.scale = scale;
    $ctrl.translateX = ($ctrl.viewportWidth - ROOM_WIDTH * scale) / 2;
    $ctrl.translateY = ($ctrl.viewportHeight - ROOM_HEIGHT * scale) / 2;
    $ctrl.fitScale = scale;
    $ctrl.fitTranslateX = $ctrl.translateX;
    $ctrl.fitTranslateY = $ctrl.translateY;
  }

  $ctrl.resetView = function () {
    measureViewport();
    applyFitView();
  };

  $ctrl.isFitView = function () {
    return (
      Math.abs($ctrl.scale - $ctrl.fitScale) < 0.001 &&
      Math.abs($ctrl.translateX - $ctrl.fitTranslateX) < 1 &&
      Math.abs($ctrl.translateY - $ctrl.fitTranslateY) < 1
    );
  };

  $ctrl.getTransformStyle = function () {
    return {
      transform:
        "translate(" +
        $ctrl.translateX +
        "px, " +
        $ctrl.translateY +
        "px) scale(" +
        $ctrl.scale +
        ")",
    };
  };

  $ctrl.getMinimapViewportStyle = function () {
    if (!$ctrl.viewportWidth || !$ctrl.scale) {
      return { display: "none" };
    }

    var left = (-$ctrl.translateX / $ctrl.scale / ROOM_WIDTH) * 100;
    var top = (-$ctrl.translateY / $ctrl.scale / ROOM_HEIGHT) * 100;
    var width = ($ctrl.viewportWidth / $ctrl.scale / ROOM_WIDTH) * 100;
    var height = ($ctrl.viewportHeight / $ctrl.scale / ROOM_HEIGHT) * 100;

    return {
      left: clamp(left, 0, 100) + "%",
      top: clamp(top, 0, 100) + "%",
      width: clamp(width, 0, 100) + "%",
      height: clamp(height, 0, 100) + "%",
    };
  };

  function zoomAt(clientX, clientY, deltaScale) {
    if (!viewportEl) {
      return;
    }

    var rect = viewportEl.getBoundingClientRect();
    var localX = clientX - rect.left;
    var localY = clientY - rect.top;
    var oldScale = $ctrl.scale;
    var newScale = clamp(oldScale + deltaScale, MIN_SCALE, MAX_SCALE);
    var scaleRatio = newScale / oldScale;

    $ctrl.translateX = localX - (localX - $ctrl.translateX) * scaleRatio;
    $ctrl.translateY = localY - (localY - $ctrl.translateY) * scaleRatio;
    $ctrl.scale = newScale;
    constrainPan();
  }

  $ctrl.onMouseDown = function ($event) {
    if ($event.button !== 0) {
      return;
    }

    $event.preventDefault();
    $ctrl.isDragging = true;
    $ctrl.dragStartX = $event.clientX - $ctrl.translateX;
    $ctrl.dragStartY = $event.clientY - $ctrl.translateY;
  };

  function onMouseMove($event) {
    if (!$ctrl.isDragging) {
      return;
    }

    $ctrl.translateX = $event.clientX - $ctrl.dragStartX;
    $ctrl.translateY = $event.clientY - $ctrl.dragStartY;
    constrainPan();
    $scope.$applyAsync();
  }

  function onMouseUp() {
    if (!$ctrl.isDragging) {
      return;
    }

    $ctrl.isDragging = false;
    $scope.$applyAsync();
  }

  function getTouchDistance(event) {
    return Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY,
    );
  }
}
