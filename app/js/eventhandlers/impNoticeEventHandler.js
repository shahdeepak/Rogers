'use strict';
/**
 * This class handles key events for the legal notice page
 * @author Peter Rajcani
 */
function ImpNoticeEventHandler($scope, $location, $routeParams) {
    this.handleKeyDownEvent = handleKeyDownEvent;
	this.handleMouseoverEvent = handleMouseoverEvent;

    function handleKeyDownEvent(event) {


        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        // Main menu is not present on this page so this code is not needed
//        if (event.keyCode != KEY_CODES.CIRCLE) {
//            if (handleMainMenu($scope, event.keyCode, $location)) {
//                return;
//            }
//        }

        helper.debugLog("Executing impNoticeEventHandler, key event = " + event.keyCode);

        switch (event.keyCode) {

            case KEY_CODES.SQUARE:
             
                {
                    if ($scope.isRedboxPolicyOpen != true) {
                        $scope.isVerizonPolicyOpen = true;
						$scope.startpos = 0;
                    }
                    break;
                }

            case KEY_CODES.TRIANGLE:
                {
                     if ($scope.isVerizonPolicyOpen != true) {
                        $scope.isRedboxPolicyOpen = true;
						$scope.startpos = 0;
                    }
                    break;
                }
            case KEY_CODES.DPAD_DOWN:
             
                {
                    // ZOE-32296 - The start position was not being checked therefore incrementing the value
                    // The user had to press the UP key several times to start scrolling the content..
                    // scrollHeight checks the content length and subtracts the offset to get the correct
                    // height of the content..
                    if ($scope.isRedboxPolicyOpen == true) {
                        var moveEula = $scope.redboxstartpos;
                        if($scope.redboxstartpos <= $("#verizon-content-text")[0].scrollHeight - 3 * $scope.Offset)
                        {
                            $scope.redboxstartpos = $scope.redboxstartpos + $scope.Offset;
                            $("#verizon-content-text").stop().animate({ scrollTop: $scope.redboxstartpos }, 500);
                        }
                    }
                    if ($scope.isVerizonPolicyOpen == true) {
                        var moveEula = $scope.verizonstartpos;
                        if($scope.verizonstartpos <= $("#redbox-content-text")[0].scrollHeight - 3 * $scope.Offset)
                        {
                            $scope.verizonstartpos = $scope.verizonstartpos + $scope.Offset;
                            $("#redbox-content-text").stop().animate({ scrollTop: $scope.verizonstartpos }, 500);
                        }
                    }
                    break;
                }
            case KEY_CODES.DPAD_UP:
            
                {
                    if ($scope.isRedboxPolicyOpen == true) {
                        var moveEula = $scope.redboxstartpos;
                        if ($scope.redboxstartpos >= $scope.Offset) {
                            $scope.redboxstartpos = $scope.redboxstartpos - $scope.Offset;
                            $("#verizon-content-text").stop().animate({ scrollTop: $scope.redboxstartpos }, 500);
                        }
                    }
                    if ($scope.isVerizonPolicyOpen == true) {
                        var moveEula = $scope.verizonstartpos;
                        if ($scope.verizonstartpos >= $scope.Offset) {
                            $scope.verizonstartpos = $scope.verizonstartpos - $scope.Offset;
                            $("#redbox-content-text").stop().animate({ scrollTop: $scope.verizonstartpos }, 500);
                        }
                    }
                    break;
                }

            case KEY_CODES.CIRCLE :
            {
                if(!$scope.isRedboxPolicyOpen && !$scope.isVerizonPolicyOpen)
                {
                    $scope.redirectUserToLoginPage();
                }
                else
                {
                    $scope.isRedboxPolicyOpen = false;
                    $scope.isVerizonPolicyOpen = false;
                }
                break;
            }
            case KEY_CODES.X:
                {
                    if ($scope.isVerizonPolicyOpen == true) {
                        $scope.isVerizonPolicyOpen = false;
                        $scope.verizonstartpos = 0;
                    }

                    else if ($scope.isRedboxPolicyOpen == true) {
                        $scope.isRedboxPolicyOpen = false;
                        $scope.redboxstartpos = 0;
                    }
                    else  {
                        $scope.acceptSignIn();
                    }
                    break;
                }
        }
    }

	function handleMouseoverEvent(id){
			$('.loginbutton-highlight').removeClass('loginbutton-highlight');
			if(id == 'sign-in-button'){
				$('#sign-in-button').focus().addClass('button-divHighlight');
			}else{
				$('#sign-in-button').blur().removeClass('button-divHighlight');
				$('#'+id).addClass('loginbutton-highlight');
			}
	}
}