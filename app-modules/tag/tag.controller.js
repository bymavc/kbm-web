(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('TagController', TagController);

    TagController.$inject = ['AuthService', '$routeParams', 'FlashService', '$location', 'KBaseService'];

    function TagController(AuthService, $routeParams, FlashService, $location, KBaseService) {
        var vm = this;

        vm.fill = fill;

        vm.tag = $routeParams.name;
        vm.kbs = [];

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    vm.fill();
                } else {
                    $location.path('/');
                }
            });
        })();

        function fill() {
            KBaseService.GetByTag(vm.tag)
                .then(function(response) {
                    if (response.success) {
                        vm.kbs = response.knowledge_bases;
                        console.log(vm.kbs);
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }
    }
})();