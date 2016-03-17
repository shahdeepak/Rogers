/**
 * Helper functions for the account page
 */

var accountHelper = {

    panes: [
        { title: "Summary", path: "/account/summary", key: "SUMMARY" },
        { title: "Credit Cards", path: "/account/creditCards", key: "CREDITCARDS" },
        { title: "Preferences", path: "/account/preferences", key: "PREFERENCES" },
        { title: "Closed Captioning", path: "/account/captionEditor", key: "CAPTION_EDITOR" }
    ],

    numPanes: (RBI.PlatformConfig.captionEditorEnabled)? 4:3,

    // Hex to rgb lookup table
    hexToRgb : [
        { value: '#000000', r: 0, g: 0, b: 0},
        { value: '#ff0000', r: 255, g: 0, b: 0},
        { value: '#00ff00', r: 0, g: 255, b: 0},
        { value: '#0000ff', r: 0, g: 0, b: 255},
        { value: '#ffff00', r: 255, g: 255, b: 0},
        { value: '#00ffff', r: 0, g: 255, b: 255},
        { value: '#ff00ff', r: 255, g: 0, b: 255},
        { value: '#ffffff', r: 255, g: 255, b: 255}
    ],

    onTabClick: function ($scope, tabId) {
        var path = this.panes[tabId].path;

        // Fix for ZOE-14871
        // This will pop the current tab and add the new tab to back paths so that user can go back to the same tab
        backPaths.pop();
        addToBackPaths(path);

        return path;
    },


    initializePanes: function($scope) {
        for (var i=0; i<accountHelper.numPanes; i++) {
            $scope.panes[i] = accountHelper.panes[i];
        }
    },

    processLogoutUser: function (loginService, rbiCommonService, logoutCallback) {
        // logout success callback
        var  logoutSuccessCallback = function () {
            // CLEAR all the user specific local storage items
            helper.logoutUser();
            helper.DeleteCards(rbiCommonService);  // delete all cards stored in memory

            //Omniture
            platformStorage.removeItem("firstPurchase");
            //Omniture

            helper.hideSpinner();
            //*** To route the user back to HOME after logging out.
            // TODO: investigate if this is needed
//            if (isDefined(backPaths) && backPaths.length > 0) {
//                for (var i = (backPaths.length - 1); i >= 0; i--) {
//                    if (backPaths[i] != '/home') {
//                        backPaths.pop();
//                        helper.debugLog("----RESET to HOME----" + backPaths);
//                    }
//                    else {
//                        backPaths.push('/account');
//                        helper.debugLog("----RESET to HOME----" + backPaths);
//                    }
//                }
//            }

            if (logoutCallback) {
                logoutCallback();
            }
        };

        helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
        loginService.Logout(function (data) {
            logoutSuccessCallback();
        }, function (data) {
            //TODO: Handle error
        });

        // For TF browser (PS3/PS4/emulator) we are not getting the login callback due
        // to loss of window context so we have to fire a timer
        if (RBI.PlatformConfig.useLogoutTimer && typeof vod !== 'undefined') {
            setTimeout(function () {
                logoutSuccessCallback();
            }, 2000);

            setTimeout(function () {
                addVodListeners();
            }, 10000);
        }
    },

    //to remove remote color button focus
    removeBottomButtonFocus: function ($scope) {
        helper.RemoveFocus('back-button-wrapper');
        helper.RemoveFocus('menu-button-wrapper');
        helper.RemoveFocus('logout-btn');
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        helper.debugLog("current level index: " + $scope.CurrentLevelIndex);
        helper.debugLog("removeBottomButtonFocus - current elementID:" + currentFocusedEleId);
        helper.RemoveFocus(currentFocusedEleId);
    },

    updatePageFocus: function ($scope) {
        var elemId = $scope.CurrentLevelIndex + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        helper.debugLog("Current selected element - " + elemId);
        helper.SetFocus(elemId);
    },

    handleTabKeyDownEvent: function (event, $scope) {
        helper.debugLog("handleTabKeyDownEvent");
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.selectedTab;
        var handled = false;

        switch (event.keyCode) {

            case KEY_CODES.X:
            {
                if (this.panes[currentIndex].key != $scope.CurrentTabName) {
                    var selectedTabId = $scope.CurrentLevelIndex + "_" + currentIndex;
                    $scope.selectedTab = currentIndex;
                    $("#" + selectedTabId).click();
                    event.preventDefault();
                }
                else {
                    // since the focus was previously removed it needs to be added back
                    this.updatePageFocus($scope);
                }
                handled = true;
                break;
            }
            case KEY_CODES.DPAD_RIGHT:
            { // Right Arrow
                if (currentIndex < accountHelper.numPanes-1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                helper.RemoveFocus(currentFocusedEleId);
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                this.updatePageFocus($scope);
                handled = true;
                break;
            }

            case KEY_CODES.DPAD_LEFT:
            {
                if (currentIndex > 0) { // LEVEL_PREFERENCES
                    currentIndex--;
                } else {
                    currentIndex = accountHelper.numPanes-1;
                }
                helper.RemoveFocus(currentFocusedEleId);
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                this.updatePageFocus($scope);
                handled = true;
                break;
            }

            case KEY_CODES.DPAD_UP:
            { // Up Arrow
                handled = true;
                this.updatePageFocus($scope);
                break;
            }

            case KEY_CODES.DPAD_DOWN:
            { // Down Arrow
                break;
            }
        }
        return handled;
    },


    removeTabFocus: function () {
        for (var tabNumber = 0; tabNumber < accountHelper.numPanes; tabNumber++) {
            helper.RemoveFocus('2_' + tabNumber);
        }
    },

    getCaptionAttributes: function (captionProperties) {
        captionProperties.textFont = isDefined(platformStorage.getItem(CAPTION_TEXT_FONT))? platformStorage.getItem(CAPTION_TEXT_FONT) : CAPTION_FONT_DEFAULT;
        captionProperties.textSize = isDefined(platformStorage.getItem(CAPTION_TEXT_SIZE))? platformStorage.getItem(CAPTION_TEXT_SIZE) : CAPTION_TEXT_SIZE_DEFAULT;
        captionProperties.textColor = isDefined(platformStorage.getItem(CAPTION_TEXT_COLOR))? platformStorage.getItem(CAPTION_TEXT_COLOR) : CAPTION_TEXT_COLOR_DEFAULT;
        captionProperties.textOpacity = isDefined(platformStorage.getItem(CAPTION_TEXT_OPACITY))? platformStorage.getItem(CAPTION_TEXT_OPACITY) : CAPTION_TEXT_OPACITY_DEFAULT;
        captionProperties.backgroundColor = isDefined(platformStorage.getItem(CAPTION_BACKGROUND_COLOR))? platformStorage.getItem(CAPTION_BACKGROUND_COLOR) : CAPTION_BACKGROUND_COLOR_DEFAULT;
        captionProperties.backgroundOpacity = isDefined(platformStorage.getItem(CAPTION_BACKGROUND_OPACITY))? platformStorage.getItem(CAPTION_BACKGROUND_OPACITY) : CAPTION_BACKGROUND_OPACITY_DEFAULT;
        captionProperties.windowColor = isDefined(platformStorage.getItem(CAPTION_WINDOW_COLOR))? platformStorage.getItem(CAPTION_WINDOW_COLOR) : CAPTION_WINDOW_COLOR_DEFAULT;
        captionProperties.windowOpacity = isDefined(platformStorage.getItem(CAPTION_WINDOW_OPACITY))? platformStorage.getItem(CAPTION_WINDOW_OPACITY) : CAPTION_WINDOW_OPACITY_DEFAULT;
        captionProperties.edgeStyle = isDefined(platformStorage.getItem(CAPTION_EDGE_STYLE))? platformStorage.getItem(CAPTION_EDGE_STYLE) : CAPTION_EDGE_STYLE_DEFAULT;
    },

    applyCaptionAttributes: function (captionWindow, captionText, captionProperties) {
        $(captionText).css('font-family', String(captionProperties.textFont));
        $(captionText).css('font-size', captionProperties.textSize+'px');
        $(captionText).css('color', captionProperties.textColor);
        $(captionText).css('opacity', captionProperties.textOpacity);
        $(captionText).css('text-shadow', captionProperties.edgeStyle);

        if (captionProperties.backgroundOpacity == 0.0) {
            $(captionText).css('background-color', 'transparent');
        }
        else {
            this.setBackgroundColor(captionText, captionProperties.backgroundColor, captionProperties.backgroundOpacity);
        }

        if (captionProperties.windowOpacity == 0.0) {
            $(captionWindow).css('background-color', 'transparent');
        }
        else {
            this.setBackgroundColor(captionWindow, captionProperties.windowColor, captionProperties.windowOpacity);
        }
    },

    setBackgroundColor: function (captionWindow, bgColor, bgOpacity) {
         var r, g, b;
         for (var i=0; i<this.hexToRgb.length; i++) {
             if (this.hexToRgb[i].value == bgColor) {
                 r = this.hexToRgb[i].r;
                 g = this.hexToRgb[i].g;
                 b = this.hexToRgb[i].b;
                 break;
             }
         }
        $(captionWindow).css('background-color', 'rgba(' + r + ',' + g + ',' + b + ',' + bgOpacity + ')');
    },

    clearCardData: function (rbiCommonService) {
        var cards = helper.GetCards(rbiCommonService);
        if (cards != null) {
            helper.DeleteCards(rbiCommonService);
        }
    },

    addUpdateCreditCardSuccess : function ($scope, $location, accountNumber, rbiCommonService, customerService) {
        if (isDefined(accountNumber) && isDefined($scope.parentobj.titledetailstate)) {
            if (isDefined(platformStorage.getItem("openkioskcheckoutonnavigation")) == false && isDefined(platformStorage.getItem("opentitlecheckoutonnavigation")) == false) {
                addToBackPaths($location.path());
            }
            rbiCommonService.setSharedItem("card_operation", true);
            rbiCommonService.setSharedItem("operated_account_number", accountNumber);
            $scope.$root.showtitleconfirmcheckout = true;
        }
        if ($scope.isSubscriptionSelected && isDefined(accountNumber)) {
            helper.hideSpinner();
            disableHttpSpinner = false; // enable http spinner for other pages
            accountHelper.processCustomerSubscription($scope, $location, accountNumber, customerService);
        }
        else {
            helper.hideSpinner();
            disableHttpSpinner = false; // enable http spinner for other pages
            accountHelper.addUpdateCCRedirectToPrevPage($scope, $location);
        }
    },

    processCustomerSubscription : function ($scope, $location, accountNumber, customerService) {
        customerService.updateSubscriptionCard(accountNumber, function (subscribeCustomerResponse) {
            accountHelper.addUpdateCCRedirectToPrevPage($scope, $location);
        },
        function (data) {
           helper.showErrorMessage(data, $scope);
        });
    },

    addUpdateCCRedirectToPrevPage: function ($scope, $location) {

        if ($scope.isSignupFlow) {
            if ($scope.subscriptionType == NO_SUBSCRIPTION) {
                $location.path("confirmSubscription/Movie");
            }
            else {
                $location.path("subscription");
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            return;
        }

        $scope.creditcard = [];
        platformStorage.removeItem("addCardDetails");
        sessionStorage.removeItem("addCardDetails");
        var checkout_Type = platformStorage.getItem("checkouttype");
        if (isDefined(checkout_Type)) {
            platformStorage.removeItem("checkouttype");
            if (isDefined(platformStorage.getItem(FROM_NEW_ACCT))) {
                platformStorage.removeItem(FROM_NEW_ACCT);
                $location.path(backPaths[backPaths.length - 1]);
            } else {
                if (checkout_Type == 'titleCheckout') {
                    $location.path("/titleCheckout");
                }
                else {
                    $location.path("/kioskCheckout");
                }
            }
        }
        else
            $location.path('/account/creditCards');

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }
};






