'use strict';
/**
 * subscriptionEventHandler - This class should handle event like keyevent  and mouse over etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 * @author deepak.shah
 */
function subscriptionEventHandler($scope, $location, $routeParams, $dialog, rbiCommonService) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.subscriptionMouseOverEvent = subscriptionMouseOverEvent;
    this.subscriptionClickEvent = subscriptionClickEvent;
    this.handleMouseWheel = handleMouseWheel;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
    this.showSubscriptionBillingAgg = showSubscriptionBillingAgg;
	this.subscriptionEnterKeyEvent = subscriptionEnterKeyEvent;
	this.handleCheckbox = handleCheckbox;
    // Properties for Pop-up
    $scope.startpos = 0;
    $scope.offset = 150;
    $scope.scrollDown = 500;
    var POP_UP_HEIGHT = 12000;
    
    var changeCardTop = 0;
    var changeCardOffset = 50;

    var currentFocusEl = $('#accountText');
    var elementId = ['#accountText', '#checkboxId', '#confirmId'];
    var focusIndex = 0;
    var prevFocusEl = null;
    var nextFocusEl;
    var prevFocusIndex;
    /**
     * This function handled all key event
     * @param event
     * @return
     */
    function handleKeyDownEvent(event) {
    	$scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
    	 /**
         * this if condition for error pop up message
         */
    	if (POP_ALERT_BOX_VISIBLE) {
            switch (event.keyCode) {
            case KEY_CODES.X:
                    PopupBox.HandleKeyPress();
                    break;
            }
            return false;
        }

        switch (event.keyCode) {
        
        /**
         * Handling Down key events
         */
        case KEY_CODES.DPAD_DOWN:

            if ($scope.startpos < POP_UP_HEIGHT && $scope.isSubscriptionBillingOpen) {
                $scope.startpos = $scope.startpos + $scope.offset;
                $("#redbox-content-text").stop().animate({
                    scrollTop: $scope.startpos
                }, $scope.scrollDown);
            } else if ($scope.billingCardVisble) {
                $("#" + $scope.subscriptionCurrentChangeCardDropdown).removeClass("popupdropdown");
                try {
                    var $changeCardUL = $('#subscriptiont_changecard_ul li');
                    if ($scope.subscriptionChangeCardCurrentIndex <= ($changeCardUL.length - 1)) {
                        $scope.subscriptionChangeCardCurrentIndex++;
                        changeCardScrollDown();
                    }
                } catch (object) {}
                $scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
                $("#" + $scope.subscriptionCurrentChangeCardDropdown).addClass("popupdropdown");
            } else if (focusIndex == 0) {
                focusIndex++;
                nextFocusEl = $(elementId[focusIndex]);
                currentFocusEl.blur();
                currentFocusEl.removeClass("textbox-highlight");
                nextFocusEl.focus();
                if((nextFocusEl.hasClass('tickmark'))|| (nextFocusEl.hasClass('highlight-selected'))){
                    nextFocusEl.addClass("highlight-selected");
                }else{
                    nextFocusEl.addClass("check-box-highlight");
                }
                currentFocusEl = nextFocusEl;
            }
            break;
            
            /**
             * Handling Up key events
             */
        case KEY_CODES.DPAD_UP:
        	
            if (focusIndex== 0 && $scope.backflag!=true && $scope.isSubscriptionBillingOpen==false)
        	{
                removeBottomButtonFocus();
                nextFocusEl = $(elementId[focusIndex]);
        		nextFocusEl.focus();
        		nextFocusEl.addClass("textbox-highlight");
     
        	}
            if ($scope.startpos >= $scope.offset && $scope.isSubscriptionBillingOpen) {
                $scope.startpos = $scope.startpos - $scope.offset;
                $("#redbox-content-text").stop().animate({
                    scrollTop: $scope.startpos
                }, $scope.scrollDown);
            } else if ($scope.billingCardVisble) {
                removeBottomButtonFocus();
                $("#" + $scope.subscriptionCurrentChangeCardDropdown).removeClass("popupdropdown");
                try {
                    var $changeCardUL = $('#subscriptiont_changecard_ul li');
                    if ($scope.subscriptionChangeCardCurrentIndex <= $changeCardUL.length && $scope.subscriptionChangeCardCurrentIndex != 0) {
                    	if( $scope.canAddCards || $scope.subscriptionChangeCardCurrentIndex != 1){
                    	$scope.subscriptionChangeCardCurrentIndex--;
                        changeCardScrollUp();
                    	}
                    }
                } catch (object) {}
                $scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
                $("#" + $scope.subscriptionCurrentChangeCardDropdown).addClass("popupdropdown");
            } else if (focusIndex > 0 && $scope.isSubscriptionBillingOpen==false) {
                removeBottomButtonFocus();
                currentFocusEl.blur();
                currentFocusEl.removeClass("button-divHighlight");
                focusIndex--;
                nextFocusEl = $(elementId[focusIndex]);
                if (focusIndex == 0)
                    nextFocusEl.addClass("textbox-highlight");

                if(($("#checkboxId").hasClass('tickmark')) || ($("#checkboxId").hasClass('highlight-selected'))){
                	$("#checkboxId").removeClass("highlight-selected");
                	$("#checkboxId").removeClass("check-box-highlight");
                }else{
                	$("#checkboxId").removeClass("check-box-highlight");
                }
                if (focusIndex == 1)
                nextFocusEl.focus();

                currentFocusEl = nextFocusEl;
            }

            helper.debugLog("Up key: focusIndex on exit = " + focusIndex);
            break;
            
            /**
             * Handling Right key events
             */
        case KEY_CODES.DPAD_RIGHT:
            if($scope.isSubscriptionBillingOpen==false)
            {

                if((nextFocusEl.hasClass('tickmark'))){
                    nextFocusEl.removeClass("highlight-selected");
                    nextFocusEl.removeClass("check-box-highlight");
                }else{
                    nextFocusEl.removeClass("check-box-highlight");
                }
                nextFocusEl = $('#confirmId');
                if (focusIndex == 1) {
                    currentFocusEl.blur();
                    focusIndex++;
                }
                nextFocusEl = $(elementId[focusIndex]);
                nextFocusEl.focus();
                nextFocusEl.addClass("button-divHighlight");
                currentFocusEl = nextFocusEl;

            }
            break;
            
            /**
             * Handling left key events
             */
        case KEY_CODES.DPAD_LEFT:

            if (focusIndex == 2  && $scope.isSubscriptionBillingOpen==false) {
                currentFocusEl.removeClass("button-divHighlight");
                focusIndex--;
                nextFocusEl = $(elementId[focusIndex]);
                nextFocusEl.focus();
                currentFocusEl = nextFocusEl;
                if((nextFocusEl.hasClass('tickmark'))){
                    nextFocusEl.addClass("highlight-selected");
                }else{
                    nextFocusEl.addClass("check-box-highlight");
                }
            }
            break;
            
            /**
             * Handling Back key events
             */
        case KEY_CODES.CIRCLE:
        	if ($scope.isSubscriptionBillingOpen) {
        		$scope.isSubscriptionBillingOpen = false;
        		helper.SetFocus(currentFormFieldId);
        		return;
        	} else if ($scope.billingCardVisble) {
        	    $scope.billingCardVisble = false;
        	    resetPopupDropdown();
        	} else {
        	    goToPreviousPathSign($location, true, rbiCommonService);
        	    // Need not be tracked
        	    /// $scope.omnitureCollectOnClick();
        	}

            break;
            
            /**
             * Handling Enter key events
             */
        case KEY_CODES.X:

            if ($scope.isSubscriptionBillingOpen) {
                $scope.isSubscriptionBillingOpen = false;
                $scope.startpos = 0;
				return;
            } else {
                if ($scope.billingCardVisble) {
                	$scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
                    $scope.addNewCard = false;
                    if($scope.canAddCards && $scope.subscriptionChangeCardCurrentIndex == 0){
                        $scope.addNewCard = true;
                    }
                    $scope.billingCardVisble = false;
                    //resetPopupDropdown();
                   $("#" + $scope.subscriptionCurrentChangeCardDropdown).click();
                    resetPopupDropdown();
                } else if (focusIndex == 0) {
                	if( $scope.canAddCards){
                    $("#subscriptiont_changecard_0").addClass("popupdropdown");
                	}
                	else{
                		 $("#subscriptiont_changecard_1").addClass("popupdropdown");
                		 $scope.subscriptionChangeCardCurrentIndex=1;
                	}
                }
                
                if(focusIndex == 1 && !$scope.isSubscriptionBillingOpen){
                	handleCheckbox();
                }else
                currentFocusEl.click();
            }
            if (!$scope.billingCardVisble) {

                nextFocusEl = $(elementId[focusIndex]);
                nextFocusEl.focus();
                //nextFocusEl.toggleClass("checked highlight highlight-selected");
            }
            break;
            
            /**
             * Handling Triangle key events
             */
           case KEY_CODES.TRIANGLE:
           	showSubscriptionBillingAgg();
           	break;
        }
    }

    /**
     * scroll down for key and mouse 
     * @return
     */
    function changeCardScrollDown() {
        changeCardTop = changeCardTop - changeCardOffset;
        $("#subscriptiont_changecard_list").css('top', changeCardTop);
    }

    /**
     * scroll Up for key and mouse 
     * @return
     */
    function changeCardScrollUp() {
        changeCardTop = changeCardTop + changeCardOffset;
        $("#subscriptiont_changecard_list").css('top', changeCardTop);
    }

    /**
     * In this function  we set all property of drop down 
     * @return
     */
    function resetPopupDropdown() {
        changeCardTop = 0;
        changeCardOffset = 50;
        $("#" + $scope.subscriptionCurrentChangeCardDropdown).removeClass("popupdropdown");
        $scope.subscriptionChangeCardCurrentIndex = 0;
        $scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
        $("#subscriptiont_changecard_list").css('top', changeCardTop);

    }

    /**
     * Magic Remote Implementation  mouse over functionality
     * @param currentID
     * @return
     */
    function subscriptionMouseOverEvent(currentID) {
        removeBottomButtonFocus();
        currentFocusEl.blur();
        nextFocusEl.removeClass("textbox-highlight");
        currentFocusEl.removeClass("button-divHighlight");
        currentFocusEl.removeClass("highlight");
        currentFocusEl.removeClass("highlight-selected");
        currentFocusEl.removeClass("check-box-highlight");
        nextFocusEl = $(elementId[currentID]);
        nextFocusEl.focus();
        
		if (currentID == 2) {
            nextFocusEl.addClass("button-divHighlight");
        }
		if (currentID == 1) {
			toggleTickmark();
        }
        if (currentID == 0) {
            nextFocusEl.addClass("textbox-highlight");
        }
        else{
            $scope.billingCardVisble = false;
            resetPopupDropdown();
        }
        currentFocusEl = nextFocusEl;
        focusIndex = currentID;
        if (currentID == "vzpp" || currentID == 'acceptBtnR') {
            helper.SetFocus(currentID);
            focusIndex = 2;
        }
    }
	function subscriptionClickEvent(currentID){
        /*added for PS VITA TOUCH - ZOE-32904*/
        nextFocusEl = $(elementId[currentID]);
        if (currentID == 1) {
            if((nextFocusEl.hasClass('tickmark'))|| (nextFocusEl.hasClass('highlight-selected'))){
                nextFocusEl.removeClass("highlight-selected");
                nextFocusEl.removeClass("tickmark");
                nextFocusEl.addClass("check-box-highlight");
            }else{
                nextFocusEl.removeClass("check-box-highlight");
                nextFocusEl.addClass("highlight-selected");
                nextFocusEl.addClass("tickmark");
            }
        }
    }
	function subscriptionEnterKeyEvent(currentID) {
		if ($scope.isSubscriptionBillingOpen) {
                $scope.isSubscriptionBillingOpen = false;
                $scope.startpos = 0;
            } 
    }

    /**
     * This function for mouse wheel Implementation 
     * @param e
     * @return
     */
    function handleMouseWheel(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta == 1) {
            HandleKeyUp();
        } else {
            HandleKeyDown();
        }
        $scope.$apply();
    }

    /**
     * This function for mouse wheel Down Implementation 
     * @return
     */
    function HandleKeyDown() {
        if ($scope.billingCardVisble) {
            $("#" + $scope.subscriptionCurrentChangeCardDropdown).removeClass("popupdropdown");
            try {
                var $changeCardUL = $('#subscriptiont_changecard_ul li');

                if ($scope.subscriptionChangeCardCurrentIndex <= ($changeCardUL.length - 1)) {
                    $scope.subscriptionChangeCardCurrentIndex++;
                    changeCardScrollDown();
                }
            } catch (object) {}
            $scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
            $("#" + $scope.subscriptionCurrentChangeCardDropdown).addClass("popupdropdown");
        }
    }

    /**
     * This function for mouse wheel up Implementation 
     * @return
     */
    function HandleKeyUp() {
        if ($scope.billingCardVisble) {
            $("#" + $scope.subscriptionCurrentChangeCardDropdown).removeClass("popupdropdown");
            try {
                var $changeCardUL = $('#subscriptiont_changecard_ul li');

                if ($scope.subscriptionChangeCardCurrentIndex <= $changeCardUL.length && $scope.subscriptionChangeCardCurrentIndex != 0) {
                	if( $scope.canAddCards || $scope.subscriptionChangeCardCurrentIndex != 1){
                	$scope.subscriptionChangeCardCurrentIndex--;
                    changeCardScrollUp();
                	}
                }
            } catch (object) {}
            $scope.subscriptionCurrentChangeCardDropdown = "subscriptiont_changecard_" + $scope.subscriptionChangeCardCurrentIndex;
            $("#" + $scope.subscriptionCurrentChangeCardDropdown).addClass("popupdropdown");
        }
    }
    

    /**
     * this function remove all focus of bottom button 
     * @return
     */
    function removeBottomButtonFocus() {
        helper.RemoveFocus('back-button-wrapper');
        helper.RemoveFocus("vzpp");
        helper.RemoveFocus("btm2");
        helper.RemoveFocus("acceptBtnR");
        helper.RemoveFocus("acceptBtnV");
        nextFocusEl = $(elementId[focusIndex]);
        nextFocusEl.blur();
        nextFocusEl.removeClass("button-divHighlight");
        if (focusIndex !=0)
        nextFocusEl.removeClass("textbox-highlight");
        nextFocusEl.removeClass("check-box-highlight");
        if ($scope.backflag)
            focusIndex = 2;
        $scope.backflag=false;
       }

       //show subscription billing aggr
       function showSubscriptionBillingAgg() {
       	// Toggle Subscription Billing Agreement pop-Up 
       	$scope.isSubscriptionBillingOpen = $scope.isSubscriptionBillingOpen ? false : true;
       	$scope.startpos = 0;
		}
       
       // ng-click handling for checkbox
       function handleCheckbox(){
       	$scope.subscriptionBillingAgreement = !$scope.subscriptionBillingAgreement;
       	toggleTickmark();
       }
       
       //Toggles tickmark on checkbox
       function toggleTickmark(){
    		if($scope.subscriptionBillingAgreement)
           		$("#checkboxId").addClass("tickmark highlight-selected");
           	else
           		$("#checkboxId").removeClass("tickmark highlight-selected").addClass("check-box-highlight");
       }
}