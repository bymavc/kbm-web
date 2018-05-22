$(document).ready(function(){
    $('.header').height($(window).height());
});

(function(){
    'use strict';

    angular
        .module('kbmApp')
        .factory('MailerService', MailerService);
    
    MailerService.$inject = ['$http'];
    function MailerService($http){
        var service = {};
        service.Mail = Mail;

        return service;

        function Mail(mail){
            return $http.post(
                API.info.mailer, 
                mail
            ).then(handleSuccess, handleError("Unable to send mail"));
        }

        //private functions
        function handleSuccess(response) {
            return response.data;
        }

        function handleError(error) {
            return function() {
                return { success: false, message: error, title: 'Error' };
            };
        }
    }
})();

(function(){
    'use strict';

    angular
        .module('kbmApp')
        .controller('MailerController', MailerController);
    
    MailerController.$inject = ['MailerService'];
    function MailerController(MailerService){
        var vm = this;
        vm.send = send;
        vm.tryAgain = tryAgain;

        vm.sent = false;
        vm.dataLoading = false;
        

        function send(){
            vm.dataLoading = true;
            MailerService.Mail(vm.mail)
                .then(function(response){
                    if(response.success){
                        vm.mailerHeading = response.title;
                        vm.mailerClass = "alert alert-info";
                        vm.mailerText = response.message;
                        vm.mailerButtonText = "Send Another Mail";
                        vm.mailerButtonClass = "btn btn-info";
                        vm.sent = true;
                        vm.mail = null;
                        vm.dataLoading = false;
                    } else {
                        vm.mailerHeading = response.title;
                        vm.mailerClass = "alert alert-warning";
                        vm.mailerText = response.message;
                        vm.mailerButtonText = "Try Again";
                        vm.mailerButtonClass = "btn btn-warning";
                        vm.sent = true;
                        vm.dataLoading = false;
                    }
                });
        }

        function tryAgain(){
            vm.sent = false;
        }
    }
})();