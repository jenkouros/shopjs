angular.module("app").directive("sideMenu", function() {
    return {
        restrict: "E",
        scope: {
            activeLink: "=presenting"
        },
        templateUrl: "templates/side-menu.html",
        controller: function ($scope, CategoryModel) {
            CategoryModel.getCategories().then(function(data) {
                $scope.categories = data;
            });

            $scope.changeCategory = function(id) {
                //alert(id);
                //$scope.activeLink = id;
            }
        }
    };
});