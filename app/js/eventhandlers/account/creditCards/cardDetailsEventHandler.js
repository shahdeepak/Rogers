'use strict';
/**
 * cardDetailsEventHandler - This class should handle event like key event etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */
function cardDetailsEventHandler($scope, $location, rbiCommonService) {

    this.handleKeyDownEvent = handleKeyDownEvent;
	this.handleBackButton = handleBackButton;
    this.addCardMouseOver = addCardMouseOver; // Magic Remote Implementation  mouse over functionality
    this.showCVVPopup = showCVVPopup;
    this.passwordSubmitClick = passwordSubmitClick;
    this.pwPopupHandleBackKey = pwPopupHandleBackKey;
    this.pwPopupMouseOver = pwPopupHelper.handleMouseOver;

    // Element IDs
    var NAME = 0;
    var CARD_NICKNAME = 1;
    var CARD_NUMBER = 2;
    var CVV = 3;
    var CVV_HELP = 4;
    var EXP_MONTH = 5;
    var EXP_YEAR = 6;
    var NEXT_BUTTON = 7;


    // Back key and submit key handlers for password popup
    function pwPopupHandleBackKey() {
        pwPopupHelper.handleBackKey($scope);
        if (backPathsSign.length > 0) {
            goToPreviousPathSign($location, false, rbiCommonService);
        } else {
            handleBackButton();
        }
        $scope.passwordPopUpVisible = false;
   }


    function passwordSubmitClick() {
        $scope.verifyPassword();
    }

    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        var firstElement = ($scope.creditcard.canModifyName)? NAME:CARD_NICKNAME;

        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if ($scope.uiPWPopup) {
            return pwPopupHelper.handleKeyEvent(event, passwordSubmitClick, pwPopupHandleBackKey, $scope);
        }

        switch (event.keyCode) {

            case KEY_CODES.DPAD_LEFT:
            case KEY_CODES.DPAD_UP:

				if($scope.focusIndex <= NEXT_BUTTON && $scope.focusIndex > firstElement) {
                    blurCurrentElement($scope.focusIndex);
                    $scope.focusIndex--;
                    if ($scope.isModify && $scope.focusIndex == CARD_NUMBER) $scope.focusIndex--; // advance over CC number field
                    focusCurrentElement($scope.focusIndex);
                }
			    break;

            case KEY_CODES.DPAD_RIGHT:
            case KEY_CODES.DPAD_DOWN:
				if($scope.focusIndex >= firstElement && $scope.focusIndex < NEXT_BUTTON) {
                    blurCurrentElement($scope.focusIndex);
                    $scope.focusIndex++;
                    if ($scope.isModify && $scope.focusIndex == CARD_NUMBER) $scope.focusIndex++; // advance over CC number field
                    focusCurrentElement($scope.focusIndex);
                }
			    break;

           case KEY_CODES.X:
           		if ($scope.focusIndex == CVV_HELP) {
           			showCVVPopup();
           		}
           		if ($scope.focusIndex == NEXT_BUTTON) {
           			$scope.SaveCard();
           		}
           		break;

            case KEY_CODES.CIRCLE:
                handleBackButton();
                break;
        }

    }

    function handleBackButton() {
        rbiCommonService.removeSharedItem(NO_SUBSCRIPTION);
        rbiCommonService.removeSharedItem(IS_SUBSCRIPTION);
        rbiCommonService.removeSharedItem(IS_ALREADY_PREFERRED);

        if (isDefined(helper.getTitleDetailState($scope))) {
            var checkout_Type = localStorage.getItem("checkouttype");
            localStorage.removeItem("checkouttype");
            if(checkout_Type=='titleCheckout')
                $location.path("/titleCheckout");
            else
                $location.path("/kioskCheckout");
        }
        else if (backPathsSign.length > 0)     {
            goToPreviousPathSign($location, false, rbiCommonService);
        }
        else {
            $scope.isAdd = false;
            $scope.isModify = false;
            $location.search('cardAction', null);
            $location.path('/account/creditCards');
            $("#main-menu-return").show();
        }
    }


	function focusCurrentElement(elementId) {
        $("#1_" + elementId).focus();
    }

    /**
     * Magic Remote Implementation  mouse over functionality
     * @param elementId - DOM element that is currently in focus
     */
    function addCardMouseOver(elementId) {
		blurCurrentElement($scope.focusIndex);
		$scope.focusIndex = elementId;
		focusCurrentElement($scope.focusIndex);
    }

	function showCVVPopup() {
			PopupBox.Show("Popup_CVV_HELP", $scope);
	}

	function blurCurrentElement(elementId) {
        $("#1_" + elementId).blur();
    }
}