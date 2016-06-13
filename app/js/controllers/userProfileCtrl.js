/**
 * @ngdoc  object
 * @name rogersWeb.controller:userProfileCtrl
 * @requires $scope
 * @requires userProfileService
 * @description Controller for userProfile screen.
 */
rogersWeb.controller('userProfileCtrl', function($scope, userProfileService, registrationService) {
    "use strict";
    $scope.userDetails = {};
    $scope.productItem = [];
    $scope.imgIcon = true;
    $scope.imagesrc = "./images/plus.png";
    // Get email ID from session
    /**
     * @description Get email ID from session
     */
    var email = sessionStorage.getItem('loggedInUser');
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:userProfileCtrl#login
     * @methodOf rogersWeb.controllers:userProfileCtrl
     * @description Bringing logged in user data from server by taking user valid email address.
     */
    $scope.curPage = 0;
    $scope.pageSize = 5;
    userProfileService.getProfileWithParamDetails(email, success, failure);
    function success(user) {
        user.data.email = email;
        $scope.userDetails = user.data;
    };
    function failure() {
        $scope.message = "Error";
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:userProfileCtrl#productHistory
     * @methodOf rogersWeb.controllers:userProfileCtrl
     * @description Bringing product history data from server by taking user valid email address.
     */
    registrationService.getHistory(email, successHistory, failureHistory);
    function successHistory(result) {
        $scope.productItem = result;
    };
    function failureHistory() {
        $scope.message = "Error";
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:userProfileCtrl#updateProfile
     * @methodOf rogersWeb.controllers:userProfileCtrl
     * @description update user profile
     */
    $scope.updateProfile = function(userProfileDetails) {
        var userProfile_Details = {
            "email": userProfileDetails.email,
            "password": userProfileDetails.password,
            "dateOfBirth": userProfileDetails.dateOfBirth,
            "contact": userProfileDetails.contact
        };
        userProfileService.updateProfileDetails(email, userProfile_Details,
            function() {
                $scope.message = 'Your profile updated successfully';
            },
            function(error) {
                $scope.errorMessage = "error message" + error;
            });
    };
    /*show imageIcon in icon bar*/
    $scope.showBar = function() {
        $scope.imgIcon = !$scope.imgIcon;
        if ($scope.imgIcon)
            $scope.imagesrc = "./images/plus.png";
        else
            $scope.imagesrc = "./images/minus.png";
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:userProfileCtrl#emit
     * @methodOf rogersWeb.controllers:userProfileCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description send message to other controller communication between controller This function is a sender function
     */
    $scope.$emit("showHide", {
        "pagelink": "home"
    });
    $scope.$emit("quantity");
});
/**
     * @ngdoc method
     * @name rogersWeb.controllers:userProfileCtrl#filter
     * @methodOf rogersWeb.controllers:userProfileCtrl
     * @description using for pagination
     */
rogersWeb.filter('pagination', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});