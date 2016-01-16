angular.module("app").directive("mainMenu", function() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: 'templates/main-menu.html',
        controller: function ($scope, CartModel) {
            $scope.cart = CartModel.productCount();
            $scope.$on("cartChange", function() {
                $scope.cart = CartModel.productCount();
            });
        }
    };
});