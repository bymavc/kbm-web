(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('TagService', TagService);

    TagService.$inject = ['$http'];

    function TagService($http) {
        var service = {};

        service.GetAll = GetAll;

        return service;

        function GetAll() {
            return $http.get(
                API.tag.getAll
            ).then(handleSuccess, handleError("Error getting Tags"));
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