'use strict';
/**
 * CaptionEditorEventHandler
 *
 * Event handler for the closed caption editor on account page
 *
 * @author Peter Rajcani, 1/15/2014
 */
function CaptionEditorEventHandler($scope, $location) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.removeBottomButtonFocus = removeButtonFocus;
    this.mouseOverEvent = captionEditorMouseOverEvent;
    this.clickEvent = captionEditorClickEvent;


    function captionEditorMouseOverEvent(elementId) {
        removeButtonFocus();
        if (elementId == 'back-button-wrapper' || elementId == 'menu-button-wrapper' || elementId == 'logout-btn') {
            helper.SetFocus(elementId);
        }
        else if (elementId == 'reset-defaults-button') {
            $scope.CurrentLevelIndex = 3;
            $scope.focusIndex = 0;
            setElementFocus();
        }
        else {
            var splitEl = elementId.split('_');
            $scope.CurrentLevelIndex = parseInt(splitEl[0]);
            if ($scope.CurrentLevelIndex == 2) {
                helper.SetFocus(elementId);    // navigation bar
            }
            else {
                var focusIndex = parseInt(splitEl[1]);
                $scope.focusIndex = ($scope.CurrentLevelIndex == 3)? focusIndex+1:focusIndex;  // + 1 for reset button which has focus index = 0
                setElementFocus();
            }
        }
    }

    function setElementFocus() {
        if ($scope.CurrentLevelIndex == 3) {
            if ($scope.focusIndex == 0) {
                helper.SetFocus('reset-defaults-button');
            }
            else {
                $scope.dropDownListId = $scope.focusIndex - 1;
                setDropDownListFocus($scope.dropDownListId);
            }
        }
        else {
            setDropDownListItemFocus($scope.dropDownListId, $scope.focusIndex, true);
        }
    }

    function captionEditorClickEvent(elementId) {

        if (elementId == "logout-btn") {
            $scope.logoutUser();
        }
        else if ($scope.CurrentLevelIndex == 4) {
            selectDropdownListOption(elementId);
        }
    }

    function removeButtonFocus() {
        accountHelper.removeTabFocus();
        if ($scope.CurrentLevelIndex == 3) {
            helper.RemoveFocus('reset-defaults-button');
            for (var i=0; i<$scope.dropDownOptionsList.length; i++) {
                removeDropDownListFocus(i);
            }
        }
        else if ($scope.CurrentLevelIndex == 4) {
            for (var i=0; i<$scope.dropDownOptionsList[$scope.dropDownListId].options.length; i++) {
                setDropDownListItemFocus($scope.dropDownListId, i, false);
            }
        }

        removeBottomButtonFocus();
    }


    function handleKeyDownEvent(event) {

        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if (event.keyCode != KEY_CODES.CIRCLE || $scope.CurrentLevelIndex != 4 ) {
            if (handleMainMenu($scope, event.keyCode, $location)) {
                return;
            }
        }

        if ($scope.CurrentLevelIndex == 2) {
            removeButtonFocus();
            var handled = accountHelper.handleTabKeyDownEvent(event, $scope);
            accountHelper.updatePageFocus($scope);
            if (handled) return;
        }

        handleCaptionEditorKeyDownEvent(event);
    }


    function handleCaptionEditorKeyDownEvent(event) {

        switch (event.keyCode) {

            case KEY_CODES.DPAD_UP:
                removeButtonFocus();
                if ($scope.CurrentLevelIndex == 3) {
                    if ($scope.focusIndex > $scope.dropDownListIdTop+1) {
                        $scope.focusIndex--;
                    }
                    else if ($scope.focusIndex > 0) {
                        if ($scope.dropDownListIdTop > 0) {
                            // scroll drop down lists
                            scrollDropDownLists(-1);
                        }
                        $scope.focusIndex--;
                    }
                    else {
                        $scope.CurrentLevelIndex = 2;
                    }
                }
                else if ($scope.CurrentLevelIndex = 4) {
                    // inside dropDown list
                    if ($scope.focusIndex > 0) {
                        $scope.focusIndex--;
                    }
                }
                if ($scope.CurrentLevelIndex == 2) {
                    accountHelper.updatePageFocus($scope);
                }
                else {
                    setElementFocus();
                }

                break;

            case KEY_CODES.DPAD_DOWN:
                removeButtonFocus();
                if ($scope.CurrentLevelIndex == 2) {
                    $scope.CurrentLevelIndex++;
                    $scope.focusIndex = 0;
                }
                else if ($scope.CurrentLevelIndex == 3) {
                    if ($scope.focusIndex <= $scope.dropDownListIdBottom) {
                        $scope.focusIndex++;
                    }
                    else if ($scope.focusIndex < $scope.dropDownOptionsList.length) {
                        if ($scope.dropDownListIdBottom < $scope.dropDownOptionsList.length - 1) {
                            // scroll drop down lists
                            scrollDropDownLists(1);
                        }
                        $scope.focusIndex++;
                    }
                }
                else {
                    // inside dropDown list
                    if ($scope.focusIndex < $scope.dropDownOptionsList[$scope.dropDownListId].options.length - 1) {
                        $scope.focusIndex++;
                    }
                }
                setElementFocus();
                break;

            case KEY_CODES.X:
                if ($scope.CurrentLevelIndex == 3) {
                    if ($scope.focusIndex == 0) {
                        $scope.resetDefaults();
                    }
                    else {
                        $scope.dropDownListId = $scope.focusIndex - 1;
                        $scope.dropDownOptionsList[$scope.dropDownListId].isOpen = true;
                        //$scope.focusIndex = $scope.dropDownOptionsList[$scope.dropDownListId].focusIndex; // not needed
                        $scope.expandDropDownList($scope.dropDownOptionsList[$scope.dropDownListId]);
                    }
                }
                else if ($scope.CurrentLevelIndex == 4) {
                    selectDropdownListOption($scope.dropDownOptionsList[$scope.dropDownListId].options[$scope.focusIndex]);
                }
                break;

            case KEY_CODES.SQUARE:
                $scope.logoutUser();
                break;

            case KEY_CODES.CIRCLE:
                // collapse drop down menu
                if ($scope.CurrentLevelIndex == 4) {
                    $scope.dropDownOptionsList[$scope.dropDownListId].isOpen = false;
                    $scope.CurrentLevelIndex = 3;
                    $scope.focusIndex = $scope.dropDownListId + 1;
                    setDropDownListFocus($scope.dropDownListId);
                    if (!$scope.$$phase) $scope.$apply();
                }
                break;

        }
    }

    function selectDropdownListOption (item) {
        $scope.focusIndex = $scope.dropDownListId + 1;
        $scope.CurrentLevelIndex = 3;
        $scope.dropDownOptionsList[$scope.dropDownListId].setProperty(item);
        setDropDownListFocus($scope.dropDownListId);
    }

    function setDropDownListFocus (dropDownListId) {
        if (!$scope.dropDownOptionsList[dropDownListId].hasFocus) {
            $scope.dropDownOptionsList[dropDownListId].hasFocus = true;
            $('#list_'+ dropDownListId).addClass('drp-dwn-ctnr-highlight');
        }
    }

    function removeDropDownListFocus(dropDownListId) {

        if ($scope.CurrentLevelIndex == 3) {
            if ($scope.dropDownOptionsList[dropDownListId].hasFocus) {
                $scope.dropDownOptionsList[dropDownListId].hasFocus = false;
                $('#list_'+ dropDownListId).removeClass('drp-dwn-ctnr-highlight');
            }

            if ($scope.dropDownOptionsList[dropDownListId].isOpen) {
                $scope.dropDownOptionsList[dropDownListId].isOpen = false;
            }
        }

    }

    function  scrollDropDownLists (scrollIndex) {
        $scope.dropDownListIdTop += scrollIndex;
        $scope.dropDownListIdBottom += scrollIndex;
        if ($scope.dropDownListIdTop < 0) {
            $scope.dropDownListIdTop = 0;
        }
        if ($scope.dropDownListIdBottom > $scope.dropDownOptionsList.length-1) {
            $scope.dropDownListIdBottom = $scope.dropDownOptionsList.length-1;
        }

        for (var i=0; i<$scope.dropDownOptionsList.length; i++) {
            if (i >= $scope.dropDownListIdTop && i<=$scope.dropDownListIdBottom) {
                $scope.dropDownOptionsList[i].isDisplayed = true;
            }
            else {
                $scope.dropDownOptionsList[i].isDisplayed = false;
            }
        }
        adjustScrollBar();
        if (!$scope.$$phase) $scope.$apply();
    }

    function setDropDownListItemFocus(dropDownListId, item, value) {
        $scope.dropDownOptionsList[dropDownListId].options[item].selected = value;
    }

    function removeBottomButtonFocus () {
        helper.RemoveFocus('back-button-wrapper');
        helper.RemoveFocus('menu-button-wrapper');
        helper.RemoveFocus('logout-btn');
        if ($scope.CurrentLevelIndex == 2) {
            var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            helper.RemoveFocus(currentFocusedEleId);
        }
    }

    function adjustScrollBar () {
        var scrollbarHeight = parseInt($('#scroll-bar').css('height').split('p'));
        var scrollBarTop = (scrollbarHeight*$scope.dropDownListIdTop)/$scope.dropDownOptionsList.length;
        $('#scroll-bar-indicator').css('top', scrollBarTop);
    }
}
