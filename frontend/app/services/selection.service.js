"use strict";

angular.module("mimiau.selection").factory("SelectionService", [
  "$rootScope",
  function ($rootScope) {
    var selectedItem = null;

    function notifyChange() {
      $rootScope.$broadcast("selection:changed");
    }

    return {
      getSelectedItem: function () {
        return selectedItem;
      },

      select: function (item) {
        if (!item) {
          return;
        }

        selectedItem = item;
        notifyChange();
      },

      clear: function () {
        if (!selectedItem) {
          return;
        }

        selectedItem = null;
        notifyChange();
      },

      isSelected: function (userItemId) {
        return selectedItem !== null && selectedItem.userItemId === userItemId;
      },
    };
  },
]);
