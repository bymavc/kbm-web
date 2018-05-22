(function(){
    'use strict';

    angular
        .module('kbmApp')
        .factory('AccountService', AccountService);

    AccountService.$inject = ['$http'];
    function AccountService($http){
        var service = {};

        service.Recover = Recover;
        service.ChangePassword = ChangePassword;

        return service;

        function Recover(email){
            return $http.post(API.user.recover, {email: email}).then(handleSuccess, handleError('Error recovering account information'));
        }

        function ChangePassword(user){
            return $http.post(API.user.changePassword, user).then(handleSuccess, handleError('Error changing password'));
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