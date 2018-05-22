(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['AuthService', 'UserService', '$routeParams', '$location', 'FlashService'];

    function ProfileController(AuthService, UserService, $routeParams, $location, FlashService) {
        var vm = this;

        vm.dataLoading = true;
        vm.edition = false;
        vm.loaderClass = "fa fa-spinner fa-spin";
        vm.loaderMessage = "Loading Information...";
        vm.user = null;
        vm.username = $routeParams.username;
        vm.tab = $routeParams.tab;
        vm.tags = [];
        vm.showable = null;
        vm.tag = "none";
        vm.baseFilter = null;

        vm.fill = fill;
        vm.filterByTag = filterByTag;
        vm.filterByName = filterByName;

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
            UserService.GetActivities(vm.username)
                .then(function(response) {
                    if (response.success) {
                        vm.user = {
                            username: response.username,
                            email: response.email,
                            first_name: response.first_name,
                            last_name: response.last_name,
                            profile_picture: FILES.user.profile + response.profile_picture,
                            actions: response.actions,
                            roles: response.roles
                        };
                        vm.user.actions.forEach(function(action) {
                            action.date = new Date(action.date)
                        });
                        vm.user.roles.forEach(function(role) {
                            switch (role.role) {
                                case '1':
                                    role.role = "Owner";
                                    role.class = "badge badge-primary";
                                    break;
                                case '2':
                                    role.role = "Worker";
                                    role.class = "badge badge-success";
                                    break;
                                case '3':
                                    role.role = "Reader";
                                    role.class = "badge badge-secondary";
                                    break;
                            }
                            switch (role.privacy) {
                                case '1':
                                    role.privacy = "Public";
                                    break;
                                case '2':
                                    role.privacy = "Private";
                                    break;
                            }
                            role.tags.forEach(function(tag) {
                                var included = false;
                                vm.tags.forEach(function(t) {
                                    if (t === tag) {
                                        included = true;
                                    }
                                });
                                if (!included) {
                                    vm.tags.push(tag);
                                }
                            });
                        });
                        vm.showable = vm.user.roles;
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function filterByTag() {
            if (vm.tag === "none") {
                vm.showable = vm.user.roles;
            } else {
                vm.showable = vm.user.roles.filter(function(role) {
                    return tagFilter(role.tags)
                });
            }

            function tagFilter(tags) {
                var exists = false;
                tags.forEach(function(tag) {
                    if (tag === vm.tag) {
                        exists = true;
                    }
                });
                return exists;
            }
        }

        function filterByName() {
            if (!vm.baseFilter) {
                vm.showable = vm.user.roles;
            } else {
                vm.showable = vm.user.roles.filter(function(role) {
                    return nameFilter(role.knowledge_base_name);
                });
            }

            function nameFilter(name) {
                if (name.search(vm.baseFilter) < 0) {
                    return false;
                } else {
                    return true;
                }
            }

        }
    }
})();