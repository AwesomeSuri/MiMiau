"use strict";

angular.module("mimiau.room").component("cats", {
  templateUrl: "room/cats/cats.template.html",
  controller: [
    "$scope",
    "$timeout",
    "CatsApiService",
    "GameStateService",
    "RoomGrid",
    CatsController,
  ],
  controllerAs: "$ctrl",
});

function CatsController($scope, $timeout, CatsApiService, GameStateService, RoomGrid) {
  var $ctrl = this;

  var IDLE_MIN_MS = 2000;
  var IDLE_MAX_MS = 4000;
  var MOVE_SPEED_PX_PER_SEC = 60;
  var START_DELAY_MAX_MS = 2000;

  $ctrl.cats = [];
  $ctrl.catSize = RoomGrid.CELL_SIZE;

  function getRoomWidthPx() {
    return GameStateService.roomWidth * RoomGrid.CELL_SIZE;
  }

  function getRoomHeightPx() {
    return GameStateService.roomLength * RoomGrid.CELL_SIZE;
  }

  $ctrl.$onInit = function () {
    GameStateService.load().then(function () {
      $ctrl.loadCats();
    });

    $scope.$on("gacha:closed", function () {
      $ctrl.loadCats();
    });
  };

  $ctrl.$onDestroy = function () {
    cancelAllBehaviors();
  };

  $ctrl.loadCats = function () {
    cancelAllBehaviors();

    CatsApiService.getUserCats().then(function (cats) {
      $ctrl.cats = cats.map(function (cat) {
        var position = getRandomRoomPosition(
          getRoomWidthPx(),
          getRoomHeightPx(),
          $ctrl.catSize,
        );

        return angular.extend({}, cat, position, {
          moveDurationMs: 0,
          isWalking: false,
          facingRight: false,
        });
      });

      $ctrl.cats.forEach(function (cat) {
        startCatBehavior(cat);
      });
    });
  };

  function startCatBehavior(cat) {
    scheduleNextBehavior(cat, randomBetween(0, START_DELAY_MAX_MS));
  }

  function scheduleNextBehavior(cat, delay) {
    cancelCatBehavior(cat);

    cat.behaviorTimeout = $timeout(function () {
      runBehavior(cat);
    }, delay);
  }

  function runBehavior(cat) {
    if (Math.random() < 0.5) {
      cat.isWalking = false;
      scheduleNextBehavior(cat, randomBetween(IDLE_MIN_MS, IDLE_MAX_MS));
      return;
    }

    var position = getRandomRoomPosition(
      getRoomWidthPx(),
      getRoomHeightPx(),
      $ctrl.catSize,
    );

    var fromX = cat.x;
    var fromY = cat.y;
    var toX = position.x;
    var toY = position.y;
    var distance = Math.hypot(toX - fromX, toY - fromY);

    if (distance === 0) {
      cat.isWalking = false;
      scheduleNextBehavior(cat, randomBetween(IDLE_MIN_MS, IDLE_MAX_MS));
      return;
    }

    if (toX > fromX) {
      cat.facingRight = true;
    } else if (toX < fromX) {
      cat.facingRight = false;
    }

    var moveDurationMs = (distance / MOVE_SPEED_PX_PER_SEC) * 1000;

    cat.isWalking = true;
    cat.moveDurationMs = moveDurationMs;
    cat.x = toX;
    cat.y = toY;

    cat.behaviorTimeout = $timeout(function () {
      cat.isWalking = false;
      scheduleNextBehavior(cat, 0);
    }, moveDurationMs);
  }

  function cancelCatBehavior(cat) {
    if (cat.behaviorTimeout) {
      $timeout.cancel(cat.behaviorTimeout);
      cat.behaviorTimeout = null;
    }

    cat.isWalking = false;
  }

  function cancelAllBehaviors() {
    $ctrl.cats.forEach(cancelCatBehavior);
  }

  function getRandomRoomPosition(roomWidth, roomHeight, catSize) {
    var maxX = Math.max(0, roomWidth - catSize);
    var maxY = Math.max(0, roomHeight - catSize);

    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    };
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
}
