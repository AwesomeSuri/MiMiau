"use strict";

angular.module("mimiau").factory("ViewportTransformService", [
  "$rootScope",
  function ($rootScope) {
    var transform = {
      scale: 1,
      translateX: 0,
      translateY: 0,
    };

    return {
      get: function () {
        return transform;
      },

      set: function (scale, translateX, translateY) {
        transform.scale = scale;
        transform.translateX = translateX;
        transform.translateY = translateY;
        $rootScope.$broadcast("viewport:transform-changed");
      },
    };
  },
]);
