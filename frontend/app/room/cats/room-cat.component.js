"use strict";

angular.module("mimiau.room").component("roomCat", {
  templateUrl: "room/cats/room-cat.template.html",
  bindings: {
    cat: "<",
    catSize: "<",
  },
  controller: ["$scope", "$timeout", "CatSprite", RoomCatController],
  controllerAs: "$ctrl",
});

function RoomCatController($scope, $timeout, CatSprite) {
  var $ctrl = this;

  var animationTimeout = null;
  var walkFrameIndex = 0;

  $ctrl.spriteCol = CatSprite.IDLE_FRAME_INDEX;
  $ctrl.spriteRow = 0;

  $ctrl.$onInit = function () {
    showIdleFrame();

    $scope.$watch(
      function () {
        return $ctrl.cat && $ctrl.cat.isWalking;
      },
      function (isWalking) {
        if (isWalking) {
          startWalkAnimation();
        } else {
          stopWalkAnimation();
          showIdleFrame();
        }
      },
    );
  };

  $ctrl.$onDestroy = function () {
    stopWalkAnimation();
  };

  $ctrl.getContainerStyle = function () {
    return {
      width: $ctrl.catSize + "px",
      height: $ctrl.catSize + "px",
      left: $ctrl.cat.x + "px",
      top: $ctrl.cat.y + "px",
      transitionDuration: ($ctrl.cat.moveDurationMs || 0) + "ms",
    };
  };

  $ctrl.getVisualStyles = function () {
    var sheetCols = CatSprite.SHEET_COLUMNS;
    var sheetRows = CatSprite.SHEET_ROWS;
    var backgroundY =
      sheetRows <= 1 ? 0 : ($ctrl.spriteRow / (sheetRows - 1)) * 100;

    return {
      width: $ctrl.catSize + "px",
      height: $ctrl.catSize + "px",
      backgroundImage: "url('" + $ctrl.cat.spriteSheet + "')",
      backgroundRepeat: "no-repeat",
      backgroundSize: sheetCols * 100 + "% " + sheetRows * 100 + "%",
      backgroundPosition:
        ($ctrl.spriteCol / (sheetCols - 1)) * 100 + "% " + backgroundY + "%",
      imageRendering: "pixelated",
      transform: $ctrl.cat.facingRight ? "scaleX(-1)" : "none",
    };
  };

  function showIdleFrame() {
    $ctrl.spriteCol = CatSprite.IDLE_FRAME_INDEX;
    $ctrl.spriteRow = 0;
  }

  function startWalkAnimation() {
    stopWalkAnimation();
    walkFrameIndex = 0;
    scheduleWalkFrame();
  }

  function scheduleWalkFrame() {
    $ctrl.spriteCol = walkFrameIndex;
    $ctrl.spriteRow = 0;

    animationTimeout = $timeout(function () {
      if (!$ctrl.cat || !$ctrl.cat.isWalking) {
        return;
      }

      walkFrameIndex = (walkFrameIndex + 1) % CatSprite.WALK_FRAME_COUNT;
      scheduleWalkFrame();
    }, CatSprite.WALK_FRAME_DURATION_MS);
  }

  function stopWalkAnimation() {
    if (animationTimeout) {
      $timeout.cancel(animationTimeout);
      animationTimeout = null;
    }
  }
}
