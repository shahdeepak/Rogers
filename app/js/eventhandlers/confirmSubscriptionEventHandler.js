'use strict';
/**
 * confirmSubscriptionEventHandler - This class should handle event like keyevent  and mouse over etc.
 * There should not be any business logic present in it. Bussinesss logic call should be in
 * service and called from controller using $scope.
 * @author deepak.shah
 */
function confirmSubscriptionEventHandler($scope, $location, rbiCommonService) {

    this.handleKeyDownEvent = handleKeyDownEvent; //handled all key event 
    this.confirmSubscriptionMouseOverEvent = confirmSubscriptionMouseOverEvent; // magic remote implementation
    /**
     * This function handled all key event
     * @param event
     * @return
     */
    function handleKeyDownEvent(event) {
        helper.debugLog(event);
        /**
         * this if condition for error pop up message
         */
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress(); // pop up key event handling 
            return false;
        }
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex; // current index for focus ,highlight and key event
        /**
         * This if condition for Level Index (start watching button same in 2 screen so that )
         */
        if ($scope.subscriptionType == NO_SUBSCRIPTION && currentIndex == 0 && $scope.CurrentLevelIndex == 1)
            currentIndex = 1;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex; // set current focus element id

        switch (event.keyCode) {

        case KEY_CODES.START:
            break;
            
            
            /**
             * Handling left key events
             */
        case KEY_CODES.DPAD_LEFT:
            if (currentIndex != 0 && $scope.subscriptionType == NO_SUBSCRIPTION && $scope.CurrentLevelIndex != 1) {
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                helper.RemoveFocus(currentFocusedEleId);
                currentIndex--;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                $('#' + currentFocusedEleId).addClass("button-divHighlight");
                helper.SetFocus(currentFocusedEleId);
            } else if (currentIndex != 3 && $scope.CurrentLevelIndex == 2 && $scope.subscriptionType != NO_SUBSCRIPTION) {
                helper.RemoveFocus(currentFocusedEleId);
                currentIndex--;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                helper.SetFocus(currentFocusedEleId);
                if (currentIndex > 5) // check for level is DVD Credits or Subscription
                    $scope.checkDvd = true;
                else
                    $scope.checkDvd = false;
            }
            break;
            
            
            
            /**
             * Handling Right key events
             */
        case KEY_CODES.DPAD_RIGHT:
            if (currentIndex != 8 && $scope.CurrentLevelIndex == 2 && $scope.subscriptionType != NO_SUBSCRIPTION){
                helper.RemoveFocus(currentFocusedEleId);
                currentIndex++;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                helper.SetFocus(currentFocusedEleId);
            } else if (currentIndex != 2 && $scope.CurrentLevelIndex == 2 && $scope.subscriptionType == NO_SUBSCRIPTION){
                helper.RemoveFocus(currentFocusedEleId);
                currentIndex++;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                helper.SetFocus(currentFocusedEleId);
            } else if (currentIndex != 1 && $scope.CurrentLevelIndex == 3){
                helper.RemoveFocus(currentFocusedEleId);
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                if ($scope.subscriptionType == NO_SUBSCRIPTION)
                    currentIndex++;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                $('#' + currentFocusedEleId).addClass("button-divHighlight");
                helper.SetFocus(currentFocusedEleId);
            }
            if (currentIndex > 5 && $scope.subscriptionType != NO_SUBSCRIPTION)
                $scope.checkDvd = true;
            else
                $scope.checkDvd = false;
            break;
            
            
            
            /**
             * Handling Up key events
             */
        case KEY_CODES.DPAD_UP:
            if ($scope.CurrentLevelIndex != 1 && $scope.subscriptionType == NO_SUBSCRIPTION) {
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                helper.RemoveFocus(currentFocusedEleId);
                if (currentIndex == 1 || currentIndex == 2){
                    currentIndex = 0;
                }
                $scope.CurrentLevelIndex--;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                if (currentIndex == 0 && $scope.CurrentLevelIndex == 1) {
                    currentIndex = 1;
                    var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                    $('#' + currentFocusedEleId).addClass("button-divHighlight");
                }
                helper.SetFocus(currentFocusedEleId);
            } else if ($scope.CurrentLevelIndex != 1){
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                helper.RemoveFocus(currentFocusedEleId);
                if ($scope.CurrentLevelIndex == 3) {
                    currentIndex = 3;
                } else {
                    currentIndex = 0;
                }
                if ($scope.checkDvd && $scope.CurrentLevelIndex != 2){
                    currentIndex = 6;
                }
                $scope.CurrentLevelIndex--;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                if (currentIndex == 0 && $scope.CurrentLevelIndex == 1)
                    $('#' + currentFocusedEleId).addClass("button-divHighlight");
                helper.SetFocus(currentFocusedEleId);
            }
            break;
            
            
            /**
             * Handling Down key events
             */
        case KEY_CODES.DPAD_DOWN:
            if ($scope.CurrentLevelIndex != 3 && $scope.subscriptionType == NO_SUBSCRIPTION) {
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                helper.RemoveFocus(currentFocusedEleId);
                if (currentIndex == 2 || currentIndex == 1){
                    currentIndex = 0;
                }
                $scope.CurrentLevelIndex++;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                helper.SetFocus(currentFocusedEleId);
                if ($scope.CurrentLevelIndex == 3) {
                    $('#' + currentFocusedEleId).addClass("button-divHighlight");
                }
            } else if ($scope.CurrentLevelIndex != 3){
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                helper.RemoveFocus(currentFocusedEleId);
                
                if ($scope.CurrentLevelIndex == 2){
                    currentIndex = 2;
                } else {
                    currentIndex = 3;
                }
                if ($scope.checkDvd && $scope.CurrentLevelIndex != 2){
                    currentIndex = 6;
                }
                $scope.CurrentLevelIndex++;
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
                $('#' + currentFocusedEleId).removeClass("button-divHighlight");
                helper.SetFocus(currentFocusedEleId);
                
                if ($scope.CurrentLevelIndex == 3) {
                    $('#' + currentFocusedEleId).addClass("button-divHighlight");
                }
            }
            break;
            
            
            /**
             * Handling Enter key events
             */
        case KEY_CODES.X:
            var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
            $("#" + currentFocusedEleId).click();
            break;
            
            
        case KEY_CODES.TRIANGLE:
            break;
            
            
        case KEY_CODES.SQUARE:
            break;
            
        // No back button on this page
        case KEY_CODES.CIRCLE:
            break;
            
            
        case KEY_CODES.SELECT:
            break;
        }
    }

    /**
     * Magic Remote Implementation  mouse over functionality
     * @param level
     * @param currentID
     * @return
     */
    function confirmSubscriptionMouseOverEvent(level, currentID) {
        var levelMap = $scope.levelMap;
        var currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        
        if ($scope.subscriptionType == NO_SUBSCRIPTION && currentIndex == 0 && $scope.CurrentLevelIndex == 1)
            currentIndex = 1;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        helper.RemoveFocus(currentFocusedEleId);
        $('#' + currentFocusedEleId).removeClass("button-divHighlight");
        currentIndex = currentID;
        $scope.CurrentLevelIndex = level;
        
        if ($scope.subscriptionType == NO_SUBSCRIPTION && currentIndex == 0 && $scope.CurrentLevelIndex == 1)
            currentIndex = 1;
        var newEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentID;
        helper.SetFocus(newEleId);
        
        if (level == 1 || level == 3) {
            $('#' + newEleId).addClass("button-divHighlight");
        }
    }

}