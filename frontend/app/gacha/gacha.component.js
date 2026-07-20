"use strict";

angular.module("mimiau.gacha").component("gachaFeature", {
  templateUrl: "gacha/gacha.template.html",
  controller: [
    "$timeout",
    "GachaAnimation",
    "GachaApiService",
    "GachaService",
    "GameStateService",
    GachaController,
  ],
  controllerAs: "$ctrl",
});

function GachaController(
  $timeout,
  GachaAnimation,
  GachaApiService,
  GachaService,
  GameStateService,
) {
  var $ctrl = this;

  var frameIndex = 0;
  var frameTimeout = null;
  var frames = GachaAnimation.BOX_ANIMATION_FRAMES;
  var penultimateIndex = frames.length - 2;
  var lastIndex = frames.length - 1;

  $ctrl.spriteCol = 0;
  $ctrl.spriteRow = 0;

  $ctrl.isLoading = false;
  $ctrl.isBackdropVisible = false;
  $ctrl.isResultCardVisible = false;
  $ctrl.newCat = null;
  $ctrl.error = null;

  $ctrl.$onInit = function () {
    frameIndex = 0;
    $ctrl.isLoading = false;
    $ctrl.isBackdropVisible = false;
    $ctrl.isResultCardVisible = false;
    $ctrl.newCat = null;
    $ctrl.error = null;
    showFrame(frameIndex);
    scheduleNextFrame();

    $timeout(function () {
      $ctrl.isBackdropVisible = true;
    }, 0);
  };

  $ctrl.$onDestroy = function () {
    if (frameTimeout) {
      $timeout.cancel(frameTimeout);
    }
  };

  function showFrame(index) {
    var frame = frames[index];
    $ctrl.spriteCol = frame.col;
    $ctrl.spriteRow = frame.row;
  }

  function scheduleNextFrame() {
    var currentFrame = frames[frameIndex];

    frameTimeout = $timeout(function () {
      if (frameIndex >= penultimateIndex) {
        getGachaCat();
        return;
      }

      frameIndex += 1;
      showFrame(frameIndex);

      if (frameIndex >= penultimateIndex) {
        getGachaCat();
        return;
      }

      scheduleNextFrame();
    }, currentFrame.duration);
  }

  function getGachaCat() {
    if ($ctrl.isLoading || $ctrl.newCat || $ctrl.error) {
      return;
    }

    $ctrl.isLoading = true;

    GachaApiService.pullRandomCat()
      .then(function (cat) {
        $ctrl.newCat = cat;
        GameStateService.applyProgress({
          level: cat.userLevel,
          gachaQueue: cat.gachaQueue,
        });
        playFinalFrame();
        $timeout(function () {
          $ctrl.isResultCardVisible = true;
        }, 0);
      })
      .catch(function () {
        $ctrl.error = "Could not pull a cat. Please try again.";
        $ctrl.isLoading = false;
      });
  }

  function playFinalFrame() {
    showFrame(lastIndex);
    $ctrl.isLoading = false;
  }

  $ctrl.getResultBanner = function () {
    if (!$ctrl.newCat) {
      return null;
    }

    switch ($ctrl.newCat.resultCode) {
      case "NEW":
        return "NEW CAT!";
      case "UPGRADED":
        return "CAT UPGRADED!";
      default:
        return null;
    }
  };

  $ctrl.getLevelStars = function () {
    if (!$ctrl.newCat) {
      return [];
    }

    var stars = [];
    for (var i = 0; i < $ctrl.newCat.maxLevel; i += 1) {
      stars.push(i < $ctrl.newCat.level);
    }

    return stars;
  };

  $ctrl.getFactText = function (index) {
    if (!$ctrl.newCat || !$ctrl.newCat.facts) {
      return "?";
    }

    return index < $ctrl.newCat.level ? $ctrl.newCat.facts[index] : "?";
  };

  $ctrl.close = function () {
    GachaService.close();
  };

  $ctrl.getBoxStyles = function () {
    var sheetCols = GachaAnimation.BOX_SHEET_COLUMNS;
    var sheetRows = GachaAnimation.BOX_SHEET_ROWS;
    var spriteScale = 4;

    return {
      width: "calc(32px * " + spriteScale + ")",
      height: "calc(64px * " + spriteScale + ")",
      backgroundImage: "url('" + GachaAnimation.BOX_SHEET_PATH + "')",
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
}
