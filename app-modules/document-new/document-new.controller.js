(function(){
    'use strict';

    angular
        .module('kbmApp')
        .controller('DocumentNewController', DocumentNewController);

    DocumentNewController.$inject = ['AuthService', 'DocumentService', 'FlashService', 'FolderService', '$routeParams', '$location'];
    function DocumentNewController(AuthService, DocumentService, FlashService, FolderService, $routeParams, $location){
        var vm = this;

        vm.folder = {
            id: $routeParams.folder,
            name: null,
            parent_folder: null
        };

        vm.kb = {
            id: null,
            name: null
        };

        vm.tags = [];

        vm.document = {
            knowledge_base: null,
            folder: null,
            name: null,
            description: null,
            content: null,
            tags: null
        };

        var editor = $('#content');

        vm.fill = fill;
        vm.create = create;
        vm.addTag = addTag;
        vm.removeTag = removeTag;

        (function initController(){
            vm.fill();
        })();

        function fill(){
            FolderService.Get(vm.folder.id)
                .then(function(response){
                    if(response.success){
                        vm.kb = {
                            id: response.knowledge_base.id,
                            name: response.knowledge_base.name
                        };
                        vm.folder = {
                            id: response.folder.id,
                            name: response.folder.parent_folder ? response.folder.name : 'Root Folder'
                        };
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function create(){
            vm.document.knowledge_base = vm.kb.id;
            vm.document.folder = vm.folder.id;
            vm.document.content = editor.froalaEditor('html.get');
            vm.document.tags = vm.tags;

            DocumentService.Create(vm.document)
                .then(function(response){
                    if(response.success){
                        FlashService.Success(response.message, response.title);
                        $location.path('/document/' + response.id)
                    } else {
                        FlashService.Error(response.message, response.title);
                    }
                });
        }

        function addTag(){
            if(angular.isDefined(vm.tag)){
                if(vm.tag.length > 2){
                    var included = false;
                    vm.tags.forEach(function(tag){
                        if(tag === vm.tag.toLowerCase()){
                            included = true;
                        }
                    });
                    if(!included){
                        vm.tags.push(vm.tag.toLowerCase());
                    }
                }
                vm.tag = null;
            }
        }

        function removeTag(tag_name){
            vm.tags = vm.tags.filter(function(tag){
                return tag !== tag_name;
            });
        }
    }
})();