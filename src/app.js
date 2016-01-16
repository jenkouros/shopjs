angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'angular-locker']);

angular.module('app').config(function(lockerProvider) {
    lockerProvider.defaults({
        driver: 'local',
        namespace: 'uje-shopjs'
    });
});

