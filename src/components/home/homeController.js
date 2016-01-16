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