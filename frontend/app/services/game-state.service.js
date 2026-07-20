"use strict";

angular.module("mimiau.gacha").service("GameStateService", [
  "$http",
  "ENV",
  function ($http, ENV) {
    var self = this;

    self.level = 1;
    self.gachaQueue = 0;

    function getAuthHeaders() {
      return {
        Authorization: "Bearer " + localStorage.getItem("mimiau_jwt"),
      };
    }

    function applyProgress(progress) {
      self.level = progress.level;
      self.gachaQueue = progress.gachaQueue;
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
