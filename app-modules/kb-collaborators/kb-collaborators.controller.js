(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('KbCollaboratorsController', KbCollaboratorsController);

    KbCollaboratorsController.$inject = ['AuthService', 'KBaseService', 'UserService', '$routeParams', 'FlashService', '$location'];

    function KbCollaboratorsController(AuthService, KBaseService, UserService, $routeParams, FlashService, $location) {
        var vm = this;

        vm.kb = {
            id: $routeParams.id,
            name: null,
            description: null,
            privacy: null,
            rootFolder: null
        };

        vm.usersFound = [];

        vm.roles = [
            { role: 2, label: "Worker" },
            { role: 3, label: "Reader" }
        ];

        vm.permissions = null;

        vm.update = update;
        vm.loadPermissions = loadPermissions;
        vm.deletePermission = deletePermission;
        vm.addPermission = addPermission;
        vm.findUsers = findUsers;
        vm.print = print;
        vm.showPermissions = showPermissions;
        vm.fill = fill;
        vm.select = select;

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
                        vm.kb.privacy = response.privacy;
                        vm.kb.rootFolder = response.folder;
                        AuthService.GetRole(response.role, function(owner, worker, reader) {
                            if (!owner) {
                                $location.path('/watch/kb/' + vm.kb.id);
                            }
                        });
                        vm.loadPermissions(vm.kb.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = true;
                        vm.loaderClass = "fa fa-warning";
                    }
                });
        }

        function loadPermissions(kb) {
            KBaseService.GetPermissions(kb)
                .then(function(response) {
                    if (response.success) {
                        vm.kb.permissions = response.permissions;
                        vm.kb.permissions.forEach(function(permission) {
                            permission.profile_picture = FILES.user.profile + permission.profile_picture;
                        });
                        vm.showPermissions();
                        vm.dataLoading = false;
                    } else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = true;
                        vm.loaderClass = "fa fa-warning";
                    }
                });
        }

        function deletePermission(user) {
            vm.kb.permissions = vm.kb.permissions.filter(function(permission) {
                return permission.user !== user;
            });
            vm.showPermissions();
            vm.update();
        }

        function addPermission() {
            var user = vm.usersFound.filter(function(user) {
                return user.username === vm.search;
            });
            vm.usersFound = vm.usersFound.filter(function(user) {
                return user.username !== vm.search;
            });
            user = {
                user: user[0].id,
                role: '3',
                username: user[0].username,
                email: user[0].email,
                first_name: user[0].first_name,
                last_name: user[0].last_name,
                profile_picture: user[0].profile_picture
            };
            vm.kb.permissions.push(user);
            vm.showPermissions();
            vm.update();
            vm.search = null;
        }

        function findUsers() {
            UserService.Find(vm.search)
                .then(function(response) {
                    if (response.success) {
                        vm.usersFound = response.users;
                        vm.kb.permissions.forEach(function(permission) {
                            vm.usersFound = vm.usersFound.filter(function(user) {
                                return user.id !== permission.user;
                            });
                        });
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

        function showPermissions() {
            vm.permissions = vm.kb.permissions.filter(function(permission) {
                return permission.role !== '1';
            });
        }

        function update() {
            var data = {
                id: vm.kb.id,
                permissions: vm.kb.permissions
            };
            KBaseService.UpdatePermissions(data)
                .then(function(response) {
                    if (!response.success) {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }
    }
})();