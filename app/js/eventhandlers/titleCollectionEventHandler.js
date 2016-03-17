function titleCollectionEventHandler($scope, $location, $routeParams) {
    var pagePointer = 0;
    var NUM_ITEMS_IN_ROW = 6;

    this.handleKeyDownEvent = handleKeyDownEvent;
    this.onGridClickEvent = onGridClickEvent;
    this.onGridMouseOverEvent = onGridMouseOverEvent;
    this.removeBottomButtonFocus = removeBottomButtonFocus;

    function handleKeyDownEvent(event) {
        if (handleMainMenu($scope, event.keyCode, $location)) {
            return; // global menuing handled, so bail on logic below, or alter here.
        }

        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        var selectedRow = parseInt(($scope.currentItemId).split("_")[0]);
        var selectedCol = parseInt(($scope.currentItemId).split("_")[1]);
        var numberTitlesInCollection = $scope.allTitlesInCollection.length;

        switch (event.keyCode) {
        case KEY_CODES.CIRCLE:
            // K Key
            $location.path('/home');
            break;

        case KEY_CODES.X:
            // Enter Key Accept
            var pid = $('#' + $scope.currentItemId).attr('pid');
            $scope.omnitureOnClick($scope.currentIndex, pid);
            $location.path('/titledetail/' + pid);
            break;

        case KEY_CODES.SELECT:
            // toggle main menu
            $scope.showMainMenu ? hideMainMenu() : showMainMenu();
            $scope.showMainMenu = !$scope.showMainMenu;
            break;

        case KEY_CODES.DPAD_RIGHT:
            if (numberTitlesInCollection > $scope.currentIndex + 1) {
                if (numberTitlesInCollection > NUM_ITEMS_IN_ROW)
                    scrollRight();
                $scope.currentIndex++;
            }
            break;

        case KEY_CODES.DPAD_LEFT:
            if ($scope.currentIndex != 0) {
                if (numberTitlesInCollection > NUM_ITEMS_IN_ROW) scrollLeft();
                $scope.currentIndex--;
            }
            break;

        case KEY_CODES.DPAD_UP:
            // shift array contents by six
            pagePointer -= NUM_ITEMS_IN_ROW;
            break;

        case KEY_CODES.DPAD_DOWN:
            // shift array contents by six
            pagePointer += NUM_ITEMS_IN_ROW;
            break;
        }

        function scrollRight() {
            var currentFocusedEleId = selectedRow + "_" + $scope.currentIndex;
            var selectedOffset = $("#" + currentFocusedEleId).offset();
            if (selectedOffset.left > 600 && selectedRow + 4 <= numberTitlesInCollection) {
                var currentMarginTop = $("#grid").css('margin-left').split("px");
                var newMarginTop = parseInt(currentMarginTop[0]) - 191;
                $("#grid").css('margin-left', newMarginTop + "px");
            }
        }

        function scrollLeft() {
            var currentFocusedEleId = selectedRow + "_" + $scope.currentIndex;
            var selectedOffset = $("#" + currentFocusedEleId).offset();
            if (selectedOffset.left < 450 && ($scope.currentIndex - 2) > 0) {
                var currentMarginTop = $("#grid").css('margin-left').split("px");
                var newMarginTop = parseInt(currentMarginTop[0]) + 191;
                $("#grid").css('margin-left', newMarginTop + "px");
            }
        }
    }

    function onGridMouseOverEvent(level, index) {
        $("#" + "0_" + $scope.currentIndex).blur();
        $scope.currentIndex = index;
        $("#" + "0" + "_" + $scope.currentIndex).focus();
    };

    function onGridClickEvent(level, index) {
        var currentFocusedElemId = level + "_" + index;
        var Pid = $("#" + currentFocusedElemId).attr("pid");
        var index = level * NUM_ITEMS_IN_ROW + index;
        if (helper.isDefined(Pid)) {
            $scope.omnitureOnClick(index, Pid);
            if (helper.isDefined($scope.KioskId)) {
                $location.path('titledetail/' + Pid + '/' + $scope.KioskId);
            } else {
                $location.path('titledetail/' + Pid);
            }
        }

    };

    function removeBottomButtonFocus() {
        helper.RemoveFocus('back-button-wrapper');
        helper.RemoveFocus('menu-button-wrapper');
        helper.RemoveFocus($scope.currentItemId);
        $("#" + $scope.currentItemId).removeClass('search_gridItem_highlight');
    }
}