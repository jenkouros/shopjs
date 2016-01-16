angular.module("app").factory("CartModel", function ($rootScope, locker) {
    var cart = _getCachedCart();

    function _getCachedCart() {
        if (locker.has('cart')) {
            return locker.get('cart');
        }
        return [];
    }

    function _addProduct(product) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].product.id === product.id) {
                cart[i].quantity += 1;
                return cart[i];
            }
        }
        var add = {
            quantity: 1,
            product: product
        }
        cart.push(add);
        return add;
    }

    function emptyCart() {
        cart = [];
        cacheCart();
        $rootScope.$broadcast("cartChange");
    }

    function addProduct(product) {
        _addProduct(product);
        cacheCart();
        $rootScope.$broadcast("cartChange");
    }

    function productCount() {
        var result = 0;
        for (var i = 0; i < cart.length; i++) {
            result += cart[i].quantity;
        }
        return result;
    }

    function getCart() {
        return cart;
    }

    function cacheCart() {
        locker.put('cart', cart);
    }

    return {
        addProduct: addProduct,
        productCount: productCount,
        getCart: getCart,
        emptyCart: emptyCart
}
});