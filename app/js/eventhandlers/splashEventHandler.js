'use strict';
/**
 * Splash Event Handler
 * Event handler for the splash screen (app update popup)
 */

function SplashEventHandler($scope) {
    this.handleKeyDownEvent = handleKeyDownEvent;

    function handleKeyDownEvent(event) {
        if(UPGRADE_POP_UP_VISIBLE == true) {
        	if (event.keyCode == KEY_CODES.CIRCLE) { 
            	// redirect user to smartHub
            	helper.debugLog("Return to SmartHub");
            	platformInfo.exitApp(KEY_CODES.CIRCLE);
            }else{
            	PopupBox.HandleKeyPress();
                return false;
            }      	
        }
    }
}