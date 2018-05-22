(function() {
    'use strict';

    angular
        .module('kbmApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['AuthService', 'KBaseService', 'UserService', '$location', 'FlashService', 'TagService'];

    function HomeController(AuthService, KBaseService, UserService, $location, FlashService, TagService) {
        var vm = this;

        vm.kbs = null;
        vm.knowledge_bases = null;
        vm.collaborations = null;
        vm.publics = null;
        vm.users = null;
        vm.tags = null;
        vm.fill = fill;
        vm.showAll = showAll;
        vm.showPublic = showPublic;
        vm.showPrivate = showPrivate;

        (function initController() {
            AuthService.CheckCredentials(function(response) {
                if (response.success) {
                    vm.fill();
                } else {
                    $location.path('/login');
                }
            });
        })();

        function fill() {
            UserService.GetCollaborations()
                .then(function(response) {
                    if (response.success) {
                        vm.collaborations = response.collaborations;
                        vm.collaborations.forEach(function(role) {
                            switch (role.role) {
                                case '2':
                                    role.role = "Worker";
                                    role.class = "badge badge-success";
                                    break;
                                case '3':
                                    role.role = "Reader";
                                    role.class = "badge badge-secondary";
                                    break;
                            }
                        });
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });

            UserService.GetKnowledgeBases()
                .then(function(response) {
                    if (response.success) {
                        vm.knowledge_bases = response.knowledge_bases;
                        vm.knowledge_bases.forEach(function(role) {
                            switch (role.privacy) {
                                case '1':
                                    role.privacy = "Public";
                                    break;
                                case '2':
                                    role.privacy = "Private";
                                    break;
                            }
                        });
                        vm.showAll();
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });

            KBaseService.GetPublic()
                .then(function(response) {
                    if (response.success) {
                        vm.publics = response.knowledge_bases
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });

            UserService.GetUserList()
                .then(function(response) {
                    if (response.success) {
                        vm.users = response.users;
                        vm.users.forEach(function(user) {
                            user.profile_picture = FILES.user.profile + user.profile_picture
                        });
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });

            TagService.GetAll()
                .then(function(response) {
                    if (response.success) {
                        vm.tags = response.tags;
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });

        }

        function showAll() {
            vm.kbs = vm.knowledge_bases;
        }

        function showPublic() {
            vm.kbs = vm.knowledge_bases.filter(function(kb) {
                return kb.privacy === "Public";
            });
        }

        function showPrivate() {
            vm.kbs = vm.knowledge_bases.filter(function(kb) {
                return kb.privacy === "Private";
            });
        }
    }
})();