angular.module("app").factory("ProductModel", function($resource) {
    var _products = $resource("http://smartninja.betoo.si/api/eshop/products/:id");

    function queryProducts(filter, successFunc, errorFunc) {
        return _products.query(filter, successFunc, errorFunc);
    }

    function getProductById(id) {
        return _products.get({ id: id });
    }

    return {
        queryProducts: queryProducts,
        getProductById: getProductById
    };
});