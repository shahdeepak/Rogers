'use strict';
/**
 * cardPreferencesEventHandler - This class should handle event like key event etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */
function cardPreferencesEventHandler($scope, $location ,$routeParams ,rbiCommonService) {

    this.handleKeyDownEvent = handleKeyDownEvent;
    this.addCardMouseOver = addCardMouseOver; //Magic Remote Implementation  mouse over functionality
    this.removeBottomButtonFocus = removeBottomButtonFocus;
	this.handleBackButton = handleBackButton;

    function handleKeyDownEvent(event) {
        var LEVEL_LIST = 1;
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        var levelMap = $scope.levelMap;
        $scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;

        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;

        switch (event.keyCode) {

            case KEY_CODES.DPAD_UP:
            {
                if ($scope.currentIndex > 0) {
                    if (($scope.currentIndex == 2 && $scope.isSubscriptionCard) || ($scope.currentIndex == 2 && $scope.noSubscription == true)) {
                        $scope.currentIndex = 0;
                    } else {
                        if ($scope.currentIndex != 1 && $scope.isAlreadyPreferred) {
                            $scope.currentIndex = $scope.currentIndex - 1;
                        }
                        else if (!$scope.isAlreadyPreferred && !$scope.isSubscriptionCard) {
                            $scope.currentIndex = $scope.currentIndex - 1;
                        }
                    }
                }
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
                break;
            }
            case KEY_CODES.DPAD_DOWN:
            {

                if ($scope.currentIndex >= 0 && $scope.currentIndex != undefined) {


                    $scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;

                    if ($scope.currentIndex < 2) {
                        if (($scope.currentIndex == 0 && $scope.isSubscriptionCard) || ($scope.currentIndex == 0 && $scope.noSubscription == true) || $scope.isAlreadyPreferred) {
                            $scope.currentIndex = 2;
                        }
                        else {
                            $scope.currentIndex = $scope.currentIndex + 1;
                        }
                    }
                    levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;

                }

                break;
            }

            case KEY_CODES.X:
            {
                if ($scope.currentIndex !=2) {
					$("#" + $scope.currentIndex).click();
                } else if ($scope.currentIndex == 2) {
                    disableHttpSpinner = true;
                    helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
                    $("#modify-continue").click();
                    rbiCommonService.removeSharedItem(NO_SUBSCRIPTION);
                    rbiCommonService.removeSharedItem(IS_SUBSCRIPTION);
                    rbiCommonService.removeSharedItem(IS_ALREADY_PREFERRED);
                }
                break;
            }
            case KEY_CODES.SQUARE:
            {

                break;
            }
            case KEY_CODES.CIRCLE:
            {
                handleBackButton();
                rbiCommonService.setSharedItem(NO_SUBSCRIPTION,$scope.noSubscription);
                rbiCommonService.setSharedItem(IS_SUBSCRIPTION, $scope.isSubscriptionCard);
                rbiCommonService.setSharedItem(IS_ALREADY_PREFERRED, $scope.isAlreadyPreferred);
				break;
            }
                

        }
    }
}
function handleBackButton(){
    if ($scope.isAdd) {
        $location.path('/account/creditCards/billingInfo/add');
    } else {
        $location.path('/account/creditCards/billingInfo/modify/' + $scope.accountNumber);
    }
}
/**
 * Magic Remote Implementation  mouse over functionality
 * @param CurrentIndex
 * @param level
 * @return
 */
function addCardMouseOver(level) {
	$("#" + $scope.currentIndex).blur();
	$scope.currentIndex = level;
	$("#" + $scope.currentIndex).focus();
	
}

/**
 *  Remove Button focus
 */
function removeBottomButtonFocus() {
	helper.RemoveFocus('specific-back');
		
}