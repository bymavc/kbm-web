(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('DocumentController', DocumentController);

    DocumentController.$inject = ['AuthService', 'DocumentService', '$routeParams', '$location', 'FlashService'];

    function DocumentController(AuthService, DocumentService, $routeParams, $location, FlashService) {
        var vm = this;

        vm.isOwner;
        vm.isWorker;
        vm.isReader;

        vm.document = {
            id: $routeParams.id
        };
        vm.folder = [];
        vm.fill = fill;
        vm.deleteDocument = deleteDocument;

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
            DocumentService.Get(vm.document.id)
                .then(function(response) {
                    if (response.success) {
                        vm.document = response.document;
                        vm.kb = response.knowledge_base;
                        vm.folder = response.folder;
                        AuthService.GetRole(response.role, function(owner, worker, reader) {
                            vm.isOwner = owner;
                            vm.isWorker = worker;
                            vm.isReader = reader;
                        });
                        document.getElementById('content').innerHTML = vm.document.content;
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function deleteDocument() {
            vm.dataLoading = true;
            DocumentService.Delete(vm.document.id)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        angular.element(document.getElementsByClassName('modal-backdrop')).remove();
                        $location.path('/kb/' + vm.kb.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }
    }
})();