(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('DocumentEditController', DocumentEditController);

    DocumentEditController.$inject = ['$location', 'FlashService', 'DocumentService', 'AuthService', '$routeParams'];

    function DocumentEditController($location, FlashService, DocumentService, AuthService, $routeParams) {
        var vm = this;

        vm.document = {
            id: $routeParams.id
        };
        vm.folder = [];
        vm.fill = fill;
        vm.update = update;
        vm.deleteDocument = deleteDocument;
        vm.addTag = addTag;
        vm.removeTag = removeTag;

        var editor = $('#content');

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
                        vm.folder = (response.folder[0].parent_folder) ? response.folder[0] : { id: response.folder.id, name: "Root Folder", parent_folder: response.folder.parent_folder };
                        editor.froalaEditor('html.insert', vm.document.content);
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function update() {
            vm.document.content = editor.froalaEditor('html.get');
            DocumentService.Update(vm.document)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
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

        function addTag() {
            if (angular.isDefined(vm.tag)) {
                if (vm.tag.length > 2) {
                    var included = false;
                    vm.document.tags.forEach(function(tag) {
                        if (tag === vm.tag.toLowerCase()) {
                            included = true;
                        }
                    });
                    if (!included) {
                        vm.document.tags.push(vm.tag.toLowerCase());
                    }
                }
                vm.tag = null;
            }
        }

        function removeTag(tag_name) {
            vm.document.tags = vm.document.tags.filter(function(tag) {
                return tag !== tag_name;
            });
        }
    }
})();