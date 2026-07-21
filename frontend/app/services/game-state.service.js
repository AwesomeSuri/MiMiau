"use strict";

angular.module("mimiau.gacha").service("GameStateService", [
  "$http",
  "ENV",
  function ($http, ENV) {
    var self = this;

    self.level = 1;
    self.gachaQueue = 0;
    self.roomWidth = 7;
    self.roomLength = 5;

    function getAuthHeaders() {
      return {
        Authorization: "Bearer " + localStorage.getItem("mimiau_jwt"),
      };
    }

    function applyProgress(progress) {
      if (progress.level != null) {
        self.level = progress.level;
      }
      if (progress.gachaQueue != null) {
        self.gachaQueue = progress.gachaQueue;
      }
      if (progress.roomWidth != null) {
        self.roomWidth = progress.roomWidth;
      }
      if (progress.roomLength != null) {
        self.roomLength = progress.roomLength;
      }
      return progress;
    }

    self.load = function () {
      return $http
        .get(ENV.phpApiUrl + "/game/user_state.php", {
          headers: getAuthHeaders(),
        })
        .then(function (res) {
          return applyProgress(res.data);
        });
    };

    self.applyProgress = applyProgress;
  },
]);
