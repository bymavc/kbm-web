(function(){
    'use strict';

    angular
        .module('kbmApp')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['AuthService', 'FlashService'];
    function HeaderController(AuthService, FlashService){
        var vm = this;

        vm.dataLoading = false;
        vm.logged = false;
        vm.username = null;
        vm.image = null;
        vm.logout = logout;

        (function initController(){
            AuthService.CheckCredentials(function(response){
                if(response.success){
                    vm.username = response.user;
                    vm.first_name = response.first_name;
                    vm.last_name = response.last_name;
                    vm.image = FILES.user.profile + response.image;
                    vm.logged = true;
                } else {
                    vm.logged = false;
                }
            });
        })();

        function logout(){
            vm.dataLoading = true;
            AuthService.Logout()
                .then(function(response){
                    if(response.success){
                        AuthService.ClearCredentials();
                    }else {
                        FlashService.Error(response.message, response.title);
                        vm.dataLoading = false;
                    }
                });
        }
    }
})();