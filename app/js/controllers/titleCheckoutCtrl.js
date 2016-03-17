'use strict';
/**
 * Checkout controller to manage title checkout
 * @author Bhushan Balki
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */
rbi.controller('titleCheckoutCtrl',
    function ($scope, $location, $routeParams, rbiCommonService, reservationService, customerService) {
        //Omniture
        Omniture.pageName = "";

        //Omniture
        popCheckoutBackEntry();
        $scope.canMoveFocus = false;
        POP_ALERT_BOX_VISIBLE = false;
        $scope.canAddCards = true;
        $scope.isCalculationDone = false;

        // Omniture start
        $scope.omnitureReady = [false];
        $scope.checkoutSuccess = isDefined($routeParams.titleSuccess);
        // Omniture end

        $scope.eventHandler = new TitleCheckoutEventHandler($scope, $location, $routeParams,rbiCommonService);
        
        if (isDefined($routeParams.titleSuccess)) {
        	$scope.eventHandler = new titleSuccessCheckoutEventHandler($scope, $location, $routeParams, rbiCommonService);
           
        }
        platformStorage.setItem("checkouttype", "titleCheckout");
        $scope.levelMap = [];
        $scope.LEVEL_AT_PWPOPUP = 1;
        $scope.LEVEL_AT_PWPOPUP_SUBMIT = 2;
        $scope.CurrentLevelIndex = 1;
        $scope.levelMap[$scope.LEVEL_AT_PWPOPUP] = {
            CurrentIndex: 0,
            MaxElements: 0,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };

		$scope.selectedInstantOption;
        var instantOptionPopUpjsonObj;
        $scope.selectedCardAccount = null;
        $scope.titleCheckoutCurrentControlIndex;
        $scope.titleCheckoutRentBuyCurrentCount;
        $scope.titleCheckoutChangeCardCurrentCount;
        $scope.titleCheckoutSelectedOptionVisible = false;
        $scope.title;
        $scope.RecommendedProductsResponse;
        $scope.changeCardTop = 0;
        $scope.changeCardOffset = 50;
        $scope.RedboxGiftCard= false;

        hideMainMenu();


        $scope.onDemandCartPricing;
        $scope.filteredInstantOptions = [];
        $scope.confirmCheckOutUi = {
            "buttonText": "BUY NOW",
            "detail": "You own this movie. You can find it by going to My Redbox Purchases. Watch it as often as you like on any device that supports playback. You can also download it to watch offline on mobile devices. Enjoy!"
        };
        $scope.successCheckOutUi = {
            "title": "Success! It's all yours!",
            "legendImage1": "images/watch-it-anytime.png",
            "legendImage2": "images/download-to-device.png",
            "detail": "You own this movie. You can find it by going to My Redbox Purchases. Watch it as often as you like on any device that supports playback. You can also download it to watch offline on mobile devices. Enjoy!"
        };

        $scope.getCards = function (successCallback) {
            customerService.getCards(rbiCommonService,
                function (data) {
                    $scope.cards = data;
                    if ($scope.cards.length > 0) {
                        $scope.selectedCardAccount = customerService.getPreferredCard(data);
                        canAddMoreCards();
                    }
                    else {
                        $scope.canAddCards = true;
                        $scope.selectedCardAccount = null;
                    }
                    checkIfNavigatedFromAccount();
                    if (isDefined(successCallback)) {
                        successCallback();
                    }
                },
                function (data) {
                    $scope.canAddCards = true;
                    $scope.selectedCardAccount = null;
                    helper.debugLog("Error occureed with getCards.");
                });

        };

        function canAddMoreCards(){
            if ($scope.cards.length >= 10) {
                $scope.canAddCards = false;
            }
            else {
                $scope.canAddCards = true;
            }
        }     


        $scope.checkNewCardSelect = function () {
            try {
                // Always pick the preferred card
                $scope.setSelectedCardAccount(customerService.getPreferredCard($scope.cards));

                /*
                if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD) || $scope.cards.length == 1) {
                    $scope.setSelectedCardAccount($scope.cards[$scope.cards.length - 1]);
                }
                else if (isDefined($scope.cards) && $scope.cards.length > 0 && !isDefined($scope.selectedCardAccount)) {
                    $scope.setSelectedCardAccount($scope.cards[0]);
                }
                else {
                    $scope.getOnDemandCartPricing();
                }  */

            } catch (object) {
            }

        };
        $scope.abandonCheckout = function () {
            // $scope.parentobj.cart.clear();
            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
            }
            platformStorage.removeItem("openKioskCheckoutOnNavigation");
            platformStorage.removeItem("openTitleCheckoutOnNavigation");
            platformStorage.removeItem("checkouttype");
            helper.removeTitleDetailState($scope);

            $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
        };

        $scope.setSelectedCardAccount = function (card) {
        	if (card == REDBOX_GIFT) {
        	    $scope.RedboxGiftCard = true;
        	    return;
        	}
        	if (rbiCommonService.isSharedItemExist(IS_CHECKOUT_CARD)) {
        		$scope.selectedCardAccount=rbiCommonService.getSharedItem(IS_CHECKOUT_CARD);
       	    }
        	else{
            $scope.selectedCardAccount = card;
        	}
         	rbiCommonService.setSharedItem(IS_CHECKOUT_CARD,$scope.selectedCardAccount);
            if (!isDefined($routeParams.titleSuccess)) {
                $scope.getOnDemandCartPricing();
            }
        };
        $scope.setSelectedInstantOption = function (instantOption) {
            $scope.selectedInstantOption = instantOption;
			rbiCommonService.setSharedItem(IS_INSTANT_OPTION,instantOption);
            if (!isDefined($routeParams.titleSuccess)) {
                $scope.getOnDemandCartPricing();
            }
            updateMessages();
            $scope.$root.titleCheckoutSelectedOptionVisible = false;
        };
		
		/**
         * Updates Mesage on Checkoout Success screen
         */
        function updateMessages() {
            var purchaseType = "Buy";
            if ($scope.selectedInstantOption.PurchaseOptionType.indexOf("Rent") > -1) {
                purchaseType = "Rent";
                $scope.confirmCheckOutUi.buttonText = "RENT NOW";
                $scope.confirmCheckOutUi.detail = "You have 30 days to start watching. Once you start, you will have 48 hours to finish watching before your rental expires.";
                if ($scope.selectedInstantOption.PurchaseOptionType.indexOf("HD") > -1) {
                    $scope.confirmCheckOutUi.detail += " Hey, just a heads up: this HD title will display at a lower resolution on Mobile devices, but don't worry, it will still look great!";
                }
                $scope.successCheckOutUi.title = "Success! Your rental is now ready to watch!";
                $scope.successCheckOutUi.legendImage1 = "images/30-days.png";
                $scope.successCheckOutUi.legendImage2 = "images/48-hrs.png";
                $scope.successCheckOutUi.detail = $scope.confirmCheckOutUi.detail;
            } else {
                $scope.confirmCheckOutUi.buttonText = "BUY NOW";
                $scope.confirmCheckOutUi.detail = "You own this movie. You can find it by going to My Redbox Purchases. Watch it as often as you like on any device that supports playback. You can also download it to watch offline on mobile devices. Enjoy!";

                $scope.successCheckOutUi.title = "Success! It's all yours!";
                $scope.successCheckOutUi.legendImage1 = "images/watch-it-anytime.png";
                $scope.successCheckOutUi.legendImage2 = "images/download-to-device.png";
                $scope.successCheckOutUi.detail = $scope.confirmCheckOutUi.detail;
            }
        }

        $scope.getFilteredInstantOption = function () {
            updateMessages();
            var instantOptions = instantOptionPopUpjsonObj.instantoption;
            for (var index = 0; index < instantOptions.length; index++) {
                var intantOption = instantOptions[index];
                if (intantOption != undefined && intantOption.PurchaseOptionID != undefined && intantOption.PurchaseOptionID != "") { //Remove watch now
                    $scope.filteredInstantOptions.push(intantOption);
                }
                /*if (intantOption.PurchaseOptionType.indexOf(purchaseType) > -1) {
                $scope.filteredInstantOptions.push(intantOption);
                }*/
            }
        };
        $scope.getOnDemandCartPricing = function () {
            $scope.canMoveFocus = false;
            $scope.CheckCardValidity($scope.selectedCardAccount, function () {
                if ($scope.selectedCardAccount != undefined && $scope.selectedInstantOption != undefined) {
                    reservationService.getOnDemandCartPricing($scope.selectedCardAccount.getAccountNumber(), $scope.selectedInstantOption.PurchaseOptionID,
	 					function (data) {
	 					    $scope.canMoveFocus = true;
	 					    $scope.onDemandCartPricing = data;
	 					    $scope.isCalculationDone = true;
                            // Omniture start
                            $scope.omnitureReady = [true];
                            // Omniture end
	 					}, function (data) {
	 					    $scope.canMoveFocus = true;
	 					    $scope.$root.showCheckOut = "";
	 					    //$scope.$root.showTitleSuccessCheckout = false;
	 					    //$scope.$root.showTitleConfirmCheckout = false;
	 					    if (!isDefined($routeParams.titleSuccess)) {
	 					        helper.showErrorMessage(data, $scope);
	 					    }
	 					    popCheckoutBackEntry();
	 					    $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
	 					    helper.debugLog("Error occurred with getOnDemandCartPricing.");

	 					}
	 				);
                }
	 	else {
	 	    $scope.canMoveFocus = true;
                    //helper.showErrorMessage(data, $scope);
                    //$scope.$root.showTitleConfirmCheckout = false;
                }
            });
        };
$scope.performOnDemandPurchase = function () {
    $scope.canMoveFocus = false;
            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
            }
            $scope.CheckCardValidity($scope.selectedCardAccount, function () {
                if ($scope.onDemandCartPricing != undefined) {
                    reservationService.performOnDemandPurchase($scope.onDemandCartPricing.getConfirmationId(),
                        function (data) {
                            $scope.canMoveFocus = true;

                            // Omniture start
                            $scope.omnitureCollectConfirmCheckout();
                            // Omniture end

                            platformStorage.removeItem("checkouttype");
                            if (rbiCommonService.isSharedItemExist(IS_CHECKOUT_CARD)) {
                                rbiCommonService.removeSharedItem(IS_CHECKOUT_CARD);
                            }
                            helper.removeTitleDetailState($scope);
                            $scope.goToSuccessPage();
                        }, function (data) {
                            $scope.canMoveFocus = true;
                            $scope.$root.showCheckOut = "";
                            helper.showErrorMessage(data, $scope);
                            //popCheckoutBackEntry();
                            //$scope.$root.showTitleConfirmCheckout = false;
                            helper.debugLog("Error occurred with performOnDemandPurchase.");
                            //goToPreviousPath($scope, event.keyCode, $location);
                           // $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
                        }
                    );
                }
                    else {
                        $scope.canMoveFocus = true;
                    /*helper.showErrorMessage(data, $scope);
                    $scope.$root.showTitleConfirmCheckout = false;*/
                }
            });

        };
            $scope.goToSuccessPage = function () {
                $scope.canMoveFocus = true;
            $scope.$root.showTitleSuccessCheckout = true;
            //            $scope.$root.showTitleConfirmCheckout = false;
            rbiCommonService.setSharedItem(SELECTED_INSTANT_OPTION, $scope.selectedInstantOption);
            $location.path("/titleCheckoutSuccess/success");
        };
        $scope.continueBrowsing = function () {
            $scope.$root.showTitleSuccessCheckout = false;
            $scope.$root.showCheckOut = false;
            // Omniture start
            $scope.omnitureCollectOnClick("browsing");
            // Omniture end
            if (rbiCommonService.isSharedItemExist(RATING)) {
                rbiCommonService.removeSharedItem(RATING);
            }
            $location.path("/browse/" + ($scope.title.isMovie == true ? "Movie" : "Game") + "/RentBuy/" + $scope.title.productId);
        };
        $scope.checkOutWatchNow = function () {
            $scope.$root.showTitleSuccessCheckout = false;
            $scope.$root.showCheckOut = false;
            // Omniture start
            $scope.omnitureCollectOnClick("watch now");
            // Omniture end
            // ZOE 24445 - Pass the HD / SD information to the player
            var isHD = ($scope.selectedInstantOption.PurchaseOptionType.indexOf(RBI.Product.Defines.MEDIA_FORMAT_TYPE_HD) > -1) ? true : false;
            rbiCommonService.setSharedItem("HD_ASSET", isHD);
            $location.path("/player/" + $scope.title.productId
                    + "/" + $scope.selectedInstantOption.PurchaseOptionID);
        };

        $scope.goToTitleDetail = function (title) {
            if (title) {
                $scope.$root.showCheckOut = "";
                $scope.$root.showTitleSuccessCheckout = false;
                $scope.$root.showTitleConfirmCheckout = false;
                // Omniture start
                $scope.omnitureCollectOnTitleDetail(title);
                // Omniture end
                if (rbiCommonService.isSharedItemExist(RATING)) {
                    rbiCommonService.removeSharedItem(RATING);
                }
                $location.path("/titledetail/" + title.productID);
            }
        };
        $scope.onBackClick = function (title) {
            if (title) {
                $scope.$root.showCheckOut = "";
                $scope.$root.showTitleSuccessCheckout = false;
                $scope.$root.showTitleConfirmCheckout = false;
                $location.path("/titledetail/" + title.getProductID());
                //$window.location="/titledetail/" + title.getProductID();
                //$route.reload();//Refresh the title details page
                if (rbiCommonService.isSharedItemExist(RATING)) {
                    rbiCommonService.removeSharedItem(RATING);
                }
                $scope.$parent.ReloadTitleDetail();
            }
        };
        $scope.addCard = function () {
            if (!$scope.canAddCards) {
                showCannotAddCardPopup();
                return;
            }


            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                //$scope.setSelectedCardAccount($scope.cards[$scope.cards.length - 1]);
                rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
            }



            $scope.$root.titleCheckoutChangeCardVisible = false;
            $scope.$root.showTitleConfirmCheckout = false;
            //$scope.$parent.invoke="rentbuy";
            helper.setTitleDetailState(
                $scope, $scope.title.productId,
                $scope.selectedInstantOption,
                $scope.selectedCardAccount,
                "TITLE_CHECKOUT");
            addToBackPaths($location.path());
            platformStorage.setItem("lastVisitTitle", $scope.title.productId);
            platformStorage.setItem("openTitleCheckoutOnNavigation", true);

            if (!isDefined($scope.cards) || $scope.cards.length == 0) {

                //window.location.href = window.location.pathname + "#/addUpdateCC?cardAction=add&isFirstCard=true";
                rbiCommonService.setSharedItem("isFirstCard", true);
                $location.path('/account/creditCards/cardDetails/add');
            }
            else {
                //window.location.href = window.location.pathname + "#/addUpdateCC?cardAction=add&isFirstCard=false";
                rbiCommonService.setSharedItem("isFirstCard", false);
                $location.path('/account/creditCards/cardDetails/add');
            }
        };

        $scope.CheckCardValidity = function (card, successCallback) {
            if (!helper.isValidCheckoutCard(card)) {
                if ($location.$$url.toString().match('titleCheckout')) {
                    $scope.canMoveFocus = true;
                    ShowInvalidCardPopup(card);
                }
            }
            else {
                if (successCallback != undefined)
                    successCallback();
            }
        };
        init();

        /**
         * Initializes the checkout screen
         */
        function init() {
            popCheckoutBackEntry();
            if (rbiCommonService.getSharedItem(CARD_OPERATION) != null) {
                $scope.getCards(function () {
                    //condition similar to else used in call back cause it should not run until cards loaded.
                    $scope.selectedCardAccount = $scope.cards[$scope.cards.map(function (elm) {
                        return elm.value.AccountNumber
                    }).indexOf(rbiCommonService.getSharedItem(OPERATED_ACCOUNT_NUMBER))];
                    $scope.selectedInstantOption = rbiCommonService.getSharedItem(SELECTED_INSTANT_OPTION);
                    instantOptionPopUpjsonObj = rbiCommonService.getSharedItem(INSTANT_OPTIONS);
                    //$scope.selectedCardAccount = rbiCommonService.getSharedItem(SELECTED_ACCOUNT);
                    $scope.titleCheckoutCurrentControlIndex = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
                    $scope.titleCheckoutRentBuyCurrentCount = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
                    $scope.titleCheckoutChangeCardCurrentCount = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CHANGE_CARD_CURRENT_COUNT);
                    $scope.title = rbiCommonService.getSharedItem(TITLE_DETAIL);
                    $scope.RecommendedProductsResponse = rbiCommonService.getSharedItem(MORE_LIKE_THIS);
                    //Reset the values
                    rbiCommonService.setSharedItem(OPERATED_ACCOUNT_NUMBER, null);
                    rbiCommonService.setSharedItem(CARD_OPERATION, null);
                    showRentBuy();
                    $scope.getFilteredInstantOption();
                    if (!isDefined($routeParams.titleSuccess)) {
                        $scope.checkNewCardSelect();
                    }
                    else {
                        // Omniture start
                        $scope.omnitureReady = [true];
                        // Omniture end
                    }

                })
            }
            else {
                if (helper.isUserLoggedIn()) {
                    $scope.getCards(function () {
                        $scope.selectedInstantOption = rbiCommonService.getSharedItem(SELECTED_INSTANT_OPTION);
                        instantOptionPopUpjsonObj = rbiCommonService.getSharedItem(INSTANT_OPTIONS);
                        //$scope.selectedCardAccount = rbiCommonService.getSharedItem(SELECTED_ACCOUNT);
                        $scope.titleCheckoutCurrentControlIndex = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
                        $scope.titleCheckoutRentBuyCurrentCount = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
                        $scope.titleCheckoutChangeCardCurrentCount = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CHANGE_CARD_CURRENT_COUNT);
                        $scope.title = rbiCommonService.getSharedItem(TITLE_DETAIL);
                        $scope.RecommendedProductsResponse = rbiCommonService.getSharedItem(MORE_LIKE_THIS);
                        showRentBuy();
                        $scope.getFilteredInstantOption();
                        if (!isDefined($routeParams.titleSuccess)) {
                            $scope.checkNewCardSelect();
                        }
                        else {
                            // Omniture start
                            $scope.omnitureReady = [true];
                            // Omniture end
                        }
                    });
                }
            }
        }

        /**
         * Checks navigation
         */
        function checkIfNavigatedFromAccount() {
            try {
                //To open Kiosk checkout popup on navigation
                if (isDefined(localStorage.getItem("openKioskCheckoutOnNavigation")) == true) {
                    if (isDefined($scope.cards) && $scope.cards.length > 0) {
                        rbiCommonService.setSharedItem(NAVIGATED_FROM_ADD_CARD, true);
                    }
                    localStorage.removeItem("openKioskCheckoutOnNavigation");
                    helper.removeTitleDetailState($scope);
                }
                else if (isDefined(localStorage.getItem("openTitleCheckoutOnNavigation")) == true) {
                    if (isDefined($scope.cards) && $scope.cards.length > 0) {
                        rbiCommonService.setSharedItem(NAVIGATED_FROM_ADD_CARD, true);
                    }
                    localStorage.removeItem("openTitleCheckoutOnNavigation");
                    helper.removeTitleDetailState($scope);
                }
            }
            catch (object) {
                helper.debugLog(object);
            }
        }
		
		 /**
         * Displays pop up
         */
        function showCannotAddCardPopup() {
            POP_ALERT_BOX_VISIBLE = true;
            var popupKey = "Popup_ADDCARD_FAIL";
            popupObj_Meta[popupKey].button_2_click = function () {
                helper.HidePopupBox();
            },
            popupObj_Meta[popupKey].button_1_click = function () {
                   
            },

           helper.ShowPopupBox(popupKey, $scope);

        };

        function ShowInvalidCardPopup(card) {
            $scope.$root.showCheckOut = "";
            //$scope.showKioskConfirmCheckout = false;
            //$scope.$root.showKioskSuccessCheckout = false;
            POP_ALERT_BOX_VISIBLE = true;
            var popupKey = "Popup_MISSING_INFO_BILLING_INFO";
            MISSING_CARD_POP_UP_VISIBLE = true;
            popupObj_Meta[popupKey].button_2_click = function () {
                if (!$scope.canMoveFocus) {
                    return;
                }
                $scope.canMoveFocus = false;
                platformStorage.setItem("lastVisitTitle", $scope.title.productId);
                helper.HidePopupBox($scope, $scope.$dialog);
                platformStorage.setItem("openTitleCheckoutOnNavigation", true);
                helper.setTitleDetailState(
                $scope, $scope.title.productId,
                $scope.selectedInstantOption,
                $scope.selectedCardAccount,
                "TITLE_CHECKOUT");
                addToBackPaths($location.path());
                platformStorage.setItem("openTitleCheckoutOnNavigation", true);
                if (card == undefined || card == null) {
                    // card == null indicates no cards
                    rbiCommonService.setSharedItem("isFirstCard", (card == null)? true:false);
                    $location.path('/account/creditCards/cardDetails/add');
                } else {
                    $location.path("/account/creditCards/cardDetails/modify/" + card.value.AccountNumber);
                }
            },
                popupObj_Meta[popupKey].button_1_click = function () {
                    if (!$scope.canMoveFocus) {
                        return;
                    }
                    $scope.canMoveFocus = false;
                    //helper.HidePopupBox($scope, $dialog);
                    //goToPreviousPath($scope, event.keyCode, $location);
                    helper.HidePopupBox();
                    $scope.abandonCheckout();
                },

                 helper.ShowPopupBox(popupKey, $scope);

        };

        function showRentBuy() {
            var currentIndex = rbiCommonService.getSharedItem(CURRENT_INDEX);


            $scope.titlesuccessLevel = new Array();
            $scope.titlesuccessLevel[0] = {
                currentIndex: 0,
                maxElement: 4
            };
            $scope.titlesuccessLevel[1] = {
                currentIndex: 1,
                maxElement: 2
            };
            $scope.currentSuccessLevel = 1;
            $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).focus();

            if (!isDefined($routeParams.titleSuccess)) {
                if (rbiCommonService.isSharedItemExist(IS_INSTANT_OPTION)) {
                    $scope.selectedInstantOption = rbiCommonService.getSharedItem(IS_INSTANT_OPTION);
                }
                else {
                    $scope.selectedInstantOption = instantOptionPopUpjsonObj.instantoption[currentIndex];
                }
            }
            $scope.$root.showCheckOut = "TITLE_CHECKOUT";
            $scope.titleCheckoutRentBuyCurrentCount = 0;
            $scope.titleCheckoutCurrentControlIndex = 2;
            $scope.titleCheckoutChangeCardCurrentCount = 0;
            $scope.showInstantOptionsPopUp = false;
            $scope.titleCheckoutSelectedOptionVisible = false;
            $scope.$root.titleCheckoutChangeCardVisible = false;
            $scope.$root.titleCheckoutSelectedOptionVisible = false;
            $scope.$root.showTitleConfirmCheckout = true;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
        }

        // Omniture start
        function isRent() {
            return ($scope.selectedInstantOption.PurchaseOptionType.indexOf("Rent") > -1);
        }

        var unbindOmniture = $scope.$watch("omnitureReady", function () {
            if ($scope.omnitureReady.indexOf(false) == -1) {
                $scope.omnitureCollectOnLoad();
                $scope.omnitureReady = [false];   // reset for a new page load
            }
        });
        $scope.omnitureCollectOnLoad = function () {
            Omniture.Clear();
            if (internetConnected) {
                var pageName, pageSuffix = '';
                if ($scope.checkoutSuccess) {
                    pageName = "tod thank you";
                }
                else {
                    pageName = "checkout";
                    if (isRent()) {
                        pageSuffix = "-rent";
                    }
                    else {
                        pageSuffix = "-buy";
                    }
                }

                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies";
                if ($scope.checkoutSuccess) {
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|" + pageName;
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|" + $scope.title.titleName + "|" + pageName + pageSuffix;
                }
                else {
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|" + $scope.title.titleName + "|" + pageName;
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|" + $scope.title.titleName + "|" + pageName + pageSuffix;
                }
                Omniture.Variables.prop3 = Omniture.pageName;
                Omniture.Variables.eVar54 = "+1";
                if (config.debug) {
                    helper.debugLog("omnitureOnLoad:");
                    helper.debugLog("pageName: " + Omniture.pageName);
                    helper.debugLog("prop1: " + Omniture.Variables.prop1);
                    helper.debugLog("prop2: " + Omniture.Variables.prop2);
                    helper.debugLog("prop3: " + Omniture.Variables.prop3);
                    helper.debugLog("eVar54: " + Omniture.Variables.eVar54);
                }
                Omniture.InvokeOmniture(Omniture.InvokeType.load);
            }
        };
        $scope.omnitureCollectConfirmCheckout = function () {
            Omniture.Clear();
            if (internetConnected) {
                //Omniture.Variables.eVar32 = Omniture.pageName     // not in Top40 list
                if (isRent()) {
                    Omniture.Variables.eVar42 = "+1";
                    Omniture.Variables.eVar51 = Omniture.pageName + "|content|rent now";
                    //Omniture.Variables.eVar52 = "vod";          // not in Top40 list
                    //Omniture.Variables.eVar60:[movie title]    // not in Top40 list
                }
                else {
                    // buy
                    Omniture.Variables.eVar37 = "+1";
                    Omniture.Variables.eVar51 = Omniture.pageName + "|content|buy now";
                    //Omniture.Variables.eVar52 = "buy" ;         // not in Top40 list
                    //Omniture.Variables.eVar62:[movie title]    // not in Top40 list
                }
                Omniture.Variables.events.push("sccheckout");
                Omniture.Variables.events.push("purchase");
                Omniture.Variables.events.push((isRent()) ? "event34" : "event35");
                Omniture.Variables.products = ";" + $scope.title.productId + ";1;" + $scope.selectedInstantOption.Price;

                // Not in Top 40
                //Omniture.Variables.zip=[zip code]
                //s.state=[state]
                if (config.debug) {
                    helper.debugLog("omnitureCollectConfirmCheckout:");
                    if (isRent())
                        helper.debugLog("eVar42: " + Omniture.Variables.eVar42);
                    else
                        helper.debugLog("eVar37: " + Omniture.Variables.eVar37);
                    var events = "events: ";
                    for (var i = 0; i < Omniture.Variables.events.length; i++) {
                        events += Omniture.Variables.events[i] + " ";
                    }
                    helper.debugLog(events);
                    helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                    helper.debugLog("products: " + Omniture.Variables.products);
                }
                Omniture.InvokeOmniture(Omniture.InvokeType.click);
            }
        };
        $scope.omnitureCollectOnClick = function (actionType) {
            Omniture.Clear();
            if (internetConnected) {
                //Link Name:[pagename]|content|browsing
                Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + actionType;
                if (config.debug) {
                    helper.debugLog("omnitureCollectOnClick:");
                    helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                }
                Omniture.InvokeOmniture(Omniture.InvokeType.click);
            }
        };
        $scope.omnitureCollectOnTitleDetail = function (item) {
            Omniture.Clear();
            if (internetConnected) {
                var thumbnailPosition = $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex + 1;
                Omniture.Variables.eVar51 = Omniture.pageName + "|displayed:rw01|c0" + thumbnailPosition + "|p00" + thumbnailPosition + "|" + item.title;
                if (config.debug) {
                    helper.debugLog("omnitureCollectOnTitleDetail:");
                    helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                }
                Omniture.InvokeOmniture(Omniture.InvokeType.click);
            }
        };

        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
        // Omniture end
    });
