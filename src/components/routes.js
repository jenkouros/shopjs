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