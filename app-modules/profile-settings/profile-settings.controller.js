(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = ['AuthService', 'UserService', '$location', 'FlashService', 'ValidatorService'];

    function ProfileSettingsController(AuthService, UserService, $location, FlashService, ValidatorService) {
        var vm = this;

        vm.dataLoading = true;
        vm.edition = false;
        vm.loaderClass = "fa fa-spinner fa-spin";
        vm.loaderMessage = "Loading Information...";
        var username;
        var email;
        vm.profile = null;
        vm.imageSelected = false;
        vm.oldProfilePicture = null;

        vm.usernameFormClass = "form-control";

        vm.firstNameIsValid = true;
        vm.lastNameIsValid = true;
        vm.usernameIsValid = true;
        vm.emailIsValid = true;
        vm.passwordIsValid = true;

        vm.validateName = validateName;
        vm.validateEmail = validateEmail;
        vm.validateUsername = validateUsername;
        vm.validatePassword = validatePassword;
        vm.checkUsername = checkUsername;
        vm.checkEmail = checkEmail;
        vm.hidePopover = hidePopover;

        vm.fill = fill;
        vm.update = update;
        vm.enableEdition = enableEdition;
        vm.disableEdition = disableEdition;

        var display = $('#display');
        var image = $('#image');

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (!response.success) {
                    $location.path('/');
                } else {
                    vm.fill();
                }
            });
        })();

        function fill() {
            vm.dataLoading = true;
            UserService.GetSelf()
                .then(function(response) {
                    if (response.success) {
                        vm.profile = {
                            id: response.id,
                            username: response.username,
                            email: response.email,
                            first_name: response.first_name,
                            last_name: response.last_name,
                            profile_picture: FILES.user.profile + response.profile_picture,
                            new_password: null,
                            register: response.register
                        };
                        vm.oldProfilePicture = response.profile_picture;
                        vm.profile.register.forEach(function(register) {
                            register.date = new Date(register.date);
                        });
                        vm.profile.registered = vm.profile.register[0].date;
                        vm.profile.updated = vm.profile.register[vm.profile.register.length - 1].date;
                        username = vm.profile.username;
                        email = vm.profile.email;
                        vm.dataLoading = false;
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.loaderClass = "fa fa-warning";
                        vm.loaderMessage = "Failed to load user information";
                    }
                });
        }

        function enableEdition() {
            vm.edition = true;
        }

        function disableEdition() {
            vm.edition = false;
            display.croppie('destroy');
        }

        function update() {
            vm.dataLoading = true;
            if (vm.imageSelected) {
                profilePicture(function(image) {
                    vm.profile.profile_picture = image;
                    updater(vm.profile);
                });
            } else {
                vm.profile.profile_picture = vm.oldProfilePicture;
                updater(vm.profile);
            }
        }

        function updater(profile) {
            UserService.Update(profile)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        location.reload(true);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function profilePicture(callback) {
            display.croppie('result', 'base64').then(function(result) {
                callback(result);
            });
        }

        function loadImage(input) {

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    display.croppie({
                        viewport: {
                            width: 300,
                            height: 300
                        },
                        boundary: {
                            width: 400,
                            height: 300
                        },
                        url: e.target.result
                    });
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        $('#image').change(function() {
            loadImage(this);
            vm.imageSelected = true;
        });

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
            if (!ValidatorService.Email(event)) {
                vm.emailIsValid = false;
            }
        }

        function validateUsername(event) {
            if (!ValidatorService.Username(event)) {
                vm.usernameIsValid = false;
            }
        }

        function validatePassword(event) {
            if (!vm.profile.new_password) {
                vm.pMessage = "No password provided";
                vm.pNoteClass = "text-secondary";
                vm.passwordFormClass = "form-control";
                vm.passwordIsValid = true;
            } else {
                if (ValidatorService.Password(event)) {
                    vm.pMessage = "Valid password";
                    vm.pNoteClass = "text-success";
                    vm.passwordFormClass = "form-control is-valid";
                    vm.passwordIsValid = true;
                } else {
                    vm.pMessage = "Invalid password";
                    vm.pNoteClass = "text-danger";
                    vm.passwordFormClass = "form-control is-invalid";
                    vm.passwordIsValid = false;
                }
            }
        }

        function checkEmail(event) {
            if (ValidatorService.Email(event)) {
                if (vm.profile.email === email) {
                    vm.eMessage = "Is your current Email";
                    vm.eNoteClass = "text-secondary";
                    vm.emailFormClass = "form-control";
                    vm.emailIsValid = true;
                } else {
                    UserService.CheckEmail(vm.profile.email)
                        .then(function(response) {
                            if (response.success) {
                                vm.eMessage = response.message;
                                vm.eNoteClass = "text-success";
                                vm.emailFormClass = "form-control is-valid";
                                vm.emailIsValid = true;
                            } else {
                                vm.eMessage = response.message;
                                vm.eNoteClass = "text-danger";
                                vm.emailFormClass = "form-control is-invalid";
                                vm.emailIsValid = false;
                            }
                        });
                }
            } else {
                vm.eMessage = 'Invalid Email';
                vm.eNoteClass = "text-danger";
                vm.emailFormClass = "form-control is-invalid";
                vm.emailIsValid = false;
            }
            hidePopover(event);
        }

        function checkUsername(event) {
            if (ValidatorService.Username(event)) {
                if (vm.profile.username === username) {
                    vm.uMessage = 'Is your current Username';
                    vm.uNoteClass = "text-secondary";
                    vm.usernameFormClass = "form-control";
                    vm.usernameIsValid = true;
                } else {
                    UserService.CheckUsername(vm.profile.username)
                        .then(function(response) {
                            if (response.success) {
                                vm.uMessage = response.message;
                                vm.uNoteClass = "text-success";
                                vm.usernameFormClass = "form-control is-valid";
                                vm.usernameIsValid = true;
                            } else {
                                vm.uMessage = response.message;
                                vm.uNoteClass = "text-danger";
                                vm.usernameFormClass = "form-control is-invalid";
                                vm.usernameIsValid = false;
                            }
                        });
                }
            } else {
                vm.uMessage = 'Invalid Username';
                vm.uNoteClass = "text-danger";
                vm.usernameFormClass = "form-control is-invalid";
                vm.usernameIsValid = false;
            }
            hidePopover(event);
        }

        function hidePopover(event) {
            ValidatorService.Hider(event);
        }
    }
})();