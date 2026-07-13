"use strict";

angular.module("mimiau.gacha").service("GachaService", function () {
  this.isOpen = false;

  this.open = function () {
    this.isOpen = true;
  };

  this.close = function () {
    this.isOpen = false;
  };
});
