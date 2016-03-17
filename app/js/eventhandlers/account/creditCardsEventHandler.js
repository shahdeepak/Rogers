'use strict';
/**
 * CreditCardsEventHandler
 *
 * Event handler for the Credit Cards tab on account page
 *
 * @author saurabh.sood
 * Refactored by: Peter Rajcani, 11/5/2013
 */
function CreditCardsEventHandler($scope, $location, $routeParams, $dialog) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
    this.HandleModifyOptionClick = HandleModifyOptionClick;
    this.handleMouseWheel = handleMouseWheel;
    this.HandleKeyUp = HandleKeyUp;
    this.HandleKeyDown = HandleKeyDown;

    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }
        if (handleMainMenu($scope, event.keyCode, $location)) {
            helper.debugLog("Main Menu Handling from Account Event Handler");
            return; // global menuing handled, so bail on logic below, or alter here.
        }

        accountHelper.removeBottomButtonFocus($scope);
        helper.debugLog("Current scope: " + $scope.CurrentLevelIndex);
        if ($scope.CurrentLevelIndex == 2) {
            var handled = accountHelper.handleTabKeyDownEvent(event, $scope);
            if (handled) return;
        }
        handleCardsKeyDownEvent(event);
    }

    function removeBottomButtonFocus() {
        accountHelper.removeBottomButtonFocus($scope);
    }

    function handleCardsKeyDownEvent(event) {
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        switch (event.keyCode) {

        case KEY_CODES.X:
            helper.debugLog("handleCardsKeyDownEvent - current level index: " + $scope.CurrentLevelIndex + ", currentFocusedEleId: " + currentFocusedEleId);
            $("#" + currentFocusedEleId).click();
            if ($scope.totalCards)
                $scope.CurrentLevelIndex = 23;
            else
                $scope.CurrentLevelIndex = 24;
            $scope.selectedCardIndex = 0;
            break;

        case KEY_CODES.DPAD_RIGHT:
            // Right Arrow
            accountHelper.updatePageFocus($scope);
            break;

        case KEY_CODES.DPAD_LEFT:
            // Left Arrow
            accountHelper.updatePageFocus($scope);
            break;

        case KEY_CODES.DPAD_UP:
            // Up Arrow
            if ($scope.selectedCardIndex == (-2)) {
                $scope.selectedCardIndex = 0;
                if ($scope.totalCards)
                    $scope.CurrentLevelIndex = 23;
                else
                    $scope.CurrentLevelIndex = 24;
            }
            if ($scope.CurrentLevelIndex == 23 && currentIndex > 0) {
                currentIndex--;
                $scope.selectedCardIndex = $scope.selectedCardIndex - 1;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                accountHelper.updatePageFocus($scope);
                ScrollUp();
                return;
            } else if ($scope.CurrentLevelIndex == 23 && currentIndex == 0) {
                if ($scope.totalCards) {
                    $scope.CurrentLevelIndex = 2;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 1;
                } else {
                    $scope.CurrentLevelIndex = 24;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                }
                $scope.selectedCardIndex = $scope.selectedCardIndex - 1;
                accountHelper.updatePageFocus($scope);
                return;
            } else if ($scope.CurrentLevelIndex == 24 && currentIndex == 0) {
                $scope.CurrentLevelIndex = 2;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 1;
                $scope.selectedCardIndex = $scope.selectedCardIndex - 1;
                accountHelper.updatePageFocus($scope);
                return;
            }
            break;


        case KEY_CODES.DPAD_DOWN:
            // Down Arrow
            if (levelMap[$scope.CurrentLevelIndex].CanHandleDnKey == true && currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1 && currentIndex < 9) {
                currentIndex++;
                $scope.selectedCardIndex = $scope.selectedCardIndex + 1;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                accountHelper.updatePageFocus($scope);
                ScrollDown();
                return;
            } else if ($scope.CurrentLevelIndex == 2) {
                if ($scope.totalCards)
                    $scope.CurrentLevelIndex = 23;
                else
                    $scope.CurrentLevelIndex = 24;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                $scope.selectedCardIndex = 0;
                accountHelper.updatePageFocus($scope);
                return;
            }
            if (levelMap[$scope.CurrentLevelIndex].CanHandleDnKey == true && currentIndex >= $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1 && currentIndex < 9 && $scope.cardAccounts.length != $scope.selectedCardIndex) {
                currentIndex++;
                $scope.selectedCardIndex = $scope.selectedCardIndex + 1;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                $scope.CurrentLevelIndex = 23;
                accountHelper.updatePageFocus($scope);
                ScrollDown();
                return;
            } else {
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                accountHelper.updatePageFocus($scope);
            }
            break;

        case KEY_CODES.SQUARE:
            $scope.logoutUser();
            break;
        }
    }

    //function to handle scrolling of cards section
    function ScrollUp() {
        var currentIndex = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        var selectedOffset = $("#" + currentFocusedEleId).offset();
        helper.debugLog(selectedOffset.left + " --- " + selectedOffset.top);

        if ((selectedOffset.top < 200 && currentIndex != 0) || (selectedOffset.top < 200 && currentIndex != 1 && !$scope.totalCards)) {
            var currentMarginTop = $("#cardDetails").css('margin-top').split("px");
            var newMarginTop = parseInt(currentMarginTop[0]) + 124;
            $("#cardDetails").css('margin-top', newMarginTop + "px");
        }

    }

    //function to handle scrolling of cards section
    function ScrollDown() {
        var currentIndex = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        var selectedOffset = $("#" + currentFocusedEleId).offset();
        helper.debugLog(selectedOffset.left + " --- " + selectedOffset.top);

        if (selectedOffset.top > 500) {
            var currentMarginTop = $("#cardDetails").css('margin-top').split("px");;
            var newMarginTop = parseInt(currentMarginTop[0]) - 124;
            $("#cardDetails").css('margin-top', newMarginTop + "px");

        }
    }

    function HandleModifyOptionClick(id, index) {
        removeBottomButtonFocus();
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        if (id == 'logout-btn') {
            $scope.selectedCardIndex = -2;
            helper.SetFocus(id);
            return;
        }
        var currentIndex = index;
        $scope.CurrentLevelIndex = id;
        if (currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements) {
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
            if ($scope.CurrentLevelIndex != "2")
                $scope.selectedCardIndex = currentIndex;
            else
                $scope.selectedCardIndex = -1;
            if ($scope.CurrentLevelIndex == "23" && !$scope.totalCards)
                $scope.selectedCardIndex++;
            accountHelper.updatePageFocus($scope);
        }
    }

    /**
     * Magic Remote Implementation for title checkout change card mouse scroll functionality
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
    /**
     * scroll down event
     * @return
     */
    function HandleKeyDown() {
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        if (levelMap[$scope.CurrentLevelIndex].CanHandleDnKey == true && currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1 && currentIndex < 9) {
            helper.RemoveFocus(currentFocusedEleId);
            currentIndex++;
            $scope.selectedCardIndex = currentIndex;
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;

            accountHelper.updatePageFocus($scope);
            ScrollDown();
            return;
        } else if ($scope.CurrentLevelIndex == 2 && currentIndex == 1) {
            helper.RemoveFocus(currentFocusedEleId);
            //
            if ($scope.totalCards)
                $scope.CurrentLevelIndex = 23;
            else
                $scope.CurrentLevelIndex = 24;
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
            $scope.selectedCardIndex = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            accountHelper.updatePageFocus($scope);
            return;
        }
        if (levelMap[$scope.CurrentLevelIndex].CanHandleDnKey == true && currentIndex >= $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1 && currentIndex < 9 && (currentIndex < 1 || currentIndex != $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1)) {
            helper.RemoveFocus(currentFocusedEleId);
            currentIndex++;
            $scope.selectedCardIndex = currentIndex;
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
            $scope.CurrentLevelIndex = 23;
            accountHelper.updatePageFocus($scope);
            ScrollDown();
        } else {
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
            accountHelper.updatePageFocus($scope);
        }
    }
    /**
     * scroll up  event
     * @return
     */
    function HandleKeyUp() {
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        if ($scope.CurrentLevelIndex == 23 && currentIndex > 0) {
            helper.RemoveFocus(currentFocusedEleId);
            currentIndex--;
            $scope.selectedCardIndex = currentIndex;

            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
            accountHelper.updatePageFocus($scope);
            ScrollUp();
        } else if ($scope.CurrentLevelIndex == 23 && currentIndex == 0) {
            helper.RemoveFocus(currentFocusedEleId);
            if ($scope.totalCards) {
                $scope.CurrentLevelIndex = 2;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 1;
                $scope.selectedCardIndex = -1;
            } else {
                $scope.CurrentLevelIndex = 24;
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                $scope.selectedCardIndex = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            }
            //  $scope.CurrentLevelIndex = 2;
            //$scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 1;

            accountHelper.updatePageFocus($scope);
        } else if ($scope.CurrentLevelIndex == 24 && currentIndex == 0) {
            helper.RemoveFocus(currentFocusedEleId);
            $scope.CurrentLevelIndex = 2;
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 1;
            $scope.selectedCardIndex = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            accountHelper.updatePageFocus($scope);
            //ScrollUp();
        }
    }



}