/**
 * @ngdoc  object
 * @name rogersWeb.controller:productEntryCtrl
 * @requires $scope
 * @description Controller for add product to db.
 */
rogersWeb.controller('productEntryCtrl', function($scope, registrationService) {
    "use strict";
    $scope.status = "create";
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:productEntryCtrl#getProduct
     * @methodOf rogersWeb.controllers:productEntryCtrl
     * @description get product from database.
     */
    function getProductList(){
        registrationService.getProduct(function(data) {
            // console.log(data);
            $scope.productDetails = data;
        }, function(data) {
            $scope.message = "error";
        });
    };
    getProductList();
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:productEntryCtrl#submitProductDetails
     * @methodOf rogersWeb.controllers:productEntryCtrl
     * @description update/add data into database.
     */
    $scope.submitProductDetails = function() {
        if ($scope.status == "update") {
            var updateProductDetails = {
                "id": $scope.id,
                "productName": $scope.pName,
                "productPrice": $scope.pPrice,
                "productType": $scope.pType,
                "imagePath": $scope.pImgPath,
                "productDetails": $scope.pDetails,
                "imgs": [{
                    "url": $scope.fImg1
                }, {
                    "url": $scope.fImg2
                }, {
                    "url": $scope.fImg3
                }, {
                    "url": $scope.fImg4
                }],
                "features": [{
                    "name": $scope.fCamera,
                    "details": $scope.fCameraDetails
                }, {
                    "name": $scope.fInternalMemory,
                    "details": $scope.fIMemoryDetails
                }, {
                    "name": $scope.fPrimeryMemory,
                    "details": $scope.fPMemoryDetails
                }, {
                    "name": $scope.fBattery,
                    "details": $scope.fBatteryDetails
                }]
            };
            registrationService.updateProduct(
                updateProductDetails,
                function(data) {
                    $scope.message = "Successfully data inserted into database";
                    $scope.status = "create";
                    clearField();
                    getProductList();
                },
                function(data) {
                    $scope.message = "Error";
                });
        } else {
            if ($scope.productDetails[$scope.productDetails.length - 1].id === null) {
                $scope.id = 1;
            } else {
                $scope.id = ($scope.productDetails[$scope.productDetails.length - 1].id) + 1;
            }
            var addProductDetails = {
                "id": $scope.id,
                "productName": $scope.pName,
                "productPrice": $scope.pPrice,
                "productType": $scope.pType,
                "imagePath": $scope.pImgPath,
                "productDetails": $scope.pDetails,
                "imgs": [{
                    "url": $scope.fImg1
                }, {
                    "url": $scope.fImg2
                }, {
                    "url": $scope.fImg3
                }, {
                    "url": $scope.fImg4
                }],
                "features": [{
                    "name": $scope.fCamera,
                    "details": $scope.fCameraDetails
                }, {
                    "name": $scope.fInternalMemory,
                    "details": $scope.fIMemoryDetails
                }, {
                    "name": $scope.fPrimeryMemory,
                    "details": $scope.fPMemoryDetails
                }, {
                    "name": $scope.fBattery,
                    "details": $scope.fBatteryDetails
                }]
            };
            registrationService.addProduct(
                addProductDetails,
                function(data) {
                    $scope.message = "Successfully data inserted into database";
                    $scope.status = "create";
                    clearField();
                    getProductList();
                },
                function(data) {
                    $scope.message = "Error";
                });
        }
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:productEntryCtrl#clearField
     * @methodOf rogersWeb.controllers:productEntryCtrl
     * @description clear input fields.
     */
    function clearField() {
        $scope.pName = "";
        $scope.pPrice = "";
        $scope.pType = "";
        $scope.pImgPath = "";
        $scope.pDetails = "";
        $scope.fImg1 = "";
        $scope.fImg2 = "";
        $scope.fImg3 = "";
        $scope.fImg4 = "";
        $scope.fCamera = "";
        $scope.fCameraDetails = "";
        $scope.fInternalMemory = "";
        $scope.fIMemoryDetails = "";
        $scope.fPrimeryMemory = "";
        $scope.fPMemoryDetails = "";
        $scope.fBattery = "";
        $scope.fBatteryDetails = "";
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:productEntryCtrl#editItem
     * @methodOf rogersWeb.controllers:productEntryCtrl
     * @description edit item.
     */
    $scope.editItem = function(data) {
        clearField();
        $scope.status = "update";
        $scope.id = data.id;
        $scope.pName = data.productName;
        $scope.pPrice = data.productPrice;
        $scope.pType = data.productType;
        $scope.pImgPath = data.imagePath;
        $scope.pDetails = data.productDetails;
        $scope.fImg1 = data.imgs[0].url;
        $scope.fImg2 = data.imgs[1].url;
        $scope.fImg3 = data.imgs[2].url;
        $scope.fImg4 = data.imgs[3].url;
        $scope.fCameraDetails = data.features[0].details;
        $scope.fCamera = data.features[0].name;
        $scope.fIMemoryDetails = data.features[1].details;
        $scope.fInternalMemory = data.features[1].name;
        $scope.fPrimeryMemory = data.features[2].details;
        $scope.fPMemoryDetails = data.features[2].name;
        $scope.fBattery = data.features[3].details;
        $scope.fBatteryDetails = data.features[3].name;
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:productEntryCtrl#removeItem
     * @methodOf rogersWeb.controllers:productEntryCtrl
     * @param {obj} id  - id of product details
     * @description remove item from database .
     */
    $scope.removeItem = function(id) {
        var idDetails = {"id": id}
        registrationService.removeProduct(
            idDetails,
            function(data) {
                $scope.message = "Successfully deleted from database";
            },
            function(data) {
                $scope.message = "Error";
            });
    };
});