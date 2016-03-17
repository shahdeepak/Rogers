/**
Sign Up Controller
 */
'use strict';
rbi.controller('signupCtrl', function ($scope, $location) {

    var eventHandler = new signupEventHandler($scope, $location);
    $scope.eventHandler = eventHandler;
    $scope.PlayStationType = config.PlayStationType;
   // $('#main-menu-return').hide();
    $scope.mainMenuReturn = {display:false};
    hideMainMenu();
    addToBackPaths($location.path());
    $("#menu-button-wrapper").css("display","none");
    $("#back-button-wrapper").html("<span class='icons cancel-small-noshadow' style='margin-right:-7px'></span>OK");

    $scope.redirectUserToLoginPage = function () {
        //window.location.href= window.location.pathname + "#/login";
        $location.path("/login");
    }
});
