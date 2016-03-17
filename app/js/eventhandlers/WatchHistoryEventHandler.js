'use strict';
/**
 * WatchHistoryEventHandler
 * This class should handle event like keyevent etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */
function WatchHistoryEventHandler($scope, $location) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.onClickEvent = onClickEvent;
    this.onMouseOverEvent = onMouseOverEvent;
    this.handleMouseWheel = handleMouseWheel;
    var preLevel = 1;
    var preCurrentIndex = 1;
    var whItemsPerPage = 3;
    var whDashboardMenu = 0; //menu level 0 on the watchhistory page
    var whBookmarksPage = 2; //menu index of bookmarks page
    var whPurchasesPage = 3; //menu index of purchases page
    var whDashboardPage = 0; //menu index of dashboard page
    

    function handleKeyDownEvent(event) {
        //$scope.popupButtons;
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            switch (event.keyCode) {
            case KEY_CODES.X:
            case KEY_CODES.F:
                $scope.currentLevelIndex = 0;
            }
            return false;
        }
        if ($scope.canMoveFocus == false || $scope.dataLoaded == false) {
            return;
        }
        helper.debugLog("TIM: CURRENT LEVEL INDEX~ " + $scope.currentLevelIndex);
        switch (event.keyCode) {
        case KEY_CODES.SELECT:
                switch ($scope.currentLevelIndex) {
                case 0:
                case 1:
                case 50:
                    //toggle main menu
                    if ($scope.showMainMenu == false) {
                        //showMainMenu();
                        $scope.showMainMenu = true;
                        $scope.currentLevelIndex = 50;
                    } else {
                        //hideMainMenu();
                        $scope.showMainMenu = false;
                        $scope.currentLevelIndex = 1;
                    }
                    if (handleMainMenu($scope, event.keyCode, $location)) {
                        return; // global menuing handled, so bail on logic below, or alter here.
                    }
                    break;
                }
                break;
            
        case KEY_CODES.CIRCLE:
                if ($scope.helpOverLay != 'visible')
                /* which menu level are we on?  */
                    switch ($scope.currentLevelIndex) {
                    case 0:
                    case 1:
                         goToPreviousPath($scope, event.keyCode, $location);
                        break;
                    case 2:
                        /* options popup level */
                        $scope.currentLevelIndex = 1; //set back to watch history page
                        $scope.hideOptionsPopup();
                        break;
                    case 3:
                        /* i'm done popup level */
                        $scope.currentLevelIndex = 2; //set back to options popup
                        $scope.hideDonePopup();
                        $scope.showOptionsPopup();
                        break;
                    case 4:
                        /* rate this popup level */
                        $scope.currentLevelIndex = 2; //set back to options popup
                        $scope.hideRatePopup();
                        $scope.cancelRating();
                        $scope.showOptionsPopup();
                        break;
                    case 10:
                        /*  error popup */
                        $scope.currentLevelIndex = 0;
                        $scope.hideErrorPopup();
                        $scope.goHome();
                        break;
                    }
                break;
            
        case KEY_CODES.TRIANGLE:
                if ($scope.helpOverLay != 'visible')
                    switch ($scope.currentLevelIndex) {
                    case 1:
						$("#option").click();
                        break;
                    case 2:
						onClickEvent('rate','rate');
                        break;
                    }
                break;
            
        case KEY_CODES.SQUARE:
            helper.debugLog("TIM: SQUARE IS PRESSED~ " + $scope.isTitleExpired() + " : " + $scope.currentLevelIndex);
            if (!$scope.isTitleExpired()) {
                switch (($scope.currentLevelIndex)) {
                case 0:
                case 1:
                    if ($scope.helpOverLay == 'hidden') {
                        $scope.helpOverLay = 'visible';
                    } else {
                        $scope.helpOverLay = 'hidden';
                    }
                    break;
                case 2:
                    helper.debugLog("TIM: IF CLICKED~ " + $scope.canIamDone);
                    if ($scope.canIamDone) {
						
                        onClickEvent('canIamDone','canIamDone');
                    }
                    break;
                case 3:
                    break;
                case 4:
					$("#option").click();
                    break;
                }
            }
            break;
        case KEY_CODES.X:
        case KEY_CODES.F:
                if ($scope.helpOverLay != 'visible' || $scope.currentLevelIndex == 50)
                    switch ($scope.currentLevelIndex) {
                    case 0:
                        onClickEvent('menu', $scope.menuCurrentIndex);
                        // Omniture data collection on tab switch
                        $scope.omnitureOnTabClick($scope.menuCurrentIndex);
                        // Omniture end
                        break;
                    case 1:
                        /*  watch history list level */
                        $scope.getTitleDetails();
                        break;
                    case 3:
                        /* I'm done popup level */
						$("#rht-btnDone").click();
                        break;
                    case 4:
                        /* rate popup level */
						$("#ratingRgt").click();
                        break;
                    case 5:
                        /* blackout popup level */
                        $scope.hideBlackOutPopup();
                        $scope.currentLevelIndex = 1;
                        break;
                    case 50:
                        $scope.currentLevelIndex = 1;
                        // home popup menu home/browse/myredbox/locations/ etc.
                        if (handleMainMenu($scope, event.keyCode, $location)) {
                            return; // global menuing handled, so bail on logic below, or alter here.
                        }
                        break;
                    }
                break;
            
        case KEY_CODES.DPAD_RIGHT:
        case KEY_CODES.R1:
             // Right Arrow
                if ($scope.helpOverLay != 'visible' || $scope.currentLevelIndex == 50)
                    switch ($scope.currentLevelIndex) {
                    case 0:
                        if ($scope.menuCurrentIndex < 3)
                            $scope.menuCurrentIndex++;
                        break;
                    case 2:
                        // ZOE-32637: Start playback with R1 key on PS3
                        if (event.keyCode == KEY_CODES.R1) {
                            whPlayTitle();
                        }
                        break;
                    case 4:
                        /* rate popup level */
                        //  run save rating function() here
                        $scope.increaseRating();
                        break;
                    case 50:
                        // home popup menu home/browse/myredbox/locations/ etc.
                        if (handleMainMenu($scope, event.keyCode, $location)) {
                            return; // global menuing handled, so bail on logic below, or alter here.
                        }
                    }
                break;
            
        case KEY_CODES.DPAD_LEFT:
        case KEY_CODES.L1:
                // Left Arrow
                if ($scope.helpOverLay != 'visible' || $scope.currentLevelIndex == 50)
                    switch ($scope.currentLevelIndex) {
                    case 0:
                        if ($scope.menuCurrentIndex > 0)
                            $scope.menuCurrentIndex--;
                        break;
                    case 4:
                        /* rate popup level */
                        //  run save rating function() here
                        $scope.decreaseRating();
                        break;
                    case 50:
                        // home popup menu home/browse/myredbox/locations/ etc.
                        if (handleMainMenu($scope, event.keyCode, $location)) {
                            return; // global menuing handled, so bail on logic below, or alter here.
                        }
                    }
                break;
            
            // ZOE-32637: Start playback with Play key on Samsung
            // start and play have the same key code on Samsung
        case KEY_CODES.START:
            if (($scope.currentLevelIndex == 2))
                whPlayTitle();
            break;
        case KEY_CODES.DPAD_UP:
            if ($scope.helpOverLay != 'visible' && $scope.currentLevelIndex < 2)
                handleArrowUp();
            break;
        case KEY_CODES.DPAD_DOWN:
            if ($scope.helpOverLay != 'visible' && $scope.currentLevelIndex < 2) {
                if ($scope.currentLevelIndex == 0 && $scope.watchItems.length > 0) {
                    $scope.selectedTitleIndex = 0;
                    $scope.currentLevelIndex = 1;
                } else
                    handleArrowDown();
            }
        }
    }

    function whPlayTitle() {
        if ($scope.canPlayTitle() && !$scope.isTitleExpired() && !$scope.isTitleUnavailable()) {
            $scope.playTitle();
        }
    }

    function whCheckScrollDown(currentIndex, totalNumberItems) {
        var liHeight = ($('.wh-item-li').height() + parseInt($('.wh-item-li').css('margin-top')));
        var totalHeight = $('.wh-items').height();
        var marginTop = parseInt($('.wh-items').css('margin-top'));
        if (marginTop > -totalHeight) {
            marginTop = marginTop - liHeight;
            $('.wh-items').css('margin-top', marginTop);
        } else {
            $('.wh-items').css('margin-top', -totalHeight);
        }
    }

    function whCeckScrollUp(currentIndex, totalNumberItems) {
        var liHeight = ($('.wh-item-li').height() + parseInt($('.wh-item-li').css('margin-top')));
        var totalHeight = $('.wh-items').height();
        var marginTop = parseInt($('.wh-items').css('margin-top'));
        if (marginTop < 0) {
            marginTop = marginTop + liHeight;
            $('.wh-items').css('margin-top', marginTop);
        } else {
            $('.wh-items').css('margin-top', 0);
        }
    }
    //magic remote mouse over event
    function onMouseOverEvent(level, index) {
        if (level == 0) {
            $scope.menuCurrentIndex = index;
        } else if (level == 4) {
            var newIndex = parseInt(index) / 2;
            if (newIndex > $scope.numStarsTmp) {
                $scope.increaseRating();
            } else {
                $scope.decreaseRating();
            }
        } else if (level < 3) {
            $scope.selectedTitleIndex = index;
        } else if ($scope.currentLevelIndex >= 0) {
            preLevel = $scope.currentLevelIndex;
            preCurrentIndex = $scope.selectedTitleIndex;
        }
        $scope.currentLevelIndex = level;
        if (level == 'option' || level == 'help' || level == 'rate' || level == 'done' || level == 'watchNow' || level == 'backBtn' || level == "backBtnNL" || level == "backBtnDone" || level == "backBtnRating" || level == "backBtnBlackout" || level == 'rht-btnDone' || level == 'ratingRgt' || level == 'dismiss')
            $scope.currentLevelIndex = level;
    };
    //magic remote click event
    function onClickEvent(level, index) {
        if (level == 'help' && $scope.helpOverLay == "hidden") {
            $scope.helpOverLay = 'visible';
            $scope.$apply();
        } else if (level == "menu") {
            switch (index) {
            case 0:
                $location.path('/myredbox/dashboard');
                break;
            case 2:
                $location.path('/myredbox/bookmarks');
                break;
            case 3:
                $location.path('/myredbox/purchases');
                break;
            }
        } else if (level == 'rate'){
            $scope.hideOptionsPopup();
            $scope.showRatePopup();
            $scope.currentLevelIndex = 4;
        } else if (level == 'canIamDone'){
            $scope.hideOptionsPopup();
            $scope.showDonePopup();
            $scope.currentLevelIndex = 3;
        } else if (level == 4) {
            $scope.saveRating();
            $scope.hideRatePopup();
            $scope.currentLevelIndex = 3;
        } else if (level == 'dismiss' && $scope.helpOverLay == "visible") {
            $scope.helpOverLay = 'hidden';
            $scope.$apply();
        } else {
            $scope.CurrentLevelIndex = level;
            var currentFocusedElemId = $scope.CurrentLevelIndex + "_" + index;
            $scope.getTitleDetails();
        }
    };
    //to remove focus of ui element
    //to handle remote remote mouse wheel 
    function handleMouseWheel(e) {
        if ($scope.helpOverLay == "hidden" && $scope.currentLevelIndex < 2) {
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            if (delta == 1) {
                handleArrowUp();
            } else {
                handleArrowDown();
            }
            $scope.$apply();
        }
    }
    //to handle up scrolling and up key handling
    function handleArrowUp() {
        if ($scope.selectedTitleIndex > 0 && $scope.currentLevelIndex < 2) {
            $scope.selectedTitleIndex--;
            whCeckScrollUp($scope.selectedTitleIndex, $scope.totalWatchItems);
        } else if ($scope.selectedTitleIndex == 0) {
            $scope.currentLevelIndex = 0; // set to dashboard menu level
            $scope.levelMap[whDashboardMenu].currentIndex = 1;
        }
    }
    //to handle down scrolling and down key handling
    function handleArrowDown() {
        if (($scope.selectedTitleIndex < ($scope.totalWatchItems - 1)) && ($scope.selectedTitleIndex != $scope.totalWatchItems)) {
            $scope.selectedTitleIndex++;
            if ($scope.selectedTitleIndex >= whItemsPerPage) {
                whCheckScrollDown($scope.selectedTitleIndex, $scope.totalWatchItems);
            }
        }
        if ($scope.levelMap[$scope.currentLevelIndex].canHandleDnKey == false) {
            var tempLen = $scope.levelMap.length - 1;
            if ($scope.currentLevelIndex < tempLen) {
                $scope.currentLevelIndex = 100;
            }
        }
        if ((!($scope.isLastRecord)) && ($scope.selectedTitleIndex == $scope.totalWatchItems - 1)) {
            if (new Date().getMilliseconds() - $scope.startTime < 200) {
                $scope.startTime = 0;
                event.stopPropagation();
                throw "flushing event pipeline";
            }
            if ($scope.dataLoaded == true) {
                $scope.pageCount++;
                $scope.getWatchHistory();
            }
        }
    }
}