"use strict";

angular
  .module("mimiau", [
    "ngRoute",
    "ngMaterial",
    "ngMessages",
    "ngAnimate",
    "mimiau.auth",
    "mimiau.home",
    "mimiau.profile",
    "mimiau.room",
    "mimiau.gacha",
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
        .when("/home", {
          template: "<home-view></home-view>",
          resolve: authResolve,
        })
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
        .when("/", {
          redirectTo: "/login",
        })
        .otherwise({
          redirectTo: "/login",
        });
    },
  ]);
