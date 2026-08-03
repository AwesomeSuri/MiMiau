"use strict";

angular.module("mimiau").factory("TimeFormatService", [
  function () {
    function formatDuration(totalSeconds) {
      var seconds = Math.max(0, parseInt(totalSeconds, 10) || 0);

      if (seconds === 0) {
        return "0s";
      }

      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds % 3600) / 60);
      var remainingSeconds = seconds % 60;
      var parts = [];

      if (hours > 0) {
        parts.push(hours + "h");
      }
      if (minutes > 0) {
        parts.push(minutes + "m");
      }
      if (remainingSeconds > 0 || parts.length === 0) {
        parts.push(remainingSeconds + "s");
      }

      return parts.join(" ");
    }

    return {
      formatDuration: formatDuration,
    };
  },
]);
