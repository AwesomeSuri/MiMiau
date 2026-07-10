"use strict";

angular.module("mimiau.profile").component("profileWindow", {
  templateUrl: "profile/profile.template.html",
  bindings: {
    onClose: "&",
  },
  controller: [ProfileController],
  controllerAs: "$ctrl",
});

function ProfileController() {
  var $ctrl = this;

  $ctrl.view = "overview";

  $ctrl.showOverview = function () {
    $ctrl.view = "overview";
  };

  $ctrl.showChangePassword = function () {
    $ctrl.view = "change-password";
  };

  $ctrl.showDeleteAccount = function () {
    $ctrl.view = "delete-account";
  };

  $ctrl.getTitle = function () {
    if ($ctrl.view === "change-password") {
      return "Change Password";
    }
    if ($ctrl.view === "delete-account") {
      return "Delete Account";
    }
    return "Profile";
  };

  $ctrl.close = function () {
    $ctrl.showOverview();
    $ctrl.onClose();
  };
}
