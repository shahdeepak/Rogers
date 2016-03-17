function kioskCheckoutventHandler($scope, $location, $routeParams,rbiCommonService, $timeout) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.kioskcheckoutMouseOver = kioskcheckoutMouseOver; // Magic Remote Implementation  mouse over functionality
    this.kioskcheckoutOptionTogglePopup=kioskcheckoutOptionTogglePopup;
    this.handleMouseWheel = handleMouseWheel; // Magic Remote Implementation  mouse scroll functionality
    this.kioskcheckoutClickEvent=kioskcheckoutClickEvent;
    this.handleKioskChekoutBackButton = handleKioskChekoutBackButton;
    this.removeBottomButtonFocus=removeBottomButtonFocus;
    $scope.kioskChangeCardCurrentIndex = 0;

    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE || $('.popupboxouterdiv').is(":visible") == true) {
            PopupBox.HandleKeyPress();
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
            		//adding to disable up down key handling
            		if ($scope.RedboxGiftCard) break;
                	if ($scope.$root.showOver18Checkbox && $scope.$root.kioskCheckOutCurrentIndex==4) {
                        resetPopupDropdown();
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).blur();

                        $scope.$root.kioskCheckOutLevelIndex = 0;
                        $scope.$root.kioskCheckOutCurrentIndex = 0;

                        if ($scope.$root.kioskCheckOutLevelIndex == 0 && $scope.$root.kioskCheckOutCurrentIndex > 1) {
                            $scope.$root.kioskCheckOutCurrentIndex = 1;
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 1 && $scope.$root.kioskCheckOutCurrentIndex > 3) {
                            $scope.$root.kioskCheckOutCurrentIndex = 3;

                            if ($scope.$root.kioskCheckOutCurrentIndex == 3 && !$scope.$root.showUseCreditChecked) {
                                $scope.$root.kioskCheckOutCurrentIndex = 2;
                            }
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 0 && $scope.$root.kioskCheckOutCurrentIndex == 0) {

                            if (!$scope.$root.showOver18Checkbox) {
                                $scope.$root.kioskCheckOutLevelIndex = 1;
                                $scope.$root.kioskCheckOutCurrentIndex = 2;
                            }
                        }
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();

                        $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
                    }
                    break;
                }
            case KEY_CODES.DPAD_RIGHT:
            	{
            		//adding to disable up down key handling
            		if ($scope.RedboxGiftCard) break;
                	if ($scope.$root.showOver18Checkbox && $scope.$root.kioskCheckOutLevelIndex == 0 && $scope.$root.isOver18Checked) {
                        resetPopupDropdown();
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).blur();

                        $scope.$root.kioskCheckOutLevelIndex = 1;
                        $scope.$root.kioskCheckOutCurrentIndex = 4;

                        if ($scope.$root.kioskCheckOutLevelIndex == 0 && $scope.$root.kioskCheckOutCurrentIndex > 1) {
                            $scope.$root.kioskCheckOutCurrentIndex = 1;
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 1 && $scope.$root.kioskCheckOutCurrentIndex > 3 && !$scope.$root.isOver18Checked) {
                            $scope.$root.kioskCheckOutCurrentIndex = 3;
                            if ($scope.$root.kioskCheckOutCurrentIndex == 3 && !$scope.$root.showUseCreditChecked) {
                                $scope.$root.kioskCheckOutCurrentIndex = 2;
                            }

                        }
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();

                        $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
                    }
                    break;
                }

            case KEY_CODES.DPAD_DOWN:
                {
                	//adding to disable up down key handling
                	if ($scope.RedboxGiftCard) break;
                    if ($scope.$root.kioskChangeCardPopupVisible == false && $scope.$root.kioskAddTitlePopupVisible == false) {
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).blur();

                        $scope.$root.kioskCheckOutCurrentIndex++;
                        if ($scope.$root.kioskCheckOutLevelIndex == 0 && $scope.$root.kioskCheckOutCurrentIndex > 0) {
                            $scope.$root.kioskCheckOutCurrentIndex = 0;
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 1 && $scope.$root.kioskCheckOutCurrentIndex > 4) {
                            $scope.$root.kioskCheckOutCurrentIndex = 4;
                        }

                        if ($scope.$root.kioskCheckOutCurrentIndex == 3 && !$scope.$root.showUseCreditChecked) {
                            $scope.$root.kioskCheckOutCurrentIndex++;
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 1 && $scope.$root.kioskCheckOutCurrentIndex == 4) {
                            if ($scope.$root.kioskCheckOutLevelIndex == 1 && $scope.$root.kioskCheckOutCurrentIndex == 4) {
                            	if($scope.$root.showOver18Checkbox){
                                $("#kioskcheckout_0_0").is(':checked') ? $scope.$root.kioskCheckOutCurrentIndex = 4 : $scope.$root.kioskCheckOutCurrentIndex--;
                            	}
                                if ($scope.$root.kioskCheckOutCurrentIndex == 3 && !$scope.$root.showUseCreditChecked || $scope.$root.kioskCheckOutCurrentIndex == 3 && !$scope.$root.isOver18Checked) {
                                    $scope.$root.kioskCheckOutLevelIndex = 0;
                                    $scope.$root.kioskCheckOutCurrentIndex = 0;
                                }
                            }
                        }
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();


                        $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
                    }
                    else if ($scope.$root.kioskChangeCardPopupVisible == true) {
                        $("#" + $scope.kioskCurrentChangeCardDropdown).removeClass("popupdropdown");
                        try {
                            var $changeCardUL = $('#kioskcheckout_changecard_ul li');

                            if ($scope.kioskChangeCardCurrentIndex < $changeCardUL.length) {
                                $scope.kioskChangeCardCurrentIndex++;
                                changeCardScrollDown();
                            }
                        }
                        catch (object) {
                        }
                        $scope.kioskCurrentChangeCardDropdown = "kioskcheckout_changecard_" + $scope.kioskChangeCardCurrentIndex;
                    }
                    else if ($scope.$root.kioskAddTitlePopupVisible == true) {
                        try {
                            var $changeCardUL = $('#remove_title_ul li');

                            if ($scope.kioskRemoveTitleCurrentIndex < $changeCardUL.length - 1) {
                                $scope.kioskRemoveTitleCurrentIndex++;
                            }
                        }
                        catch (object) {
                        }
                        $scope.kioskCurrentRemoveTitleDropdown = "remove_title_dropdown_" + $scope.kioskRemoveTitleCurrentIndex;
                    }
                    break;
                }

            case KEY_CODES.DPAD_UP:
            	{
            		//adding to disable up down key handling
            		if ($scope.RedboxGiftCard) break;
					removeBottomButtonFocus();
                    if ($scope.$root.kioskChangeCardPopupVisible == false && $scope.$root.kioskAddTitlePopupVisible == false) {
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).blur();

                        if ($scope.$root.kioskCheckOutCurrentIndex > 0) {
                            $scope.$root.kioskCheckOutCurrentIndex--;
                            if ($scope.$root.kioskCheckOutCurrentIndex == 0 && $scope.isAddTitleButtonEnabled == false) {
                                $scope.$root.kioskCheckOutCurrentIndex++;
                            }
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 0 && $scope.$root.kioskCheckOutCurrentIndex == 0) {
                            $scope.$root.kioskCheckOutCurrentIndex = 3;
                            $scope.$root.kioskCheckOutLevelIndex = 1;
                        }
                        if ($scope.$root.kioskCheckOutLevelIndex == 1 && $scope.$root.kioskCheckOutCurrentIndex > 4) {
                            $scope.$root.kioskCheckOutCurrentIndex = 4;
                        }
                        if ($scope.$root.kioskCheckOutCurrentIndex == 3 && !$scope.$root.showUseCreditChecked) {
                            $scope.$root.kioskCheckOutCurrentIndex > 0 ? $scope.$root.kioskCheckOutCurrentIndex-- : 0;
                        }
                        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();

                        $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
                    }
                    else if ($scope.$root.kioskChangeCardPopupVisible == true) {
                        $("#" + $scope.kioskCurrentChangeCardDropdown).removeClass("popupdropdown");
                        if ($scope.kioskChangeCardCurrentIndex > 0) {
                            // Disable scrolling upward if user has 10 cards and he is on first card
                            if(!$scope.canAddCards && $scope.kioskChangeCardCurrentIndex == 1){
                                $scope.kioskChangeCardCurrentIndex = 1;
                            }else{
                                $scope.kioskChangeCardCurrentIndex--;
                                changeCardScrollUp();
                            }
                        }
                        $scope.kioskCurrentChangeCardDropdown = "kioskcheckout_changecard_" + $scope.kioskChangeCardCurrentIndex;
                        $("#" + $scope.kioskCurrentChangeCardDropdown).addClass("popupdropdown");
                    }
                    else if ($scope.$root.kioskAddTitlePopupVisible == true) {
                        $("#" + $scope.kioskCurrentRemoveTitleDropdown).removeClass("popupdropdown");
                        if ($scope.kioskRemoveTitleCurrentIndex > 0) {
                            $scope.kioskRemoveTitleCurrentIndex--;
                        }
                        $scope.kioskCurrentRemoveTitleDropdown = "remove_title_dropdown_" + $scope.kioskRemoveTitleCurrentIndex;
                        $("#" + $scope.kioskCurrentRemoveTitleDropdown).addClass("popupdropdown");
                    }
                    helper.debugLog("Level"+$scope.$root.kioskCheckOutLevelIndex);
                    break;
                }

            case KEY_CODES.X:
                {
                	if($scope.RedboxGiftCard){
                		$scope.RedboxGiftCard= false;
                	}
                	else if ($scope.cards.length >=0) {
                	    if ($scope.cards.length >= $scope.kioskChangeCardCurrentIndex)
                	        var card = ($scope.kioskChangeCardCurrentIndex >= 1) ? $scope.cards[$scope.kioskChangeCardCurrentIndex - 1] : null;
                	    else
                	        var card = REDBOX_GIFT;
                	    kioskcheckoutClickEvent(card);
                	}
                    else {
                        // track 'Change card' button
                        $scope.trackOmniture[0] = "change card";
                        $scope.omnitureReady[0] = true;
                        // no cards on file - call addCard directly
                        $scope.addCard();
                    }
                    break;
                }

            case KEY_CODES.CIRCLE:
                {
                   handleKioskChekoutBackButton();
                    break;
                }
        }
    }

    //handles ng-click ang keyboard back navigation
    function handleKioskChekoutBackButton(){
    	if ($scope.RedboxGiftCard) {
    	    $scope.RedboxGiftCard = false;
    	} else if ($scope.showkioskAbandonCheckout == true) {
    	    $scope.showKioskConfirmCheckout = true;
    	    $scope.showkioskAbandonCheckout = false;
    	}
        else if ($scope.$root.kioskChangeCardPopupVisible == false && $scope.$root.kioskAddTitlePopupVisible == false && $scope.showKioskConfirmCheckout == true) {
            $scope.showKioskConfirmCheckout = false;
            $scope.showkioskAbandonCheckout = true;
            $("#" + $scope.kioskCheckoutCurrentElement).blur();
            $scope.showkioskAbandonCheckout = true;
            //goToPreviousPath($scope, event.keyCode, $location);
        }
        else if ($scope.$root.kioskChangeCardPopupVisible == true) {
            $scope.$root.kioskChangeCardPopupVisible = false;
            resetPopupDropdown();
        }
        else if ($scope.$root.kioskAddTitlePopupVisible == true) {
            $scope.$root.kioskAddTitlePopupVisible = false;
            resetPopupDropdown();
        }
        else {
            goToPreviousPath($scope, event.keyCode, $location);
        }
    }
    function resetPopupDropdown() {
        $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
        $("#" + $scope.kioskCurrentRemoveTitleDropdown).removeClass("popupdropdown");
        $("#" + $scope.kioskCurrentChangeCardDropdown).removeClass("popupdropdown");
        $scope.kioskRemoveTitleCurrentIndex = 0;
        $scope.kioskChangeCardCurrentIndex = 0;
        $scope.kioskCurrentRemoveTitleDropdown = "remove_title_dropdown_" + $scope.kioskChangeCardCurrentIndex;
        $scope.kioskCurrentChangeCardDropdown = "kioskcheckout_changecard_" + $scope.kioskChangeCardCurrentIndex;
        $scope.changeCardTop = 0;
        $("#kioskcheckout_changecard_list").css('top', $scope.changeCardTop);
        $scope.$root.kioskChangeCardPopupVisible = false;
        $scope.$root.kioskAddTitlePopupVisible = false;
        $scope.changeCardTop = 0;
        $scope.changeCardOffset = 50;
        $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();
    }

    function changeCardScrollDown() {
        $scope.changeCardTop = $scope.changeCardTop - $scope.changeCardOffset;
        $("#kioskcheckout_changecard_list").css('margin-top', $scope.changeCardTop);
    }
    function changeCardScrollUp() {
        $scope.changeCardTop = $scope.changeCardTop + $scope.changeCardOffset;
        $("#kioskcheckout_changecard_list").css('margin-top', $scope.changeCardTop);
    }
    /**
     * 
	 * Magic Remote Implementation  mouse over functionality
     * @param LevelIndex
     * @param CurrentIndex
     * @return
     */
    function kioskcheckoutMouseOver(LevelIndex,CurrentIndex) {
    	
    	if(LevelIndex==1 && CurrentIndex==0 && $scope.cartItems.length >= 5 ){
    	return;
    	}
    	if($scope.$root.isOver18Checked || CurrentIndex!=4)
    	removeBottomButtonFocus();
    	if(CurrentIndex!=1 && LevelIndex!=2)
    	$scope.$root.kioskAddTitlePopupVisible=false;
    	if(CurrentIndex!=2 && LevelIndex!=2)
    	$scope.$root.kioskChangeCardPopupVisible=false;
    	if (LevelIndex == 'Yes' || LevelIndex == 'No') {
    		helper.RemoveFocus('No_1111');
    		helper.RemoveFocus("Yes_1112");
    		helper.SetFocus(LevelIndex + "_" + CurrentIndex);
		}else 	if ($scope.$root.kioskChangeCardPopupVisible == false && $scope.$root.kioskAddTitlePopupVisible == false && ($scope.$root.isOver18Checked ||CurrentIndex!=4)) {
			
            $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).blur();

            $scope.$root.kioskCheckOutLevelIndex=LevelIndex;
            $scope.$root.kioskCheckOutCurrentIndex=CurrentIndex;
            if ($("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).attr('type') == "checkbox") {
				$("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();
            }
            if(!$scope.$root.isOver18Checked && $scope.$root.showOver18Checkbox){
            	 $("#kioskcheckout_1_4").blur();
            }

        }
		 else if ($scope.$root.kioskAddTitlePopupVisible == true) {
			 $scope.kioskCurrentRemoveTitleDropdown = "remove_title_dropdown_" + $scope.kioskRemoveTitleCurrentIndex
			 
             
             try {
                 var $changeCardUL = $('#remove_title_ul li');

                 if ($scope.kioskRemoveTitleCurrentIndex < $changeCardUL.length - 1) {
                     $scope.kioskRemoveTitleCurrentIndex++;
                 }
             }
             catch (object) {
             }
             if(LevelIndex==2){
            	 $("#" + $scope.kioskCurrentRemoveTitleDropdown).removeClass("popupdropdown");
             $scope.kioskRemoveTitleCurrentIndex=CurrentIndex;
             $scope.kioskCurrentRemoveTitleDropdown = "remove_title_dropdown_" + $scope.kioskRemoveTitleCurrentIndex;
             $("#" + $scope.kioskCurrentRemoveTitleDropdown).addClass("popupdropdown");
             }
         }
    }
    function kioskcheckoutClickEvent(card){
    	if((card=='kioskcheckout_1_0' && $scope.cartItems.length >= 5) || (!$scope.isOver18Checked && card=='kioskcheckout_1_4') ){
        	return;
        	}
    	
    	if ($scope.RedboxGiftCard) {
    	    $scope.RedboxGiftCard = false;
    	    $scope.$root.kioskChangeCardPopupVisible = false;
    	    resetPopupDropdown();
    	} 
    	else if ($scope.showkioskAbandonCheckout == true) {
              $scope.abandonCheckout();
              rbiCommonService.removeSharedItem(IS_CARD);
          }
          else if ($scope.$root.kioskChangeCardPopupVisible == false && $scope.$root.kioskAddTitlePopupVisible == false) {
              resetPopupDropdown();
              switch ($scope.kioskCheckoutCurrentElement) {
                  case "kioskcheckout_1_2":
                      {
                          // track 'Change card' button
                          if (!$scope.$root.kioskChangeCardPopupVisible) {
                              $scope.trackOmniture[0] = "change card";
                              $scope.omnitureReady[0] = true;
                          }
                    	  $scope.titlecheckoutCardTogglePopup();
                          break;
                      }
                  case "kioskcheckout_0_0":
                      {
                      	$("#kioskcheckout_0_0").click();
                          break;
                      }
                  case "kioskcheckout_1_0":
                      {
                    	  if($scope.cartItems.length < 5){
                          resetPopupDropdown();
                          $scope.$root.showCheckOut = "";
                          $scope.showKioskConfirmCheckout = false;
                          $scope.addTitle();
                          backPaths.pop();
                    	  }
                          break;
                      }
                  case "kioskcheckout_1_1":
                      {
                      	/**
                      	 * Magic Remote Implementation  remove title functionality
                      	 */
                      	kioskcheckoutOptionTogglePopup();
                          break;
                      }
                  case "kioskcheckout_1_3":
                      {
                          //this is  to handle ng-click
                          //this condition is to check triggered event is click or not
						if(card != 'click'){
							$("#kioskcheckout_1_3").is(':checked') ? $("#kioskcheckout_1_3").prop("checked", false) : $("#kioskcheckout_1_3").prop("checked", true);
						 }else{
							$scope.$root.isUseCreditChecked = !$scope.$root.isUseCreditChecked;
						 }
                          $scope.userCreditClicked();
                          break;
                      }
                  case "kioskcheckout_1_4":
                      {
                    	  $scope.reserveTitles();
                          break;
                      }
              }
          }
          else if ($scope.$root.kioskChangeCardPopupVisible == true && card!="1_2") {
              //if ($scope.titleCheckoutChangeCardCurrentCount == 0) {
              //    platformStorage.setItem("openKioskCheckoutOnNavigation", true);
              //}

              if (card == null) {            // Corresponds to selecting "Add Card"
                  $scope.addCard();
              }
              else {
            	  rbiCommonService.removeSharedItem(IS_CARD);
                  $scope.setSelectedCardAccount(card);
              }

              $scope.$root.kioskChangeCardPopupVisible = false;
              resetPopupDropdown();
          }
          else if ($scope.$root.kioskAddTitlePopupVisible == true) {
              $("#" + $scope.kioskCurrentRemoveTitleDropdown).click();
              $scope.$root.kioskAddTitlePopupVisible = false;
              resetPopupDropdown();
          }
          else if ($scope.$root.kioskChangeCardPopupVisible == true && card=="1_2") {
        	  $scope.$root.kioskChangeCardPopupVisible = false;
          }

    	
    }
//    removeBottomButtonFocus
    function removeBottomButtonFocus(){
    	helper.RemoveFocus('back-button-wrapper');
          helper.RemoveFocus('menu-button-wrapper');
          if($scope.$root.kioskCheckOutCurrentIndex!=1)
          $scope.$root.kioskAddTitlePopupVisible=false;
          if($scope.$root.kioskCheckOutCurrentIndex!=2)
      		$scope.$root.kioskChangeCardPopupVisible=false;
          if($scope.backflag){
        	  $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).blur();
         	 $scope.$root.kioskAddTitlePopupVisible=false;
         	 $scope.$root.kioskChangeCardPopupVisible=false;
         	 $scope.$apply();
          $scope.backflag=false;
          $scope.$root.kioskCheckOutCurrentIndex=0;
          }
    }
    function kioskcheckoutOptionTogglePopup(){
    	if($scope.$root.kioskChangeCardPopupVisible)
    	{
    		$scope.$root.kioskChangeCardPopupVisible=false;
    	}
    	($scope.$root.kioskAddTitlePopupVisible == true) ? $scope.$root.kioskAddTitlePopupVisible = false : $scope.$root.kioskAddTitlePopupVisible = true;
        $scope.kioskRemoveTitleCurrentIndex = 0;
        $scope.kioskCurrentRemoveTitleDropdown = "remove_title_dropdown_" + $scope.kioskRemoveTitleCurrentIndex;
        $("#" + $scope.kioskCurrentRemoveTitleDropdown).addClass("popupdropdown");
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
    
    	if ($scope.$root.kioskChangeCardPopupVisible == true) {
            try {
                var $changeCardUL = $('#kioskcheckout_changecard_ul li');

                if ($scope.kioskChangeCardCurrentIndex < $changeCardUL.length) {
                    $scope.kioskChangeCardCurrentIndex++;
                    changeCardScrollDown();
                }
            }
            catch (object) {
            }
            $scope.kioskCurrentChangeCardDropdown = "kioskcheckout_changecard_" + $scope.kioskChangeCardCurrentIndex;
        }
    }
    /**
     * scroll up  event
     * @return
     */
    function handleKeyUp() {
      
        if ($scope.$root.kioskChangeCardPopupVisible == true) {
            $("#" + $scope.kioskCurrentChangeCardDropdown).removeClass("popupdropdown");
            if ($scope.kioskChangeCardCurrentIndex > 0) {
            	if($scope.kioskChangeCardCurrentIndex!=1 || $scope.canAddCards){
            		 $scope.kioskChangeCardCurrentIndex--;
               changeCardScrollUp();
           	 }
            }
            $scope.kioskCurrentChangeCardDropdown = "kioskcheckout_changecard_" + $scope.kioskChangeCardCurrentIndex;
        }
    }
    
    $scope.over18Check = function () {

        if ($scope.$root.isOver18Checked) {
            $scope.$root.kioskCheckOutLevelIndex = 1;
            $scope.$root.kioskCheckOutCurrentIndex = 4;
            $("#kioskcheckout_0_0").blur();
        }
       
        $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
    };
    $scope.titlecheckoutCardTogglePopup = function () {
    	if($scope.$root.kioskAddTitlePopupVisible)
    	{
    		$scope.$root.kioskAddTitlePopupVisible=false;
    	}
        ($scope.$root.kioskChangeCardPopupVisible == true) ? $scope.$root.kioskChangeCardPopupVisible = false : $scope.$root.kioskChangeCardPopupVisible = true;
        // Set focus to first card if user already has 10 cards
        if(!$scope.canAddCards){
            $scope.kioskChangeCardCurrentIndex = 1;
        }else
            $scope.kioskChangeCardCurrentIndex = 0;
        $scope.kioskCurrentChangeCardDropdown = "kioskcheckout_changecard_" + $scope.kioskChangeCardCurrentIndex;

    };
    
  
}