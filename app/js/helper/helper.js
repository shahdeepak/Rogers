var SPLIT_VARIABLE = "-+|$|+-";
var screenLog = ["--- onScreen log set for " + config.debug + " lines in config.js ---"];

var helper = {


    ParseUTCDateToLocal: function (str) {
        // we assume str is a UTC date ending in 'Z'

        var parts = str.split('T');
        var dateParts = parts[0].split('-');
        var timeParts = (str.indexOf('Z') != -1)? parts[1].split('Z')[0]:parts[1];
        var timeSubParts = timeParts.split(':');
        var timeSecParts = timeSubParts[2].split('.');
        var timeHours = parseInt(timeSubParts[0]);
        var _date = new Date;

        var year = parseInt(dateParts[0]);
        var month = parseInt(dateParts[1]);
        var day = parseInt(dateParts[2]);
        var min = parseInt(timeSubParts[1]);
        var sec = parseInt(timeSecParts[0]);

        // ZOE-36968: The setUTCDate needs to be called with both month and a day as parameters b/c if user rents a title of the last day of
        // a month that has 31 days that followed by a month that has 30 days, the converted date would be incorrect.
        _date.setUTCFullYear(year);
        _date.setUTCMonth(month-1, day);
        _date.setUTCHours(timeHours);
        _date.setUTCMinutes(min);
        _date.setUTCSeconds(sec);
        if (timeSecParts[1]) _date.setUTCMilliseconds(Number(timeSecParts[1]));

        // by using setUTC methods the date has already been converted to local time
        return _date;
    },

    NewGUID: function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    PushItemToStartOfList: function (filterList, filterValueToMatch) {
        var index = filterList.map(function (element) {
            return element.FilterValue;
        }).indexOf(filterValueToMatch);
        var extract = filterList.splice(index, 1)[0];
        filterList.unshift(extract);
    },

    GetShiftedElementId: function (elementId, shiftPos, levelChange) {
        var arr = elementId.split('_');
        var nextIndex = 0;
        var newElementId = 0;
        if (typeof (levelChange) != 'undefined' && levelChange) {
            nextIndex = (parseInt(arr[0]) + shiftPos);
            newElementId = nextIndex + "_" + "0"; // Moving to the first
            // element of next level
        } else {
            nextIndex = (parseInt(arr[1]) + shiftPos);
            newElementId = arr[0] + "_" + nextIndex;
        }

        return newElementId;
    },

    SetFocus: function (elementId) {
        var element = document.getElementById(elementId);

        if (element) {

            if (typeof ($(element).attr("class")) != 'undefined') {
                var level = elementId.split("_")[0];
                var elemClass = $(element).attr("class").split(" ");
                $(element).addClass(elemClass[0] + "-highlight");
                var shadow = $(element).css('box-shadow');
                $("#" + elementId + "_inp").addClass("inputActive");
                var outerlinewidth = $(element).attr('outerlinewidth');
                if (outerlinewidth != "none" && outerlinewidth != "null") {

                    if (outerlinewidth == "menu") {
                        $(element).addClass('menu-item-ctn-highlight');
                    } else if (outerlinewidth == "preference") {
                        $(element).addClass('menu-item-ctn-highlight');
                    } else {
                        if (elementId == "viewAllButton") {
                            $(element).css('border', outerlinewidth + "  solid white");
                        } else {
                            $(element).css('outline', outerlinewidth + "  solid white");
                        }
                    }
                }

                element.focus();

            } else {
                if (typeof ($(element).attr("class")) != 'undefined') {
                    var elemClass = $(element).attr("class").split(" ");
                    $(element).addClass(elemClass[0] + "-highlight");
                }
                element.focus();

            }


        }
    },
    // Reset the focus
    RemoveFocus: function (elementId) {
        var element = document.getElementById(elementId);

        if (element) {
            if (typeof ($(element).attr("class")) != 'undefined') {
                var level = elementId.split("_")[0];
                var elemClass = $(element).attr("class").split(" ");
                $(element).removeClass(elemClass[0] + "-highlight");
                $(element).removeClass(elemClass[0] + "-hover");
                $(element).removeClass('menu-item-ctn-highlight');

                    if (level == "2") {
                        $(element).css('outline', "0px  solid transparent");
                    } else {
                        if (elementId == "viewAllButton") {
                            $(element).css('border', "3px  solid transparent");
                        } else {
                            $(element).css('outline', "0px  solid transparent");
                        }

                    }
                    var outerlinewidth = $(element).attr('outerlinewidth');
                    if (outerlinewidth != undefined && outerlinewidth != "none" && outerlinewidth != "null") {
                        if (outerlinewidth == "menu") {
                        } else if (outerlinewidth == "preference") {
                            $(element).removeClass("menu-item-ctn-highlight");
                        }
                    }
            }
            element.blur();


        }
    },

    // Set / remove button focus
    SetButtonFocus: function (buttonID) {
        // Button focus
        // var SET_FOCUS_COLOR = '#9b1219';
        //$(buttonID).addClass('button-divHighlight');
        $(buttonID).addClass('red');
        $(buttonID).removeClass('gr');
    },

    RemoveButtonFocus: function (buttonID) {
        //  var REMOVE_FOCUS_COLOR = '#2e3233';
        //$(buttonID).removeClass('button-divHighlight');
        $(buttonID).removeClass('red');
        $(buttonID).addClass('gr');
    },


    ShowPopupBox: function (popupkey, $scope) {

    	 if (popupkey != null) {
    		   if(popupkey == 'Popup_RESTRICT_CONTENT_PASSWORD' || popupkey == 'Popup_RESTRICT_PURCHASE_PASSWORD'){
    		    popupObj_Meta[popupkey].msg_text = popupObj_Meta[popupkey].msg_text_template.replace('{userId}',helper.GetUserId());
    		   }
    		     PopupBox.Show(popupkey, $scope);
    	  }
    },

    showErrorMessage: function (data, $scope, params, useDescription) {

        if (isDefined(data) && data.status == 0) {
            return;  // ignore timeout errors b/c the error message is displayed from the http interceptor
        }

        // If server did not provide valid error message use local error codes

        var errorObject;
        var errorObjectDefault = {
            ResultInfo: { ResultCode: '101'}
        };

        // Check if the error code is in local error code table
        // Used for local error codes and for server error codes that can be overridden locally
        if (isDefined(data)) {
            if (isDefined(data.value) && isDefined(data.value.ResultCode)) {
                errorObject = hashObj[data.value.ResultCode];
            }
            else if (isDefined(data.ResultInfo)) {
                errorObject = hashObj[data.ResultInfo.ResultCode];
            }
            else if (isDefined(data.data) && isDefined(data.data.ResultInfo)) {
                errorObject = hashObj[data.data.ResultInfo.ResultCode];
            }
            else {
                errorObject = hashObj[errorObjectDefault.ResultInfo.ResultCode];
            }
        }
        else {
            helper.debugLog("data not defined");
            errorObject = hashObj[errorObjectDefault.ResultInfo.ResultCode];
        }

        if (errorObject != undefined) {
            helper.debugLog("Error code found in local error code file");
            var RBIErrorObject = {
                title: errorObject.app_error_title,
                publicErrorCode: errorObject.public_error_code,
                msgText: "",
                buttonText: errorObject.ok_button_text,
                yesButtonText: "Yes"
            };

            if (params != null && errorObject.app_error_message.indexOf('{') != -1 && errorObject.app_error_message.indexOf('}') != -1) {
                //replacing the place holders with the actual values
                RBIErrorObject.msgText = errorObject.app_error_message.format(params);
            }
            else {
                RBIErrorObject.msgText = errorObject.app_error_message;
            }
            //create error message from error object
            createErrorPopUp(RBIErrorObject, $scope);
        }
        // Check if server has provided a valid error message
        else if (isDefined(data) && isDefined(data.value) && isDefined(data.value.ResultCode) && isDefined(data.value.MachineID)) {
            helper.debugLog("Error code not found in local error code file - using server error message");
            showRemoteErrors(data.value, $scope);
        }
        else {
            helper.debugLog("Error code not found in local error code file - using default error message");
            PopupBox.Show("Error_PopUp", $scope);
        }
    },

    HidePopupBox: function () {
        PopupBox.Hide();
        //$scope.close();
    },

    //For displaying the alert box for the error codes
    ShowAlertBox: function (popupkey, $scope, $dialog, cntrl) {
        $scope.opts = {
            backdrop: false,
            keyboard: true,
            backdropClick: false,
            //  template: POPUP_ALERT_TEMPLATE, // OR: templateUrl: 'path/to/view.html',
            controller: cntrl
        };
        var errorTitle = popupObj_Meta[popupkey].title_text;
        var errorMessage = popupObj_Meta[popupkey].msg_text;

        var okButtonText = popupObj_Meta[popupkey].button_1_text;

        var btns = [
            { result: 'ok', label: okButtonText, cssClass: 'bootstrap-btn', id: '100_1' }
        ];

        // add the logic to loop over the hashObj to verify the text not blank for the button texts
        //and adding the buttons accordingly

        $dialog.messageBox(errorTitle, errorMessage, btns)
            .open()
            .then(function (result) {
                if (result == "ok") {
                    $scope.handleErrorPopUpClick();


                }
            });

    },

    GetUserId: function () {
    	if (typeof (Storage) !== "undefined") {
        	return platformStorage.getItem("CURRENT_LOGGEDIN_USER");
        }
    },

    SetUserId: function (username) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem("CURRENT_LOGGEDIN_USER", username);
        }
    },

    GetUserPwd: function () {
    	if (typeof (Storage) !== "undefined") {
        	return platformStorage.getItem("CURRENT_LOGGEDIN_USER_PWD");
        }
    },

    SetUserPwd: function (password) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem("CURRENT_LOGGEDIN_USER_PWD", password);
        }
    },
    GetCards: function (rbiCommonService) {
        var cardData = null;
        if (rbiCommonService.isSharedItemExist(CREDIT_CARD_DATA)) {
            cardData = rbiCommonService.getSharedItem(CREDIT_CARD_DATA);
        }
        return cardData;
    },

    SetCards: function (rbiCommonService, cards) {
        rbiCommonService.setSharedItem(CREDIT_CARD_DATA, cards);
    },

    GetPreferredCard: function (rbiCommonService) {
        var preferredCard = null;
        if (rbiCommonService.isSharedItemExist(PREFERRED_CARD)) {
            preferredCard = rbiCommonService.getSharedItem(PREFERRED_CARD);
        }
        return preferredCard;
    },

    SetPreferredCard: function (rbiCommonService, card) {
        rbiCommonService.setSharedItem(PREFERRED_CARD, card);
    },

    DeletePreferredCard: function (rbiCommonService) {
        if (rbiCommonService.isSharedItemExist(PREFERRED_CARD)) {
            rbiCommonService.removeSharedItem(PREFERRED_CARD);
        }
    },

    GetSubscriptionCard: function (rbiCommonService) {
        var subscriptionCard = null;
        if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_CARD)) {
            subscriptionCard = rbiCommonService.getSharedItem(SUBSCRIPTION_CARD);
        }
        return subscriptionCard;
    },

    SetSubscriptionCard: function (rbiCommonService, card) {
        rbiCommonService.setSharedItem(SUBSCRIPTION_CARD, card);
    },

    DeleteSubscriptionCard: function (rbiCommonService) {
        if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_CARD)) {
            rbiCommonService.removeSharedItem(SUBSCRIPTION_CARD);
        }
    },

    DeleteCards: function (rbiCommonService) {
        if (rbiCommonService.isSharedItemExist(CREDIT_CARD_DATA)) {
            rbiCommonService.removeSharedItem(CREDIT_CARD_DATA);
        }
		if (rbiCommonService.isSharedItemExist(IS_CHECKOUT_CARD)) { // Code added for "ZOE-33385"
            rbiCommonService.removeSharedItem(IS_CHECKOUT_CARD);
        }
        helper.DeletePreferredCard(rbiCommonService);
        helper.DeleteSubscriptionCard(rbiCommonService);
    },
    IsValidPassword: function (inputPassword) {
        //TODO:: Need to return correct password match
        return true;
    },

    //Method to convert time miliseconds in to hour-minutes format
    // Returns a fomatted time string: hh:mm padded with zeroes rounded to the next minute
    GetFormattedTime: function (timeMs) {

        var remainingTimeSec = Math.floor(timeMs / SECONDS_TO_MS);
        var formattedTime = '00:00';

        if (remainingTimeSec > 0) {
            var seconds = remainingTimeSec % 60;
            var minutes = Math.floor(remainingTimeSec / 60) % 60;
            var hours = Math.floor(remainingTimeSec / 3600) % 24;
            if (seconds > 30) {
                minutes++; // round to the next minute
            }
            var formattedTime = helper.padWithZeroes(hours,2) + ':' + helper.padWithZeroes(minutes,2);

            helper.debugLog("Time in ms: " + timeMs + ", formattedTime: " + formattedTime);
        }
        return formattedTime;
    },

    // Method to convert running time in to miliseconds
    ConvertRunningTime: function (runningtime, scalingFactor) {
        var timeData = runningtime.split(":");
        var hours = parseInt(timeData[0]);
        var minutes = parseInt(timeData[1]);
        var seconds = parseInt(timeData[2]);
        var totalmiliseconds = (((hours * 3600) + (minutes * 60) + seconds))*scalingFactor;

        return totalmiliseconds;
    },

    GetProgressWatchedPercentage: function (progressWatched, runningTime, isComplete) {
        var progressWatchedPerc = 0;
        if (progressWatched == 0) {
            progressWatchedPerc = (isComplete) ? 100 : 0;
        }
        else {
            var runningTimeMs = helper.ConvertRunningTime(runningTime, SECONDS_TO_MS);
            helper.debugLog("progressWatched: " + progressWatched + ", running time: " + runningTimeMs);
            progressWatchedPerc = (progressWatched < runningTimeMs) ? Math.floor((progressWatched * 100) / runningTimeMs) : 100;
        }
        return progressWatchedPerc;
    },


    // Method to get user rating closest to star
    calcAvgUserRating: function (aveUserRating) {
        var i = 0;
        var rating = parseInt(aveUserRating);
        var ratingArray = [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        var closest = null;

        rating = rating * .100;
        $.each(ratingArray, function () {
            if (closest == null || Math.abs(this - rating) < Math.abs(closest - rating)) {
                closest = this;
            }
        });
        return closest;
    },

    // Method to get offset into star png image and return background-position
    getAvgUserPngOffset: function (avgUserRating) {
        var closest = null;
        var mapArray = [
            [0, "0px 0px"],
            [.5, "0px -20px"],
            [1, "0px -40px"],
            [1.5, "0px -60px"],
            [2, "0px -80px"],
            [2.5, "0px -100px"],
            [3, "0px -120px"],
            [3.5, "0px -140px"],
            [4, "0px -160px"],
            [4.5, "0px -180px"],
            [5, "0px -200px"]
        ];

        for (i = 0; i < mapArray.length; i++) {
            if (avgUserRating == mapArray[i][0]) {
                return mapArray[i][1];
            }
        }
    },
    isUserLoggedIn: function () {
        if (isDefined(platformStorage.getItem("isLoggedIn")) == true) {
            return true;
        }
        else {
            return false;
        }
    },

    isFreeTrialUsed: function () {
    	if(platformStorage.getItem("IsFreeTrialUsed") != null && platformStorage.getItem("IsFreeTrialUsed") != undefined && platformStorage.getItem("IsFreeTrialUsed") != "false" &&( platformStorage.getItem("IsFreeTrialUsed") == "true" || platformStorage.getItem("IsFreeTrialUsed") == true)){
    		return true;
    	}else{
    		return false;
    	}
    },

    isSubscribedCustomer: function () {
        if (platformStorage.getItem(SUBSCRIBED) != null && platformStorage.getItem(SUBSCRIBED) != undefined && platformStorage.getItem(SUBSCRIBED) == "true") {
            return true;
        }
        else {
            return false;
        }
    },

    logoutUser: function () {
        if (isDefined(platformStorage.getItem("isLoggedIn")) == true) {
            platformStorage.removeItem("isLoggedIn");
            platformStorage.removeItem("CURRENT_LOGGEDIN_USER");
            platformStorage.removeItem("CURRENT_LOGGEDIN_USER_PWD");
            platformStorage.removeItem("IsFreeTrialUsed");
            platformStorage.removeItem("user_zipcode");
            platformStorage.removeItem("kiosk_ids");
            platformStorage.removeItem("is_Helpoverlayeopen");
            platformStorage.removeItem("USERNAME");
            platformStorage.removeItem("PASSWORD");
            platformStorage.removeItem("LOCALDATA");
            platformStorage.removeItem("PCN");
            platformStorage.removeItem("checkouttype");
            sessionStorage.removeItem("imageTitle");
            sessionStorage.removeItem("imageURL");
            sessionStorage.removeItem("searchFilters");
            sessionStorage.removeItem("addr");
            sessionStorage.removeItem("rec_kiosks");
            helper.clearLocalStorage("browseFilter");
            helper.clearLocalStorage("browseFilterForKiosk");

        }
    },

    getTimeRemaining: function (runningtime, progressWatched) {
        var runningTimeMs = helper.ConvertRunningTime(runningtime, SECONDS_TO_MS);
        var timeRemaining = 0;
        if (progressWatched < runningTimeMs) {
            timeRemaining = runningTimeMs - progressWatched;
        }
        return timeRemaining;
    },

    //Returns current kioskid for a kioskkey from local storage if it is supported
    GetCurrentKiosk: function (SELECTED_KOISK_KEY) {
        if (typeof (Storage) !== "undefined") {
            var kiosk = platformStorage.getItem(SELECTED_KOISK_KEY);
            if (isDefined(kiosk))
                return JSON.parse(kiosk);
            else {
                return null;
            }
        }
    },

    //Saves current kioskid  for a kioskkey in local storage if it is supported
    SaveCurrentKiosk: function (kiosk, SELECTED_KOISK_KEY) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem(SELECTED_KOISK_KEY, JSON.stringify(kiosk));
        }
        //else
        //  TODO : add logic to handle if local storage is not supported.
    },
    //Returns stored state for a page key from local storage if it is supported
    GetPageState: function (pagekey) {
        if (typeof (Storage) !== "undefined") {
            var state = platformStorage.getItem(pagekey);
            return state;
        }
    },
    SaveCurrentBrowseFilters: function (filters, KEY) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem(KEY, JSON.stringify(filters));
        }
    },
    SaveCurrentCheckoutdata: function (filters, KEY) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem(KEY, JSON.stringify(filters));
        }
    },
    /*GetStorageUser: function () {
     if (typeof (Storage) !== "undefined") {
     var username = helper.getStorageData("LOCALDATA");
     username = sjcl.decrypt(config.encryptionKey, username);
     return username.split(SPLIT_VARIABLE)[0];
     }
     },
     SetStorageUser: function (username) {
     if (typeof (Storage) !== "undefined") {
     helper.setStorageData("USERNAME", sjcl.encrypt(config.encryptionKey, username));
     }
     },*/
    /*setLocalData: function (username, password) {
     var localData = username + SPLIT_VARIABLE + password + SPLIT_VARIABLE + Utility.DeviceID();
     if (typeof (Storage) !== "undefined") {
     helper.setStorageData("LOCALDATA", sjcl.encrypt(config.encryptionKey, localData));
     }
     },*/

    /*getLocalData: function (value) {
     if (typeof (Storage) !== "undefined") {
     if (value == USER_DATA.FIRST_ELEMENT) {
     var username = helper.getStorageData("LOCALDATA");
     username = sjcl.decrypt(config.encryptionKey, username);
     return username.split(SPLIT_VARIABLE)[0];
     }
     else if (value == USER_DATA.SECOND_ELEMENT) {
     var password = helper.getStorageData("LOCALDATA");
     password = sjcl.decrypt(config.encryptionKey, password);
     return password.split(SPLIT_VARIABLE)[1];
     }
     }
     },*/
    /*GetStoragePassword: function () {
        if (typeof (Storage) !== "undefined") {
            var password = helper.getStorageData("LOCALDATA");
            password = sjcl.decrypt(config.encryptionKey, password);
            return password.split(SPLIT_VARIABLE)[1];
        }
    },
    SetStoragePassword: function (password) {
        if (typeof (Storage) !== "undefined") {
            helper.setStorageData("PASSWORD", sjcl.encrypt(config.encryptionKey, password));
        }
    },*/
    SaveCurrentSearchFilters: function (filters, KEY) {
        if (typeof (Storage) !== "undefined") {
            sessionStorage.setItem(KEY, JSON.stringify(filters));
        }
    },
    SaveAddCardDetails: function (filters, KEY) {
        if (typeof (Storage) !== "undefined") {
            sessionStorage.setItem(KEY, JSON.stringify(filters));
        }
    },
    //Returns current search for a searchkey from session storage if it is supported
    getStoredSearchFilters: function (KEY) {
        if (typeof (Storage) !== "undefined") {
            var search = sessionStorage.getItem(KEY);
            if (isDefined(search))
                return JSON.parse(search);
            else {
                return null;
            }
        }
    },
    getAddCardDetails: function (KEY) {
        if (typeof (Storage) !== "undefined") {
            var cardDetails = sessionStorage.getItem(KEY);
            if (isDefined(cardDetails))
                return JSON.parse(cardDetails);
            else {
                return null;
            }
        }
    },
    //Returns current kioskid for a kioskkey from local storage if it is supported
    getStoredBrowseFilters: function (KEY) {
        if (typeof (Storage) !== "undefined") {
            var kiosk = platformStorage.getItem(KEY);
            if (isDefined(kiosk))
                return JSON.parse(kiosk);
            else {
                return null;
            }
        }
    },
    getStoredcheckoutdata: function (KEY) {
        if (typeof (Storage) !== "undefined") {
            var kiosk = platformStorage.getItem(KEY);
            if (isDefined(kiosk))
                return JSON.parse(kiosk);
            else {
                kiosk = '';
                return kiosk;
            }
        }
    },
    //set preferences for restricted content
    SetRestrictContent: function (value) {
        var userId = helper.GetUserId();
        if (typeof (Storage) !== "undefined") {
            helper.debugLog("SetRestrictContent: Platform storage key: PREFERENCES_RESTRICT_CONTENT_KEY_" + userId);
            platformStorage.setItem('PREFERENCES_RESTRICT_CONTENT_KEY' + "_" + userId, value);
        }
    },

    clearLocalStorage: function (key) {
        platformStorage.removeItem(key);
    },

    //get preferences for restricted content
    GetRestrictContent: function () {
        var userId = helper.GetUserId();
        if (typeof (Storage) !== "undefined") {
            helper.debugLog("GetRestrictContent: Platform storage key: PREFERENCES_RESTRICT_CONTENT_KEY_" + userId);
            var data = platformStorage.getItem('PREFERENCES_RESTRICT_CONTENT_KEY' + "_" + userId);
            if (isDefined(data)) {
                data = JSON.parse(data);
            }
            return data;
        }
    },

    //set preferences for restricted purchase
    SetRestrictPurchase: function (value) {
        var userId = helper.GetUserId();
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem("PREFERENCES_RESTRICT_PURCHASE_KEY" + "_" + userId, value);
        }
    },

    //get preferences for restricted purchase
    GetRestrictPurchase: function () {
        var userId = helper.GetUserId();
        if (typeof (Storage) !== "undefined") {
            var data = platformStorage.getItem("PREFERENCES_RESTRICT_PURCHASE_KEY" + "_" + userId);
            if (isDefined(data)) {
                data = JSON.parse(data);
            }
            return data;
        }
    },

    //set preferences complete response
    SetPreferencesData: function (value) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem("PREFERENCES_DATA_KEY", value);
        }
    },

    //get preferences data
    GetPreferencesData: function () {
        if (typeof (Storage) !== "undefined") {
            var data = platformStorage.getItem("PREFERENCES_DATA_KEY");
            return data;
        }
    },

    setStorageData: function (key, value) {
        if (typeof (Storage) !== "undefined") {
            platformStorage.setItem(key, value);
        }
    },

    getStorageData: function (key) {
        if (typeof (Storage) !== "undefined") {
            var data = platformStorage.getItem(key);
            return isDefined(data)? data:"";
        }
    },


    isDefined: function (obj) {
        if (typeof obj != 'undefined' && obj != null && obj != 'null' && obj != '' && obj != undefined) {
            return true;
        }
        return false;
    },

    hasKioskBadge: function (badges) {
        for (var i = 0; i < badges.length; i++) {
            if (badges[i] == RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK) {
                return true;
            }
        }
        return false;
    },

    hasSubscriptionBadge: function (badges) {
        for (var i = 0; i < badges.length; i++) {
            if (badges[i] == RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION) {
                return true;
            }
        }
        return false;
    },

    hasRentBuyBadge: function (badges) {
        for (var i = 0; i < badges.length; i++) {
            if (badges[i] == RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND) {
                return true;
            }
        }
        return false;
    },

    getTitleWidth: function (imagePosterWidth, numBadges, badgeWidth) {
        return imagePosterWidth - numBadges * badgeWidth;
    },

    // This function is used to determine if scrolling
    // of a title is needed based on number of badges.
    needsScroll: function (title, numBadges, isKioskBadge) {
        var maxLength;
        if (isKioskBadge && numBadges > 0) numBadges++; // adjust for wider badges at kiosk - treat 1 badge as 2 and 2 badges as 3
        maxLength = platformInfo.MAX_TITLE_LENGTH[numBadges];
        return (title.length > maxLength);
    },

    convertArrayToString: function (array) {
        var str = '';
        if (array != null) {
            if (array.length > 0) {
                for (var i = 0; i < array.length - 1; i++) {
                    str += array[i] + ', ';
                }
                str += array[array.length - 1];
            }
        }
        return str;
    },

    truncateString: function (str, maxLength) {
        if (typeof str !== 'undefined' && str !== null && str != "" && str.length > maxLength) {
            str = str.substring(0, maxLength - 1) + "...";
        }
        return str;
    },

    showSpinner: function (spinnerFadeoutMs, spinnerPos) {
        if (typeof vod !== "undefined") {
            vod.showSpinnerWithoutBackground(spinnerFadeoutMs, spinnerPos);
        }
        else {
            //  Set the spinner visibility and adjust the top coordinate
            var spinnerPosTop = (spinnerPos.y - 35) +'px';
            helper.debugLog("spinner pos: " + spinnerPosTop);
            //$("#spinner").css("visibility", "visible");
            $("#spinner").show();
            $("#spinner").css("top", spinnerPosTop);
        }
    },

    getLocalDateTimeFormatForPromotions: function () {
        var d = new Date();

        function pad(n) { return n < 10 ? '0' + n : n; }

        return d.getFullYear() + '-'
            + pad(d.getMonth() + 1) + '-'
            + pad(d.getDate()) + 'T'
            + pad(d.getHours()) + ":"
            + pad(d.getMinutes()) + ":"
            + pad(d.getSeconds())+ "."
            + pad(d.getMilliseconds());
    },
    hideSpinner: function () {
        if (typeof vod !== "undefined") {
            vod.hideSpinner(0);
        }
        else {
            $("#spinner").hide();
        }
    },

    getTitleDetailState: function ($scope) {
        $scope.parentobj = helper.getStoredcheckoutdata("checkoutdata").titleDetailState;
        return $scope.parentobj;

    },

    setTitleDetailState: function ($scope, productId, purchaseOption, account, popupToOpen) {
        $scope.parentobj.titleDetailState = new Object;
        $scope.parentobj.titleDetailState.ProductId = productId;
        $scope.parentobj.titleDetailState.PurchaseOption = purchaseOption;
        $scope.parentobj.titleDetailState.Account = account;
        $scope.parentobj.titleDetailState.PopupToOpen = popupToOpen;

        helper.SaveCurrentCheckoutdata($scope.parentobj, "checkoutdata");
    },

    removeTitleDetailState: function ($scope) {
        if (helper.isDefined($scope.parentobj)) {
            $scope.parentobj.titleDetailState = null;
        }


        platformStorage.removeItem("checkoutdata");

    },

    isTitleContentResticted: function (productRating) {

        var restrictContent = false;
        var restrictContentObject = helper.GetRestrictContent();
        //var productDetail = $scope.product.Rating;
        //if($scope.product != undefined && restrictContent != undefined){
        if (isDefined(restrictContentObject) && isDefined(productRating)) {
            var ratingsAllowed = restrictContentObject.value.RatingsAllowed;
            if (ratingsAllowed.length > 0) {
                restrictContent = true;
                //var productRating = $scope.product.value.Rating;

                for (var index = 0; index < ratingsAllowed.length; index++) {
                    if (productRating == ratingsAllowed[index]) {
                        restrictContent = false;
                        break;
                    }
                }
            }
        }
        return restrictContent;

    },

    isOnline: function (funcCallback) {
        var testUrl = config.urlToVerifyOnline + '?n=' + Math.random();
        $.ajax(
            {url: testUrl, timeout: 3000,async :false,
                success: function (result) {
                    helper.debugLog("success on " + testUrl);
                    funcCallback(true);
                    internetConnected = true;
                },
                error: function (result) {
                    helper.debugLog("fail on " + testUrl);
                    funcCallback(false);
                    internetConnected = false;
                }
            });
    },


    /* Debug logging */
    debugLog: function (logData) {
        try {
            logData = JSON.stringify(logData);
        } catch (a) {
            console.log(logData);
        }

        if (config.debug > 1) {
            $('#screenLog').show();
            screenLog.push(logData);
            if (screenLog.length > config.debug)
                screenLog.shift();
            $('#screenLog').html(screenLog.join('<br>'));
        }

        if (config.debug)
            platformLogger.log(logData);
    },
    convertBytes : function(bytes){

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];

    }
    ,
    LGMemoryInfo : function(){
        var usedMemorySize;
        if(window.NetCastGetUsedMemorySize) {
             usedMemorySize = helper.convertBytes(window.NetCastGetUsedMemorySize());
             helper.debugLog("Used Memory Size is: "+usedMemorySize);
         }
    }
    ,
    ReleaseMemory: function () {
        if (typeof vod !== 'undefined') {
            // temporary settings
            //var keyRepeatInterval = 200;
            //vod.setKeyRepeatInterval(keyRepeatInterval);

            var memoryInfo;
            memoryInfo = vod.memoryInfo();
            var memAvail = helper.convertBytes(memoryInfo.Available);
            var memUsed = helper.convertBytes(memoryInfo.Used);
            helper.debugLog("MEM Available:" +memAvail+", MEM Used:" + memUsed);
            vod.releaseMemory();
        }
    },
    getMyRedboxTabName: function (tabIndex) {
        var tabName;
        switch (tabIndex) {
			case 0:
                tabName = "dashboard";
                break;
            case 1:
                tabName = "watch history";
                break;
            case 2:
                tabName = "bookmarks";
                break;
            case 3:
                tabName = "purchases";
                break;
            default:
                tabName = "my redbox";
                break;
        }
        return tabName;
    },

    // Show exit application popup
    showExitPopup: function (keyCode) {
        if (POP_ALERT_BOX_VISIBLE == false) {
            var popupKey = "Popup_EXIT_APP";
            POP_ALERT_BOX_VISIBLE = true;
            PREFERENCE_POP_UP_VISIBLE = false;

            popupObj_Meta[popupKey].button_2_click = function () {
                //helper.HidePopupBox();
                platformInfo.exitApp(keyCode);

            };
            popupObj_Meta[popupKey].button_1_click = function () {
                helper.HidePopupBox();
            };
           helper.ShowPopupBox(popupKey, $scope);
        } else if (POP_ALERT_BOX_VISIBLE == true && keyCode != undefined && keyCode == KEY_CODES.CIRCLE) { // Hide if popup if back button is pressed
            helper.HidePopupBox();
        }else if (UPGRADE_POP_UP_VISIBLE == true) { 
        	// redirect user to smartHub
        	helper.debugLog("Exit App");
        	platformInfo.exitApp(KEY_CODES.EXIT);
        }
    },

    /**
     * getMaxDescriptionLength
     * Find out how many characters will fit into available space based on number of lines and number
     * of characters per line
     *
     * @param descr
     * @param numLines
     * @param numCharsPerLine
     * @returns {number}
     */
    getMaxDescriptionLength: function (descr, numLines, numCharsPerLine) {
        if (!isDefined(descr)) {
            // ZOE 27475 - title description missing
            return 0;
        }
        var words = descr.split(' ');
        var lineNum = 1;
        var startIndex = 0;
        var maxLength = 0;
        while (lineNum <= numLines) {
            var lineLength = 0;
            var index = startIndex;
            var currentWordLength;
            while (index < words.length) {
                currentWordLength = words[index].length + 1;
                if (lineLength + currentWordLength <= numCharsPerLine + 1) {
                    lineLength += currentWordLength;
                    index++;
                }
                else {
                    // move to next line
                    startIndex = index;
                    break;
                }
            }
            helper.debugLog("getMaxDescriptionLength: Line number: " + lineNum + ", number of characters: " + lineLength);
            maxLength += lineLength;
            lineNum++;
        }
        helper.debugLog("getMaxDescriptionLength: maxLength: " + maxLength);
        return  maxLength;
    },

    // Process free trial
    // For existing customers check if there is a CC on file; if there is one, go to subscription page,
    // otherwise go to add card page.
    processFreeTrial: function ($scope, $location, customerService, rbiCommonService, isExistingCustomer) {

        var addCreditCard = function () {
            rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, FREE_TRIAL);
            rbiCommonService.setSharedItem("isFirstCard", true);
            $location.path("/account/creditCards/cardDetails/add");
        };

        if (isExistingCustomer) {
            customerService.getCards(rbiCommonService,
                function (data) {
                    if (data.length > 0) {
                        rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, FREE_TRIAL);
                        $location.path("/subscription");
                    }
                    else {
                        addCreditCard();
                    }
                },
                function (data) {
                    // show error message go back to home page
                    helper.showErrorMessage(data, $scope);
                    $location.path("/home");
                });
        }
        else {
            addCreditCard();
        }
    },

    isFreeTrialEntry: function (rbiCommonService) {
        var isFreeTrialEntry = false;
        if (rbiCommonService.isSharedItemExist(FREE_TRIAL_ENTRY)) {
            isFreeTrialEntry = rbiCommonService.getSharedItem(FREE_TRIAL_ENTRY);
            rbiCommonService.removeSharedItem(FREE_TRIAL_ENTRY);
        }
        return isFreeTrialEntry && !helper.isFreeTrialUsed();
    },

    /// This is function pops the current screen from the stack.
    //  Used for login to bypass circular navigation issues
    /// Since it was causing circular navigation issues, also the stack had duplicate paths..
    removePageFromBackPaths: function (pageUrl) {
        if (isDefined(backPaths) && backPaths.length > 0) {
            for (var i = (backPaths.length - 1); i >= 0; i--) {
                helper.debugLog("i is:" + i);
                if (backPaths[i].indexOf(pageUrl) != -1) {
                    backPaths.pop();
                    helper.debugLog("----POP " + pageUrl + "----" + i);
                    break;
                }
            }
        }
    },

    clearSignupFlags: function (rbiCommonService) {
        if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_TYPE)) {
            rbiCommonService.removeSharedItem(SUBSCRIPTION_TYPE);
        }
        if (rbiCommonService.isSharedItemExist("HD_ASSET")) {
            rbiCommonService.removeSharedItem("HD_ASSET");
        }
        if (rbiCommonService.isSharedItemExist(PLAYBACK_TITLE_URL)) {
            rbiCommonService.removeSharedItem(PLAYBACK_TITLE_URL);
        }
        if (rbiCommonService.isSharedItemExist(RATING)) {
            rbiCommonService.removeSharedItem(RATING);
        }
    },

    // Returns true if there is no subscription
    checkSubscription: function (rbiCommonService) {
        var hasNoSubscription = false;
        if (rbiCommonService.isSharedItemExist("SUBSCRIPTION")) {
            var subscription = rbiCommonService.getSharedItem("SUBSCRIPTION");
            if (!isDefined(subscription)) {
                hasNoSubscription= true;
            }
        }
        return hasNoSubscription;
    },

    // ZOE 30155
    // Process existing customer by checking if the billing info is complete and prompt for missing
    // billing address
    processCustomerData: function (customerData, customerService, rbiCommonService, $scope, $location) {
        // Check for the expired subscription first
        if (customerData.getNotifyOfSubscriptionFail()) {
            // ZOE-30490: Notification of Expired Subscription
            var popupKey = "Popup_NOTIFY_OF_SUBSCRIPTION_FAIL";

            // Go to credit card update page
            var okCallback = function () {
                $scope.updateRequiredPopupVisible = false;
                customerService.getCards(rbiCommonService, function (data) {
                    var subscriptionCard = customerService.getSubscriptionCard(data);
                    if (subscriptionCard != null) {
                        rbiCommonService.setSharedItem(SUBSCRIPTION_CARD_EXPIRED, subscriptionCard.isExpired);
                        $scope.returnUrl = "account/creditCards/cardDetails/modify/" + subscriptionCard.getAccountNumber();
                    }
                    else {
                        $scope.returnUrl = "account/creditCards/cardDetails/add/";
                    }

                    helper.updateNotifyOfSubscriptionFail(customerData, customerService, $scope, $location);
                }, function (data) {
                    helper.debugLog("Get Cards error");
                    helper.showErrorMessage(data, $scope);
                    helper.redirectFromLoginPage($scope, $location);
                });
            };

            // redirect back from login page
            var cancelCallback = function () {
                $scope.updateRequiredPopupVisible = false;
                helper.updateNotifyOfSubscriptionFail(customerData, customerService, $scope, $location);
            }
            helper.showUpdateRequiredPopup($scope, popupKey, null, okCallback, cancelCallback);
        }
        else if (customerData.getSubscriptionID() != null) {
            // user has a valid subscription
            // validate subscription billing CC
            var formattedBillingDate = helper.formatDate(customerData.getSubscriptionAnniversaryDate());
            var billingDate = helper.getDateFromFormattedString(formattedBillingDate);
            helper.debugLog("Valid subscription; subscription ID: " + customerData.getSubscriptionID() + " next billing date: " + formattedBillingDate);
            customerService.getCards(rbiCommonService, function (data) {
                var subscriptionCard = customerService.getSubscriptionCard(data);
                var isExpired = helper.isSubsciptionCardExpired(subscriptionCard, billingDate);
                helper.debugLog("Subscription card; expired: " + isExpired);
                //ZOE-30942
                //PS4: Remove CVVCHECKED and AVSCHECKED during LOGIN flow.
                // ZOE-31271: Removed 'isValid()' check since this value is set to false if either CVVCHECKED or AVSCHECKED is false
                if (isExpired || !helper.isCardDataComplete(subscriptionCard)) {
                    // show update required popup
                    helper.debugLog("Update required");
                    var popupKey = "Popup_UPDATE_REQUIRED";
                    var popupMessage = popupObj_Meta[popupKey].msg_text_template.replace("{cardNumber}", subscriptionCard.getLastFour()).replace("{billingDate}", formattedBillingDate);
                    var subscriptionReferenceNo = customerData.getSubscriptionBillingAccountReference();

                    // Go to credit card update page
                    var okCallback = function () {
                        helper.HidePopupBox();
                        $scope.updateRequiredPopupVisible = false;
                        rbiCommonService.setSharedItem(SUBSCRIPTION_CARD_EXPIRED, isExpired);
                        rbiCommonService.setSharedItem("subscriptionReferenceNo", subscriptionReferenceNo);
                        $location.path("/account/creditCards/cardDetails/modify/" + subscriptionCard.getAccountNumber());
                    };

                    // redirect back from login page
                    var cancelCallback = function () {
                        helper.HidePopupBox();
                        $scope.updateRequiredPopupVisible = false;
                        helper.redirectFromLoginPage($scope, $location);
                    }
                    helper.showUpdateRequiredPopup($scope, popupKey, popupMessage, okCallback, cancelCallback);
                }
                else {
                    helper.debugLog("Account up to date");
                    helper.redirectFromLoginPage($scope, $location);
                }

            }, function (data) {
                helper.debugLog("Get Cards error");
                helper.showErrorMessage(data, $scope);
                helper.redirectFromLoginPage($scope, $location);
            });

       }
       else if (rbiCommonService.isSharedItemExist(PLAYBACK_TITLE_URL)) {
            // If  PLAYBACK_TITLE_URL is set on login, then we navigated here from title details
            if (customerData.isFreeTrialUsed()) {
                // Inline upgrade, no free trial
                $location.path("/subscribeNoFreeTrial");
            }
            else {
                // Go to FT page
                $location.path("/freeTrial");
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            //$scope.$apply();
        }
        else {
            helper.redirectFromLoginPage($scope, $location);
        }
    },

    // Added first name and last name check to the address check
    isCardDataComplete: function (card) {
        var fistName = card.getFirstName();
        var lastName = card.getLastName();
        var address = card.getAccountBillingAddress();
        var retValue = false;

        if (isDefined(fistName) && fistName != 'NULL'&&
            isDefined(lastName) && lastName != 'NULL' &&
            isDefined(address) &&
            isDefined(address.StateCd) && address.StateCd != 'NULL'&&
            isDefined(address.CityName) && address.CityName != 'NULL'&&
            isDefined(address.StreetAddressLine1) && address.StreetAddressLine1 != 'NULL' &&
            isDefined(address.ZipPostalCode) && address.ZipPostalCode != 'NULL') {
            helper.debugLog ('Card data complete');
            retValue = true;
        }
        else {
            helper.debugLog ('Card data incomplete');
        }
        return retValue;
    },


    redirectFromLoginPage : function ($scope, $location) {
        if ($scope.returnUrl != "") {
            $location.path('/' + $scope.returnUrl);
        }
        else {
            // if return URL is not specified use back paths
            goToPreviousPath($scope, KEY_CODES.CIRCLE, $location);
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    },

    /**
     * This function is used both for 'update required' popup and notifyOfSubscriptionFail popup
     *
     * @param $scope
     * @param popupKey       - key that specifies the popup metadata
     * @param popupMessage   - optional (if it is null, the default message is used)
     * @param okCallback     - callback when user hits 'ok' button
     * @param cancelCallback - callback when user hits 'cancel' button
     * @param checkboxId     - optional (if specified the popup has a checkbox that will be highlighted)
     */
    showUpdateRequiredPopup : function ($scope, popupKey, popupMessage, okCallback, cancelCallback) {
        $scope.updateRequiredPopupVisible = true;

        if (popupMessage != null) {
            popupObj_Meta[popupKey].msg_text = popupMessage;
        }
        popupObj_Meta[popupKey].button_1_click = function () {
            cancelCallback();
        };

        popupObj_Meta[popupKey].button_2_click = function () {
            okCallback();
        };

        helper.ShowPopupBox(popupKey, $scope);
    },

    // ZOE-30490: Notification of Expired Subscription
    // check/uncheck checkbox
        clickCheckbox : function(elementId)  {
        if (!helper.checkboxHasFocus(elementId)) {
            helper.setCheckboxFocus(elementId);
        }
        if(helper.isCheckboxChecked(elementId)){
            $('#' + elementId).removeClass("highlight-selected");
        }
        else {
            $('#' + elementId).addClass("highlight-selected");
        }
    },

    // set checkbox focus
    setCheckboxFocus: function(elementId) {
        $('#' + elementId).addClass("highlight");
        if (helper.isCheckboxChecked(elementId)) {
            $('#' + elementId).removeClass("checked");
            $('#' + elementId).addClass("highlight-selected");
        }
    },

    // remove checkbox focus
    removeCheckboxFocus: function(elementId) {
        $('#' + elementId).removeClass("highlight");
        if (helper.isCheckboxChecked(elementId)) {
            $('#' + elementId).removeClass("highlight-selected");
            $('#' + elementId).addClass("checked");
        }
    },

    // check if the checkbox has focus
    checkboxHasFocus: function(elementId) {
        if ($('#' + elementId).hasClass("highlight")) {
            return true;
        }
        else {
            return false;
        }
    },

    // check if the checkbox is checked
    isCheckboxChecked: function (elementId) {
        if($("#" + elementId).hasClass("checked") || $('#' + elementId).hasClass("highlight-selected")){
            return true;
        }
        else {
            return false;
        }
    },

    // ZOE-30490: Notification of Expired Subscription
    // if "Do not remind me again checkbox is checked call update customer API with otifyOfSubscriptionFail = false
    updateNotifyOfSubscriptionFail: function (customerData, customerService, $scope, $location) {
        var checkboxId = popupObj_Meta['Popup_NOTIFY_OF_SUBSCRIPTION_FAIL'].checkboxId;
        if(helper.isCheckboxChecked (checkboxId)){
            helper.debugLog("Do not remind me checkbox checked - calling UpdateCustomer");
            var updateCustomerData = {
                firstName: customerData.getFirstName(),
                lastName: customerData.getLastName(),
                zipCode: customerData.getZipCode(),
                notifyOfSubscriptionFail: false
            };
            customerService.updateCustomer(updateCustomerData, function (data) {
                helper.debugLog(data);
                helper.redirectFromLoginPage($scope, $location);
            }, function (data) {
                helper.debugLog("UpdateCustomer call failed!");
                helper.redirectFromLoginPage($scope, $location);
            });
            helper.HidePopupBox();
        }
        else {
            helper.debugLog("Do not remind me checkbox not checked");
            helper.HidePopupBox();
            helper.redirectFromLoginPage($scope, $location);
        }
    },


    // Format date from server format yyyy-mm-ddThh:mm:ss to traditional format: mm/dd/yyyy
    formatDate: function (dateStr) {
        var array = dateStr.split("T");
        var dates = array[0].split("-");
        var convertedDate = dates[1] + "/" + dates[2] + "/" + dates[0];
        return convertedDate;
    },


    // mm/dd/yyyy -> Date
    getDateFromFormattedString: function (formattedDate) {
        var splitDate = formattedDate.split('/');
        return new Date(splitDate[2], splitDate[0] - 1, splitDate[1]); // yyyy, mm, dd
    },

    // Check card expiration date for a subscription card
    // The expiration date needs to be in next month or later
    isSubsciptionCardExpired: function (card, billingDate) {
        var expMonth = parseInt(card.getExpirationMonth());
        var expYear = parseInt('20' + card.getExpirationYear());
        var isExpired = false;
        var billingMonth =  billingDate.getMonth() + 1;   // javascript month starts with 0
        var billingYear = billingDate.getFullYear();

        if (expYear < billingYear) {
            isExpired = true;
        }
        else if (expYear == billingYear && expMonth < billingMonth) {
            isExpired = true;
        }

        return isExpired;
    },

    // Card validation for checkout transactions:
    // - AVS/CVV check
    // - expiration date check
    // - check if name/address is filled out
    isValidCheckoutCard: function(card) {
        isValid = false;
        if (card != undefined && card != null) {
            var isCardDataComplete = helper.isCardDataComplete(card);
            if (isCardDataComplete && card.getAVSChecked() && card.getCVVChecked() && !card.isExpired()) {
                isValid = true;
            }
            helper.debugLog("card.getAVSChecked()==" + card.getAVSChecked());
            helper.debugLog("card.getCVVChecked()==" + card.getCVVChecked());
            helper.debugLog("card.isExipred()==" + card.isExpired());
            helper.debugLog("card data complete" + isCardDataComplete);
        }

        return isValid;
    },

    // Pad a decimal number with zeroes up to max length determined by size
    padWithZeroes: function (num, size) {
        var pad = '';
        var max = Math.pow(10, size-1);
        while (max > 1 && num < max) {
            pad += '0';
            max /= 10;
        }

        return pad + num;
    },


    getThumbnailPosition: function (index, numItemsInRow) {
        var row = Math.ceil(index / numItemsInRow);
        var col = index % numItemsInRow;
        var thumbnailPosition = "rw" + helper.padWithZeroes(row,2) + "|c" + helper.padWithZeroes(col,2) + "|p" + helper.padWithZeroes(index,3);
        return thumbnailPosition;
    },

    // Get app version from local storage (if stored there); otherwise get it from platform configuration
    getAppVersion: function() {
       var appVersion = getParameterByName("ver");
       return appVersion;
    },

    // Set current app version in platform storage
    setAppVersion: function (appVersion) {
        if ((typeof (Storage) !== "undefined")) {
            helper.debugLog("appVersion set to: " + appVersion);
            platformStorage.setItem(APP_VERSION, appVersion);
        }
    },

    copyArray: function (src) {
        var dest = src.slice(0);
        return dest;
    }

};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

// the dialog is injected in the specified controller
function DialogController($scope, $dialog) {
    $scope.close = function (result) {
        $dialog.close(result);
    };
}

function isDefined(obj) {
    if (typeof obj != 'undefined' && obj != null && obj != 'null' && obj != '') {
        return true;
    }
    return false;
}

// Returns time difference in minutes
function geTimeDiff(expireDate) {
    var timeDiff = 0;
    if (expireDate != null || expireDate != "") {
        var currentDate = new Date();
        if (null == expireDate) return timeDiff;
        var newdate = helper.ParseUTCDateToLocal(expireDate);
        helper.debugLog("Exp date: " + expireDate);
        helper.debugLog("Local date: " + newdate);
        timeDiff = Math.floor((newdate.getTime() - currentDate.getTime()) / 60000);
    }
    return timeDiff;
}

function showBlackoutRibbon(BlackoutWindowEnd) {
    var currentDate = new Date();
    var currentDateInMilli = currentDate.getTime();
    if (( BlackoutWindowEnd  ) < currentDateInMilli)
        return 'hidden';
    else
        return 'visible';
}


function getUnavailabeRibbonFlag(BlackoutWindowStart, BlackoutWindowEnd) {
    var flag = false;
    if (BlackoutWindowStart && BlackoutWindowEnd) {
        var strStartDate = BlackoutWindowStart;
        if (BlackoutWindowStart != null || BlackoutWindowStart != "") {

            helper.debugLog(strStartDate);

            if (strStartDate.indexOf("T") != -1) {
                strStartDate = helper.ParseUTCDateToLocal(strStartDate);
            }
        }
        var todayDate = new Date();
        var secBalckoutStart = (strStartDate.getTime() - todayDate.getTime()) / 1000;

        var strEndDate = BlackoutWindowEnd;
        if (BlackoutWindowEnd != null || BlackoutWindowEnd != "") {
            if (strEndDate.indexOf("T") != -1) {
                strEndDate = helper.ParseUTCDateToLocal(strEndDate);
            }
        }
        var secBalckoutEnd = (strEndDate.getTime() - todayDate.getTime()) / 1000;
        if (secBalckoutStart < 0 && secBalckoutEnd > 0) {
            flag = true;
        }

    }
    return flag;

}

function getReminderExpiry(reminderDate) {
    var reminderArray = reminderDate.split("T");
    var expiryDate = reminderArray[0];
    var expiryTime = reminderArray[1].split(".")[0];
    return "EXPIRES : " + expiryDate + ", " + expiryTime;
}

String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

//Retriving query string from url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? false : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Displays the 
 * @param errorObject
 */
function showRemoteErrors(errorObject, $scope){
    var RBIErrorObject = {
    		title:errorObject.Title,
    		publicErrorCode:errorObject.PublicErrorCode,
    		msgText:"",
    		buttonText:errorObject.Type,
    		yesButtonText:"Yes"
    };

    if (isDefined(errorObject.Description) && errorObject.Description != "") {
        RBIErrorObject.msgText = errorObject.Description;
    } else if (isDefined(errorObject.ResultMessage)) {
        RBIErrorObject.msgText = errorObject.ResultMessage;
    }
    
    // create error pop up using error object
    createErrorPopUp(RBIErrorObject, $scope);
}

/**
 * Create error pop up from error object
 */
function createErrorPopUp(errorObject, $scope) {

    //Omniture
    if (RBI.PlatformConfig.OmnitureEnabled && internetConnected) {
        Omniture.Clear();
        Omniture.Variables.eVar63 = "+1";
        Omniture.Variables.prop24 = Omniture.pageName + "|" + errorObject.publicErrorCode;
        Omniture.InvokeOmniture(Omniture.InvokeType.load);
    }
    //Omniture

    //Check for server errors without title
    if (isDefined(errorObject.title)) {
        var popUpKey = "Error_PopUp_Services";

        popupObj_Meta[popUpKey] = {};
        popupObj_Meta[popUpKey].title_text = errorObject.title;
        popupObj_Meta[popUpKey].msg_text = errorObject.msgText + "<br><br><br>" + "In the Help Center (RedboxInstant.com/Help), you can get more information by searching for error number " + errorObject.publicErrorCode + ". Please make note of the number.";

        //for the button 1 text which should be mapped to OK or Yes button
        popupObj_Meta[popUpKey].button_1_text = ""; //isDefined(errorObject.ok_button_text) ? errorObject.ok_button_text: errorObject.yes_button_text;
        //for the button 1 text which should be mapped to Cancel or No button
        popupObj_Meta[popUpKey].button_2_text = isDefined(errorObject.buttonText) ? errorObject.buttonText : errorObject.yesButtonText;
        popupObj_Meta[popUpKey].seperator = true;
        popupObj_Meta[popUpKey].button_1_click = function () {
            helper.HidePopupBox();
        };

        popupObj_Meta[popUpKey].button_2_click = function () {
            helper.HidePopupBox();
        };
        // show error pop up
        PopupBox.Show(popUpKey, $scope);
    }
    else {
        PopupBox.Show("Error_PopUp", $scope);
    }
}
