"use strict";

angular.module("mimiau.auth").factory("authGuard", [
  "AuthService",
  "$location",
  "$q",
  function (AuthService, $location, $q) {
    return function () {
      if (AuthService.getToken()) {
        return $q.resolve(true);
      }

      $location.path("/login");
      return $q.reject("Not authenticated");
    };
  },
]);
