"use strict";

angular.module("mimiau.auth").factory("anonGuard", [
  "AuthService",
  "$location",
  "$q",
  function (AuthService, $location, $q) {
    return function () {
      if (AuthService.getToken()) {
        $location.path("/dashboard");
        return $q.reject("Already authenticated");
      }

      return $q.resolve(true);
    };
  },
]);
