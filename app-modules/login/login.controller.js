(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthService', '$location', 'FlashService'];

    function LoginController(AuthService, $location, FlashService) {
        var vm = this;

        vm.dataLoading = false;

        vm.login = login;

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    $location.path('/home');
                }
            });
        })();

        function login() {
            vm.dataLoading = true;
            AuthService.Login(vm.credentials)
                .then(function(response) {
                    if (response.success) {
                        AuthService.SetCredentials(response.token);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }
    }
})();