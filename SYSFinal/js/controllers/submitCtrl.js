/*Created by Kumar Ankur on 14-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:submitCtrl
 * @requires $scope
 * @description Controller for submit hobby screen.
 */
rogers.controller('submitCtrl', function($scope, $location, submitService, $http) {
    var regUser;
    /**
     * @ngdoc method
     * @name rogers.controllers:submitCtrl#submitAdd
     * @methodOf rogers.controllers:submitCtrl
     * @param {object} newUser  - newUser
     * @description Save details of the user in the database as description for a new Ad.
     */
    $scope.submitAdd = function(newUser) {
        regUser = newUser;
        submitService.getLoginDetails(newUser.email, function(result) {
            if (result) {
                sessionStorage.setItem('loggedInUser', newUser.email);
                submitService.saveAddDetails(newUser, success, error);
            } else {
                $scope.message = 'User does not exist!!!Please sign up';
            }
        }, function(result) {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:submitCtrl#success
     * @methodOf rogers.controllers:submitCtrl
     * @description callback function:Success
     */
    function success(data) {
        sessionStorage.setItem('loggedInUser', regUser.email);
        $location.path('/home');
        return;
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:submitCtrl#error
     * @methodOf rogers.controllers:submitCtrl
     * @description callback function:Error
     */
    function error() {}
    //Function to put category JSON into categories variable.
    $http.get('json/category.json').success(function(data) {
        $scope.categories = data;
    });
});