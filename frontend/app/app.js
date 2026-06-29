"use strict";

angular
  .module("mimiau", [
    "ngRoute",
    "ngMaterial",
    "ngMessages",
    "ngAnimate",
    "mimiau.auth",
    "mimiau.home",
  ])
  .config([
    "$routeProvider",
    "$locationProvider",
    function ($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix("!");

      var anonResolve = {
        anon: [
          "anonGuard",
          function (anonGuard) {
            return anonGuard();
          },
        ],
      };

      var authResolve = {
        auth: [
          "authGuard",
          function (authGuard) {
            return authGuard();
          },
        ],
      };

      $routeProvider
        .when("/login", {
          template: "<login-view></login-view>",
          resolve: anonResolve,
        })
        .when("/register", {
          template: "<register-view></register-view>",
          resolve: anonResolve,
        })
        .when("/forgot-password", {
          template: "<forgot-password-view></forgot-password-view>",
          resolve: anonResolve,
        })
        .when("/reset-password", {
          template: "<reset-password-view></reset-password-view>",
          resolve: anonResolve,
        })
        .when("/dashboard", {
          template: "<dashboard-view></dashboard-view>",
          resolve: authResolve,
        })
        .when("/", {
          redirectTo: "/login",
        })
        .otherwise({
          redirectTo: "/login",
        });
    },
  ]);
