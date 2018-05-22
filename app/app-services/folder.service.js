(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('FolderService', FolderService);

    FolderService.$inject = ['$http', '$cookies'];

    function FolderService($http, $cookies) {
        var service = {};

        service.Get = Get;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function Create(folder) {
            return $http.post(
                API.folder.new,
                folder, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error creating folder"));
        }

        function Update(folder) {
            return $http.post(
                API.folder.update,
                folder, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error updating folder"));
        }

        function Get(folder) {
            return $http.get(
                API.folder.get + folder, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting folder"));
        }

        function Delete(folder) {
            return $http.post(
                API.folder.delete,
                folder, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting folder"));
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