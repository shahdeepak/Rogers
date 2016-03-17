'use strict';
/**
 * LoginEventHandler - This class handles key events for the login page
 * @author Peter Rajcani
 */
function LoginEventHandler($scope, $location, $routeParams) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.handleMouseOver = handleMouseOver;
    this.handleMouseClick = handleMouseClick;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
    var elementId = ['#emailAddress', '#password', '#login-button', '#new-account-button'];
    var prevFocusIndex;

    function handleKeyDownEvent(event) {
        $(elementId[$scope.focusIndex]).blur();
        // Key handling for Update required popup
        if ($scope.updateRequiredPopupVisible) {
            helper.debugLog("loginEventHandler - update required popup, key event = " + event.keyCode);
            PopupBox.HandleKeyPress();
            return false;
        }
        // Key handling for error popups
        // In this case focus moves back to username field
        if (POP_ALERT_BOX_VISIBLE) {
            helper.debugLog("loginEventHandler - error popup, key event = " + event.keyCode);
            PopupBox.HandleKeyPress();
            $scope.focusIndex = 0;
            $(elementId[$scope.focusIndex]).focus();
            $('#password').val('');
            $scope.user.password = '';
            return false;
        }
        switch (event.keyCode) {
        case KEY_CODES.DPAD_DOWN:
            helper.debugLog("Down key: $scope.focusIndex on entry = " + $scope.focusIndex);
            // ZOE-32296 - The start position was not being checked therefore incrementing the value
            // The user had to press the UP key several times to start scrolling the content..
            // scrollHeight checks the content length and subtracts the offset to get the correct
            // height of the content..
            if (($scope.isRedboxPolicyOpen) && ($scope.redboxstartpos <= $("#verizon-content-text")[0].scrollHeight - 3 * $scope.Offset)) {
                var moveEula = $scope.redboxstartpos;
                $scope.redboxstartpos = $scope.redboxstartpos + $scope.Offset;
                $("#verizon-content-text").stop().animate({
                    scrollTop: $scope.redboxstartpos
                }, 500);
            } else if (($scope.isVerizonPolicyOpen) && ($scope.verizonstartpos <= $("#redbox-content-text")[0].scrollHeight - 3 * $scope.Offset)) {
                var moveEula = $scope.verizonstartpos;
                $scope.verizonstartpos = $scope.verizonstartpos + $scope.Offset;
                $("#redbox-content-text").stop().animate({
                    scrollTop: $scope.verizonstartpos
                }, 500);
            } else if ($scope.user.emailAddress != "" && $scope.focusIndex==0) {
				$scope.focusIndex++;
              
            }
			else if ( $scope.user.password != ""  && $scope.focusIndex==1) {
				$scope.focusIndex++;
            } 	
            break;
        case KEY_CODES.DPAD_UP:
            if (($scope.isRedboxPolicyOpen) && ($scope.redboxstartpos >= $scope.Offset)) {
                var moveEula = $scope.redboxstartpos;
                $scope.redboxstartpos = $scope.redboxstartpos - $scope.Offset;
                $("#verizon-content-text").stop().animate({
                    scrollTop: $scope.redboxstartpos
                }, 500);
            } else if (($scope.isVerizonPolicyOpen) && ($scope.verizonstartpos >= $scope.Offset)) {
                var moveEula = $scope.verizonstartpos;
                $scope.verizonstartpos = $scope.verizonstartpos - $scope.Offset;
                $("#redbox-content-text").stop().animate({
                    scrollTop: $scope.verizonstartpos
                }, 500);
            } else if ($scope.focusIndex > 0 && $scope.focusIndex < 3) {
                $scope.focusIndex--;
            }
            break;

        case KEY_CODES.DPAD_RIGHT:
            if ($scope.focusIndex < 3) {
                prevFocusIndex = $scope.focusIndex;
                $scope.focusIndex = elementId.length - 1;
            }
            break;

        case KEY_CODES.DPAD_LEFT:
            if ($scope.focusIndex == elementId.length - 1) {
                if (prevFocusIndex != null) {
                    $scope.focusIndex = prevFocusIndex;
                }
            }
            break;

        case KEY_CODES.CIRCLE:
            //*** If is checked for HOME - BROWSE - TITLE - LOGIN - BACK
            //*** Else condition checks for HOME - ACCOUNT/REDBOX - LOGIN - BACK
            if (isDefined(backPaths) && backPaths.length > 0) {
                for (var i = (backPaths.length - 1); i >= 0; i--) {
                    helper.debugLog("i is:" + i);
                    if (backPaths[i].indexOf('/login') == -1 && backPaths[i].indexOf('/account') == -1 && backPaths[i].indexOf('/myredbox/dashboard') == -1) {
                        helper.debugLog("----Do NOT POP----" + i);
                        break;

                    } else if (backPaths[i].indexOf('/login/account') != -1 || backPaths[i].indexOf('/myredbox/dashboard') != -1 || backPaths[i].indexOf('/login/myredbox/dashboard') != -1 || backPaths[i].indexOf('/account') != -1) {

                        if (backPaths[i - 1].indexOf('/login/account') != -1 || backPaths[i - 1].indexOf('/myredbox/dashboard') != -1 || backPaths[i - 1].indexOf('/login/myredbox/dashboard') != -1 || backPaths[i - 1].indexOf('/account') != -1) {
                            //*** This will check for the second last item from the stack since unauthenticated login adds 2 paths
                            //*** We just need to pop one and the other will be popped from goToPreviousPath
                            //*** Initially we were popping two which popped off the 3rd last item - ZOE-30766
                            helper.debugLog("----POPPING----" + i);
                            backPaths.pop();
                            //continue; // no need to have continue here..
                        } else
                            break;
                    } // end else if
                } // end for

            } //end if

            //Clearing values from titledetail
            platformStorage.removeItem("isRating");
            platformStorage.removeItem("addBookmark");

            // The check for $location.path() != "/createAccount" is not needed here since
            // login event handler should only be firing from the login page
            if ($scope.isVerizonPolicyOpen != true && $scope.isRedboxPolicyOpen != true) { // && $location.path() != "/createAccount") {
                goToPreviousPath($scope, event.keyCode, $location);
            }
            if ($scope.isVerizonPolicyOpen) {
                $scope.isVerizonPolicyOpen = false;
                $scope.verizonstartpos = 0;
            } else if ($scope.isRedboxPolicyOpen) {
                $scope.isRedboxPolicyOpen = false;
                $scope.redboxstartpos = 0;
            }
            //*** Pops the last element from the stack.
            return;
        case KEY_CODES.X:
            if ($scope.isVerizonPolicyOpen) {
                $scope.isVerizonPolicyOpen = false;
                $scope.verizonstartpos = 0;
            } else if ($scope.isRedboxPolicyOpen) {
                $scope.isRedboxPolicyOpen = false;
                $scope.redboxstartpos = 0;
            } else if ($scope.focusIndex == 0 || $scope.focusIndex == 1) {
                // bring up the keyboard
            } else if ($scope.focusIndex == 2 && $scope.user.emailAddress != "" && $scope.user.password != "" && !$scope.loginUnderProgress) {
                $scope.loginUser();
            } else if ($scope.focusIndex == 3) {
                $scope.newAccount();
            }
            break;
        case KEY_CODES.SQUARE:
            if (!$scope.isRedboxPolicyOpen) {
                $scope.isVerizonPolicyOpen = true;
                $scope.startpos = 0;
            }
            break;
        case KEY_CODES.TRIANGLE:
            if (!$scope.isVerizonPolicyOpen) {
                $scope.isRedboxPolicyOpen = true;
                $scope.startpos = 0;
            }
            break;
        }
        if ($scope.focusIndex != 3 && !$scope.isRedboxPolicyOpen && !$scope.isVerizonPolicyOpen)
            $(elementId[$scope.focusIndex]).focus();
    }

    function handleMouseOver(id, index) {
        $(elementId[$scope.focusIndex]).blur();
        $scope.focusIndex = parseInt(index);
        $scope.focusIndex = index;
		if($scope.focusIndex!=3)
		$(elementId[$scope.focusIndex]).focus();
    }

    function handleMouseClick(id) {
        if (!POP_ALERT_BOX_VISIBLE) { //Check added for fixing ZOE-29496 
            if (id == "emailAddress" || id == "password") {
                checkInputFocusOSK(KEY_CODES.X);
            } else if ($scope.isVerizonPolicyOpen == true && id == 'rbi-pp-button') { //ZOE-30780 PS3/PS4 :ng-click functionality issues
                $scope.isVerizonPolicyOpen = false;
                $scope.verizonstartpos = 0;
            } else if ($scope.isRedboxPolicyOpen == true && id == 'vz-pp-button') {
                $scope.isRedboxPolicyOpen = false;
                $scope.redboxstartpos = 0;
            }
        }
    }

    function removeBottomButtonFocus() {}
}