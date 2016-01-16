angular.module("app").controller("CartController", function($scope,CartModel) {

    $scope.cart = CartModel.getCart();
    var total = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
        total += $scope.cart[i].quantity * $scope.cart[i].product.price;
    }
    $scope.total = total.toFixed(2);
    $scope.emptyCart = function () {
        CartModel.emptyCart();
        resetCart();
    }

    $scope.$on("cartChange", function() {
        $scope.cart = [];
        $scope.total = 0;
    });

});