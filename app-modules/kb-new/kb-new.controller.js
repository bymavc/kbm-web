(function(){
    'use strict';

    angular
        .module('kbmApp')
        .controller('KbNewController', KbNewController);

    KbNewController.$inject = ['AuthService', 'UserService', '$location', 'KBaseService', 'FlashService'];
    function KbNewController(AuthService, UserService, $location, KBaseService, FlashService){
        var vm = this;

        vm.dataLoading = false;

        vm.create = create;

        vm.owner = null;
        vm.kbase = {
            name: null,
            description: null,
            privacy: 1
        };

        (function initController(){
            UserService.GetSelf()
                .then(function(response){
                    if(response.success){
                        vm.owner = {
                            username: response.username,
                            image: FILES.user.profile + response.profile_picture
                        };
                    } else {
                        $location.path('/');
                    }
                });
        })();

        function create(){
            vm.dataLoading = true;
            KBaseService.Create(vm.kbase)
                .then(function(response){
                    if(response.success){
                        FlashService.Success(response.message, response.title);
                        $location.path('/watch/kb/' + response.id);
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }
    }
})();