angular.module("app").directive("categoryPreviewer", function() {
    return {
        restrict: 'E',
        scope: {
            category: "=category"
        },
        templateUrl: 'templates/categorypreviewer-template.html',
        controller: 'CategoryPreviewerController'
    };
});