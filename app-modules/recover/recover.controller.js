(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('RecoverController', RecoverController);

    RecoverController.$inject = ['AuthService', 'AccountService', '$location', 'FlashService', 'ValidatorService'];

    function RecoverController(AuthService, AccountService, $location, FlashService, ValidatorService) {
        var vm = this;

        vm.send = send;
        vm.validateEmail = validateEmail;
        vm.isValid = false;
        vm.dataLoading = false;

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    $location.path('/home');
                }
            });
        })();

        function send() {
            vm.dataLoading = true;
            AccountService.Recover(vm.email)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function validateEmail(event) {
            if (ValidatorService.Email(event)) {
                vm.isValid = true;
            } else {
                vm.isValid = false;
            }
        }
    }
})();