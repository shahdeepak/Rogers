/*Created by Anurati:16/5/2016 */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:cartCtrl
 * @requires $scope
 * @requires $location
 * @description Controller for add product to cart.
 */
rogersWeb.controller('supplierCtrl', function($scope, registrationService) {
    "use strict";
    var email = sessionStorage.getItem('loggedInUser');
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl
     * @service $http
     * @description get product list from database.
     */
    registrationService.getPurchase(email,success , failure);

    function success(result) {
        $scope.detailOfPurchaseTable = result;
    };

   function failure() {
        $scope.message = "Error";
    };
    
    /*Pagination*/
    $scope.curPage = 0;
    $scope.pageSize = 10;
    
      $scope.numberOfPages = function() {
        return Math.ceil($scope.datalists.length / $scope.pageSize);
                };
});