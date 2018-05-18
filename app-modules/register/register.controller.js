(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', 'AuthService', '$location', 'FlashService', 'ValidatorService'];

    function RegisterController(UserService, AuthService, $location, FlashService, ValidatorService) {
        var vm = this;

        vm.dataLoading = false;

        vm.usernameFormClass = "form-control";
        vm.usernameLoading = "fa fa-user";
        vm.uNoteClass = "little-note";
        vm.uMessage = "Pick a username that fits you, people will be able to find you by this name.";

        vm.emailFormClass = "form-control";
        vm.emailLoading = "fa fa-envelope";
        vm.eNoteClass = "little-note";
        vm.eMessage = "We will use this email to contact you when required.";

        vm.passwordFormClass = "form-control";
        vm.passwordLoading = "fa fa-key";
        vm.pNoteClass = "little-note";
        vm.pMessage = "Make sure your password contains:a capital letter, a lower case letter, a number and is at least 8 characters long.";

        vm.firstNameIsValid = false;
        vm.lastNameIsValid = false;
        vm.usernameIsValid = false;
        vm.emailIsValid = false;
        vm.passwordIsValid = false;

        vm.register = register;
        vm.validateName = validateName;
        vm.validateEmail = validateEmail;
        vm.validateUsername = validateUsername;
        vm.validatePassword = validatePassword;

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    $location.path('/home');
                }
            });
        })();

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Info(response.message, response.title);
                        $location.path('/verify');
                    } else {
                        FlashService.Warning(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function validateName(event) {
            if (ValidatorService.Name(event)) {
                if (event.target.id === "first-name") {
                    vm.firstNameIsValid = true;
                } else {
                    vm.lastNameIsValid = true;
                }

            } else {
                if (event.target.id === "first-name") {
                    vm.firstNameIsValid = false;
                } else {
                    vm.lastNameIsValid = false;
                }
            }
        }

        function validateEmail(event) {
            vm.emailLoading = "fa fa-spinner fa-pulse";
            if (ValidatorService.Email(event)) {
                UserService.CheckEmail(vm.user.email)
                    .then(function(response) {
                        if (response.success) {
                            vm.eMessage = response.message;
                            vm.eNoteClass = "text-success";
                            vm.emailFormClass = "form-control is-valid";
                            vm.emailLoading = "fa fa-envelope";
                            vm.emailIsValid = true;
                        } else {
                            vm.eMessage = response.message;
                            vm.eNoteClass = "text-danger";
                            vm.emailFormClass = "form-control is-invalid";
                            vm.emailLoading = "fa fa-envelope";
                            vm.emailIsValid = false;
                        }
                    });
            } else {
                vm.emailIsValid = false;
            }
        }

        function validateUsername(event) {
            vm.usernameLoading = "fa fa-spinner fa-pulse";
            if (ValidatorService.Username(event)) {
                UserService.CheckUsername(vm.user.username)
                    .then(function(response) {
                        if (response.success) {
                            vm.uMessage = response.message;
                            vm.uNoteClass = "text-success";
                            vm.usernameFormClass = "form-control is-valid";
                            vm.usernameLoading = "fa fa-user";
                            vm.usernameIsValid = true;
                        } else {
                            vm.uMessage = response.message;
                            vm.uNoteClass = "text-danger";
                            vm.usernameFormClass = "form-control is-invalid";
                            vm.usernameLoading = "fa fa-user";
                            vm.usernameIsValid = false;
                        }
                    });
            } else {
                vm.usernameIsValid = false;
            }
        }

        function validatePassword(event) {
            if (ValidatorService.Password(event)) {
                vm.pMessage = "Valid password";
                vm.pNoteClass = "text-success";
                vm.passwordFormClass = "form-control is-valid";
                vm.passwordLoading = "fa fa-key";
                vm.passwordIsValid = true;
            } else {
                vm.pMessage = "Invalid password";
                vm.pNoteClass = "text-danger";
                vm.passwordFormClass = "form-control is-invalid";
                vm.passwordLoading = "fa fa-key";
                vm.passwordIsValid = false;
            }
        }
    }
})();