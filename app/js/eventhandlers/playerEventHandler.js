'use strict';
/**
 * PlayerEventHandler - This class handles key events for the player
 * @author Peter Rajcani
 */
function PlayerEventHandler($scope, $location, $routeParams) {
    this.handleKeyDownEvent = PlayerCoreUI_HandleKeyDownEvent;
    this.handleMouseOverStartupScreen = PlayerCoreUI_HandleMouseOverStartupScreen;
    this.handleMouseOverEndOfMovie = PlayerCoreUI_HandleMouseOverEndOfMovie;
    this.handleMouseOverPlayer = PlayerCoreUI_HandleMouseOverPlayer;
    this.pwPopupMouseOver = pwPopupHelper.handleMouseOver;
    this.passwordSubmitClick = passwordSubmitClick;
    this.pwPopupHandleBackKey = pwPopupHandleBackKey;

    function PlayerCoreUI_HandleKeyDownEvent(event) {

        if (POP_ALERT_BOX_VISIBLE) {
           return PlayerCoreUI_HandleKeyDownPopup (event);
        }

        if ($scope.uiPWPopup) {
            return pwPopupHelper.handleKeyEvent(event, passwordSubmitClick, pwPopupHandleBackKey, $scope);
        }

        if ($scope.isOffline) {
            return PlayerCoreUI_HandleKeyDownEventOffline(event);
        }

        if ($scope.endOfMovie)  {
            return PlayerCoreUI_HandleKeyDownEndOfMovie (event);
        }

        // ZOE 24576: When ignoreKeyPress flag is on allow user to press stop button
        if ($scope.ignoreKeyPress && event.keyCode != KEY_CODES.CIRCLE) {
            helper.debugLog("Key press ignored: " + event.keyCode);
            return false;
        }

        if ($scope.showStartResumeButtons) {
            PlayerCoreUI_HandleKeyDownStartupScreen (event);
        }
        else {
            playerHelper.HandleKeyDownPlayer(event, $scope);
        }
    }


    /**
     * Key event handler for the startup screen
     * @param event
     */
    function PlayerCoreUI_HandleKeyDownStartupScreen(event) {
        switch (event.keyCode) {

            case KEY_CODES.X:
                // Select key
                if ($scope.focusIndex == 0) {
                    $scope.PlayerCoreUI_StartPlayer(false);
                } else {
                    $scope.PlayerCoreUI_StartPlayer(true);
                }
                break;


            case KEY_CODES.DPAD_UP:
            case KEY_CODES.L1:
                if ($scope.focusIndex > 0) {
                    // if start / resume buttons are shown move the focus
                    helper.SetButtonFocus($scope.resumeButtonID);
                    helper.RemoveButtonFocus($scope.startOverButtonID);
                    $scope.focusIndex--;
                    $scope.$apply();
                }
                break;

            case KEY_CODES.DPAD_DOWN:
            case KEY_CODES.R1:
                // if start / resume buttons are shown move the focus
                if ($scope.focusIndex == 0) {
                    helper.SetButtonFocus($scope.startOverButtonID);
                    helper.RemoveButtonFocus($scope.resumeButtonID);
                    $scope.focusIndex++;
                    $scope.$apply();
                }
                break;

            case KEY_CODES.INFO:
                // Show info
                $scope.PlayerCoreUI_ShowInfoBar();
                break;


            case KEY_CODES.CIRCLE:
                $scope.PlayerCoreUI_StopPlayer();
                break;

        }
    }

    // Handle mouse over event on startup screen
    function PlayerCoreUI_HandleMouseOverStartupScreen (focusIndex) {
        switch (focusIndex) {

            case 0:
                // if start / resume buttons are shown move the focus
                helper.SetButtonFocus($scope.resumeButtonID);
                helper.RemoveButtonFocus($scope.startOverButtonID);
                break;

            case 1:
                helper.SetButtonFocus($scope.startOverButtonID);
                helper.RemoveButtonFocus($scope.resumeButtonID);
                break;
        }
        $scope.$apply();
        $scope.focusIndex = focusIndex;
    }

    function PlayerCoreUI_HandleKeyDownPopup (event) {
        PopupBox.HandleKeyPress();
        if ($scope.networkErrorPopupVisible) {
            $scope.networkErrorPopupVisible = false;
        }
        return false;
    }

    function PlayerCoreUI_HandleKeyDownEventOffline (event)  {

        // if connection comes back take user to main menu otherwise show an error message
        helper.debugLog("PlayerCoreUI_HandleKeyDownEventOffline - processing event:" + event.keyCode);
        if ($scope.isConnected) {
            helper.debugLog("Network reconnected");
            handleKeyDownMainMenu(event.keyCode);
            return false;
        }
        else {
            helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
            helper.isOnline(
                function(isOnline){
                    if(isOnline)
                    {
                        // disable the spinner here
                        $scope.isConnected = true;
                        helper.hideSpinner();
                        helper.debugLog("Network reconnected");
                        handleKeyDownMainMenu(event.keyCode);
                        return false;
                    }
                    else {
                        helper.debugLog("Player offline - Not connected");
                        $scope.isConnected = false;
                        helper.hideSpinner();
                        $scope.PlayerCoreUI_ShowErrorMessage(NETWORK_CONNECTION_ERROR);     // network connection error
                    }
                }
            );
        }
        return false;
    }

    // Back key handling from the offline page
    function handleKeyDownMainMenu (keyCode) {
        helper.debugLog("calling handleMainMenu:" + keyCode);
        if (keyCode == KEY_CODES.CIRCLE) {
            PLAYER_ACTIVE = false;
            $scope.PlayerCoreUI_GoBack();
        }
    }

     /**
     * Key event handler for end of movie screen
     *
     * @param event
     */
    function PlayerCoreUI_HandleKeyDownEndOfMovie(event) {
        var addBookmarkButtonIndex = $scope.endOfMovieButtonId.length - 2;
        switch (event.keyCode) {

            case KEY_CODES.X:
                // Select key
                if ($scope.focusLevel == 0)
                {
                    var currentFocus = $scope.focusIndexMap[$scope.focusLevel];
                    if (currentFocus == 0) {
                        $scope.PlayerCoreUI_GoToTitleDetails($scope.productId);
                    }
                    else if (currentFocus == 1) {
                        $scope.PlayerCoreUI_GoToMyRedbox();
                    } else {
                        if ($scope.titleDetails.isBookmarked) {
                            $scope.PlayerCoreUI_RemoveBookmark();
                        }
                        else {
                            $scope.PlayerCoreUI_AddBookmark();
                        }
                    }
                }
                else {
                    var currentFocus = $scope.focusIndexMap[$scope.focusLevel];
                    $scope.PlayerCoreUI_GoToTitleDetails($scope.recommendedProducts[currentFocus].productId);
                }
                break;


            case KEY_CODES.DPAD_UP:
                 //Navigate between buttons and 'More Like This'
                if ($scope.focusLevel == 1)
                {
                    $scope.recommendedProducts[$scope.focusIndexMap[$scope.focusLevel]].isSelected = false;
                    $scope.focusLevel--;
                    helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                    $scope.currentFocusEl = $scope.endOfMovieButtonId[$scope.focusIndexMap[$scope.focusLevel]];
                    helper.SetButtonFocus($scope.currentFocusEl);
                }

                break;

            case KEY_CODES.DPAD_DOWN:
                // navigate to 'More Like This' section
                if ($scope.focusLevel == 0 && $scope.recommendedProducts.length > 0)
                {
                    helper.RemoveButtonFocus($scope.currentFocusEl);
                    $scope.focusLevel++;
                    $scope.recommendedProducts[$scope.focusIndexMap[$scope.focusLevel]].isSelected = true;
                    helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                }
                break;

            case KEY_CODES.DPAD_LEFT:
            case KEY_CODES.L1:
                {
                    var currentFocus = $scope.focusIndexMap[$scope.focusLevel];
                    if ($scope.focusLevel == 0) {
                        if (currentFocus > 0) {
                            currentFocus--;
                            if (currentFocus == addBookmarkButtonIndex && $scope.titleDetails.isBookmarked) {
                                currentFocus--;
                            }
                            helper.RemoveButtonFocus($scope.currentFocusEl);
                            PlayerCoreUI_MoveButtonFocus(currentFocus);
                            helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                        }
                    }
                    else {
                        if (currentFocus > 0) {
                            $scope.recommendedProducts[currentFocus].isSelected = false;
                            currentFocus--;
                            $scope.recommendedProducts[currentFocus].isSelected = true;
                            $scope.focusIndexMap[$scope.focusLevel] = currentFocus;
                            helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                        }
                    }
                }
                break;

            case KEY_CODES.DPAD_RIGHT:
            case KEY_CODES.R1:
                  {
                    var currentFocus = $scope.focusIndexMap[$scope.focusLevel];
                    if ($scope.focusLevel == 0) {

                        if (currentFocus < $scope.endOfMovieButtonId.length - 2) {
                            currentFocus++;
                            if (currentFocus == addBookmarkButtonIndex && $scope.titleDetails.isBookmarked) {
                                currentFocus++;
                            }
                            helper.RemoveButtonFocus($scope.currentFocusEl);
                            PlayerCoreUI_MoveButtonFocus(currentFocus);
                            helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                        }
                        else if($scope.recommendedProducts.length > 0)
                        {
                            // Selecting right brings focus to the first "More Like This" poster
                            helper.RemoveButtonFocus($scope.currentFocusEl);
                            $scope.focusLevel++;
                            $scope.focusIndexMap[1] = 0;
                            $scope.recommendedProducts[$scope.focusIndexMap[$scope.focusLevel]].isSelected = true;
                            helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                        }
                    }
                    else  {
                        if (currentFocus < $scope.recommendedProducts.length-1)  {
                            $scope.recommendedProducts[currentFocus].isSelected = false;
                            currentFocus++;
                            $scope.recommendedProducts[currentFocus].isSelected = true;
                            $scope.focusIndexMap[$scope.focusLevel] = currentFocus;
                            helper.debugLog("Current focus level: " + $scope.focusLevel + ", focused item: " + $scope.focusIndexMap[$scope.focusLevel]);
                        }
                    }
                }
                break;

            case KEY_CODES.INFO:
                // Info
                $scope.PlayerCoreUI_ShowInfoBar ();
                break;

            case KEY_CODES.CIRCLE:
                // Stop
                $scope.PlayerCoreUI_StopPlayer();
                break;

        }
         return false;
    }

    // Move button focus on 'End of Movie' screen
    function PlayerCoreUI_MoveButtonFocus(newFocus) {
        var nextFocusEl = $scope.endOfMovieButtonId[newFocus];
        helper.SetButtonFocus(nextFocusEl);
        $scope.currentFocusEl = nextFocusEl;
        $scope.focusIndexMap[$scope.focusLevel] = newFocus;
    }

    function PlayerCoreUI_RemoveFocusEndOfMovie () {
        if ($scope.focusLevel < 2) {
            var currentFocus = $scope.focusIndexMap[$scope.focusLevel];
            // remove current focus
            if ($scope.focusLevel == 0) {
                helper.RemoveButtonFocus($scope.currentFocusEl);
            }
            else {
                $scope.recommendedProducts[currentFocus].isSelected = false;
                helper.debugLog("Removed focus: " + currentFocus);
            }
        }
    }

    // Handle mouse over event in end of movie screen
    function PlayerCoreUI_HandleMouseOverEndOfMovie (focusId, focusLevel) {
        PlayerCoreUI_RemoveFocusEndOfMovie();
        $scope.focusLevel = focusLevel;
        if (focusLevel == 0) {
            helper.debugLog("Focus on button id: " + focusId);
            PlayerCoreUI_MoveButtonFocus(focusId);
        }
        else {
            helper.debugLog("new Focus: " + focusId);
            $scope.recommendedProducts[focusId].isSelected = true;
            $scope.focusIndexMap[$scope.focusLevel] = focusId;
        }


    }

    // Handle mouse over event for player buttons
    function PlayerCoreUI_HandleMouseOverPlayer (buttonId) {
        if ($scope.currentButtonId != buttonId) {
            if (buttonId == PlayerButton.PLAY && ($scope.isVideoPaused || $scope.seekInProgress)) {
                // Note - This will highlight the play icon
                buttonId = PlayerButton.PAUSE;
            }

            // Do not focus the player buttons at the end of movie screen b/c the buttons are not active
            if ($scope.endOfMovie) {
                if (buttonId == PlayerButton.CLOSE_INFO || buttonId == PlayerButton.OPEN_INFO || buttonId == PlayerButton.BACK) {
                    PlayerCoreUI_RemoveFocusEndOfMovie();
                    $scope.focusLevel = 2;
                    helper.debugLog("handleMouseOver - set focus on buttonId: " + buttonId);
                    playerHelper.SetButtonFocus($scope, buttonId);
                }
            }
            else {
                helper.debugLog("handleMouseOver - set focus on buttonId: " + buttonId);
                playerHelper.SetButtonFocus($scope, buttonId);
            }
        }
    }

    // Handle QMenu handling for LG
    this.HandleQMenu = function () {
        if (isDefined(playerHelper.handleQmenu) && !$scope.endOfMovie) {
            playerHelper.handleQmenu();
        }

    };


    // Parental controls popup
    function pwPopupHandleBackKey() {
        pwPopupHelper.handleBackKey($scope);
        $scope.PlayerCoreUI_ExitPlayer(null);
    }

    function passwordSubmitClick() {
        $scope.PlayerCoreUI_CheckParentalControlPassword();
    }

}