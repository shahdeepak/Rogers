'use strict';

/**
 * Offline Controller
 * This controller is responsible for showing the
 * offline message to the user and event handling
 */
rbi.controller('offlineCtrl', function ($scope, $location) {

    $scope.handleMenu = function()
    {
        handleMainMenu($scope, event.keyCode, $location);
    };
});