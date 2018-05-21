(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['AccountService', 'AuthService', '$routeParams', '$location', 'FlashService', 'ValidatorService'];

    function ChangePasswordController(AccountService, AuthService, $routeParams, $location, FlashService, ValidatorService) {
        var vm = this;

        vm.change = change;

        vm.validatePassword = validatePassword;
        vm.hidePopover = hidePopover;
        vm.isValid = false;
        vm.dataLoading = false;
        vm.code = $routeParams.code;

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    $location.path('/home');
                }
            });
        })();

        function change() {
            vm.dataLoading = true;
            var data = {
                code: vm.code,
                password: vm.pass
            };
            AccountService.ChangePassword(data)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function validatePassword(event) {
            if (ValidatorService.Password(event)) {
                vm.isValid = true;
            } else {
                vm.isValid = false;
            }
        }

        function hidePopover(event){
            ValidatorService.Hider(event);
        }
    }
})();