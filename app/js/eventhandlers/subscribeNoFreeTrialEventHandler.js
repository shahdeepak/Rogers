'use strict';
/**
 * subscribeNoFreeTrialEventHandler - This class should handle event like key Event  and mouse over etc.
 * There should not be any business logic present in it. business logic call should be in
 * service and called from controller using $scope.
 * @author deepak.shah
 */
function subscribeNoFreeTrialEventHandler($scope, $location, rbiCommonService) {
   
	this.handleKeyDownEvent = handleKeyDownEvent; //handled all key event 
	this.subscribeNoFreeTrialMouseOverEvent = subscribeNoFreeTrialMouseOverEvent; // magic remote implementation
	this.subscribeNoFreeTrialMouseClickEvent = subscribeNoFreeTrialMouseClickEvent;
	this.focusCurrentElement = focusCurrentElement;
	this.selectSubscriptionOption = selectSubscriptionOption;
	$("#dvdSubscription").mouseup(selectSubscriptionOption);
	$("#bluraySubscription").mouseup(selectSubscriptionOption);
	$("#streamingOnly").mouseup(selectSubscriptionOption);


    /**
     * This function handled all key event
     * @param event
     * @return
     */
    function handleKeyDownEvent(event) {
        var elementId = ($scope.createAccountControl[$scope.focusIndex]);
        helper.debugLog("Event: " + event.keyCode + ", focusIndex: " + $scope.focusIndex + ", elementId: " + elementId);
        switch (event.keyCode) {

        
            /**
             * Handling left key events
             */
        case KEY_CODES.DPAD_LEFT:
            if ($scope.focusIndex == 2) {
                blurCurrentElement(elementId);
                $scope.focusIndex--;
                focusCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
            }
            break;

            /**
             * Handling Right key events
             */
        case KEY_CODES.DPAD_RIGHT:
            if ($scope.focusIndex == 1) {
                blurCurrentElement(elementId);
                $scope.focusIndex++;
                focusCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
            }
            break;

            /**
             * Handling Up key events
             */
        case KEY_CODES.DPAD_UP:
            if ($scope.focusIndex > 0) {
                blurCurrentElement(elementId);
                $scope.focusIndex--;
                focusCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
            }
            break;

            /**
             * Handling Down key events
             */
        case KEY_CODES.DPAD_DOWN:
            if ($scope.focusIndex == 0) {
                blurCurrentElement(elementId);
                $scope.focusIndex++;
                focusCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
            }
            break;

            /**
             * Handling Enter key events
             */
        case KEY_CODES.X:
            //$("#" + elementId).click();
        	selectSubscriptionOption();
            break;

            /**
             * Handling Back key event
             */
        case KEY_CODES.CIRCLE:
            goToPreviousPathSign($location, true, rbiCommonService);
            break;

        }
        return false;
    }

    /**
     * Magic Remote Implementation  mouse over functionality
     * @param Level_button
     * @return
     */
    function subscribeNoFreeTrialMouseOverEvent(Level_button) {
    	 helper.RemoveFocus('specificback');
        if (Level_button == "specificback") {
            helper.SetFocus(Level_button); //this function set focus of the current id
            blurCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
            //$scope.focusIndex = 2;
        } else {
			blurCurrentElement(($scope.createAccountControl[$scope.focusIndex]));
            focusCurrentElement(($scope.createAccountControl[Level_button]));
            $scope.focusIndex = Level_button;
        }
    }

	
	function subscribeNoFreeTrialMouseClickEvent(Level_button){
		if (Level_button == "specificback") {
			goToPreviousPathSign($location, true, rbiCommonService);
		}
	}
    /**
     * focus management  Implementation
     * set focus to current element id
     * @param elementId
     * @return
     */
    function focusCurrentElement(elementId) {
        $("#" + elementId).focus();
        $("#" + elementId).addClass("radio-highlight");
    }
    /**
     * remove focus management  Implementation
     * remove focus to current element id
     * @param elementId
     * @return
     */
    function blurCurrentElement(elementId) {
        $("#" + elementId).blur();
        $("#" + elementId).removeClass("radio-highlight");
    }

    function selectSubscriptionOption(){
        
   	 var subscriptionType;

        switch ($scope.focusIndex) {
            case 0: {
                subscriptionType = DVD_SUBSCRIPTION;
                break;
            }
            case 1: {
                subscriptionType = BLURAY_SUBSCRIPTION;
                break;
            }
            case 2: {
                subscriptionType =  STREAMING_ONLY;
                break;
            }
        }
        rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, subscriptionType);
        if ($scope.hasCards) {
            // Existing account with a credit card on file - go directly to subscription page
            $location.path("/subscription");
        }else {
            //Existing account with no credit card on file - go to add card page
            $location.path("/account/creditCards/cardDetails/add");
        }
   }
}