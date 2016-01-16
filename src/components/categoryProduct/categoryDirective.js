angular.module('app').directive('categoryProduct', function() {
    return {
        restrict: 'E',
        scope: {
            product: '=product'
        },
        templateUrl: 'templates/category-product.html',
        controller: function ($scope, CartModel) {
            $scope.addProduct = function (product) {
                CartModel.addProduct(product);
            }
        }
    }
});