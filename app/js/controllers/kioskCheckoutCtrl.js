'use strict';
/**
 * Checkout controller to manage kisok checkout
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */
rbi.controller('kioskCheckoutCtrl',
    function ($scope, $location, $routeParams, rbiCommonService, reservationService, customerService,productService) {
        //Omniture
        Omniture.pageName = "";


        $scope.trackOmniture = [];
        $scope.omnitureReady = [false];
        if (!isDefined($routeParams.kioskSuccess)) {
            $scope.trackOmniture[0] = "page load";
            $scope.omnitureReady[0] = true;
        }
        var unbindOmniture=$scope.$watch("omnitureReady", function () {
            if ($scope.omnitureReady.indexOf(false) <= -1) {
                Omniture.Clear();
                if (internetConnected) {
                    if ($scope.trackOmniture[0] == "page load") {
                        Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc|checkout";
                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart";
                        Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc";
                        Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc|checkout";
                        Omniture.Variables.prop23 = Omniture.previousPageName;
                        Omniture.Variables.eVar54 = "+1";
                        Omniture.Variables.events = ["event56", "event57", "scview"];
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    }
                    else if ($scope.trackOmniture[0] == "checkout success") {
                        Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc|thank you";
                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart";
                        Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc";
                        Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc|thank you";
                        Omniture.Variables.prop23 = RBI.PlatformConfig.OmnitureTargetDevice + "|cart|ondisc|checkout";
                        Omniture.Variables.eVar54 = "+1";
                        Omniture.Variables.events = ["event55"];
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    }
                    else if ($scope.trackOmniture[0] == "reserve title") {
                        Omniture.Variables.eVar40 = "+1";

                        Omniture.Variables.eVar58 = $scope.movieTitles;
                        Omniture.Variables.events = ["sccheckout", "purchase"]
                        Omniture.Variables.products = $scope.productIds + ";" + $scope.totalTitles + ";" + $scope.grandTotal;
                        // ZOE-30755: we need to set the previous page name when transitioning to the checkout success page b/c the route change in RBIKeyEventDirective is not called
                        Omniture.previousPageName = Omniture.pageName;
                        Omniture.Variables.eVar51 = Omniture.pageName + "|content|reserve now";
                        helper.debugLog("events: " + helper.convertArrayToString(Omniture.Variables.events));
                        helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    else if ($scope.trackOmniture[0] == "remove title") {
                        Omniture.Variables.products = $scope.removedProduct;
                        Omniture.Variables.events = ["scremove"];
                        Omniture.Variables.eVar51 = Omniture.pageName + "|content|remove title";
                        helper.debugLog("events: " + helper.convertArrayToString(Omniture.Variables.events));
                        helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    else if ($scope.trackOmniture[0] == "add title") {
                        Omniture.Variables.eVar51 = Omniture.pageName + "|content|add title";
                        helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    else if ($scope.trackOmniture[0] == "change card") {
                        Omniture.Variables.eVar51 = Omniture.pageName + "|content|change card";
                        helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                }
                $scope.omnitureReady[0] = false;
            }
        }, true);
        //Omniture
        popCheckoutBackEntry();
        $scope.canMoveFocus = false;
        $scope.checkName = false;
        $scope.successCartItems = [];
        $scope.canAddCards = true;
        var eventHandler = new kioskCheckoutventHandler($scope, $location, $routeParams,rbiCommonService);
        $scope.eventHandler = eventHandler;
        sharedScopeWithMenu($scope, $location);

        if (rbiCommonService.isSharedItemExist(CART_LIST) && isDefined($routeParams.kioskSuccess)) {
            $scope.successCartItems = rbiCommonService.getSharedItem(CART_LIST);
            $scope.emptyCartItemsRange = new Array(5 - $scope.successCartItems.length);
        }

        if (isDefined($routeParams.kioskSuccess)) {
            var eventHandler = new kioskCheckoutSuccessEventHandler($scope, $location, $routeParams);
            $scope.eventHandler = eventHandler;

            $scope.lastFour = rbiCommonService.getSharedItem(ACCOUNT_USED_FOR_CHECKOUT).getLastFour();
            $scope.accountAlias = rbiCommonService.getSharedItem(ACCOUNT_USED_FOR_CHECKOUT).getAccountAlias();
        }

        platformStorage.setItem("checkouttype", "kioskCheckout");
        $scope.emptyCartItemsRange = new Array(5);
        $scope.$root.isUseCreditChecked = true;
        $scope.$root.showUseCreditChecked = false;
        $scope.$root.isOver18Checked;
        $scope.totalCreditsUsed = 0;
        $scope.totalAvailableCredits = 0;
        $scope.$root.showOver18Checkbox = false;
        $scope.showkioskAbandonCheckout = false;
        $scope.kioskName = "";
        $scope.kioskAddressLine1 = "";
        $scope.kioskAddressLine2 = "";
        $scope.creditmessage = "You have 0 credits available";
        $scope.saveAvailableCredits = 0;
        $scope.isAddTitleButtonEnabled = true;
        $scope.changeCardTop = 0;
        $scope.changeCardOffset = 60;
        $scope.RedboxGiftCard= false;


        function checkIfNavigatedFromAccount () {
            try {
                //To open Kiosk checkout popup on navigation
                if (isDefined(platformStorage.getItem("openKioskCheckoutOnNavigation")) == true) {
                    if (isDefined($scope.cards) && $scope.cards.length > 0) {
                        rbiCommonService.setSharedItem(NAVIGATED_FROM_ADD_CARD, true);
                    }
                    platformStorage.removeItem("openKioskCheckoutOnNavigation");
                    helper.removeTitleDetailState($scope);
                }
                else if (isDefined(platformStorage.getItem("openTitleCheckoutOnNavigation")) == true) {
                    if (isDefined($scope.cards) && $scope.cards.length > 0) {
                        rbiCommonService.setSharedItem(NAVIGATED_FROM_ADD_CARD, true);
                    }
                    platformStorage.removeItem("openTitleCheckoutOnNavigation");
                    helper.removeTitleDetailState($scope);
                }
            }
            catch (object) {
                helper.debugLog(object);
            }
        };

        function init () {
            popCheckoutBackEntry();
            if (rbiCommonService.getSharedItem(CARD_OPERATION) != null) {
                $scope.getCards(function () {
                    setInitialKioskVariables();
                    setTitleDetailValues();
                    $scope.selectedCardAccount = $scope.cards[$scope.cards.map(function (elm) {
                        return elm.value.AccountNumber
                    }).indexOf(rbiCommonService.getSharedItem(OPERATED_ACCOUNT_NUMBER))];
                    if (checkLogin($location)) {
                        $scope.addTitleToCart();
                    }
                })
            } else {
                setInitialKioskVariables();
                setTitleDetailValues();

                if (checkLogin($location)) {
                    $scope.getCards();
                    $scope.addTitleToCart();
                }
                setKioskDetails();
            }

        };


        function fillKioskData() {
            $scope.cartPricing = $scope.parentobj.cart.getPricing();
            $scope.cartItems = $scope.parentobj.cart.getItems();
            if ($scope.cartItems != undefined) {
                $scope.emptyCartItemsRange = new Array(5 - $scope.cartItems.length);
            }
            if (isDefined($routeParams.kioskSuccess)) {
                $scope.emptyCartItemsRange = new Array(5 - $scope.successCartItems.length);
            }
            $scope.totalCreditsUsed = $scope.parentobj.cart.getPricing() != null ? $scope.parentobj.cart.getPricing().totalCreditsUsedCount : $scope.totalCreditsUsed;
			verifyOver18Check();
            recalculate();
            $scope.isReserveInable();
        }

        function handleError(data, $scope) {
            $scope.$root.showCheckOut = "";
            $scope.showKioskConfirmCheckout = false;
            $scope.$root.showKioskSuccessCheckout = false;
            helper.showErrorMessage(data, $scope);
            popCheckoutBackEntry();
            $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
        }

		function verifyOver18Check(){
			var rRatingFlag = $scope.parentobj.cart.hasProductsWithRating('R');
			var m17RatingFlag = $scope.parentobj.cart.hasProductsWithRating('M (17+)');

			if(rRatingFlag || m17RatingFlag){
				$scope.$root.showOver18Checkbox = true;
				if(rRatingFlag && m17RatingFlag){
					$scope.$root.over18CheckboxMessage = "I'm over 18 so I can rent R-rated movies and M (17+) games";
				}else if(rRatingFlag){
					$scope.$root.over18CheckboxMessage = "I'm over 18 so I can rent R-rated movies";
				}else{
					$scope.$root.over18CheckboxMessage = "I'm over 18 so I can rent M (17+) games";
				}
			}else{
				$scope.$root.showOver18Checkbox = false;
			}
		}



        $scope.addTitleToCart = function () {
            $scope.canMoveFocus = false;
            if ($scope.parentobj.cart == undefined) {
                $scope.parentobj.cart = new RBI.Cart();
            }

            $scope.parentobj.cart.kioskId = helper.GetCurrentKiosk(SELECTED_KOISK_KEY).KioskID;
            $scope.parentobj.cart.applyCredits = $scope.$root.isUseCreditChecked;

            var reservationService = new RBI.ReservationService();
            reservationService.init(new RBI.ReservationServiceProxyConfig());
            var productService = new RBI.ProductService();
            productService.init(new RBI.ProductServiceConfig());
            var params = [];
            var productDetailsRequest = new RBI.ProductDetailsRequest($scope.title.productId);

            productService.getProductDetails(productDetailsRequest, function (product) {
                // success

                params = [product.getTitle(), 'has', 'it', 'it', 'Movie Or Game', 'Movie Or Game']
                $scope.parentobj.cart.setApplyCredits($scope.$root.isUseCreditChecked);
                if (!isDefined($routeParams.kioskSuccess)) {
                    var purchaseOptionID = "";
                    if (!helper.isDefined($scope.selectedKioskPurchaseOption)) {
                        purchaseOptionID = $scope.title.purchaseOptionId;
                    }
                    else {
                        purchaseOptionID = $scope.selectedKioskPurchaseOption.PurchaseOptionID;
                    }
                    $scope.parentobj.cart.addProduct(product, purchaseOptionID, function () {
                        $scope.canMoveFocus = true;
                        $scope.cartPricing = $scope.parentobj.cart.getPricing();
                        $scope.cartItems = $scope.parentobj.cart.getItems();
                        $scope.grandTotal = $scope.cartPricing.getGrandTotal();
                        $scope.totalTitles = $scope.cartItems.length;
                        $scope.productIds ="";
                        $scope.movieTitles = "";
                        for(var i = 0;i< $scope.totalTitles; i++) {
                           $scope.productIds = $scope.productIds + ";" + $scope.cartItems[i].productId;
                           $scope.movieTitles = $scope.movieTitles + $scope.cartItems[i].product.value.Title;
                           if(i < $scope.totalTitles - 1) {
                               $scope.movieTitles += ",";
                           }
                        }

                        $scope.getCreditBalance();
                        if ($scope.cartItems != undefined) {
                            $scope.emptyCartItemsRange = new Array(5 - $scope.cartItems.length);
                        }
                        if (isDefined($routeParams.kioskSuccess)) {
                            $scope.emptyCartItemsRange = new Array(5 - $scope.successCartItems.length);
                        }
                        $scope.totalCreditsUsed = $scope.parentobj.cart.getPricing() != null ? $scope.parentobj.cart.getPricing().totalCreditsUsedCount : $scope.totalCreditsUsed;
                        verifyOver18Check();
                        $scope.isReserveInable();
                        if ($scope.cartItems.length >= 5) {
                            $scope.isAddTitleButtonEnabled = false;
                        }
                        else {
                            $scope.isAddTitleButtonEnabled = true;
                        }
                        helper.debugLog($scope.isAddTitleButtonEnabled);
                    }, function (data) {
                        $scope.canMoveFocus = true;
                        //Todo: Check for error code for already existing cartitem in cart instead of message.
                        if (data.value != undefined && data.value.ResultMessage != undefined && data.value.ResultMessage == "Media already exists in the Cart" && $scope.parentobj.cart != undefined) {
                            //$scope.$root.showCheckOut = "KIOSK_CHECKOUT";
                            $scope.cartPricing = $scope.parentobj.cart.getPricing();
                            $scope.cartItems = $scope.parentobj.cart.getItems();
                            if ($scope.cartItems != undefined) {
                                $scope.emptyCartItemsRange = new Array(5 - $scope.cartItems.length);
                            }
                            if (isDefined($routeParams.kioskSuccess)) {
                                $scope.emptyCartItemsRange = new Array(5 - $scope.successCartItems.length);
                            }
                            $scope.totalCreditsUsed = $scope.parentobj.cart.getPricing() != null ? $scope.parentobj.cart.getPricing().totalCreditsUsedCount : $scope.totalCreditsUsed;
							verifyOver18Check();
                            recalculate();
                            $scope.isReserveInable();
                        } else {
                            $scope.$root.showCheckOut = "";
                            $scope.showKioskConfirmCheckout = false;
                            $scope.$root.showKioskSuccessCheckout = false;
                            $scope.totalCreditsUsed = 0;
                            $scope.totalAvailableCredits = 0;
                            $scope.cartItems = $scope.parentobj.cart.getItems();
                            if ($scope.cartItems.length > 0) {
                                rbiCommonService.setSharedItem(TITLE_DETAIL, $scope.cartItems[$scope.cartItems.length - 1]);
                                $scope.selectedKioskPurchaseOption = undefined;
                                rbiCommonService.setSharedItem(SELECTED_KIOSK_OPTION, $scope.selectedKioskPurchaseOption);
                            }
                            helper.debugLog("add product failed for Kiosk");

                            processErrorDescription(data);

                            if(helper.isDefined(data.value.Description)){
                                helper.showErrorMessage(data, $scope, null, true);
                            }else{
                                helper.showErrorMessage(data, $scope, params);
                            }
                            popCheckoutBackEntry();
                            $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
                        }
                    });
                }
                else {
                    $scope.canMoveFocus = true;
                    $scope.getCreditBalance();
                    $scope.cartPricing = $scope.parentobj.cart.getPricing();
                    $scope.cartItems = $scope.parentobj.cart.getItems();
                    if ($scope.cartItems != undefined) {
                        $scope.emptyCartItemsRange = new Array(5 - $scope.cartItems.length);
                    }
                    if (isDefined($routeParams.kioskSuccess)) {
                        $scope.emptyCartItemsRange = new Array(5 - $scope.successCartItems.length);
                    }
                    $scope.totalCreditsUsed = $scope.parentobj.cart.getPricing() != null ? $scope.parentobj.cart.getPricing().totalCreditsUsedCount : $scope.totalCreditsUsed;
					verifyOver18Check();
                }
            }, function (data) {
                $scope.canMoveFocus = true;
                $scope.$root.showCheckOut = "";
                $scope.showKioskConfirmCheckout = false;
                $scope.$root.showKioskSuccessCheckout = false;
                helper.showErrorMessage(data, $scope, params);
                popCheckoutBackEntry();
                $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
                helper.debugLog("get product detail failed for Kiosk");
            });
        };
        $scope.addTitle = function () {
            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
            }
            var kioskId = "";
            if (helper.isDefined($scope.title.kioskId)) {
                kioskId = $scope.title.kioskId;
            }
            else {
                kioskId = helper.GetCurrentKiosk(SELECTED_KOISK_KEY).KioskID;
            }
            
           if (helper.isDefined($scope.productType)) {
                $location.path("/browse/" + $scope.productType + "/" + kioskId);
            }else {
                var isMovie = false;
                var params = [];
                params.productId = $scope.title.productId;
                params.kioskId = kioskId;
                productService.GetProductDetailByProductID(params,
                function (data) {
                    if (data.type == "Movie") {
                        isMovie = true;
                    } else {
                        isMovie = false;
                    }

                    $location.path("/browse/" + (isMovie == true ? "Movie" : "Game") + "/" + kioskId);
                }, function (data) {
                    helper.debugLog("Failed to get titleDetail");
                    $location.path("/browse/" +"Movie" + "/" + kioskId);  //By Default we assume movie
                });
            }
            $scope.trackOmniture[0] = "add title";
            $scope.omnitureReady[0] = true;
            
        };
        $scope.setSelectedCardAccount = function (card) {
        	if (card == REDBOX_GIFT) {
        	    $scope.RedboxGiftCard = true;
        	    return;
        	}
        	if (isDefined(card)) {
        	    if (POP_ALERT_BOX_VISIBLE){
        	        rbiCommonService.removeSharedItem(IS_CARD);
        	    }
        	    if (rbiCommonService.isSharedItemExist(IS_CARD)) {
        	        $scope.selectedCardAccount = rbiCommonService.getSharedItem(IS_CARD);
        	    } else {
        	        $scope.selectedCardAccount = card;
        	    }
        	    if (!POP_ALERT_BOX_VISIBLE){
        	        rbiCommonService.setSharedItem(IS_CARD, $scope.selectedCardAccount);
        	    }
        	    if ($scope.selectedCardAccount.value.AccountAlias != null) {
        	        $scope.checkName = true;
        	    } else {
        	        $scope.checkName = false;
        	    }
        	    $scope.CheckCardValidity($scope.selectedCardAccount, function () {
        	        rbiCommonService.setSharedItem(SELECTED_ACCOUNT, $scope.selectedCardAccount);
        	    });
        	}
            else {
                $scope.selectedCardAccount = null;
                $scope.checkName = false;
            }

        };
        $scope.removeTitle = function (kioskCart) {
            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                //$scope.setSelectedCardAccount($scope.cards[$scope.cards.length - 1]);
                rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
            }
            $scope.parentobj.cart.removeByPurchaseOptionId(kioskCart.purchaseOptionId, function () {
                $scope.removedProduct = kioskCart.productId;
                $scope.movieTitles = "";
                $scope.productIds = "";
                $scope.totalTitles = $scope.cartItems.length;
                for(var i = 0;i< $scope.totalTitles; i++) {
                    $scope.productIds = $scope.productIds + ";" + $scope.cartItems[i].productId;
                    $scope.movieTitles = ($scope.movieTitles + $scope.cartItems[i].product.value.Title);
                    if(i < $scope.totalTitles - 1) {
                        $scope.movieTitles += ",";
                    }
                }
                fillCart();

                // Omniture
                $scope.trackOmniture[0] = "remove title";
                $scope.omnitureReady[0] = true;

                if ($scope.cartItems.length >= 5) {
                    $scope.isAddTitleButtonEnabled = false;
                }
                else {
                    $scope.isAddTitleButtonEnabled = true;
                }

                helper.debugLog($scope.isAddTitleButtonEnabled);
                if ($scope.cartItems.length > 0) {
                    rbiCommonService.setSharedItem(TITLE_DETAIL, $scope.cartItems[$scope.cartItems.length - 1]);
                    $scope.selectedKioskPurchaseOption = undefined;
                    rbiCommonService.setSharedItem(SELECTED_KIOSK_OPTION, $scope.selectedKioskPurchaseOption);
                }
                recalculate();
            }, function (data) {
                handleError(data, $scope);
                helper.debugLog("Remove title fails");
            }, false);
        };
        $scope.userCreditClicked = function () {
            $scope.$root.isUseCreditChecked = !$scope.$root.isUseCreditChecked;
            recalculate();
        };

        function fillCart() {
            $scope.cartItems = $scope.parentobj.cart.getItems();
            if ($scope.cartItems != undefined) {
                $scope.emptyCartItemsRange = new Array(5 - $scope.cartItems.length);
                if (isDefined($routeParams.kioskSuccess)) {
                    $scope.emptyCartItemsRange = new Array(5 - $scope.successCartItems.length);
                }
                if ($scope.cartItems.length == 0 || $scope.cartItems == undefined) {
                    $scope.showKioskConfirmCheckout = false;
                    $scope.$root.showKioskSuccessCheckout = false;
                    $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
                }
            }
        }


        function processErrorDescription(data) {
        	if(helper.isDefined(data.getDescription()))return;
        	
            if (data.getResultCode()=== "RBXAPI-RES-026" || data.getResultCode() === "RBXAPI-RES-026 RBXAPI-RES-000") {
                var description = hashObj[data.getResultCode()].app_error_message;
                var message = data.getResultMessage();

                var regExp = 'productRef=[';
                var mediaIdsStartIndex = message.substr(message.indexOf(regExp) + regExp.length);
                var mediaIdsEndIndex = mediaIdsStartIndex.indexOf(']');
                var mediaIdsString = mediaIdsStartIndex.substr(0, mediaIdsEndIndex);
                var mediaIds = mediaIdsString ? mediaIdsString.split(',') : [];
                var i, itemNames = [], hasMovie = false, hasGame = false;

                for (i in mediaIds) {
                    mediaIds[i] = mediaIds[i].trim();
                }

                var cart = new RBI.Cart();
                var cartItems = cart.getItems();
                if (cartItems && cartItems.length) {
                    for (i in cartItems) {
                        var cartItem = cartItems[i];
                        if (mediaIds.indexOf(cartItem.getPurchaseOptionId()) > -1) {
                            var product = cartItem.getProduct();
                            itemNames.push('"' + product.getTitle() + '"');

                            var productType = product.getProductType();

                            if (productType === RBI.Product.Defines.TYPE_GAME) {
                                hasGame = true;
                            } else if (productType === RBI.Product.Defines.TYPE_MOVIE) {
                                hasMovie = true;
                            } else {
                                throw "Unsupported product type in the cart: " + productType;
                            }
                        }
                    }
                }

                description = description.replace('[ItemNames]', itemNames.join(', ')); //Need space between each items
                description = description.replace(/\[HasOrHave\]/g, itemNames.length > 1 ? 'have' : 'has');
                description = description.replace(/\[ItOrThem\]/g, itemNames.length > 1 ? 'them' : 'it');
                description = description.replace(/\[MovieOrGame\]/g, (hasMovie && hasGame) ? 'Movie/Game' : hasMovie ? 'movie' : hasGame ? 'game' : '');

                data.setDescription(description);


            }
        }

        function recalculate() {
            $scope.canMoveFocus = false;
            $scope.parentobj.cart.setApplyCredits($scope.$root.isUseCreditChecked);
            $scope.parentobj.cart.recalculatePrice(function (data) {
                $scope.canMoveFocus = true;
                $scope.cartPricing = data;
                $scope.totalCreditsUsed = data.totalCreditsUsedCount;
                verifyOver18Check();
                $scope.getCreditBalance();
            }, function (data) {
                $scope.canMoveFocus = true;
                handleError(data, $scope);
                helper.debugLog("Recalculate failed for Kiosk");
            });
        }

        $scope.saveAvailableCredits = rbiCommonService.getSharedItem(AVAILABLE_CREDIT);

        $scope.reserveTitles = function () {
            $scope.trackOmniture[0] = "reserve title";
            $scope.omnitureReady[0] = true;
            if ($scope.$root.isOver18Checked) {
                $scope.canMoveFocus = false;
                if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                    //$scope.setSelectedCardAccount($scope.cards[$scope.cards.length - 1]);
                    rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
                }
                rbiCommonService.removeSharedItem(SELECTED_ACCOUNT);
                rbiCommonService.removeSharedItem(IS_CARD);
                $scope.CheckCardValidity($scope.selectedCardAccount, function () {
                    if (helper.isDefined($scope.cartItems) && $scope.cartItems.length > 0) {

                        $scope.saveAvailableCredits = $scope.totalAvailableCredits - $scope.totalCreditsUsed;
                        rbiCommonService.setSharedItem(AVAILABLE_CREDIT, $scope.saveAvailableCredits);
                        var cartItems = new RBI.Cart().getItems();
                        $scope.successCartItems = [];
                        for (var j = 0; j < cartItems.length; j++) {
                            var temp = { image: null, price: null, extraPrice: null, format: null };
                            temp.image = cartItems[j].image;
                            temp.price = cartItems[j].getPricing().getPrice();
                            temp.extraPrice = cartItems[j].getPricing().getExtraPrice();
                            temp.format = cartItems[j].getFormat();


                            $scope.successCartItems.push(temp);
                        }

                        rbiCommonService.setSharedItem(CART_LIST, $scope.successCartItems);
                        $scope.parentobj.cart.performReservation($scope.selectedCardAccount.getAccountNumber(),
                            function (data) {
                                $scope.canMoveFocus = true;
                                platformStorage.removeItem("checkouttype");
                                helper.removeTitleDetailState($scope);
                                $scope.trackOmniture[0] = "checkout success";
                                $scope.omnitureReady[0] = true;
                                $scope.goToSuccessPage();
                            }, function (data) {
                                $scope.canMoveFocus = true;

                                processErrorDescription(data);
                                if(helper.isDefined(data.value.Description)){
                                    helper.showErrorMessage(data, $scope, null, true);
                                }else{
                                    helper.showErrorMessage(data, $scope);
                                }

                                popCheckoutBackEntry();
                                //                            handleError(data, $scope);
                                helper.debugLog("Error occurred with performOnDemandPurchase.");
                            }
                        );

                    } else {
                        $scope.canMoveFocus = true;
                        handleError(data, $scope);
                    }
                }, function (data) {
                    $scope.canMoveFocus = true;
                    helper.showErrorMessage(data, $scope, params);
                    popCheckoutBackEntry();
                });
            }
        };

        $scope.goToSuccessPage = function () {
            $scope.canMoveFocus = true;
            $scope.showKioskConfirmCheckout = false;
            $scope.$root.showKioskSuccessCheckout = true;
            rbiCommonService.setSharedItem(ACCOUNT_USED_FOR_CHECKOUT, $scope.selectedCardAccount);
            $location.path("/kioskCheckoutSuccess/kioskSuccess");

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
            // Need to remove already existing card from local storage since after adding a new card the old card persists when
            // a new card is selected as primary
            if (rbiCommonService.isSharedItemExist(IS_CARD)) {
                rbiCommonService.removeSharedItem(IS_CARD);
            }
            $scope.showKioskConfirmCheckout = false;
            helper.setTitleDetailState(
                $scope, $scope.title.productId,
                $scope.selectedKioskPurchaseOption,
                $scope.selectedCardAccount,
                "KIOSK_CHECKOUT");
            addToBackPaths($location.path());

            platformStorage.setItem("openKioskCheckoutOnNavigation", true);
            if (!isDefined($scope.cards) || $scope.cards.length == 0) {
                rbiCommonService.setSharedItem("isFirstCard", true);
                $location.path('/account/creditCards/cardDetails/add');
            }
            else {
                rbiCommonService.setSharedItem("isFirstCard", false);
                $location.path('/account/creditCards/cardDetails/add');
            }
        };
        $scope.getCreditBalance = function () {
            var emptyRequest = new RBI.GetCustomerSimpleRequest();
            customerService.getCustomerService().getCreditBalance(emptyRequest,
                function (data) {
                    helper.debugLog(data, "Available credit balance = " + data.length);
                    $scope.totalAvailableCredits = data.getTotalCredits();

                    if ($scope.totalAvailableCredits > 0) {
                        var isAllGame = true;
                        var countDVDCredits = 0;
                        var countBlurayCredit = 0;
                        var countBlurayInCart = 0;
                        var countDVDInCart = 0;

                        for (var i = 0; i < $scope.cartItems.length; i++) {
                            if ($scope.cartItems[i].product.type == "Movie") {
                                isAllGame = false;
                                break;
                            }
                        }

                        for (var i = 0; i < data.credits.length; i++) {
//                			if (data.credits[i].value.code == "DIGITAL-MOVIE1-4" || data.credits[i].value.code == "ALPHA-TRIAL" || data.credits[i].value.code == "CSC" || data.credits[i].value.code == "MARKETING-TEST" || data.credits[i].value.code == "DIGITAL-ALPHA" || data.credits[i].value.code == "DIGITAL-BETA" || data.credits[i].value.code == "LegacyLoyaltyCredit" || data.credits[i].value.code == "DSC" || data.credits[i].value.code == "DIGITALBETA-DVD1-4" || data.credits[i].value.code == "DIGITALBETA-MOVIE1-4" || data.credits[i].value.code == "LOYALTY CREDIT-PUNCHCARD") {
//                				countBlurayCredit++;
//                			}
//                			if (data.credits[i].value.code == "DIGITAL-DVD1-4" || data.credits[i].value.code == "WEB-R1G1" || data.credits[i].value.code == "WEB-RAF") {
//                				countDVDCredits++;
//                			}
                            if (data.credits[i].value.CreditType.indexOf("DVD Rental") >= 0 || (data.credits[i].value.CreditType.indexOf("DVD") >= 0 && data.credits[i].value.CreditType.indexOf("New Account") >= 0) || (data.credits[i].value.CreditType.indexOf("DVD") >= 0 && data.credits[i].value.CreditType.indexOf("Refer A Friend") >= 0)) {
                                countDVDCredits++;
                            } else if (data.credits[i].value.CreditType.indexOf("Blu-ray") >= 0 || data.credits[i].value.CreditType.indexOf("Monthly Anniversary") >= 0 || data.credits[i].value.CreditType.indexOf("Legacy Loyality Credit Placeholder") >= 0 || data.credits[i].value.CreditType.indexOf("Alpha Trial") >= 0 || data.credits[i].value.CreditType.indexOf("RB Internal Marketing (Beta) Trial") >= 0) {
                                countBlurayCredit++;
                            }
                        }

                        for (i = 0; i < $scope.cartItems.length; i++) {
                            if ($scope.cartItems[i].format == "Blu-Ray" && $scope.cartItems[i].product.type == "Movie") {
                                countBlurayInCart++;
                            }
                            if ($scope.cartItems[i].format == "DVD" && $scope.cartItems[i].product.type == "Movie") {
                                countDVDInCart++;
                            }
                        }

                        if (isAllGame == false) {
                            if (countDVDInCart > 0 || countBlurayCredit > 0) {
                                $scope.$root.showUseCreditChecked = true;
                            } else {
                                $scope.$root.showUseCreditChecked = false;
                                $scope.creditmessage = "Cannot be used for Blu-ray";
                            }
                        } else {
                            $scope.$root.showUseCreditChecked = false;
                            $scope.creditmessage = "Cannot be used for Games";
                        }
                    }
                },
                function (data) {
                    $scope.totalAvailableCredits = 0;
                    handleError(data, $scope);
                    helper.debugLog("getCreditBalance Fail - " + data);
                });
        };

        $scope.abandonCheckout = function () {
            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                //$scope.setSelectedCardAccount($scope.cards[$scope.cards.length - 1]);
                rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
            }
            $scope.$root.isOver18Checked = false;
            rbiCommonService.removeSharedItem(SELECTED_ACCOUNT);
            platformStorage.removeItem("openKioskCheckoutOnNavigation");
            platformStorage.removeItem("openTitleCheckoutOnNavigation");
            platformStorage.removeItem("checkouttype");
            helper.removeTitleDetailState($scope);
            $scope.parentobj.cart.clear();
            rbiCommonService.removeSharedItem(CART_LIST);
            $location.path(rbiCommonService.getSharedItem(TITLE_DETAIL_PATH));
        };
        $scope.onSuccessOk = function () {
            $scope.$root.showKioskSuccessCheckout = false;
            $scope.parentobj.cart.clear();
            rbiCommonService.removeSharedItem(CART_LIST);
            var CurrKiosk = helper.GetCurrentKiosk(SELECTED_KOISK_KEY);
            helper.clearLocalStorage("browseFilter");
            helper.clearLocalStorage("browseFilterForKiosk"); //Clear browse filter for kiosk on successful checkout
            $location.path('/browse/Movie/');//[ CurrKiosk.KioskID REmoved ZOE-28307]
        };
        $scope.isReserveInable = function () {
			$('.button-divHighlight').removeClass('button-divHighlight');
            if ($scope.$root.showOver18Checkbox) {
                $scope.$root.kioskCheckOutCurrentIndex = 0;
                $scope.$root.kioskCheckOutLevelIndex = 0;
				$("#kioskcheckout_0_0").addClass("overcheck");
               // $("kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();
				if($("#kioskcheckout_0_0").is(':checked')){
					$("#kioskcheckout_0_0").addClass("overcheck");
					$("#kioskcheckout_0_0").removeClass("modify-checkbox-red-highlight");

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
				}
				else{
					$("#kioskcheckout_0_0").removeClass("overcheck");
				}
            } else {
                $scope.$root.isOver18Checked = true;
                $scope.$root.kioskCheckOutCurrentIndex = 4;
                $scope.$root.kioskCheckOutLevelIndex = 1;
                //$("kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).focus();
                $("#kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex).addClass("button-divHighlight");
            }
        };

        $scope.scrollTitle = function (isSelected, title) {
            var scroll = false;
            if (isSelected) {

                if (title.length > MAX_TITLE_LENGTH_CHECKOUT) {
                    scroll = true;
                }
            }
            return scroll;
        };

        $scope.getCards = function (successCallback) {
            customerService.getCards(rbiCommonService,
                function (data) {
                    $scope.cards = data;
                    if ($scope.cards.length > 0) {
                        try {
                            // Always pick the preferred card
                            $scope.setSelectedCardAccount(customerService.getPreferredCard(data));

                            // The logic below is not needed - PR
                           /* if (rbiCommonService.isSharedItemExist(SELECTED_ACCOUNT) && (!rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD))) {
                                $scope.setSelectedCardAccount(rbiCommonService.getSharedItem(SELECTED_ACCOUNT));
                            }

                            if (rbiCommonService.isSharedItemExist(NAVIGATED_FROM_ADD_CARD)) {
                                $scope.setSelectedCardAccount($scope.cards[$scope.cards.length - 1]);
                                //rbiCommonService.removeSharedItem(NAVIGATED_FROM_ADD_CARD);
                            }

                            if ($scope.selectedCardAccount != null) {
                                $scope.CheckCardValidity($scope.selectedCardAccount, function () {
                                });
                            }   */

                            checkIfNavigatedFromAccount();
                            canAddMoreCards();
                        }
                        catch (object) {
                        }
                    }
                    else {
                        $scope.canAddCards = true;
                        $scope.selectedCardAccount = null;
                        checkIfNavigatedFromAccount();
                    }
                    if (isDefined(successCallback)) {
                        successCallback();
                    }
                },
                function (data) {
                    helper.debugLog("Error occureed with getCards.");
                });
        };

        function canAddMoreCards() {
            if ($scope.cards.length >= 10) {
                $scope.canAddCards = false;
            }
            else {
                $scope.canAddCards = true;
            }
        }

        $scope.CheckCardValidity = function (card, successCallback) {
            if (!helper.isValidCheckoutCard(card)) {
                $scope.canMoveFocus = true;
                ShowInvalidCardPopup(card);
            } else {
                if (card.value.AccountAlias != null) {
                    $scope.checkName = true;
                }
                else {
                    $scope.checkName = false;
                }
                if (successCallback != undefined)
                    successCallback();
            }
        };

        init();

        function setTitleDetailValues() {
            $scope.selectedKioskPurchaseOption = rbiCommonService.getSharedItem(SELECTED_KIOSK_OPTION);
            $scope.aTkioskPopUpjsonObj = rbiCommonService.getSharedItem(KIOSK_OPTIONS);
            //$scope.selectedCardAccount = rbiCommonService.getSharedItem(SELECTED_ACCOUNT);
            $scope.titleCheckoutCurrentControlIndex = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
            $scope.titleCheckoutRentBuyCurrentCount = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
            $scope.titleCheckoutChangeCardCurrentCount = rbiCommonService.getSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX);
            $scope.title = rbiCommonService.getSharedItem(TITLE_DETAIL);
            $scope.productType = getProductType();
            $scope.RecommendedProductsResponse = rbiCommonService.getSharedItem(MORE_LIKE_THIS);
            if (helper.isDefined($routeParams.productID)) {
                $scope.title.productId = $routeParams.productID;
            }
            if (helper.isDefined($routeParams.kioskID)) {
                $scope.title.kioskId = $routeParams.kioskID;
            }

        }

        function setInitialKioskVariables() {
            $scope.showAtKioskOptionsPopUp = false;
            $scope.showKioskConfirmCheckout = true;
            // $scope.$root.kioskCheckOutLevelIndex = 0;
            //$scope.$root.kioskCheckOutCurrentIndex = 0;
            // $scope.kioskCheckoutCurrentElement = "kioskcheckout_" + $scope.$root.kioskCheckOutLevelIndex + "_" + $scope.$root.kioskCheckOutCurrentIndex;
            $("#" + $scope.kioskCheckoutCurrentElement).focus();
            $scope.showInstantOptionsPopUp = false;
            $scope.$root.kioskAddTitlePopupVisible = false;
            $scope.$root.kioskChangeCardPopupVisible = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
        }

        function setKioskDetails() {
            var CurrKiosk = helper.GetCurrentKiosk(SELECTED_KOISK_KEY);

            //populate display name as suggested in requirements
            $scope.kioskName = CurrKiosk.Displayname;

            $scope.kioskAddressLine1 = isDefined(CurrKiosk.Address1) ? CurrKiosk.Address1 : "";
            if ($scope.kioskAddressLine1 == "") {
                $scope.kioskAddressLine1 = isDefined(CurrKiosk.City) ? (isDefined(CurrKiosk.State) ? CurrKiosk.City + ", " + CurrKiosk.State : CurrKiosk.City) : CurrKiosk.State;
            } else {
                $scope.kioskAddressLine2 = isDefined(CurrKiosk.City) ? (isDefined(CurrKiosk.State) ? CurrKiosk.City + ", " + CurrKiosk.State : CurrKiosk.City) : CurrKiosk.ZipCode;
            }

        }

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
            $scope.$root.showTitleSuccessCheckout = false;
            $scope.$root.showTitleConfirmCheckout = false;
            var popupKey = "Popup_MISSING_INFO_BILLING_INFO";
            POP_ALERT_BOX_VISIBLE = true;
            MISSING_CARD_POP_UP_VISIBLE = true;
            popupObj_Meta[popupKey].button_2_click = function () {
                if (!$scope.canMoveFocus) {
                    return;
                }
                $scope.canMoveFocus = false;
                helper.HidePopupBox($scope, $scope.$dialog);
                platformStorage.setItem("lastVisitTitle", $scope.title.productId);
                platformStorage.setItem("openKioskCheckoutOnNavigation", true);
                helper.setTitleDetailState(
                    $scope, $scope.title.productId,
                    $scope.selectedKioskPurchaseOption,
                    $scope.selectedCardAccount,
                    "KIOSK_CHECKOUT");
                platformStorage.setItem("openKioskCheckoutOnNavigation", true);
                addToBackPaths($location.path());
                if (card == undefined) {
                    //window.location.href = window.location.pathname + "#/addUpdateCC?cardAction=add&isFirstCard=true";
                    rbiCommonService.setSharedItem("isFirstCard", true);
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
                    helper.HidePopupBox();
                    rbiCommonService.removeSharedItem(IS_CARD);
                    $scope.abandonCheckout();
                },
                helper.ShowPopupBox(popupKey, $scope);
        }

        if (helper.isUserLoggedIn()) {
            $scope.getCards();
        }

        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
    }
);

/**
 * Returns Product Type from the values stored in browseFilterData
 * 
 * @returns productType (Movie/Game)
 */
function getProductType(){
     var browseFilterData = helper.getStoredBrowseFilters('browseFilterForKiosk');
      if( browseFilterData!= null){
    	  	if(browseFilterData.backPath.indexOf("Movie") > -1){
    	  		return "Movie";
            }
            else return "Game";
       }else
      return null;
}
