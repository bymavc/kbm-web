(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('DocumentService', DocumentService);

    DocumentService.$inject = ['$http', '$cookies'];

    function DocumentService($http, $cookies) {
        let service = {};

        service.Create = Create;
        service.Update = Update;
        service.Get = Get;
        service.Delete = Delete;

        return service;

        function Create(document) {
            return $http.post(
                API.doc.new,
                document, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error creating document"));
        }

        function Update(document) {
            return $http.post(
                API.doc.update,
                document, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error updating document"));
        }

        function Get(id) {
            return $http.get(
                API.doc.get + id, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error getting document"));
        }

        function Delete(id) {
            return $http.post(
                API.doc.delete,
                id, { headers: { 'Authorization': $cookies.get('kbmAuth') } }
            ).then(handleSuccess, handleError("Error deleting document"))
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