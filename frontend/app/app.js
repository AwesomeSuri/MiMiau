"use strict";

angular
  .module("mimiau", [
    "ngRoute",
    "ngMaterial",
    "ngMessages",
    "ngAnimate",
    "mimiau.auth",
  ])
  .config([
    "$routeProvider",
    "$locationProvider",
    "$mdThemingProvider",
    function ($routeProvider, $locationProvider, $mdThemingProvider) {
      $locationProvider.hashPrefix("!");

      $routeProvider
        .when("/login", { template: "<login-view></login-view>" })
        .when("/register", { template: "<register-view></register-view>" })
        .when("/forgot-password", {
          template: "<forgot-password-view></forgot-password-view>",
        })
        .when("/reset-password", {
          template: "<reset-password-view></reset-password-view>",
        })
        .when("/", {
          template:
            "<div class='md-padding md-title' style='text-align:center;'>MiMiau — Game coming soon.</div>",
        })
        .otherwise({ redirectTo: "/login" });
    },
  ]);
