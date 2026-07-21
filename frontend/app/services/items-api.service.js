"use strict";

angular.module("mimiau.room").factory("ItemsApiService", [
  "$http",
  "ENV",
  function ($http, ENV) {
    function getAuthHeaders() {
      return {
        Authorization: "Bearer " + localStorage.getItem("mimiau_jwt"),
      };
    }

    return {
      getUserItems: function () {
        return $http
          .get(ENV.phpApiUrl + "/game/user_items.php", {
            headers: getAuthHeaders(),
          })
          .then(function (res) {
            return res.data;
          });
      },
    };
  },
]);
