function TitleDetailEventHandler($scope, $location, $routeParams, rbiCommonService, customerService) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.RestrictCancel = RestrictCancel;
    /*
     * Magic Remote Implementation for title detail click event and enter press
     */
    this.titleDetailClickEvent = titleDetailClickEvent;
    this.pwPopupMouseOver = pwPopupHelper.handleMouseOver;
    this.passwordSubmitClick = passwordSubmitClick;
    this.pwPopupHandleBackKey = pwPopupHandleBackKey;
    this.titleDetailMouseOver = titleDetailMouseOver; // Mouseover Implementation funcation
    this.titleDetailPreviewClick = titleDetailPreviewClick;
    this.titleDetailRatingClick = titleDetailRatingClick;
    this.titleDetailBackButtonClick = titleDetailBackButtonClick;
    this.handleMouseWheel = handleMouseWheel;
    this.startScrolling = startScrolling;
    this.hangonMouseOver = hangonMouseOver;
    this.processBottomButtonClick = processBottomButtonClick;
    this.handleSynopsisVisibility = handleSynopsisVisibility;
    $scope.changeCardTop = 0;
    $scope.changeCardOffset = 50;
    var preCurrentIndex = 0;
    var preCurrentIndexImg = 0;
    var preCurrentLevelIndex = 1;
    var preAgeIndex = 41;

    function hideScroll() {
        var divHeight = $('#reviews').height();
        setTimeout(function () {
            var scrollHeight = $('#fullreviews').height();
            helper.debugLog("scrollHeight" + scrollHeight);
            if (scrollHeight < divHeight) {
                $('.scroll-div').hide();
            } else {
                $('.scroll-div').show();
            }
        }, 1500);
    }

    function hangonMouseOver(id) {
        id == 'yes-btn' ? helper.RemoveFocus('no-btn') : helper.RemoveFocus('yes-btn');
    }

    function handleKeyDownEvent(event) {
        if ($scope.currentIndex == "Preview" || $scope.currentIndex == "synopsis" || $scope.currentIndex == "Rating") {
            $scope.currentIndex = preCurrentIndex;
            $scope.CurrentLevelIndex = preCurrentLevelIndex;
        }
        if (!$scope.canMoveFocus) {
            return;
        }
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }
        if ($('.popupboxouterdiv').is(":visible") == true) {
            switch (event.keyCode) {
            case KEY_CODES.X:
            case KEY_CODES.F:
                {
                    $("#0_222").hide();
                    $(".popupboxouterdiv").hide();
                }
            }
            return true;
        }
        //Scope variables added for Checkout screen
        //Scope variables for title Checkout screen
        $scope.titleCheckoutCurrentControlIndex = 0;
        //Scope variables added for Kiosk Checkout screen
        $scope.$root.kioskCheckOutLevelIndex = 0;
        $scope.$root.kioskCheckOutCurrentIndex = 0;
        $scope.kioskCheckOutDropdownCurrentIndex = 0;
        var ageVerificationControlId = ['#4_0_inp', '#4_1_inp', '#4_2_inp'];
        if (event.keyCode != KEY_CODES.CIRCLE || mainMenuMap.on) {
            if (event.keyCode == KEY_CODES.CIRCLE) {
                rbiCommonService.removeSharedItem(IS_CARD);
            }
            if (handleMainMenu($scope, event.keyCode, $location)) {
                return;
            }
        }
        if ($scope.uiPWPopup) { //Restriction popup
            helper.debugLog("PW Popup - Current Index is:" + $scope.currentIndex);
            switch (event.keyCode) {
            case KEY_CODES.X:
            case KEY_CODES.F:
                switch ($scope.CurrentLevelIndex) {
                case $scope.LEVEL_AT_PWPOPUP:
                case $scope.LEVEL_AT_PWPOPUP_KIOSK:
                    pwPopupHelper.setInitialFocus();
                    break;
                case $scope.LEVEL_AT_PWPOPUP_SUBMIT:
                    passwordSubmitClick();
                    break;
                case $scope.LEVEL_AT_PWPOPUP_SUBMIT_KIOSK:
                    if ($scope.selectedKioskPurchaseOption.PurchaseOptionName == RESERVE_BLURAY || $scope.selectedKioskPurchaseOption.PurchaseOptionName == RESERVE_DVD) {
                        if ($scope.selectedKioskPurchaseOption.PurchaseOptionName == RESERVE_BLURAY) {
                            $scope.checkAccountPassword(function () {
                                $scope.reserveFlag = true;
                                $scope.showBlurayPopup = true;
                                $scope.showAtKioskOptionsPopUp = false;
                            }, true); // indicates kiosk checkout flow
                        } else {
                            $scope.checkAccountPassword(function () {
                                proceedToKioskCheckout();
                            }, true);
                        }
                    }
                    break;
                }
                return true;
            case KEY_CODES.CIRCLE:
                pwPopupHandleBackKey();
                return true;
            }
        }
        if ($scope.reviewHeight == 0 || $scope.reviewHeight == undefined) {
            $scope.reviewHeight = 305;
            $scope.scrollAmount = $scope.reviewHeight / 10;
        }
        switch (event.keyCode) {
        case KEY_CODES.CIRCLE:
            titleDetailBackButtonClick();
            break;
        case KEY_CODES.TRIANGLE:
            if (!$scope.showRatings) {
                titleDetailRatingClick(); //as per ZOE-21730
            } else {
                titleDetailBookMarkClick();
            }
            break;
        case KEY_CODES.DPAD_LEFT:
            if ($scope.uiPWPopup) {
                return;
            }
            if (!$scope.showInstantOptionsPopUp && !$scope.showAtKioskOptionsPopUp) {
                if ($scope.showAgeVerificationPopup) {
                    if ($scope.currentIndex > 41) {
                        $("#" + $scope.currentIndex).blur();
                        $scope.currentIndex--;
                        $("#" + $scope.currentIndex).focus();
                    }
                    break;
                }
                if ($scope.showFullSynopsis || $scope.showAgeVerification || $scope.showHelpPopUp) {
                    break;
                }
                if ($scope.showRate && $scope.showRatings) {
                    $scope.title.ratingMessage = "Rate this title";
                    $scope.changeRating(-1);
                    break;
                }
                if ($scope.showInstantOptionsPopUp == false && $scope.showAtKioskOptionsPopUp == false) {
                    if ($scope.CurrentLevelIndex == $scope.LEVEL_BUTTONS) {
                        if ($scope.currentIndex > 0) {
                            $scope.currentIndex--;
                        }
                    } else {
                        $scope.CurrentLevelIndex = $scope.CurrentLevelIndex - 2;
                        preCurrentIndexImg = $scope.currentIndex;
                        $scope.currentIndex = $scope.levelMap[$scope.CurrentLevelIndex].MaxElements;
                    }
                } else {
                    $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
                }
            }
            break;
        case KEY_CODES.DPAD_RIGHT:
            if ($scope.uiPWPopup) {
                return;
            }
            if (!$scope.showInstantOptionsPopUp && !$scope.showAtKioskOptionsPopUp) {
                if (!$scope.isMoreLikeThisdataPresent) {
                    if ($scope.showRate && $scope.showRatings) {
                        $scope.title.ratingMessage = "Rate this title";
                        $scope.changeRating(1);
                    }
                    break;
                }
                if ($scope.showAgeVerificationPopup) {
                    if ($scope.currentIndex < 43) {
                        $("#" + $scope.currentIndex).blur();
                        $scope.currentIndex++;
                        $("#" + $scope.currentIndex).focus();
                    }
                    break;
                }
                if ($scope.showFullSynopsis || $scope.showAgeVerification || $scope.showHelpPopUp) {
                    break;
                }
                if ($scope.showRate && $scope.showRatings) {
                    $scope.title.ratingMessage = "Rate this title";
                    $scope.changeRating(1);
                    break;
                }
                if ($scope.showInstantOptionsPopUp == false && $scope.showAtKioskOptionsPopUp == false) {
                    if ($scope.CurrentLevelIndex == $scope.LEVEL_BUTTONS) {
                        if ($scope.currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements) {
                            $scope.currentIndex++;
                        } else if ($scope.isMoreLikeThisdataPresent) {
                            $scope.CurrentLevelIndex = $scope.CurrentLevelIndex + 2;
                            preCurrentIndex = $scope.currentIndex;
                            $scope.currentIndex = preCurrentIndexImg;
                        }
                    }
                }
            }
            break;
        case KEY_CODES.DPAD_DOWN:
            if ($scope.uiPWPopup) {
                pwPopupHelper.handleDownKey($scope);
                $scope.CurrentLevelIndex = $scope.LEVEL_AT_PWPOPUP_SUBMIT;
                return;
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_AT_PWPOPUP || $scope.CurrentLevelIndex == $scope.LEVEL_AT_PWPOPUP_KIOSK) {
                $('#password').focus();
            }
            if ($scope.showAgeVerificationPopup && $scope.currentIndex != 44) {
                $("#" + $scope.currentIndex).blur();
                preAgeIndex = $scope.currentIndex;
                $scope.currentIndex = 44;
            }
            if ($scope.showRatings) {
                if ($scope.showReview) {
                    $scope.scrollReview(1);
                }
                break;
            }
            if ($scope.showFullSynopsis) {
                var moveEula = $scope.startpos;
                var scrollTop = $("#content_text").scrollTop();
                if (moveEula == scrollTop || (moveEula - scrollTop) < 5) {
                    $scope.startpos = $scope.startpos + $scope.Offset;
                    $("#content_text").stop().animate({
                        scrollTop: $scope.startpos
                    }, 500);
                }
                if ($scope.isMoreLikeThisdataPresent) {
                    break;
                }
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_LIST) {
                if ($scope.currentIndex < $scope.levelMap[$scope.LEVEL_LIST].MaxElements - 1) {
                    $scope.currentIndex++;
                    if ((($scope.currentIndex % 2 == 0)) && (($scope.currentIndex + 2) >= $scope.levelMap[$scope.LEVEL_LIST].MaxElements - 1)) {
                        $scope.moreLikethis_Gradient = false;
                    }
                    if ($scope.currentIndex > 0 && $scope.currentIndex % 2 == 0) {
                        $scope.top_margin_offset = $scope.top_margin_con_offset;
                        ScrollDown();
                    }
                }
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_INSTANT_LIST) {
                if ($scope.currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1) {
                    $scope.currentIndex++;
                }
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_AT_KIOSK_LIST) {
                if ($scope.currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1) {
                    $scope.currentIndex++;
                }
            }
            break;
        case KEY_CODES.DPAD_UP:
            if ($scope.uiPWPopup) {
                pwPopupHelper.handleUpKey($scope);
                $scope.CurrentLevelIndex = $scope.LEVEL_AT_PWPOPUP;
                return;
            }
            if ($scope.showRatings) {
                if ($scope.showReview) {
                    $scope.scrollReview(-1);
                }
                break;
            }
            if ($scope.showAgeVerificationPopup && $scope.currentIndex == 44) {
                $scope.currentIndex = preAgeIndex;
                $("#" + $scope.currentIndex).focus();
            }
            if ($scope.showFullSynopsis) {
                var moveEula = $scope.startpos;
                if ($scope.startpos >= $scope.Offset) {
                    $scope.startpos = $scope.startpos - $scope.Offset;
                    $("#content_text").stop().animate({
                        scrollTop: $scope.startpos
                    }, 500);
                }
                if ($scope.isMoreLikeThisdataPresent) {
                    break;
                }
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_LIST) {
                if ($scope.currentIndex > 0 && $scope.currentIndex < $scope.levelMap[$scope.LEVEL_LIST].MaxElements) {
                    $scope.currentIndex--;
                    if ((($scope.currentIndex % 2 == 1)) && (($scope.currentIndex) < $scope.levelMap[$scope.LEVEL_LIST].MaxElements - 1)) {
                        $scope.moreLikethis_Gradient = true;
                    }
                    if ($scope.currentIndex > 0 && $scope.currentIndex % 2 != 0) {
                        $scope.top_margin_offset = $scope.top_margin_con_offset;
                        ScrollUp();
                    }
                }
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_INSTANT_LIST) {
                if ($scope.currentIndex > 0) {
                    $scope.currentIndex--;
                }
            }
            if ($scope.CurrentLevelIndex == $scope.LEVEL_AT_KIOSK_LIST) {
                if ($scope.currentIndex > 0) {
                    $scope.currentIndex--;
                }
            }
            break;
        case KEY_CODES.X:
        case KEY_CODES.F:
            if ($scope.showReview) {
                return;
            }
            if ($scope.uiPWPopup) {
                pwPopupHelper.setInitialFocus();
            }
            preCurrentIndex = $scope.currentIndex;
            titleDetailClickEvent();
            break;
        case KEY_CODES.PREVIEW:
            /**
             * click event for both magic remote and normal key handling
             * this function for play preview
             */
            titleDetailPreviewClick(); //as per ZOE-21730
            break;
        case KEY_CODES.SQUARE:
            /**
             * click event for both magic remote and normal key handling
             * this function for review rating
             */
            //Check this condition for rating popup  open or not
            if (!$scope.showRatings) {
                handleSynopsisVisibility(); //as per ZOE-21730
            }
            break;
        case KEY_CODES.L3:
            if ($scope.showFullSynopsis || $scope.showBookmarkPopUp || $scope.showFullSynopsis || $scope.showInstantOptionsPopUp || $scope.showAtKioskOptionsPopUp || $scope.showAgeVerification) {
                break;
            }
        }
    }

    function ScrollDown() {
        $scope.title_list_margin = $scope.title_list_margin - $scope.top_margin_offset + 16;
    }

    function ScrollUp() {
        $scope.title_list_margin = $scope.title_list_margin + $scope.top_margin_offset - 16;
    }

    function AgeVerifyPop() {
        var userMonth = $.trim($("#41").val());
        var userDay = $.trim($("#42").val());
        var userYear = $.trim($("#43").val());
        if (/^(19|20)\d\d-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/.test(userYear + "-" + ("0" + userMonth).slice(-2) + "-" + ("0" + userDay).slice(-2))) {
            var dateValue = getAge(userYear, userMonth, userDay);
        }
        return dateValue;
    }

    function getAge(year, month, day) {
        var today = new Date();
        var birthDate = new Date();
        birthDate.setFullYear(year, month - 1, day);
        if (birthDate.getMonth() + 1 == month) {
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }
        return age; // for any invalid date age will be undefined
    }

    function proceedWithRentBuy($scope, currentIndex) {
        if (checkLogin("R", currentIndex)) {
            $scope.showInstantOptionsPopUp = true;
            showRentBuy(currentIndex);
            $location.path("/titleCheckout");
        }
    }

    function showKioskCheckoutScreen() {
        $scope.setKioskSharedData();
    }

    function proceedToKioskCheckout() {
        //Omniture
        if ($scope.showBlurayPopup == false) {
            $scope.trackOmniture = "kioskLocationFirst";
            $scope.omnitureReady[0] = true;
        }
        //Omniture
        showKioskCheckoutScreen();
        helper.debugLog($location.path);
        $location.path("/kioskCheckout");
    }

    function showRentBuy(currentIndex) {
        //Omniture
        if (currentIndex == 0 || currentIndex == 1) {
            $scope.trackOmniture = "rent";
        }
        if (currentIndex == 2 || currentIndex == 3) {
            $scope.trackOmniture = "buy";
        }
        $scope.omnitureReady[0] = true;
        //Omniture
        platformStorage.setItem("titleRentBuyIndex", currentIndex);
        rbiCommonService.setSharedItem(CURRENT_INDEX, currentIndex);
        $scope.setSharedData();
        helper.debugLog($location.path);
    }

    function ShowPasswordFailPopup() {
        var popupkey = 'Popup_VALIDATION_FAIL';
        popupObj_Meta[popupkey].msg_text = "Invalid Password. Please try again.";
        $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
        helper.ShowPopupBox(popupkey, $scope);
    }

    function RestrictCancel() {
        helper.HidePopupBox($scope, $scope.$dialog);
        $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
    }

    function storeLastTitle(currentIndex) {
        platformStorage.setItem("lastVisitTitle", $scope.title.productId);
        platformStorage.setItem("lastSelectedOption", JSON.stringify($scope.aTkioskPopUpjsonObj.instantoption[currentIndex]));
    }

    function titleDetailClickEvent(btnType) {
        if ($scope.instantOptionPopUpjsonObj.instantoption[$scope.currentIndex] != undefined)
            var purchaseOptionName = $scope.instantOptionPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionName.toLowerCase();
        if ($scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex] != undefined)
            var kioskPurchaseOptionName = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionName;
        if ($scope.currentIndex == $scope.levelMap[1].MaxElements && !$scope.showFullSynopsis) {
            if (helper.isUserLoggedIn()) {
                $scope.trackOmniture = "bookmark";
                $scope.omnitureReady[0] = true;
            }
            if ($scope.title.isBookmarked == true) {
                $scope.removeBookmark();
            } else {
                $scope.addBookmark();
            }
            return;
        }
        if ($scope.showRatings) {
            $scope.toggleReviewRating();
        }
        //This is to disable the click event for out of stock media formats at kiosk.
        if ($scope.showAtKioskOptionsPopUp && $('#' + $scope.LEVEL_AT_KIOSK_LIST + "_" + $scope.currentIndex).hasClass('list-item-disabled')) return false;
        //More title Omniture
        if ($scope.showFullSynopsis) {
            $scope.CurrentLevelIndex = 1;
            $scope.currentIndex = preCurrentIndex;
        }
        if ($scope.showAtKioskOptionsPopUp && btnType == 1) {
            $scope.showAtKioskOptionsPopUp = false;
            $scope.CurrentLevelIndex = 1;
            return;
        }
        if ($scope.showInstantOptionsPopUp && btnType == 1) {
            $scope.showInstantOptionsPopUp = false;
            $scope.CurrentLevelIndex = 1;
            return;
        }
        if ($scope.showkioskAbandonCheckout == true) {
            $("#showkioskAbandonCheckout_OK").click();
            $scope.showkioskAbandonCheckout = false;
            $scope.$root.showCheckOut = "";
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
        } else if ($scope.showBlurayPopup == true) {
            if (btnType != "No") {
                if ($scope.reserveFlag == true) {
                    proceedToKioskCheckout();
                } else {
                    //If the instant option button is visible and there is only one element in atkiosk list options then set currentindex = 0
                    if ($scope.isInstantOptionVisibl && $scope.aTkioskPopUpjsonObj.instantoption.length == 1) {
                        $scope.currentIndex = 0;
                    }
                    $scope.setKioskSharedData();
                    $location.path("/locations/" + $scope.title.productId + "/" + $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionID);
                }
            }
            $scope.showBlurayPopup = false;
        } else if ($scope.showHelpPopUp) {
            $scope.showHelpPopUp = false;
            $scope.showInstantOptionsPopUp = false;
        } else if ($scope.showAbandonCheckout) {
            $scope.showAbandonCheckout = false;
            $scope.$root.showCheckOut = "";
        } else if ($scope.showAgeVerificationPopup) {
            if (RBI.PlatformConfig.genericKeyboard) {
                if ($.isKeyboardOpen) {
                    return false;
                }
            }
            if ($scope.currentIndex == 44) { //Fix to resolve issue where in quickly clicking on enter empty text box was getting processed
                var dateValue = AgeVerifyPop();
                if (isNaN(dateValue)) {
                    $scope.ageVerificationErrorMessage = "Invalid date format";
                } else if (dateValue >= 17) {
                    $scope.showAgeVerificationPopup = false;
                    $scope.playPreview();
                } else {
                    $scope.ageVerificationErrorMessage = "Sorry, you are not allowed to view this content.";
                }
            }
        } else if ($scope.showFullSynopsis) {
            $scope.showFullSynopsis = false;
        } else if ($scope.showRatings) {
            $scope.saveRating();
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_LIST) {
            //Omniture
            $scope.trackOmniture = "more";
            $scope.clickedRecommendedProduct = $scope.RecommendedProductsResponse[$scope.currentIndex];
            //$scope.callOmniture();
            $scope.omnitureReady[0] = true;
            //Omniture
            if (helper.isDefined($routeParams.kioskID)) {
                $location.path("/titledetail/" + $scope.RecommendedProductsResponse[$scope.currentIndex].productID + "/" + $routeParams.kioskID);
            } else {
                $location.path("/titledetail/" + $scope.RecommendedProductsResponse[$scope.currentIndex].productID);
            }
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_BUTTONS) {
            if ($scope.bttnArray[$scope.currentIndex].BtnType == 'I') {
                if ($scope.isInstantOptionListVisible) {
                    $scope.showInstantOptionsPopUp = true;
                    $scope.CurrentLevelIndex = $scope.LEVEL_INSTANT_LIST;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                } else {
                    //Add logic for watch now or subscription
                    if (purchaseOptionName == WATCH_NOW_LABEL.toLowerCase()) {
                        $scope.playTitle();
                    } else if (purchaseOptionName == SUBSCRIBE_NOW_LABEL.toLowerCase()) {
                        if (checkLogin("S", -1)) {
                            if (!helper.isFreeTrialUsed()) {
                                // ZOE 29999: If user selects 'Subscribe Now' we should skip "How about subscription" page
                                // reverted back to show FT page
                                $location.path("/freeTrial");
                            } else {
                                $location.path('/subscribeNoFreeTrial');
                            }
                        }
                    } else if (helper.GetRestrictPurchase() && (purchaseOptionName == RENT_BUY_LABEL.toLowerCase() ||
                        purchaseOptionName == RENT_LABEL.toLowerCase() ||
                        purchaseOptionName == BUY_LABEL.toLowerCase() ||
                        purchaseOptionName == RENT_HD_LABEL.toLowerCase() ||
                        purchaseOptionName == BUY_HD_LABEL.toLowerCase())) {
                        if (helper.isUserLoggedIn()) {
                            helper.setTitleDetailState( //To show the confirmcheckout after user logged in
                                $scope, $scope.title.productId,
                                $scope.instantOptionPopUpjsonObj.instantoption[$scope.currentIndex],
                                $scope.selectedCardAccount,
                                "TITLE_CHECKOUT");
                        }
                        if (checkLogin("R", $scope.currentIndex)) {
                            helper.debugLog("SetSharedItem - current Index is:" + $scope.currentIndex);
                            rbiCommonService.setSharedItem(CURRENT_INDEX, $scope.currentIndex);
                            $scope.InstantOptionLevelIndex = $scope.currentIndex;
                            $scope.buttonName = purchaseOptionName;
                            if ($scope.buttonName == WATCH_NOW_LABEL.toLowerCase()) {
                                $scope.playTitle();
                            } else {
                                if (helper.GetRestrictPurchase()) {
                                    pwPopupHelper.showPWPopup($scope, HEADER_TEXT, BODY_TEXT);
                                    $scope.CurrentLevelIndex = $scope.LEVEL_AT_PWPOPUP;
                                    //to set inital focus on password field
                                    if ($scope.uiPWPopup) {
                                        pwPopupHelper.setInitialFocus();
                                        if (!$scope.$$phase) {
                                            $scope.$apply();
                                        }
                                    }
                                } else {
                                    if ($scope.showInstantOptionsPopUp) {
                                        proceedWithRentBuy($scope, $scope.currentIndex);
                                    }
                                }
                            }
                        }
                    } else {
                        if (checkLogin("R", $scope.currentIndex)) {
                            proceedWithRentBuy($scope, $scope.currentIndex);
                        }
                    }
                }
                //Instant option
            } else if ($scope.bttnArray[$scope.currentIndex].BtnType == 'K') {
                if ($scope.isATKioskListVisible) {
                    $scope.showAtKioskOptionsPopUp = true;
                    $scope.CurrentLevelIndex = $scope.LEVEL_AT_KIOSK_LIST;
                    $scope.currentIndex = 0;
                } else {
                    $scope.currentIndex = 0;
                    if (kioskPurchaseOptionName == RESERVE_BLURAY.toLowerCase() || kioskPurchaseOptionName == RESERVE_DVD) {
                        $scope.buttonName = kioskPurchaseOptionName;
                        $scope.trackOmniture = "kioskLocationFirst";
                        $scope.omnitureReady[0] = true;
                        if (checkLogin("K", -1)) {
                            try {
                                if ($('#' + $scope.LEVEL_BUTTONS + "_" + +data[1]).hasClass("disablediv")) {
                                    return;
                                }
                            } catch (object) {}
                            storeLastTitle($scope.currentIndex);
                            platformStorage.setItem("lastSelectedOption", JSON.stringify($scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex]));
                            platformStorage.setItem("purchaseOptionID", $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionID);
                            $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                            /*
                             * To check for parental controls
                             */
                            var productRating = $scope.product.value.Rating;
                            if (kioskPurchaseOptionName == RESERVE_BLURAY.toLowerCase()) {
                                $scope.reserveFlag = true;
                                $scope.showBlurayPopup = true;
                                $scope.showAtKioskOptionsPopUp = false;
                                $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                            } else {
                                $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                                proceedToKioskCheckout();
                            }
                        }
                    } else if (kioskPurchaseOptionName == FIND_BLURAY || kioskPurchaseOptionName == FIND_DVD) {
                        //Omniture
                        $scope.trackOmniture = "kioskTitleFirst";
                        $scope.buttonName = kioskPurchaseOptionName;
                        $scope.omnitureReady[0] = true;
                        //Omniture
                        platformStorage.setItem("lastVisitTitle", $scope.title.productId);
                        platformStorage.setItem("lastSelectedOption", JSON.stringify($scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex]));
                        $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                        if (kioskPurchaseOptionName == FIND_BLURAY) {
                            $scope.reserveFlag = false;
                            $scope.showBlurayPopup = true;
                            $scope.showAtKioskOptionsPopUp = false;
                        } else {
                            $scope.setKioskSharedData();
                            $location.path("/locations/" + $scope.title.productId + "/" + $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionID);
                        }
                    }
                    //Add logic for taking user to search kiosk page
                }
                ////Kiosk option
            }
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_POPUP) {
            $scope.showFullSynopsis = false;
            $scope.startpos = 0;
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_AGE_VERIFICATION) {
            $scope.showAgeVerification = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_INSTANT_LIST) {
            if ($scope.instantOptionPopUpjsonObj.instantoption.length == $scope.currentIndex) {
                $scope.showHelpPopUp = true;
                $scope.showInstantOptionsPopUp = false;
                $scope.CurrentLevelIndex = $scope.LEVEL_HELP;
            } else if (purchaseOptionName() == WATCH_NOW_LABEL.toLowerCase()) {
                var productRating = $scope.product.value.Rating;
                helper.debugLog("SetSharedItem - current Index is:" + $scope.currentIndex);
                rbiCommonService.setSharedItem(CURRENT_INDEX, $scope.currentIndex);
                $scope.playTitle();
            } else if (purchaseOptionName() == SUBSCRIBE_NOW_LABEL.toLowerCase()) {
                if (checkLogin("S", -1)) {
                    if (!helper.isFreeTrialUsed()) {
                        // ZOE 29999: If user selects 'Subscribe Now' we should skip "How about subscription" page
                        // reverted back to show FT page
                        $location.path("/freeTrial");
                    } else {
                        $location.path('/subscribeNoFreeTrial');
                    }
                }
            } else if (purchaseOptionName == RENT_BUY_LABEL.toLowerCase() ||
                purchaseOptionName == RENT_LABEL.toLowerCase() ||
                purchaseOptionName == BUY_LABEL.toLowerCase() ||
                purchaseOptionName == RENT_HD_LABEL.toLowerCase() ||
                purchaseOptionName == BUY_HD_LABEL.toLowerCase()) {
                if (helper.isUserLoggedIn()) {
                    helper.setTitleDetailState( //To show the confirmcheckout after user logged in
                        $scope, $scope.title.productId,
                        $scope.instantOptionPopUpjsonObj.instantoption[$scope.currentIndex],
                        $scope.selectedCardAccount,
                        "TITLE_CHECKOUT");
                }
                if (checkLogin("R", $scope.currentIndex)) {
                    helper.debugLog("SetSharedItem - current Index is:" + $scope.currentIndex);
                    rbiCommonService.setSharedItem(CURRENT_INDEX, $scope.currentIndex);
                    var productRating = $scope.product.value.Rating;
                    $scope.InstantOptionLevelIndex = $scope.currentIndex;
                    $scope.buttonName = purchaseOptionName;
                    if (helper.GetRestrictPurchase() && $scope.buttonName != WATCH_NOW_LABEL.toLowerCase()) {
                        pwPopupHelper.showPWPopup($scope, HEADER_TEXT, BODY_TEXT);
                        $scope.CurrentLevelIndex = $scope.LEVEL_AT_PWPOPUP;
                        //to set inital focus on password field
                        if ($scope.uiPWPopup) {
                            pwPopupHelper.setInitialFocus();
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        }
                        // Parental PW control popup has been moved to the player
                    } else if ($scope.buttonName == WATCH_NOW_LABEL.toLowerCase()) {
                        $scope.playTitle();
                    } else {
                        if ($scope.showInstantOptionsPopUp) {
                            proceedWithRentBuy($scope, $scope.currentIndex);
                        }
                    }
                }
            }
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_AT_KIOSK_LIST) {
            $scope.showAtKioskOptionsPopUp = false;
            if (kioskPurchaseOptionName == RESERVE_BLURAY || kioskPurchaseOptionName == RESERVE_DVD) {
                //Omniture
                $scope.buttonName = kioskPurchaseOptionName;
                $scope.trackOmniture = "kioskLocationFirst";
                $scope.omnitureReady[0] = true;
                //Omniture
                if (checkLogin("K", -1)) {
                    try {
                        if ($('#' + $scope.LEVEL_BUTTONS + "_" + +data[1]).hasClass("disablediv")) {
                            return;
                        }
                    } catch (object) {}
                    storeLastTitle($scope.currentIndex);
                    platformStorage.setItem("lastSelectedOption", JSON.stringify($scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex]));
                    platformStorage.setItem("purchaseOptionID", $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionID);
                    $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                    /*
                     * To check for parental controls
                     *
                     */
                    var productRating = $scope.product.value.Rating;
                    if (kioskPurchaseOptionName == RESERVE_BLURAY) {
                        $scope.reserveFlag = true;
                        $scope.showBlurayPopup = true;
                        $scope.showAtKioskOptionsPopUp = false;
                        $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                    } else {
                        $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                        proceedToKioskCheckout();
                    }
                }
            } else if (kioskPurchaseOptionName == FIND_BLURAY || kioskPurchaseOptionName == FIND_DVD) {
                //Omniture
                $scope.trackOmniture = "kioskTitleFirst";
                $scope.omnitureReady[0] = true;
                //Omniture
                platformStorage.setItem("lastVisitTitle", $scope.title.productId);
                platformStorage.setItem("lastSelectedOption", JSON.stringify($scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex]));
                $scope.selectedKioskPurchaseOption = $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex];
                if (kioskPurchaseOptionName == FIND_BLURAY) {
                    $scope.reserveFlag = false;
                    $scope.showBlurayPopup = true;
                    $scope.showAtKioskOptionsPopUp = false;
                } else {
                    $scope.setKioskSharedData();
                    $location.path("/locations/" + $scope.title.productId + "/" + $scope.aTkioskPopUpjsonObj.instantoption[$scope.currentIndex].PurchaseOptionID);
                }
            }
        } else if ($scope.CurrentLevelIndex == $scope.LEVEL_AT_PWPOPUP) {
            $scope.checkAccountPassword();
        }
        if ($scope.showHelpPopUp && $scope.CurrentLevelIndex == 7) {
            $scope.CurrentLevelIndex = 1;
            if ($scope.showHelpPopUp) {
                $scope.showHelpPopUp = true;
            } else {
                $scope.showHelpPopUp = false;
                $scope.showInstantOptionsPopUp = false;
            }
        }
    }
    /*
     * Magic Remote Implementation
     * mouse event handling
     */
    function handleSynopsisVisibility() {
        if (!$scope.showFullSynopsis && $scope.isDescriptionElipsised && !$scope.showHelpPopUp) {
            $scope.showFullSynopsis = true;
        } else {
            $scope.showFullSynopsis = false;
        }
        scrollHide();
    }

    function titleDetailMouseOver(Level_button, btnID) {
        if (btnID < 20) {
            preCurrentIndex = $scope.currentIndex;
            preCurrentLevelIndex = $scope.CurrentLevelIndex;
        }
        if ($scope.showAgeVerificationPopup) {
            $("#" + $scope.currentIndex).blur();
            $scope.currentIndex = btnID;
            $("#" + $scope.currentIndex).focus();
            return;
        }
        if (Level_button == 3 && (btnID) % 2 == 0 && btnID != 0)
            return;
        $scope.currentIndex = btnID;
        if (($scope.showInstantOptionsPopUp && (Level_button == 4 || btnID == 0)) || ($scope.showAtKioskOptionsPopUp && (Level_button == 5 || btnID == 1)))
            return;
        $scope.showInstantOptionsPopUp = false;
        $scope.showAtKioskOptionsPopUp = false;
        if (btnID == "rating") {
            var xOffset = event.offsetX;
            if (xOffset < 5) {
                $scope.ratval = 0.0;
            } else if (xOffset < 28) {
                $scope.ratval = 0.5;
            } else if (xOffset < 56) {
                $scope.ratval = 1.0;
            } else if (xOffset < 88) {
                $scope.ratval = 1.5;
            } else if (xOffset < 116) {
                $scope.ratval = 2.0;
            } else if (xOffset < 150) {
                $scope.ratval = 2.5;
            } else if (xOffset < 178) {
                $scope.ratval = 3.0;
            } else if (xOffset < 208) {
                $scope.ratval = 3.5;
            } else if (xOffset < 236) {
                $scope.ratval = 4.0;
            } else if (xOffset < 270) {
                $scope.ratval = 4.5;
            } else if (xOffset <= 297) {
                $scope.ratval = 5.0;
            }
        } else {
            $scope.CurrentLevelIndex = Level_button;
        }
        return;
    }
    /*
     * Magic Remote Implementation on button I press and Implementation of device specific key
     * bookmark Implementation
     */
    function titleDetailBookMarkClick() {
        if (helper.isUserLoggedIn()) {
            $scope.trackOmniture = "bookmark";
            $scope.omnitureReady[0] = true;
        }
        if ($scope.showFullSynopsis || $scope.showInstantOptionsPopUp || $scope.showAtKioskOptionsPopUp || $scope.showAgeVerification || $scope.showHelpPopUp) {
            return;
        }
        if ($scope.showRatings) {
            $scope.toggleReviewRating();
        } else {
            if ($scope.title.isBookmarked == true) {
                $scope.removeBookmark();
            } else {
                $scope.addBookmark();
            }
        }
    }
    /*
     * Magic Remote Implementation on button  press and Implementation of device specific key
     * Preview Trailer  Implementation
     */
    function titleDetailPreviewClick() {
        if (!$scope.showPreview || $scope.showFullSynopsis || $scope.showRatings || $scope.showBookmarkPopUp || $scope.showFullSynopsis || $scope.showInstantOptionsPopUp || $scope.showAtKioskOptionsPopUp || $scope.showAgeVerification) {
            return;
        }
        if (event.keyCode == KEY_CODES.R1 && RBI.PlatformConfig.deviceType != "PS4") {
            if ($scope.title.isMovie == false && $scope.title.isMatureTitle == "M (17+)") {
                $scope.showAgeVerificationPopup = true;
            } else {
                $scope.playPreview();
            }
            // only for PS4 right now til we normalize with ZOE-21730
        }
        if ($scope.title.isMovie == false && $scope.title.isMatureTitle == "M (17+)") {
            if ($scope.currentIndex < 20) {
                preCurrentIndex = $scope.currentIndex;
                preCurrentLevelIndex = $scope.CurrentLevelIndex;
            }
            $scope.currentIndex = 41;
            $scope.showAgeVerificationPopup = true;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $("#" + $scope.currentIndex).focus();
        } else {
            $scope.trackOmniture = "preview";
            $scope.omnitureReady[0] = true;
            $scope.playPreview();
        }
    }
    /*
     * Magic Remote Implementation on button  press and Implementation of device specific key
     * Rating  Implementation
     */
    function titleDetailRatingClick() {
        if ($scope.showFullSynopsis || $scope.showRatings || $scope.showBookmarkPopUp || $scope.showFullSynopsis || $scope.showInstantOptionsPopUp || $scope.showAtKioskOptionsPopUp || $scope.showAgeVerification || $scope.showHelpPopUp || $scope.showBlurayPopup) {
            return;
        }
        hideScroll();
        if ($scope.CustomerProductRating != undefined)
            $scope.ratval = $scope.CustomerProductRating / 10;
        $scope.ShowRatingPopup();
        $scope.title.ratingMessage = "Rate this title";
    }
    /*
     * Magic Remote Implementation on button back press and Implementation of device specific key back button functionality
     * Back button  Implementation
     */
    function titleDetailBackButtonClick() {
        $scope.currentIndex = preCurrentIndex;
        $scope.CurrentLevelIndex = preCurrentLevelIndex;
        if ($scope.deepSearch == "deepsearch") {
            platformInfo.exitApp();
            return;
        }
        if ($scope.showkioskAbandonCheckout == true) {
            $scope.showkioskAbandonCheckout = false;
            $scope.$root.showCheckOut = "KIOSK_CHECKOUT";
            $scope.showKioskConfirmCheckout = true;
            $scope.$root.kioskCheckOutLevelIndex = 1;
            $scope.$root.kioskCheckOutCurrentIndex = 3;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            return;
        }
        if ($scope.showBlurayPopup == true) {
            $scope.showBlurayPopup = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            $scope.$root.showCheckOut = "";
            return;
        }
        if ($scope.showAbandonCheckout) {
            $scope.showAbandonCheckout = false;
            $scope.$root.showCheckOut = "TITLE_CHECKOUT";
            $scope.$root.showTitleConfirmCheckout = true;
            $scope.titleCheckoutCurrentControlIndex = 2;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            return;
        }
        if ($scope.showAgeVerificationPopup) {
            $scope.showAgeVerificationPopup = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            $scope.month = '';
            $scope.day = '';
            $scope.year = '';
            $scope.ageVerificationErrorMessage = '';
            $scope.ageVerificationLevelMap[0].CurrentIndex = 0;
            return;
        }
        if ($scope.showFullSynopsis) {
            $scope.showFullSynopsis = false;
            return;
        }
        if ($scope.showRatings) {
            $scope.showRatings = false;
            return;
        }
        if ($scope.showInstantOptionsPopUp && !$scope.showHelpPopUp) {
            $scope.showInstantOptionsPopUp = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            return;
        }
        if ($scope.showAtKioskOptionsPopUp) {
            $scope.showAtKioskOptionsPopUp = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            return;
        }
        if ($scope.showHelpPopUp) {
            $scope.showHelpPopUp = false;
            $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
            return;
        }
        $scope.uiPWPopup = false;
        goToPreviousPath($scope, event.keyCode, $location);
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

    function HandleKeyDown() {
        if ($scope.CurrentLevelIndex == $scope.LEVEL_LIST && !$scope.showFullSynopsis && !$scope.showRatings && !$scope.showAgeVerificationPopup && !mainMenuMap.on) {
            if ($scope.currentIndex < $scope.levelMap[$scope.LEVEL_LIST].MaxElements - 1) {
                $scope.currentIndex++;
                if ((($scope.currentIndex % 2 == 0)) && (($scope.currentIndex + 2) >= $scope.levelMap[$scope.LEVEL_LIST].MaxElements - 1)) {
                    $scope.moreLikethis_Gradient = false;
                }
                if ($scope.currentIndex > 0 && $scope.currentIndex % 2 == 0) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    ScrollDown();
                }
            }
        }
    }

    function HandleKeyUp() {
        if ($scope.CurrentLevelIndex == $scope.LEVEL_LIST && !$scope.showFullSynopsis && !$scope.showRatings && !$scope.showAgeVerificationPopup && !mainMenuMap.on) {
            if ($scope.currentIndex > 0 && $scope.currentIndex < $scope.levelMap[$scope.LEVEL_LIST].MaxElements) {
                $scope.currentIndex--;
                if ((($scope.currentIndex % 2 == 1)) && (($scope.currentIndex) < $scope.levelMap[$scope.LEVEL_LIST].MaxElements - 1)) {
                    $scope.moreLikethis_Gradient = true;
                }
                if ($scope.currentIndex > 0 && $scope.currentIndex % 2 != 0) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    ScrollUp();
                }
            }
        }
    }
    /**
     * remove all Bottom Button Focus of title detail screen
     * @return
     */
    function scrollHide() {
        var synopText = $('#content_text').text().length;
        if (synopText < 700) {
            $('.scroll-div').hide();
        }
    }

    function processBottomButtonClick(id) {
        if (id == "Checkout") {
            OnMenuMouseClick();
        } else {
            handleMainMenu($scope, KEY_CODES.CIRCLE, $location);
        }
    }

    function checkLogin(checkoutType, currentIndex) {
        if (helper.isUserLoggedIn()) {
            if (checkoutType == "S") {
                var productID = $scope.title.productId;
                var purchaseOptionID = $scope.title.watchNowPurchaseOptionId;
                rbiCommonService.setSharedItem("HD_ASSET", $scope.isHD);
                rbiCommonService.setSharedItem(RATING, $scope.titleDetail.getRating());
                rbiCommonService.setSharedItem(PLAYBACK_TITLE_URL, '/player/' + productID + '/' + purchaseOptionID);
            }
            return true;
        } else {
            if (checkoutType == "R") {
                platformStorage.setItem("checkouttype", "titleCheckout");
                showRentBuy(currentIndex);
            } else if (checkoutType == "K") {
                platformStorage.setItem("checkouttype", "kioskCheckout");
                showKioskCheckoutScreen();
            } else {
                //Omniture
                $scope.trackOmniture = "subscribe";
                $scope.omnitureReady[0] = true;
                //Omniture
                var productID = $scope.title.productId;
                var purchaseOptionID = $scope.title.watchNowPurchaseOptionId;
                rbiCommonService.setSharedItem("HD_ASSET", $scope.isHD);
                rbiCommonService.setSharedItem(PLAYBACK_TITLE_URL, '/player/' + productID + '/' + purchaseOptionID);
                rbiCommonService.setSharedItem(RATING, $scope.titleDetail.getRating());
                $location.path('/login' + '/player/' + productID + '/' + purchaseOptionID);
                return;
            }
            $location.path('/login' + $location.path());
        }
    }
    //to start scrolling for reviews
    function startScrolling(initPos) {
        $(".reviews-wrapper").stop().animate({
            scrollTop: initPos
        }, 500);
    }
    // Handle back key for restrict purchase popup
    function pwPopupHandleBackKey() {
        pwPopupHelper.handleBackKey($scope);
        $scope.showAtKioskOptionsPopUp = false;
        $scope.showInstantOptionsPopUp = false;
        $scope.CurrentLevelIndex = $scope.LEVEL_BUTTONS;
    }
    // Submit password for restrict purchase popup
    function passwordSubmitClick() {
        var currentIndex = rbiCommonService.getSharedItem("CURRENT_INDEX");
        if ($scope.instantOptionPopUpjsonObj.instantoption[$scope.InstantOptionLevelIndex].PurchaseOptionName.toLowerCase() != WATCH_NOW_LABEL.toLowerCase()) {
            helper.debugLog('checkAccountPassword for rent / buy titles');
            $scope.checkAccountPassword(
                function () {
                    proceedWithRentBuy($scope, currentIndex);
                },
                false); // indicares rent / buy flow
        }
    }
    //to handle mouse hover on rating so that we are able to increase or decrease rating on rating bar
}