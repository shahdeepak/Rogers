var rogers = angular.module('rogers', ['ngRoute', 'ngAnimate', 'ngTouch', 'angular-carousel', 'pascalprecht.translate', 'localization']);
var user = [];
rogers.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: './views/home.html',
        controller: 'homeCtrl'
    }).
    when('/history', {
        templateUrl: './views/history.html',
        controller: 'homeCtrl'
    }).
    when('/login', {
        templateUrl: './views/login.html',
        controller: 'loginCtrl'
    }).
    when('/profile', {
        templateUrl: './views/profile.html',
        controller: 'homeCtrl'
    }).
    when('/chat/:email', {
        templateUrl: './views/chat.html',
        controller: 'homeCtrl'
    }).
    when('/updateHobby', {
        templateUrl: './views/updateHobby.html',
        controller: 'UserProfileCtrl'
    }).
    when('/displayCart', {
        templateUrl: './views/displayCart.html',
        controller: 'displayCtrl'
    }).
    when('/display', {
        templateUrl: './views/display.html',
        controller: 'displayCtrl'
    }).
    when('/registration', {
        templateUrl: './views/register.html',
        controller: 'registerCtrl'
    }).
    when('/personal', {
        templateUrl: './views/personalInfo.html',
        controller: 'personalCtrl'
    }).
    when('/card', {
        templateUrl: './views/creditCard.html',
        controller: 'paymentCardCtrl'
    }).
    when('/submitAd', {
        templateUrl: './views/submitAd.html',
        controller: 'submitCtrl'
    }).
    when('/thankyou', {
        templateUrl: './views/thankyou.html',
        controller: 'thankyouCtrl'
    }).
    otherwise({
        redirectTo: '/home'
    });
}]);
rogers.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
}]);