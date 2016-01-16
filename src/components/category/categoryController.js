angular.module("app").controller("CategoryController", function ($scope, $stateParams, CategoryModel, ProductModel) {
    //CategoryModel.getCategoryById($stateParams.id).the
    CategoryModel.getCategoryById($stateParams.id).then(function(data) {
        $scope.category = data;
    });
    $scope.products = $stateParams.id
        ? CategoryModel.queryCategoryProducts({ id: $stateParams.id })
        : ProductModel.queryProducts({ onlyOnSale: true });
});