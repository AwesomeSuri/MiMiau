"use strict";

angular.module("mimiau.gacha").service("GachaService", [
  "$q",
  "GameStateService",
  function ($q, GameStateService) {
    var self = this;

    self.isOpen = false;

    self.open = function () {
      if (GameStateService.gachaQueue > 0) {
        self.isOpen = true;
        return $q.resolve();
      }

      return GameStateService.load().then(function (progress) {
        if (progress.gachaQueue <= 0) {
          return $q.reject(new Error("No gacha pulls available."));
        }

        self.isOpen = true;
      });
    };

    self.close = function () {
      self.isOpen = false;
    };
  },
]);
