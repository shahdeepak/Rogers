'use strict';
/**
 * freeTrialEventHandler - This class should handle event like key Event  and mouse over etc.
 * There should not be any business logic present in it. business logic call should be in
 * service and called from controller using $scope.
 * @author deepak.shah
 */
function freeTrialEventHandler($scope, $location, $routeParams, $dialog, rbiCommonService, customerService) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.accountMouseOverEvent = accountMouseOverEvent;
    this.blurCurrentElement = blurCurrentElement;
    this.accountEnterKeyEvent = accountEnterKeyEvent;
    this.handleBackButtonFreeTrial = handleBackButton;

    function handleKeyDownEvent(event) {

        var elementId = ($scope.createAccountControl[$scope.focusIndex]);
        blurCurrentElement(elementId);
        helper.debugLog("TIM: IS POPUP VISIBLE~ " + POP_ALERT_BOX_VISIBLE);
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }
        switch (event.keyCode) {

            /**
             * Handling Up key events
             */
        case KEY_CODES.DPAD_UP:

            if ($scope.focusIndex != 0) {
                --$scope.focusIndex;
            }
            break;
            /**
             * Handling Down key events
             */
        case KEY_CODES.DPAD_DOWN:
            if ($scope.focusIndex < 1) {
                ++$scope.focusIndex;
            }
            break;
            /**
             * Handling Enter key events
             */
        case KEY_CODES.X:
            accountEnterKeyEvent();
            break;

            /**
             * Handling Back key events
             */
        case KEY_CODES.CIRCLE:
            handleBackButton();
            break;

        }
    }

    function accountMouseOverEvent(Level_button) {
        blurCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
        $scope.focusIndex = Level_button;
    }
    /**
     * remove focus management  Implementation
     * remove focus to current element id
     * @param elementId
     * @return
     */
    function blurCurrentElement(elementId) {
        $("#" + elementId).blur();
    }
    /**
     * Magic Remote Implementation  mouse over functionality and click event
     * @return
     */
    function accountEnterKeyEvent() {
        var elementId = ($scope.createAccountControl[$scope.focusIndex]);
        $("#" + elementId).click();
    }

    function handleBackButton() {
        $scope.trackOmniture = "back";
        $scope.omnitureReady = [true];
        // When the user comes from Kiosk Checkout and tries to add a title which has subscription
        // on back the user should be able to go back to that title instead of home...
        // ZOE-36184
        if (!new RBI.Cart().isEmpty())
            $location.path(backPaths[backPaths.length - 1]);
        else
            goToPreviousPathSign($location, true, rbiCommonService);
    }
}