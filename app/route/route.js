(function() {
    'use strict';

    angular
        .module('kbmApp')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/login'
            })
            .when('/tag/:name', {
                controller: 'TagController',
                templateUrl: 'app-modules/tag/tag.view.html',
                controllerAs: 'vm'
            })
            .when('/change/password/:code', {
                controller: 'ChangePasswordController',
                templateUrl: 'app-modules/change-password/change-password.view.html',
                controllerAs: 'vm'
            })
            .when('/home', {
                controller: 'HomeController',
                templateUrl: 'app-modules/home/home.view.html',
                controllerAs: 'vm'
            })
            .when('/document/:id', {
                controller: 'DocumentController',
                templateUrl: 'app-modules/document/document.view.html',
                controllerAs: 'vm'
            })
            .when('/new/document/:folder', {
                controller: 'DocumentNewController',
                templateUrl: 'app-modules/document-new/document-new.view.html',
                controllerAs: 'vm'
            })
            .when('/edit/document/:id', {
                controller: 'DocumentEditController',
                templateUrl: 'app-modules/document-edit/document-edit.view.html',
                controllerAs: 'vm'
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'app-modules/login/login.view.html',
                controllerAs: 'vm'
            })
            .when('/new/kb', {
                controller: 'KbNewController',
                templateUrl: 'app-modules/kb-new/kb-new.view.html',
                controllerAs: 'vm'
            })
            .when('/settings/options/kb/:id', {
                controller: 'KbOptionsController',
                templateUrl: 'app-modules/kb-options/kb-options.view.html',
                controllerAs: 'vm'
            })
            .when('/settings/collaborators/kb/:id', {
                controller: 'KbCollaboratorsController',
                templateUrl: 'app-modules/kb-collaborators/kb-collaborators.view.html',
                controllerAs: 'vm'
            })
            .when('/settings/profile', {
                controller: 'ProfileSettingsController',
                templateUrl: 'app-modules/profile-settings/profile-settings.view.html',
                controllerAs: 'vm'
            })
            .when('/kb/:id', {
                controller: 'KbController',
                templateUrl: 'app-modules/kb/kb.view.html',
                controllerAs: 'vm',
                reloadOnSearch: false
            })
            .when('/profile/:username', {
                controller: 'ProfileController',
                templateUrl: 'app-modules/profile/profile.view.html',
                controllerAs: 'vm'
            })
            .when('/join', {
                controller: 'RegisterController',
                templateUrl: 'app-modules/register/register.view.html',
                controllerAs: 'vm'
            })
            .when('/recover', {
                controller: 'RecoverController',
                templateUrl: 'app-modules/recover/recover.view.html',
                controllerAs: 'vm'
            })
            .when('/verify', {
                controller: 'VerifyController',
                templateUrl: 'app-modules/verify/verify.view.html',
                controllerAs: 'vm'
            })
            .when('/verify/:code', {
                controller: 'VerifyController',
                templateUrl: 'app-modules/verify/verify.view.html',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();