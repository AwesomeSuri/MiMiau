"use strict";

angular.module("mimiau.gacha").factory("GachaApiService", [
  "$http",
  "ENV",
  function ($http, ENV) {
    function getAuthHeaders() {
      return {
        Authorization: "Bearer " + localStorage.getItem("mimiau_jwt"),
      };
    }

    return {
      pullRandomCat: function () {
        return $http
          .post(ENV.phpApiUrl + "/game/gacha_pull.php", {}, {
            headers: getAuthHeaders(),
          })
          .then(function (res) {
            return res.data;
          });
      },
    };
  },
]);
