(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('KBaseService', KBaseService);

    KBaseService.$inject = ['$http', '$cookies'];

    function KBaseService($http, $cookies) {
        var service = {};

        service.Create = Create;
        service.Update = Update;
        service.UpdatePermissions = UpdatePermissions;
        service.UpdateOwner = UpdateOwner;
        service.UpdatePrivacy = UpdatePrivacy;
        service.Delete = Delete;
        service.Get = Get;
        service.GetPublic = GetPublic;
        service.GetByTag = GetByTag;
        service.GetPermissions = GetPermissions;

        return service;

        function Create(kbase) {
            return $http.post(
                API.kbase.new,
                kbase, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error creating Knowledge Base"));
        }

        function Update(kbase) {
            return $http.post(
                API.kbase.update,
                kbase, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error updating Knowledge Base"));
        }

        function UpdatePermissions(data) {
            return $http.post(
                API.kbase.updatePermissions,
                data, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error updating Knowledge Base Collaborators"));
        }

        function UpdateOwner(data) {
            console.log(data);
            console.log(API.kbase.updateOwner);
            return $http.post(
                API.kbase.updateOwner,
                data, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error updating Knowledge Base Owner"));
        }

        function UpdatePrivacy(data) {
            return $http.post(
                API.kbase.updatePrivacy,
                data, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error updating Knowledge Base Privacy"));
        }

        function Delete(data) {
            return $http.post(
                API.kbase.delete,
                data, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error deleting Knowledge Base"));
        }

        function Get(kbase) {
            return $http.get(
                API.kbase.get + kbase, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting Knowledge Base"));
        }

        function GetPublic() {
            return $http.get(
                API.kbase.getPublic, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting Knowledge Base"));
        }

        function GetByTag(tag) {
            return $http.get(
                API.kbase.getByTag + tag, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting Knowledge Base"))
        }

        function GetPermissions(kbase) {
            return $http.get(
                API.kbase.getPermissions + kbase, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting Knowledge Base collaborators"));
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