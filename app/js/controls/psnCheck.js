/**
 * this file is used to validate the psn network
 * when the user is trying to access the app
 */

var psnLogged = true;
var internetConnected = true;
var psnPopupVisible = false;
var psnCheckNeeded = (typeof vod != 'undefined' && (RBI.PlatformConfig.deviceType == "PS3" || RBI.PlatformConfig.deviceType == "PSV"))? true:false;

addVodListeners();

function addVodListeners() {
    if (typeof vod !== 'undefined' && typeof vod.addEventListener !== 'undefined') {
        vod.addEventListener('usernetworklogin_statechange', psnLoginChanged);
        vod.addEventListener('connection_change', lanChanged);
        vod.addEventListener('softwareKeyboard_event', handleOSK);
        vod.ready();
        helper.debugLog("vod defined.. listening for connection_change");
    }
}

function handleOSK(evt){
//	items returned from OSK keyboard. We populate field and reset.
    if(evt.data.event === 4) {
        helper.debugLog('PS4 only key text: ' + evt.data.text);
        currentFormValue = evt.data.text;
        currentFormFieldObj.value = currentFormValue;
    }
    if(evt.data.event === 1) {
        helper.debugLog('text: ' + evt.data.text);
        currentFormFieldObj.value = currentFormValue || evt.data.text;
        var modelName = $('#' + currentFormFieldObj.id).attr('ng-model');
        //helper.debugLog(currentFormFieldObj);
        var scope = angular.element(currentFormFieldObj).scope();
        if(!scope.$$phase){
            scope.$apply(function () {
                $("#key-bg").remove();
                helper.debugLog ("Evaluating: " + "scope." + modelName + "=\"" + evt.data.text + "\";");
                eval("scope." + modelName + "=\"" + evt.data.text + "\";");
            });
        }
    }
    if(evt.data.event > 0)
        helper.debugLog(evt.data.event + '---'+ evt.data.text + '-------------------------');
    //Event Codes:
    //0 -> start
    //1 -> "Ok" was pressed
    //2 -> "Cancel" was pressed
    //3 -> SWKBD failed to function properly for some reason
    //4 -> PS4 key event with text of some kind (new from Julian)
}
// generic function all devices need, but all will have unique connect state checks
// a return of true will hijack all key navigation.
// Return of true - blocks key navigation if user is disconnected from Internet or PSN
// Return false - key navigation enabled
function checkConnectionPrompts(key, scope) {
    helper.debugLog("key: " + key);
//    helper.debugLog("checkConnectionPrompts: internetConnected == " + internetConnected + ", PLAYER_ACTIVE == " + PLAYER_ACTIVE);
    if (!PLAYER_ACTIVE) {    // if player is active let it handle the Internet/PSN disconnection
        if (internetConnected == false) {

            if (key != KEY_CODES.X) // Only X will check and dismiss this popup
                return true;

            helper.ShowPopupBox('Popup_ATTEMPTING_RECONNECT');
            // We dont need to show the spinner since we already show the pop up.
            // The spinner comes on top of the pop up, when the internet connection is restored, the spinner stays
            // ZOE-29780
            //helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
            helper.isOnline(
                function (isOnline) {
                    if (!isOnline) {
                        internetConnected = false;
                        helper.HidePopupBox();

                        setTimeout(function () {
                            connectionTimeoutCallback();
                        }, 1000);
                        helper.debugLog("still not connected");
                    }
                    else {
                        internetConnected = true;
                        helper.HidePopupBox();

                        // reload the current page
                        var randStrng = new Date().getTime();
                        $location.url(backPaths[backPaths.length - 1] + "?" + randStrng);
                        $location.replace();
                        scope.$apply();
                    }
                }
            );
            return true;
        }

        if (POP_ALERT_BOX_VISIBLE && key == KEY_CODES.X) {
            return false;
        }
        if (psnLoginPromptCheck()) {
            helper.debugLog("Check connection prompts - key handling disabled");
            return true;
        }
    }
    return false;
}

// unique to PS (PS3 only really for now)
function psnLoginPromptCheck() {
    var retValue = false;
    if (psnCheckNeeded) {
        helper.debugLog("psnLoginPromptCheck - psnLogged: " + psnLogged, ", PSN popup visible: " + POP_ALERT_BOX_VISIBLE);
        if (!psnLogged && getPlayerState() == 0) {
            helper.debugLog("psnLoginPromptCheck - showing PSN login popup");
            psnLoginPopup();
            retValue = true;
        }
    }
    return retValue;
}

function lanChanged(evt) {
    if(evt.data.connected) // a lan reconnect does not the internet make!
        return;
    internetConnected = evt.data.connected;
    var playerState = getPlayerState();
    helper.debugLog("internet connected: " + internetConnected + ", psnLogged: " + psnLogged + ", player state: " + playerState);
    if (internetConnected == false) {
        if (psnCheckNeeded) {
            psnLogged = false;
        }

        if (playerState == 0) {
            var errorObj = {
                ResultInfo: { ResultCode: '101' }
            };
            helper.showErrorMessage(errorObj);
            helper.debugLog("not connected");
            // There is no spinner shown therefore no point in hiding it.
            //helper.hideSpinner();
        }
    }
}

function psnLoginChanged(evt) {
    // PSN event only needs to be handled for PS3 not for PS4
    if (psnCheckNeeded) {
        var playerState = getPlayerState();
        helper.debugLog("psnLoginChanged - online: " + evt.data.online + ", psnLogged: " + psnLogged + ", player state: " + playerState + " internet connected: " + internetConnected);
        if (psnLogged) {
            if (!evt.data.online) {
                psnLogged = evt.data.online;
                if (playerState == 0 && internetConnected) {
                    //helper.debugLog("psnLoginChanged - showing PSN login popup");
                    psnLoginPopup();
                }
            }
        }
        else {
            psnLogged = evt.data.online;
            if (!evt.data.online && playerState == 0 && internetConnected) {
                // prompt user to login into Playstation network
                //helper.debugLog("psnLoginChanged - showing PSN login popup");
                psnLoginPopup();
            }
            if (evt.data.online && psnPopupVisible) {
                helper.HidePopupBox();
                psnPopupVisible = false;
            }
        }
    }
}

function connectionTimeoutCallback() {
    if (internetConnected == false) {
        var errorObj = {
            ResultInfo: { ResultCode: '101' }
        };

        helper.debugLog("connectionTimeoutCallback - internet not connected");
        helper.showErrorMessage(errorObj);
        //helper.hideSpinner();
    }
    else {
        // Reload is not required since the user can start browse from where the left off..ZOE-29780
        //window.location.reload();
    }
}

function psnLoginPopup() {
    var popupKey = 'Popup_PSN_LOGIN';
    psnPopupVisible = true;
    popupObj_Meta[popupKey].button_2_click = function () {
        helper.debugLog("Sign In button clicked");
        helper.HidePopupBox();
        psnPopupVisible = false;
        vod.signIntoPlaystationNetwork();
    };
    helper.ShowPopupBox(popupKey);
}

function getPlayerState () {
     var playerState = 0;
     if (typeof vod != 'undefined') {
         playerState = vod.player.getState().id;
     }
    return playerState;
}