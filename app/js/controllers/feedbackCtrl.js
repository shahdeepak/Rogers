/**
 * @ngdoc  object
 * @name rogersWeb.controller:feedbackCtrl
 * @requires $scope
 * @requires $location
 * @requires randomString
 * @description Controller.
 */
rogersWeb.controller('feedbackCtrl', function($scope, encryption) {
    "use strict";
    $scope.message = "If you request assistance and would like a response from us , please include your name and email address.";
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:feedbackCtrl#customerFeedback
     * @methodOf rogersWeb.controllers:feedbackCtrl
     * @param {object} feedbackDetails  - feedbackDetails
     * @description Save customer feedback to database.
     */
    $scope.customerFeedback = function(feedbackDetails) {
        /*var encrypt = encryption.toEncodeString("testuserdata");
        console.log(result);
        var decrypt = encryption.fromEncodedString(result);
        console.log(decrypt);*/
        var data = {
            'name': feedbackDetails.name,
            'email': feedbackDetails.email,
            'feedback': feedbackDetails.feedback
        };
        registrationService.saveRegistrationDetails(data, success, error);
    };

    function success() {
        $scope.message = "Thank you for taking time to send us your feedback regarding our service!";
    };

    function error() {
        $scope.message = "error";
    };
    $scope.list = [{
        "Description": "Hello Tab1",
        "header": "Tab1"
    }, {
        "Description": "Hello Tab2",
        "header": "Tab2"
    }, {
        "Description": "Hello Tab3",
        "header": "Tab3"
    }, {
        "Description": "Hello Tab4",
        "header": "Tab4"
    }, {
        "Description": "Hello Tab5",
        "header": "Tab5"
    }];
});