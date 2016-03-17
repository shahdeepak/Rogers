
/***
 * Parental control popup helper functions
 *
 * @author: Peter Rajcani
 * ****/
var pwPopupHelper = {
    showPWPopup: function ($scope, title1, title2) {

        $scope.pwpopupTitle1 = title1;
        $scope.pwpopupTitle2 = title2;
        $scope.uiPWPopup = true;
        $scope.getUser = helper.GetUserId();
        $scope.userPassword = '';
        $scope.pwPopupErrorMsg = true;
        $scope.passwordErrorMsg = '';
        $scope.submitPwPopupPassword = false;
        $scope.focusIndex = 0;
        pwPopupHelper.setInitialFocus();
    },

    hidePWPopup: function ($scope) {
        $scope.uiPWPopup = false;
        $scope.pwPopupErrorMsg = false;
        $scope.passwordErrorMsg = "";
        $('#back-btn').removeClass("bk-btn-highlight");
    },

    showPWError: function ($scope) {
        $scope.passwordErrorMsg = "The password is not correct, please try again";
        $scope.pwPopupErrorMsg = true;
        pwPopupHelper.setTextFieldFocus($scope);

        $scope.submitPwPopupPassword = false;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    },

    setInitialFocus: function () {
        $('#password').focus();
    },

    setTextFieldFocus: function ($scope) {
        $scope.focusIndex = 0;
        helper.debugLog('Calling setTextFieldFocus, focusIndex:' + $scope.focusIndex);
        $('#back-btn').removeClass("bk-btn-highlight");
        $('#password').focus();
    },

    setContinueButtonFocus: function ($scope) {
        $scope.focusIndex = 1;
        helper.debugLog('Calling setContinueButtonFocus, focusIndex:' + $scope.focusIndex);
        $('#password').blur();
    },

    setBackButtonFocus: function ($scope) {
        helper.debugLog('Calling setBackButtonFocus');
        $('#password').blur();
        $('#back-btn').addClass("bk-btn-highlight");
        $scope.focusIndex = 2;
    },

    handleMouseOver: function (elementID) {
        helper.debugLog('pwpopup.handleMouseOver, elementID: ' + elementID);
        var scope = angular.element(elementID).scope();
        if (elementID == 'password') {
            pwPopupHelper.setTextFieldFocus(scope);
        } else if (elementID == 'continue_1') {
            pwPopupHelper.setContinueButtonFocus(scope);
        } else {
            pwPopupHelper.setBackButtonFocus(scope);
        }
    },

    handleBackKey: function ($scope) {
        pwPopupHelper.hidePWPopup($scope);
    },

    handleUpKey: function($scope) {
        pwPopupHelper.setTextFieldFocus($scope);
    },

    handleDownKey: function ($scope) {
        helper.debugLog("Pw Popup - handle down key");
        pwPopupHelper.setContinueButtonFocus($scope);
    },


    handleKeyEvent : function (event, pwPopupSubmit, pwPopupHandleBackKey, $scope) {
        switch (event.keyCode) {
            case KEY_CODES.X:
                if ($scope.submitPwPopupPassword) {
                    pwPopupSubmit();
                }
                else {
                    pwPopupHelper.setTextFieldFocus($scope);
                }
                break;

            case KEY_CODES.DPAD_UP:
                $scope.submitPwPopupPassword = false;
                pwPopupHelper.setTextFieldFocus($scope);
                break;

            case KEY_CODES.DPAD_DOWN:
                $scope.submitPwPopupPassword = true;
                pwPopupHelper.setContinueButtonFocus($scope);
                break;

            case KEY_CODES.CIRCLE:
                pwPopupHandleBackKey();
                break;
        }

        return false;
    }
};


