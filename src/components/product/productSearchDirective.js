angular.module("app").directive("productSearch", function() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: '/templates/product-search.html',
        controller: function ($scope, ProductModel, $state) {

            $scope.selected = undefined;
            $scope.getProductsByName = function(typings) {
                return ProductModel.queryProducts({ query: typings }).$promise;
            }

            $scope.ngModelOptionsSelected = function (value) {
                console.log(value);
                if (arguments.length) {
                    _selected = value;
                } else {
                    return _selected;
                }
            };

            $scope.onSelect = function ($item, $model, $label, $event) {
                $state.go('product',{id: $item.id });
            }
        }
    }
})