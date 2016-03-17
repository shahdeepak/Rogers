function TitleCheckoutEventHandler($scope, $location, $routeParams,rbiCommonService, $timeout) {
    //handle key down event
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.titleCheckoutMouseOver=titleCheckoutMouseOver; // Magic Remote Implementation  mouse over functionality
    this.changecardClickEvent=changecardClickEvent;
    this.titlecheckoutClickEvent=titlecheckoutClickEvent;
    this.handleMouseWheel = handleMouseWheel;  // Magic Remote Implementation  mouse scroll functionality
    var popups = ["#titlecheckout_select_option_popup", "#titlecheckout_change_card_popup"];
    $scope.titleCheckoutControls = ["#titlecheckout_0_0", "#titlecheckout_0_1", "#titlecheckout_0_2"];
    $scope.restrictedPurchaseControls = ["0_221", "0_222", "restrictPurchasePassword"];
    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            rbiCommonService.removeSharedItem(IS_CHECKOUT_CARD);
            POP_ALERT_BOX_VISIBLE = false;
            return false;
        }
        if(MISSING_CARD_POP_UP_VISIBLE && event.keyCode == KEY_CODES.CIRCLE){
			POP_ALERT_BOX_VISIBLE = false;
		}
        if (!$scope.canMoveFocus) {
          return;
        }
        switch (event.keyCode) {
        case KEY_CODES.DPAD_LEFT:
        {

            break;
        }
        case KEY_CODES.DPAD_RIGHT:
        {

            break;
        }
        case KEY_CODES.DPAD_DOWN:
        	{
			//adding to disable up down key handling
        	if ($scope.RedboxGiftCard) break;
            if (!($scope.$root.titleCheckoutChangeCardVisible || $scope.$root.titleCheckoutSelectedOptionVisible)) {
                $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).blur();

                if ($scope.titleCheckoutCurrentControlIndex < $scope.titleCheckoutControls.length - 1) {
                    $scope.titleCheckoutCurrentControlIndex++;
                }
                $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).focus();

            }
            else if ($scope.$root.titleCheckoutSelectedOptionVisible) {
                var $count = $('#titlecheckout_rentbuy_ul li');

                if ($scope.titleCheckoutRentBuyCurrentCount < $count.length - 1) {
                    $scope.titleCheckoutRentBuyCurrentCount++;
                }


            }
            else if ($scope.$root.titleCheckoutChangeCardVisible) {

                var $count = $('#titlecheckout_changecard_ul li');
                if ($scope.titleCheckoutChangeCardCurrentCount < $count.length) {
                    $scope.titleCheckoutChangeCardCurrentCount++;
                    changeCardScrollDown();
                }

            }
            break;
        }
        case KEY_CODES.DPAD_UP:
        {
        	if ($scope.RedboxGiftCard) break;
            if (!($scope.$root.titleCheckoutChangeCardVisible || $scope.$root.titleCheckoutSelectedOptionVisible)) {
                $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).blur();

                if ($scope.titleCheckoutCurrentControlIndex > 0) {
                    $scope.titleCheckoutCurrentControlIndex--;
                }

                $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).focus();
            }
            else if ($scope.$root.titleCheckoutSelectedOptionVisible) {

                if ($scope.titleCheckoutRentBuyCurrentCount > 0) {
                    $scope.titleCheckoutRentBuyCurrentCount--;
                }

            }
            else if ($scope.$root.titleCheckoutChangeCardVisible) {

                if ($scope.titleCheckoutChangeCardCurrentCount > 0) {
                    // Disable scrolling upward if user has 10 cards and he is on first card
                    if(!$scope.canAddCards && $scope.titleCheckoutChangeCardCurrentCount == 1){
                        $scope.titleCheckoutChangeCardCurrentCount = 1;
                    }else{
                        $scope.titleCheckoutChangeCardCurrentCount--;
                        changeCardScrollUp();
                    }
                }

            }
            break;
            
        }
        case KEY_CODES.X:
        case KEY_CODES.F:
        {
        	//alert($scope.titleCheckoutChangeCardCurrentCount+""+$scope.cards[$scope.titleCheckoutChangeCardCurrentCount]);
        	if ($scope.RedboxGiftCard) {
        	    $scope.RedboxGiftCard = false;
        	} else if ($scope.cards.length >= $scope.titleCheckoutChangeCardCurrentCount)
        	    titlecheckoutClickEvent($scope.cards[$scope.titleCheckoutChangeCardCurrentCount - 1]);
        	else
        	    titlecheckoutClickEvent(REDBOX_GIFT);
        	break;
        }
        case KEY_CODES.CIRCLE:
        {
        	if ($scope.RedboxGiftCard) {
        	    $scope.RedboxGiftCard = false;
				break;
        	} else if ($scope.showAbandonCheckout == true) {
				rbiCommonService.removeSharedItem(IS_INSTANT_OPTION);
        	    $scope.$root.showTitleConfirmCheckout = true;
        	    $scope.showAbandonCheckout = false;
                // Omniture - abandon checkout popup
                $scope.omnitureCollectOnClick("no");
        	}
        	 else if (!($scope.$root.titleCheckoutChangeCardVisible || $scope.$root.titleCheckoutSelectedOptionVisible)) {
                $scope.$root.showTitleConfirmCheckout = false;
                $scope.$root.titleCheckoutChangeCardVisible = false;
                $scope.$root.titleCheckoutSelectedOptionVisible = false;
                //$scope.titleCheckoutRentBuyCurrentCount = 0;
                $scope.titleCheckoutChangeCardCurrentCount = 0;
                $scope.showAbandonCheckout = true;
                $scope.$root.showCheckOut = "";
               // goToPreviousPath($scope, event.keyCode, $location);
            }
            else if ($scope.$root.titleCheckoutChangeCardVisible) {
                //$scope.titleCheckoutRentBuyCurrentCount = 0;
                $scope.titleCheckoutChangeCardCurrentCount = 0;
                $scope.$root.titleCheckoutChangeCardVisible = false;
            }
            else if ($scope.$root.titleCheckoutSelectedOptionVisible) {
                //$scope.titleCheckoutRentBuyCurrentCount = 0;
                $scope.titleCheckoutChangeCardCurrentCount = 0;
                $scope.$root.titleCheckoutSelectedOptionVisible = false;
            }

            $scope.changeCardTop = 0;
            $("#checkout_changecard_list").css('top', $scope.changeCardTop);
            break;
        }
    }
    }

    $scope.titlecheckoutCardTogglePopup = function () {
        $scope.$root.titleCheckoutChangeCardVisible ? $scope.$root.titleCheckoutChangeCardVisible = false : $scope.$root.titleCheckoutChangeCardVisible = true;
        // Set focus to first card if user already has 10 cards
        if(!$scope.canAddCards){
            $scope.titleCheckoutChangeCardCurrentCount = 1;
        }else
            $scope.titleCheckoutChangeCardCurrentCount = 0;
    };

    $scope.titlecheckoutOptionTogglePopup = function () {
        $scope.$root.titleCheckoutSelectedOptionVisible ? $scope.$root.titleCheckoutSelectedOptionVisible = false : $scope.$root.titleCheckoutSelectedOptionVisible = true;

    };

    function setCheckoutOptionPopupFocus(getFocusIndex){
        $('#titlecheckout_rentbuy_ul li div').each(function(index){
            if($(this).children().hasClass("select-card")){
                $scope.titleCheckoutRentBuyCurrentCount = index;
                getFocusIndex = $scope.titleCheckoutRentBuyCurrentCount;
            }
        });

    }

    function changeCardScrollDown() {
        $scope.changeCardTop = $scope.changeCardTop - $scope.changeCardOffset;
        $("#checkout_changecard_list").css('top', $scope.changeCardTop);
    }

    function changeCardScrollUp() {
        $scope.changeCardTop = $scope.changeCardTop + $scope.changeCardOffset;
        $("#checkout_changecard_list").css('top', $scope.changeCardTop);
    }
	/**
	 * Magic Remote Implementation  mouse over functionality
	 * @param CurrentIndex
	 * @param option
	 * @return
	 */
    function titleCheckoutMouseOver(CurrentIndex,option) {
    	
    	if($scope.$root.titleCheckoutSelectedOptionVisible && option=="titlecheckout_option"){
    		$scope.$root.titleCheckoutChangeCardVisible=false;
             $scope.titleCheckoutRentBuyCurrentCount=CurrentIndex;
    	}
    	else if($scope.$root.titleCheckoutChangeCardVisible && option=="titlecheckout_changecard"){
             if ($scope.titleCheckoutChangeCardCurrentCount > 0) {
                // $scope.titleCheckoutChangeCardCurrentCount=CurrentIndex;
                 //changeCardScrollUp();
             }
    	}
    	else if (!($scope.$root.titleCheckoutChangeCardVisible || $scope.$root.titleCheckoutSelectedOptionVisible) && option=="titlecheckout") {
    		$scope.$root.titleCheckoutSelectedOptionVisible=false;
        	$scope.$root.titleCheckoutChangeCardVisible=false;
    		$($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).blur();
             $scope.titleCheckoutCurrentControlIndex=CurrentIndex;
             $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).focus();
         }
    	else if (CurrentIndex==0 && option=="titlecheckout") {
    		//$scope.$root.titleCheckoutSelectedOptionVisible=false;
        	$scope.$root.titleCheckoutChangeCardVisible=false;
        	 $scope.titleCheckoutRentBuyCurrentCount=0;
        	$($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).blur();
            $scope.titleCheckoutCurrentControlIndex=CurrentIndex;
            $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).focus();

         }
    	else if (CurrentIndex==1 && option=="titlecheckout") {
    		$scope.$root.titleCheckoutSelectedOptionVisible=false;
        	//$scope.$root.titleCheckoutChangeCardVisible=false;
    		 $scope.titleCheckoutRentBuyCurrentCount=0;
    		$($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).blur();
            $scope.titleCheckoutCurrentControlIndex=CurrentIndex;
            $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).focus();

         }
    	else if (CurrentIndex==2 && option=="titlecheckout") {
    		$scope.$root.titleCheckoutSelectedOptionVisible=false;
    		$scope.$root.titleCheckoutChangeCardVisible=false;
    		 $scope.titleCheckoutRentBuyCurrentCount=0;
        	//$scope.$root.titleCheckoutChangeCardVisible=false;
    		$($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).blur();
            $scope.titleCheckoutCurrentControlIndex=CurrentIndex;
            $($scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex]).focus();

         }else if( option=="Button2"){
			$(".yes-btn-wrapper").addClass("menu-button-wrapper-highlight");
			$(".no-btn-wrapper").removeClass("menu-button-wrapper-highlight");
		} else if (option == "Button1") {
			$(".no-btn-wrapper").addClass("menu-button-wrapper-highlight");
			$(".yes-btn-wrapper").removeClass("menu-button-wrapper-highlight");
		}
    	
        }
    /**
     * Magic Remote Implementation for title checkout change card mouse scroll functionality
     * @param e
     * @return
     */
    function handleMouseWheel(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta == 1) {
            handleKeyUp();
        } else {
            handleKeyDown();
        }
        $scope.$apply();
    }
    /**
     * scroll down event
     * @return
     */
    function handleKeyDown() {
    
        if ($scope.$root.titleCheckoutChangeCardVisible) {

            var $count = $('#titlecheckout_changecard_ul li');
            if ($scope.titleCheckoutChangeCardCurrentCount < $count.length) {
                $scope.titleCheckoutChangeCardCurrentCount++;
                changeCardScrollDown();
            }

        }
    }
    
    /**
     * scroll up  event
     * @return
     */
    function handleKeyUp() {
      
        if ($scope.$root.titleCheckoutChangeCardVisible) {

            if ($scope.titleCheckoutChangeCardCurrentCount > 0 ) {
            	 if($scope.titleCheckoutChangeCardCurrentCount!=1 || $scope.canAddCards){
            		 $scope.titleCheckoutChangeCardCurrentCount--;
                changeCardScrollUp();
            	 }
            }

        }
    }
    /**
     *  Magic Remote Implementation  chenge card functionality
     * @return
     */
    function changecardClickEvent() {
    	if ($scope.RedboxGiftCard) {
    	    $scope.RedboxGiftCard = false;
    	    $scope.$root.titleCheckoutChangeCardVisible = false;
    	}
    	else if ($scope.$root.titleCheckoutChangeCardVisible) {

        if ($scope.titleCheckoutChangeCardCurrentCount == 0) {
            platformStorage.setItem("openTitleCheckoutOnNavigation", true);
        }

        $("#titlecheckout_changecard_" + $scope.titleCheckoutChangeCardCurrentCount).click();
        //$scope.titleCheckoutRentBuyCurrentCount = 0;
        $scope.titleCheckoutChangeCardCurrentCount = 0;
        $scope.$root.titleCheckoutChangeCardVisible = false;
    }

    $scope.changeCardTop = 0;
    $("#checkout_changecard_list").css('top', $scope.changeCardTop);

    }
    function titlecheckoutClickEvent(card) {
    	if ($scope.showAbandonCheckout == true || $("#showAbandon").css("display") == "block") {
            if (card == "Button1") {
                rbiCommonService.removeSharedItem(IS_INSTANT_OPTION);
                $scope.$root.showTitleConfirmCheckout = true;
                $scope.showAbandonCheckout = false;
                // Omniture
                $scope.omnitureCollectOnClick("no");
            } else {
                $scope.abandonCheckout();
                // Omniture
                $scope.omnitureCollectOnClick("yes");
                rbiCommonService.removeSharedItem(IS_INSTANT_OPTION);
                rbiCommonService.removeSharedItem(IS_CHECKOUT_CARD);
                $("#showAbandon").css({ display: "none" });
            }
        }
   	 else if  (!($scope.$root.titleCheckoutChangeCardVisible || $scope.$root.titleCheckoutSelectedOptionVisible) && card != "Button1" && card != "Button1") {
           var currentElement = $scope.titleCheckoutControls[$scope.titleCheckoutCurrentControlIndex];
           if($scope.titleCheckoutCurrentControlIndex==0){
        	   $scope.titlecheckoutOptionTogglePopup();
        	   //$scope.$root.titleCheckoutSelectedOptionVisible ? $scope.$root.titleCheckoutSelectedOptionVisible = false : $scope.$root.titleCheckoutSelectedOptionVisible = true;
           }
           	if($scope.titleCheckoutCurrentControlIndex==1)
           		$scope.titlecheckoutCardTogglePopup()
           	if($scope.titleCheckoutCurrentControlIndex==2)
           		$scope.performOnDemandPurchase();
            //Set the Focus to the selected Instant Option from the Title Detail page.
           setCheckoutOptionPopupFocus($scope.titleCheckoutRentBuyCurrentCount);
       }
       else if ($scope.$root.titleCheckoutSelectedOptionVisible) {
           $("#titlecheckout_option_" + $scope.titleCheckoutRentBuyCurrentCount).click();
       }
       else if ($scope.$root.titleCheckoutChangeCardVisible && card!='0_1') {

           if ($scope.titleCheckoutChangeCardCurrentCount == 0) {
               platformStorage.setItem("openTitleCheckoutOnNavigation", true);
           }
           else{
               rbiCommonService.removeSharedItem(IS_CHECKOUT_CARD);
           }

           helper.isDefined(card) ? $scope.setSelectedCardAccount(card) : $scope.addCard();
           //$scope.titleCheckoutRentBuyCurrentCount = 0;
           $scope.titleCheckoutChangeCardCurrentCount = 0;
           $scope.$root.titleCheckoutChangeCardVisible = false;
       }
       else if ($scope.$root.titleCheckoutChangeCardVisible && card=='0_1') {
    	   $scope.$root.titleCheckoutChangeCardVisible = false;
       }
       $scope.changeCardTop = 0;
       $("#checkout_changecard_list").css('top', $scope.changeCardTop);

    }
}