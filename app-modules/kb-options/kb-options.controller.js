(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('KbOptionsController', KbOptionsController);

    KbOptionsController.$inject = ['AuthService', 'KBaseService', 'UserService', '$routeParams', 'FlashService', '$route', '$location'];

    function KbOptionsController(AuthService, KBaseService, UserService, $routeParams, FlashService, $route, $location) {
        var vm = this;

        vm.fill = fill;
        vm.update = update;
        vm.deleteKB = deleteKB;
        vm.changePrivacy = changePrivacy;
        vm.changeOwnership = changeOwnership;
        vm.findUsers = findUsers;
        vm.select = select;

        vm.kb = {
            id: $routeParams.id,
            name: null,
            description: null,
            rootFolder: null,
            permissions: null,
            privacy: null
        };

        vm.usersFound = [];

        vm.isPublic = false;

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
                        vm.kb.permissions = response.permissions;
                        vm.kb.privacy = response.privacy;
                        AuthService.GetRole(response.role, function(owner, worker, reader) {
                            if (!owner) {
                                $location.path('/watch/kb/' + vm.kb.id);
                            }
                        });
                        vm.isPublic = (vm.kb.privacy === '1');
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = true;
                        vm.loaderClass = "fa fa-warning";
                    }
                });
        }

        function update() {
            KBaseService.Update(vm.kb)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Info(response.message, response.title);
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                })
        }

        function deleteKB() {
            var data = {
                id: vm.kb.id,
                name: vm.name
            };
            KBaseService.Delete(data)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Info(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        angular.element(document.getElementsByClassName('modal-backdrop')).remove();
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function changePrivacy() {
            var data = {
                id: vm.kb.id,
                name: vm.name,
                privacy: (vm.kb.privacy === '1') ? '2' : '1'
            };

            KBaseService.UpdatePrivacy(data)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Info(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        angular.element(document.getElementsByClassName('modal-backdrop')).remove();
                        $route.reload();
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function changeOwnership() {
            var user = vm.usersFound.filter(function(user) {
                return user.username === vm.search;
            });

            var data = {
                id: vm.kb.id,
                name: vm.name,
                new_owner: user[0].id
            };

            KBaseService.UpdateOwner(data)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Info(response.message, response.title);
                        angular.element(document.getElementsByClassName('options-modal')).modal('hide');
                        angular.element(document.getElementsByClassName('modal-backdrop')).remove();
                        $route.reload();
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function findUsers() {
            UserService.Find(vm.search)
                .then(function(response) {
                    if (response.success) {
                        vm.usersFound = response.users;
                        vm.usersFound.forEach(function(user) {
                            user.profile_picture = FILES.user.profile + user.profile_picture;
                        });
                    } else {
                        FlashService.Warning(response.message, response.title);
                    }
                });
        }

        function select(user_id) {
            var user = vm.usersFound.filter(function(user) {
                return user.id === user_id;
            });
            vm.search = user[0].username;
        }


    }
})();