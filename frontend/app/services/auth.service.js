"use strict";

angular.module("mimiau.auth").factory("AuthService", [
  "$http",
  "ENV",
  function ($http, ENV) {
    function getAuthUrl(path) {
      return ENV.phpApiUrl + "/auth" + path;
    }

    function saveSession(token, userId) {
      localStorage.setItem("mimiau_jwt", token);
      localStorage.setItem("mimiau_user_id", String(userId));
    }

    return {
      getToken: function () {
        return localStorage.getItem("mimiau_jwt");
      },

      login: function (email, password) {
        return $http
          .post(getAuthUrl("/login.php"), { email, password })
          .then(function (res) {
            saveSession(res.data.token, res.data.userId);
            return res.data;
          });
      },

      register: function (
        username,
        email,
        password,
        verificationCode,
        verificationToken,
      ) {
        return $http
          .post(getAuthUrl("/register.php"), {
            username,
            email,
            password,
            verificationCode,
            verificationToken,
          })
          .then(function (res) {
            return res.data;
          });
      },

      sendVerificationCode: function (email) {
        return $http
          .post(getAuthUrl("/send_verification_code.php"), { email })
          .then(function (res) {
            return res.data;
          });
      },
    };
  },
]);
