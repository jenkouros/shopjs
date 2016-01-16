angular.module("app").controller("ProductController", function ($scope, $rootScope, $stateParams, ProductModel, CartModel) {
    $scope.product = ProductModel.getProductById($stateParams.id);

    $scope.addProduct = function (product) {
        CartModel.addProduct(product);
    }
});