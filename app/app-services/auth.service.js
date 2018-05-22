(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$cookies'];

    function AuthService($http, $cookies) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.ClearCredentials = ClearCredentials;
        service.SetCredentials = SetCredentials;
        service.CheckCredentials = CheckCredentials;
        service.Session = Session;
        service.GetRole = GetRole;

        return service;

        function Login(credentials) {
            return $http.post(
                API.auth.login,
                credentials
            ).then(handleSuccess, handleError("Unable to login"));
        }

        function Logout() {
            return $http.get(
                API.auth.logout, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to logout"));
        }

        function Session() {
            return $http.get(
                API.auth.session, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get session"));
        }

        function CheckCredentials(callback) {
            if ($cookies.get('kbmAuth')) {
                Session().then(function(response) {
                    callback(response);
                });
            } else {
                callback({ success: false, message: "No session available", title: 'Error' });
            }
        }

        function SetCredentials(auth) {
            $cookies.put('kbmAuth', auth);
            location.reload(true);
        }

        function ClearCredentials() {
            $cookies.remove('kbmAuth');
            location.reload(true);
        }

        function GetRole(role, callback) {
            var isOwner = false;
            var isWorker = false;
            var isReader = false;
            switch (role) {
                case '1':
                    isOwner = true;
                    isWorker = true;
                    isReader = true;
                    break;
                case '2':
                    isWorker = true;
                    isReader = true;
                    break;
                case '3':
                    isReader = true;
                    break;
            }
            callback(isOwner, isWorker, isReader);
        }

        //private functions
        function handleSuccess(response) {
            return response.data;
        }

        function handleError(error) {
            return function() {
                return { success: false, message: error, title: 'Error' };
            };
        }
    }
})();