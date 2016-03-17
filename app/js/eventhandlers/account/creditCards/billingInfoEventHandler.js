'use strict';
/**
 * billingInfoEventHandler - This class should handle event like key event etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */
function billingInfoEventHandler($scope, $location) {

    this.handleKeyDownEvent = handleKeyDownEvent;
    this.billinginfoClickevent = billinginfoClickevent;
	this.removeBottomButtonFocus = removeBottomButtonFocus;
    this.addCardMouseOver=addCardMouseOver;  //Magic Remote Implementation  mouse over functionality

    function handleKeyDownEvent(event) {
        var LEVEL_LIST = 2;
        var currentIndex = 0;
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }
        var levelMap = $scope.levelMap;
        currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;

        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        switch (event.keyCode) {

            case KEY_CODES.DPAD_LEFT:
            {
                if ($scope.CurrentLevelIndex == LEVEL_LIST) {
                    if (currentIndex <= 5 && currentIndex >= 4) {
                        var data = (currentFocusedEleId).split("_");
                        $('#2_' + data[1]).blur();
                        $('#2_' + data[1]).removeClass('textbox-highlight');

                        currentIndex = parseInt(currentIndex - 1);

                        levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                        var newElementId = [$scope.CurrentLevelIndex] + "_" + currentIndex;

                        var data = (newElementId).split("_");

                        $('#2_' + data[1]).focus();
                        $('#2_' + data[1]).addClass('textbox-highlight');

                        if (data[1] == 4) {
                            $("#modify-next-btn-2").removeClass("card-button");
                        }
                    }
                }

                break;
            }
            case KEY_CODES.DPAD_RIGHT:
            {
                if ($scope.CurrentLevelIndex == LEVEL_LIST) {
                    if (currentIndex >= 3 && currentIndex <= 4) {

                        var data = (currentFocusedEleId).split("_");

                        $('#2_' + data[1]).blur();
                        $('#2_' + data[1]).removeClass('textbox-highlight');
                        if ($scope.isAdd == true) {
                            if (data[1] != 7) {
                                currentIndex = parseInt(currentIndex + 1);
                            }
                        }
                        else {
                            currentIndex = parseInt(currentIndex + 1);
                        }

                        levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                        var newElementId = [$scope.CurrentLevelIndex] + "_" + currentIndex;

                        helper.SetFocus(newElementId);
                        var data = (newElementId).split("_");

                        $('#2_' + data[1]).focus();
                        $('#2_' + data[1]).addClass('textbox-highlight');

                        if (data[1] == 5) {
                            $("#modify-next-btn-2").addClass("card-button");
                        }
                    }
                }
                break;
            }
            case KEY_CODES.DPAD_UP:
            {
                if ($scope.CurrentLevelIndex == LEVEL_LIST) {
                    helper.RemoveFocus(currentFocusedEleId);
                    var data = (currentFocusedEleId).split("_");
                    $('#2_' + data[1]).blur();
                    $('#2_' + data[1]).removeClass('textbox-highlight');


                    if (data[1] != 0) {
                        currentIndex = parseInt(currentIndex - 1);
                    }

                    levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                    var newElementId = $scope.CurrentLevelIndex + "_" + currentIndex;

                    helper.SetFocus(newElementId);

                    var data = (newElementId).split("_");

                    $('#2_' + data[1]).focus();
                    $('#2_' + data[1]).addClass('textbox-highlight');

                    if (data[1] == 4) {
                        $("#modify-next-btn-2").removeClass("card-button");
                    }
                }
                break;
            }
            case KEY_CODES.DPAD_DOWN:
            {
                if (currentIndex >= 0 && currentIndex != undefined) {
                    var data = (currentFocusedEleId).split("_");
                    $('#2_' + data[1]).blur();
                    $('#2_' + data[1]).removeClass('textbox-highlight');


                        if (data[1] != 5) {
                            currentIndex = parseInt(currentIndex + 1);
                        }
                    // alert(currentIndex)

                    levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                    var newElementId = $scope.CurrentLevelIndex + "_" + currentIndex;

                    var data = (newElementId).split("_");
                    $('#2_' + data[1]).focus();
                    $('#2_' + data[1]).addClass('textbox-highlight');
                    if (data[1] == 5) {
                        $("#modify-next-btn-2").addClass("card-button");
                    }
                }

                break;
            }

            case KEY_CODES.X:
            {
                if (currentIndex == 5) {
                    $scope.SaveCard();
                    levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                }
                break;
            }
            case KEY_CODES.SQUARE:
            {

                break;
            }
            case KEY_CODES.CIRCLE:
            {
                sessionStorage.setItem("backtoCardDet", true);

                if ($scope.isAdd) {
                    $location.path('/account/creditCards/cardDetails/add');
                }

                if ($scope.isModify) {
                    $location.path('/account/creditCards/cardDetails/modify/' + $scope.accountNumber);
                }
                break;

            }
        }
    }
    
    /**
	 * Magic Remote Implementation  mouse over functionality
     * @param CurrentIndex
     * @param level
     * @return
     */
	function billinginfoClickevent(Level_button) {
        if (Level_button == "specific-back") {

           sessionStorage.setItem("backtoCardDet", true);

                if ($scope.isAdd) {
                    $location.path('/account/creditCards/cardDetails/add');
                }

                if ($scope.isModify) {
                    $location.path('/account/creditCards/cardDetails/modify/' + $scope.accountNumber);
                }
        }
		
		
    }
	function removeBottomButtonFocus(){
		 helper.RemoveFocus('specific-back');
	}
	
    function addCardMouseOver(CurrentIndex, level) {
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
		removeBottomButtonFocus();
		if (CurrentIndex == "specific-back") {

            helper.SetFocus(CurrentIndex); //this function set focus of the current id
        }
        if (currentIndex >= 0 && currentIndex != undefined) {
                $('#' + currentFocusedEleId).blur();
                $('#' + currentFocusedEleId).removeClass('textbox-highlight');
                if (level != 5) {
                    $("#modify-next-btn-2").removeClass("card-button");
                }
                $('#' + CurrentIndex).focus();
                $('#' + CurrentIndex).addClass('textbox-highlight');
				$('#specific-back').removeClass('textbox-highlight');
             
                if (level == 5) {
                    $("#modify-next-btn-2").addClass("card-button");
                   
                }
            
            levelMap[$scope.CurrentLevelIndex].CurrentIndex = level;
        }
    }
}