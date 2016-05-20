/**
 * Created by Deepak.Shah on 17-03-2016.
 * @description routing html page
 */
var rogersWeb = angular.module('rogersWeb', ['ngRoute', 'ngSanitize','720kb.datepicker', 'pascalprecht.translate', 'localization']);
var user = [];
rogersWeb.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: './views/login.html',
        controller: 'loginCtrl'
    }).when('/registration', {
        templateUrl: './views/register.html',
        controller: 'registerCtrl'
    }).when('/profile', {
        templateUrl: './views/profile.html',
        controller: 'userProfileCtrl'
    }).when('/home', {
        templateUrl: './views/home.html',
        controller: 'homeCtrl'
    }).when('/cart', {
        templateUrl: './views/add-to-cart.html',
        controller: 'cartCtrl'
    }).when('/productDetails', {
        templateUrl: './views/productDetail.html',
        controller: 'productDetailCtrl'
    }).when('/checkout', {
        templateUrl: './views/checkout.html',
        controller: 'checkoutCtrl'
    }).when('/shipping', {
        templateUrl: './views/shippingAddress.html',
        controller: 'shippingCtrl'
    }).when('/thankyou', {
        templateUrl: './views/thankYou.html',
        controller: 'thankyouCtrl'
    }).when('/payment', {
        templateUrl: './views/payment.html',
        controller: 'paymentCtrl'
    }).when('/review', {
        templateUrl: './views/review.html',
        controller: 'reviewCtrl'
    }).when('/supplier', {
        templateUrl: './views/supplier.html',
        controller: 'supplierCtrl'
    }).when('/admin', {
        templateUrl: './views/productEntry.html',
        controller: 'productEntryCtrl'
    }).otherwise({
        redirectTo: '/login'
    });
}]);
rogersWeb.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
}]);