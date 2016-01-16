angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'angular-locker']);

angular.module('app').config(function(lockerProvider) {
    lockerProvider.defaults({
        driver: 'local',
        namespace: 'uje-shopjs'
    });
});


angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    //$stateProvider.state('home', {
    //    url: '/',
    //    templateUrl: '/templates/category-template.html',
    //    controller: 'CategoryController'
    //});

    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/templates/home-template.html',
        controller: 'CarouselController'
    });

    $stateProvider.state('category', {
        url: '/category/:id',
        templateUrl: '/templates/category-template.html',
        controller: 'CategoryController'
    });

    $stateProvider.state('product', {
        url: '/product/:id',
        templateUrl: '/templates/product-template.html',
        controller: 'ProductController'
    });

    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: '/templates/cart-template.html',
        controller: 'CartController'
    });

    $urlRouterProvider.otherwise('/');

});
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
angular.module("app").factory("CategoryModel", function ($resource, locker, $q) {
    var _categories = $resource('http://smartninja.betoo.si/api/eshop/categories');
    var _products = $resource('http://smartninja.betoo.si/api/eshop/categories/:id/products');


    function getCategories() {
        var task = $q.defer();

        if (locker.has('categories')) {
            task.resolve(locker.get('categories'));
        } else {
            _categories.query(
                function(data) {
                    locker.put('categories', data);
                    task.resolve(data);
                },
                function() {
                    task.reject([]);
                });
        }
        return task.promise;
    }

    function queryCategoryProducts(filter, successFunc, errorFunc) {
        return _products.query(filter, successFunc, errorFunc);
    }

    function getCategoryProductsForPreviewer(category) {
        var task = $q.defer();
        queryCategoryProducts({ id: category.id, onlyStocked: true }, function (data) {
            var result = [];
            //TODO optimise on server...
            for (var i = 0, j = 3; i < j; i++) {
                result.push(data[i]);
            }
            task.resolve({
                category: category,
                products: result
            });
        }, function () {
            task.reject("error");
        })
        return task.promise;
    }

    function getCategoryById(id) {
        var task = $q.defer();

        getCategories().then(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    task.resolve(data[i]);
                }
            }
            task.resolve(null);
        });
        return task.promise;
    }

    return {
        getCategoryById: getCategoryById,
        getCategories: getCategories,
        queryCategoryProducts: queryCategoryProducts,
        getCategoryProductsForPreviewer: getCategoryProductsForPreviewer
    };
})
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
angular.module("app").controller("CategoryController", function ($scope, $stateParams, CategoryModel, ProductModel) {
    //CategoryModel.getCategoryById($stateParams.id).the
    CategoryModel.getCategoryById($stateParams.id).then(function(data) {
        $scope.category = data;
    });
    $scope.products = $stateParams.id
        ? CategoryModel.queryCategoryProducts({ id: $stateParams.id })
        : ProductModel.queryProducts({ onlyOnSale: true });
});
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
angular.module("app").controller("CategoryPreviewerController", function ($scope) {

});
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
angular.module("app").controller("CarouselController", function($scope, ProductModel, CategoryModel) {
    $scope.interval = 5000;

    // carousel
    ProductModel.queryProducts({ onlyOnSale: true }, function (products) {
        var slides = [];
        var temp = [];
        for (var i = 0, j = products.length - products.length % 3 ; i < j; i++) {
            if (i != 0 && i % 3 == 0) {
                slides.push(temp);
                temp = [];
            }
            temp.push({ image: products[i].image, name: products[i].name });
        }
        $scope.slides = slides;
    });

    CategoryModel.getCategories().then(function (data) {
        $scope.categories = [];
        for (var i = 0, j = data.length; i < j; i++) {
            CategoryModel.getCategoryProductsForPreviewer(data[i]).then(function (data) {
                $scope.categories.push(data);
            });
        }
        
    });

});
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
angular.module("app").controller("ProductController", function ($scope, $rootScope, $stateParams, ProductModel, CartModel) {
    $scope.product = ProductModel.getProductById($stateParams.id);

    $scope.addProduct = function (product) {
        CartModel.addProduct(product);
    }
});
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