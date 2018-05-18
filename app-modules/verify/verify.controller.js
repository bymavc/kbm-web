(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('VerifyController', VerifyController);

    VerifyController.$inject = ['AuthService', 'CodeService', '$routeParams', '$location', 'FlashService', 'ValidatorService'];

    function VerifyController(AuthService, CodeService, $routeParams, $location, FlashService, ValidatorService) {
        var vm = this;

        vm.verify = verify;
        vm.resend = resend;
        vm.validateCode = validateCode;
        vm.validateEmail = validateEmail;
        vm.dataLoading = false;
        vm.code = $routeParams.code;
        vm.isValid = false;

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    $location.path('/home');
                } else {
                    if (angular.isDefined(vm.code)) {
                        console.log(vm.code);
                        vm.verify();
                    }
                }
            });
        })();

        function verify() {
            vm.dataLoading = true;
            CodeService.Verify(vm.code)
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

        function resend() {
            vm.dataLoading = true;
            CodeService.Resend(vm.email)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        $('#emailModal').modal('hide');
                        vm.dataLoading = false;
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function validateCode(event) {
            if (ValidatorService.Code(event)) {
                vm.isValid = true;
            } else {
                vm.isValid = false;
            }
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