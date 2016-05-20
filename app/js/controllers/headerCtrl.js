/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:headerCtrl
 * @requires $scope
 * @requires $location
 * @description Controller for header part.
 */
rogersWeb.controller('headerCtrl', function($scope,$location, $translate, registrationService, localize, isLoggedIn, $http) {
    "use strict";
    $scope.qty = 0;
    $scope.lang = "FRENCH";
    $scope.loggedIn = function() {
        $scope.logged_In = isLoggedIn.isLoggedIn(sessionStorage.getItem('loggedInUser'));
    };
    $scope.loggedIn();
    $scope.flag = false;
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:headerCtrl#on
     * @methodOf rogersWeb.controllers:headerCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description receive message from other controller communication between controller This function is a listner function
     */
    $scope.$on("showHide", function(event, arg) {
        $scope.pagePath = arg.pagelink;
        $scope.loggedIn();
    });
    $scope.$on("quantity", function(event, arg) {
        $scope.qty = $scope.getProductCount();
    });
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl#getProductList
     * @methodOf rogersWeb.controllers:cartCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description Get product list from server
     */
    $scope.getProductCount = function() {
        registrationService.getProductCount(sessionStorage.getItem('loggedInUser'), function(data) {
            $scope.qty = 0;
            for (var i = 0; i < data.length; i++) {
                $scope.qty += data[i].productDetails.Quantity;
            }
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:headerCtrl#logout
     * @methodOf rogersWeb.controllers:headerCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description Logout
     */
    $scope.logout = function() {
        sessionStorage.removeItem('loggedInUser');
        $scope.qty = 0;
        $scope.loggedIn();
        $location.path('/login');
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl#check
     * @methodOf rogersWeb.controllers:cartCtrl
     * @description Redirect to checkout page.
     */
    $scope.checkout = function() {
        if ($scope.isLoggedIn() && $scope.qty >= 1) {
            $location.path('/checkout');
        }
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:headerCtrl#logout
     * @methodOf rogersWeb.controllers:headerCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description Redirect to Home page
     */
    $scope.redirectToOtherPage = function() {
        $location.path("/" + $scope.pagePath);
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:headerCtrl#isLoggedIn
     * @methodOf rogersWeb.controllers:headerCtrl
     * @description checked wheather user logged in or not
     */
    $scope.isLoggedIn = function() {
        if (sessionStorage.getItem('loggedInUser') !== null) {
            return true;
        } else {
            return false;
        }
    };
    /**
     *added by priti mondal date:15/4/2016
     *static JSON for menubar.
     *some functions for opening the submenuitems from meinmenu
     **/
    $http.get('json/products.json').success(function(data) {
        $scope.mainmenu = data;
    });
    $scope.id;
    $scope.hoverIn = function(ind) {
        $scope.id = ind;
        $scope.subMenuItems = $scope.mainmenu[ind].subMenuItems;
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:headerCtrl#toggleLanguage
     * @methodOf rogersWeb.controllers:headerCtrl
     * @description Toggle between language English and French
     */
    $scope.toggleLanguage = function() {
        if ($translate.use() === "en") {
            $scope.lang = "ENGLISH";
            $translate.use("fr");
            localize.setLanguage("fr");
        } else {
            $scope.lang = "FRENCH";
            $translate.use("en");
            localize.setLanguage("en");
        }
    };
    /*Redirects when clicking to wireless to cart page*/
    $scope.redirect = function(id, menuName) {
        if (sessionStorage.getItem('loggedInUser') !== null && (id === 0 && menuName === "WIRELESS")) {
            $location.path("/cart");
        };
    };
    $scope.redirectToHome = function() {
        if (sessionStorage.getItem('loggedInUser') !== null) {
            $location.path('/home');
        };
    };
    $scope.$on("spinner", function(event, arg){
        $scope.flag = arg.flag;
    });
});