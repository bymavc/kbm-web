(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$cookies'];

    function UserService($http, $cookies) {
        var service = {};

        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Get = Get;
        service.GetSelf = GetSelf;
        service.GetUserList = GetUserList;
        service.GetActivities = GetActivities;
        service.GetKnowledgeBases = GetKnowledgeBases;
        service.GetCollaborations = GetCollaborations;
        service.CheckEmail = CheckEmail;
        service.CheckUsername = CheckUsername;
        service.Find = Find;

        return service;

        function Create(user) {
            return $http.post(API.user.register, user).then(handleSuccess, handleError("Unable to create user"));
        }

        function Update(user) {
            return $http.post(
                API.user.update,
                user, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to update user"));
        }

        function Delete(password) {
            return $http.post(
                API.user.delete, { password: password }, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to delete user"));
        }

        function Get(username) {
            return $http.get(
                API.user.get + username, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get user"));
        }

        function GetSelf() {
            return $http.get(
                API.user.getSelf, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get user"));
        }

        function GetUserList() {
            return $http.get(
                API.user.getList, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get list"));
        }

        function GetActivities(username) {
            return $http.get(
                API.user.getActivities + username, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get user information"));
        }

        function GetKnowledgeBases() {
            return $http.get(
                API.user.getKnowledgeBases, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get user information"));
        }

        function GetCollaborations() {
            return $http.get(
                API.user.getCollaborations, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to get user information"));
        }

        function CheckEmail(email) {
            return $http.get(
                API.user.checkEmail + email
            ).then(handleSuccess, handleError("Unable to verify email availability"));
        }

        function CheckUsername(username) {
            return $http.get(
                API.user.checkUsername + username
            ).then(handleSuccess, handleError("Unable to verify username availability"));
        }

        function Find(pattern) {
            return $http.get(
                API.user.find + pattern, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Unable to find users"));
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