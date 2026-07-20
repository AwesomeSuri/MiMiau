"use strict";

angular.module("mimiau.room").factory("CatsApiService", [
  "$http",
  "ENV",
  function ($http, ENV) {
    function getAuthHeaders() {
      return {
        Authorization: "Bearer " + localStorage.getItem("mimiau_jwt"),
      };
    }

    return {
      getUserCats: function () {
        return $http
          .get(ENV.phpApiUrl + "/game/user_cats.php", {
            headers: getAuthHeaders(),
          })
          .then(function (res) {
            return res.data;
          });
      },
    };
  },
]);
