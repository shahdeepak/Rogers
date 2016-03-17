'use strict';
/**
 * dashboardEventHandler - This class should handle event like keyevent etc.
 * There should not be any business logic present in it. Bussinesss logic call should be in
 * service and called from controller using $scope.
 * @author Mohit Kumar Dubey
 */
function dashboardEventHandler($scope, $location, $routeParams) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.onMouseOverEvent = onMouseOverEvent;
    this.onClickEvent = onClickEvent;
    this.handleMouseWheel = handleMouseWheel;
    var preLevel = 1;

    function handleKeyDownEvent(event) {
        if ($scope.CurrentLevelIndex == 'help') {
            $scope.CurrentLevelIndex = preLevel;
        }
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }
        if (event.keyCode != KEY_CODES.CIRCLE) {
            if (handleMainMenu($scope, event.keyCode, $location)) {
                // ZOE-36062 - enable http spinner
                disableHttpSpinner = false;
                return; // global menuing handled, so bail on logic below, or alter here.
            }
        }
        switch (event.keyCode) {
        case KEY_CODES.DPAD_LEFT:
            if ($scope.helpOverLay != 'visible') {
                if ($scope.CurrentLevelIndex == 1) {
                    if ($scope.menuCurrentIndex > 0) {
                        $scope.menuCurrentIndex--;
                    }
                    $scope.TITLE_LIST_MARGIN = 0;
                } else if ($scope.CurrentLevelIndex >= 2 && $scope.CurrentLevelIndex <= 5) {
                    if ($scope.currentIndex > 0) {
                        $scope.currentIndex--;
                    }
                    if (($scope.CurrentLevelIndex == 2) && ($scope.currentIndex % 6 == 5)) {
                        $scope.RemindersLeftMargin = $scope.RemindersLeftMargin + $scope.ReminderLeftMarginOffset;
                    }
                }
            }
            break;
        case KEY_CODES.DPAD_RIGHT:
            if ($scope.helpOverLay != 'visible') {
                if ($scope.CurrentLevelIndex == 1) {
                    if ($scope.menuCurrentIndex < 3) {
                        $scope.menuCurrentIndex++;
                    }
                    $scope.TITLE_LIST_MARGIN = 0;
                }
                if ($scope.CurrentLevelIndex >= 2 && $scope.CurrentLevelIndex <= 5) {
                    if ($scope.currentIndex < $scope.levelMap[$scope.CurrentLevelIndex].MaxElements - 1) {
                        $scope.currentIndex++;
                        if (($scope.CurrentLevelIndex == 2) && ($scope.currentIndex % 6 == 0) && ($scope.currentIndex > 0)) {
                            $scope.RemindersLeftMargin = $scope.RemindersLeftMargin - $scope.ReminderLeftMarginOffset;
                        }
                    }
                }
            }
            break;
        case KEY_CODES.DPAD_UP:
            if ($scope.helpOverLay != 'visible') {
                // Moved the code from LEFT to UP - ZOE-33535
                if ($scope.CurrentLevelIndex == 7) {
                    $('#continue_1').removeClass("button-divHighlight");
                    $scope.CurrentLevelIndex = 6;
                    $('#password').focus();
                    return;
                }
                handleArrowUp();
            }
            break;
        case KEY_CODES.DPAD_DOWN:
            if ($scope.helpOverLay != 'visible') {
                // Moved the below block from RIGHT to DOWN - ZOE-33535
                handleArrowDown();
            }
            break;
        case KEY_CODES.X:
            if ($scope.helpOverLay != 'visible') {
                switch ($scope.CurrentLevelIndex) {
                case 1:
                    onClickEvent("1", $scope.menuCurrentIndex);
                    break;
                case 2:
                    $scope.gotoTitleDetails();
                    break;
                case 3:
                    $scope.playTitle();
                    break;
                }
            }
            break;
        case KEY_CODES.SQUARE:
            onClickEvent("help", "help");
            break;
        case KEY_CODES.CIRCLE:
            if ($scope.helpOverLay == 'visible') {
                $scope.helpOverLay = 'hidden';
                platformStorage.setItem("is_Helpoverlayeopen", false);
            } else
                goToPreviousPath($scope, event.keyCode, $location);
            break;
        case KEY_CODES.SELECT:
            if ($scope.helpOverLay != 'visible') {
                //toggle main menu
                if ($scope.showMainMenu == false) {
                    showMainMenu();
                    $scope.showMainMenu = true;
                } else {
                    hideMainMenu();
                    $scope.showMainMenu = false;
                }
            }
        }
    }

    function decrementScrollCount() {
        if ($scope.scrollCount > 0) {
            $scope.TITLE_LIST_MARGIN = $scope.TITLE_LIST_MARGIN + $scope.TOP_MARGIN_OFFSET;
            $scope.scrollCount--;
        } else {
            $scope.scrollCount = 0;
        }
    }

    function incrementScrollCount() {
        if ($scope.scrollCount < 3) {
            $scope.TITLE_LIST_MARGIN = $scope.TITLE_LIST_MARGIN - $scope.TOP_MARGIN_OFFSET;
            $scope.scrollCount++;
        } else {
            $scope.scrollCount = 3;
        }
    }

    function ResetHorizontalScroll() {
        $scope.RemindersLeftMargin = 0;
    }

    function onMouseOverEvent(level, index) {
        if (($scope.TITLE_LIST_MARGIN == 0 && level == 3) || ($scope.TITLE_LIST_MARGIN == -340 && level == 4) || ($scope.TITLE_LIST_MARGIN == -680 && level == 5))
            return;
        if (level == 1) {
            $scope.menuCurrentIndex = index;
        } else {
            if (level < 6) {
                $scope.currentIndex = index;
            } else if ($scope.CurrentLevelIndex != 'help') {
                preLevel = $scope.CurrentLevelIndex;
            }
        }
        $scope.CurrentLevelIndex = level;
    };

    function onClickEvent(level, index) {
        if (level == 1) {
            // Omniture data collection on tab switch
            $scope.omnitureOnTabClick(index);
            // Omniture end
            // ZOE-36062 - enable http spinner
            disableHttpSpinner = false;
            onClickEvent("dismiss", "dismiss");
            switch (index) {
            case 1:
                $location.path('/myredbox/watchhistory');
                break;
            case 2:
                $location.path('/myredbox/bookmarks');
                break;
            case 3:
                $location.path('/myredbox/purchases');
                break;
            }
        } else if (level == 'help') {
            if ($scope.helpOverLay == "hidden") {
                $scope.helpOverLay = 'visible';
            } else {
                $scope.helpOverLay = 'hidden';
            }
            platformStorage.setItem("is_Helpoverlayeopen", false);
        } else if (level == 'dismiss') {
            if ($scope.helpOverLay == "visible") {
                $scope.helpOverLay = 'hidden';
                platformStorage.setItem("is_Helpoverlayeopen", false);
            }
        }
    };
    //to handle remote remote mouse wheel 
    function handleMouseWheel(e) {
        if ($scope.helpOverLay == "hidden") {
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            if (delta == 1) {
                handleArrowUp();
            } else {
                handleArrowDown();
            }
            $scope.$apply();
        }
    }
    //to handle up key and magic remote up scrolling
    function handleArrowUp() {
        if ($scope.CurrentLevelIndex == 2) {
            $scope.CurrentLevelIndex = 1;
            decrementScrollCount();
        } else if ($scope.CurrentLevelIndex > 2 && $scope.CurrentLevelIndex <= 5) { // && levelMap[$scope.CurrentLevelIndex - 1].MaxElements>0) {
            if ($scope.currentIndex >= 0 && $scope.currentIndex != undefined) {
                if ($scope.currentIndex >= $scope.levelMap[$scope.CurrentLevelIndex - 1].MaxElements) {
                    $scope.currentIndex = 0;
                }
                decrementScrollCount();
                $scope.CurrentLevelIndex--;
                ResetHorizontalScroll();
            }
        }
    }
    //to handle down key and magic remote down scrolling
    function handleArrowDown() {
        if ($scope.CurrentLevelIndex == 1) {
            $scope.CurrentLevelIndex = 2;
            $scope.TITLE_LIST_MARGIN = 0;
            ResetHorizontalScroll();
        } else if ($scope.CurrentLevelIndex >= 2 && $scope.CurrentLevelIndex < 5) {
            if ($scope.currentIndex >= $scope.levelMap[$scope.CurrentLevelIndex + 1].MaxElements) {
                ResetHorizontalScroll();
                $scope.currentIndex = 0;
            }
            incrementScrollCount();
            $scope.CurrentLevelIndex++;
        }
    }
}