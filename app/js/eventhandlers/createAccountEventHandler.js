'use strict';
/**
 * createAccountEventHandler - This class should handle event like keyevent etc.
 * There should not be any business logic present in it. Bussinesss logic call should be in
 * service and called from controller using $scope.
 * @author mohit.kumar.dubey
 */
function createAccountEventHandler($scope, $location, $routeParams, $dialog, loginService, rbiCommonService) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.createAccountMouseOverEvent = createAccountMouseOverEvent;
    this.redboxPolicyOpen = redboxPolicyOpen;
    this.verizonPolicyOpen = verizonPolicyOpen;
    this.accountEnterKeyEvent = accountEnterKeyEvent;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
    this.navigateBack = navigateBack;
    $scope.startpos = 0;
    $scope.offset = 150;
    $scope.scrollDown = 500;
    var POP_UP_HEIGHT = 12000;

    function handleKeyDownEvent(event) {
        var currentScreenIndex = currentScreenControls();
        blurCurrentElement(($scope.createAccountControl[currentScreenIndex])[$scope.focusIndex]);
        if (POP_ALERT_BOX_VISIBLE || $scope.isErrorPopupOpen) {
            switch (event.keyCode) {
            case KEY_CODES.CIRCLE:
            case KEY_CODES.X:
                PopupBox.HandleKeyPress();
                $scope.specificBack = true;
                if ($scope.isErrorPopupOpen) {
                    $scope.isErrorPopupOpen = false;
                }
                event.preventDefault();
                break;
            }
            return false;
        }
        if (currentScreenControls == -1) {
            return;
        }
        switch (event.keyCode) {
        case KEY_CODES.DPAD_UP:
            $scope.backflag = false;
            if ($scope.startpos >= $scope.offset && ($scope.isRedboxPolicyOpen || $scope.isVerizonPolicyOpen)) {
                $scope.startpos = $scope.startpos - $scope.offset;
                var id = $scope.isRedboxPolicyOpen ? "redbox-content-text" : ($scope.isVerizonPolicyOpen ? "verizon-content-text" : undefined);
                $("#" + id).stop().animate({
                    scrollTop: $scope.startpos
                }, $scope.scrollDown);
            } else if ($scope.focusIndex <= 0) {
                $scope.focusIndex = 0;
            } else if ($scope.focusIndex != 5 && ($scope.isRedboxPolicyOpen || $scope.isVerizonPolicyOpen)) {
                break;
            } else {
                if ($scope.focusIndex != 5)
                    $scope.focusIndex--;
            }
            break;

        case KEY_CODES.DPAD_DOWN:
            // Adding separate handlers for each policy to avoid conflict of positioning...
            // Users will now be able to scroll without having to press the UP multiple times to
            // reset the position for scroll - ZOE-32296
            if (($scope.isRedboxPolicyOpen) && ($scope.startpos <= $("#redbox-content-text")[0].scrollHeight - 3 * $scope.offset)) {
                $scope.startpos = $scope.startpos + $scope.offset;
                $("#redbox-content-text").stop().animate({
                    scrollTop: $scope.startpos
                }, 500);
            } else if (($scope.isVerizonPolicyOpen) && ($scope.startpos <= $("#verizon-content-text")[0].scrollHeight - 3 * $scope.offset)) {
                $scope.startpos = $scope.startpos + $scope.offset;
                $("#verizon-content-text").stop().animate({
                    scrollTop: $scope.startpos
                }, 500);
            } else if (($scope.createAccountControl[currentScreenIndex]).length - 1 <= $scope.focusIndex) {
                $scope.focusIndex = ($scope.createAccountControl[currentScreenIndex]).length - 1;
            } else {
                $scope.focusIndex++;
            }
            break;

        case KEY_CODES.X:
            accountEnterKeyEvent();
            break;

        case KEY_CODES.TRIANGLE:
            if ($scope.state == "ACCOUNT_CREATE_2") {
                verizonPolicyOpen();
            }
            break;

        case KEY_CODES.SQUARE:
            if ($scope.state == "ACCOUNT_CREATE_2") {
                redboxPolicyOpen();
            }
            break;

        case KEY_CODES.CIRCLE:
            if ($scope.isRedboxPolicyOpen || $scope.isVerizonPolicyOpen) {
                $scope.isRedboxPolicyOpen = false;
                $scope.isVerizonPolicyOpen = false;
                return;
            }
            navigateBack();
            break;
        }
        focusCurrentElement(($scope.createAccountControl[currentScreenIndex])[$scope.focusIndex]);
    }

    function redboxPolicyOpen() {
        if ($scope.isRedboxPolicyOpen == false && $scope.isVerizonPolicyOpen == false) {
            $scope.isRedboxPolicyOpen = true;
            $scope.startpos = 0; // resetting the start position to 0 since we use the same variable for both the policies..
        }
    }

    function verizonPolicyOpen() {
        if (!$scope.isRedboxPolicyOpen && !$scope.isVerizonPolicyOpen) {
            $scope.isVerizonPolicyOpen = true;
            $scope.startpos = 0; // resetting the start position to 0 since we use the same variable for both the policies..
        }
    }

    function accountEnterKeyEvent() {
        var currentScreenIndex = currentScreenControls();
        if (!$scope.isRedboxPolicyOpen && !$scope.isVerizonPolicyOpen) {
            var elementId = ($scope.createAccountControl[currentScreenIndex])[$scope.focusIndex];
            $("#" + elementId).click();
        } else if ($scope.isRedboxPolicyOpen) {
            $scope.isRedboxPolicyOpen = false;
            $scope.startpos = 0;

        } else if ($scope.isVerizonPolicyOpen) {
            $scope.isVerizonPolicyOpen = false;
            $scope.startpos = 0;


        }
    }

    //To navigate by from different screens
    function navigateBack() {
        switch ($scope.state) {
        case "ACCOUNT_CREATE_1":
            if (RBI.PlatformConfig.deviceType == "LG") { // only for LG to resolved ZOE-32604 - Application crash is observe on back of About You page.
                $scope.navigateToPreviousPage();
            } else {
                goToPreviousPath($scope, KEY_CODES.CIRCLE, $location);
            }
            break;
        case "ACCOUNT_CREATE_2":
            $scope.state = "ACCOUNT_CREATE_1";
            $scope.focusIndex = 4;
            break;
        case "FREE-SUBSCRIPTION-SELECTION":
            goToPreviousPath($scope, KEY_CODES.CIRCLE, $location);
            break;
        default:
            return -1;
        }
    }


    //To move focus on current screen
    function currentScreenControls() {
        switch ($scope.state) {
        case "ACCOUNT_CREATE_1":
            return 0;
            break;
        case "ACCOUNT_CREATE_2":
            return 1;
            break;
        case "FREE-SUBSCRIPTION-SELECTION":
            return 2;
            break;
        default:
            return -1;
            break;
        }
    }
    function createAccountMouseOverEvent(Level_button) {
        var currentScreenIndex = currentScreenControls();
        var elementId = ($scope.createAccountControl[currentScreenIndex])[$scope.focusIndex];
        $("#" + elementId).blur();
        $scope.focusIndex = Level_button;
        var elementId = ($scope.createAccountControl[currentScreenIndex])[$scope.focusIndex];
        $("#" + elementId).focus();
    }
    function removeBottomButtonFocus() {
        var currentScreenIndex = currentScreenControls();
        var elementId = ($scope.createAccountControl[currentScreenIndex])[$scope.focusIndex];
        if ($scope.backflag)
            $scope.focusIndex = 5;
    }
    function focusCurrentElement(elementId) {
        $("#" + elementId).focus();
    }
    function blurCurrentElement(elementId) {
        $("#" + elementId).blur();
    }
}