/*Created by Anurati:16/5/2016 */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:supplierCtrl
 * @requires $scope
 * @requires registrationService
 * @description Controller for supplier view all purchased data.
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
    registrationService.getPurchase(function(result) {
        $scope.detailOfPurchaseTable = result;
    }, function() {
        $scope.message = "Error";
    });
    /*Pagination*/
    /*$scope.curPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages = function() {
        return Math.ceil($scope.datalists.length / $scope.pageSize);
    };*/
    /*Reflecting the status of Supplier table at backend */
    $scope.status = [{
        "id": "1",
        "name": "submit"
    }, {
        "id": "2",
        "name": "complete"
    }, {
        "id": "3",
        "name": "dispatch"
    }, {
        "id": "4",
        "name": "hold"
    }];
    $scope.getStatus = '';
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:submitStatus
     * @param{item} item
     * @param{id} id
     * @description post status  of a purchase order to server.
     */
    $scope.submitStatus = function(item, id) {
            console.log(item);
            console.log(id);
            /* var status={
                 "status":item.name,
                 "id":id
             }
             registrationService.statusUpdate(status, function(data){
             $scope.message="status updated";
             },
              function(data){
               $scope.message=" ERROR";
             });*/
        }
        /**
         * @ngdoc method
         * @name rogersWeb.controllers:submitStatus
         * @param{item} item
         * @param{id} id
         * @description post status  of a purchase order to server.
         */
    $scope.submit = function(email) {
        registrationService.getPurchaseDetail(email, function() {
            $scope.detailOfPurchaseTable = result;
        }, function() {
            $scope.message = "Error";
        });
    }
});