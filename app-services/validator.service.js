(function() {
    'use strict';

    angular
        .module('kbmApp')
        .factory('ValidatorService', ValidatorService);

    function ValidatorService() {
        var service = {};

        service.Hider = Hider;
        service.Name = Name;
        service.Email = Email;
        service.Username = Username;
        service.Password = Password;
        service.Code = Code;

        return service;

        function Hider(event) {
            hideMessage(event.target);
        }

        function Name(event) {
            var element = event.target;
            var object = {
                name: "Name",
                minlength: 3,
                maxlength: 20,
                restriction: "Must Contain only letters",
                tester: function(value) {
                    var regex = /[A-Za-z\sáéíóúñÁÉÍÓÚÑ\']/;
                    return regex.test(value);
                },
            };

            return validate(object, element);
        }

        function Email(event) {
            var element = event.target;
            var object = {
                name: "Email",
                minlength: 8,
                maxlength: 60,
                restriction: "Must be a valid email address",
                tester: function(value) {
                    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return regex.test(value);
                },
            };

            return validate(object, element);
        }

        function Username(event) {
            var element = event.target;
            var object = {
                name: "Username",
                minlength: 5,
                maxlength: 20,
                restriction: "Must Contain only letters, numbers and combinations of both",
                tester: function(value) {
                    var regex = /^[a-zA-Z0-9]+$/;
                    return regex.test(value);
                },
            };

            return validate(object, element);
        }

        function Password(event) {
            var element = event.target;
            var object = {
                name: "Password",
                minlength: 8,
                maxlength: 20,
                restriction: "Must Contain only uppercase letters, lowercase letters and numbers",
                tester: function(value) {
                    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

                    return regex.test(value);
                },
            };

            return validate(object, element);
        }

        function Code(event) {
            var element = event.target;
            var object = {
                name: "Code",
                minlength: 10,
                maxlength: 10,
                restriction: "Must Be a valid code",
                tester: function(value) {
                    var regex = /^[a-zA-Z0-9]+$/;

                    return regex.test(value);
                },
            };

            return validate(object, element);
        }

        // private functions

        function validate(object, element) {
            var value = element.value;
            var length = validateLength(object.minlength, object.maxlength, value);
            if (length.valid) {
                if (object.tester(value)) {
                    hideMessage(element);
                    return true;
                } else {
                    showMessage(element, object.name + " Problem", object.restriction);
                }
            } else {
                showMessage(element, object.name + " Problem", "The " + object.name + " " + length.message);
            }
            return false;
        }

        function validateLength(minlength, maxlength, value) {
            if (value.length < minlength) {
                return { valid: false, message: 'is too short' };
            }
            if (value.length > maxlength) {
                return { valid: false, message: 'is too long' };
            }
            return { valid: true };
        }

        function showMessage(element, title, message) {
            var e = angular.element(element);
            e.popover('dispose');
            e.popover({
                content: message,
                title: title
            });
            e.popover('show');
        }

        function hideMessage(element) {
            var e = angular.element(element);
            e.popover('hide');
        }
    }
})();