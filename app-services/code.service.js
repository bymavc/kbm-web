(function(){
    'use strict';

    angular
        .module('kbmApp')
        .factory('CodeService', CodeService);

    CodeService.$inject = ['$http'];
    function CodeService($http){
        var service = {};

        service.Verify = Verify;
        service.Resend = Resend;

        return service;

        function Verify(code) {
            return $http.post(API.user.verify, { code: code }).then(handleSuccess, handleError('Error verifying Code'));
        }

        function Resend(email) {
            return $http.post(API.user.resend, { email: email }).then(handleSuccess, handleError('Error requesting for a new Code'));
        }

        // private functions

        function handleSuccess(res){
            return res.data;
        }

        function handleError(error){
            return function(){
                return { success: false, message: error, title: 'Error' };
            };
        }
    }
})();