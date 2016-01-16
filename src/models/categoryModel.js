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