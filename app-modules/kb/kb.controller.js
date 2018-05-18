(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('KbController', KbController);

    KbController.$inject = ['AuthService', 'KBaseService', 'FolderService', 'DocumentService', '$route', '$routeParams', 'FlashService', '$location', '$scope'];

    function KbController(AuthService, KBaseService, FolderService, DocumentService, $route, $routeParams, FlashService, $location, $scope) {
        var vm = this;

        vm.dataLoading = true;
        vm.displayClass = "col-10";
        vm.loaderClass = "fa fa-spinner fa-pulse";
        vm.loadFolder = loadFolder;
        vm.changeFolder = changeFolder;
        vm.newFolder = newFolder;
        vm.updateFolder = updateFolder;
        vm.deleteFolder = deleteFolder;
        vm.deleteDocument = deleteDocument;
        vm.focusContent = focusContent;
        vm.fill = fill;

        $scope.$on('$routeUpdate', function(e, next, current) {
            if (angular.isUndefined($location.search().folder)) {
                vm.loadFolder(vm.kb.rootFolder);
            } else {
                vm.loadFolder($location.search().folder);
            }
        });

        vm.kb = {
            id: $routeParams.id,
            name: null,
            description: null,
            rootFolder: null
        };

        vm.role = null;

        vm.path = [];

        vm.folder = {
            id: $location.search().folder,
            name: null,
            parent_folder: null,
            contents: null
        };

        vm.focused_folder = {
            id: null,
            name: null
        };

        vm.focused_document = {
            id: null,
            name: null
        };

        vm.isWorker;
        vm.isOwner;
        vm.isReader;

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
            KBaseService.Get(vm.kb.id)
                .then(function(response) {
                    if (response.success) {
                        vm.kb.name = response.name;
                        vm.kb.description = response.description;
                        vm.kb.rootFolder = response.folder;
                        vm.role = response.role;
                        AuthService.GetRole(response.role, function(owner, worker, reader) {
                            vm.isOwner = owner;
                            vm.isWorker = worker;
                            vm.isReader = reader;
                            if (vm.isWorker) {
                                vm.displayClass = "col-10";
                            } else {
                                vm.displayClass = "col-12";
                            }
                        });
                        if (!angular.isUndefined(vm.folder.id)) {
                            loadFolder(vm.folder.id);
                        } else {
                            loadFolder(vm.kb.rootFolder);
                        }
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = true;
                        vm.loaderClass = "fa fa-warning";
                    }
                });
        }


        function loadFolder(folder_id) {
            FolderService.Get(folder_id)
                .then(function(response) {
                    if (response.success) {
                        vm.folder = {
                            id: response.folder.id,
                            name: response.folder.name,
                            parent_folder: response.folder.parent_folder,
                            contents: response.folder.contents
                        };
                        vm.folder.contents.forEach(function(content) {
                            content.date = new Date(content.date)
                        });
                        vm.dataLoading = false;
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function changeFolder(folder_id) {
            $location.search('folder', folder_id);
        }

        function newFolder() {
            vm.dataLoading = true;
            var folder = {
                name: vm.new_folder.name,
                parent_folder: vm.folder.id
            };
            FolderService.Create(folder)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        vm.loadFolder(vm.folder.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function updateFolder() {
            vm.dataLoading = true;
            FolderService.Update(vm.focused_folder)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        vm.loadFolder(vm.folder.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function deleteFolder() {
            vm.dataLoading = true;
            FolderService.Delete(vm.focused_folder.id)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        vm.loadFolder(vm.folder.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function deleteDocument() {
            vm.dataLoading = true;
            DocumentService.Delete(vm.focused_document.id)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        vm.loadFolder(vm.folder.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }

        function focusContent(content_id, content_type) {
            var type = vm.folder.contents.filter(function(content) {
                return content.type === content_type;
            });
            var content = type.filter(function(content) {
                return content.id === content_id;
            });
            if (content_type === 'folder') {
                vm.focused_folder.id = content[0].id;
                vm.focused_folder.name = content[0].name;
            } else {
                vm.focused_document.id = content[0].id;
                vm.focused_document.name = content[0].name;
            }
        }
    }
})();