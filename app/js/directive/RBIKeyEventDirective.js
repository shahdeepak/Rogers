'use strict';
/**
 * RBIKeyEventDirective - This directive will register different type of key event on body and calling
 * corresponding EventHandler.
 * @author bhushan.balki
 */

var directives = angular.module('rbi');

directives.directive('rbikeyevent',
    function ($document,$location) {
        return {
            link: function (scope, element, attrs) {
                // DeepLinking
                if(!deepLinking){
                    // Need the below check for normal app load
                    //
                    if(attrs.id == "eula" || attrs.id == "splashContainer"){
                        helper.debugLog("***Promotions/Eula/Splash***");
                        deepLinking = true;
                    }
                    else // below will execute for any deep link page including HOME
                    {
                        // Back/Menu Buttons show up on Eula
                        // To avoid scope loss using angular element to hide the Back/Menu Buttons
                        // Using mask to cover up the deep link page..
                        angular.element(document.getElementById("mask")).scope().mask = { display: true };
                        helper.debugLog("TIM: mask has been added");
                        angular.element(document.getElementById("main-menu-return")).scope().mainMenuReturn = { display: false};
                        angular.element(document.getElementById("main-menu-container")).scope().mainMenuContainer = { display: false };

                        setTimeout(function(){ // Need this so that deep link page is added to backPaths
                            helper.debugLog("***Routing to Splash Eula***");
                            deepLinking = true;
                            $location.path("/index");
                            if(!scope.$$phase) scope.$apply();
                        },0);
                    }

                }
				var keyDownEvent = function (e) {
                    if(httpRequestInProgress && event.keyCode != KEY_CODES.CIRCLE && attrs.id != "promotions"){
                        event.stopImmediatePropagation();
                        return;
                    }

                    if(KEY_CODES.MAPOVER[event.keyCode]){
                        var kcKey = KEY_CODES.MAPOVER[event.keyCode];
                        KEY_CODES[kcKey] = event.keyCode;
                        helper.debugLog(" MAPOVER makes KEY_CODES." + kcKey + " = " + event.keyCode);
                    }

                    //Handle Exit key
                	if(RBI.PlatformConfig.isExitPopUpRequired && ((attrs.id != undefined && attrs.id == "promotions" && event.keyCode == KEY_CODES.CIRCLE) || event.keyCode == KEY_CODES.EXIT || (POP_ALERT_BOX_VISIBLE == true && !MISSING_CARD_POP_UP_VISIBLE && event.keyCode == KEY_CODES.CIRCLE && attrs.id != "searchBox" && attrs.id != "splashContainer"))){
                		event.preventDefault();
                		helper.showExitPopup(event.keyCode);
                        if(isDefined(scope.checkPopup)){
                            scope.checkPopup();
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        }

                		return;
                	}
                	
                	if(RBI.PlatformConfig.genericKeyboard){
//                    	if (KeyboardFocus || KeyboardOccurrenceFlag){
//                  	      		KeyboardOccurrenceFlag = false;// check to resolve issue where in quickly clicking on enter focus was getting lost on text filed
//                        	return ;
//                    	}
                		
	                    if($.isKeyboardOpen){
	                    	$.keyboard.keyaction.customKeyPress(event.keyCode);
	                    	return;
	                  	}
                	}

                    if(isDefined( checkConnectionPrompts(event.keyCode, scope)) && checkConnectionPrompts(event.keyCode, scope)){
                        helper.debugLog('Some Connection fail is prompted');
                    }else if(mainMenuMap.on){//Only allowed SELECT,X,LEFT and RIGHT when menu is open
                  		var key = event.keyCode;
                  		if(key == KEY_CODES.DPAD_DOWN || key == KEY_CODES.DPAD_UP || key == KEY_CODES.SELECT || key == KEY_CODES.DPAD_LEFT || key == KEY_CODES.DPAD_RIGHT || key == KEY_CODES.X || key == KEY_CODES.CIRCLE || key == KEY_CODES.TRIANGLE){
  		                    scope.eventHandler.handleKeyDownEvent(e);
                            if (!scope.$$phase) {
                                scope.$apply(attrs.onKeyup);
                            }
                  		}
                  	}
                    else if( checkInputFocusOSK(event.keyCode) ){
                        helper.debugLog('X marks the keyboard up!');
                    }else{
                        helper.debugLog("Tim: POPUP NO LONGER WORKS");
                    	scope.eventHandler.handleKeyDownEvent(e);
                        if (!scope.$$phase) {
                            scope.$apply(attrs.onKeyup);
                        }
                    }
                	
                };
                var documentBody = $document[0].body;
               
				//Added this code for ZOE-32548
                 $( document ).on('click',"input",function() {
                   if(!$.isKeyboardOpen) checkInputFocusOSK(KEY_CODES.X);
				 });

                // Added this line for ZOE-32647
                 $( document ).on('keydown',"input",function() {
                    if(RBI.PlatformConfig.genericKeyboard){
                        $( "input" ).keypress(function() {
                            if ($(this).is(":focus")){
                                helper.debugLog( "Handler for .keypress() called." );
                                return event.defaultPrevented;
                            }
                        });
                 }});

                // Need a continuous scroll on EULA on key press.
                // Enabling onkeydown for EULA, add cases for pages which require key down
                // ZOE-26730,ZOE-30267
                // ZOE-34244: Disabled on CreateAccount page due to incorrect event handler binding resulting in navigation issues
                if(attrs.id == "eula") {  //  || attrs.id == "create-account") documentBody.onkeydown = keyDownEvent;
                    documentBody.onkeydown = keyDownEvent;
                }
                else
                {
                    documentBody.onkeydown = null; // detaching the onkeydown event since it was already invoked on EULA.
                    documentBody.onkeyup = keyDownEvent;
                }
                documentBody.onclick = keyDownEvent;
                // Do cleanup...
                scope.$on("$destroy",function(){
                    helper.debugLog("***RBIKeyEvent Cleanup***");
                    keyDownEvent = null;
                    documentBody.onkeydown = null;
                    documentBody.onkeyup = null;
                    documentBody.onclick = null;
                    documentBody = null;
                });
            }
        };
    });
directives.directive('rbimousewheel',
    function ($document) {
    	return {
    		link: function (scope, element, attrs) {
    			var mouseWheelEvent = function (e) {

    				scope.eventHandler.handleMouseWheel(e);
    			};
    			var documentBody = $document[0].body;

    			documentBody.onmousewheel = mouseWheelEvent;
                // Do cleanup...
                scope.$on("$destroy",function(){
                    helper.debugLog("***RBIMouseWheel Cleanup***");
                    mouseWheelEvent = null;
                    documentBody.onmousewheel = null;
                    documentBody = null;
                });
    		}
    	};
    });

directives.directive('focusInput', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $(element).focus();
        }
    };
});
//*** Directive to check the last element which was loaded in ng-repeat...
//*** Use check-last in the ng-repeat element(html view) to check when the last element was loaded.
//*** Show spinner until the last element, hide when the last element loads....
directives.directive('checkLast',function(){

    return {
        link:function (scope, element, attrs) {
            if (scope.$last=== true) {
                element.ready(function () {
                    helper.debugLog('Last Element Ready!');
                    helper.hideSpinner();
                });
            }
            else{
                //helper.debugLog('Not the last element!');
                helper.showSpinner (config.SPINNER_FADEOUT_MS, config.spinnerPosition);
            }
        }
    }
});