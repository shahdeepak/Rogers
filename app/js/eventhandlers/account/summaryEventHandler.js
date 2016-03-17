'use strict';
/**
 * AccountSummaryEventHandler
 *
 * Event handler for the summary tab on account page
 *
 * @author saurabh.sood
 * Refactored by: Peter Rajcani, 11/5/2013
 */
function AccountSummaryEventHandler($scope, $location) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
	this.summaryMouseOverEvent = summaryMouseOverEvent;
	this.summaryClickevent = summaryClickevent;
	
	function summaryMouseOverEvent(Level_button) {
		removeBottomButtonFocus();
		helper.SetFocus(Level_button); //this function set focus of the current id
    }
	function summaryClickevent(Level_button) {
        if (Level_button == "logout-btn") {
            $scope.logoutUser();
        }
		else if (Level_button == "rbi-privacy-policy" ) {
           $scope.isRedboxPolicyOpen = true;
        }
		else if (Level_button == "ok" ) {
		   $scope.isRedboxPolicyOpen = false;
        }
    }

	function removeBottomButtonFocus() {
        accountHelper.removeTabFocus();
        accountHelper.removeBottomButtonFocus ($scope);
        helper.RemoveFocus('rbi-privacy-policy');
    }
	
    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }
        if ($scope.isRedboxPolicyOpen)  {
            return handleKeyDownRedboxPolicy (event, $scope);
        }
        if (handleMainMenu($scope, event.keyCode, $location)) {
            helper.debugLog("Main Menu Handling from Account Event Handler");
            return; // global menuing handled, so bail on logic below, or alter here.
        }
        removeBottomButtonFocus();
        helper.debugLog("Current scope: " + $scope.CurrentLevelIndex);
        if ($scope.CurrentLevelIndex == 2) {
            var handled = accountHelper.handleTabKeyDownEvent(event, $scope);
            if (handled) return;
        }
        handleSummaryKeyDownEvent(event);
        accountHelper.updatePageFocus($scope);
    }

    function handleSummaryKeyDownEvent(event) {
        switch (event.keyCode) {
            case KEY_CODES.TRIANGLE:
                if ($scope.isRedboxPolicyOpen != true) {
                    $scope.isRedboxPolicyOpen = true;
                }
                break;
				
            case KEY_CODES.SQUARE:
                $scope.logoutUser();
                break;

        }
    }

    function handleKeyDownRedboxPolicy (event, $scope) {
    	switch (event.keyCode) {
    		case KEY_CODES.CIRCLE:
            case KEY_CODES.X:
                event.stopPropagation();
                $scope.isRedboxPolicyOpen = false;
                break;

            case KEY_CODES.DPAD_DOWN:
                // ZOE-32296 - The start position was not being checked therefore incrementing the value
                // The user had to press the UP key several times to start scrolling the content..
                // scrollHeight checks the content length and subtracts the offset to get the correct
                // height of the content..
                if ($scope.startpos <= $("#verizon-content-text")[0].scrollHeight - 3 * $scope.offset) {
                    $scope.startpos = $scope.startpos + $scope.offset;
                    $("#verizon-content-text").stop().animate({ scrollTop: $scope.startpos }, $scope.scrollDown);
                }
                event.stopPropagation();
                break;

            case KEY_CODES.DPAD_UP:
                if ($scope.startpos >= $scope.offset) {
                    $scope.startpos = $scope.startpos - $scope.offset;
                    $("#verizon-content-text").stop().animate({ scrollTop: $scope.startpos }, $scope.scrollDown);
                }
                event.stopPropagation();
                break;
        }
        return false;
    }
}