/**
 * Player controller
 * Player controller functions
 * @author: Peter Rajcani
 */

'use strict';

rbi.controller('playerCtrl', function ($scope, $location, $routeParams, $dialog, playerService, rbiCommonService, productService, loginService, customerService) {

    // Spinner position for the loading screen
    var spinnerPosLoading = {
        x:640,
        y:450
    };

    var networkConnectionErrorCode = (isDefined(playerHelper.NETWORK_CONNECTION_ERROR))? playerHelper.NETWORK_CONNECTION_ERROR: NETWORK_CONNECTION_ERROR;

    $scope.chapterBarId = '#chapter-bar';   // chapter bar
    $scope.infoBarId = '#info-bar';         // info bar
    $scope.resumeButtonID = 'div#player #resume-button .player-button';
    $scope.startOverButtonID = 'div#player #start-over-button .player-button';
    $scope.endOfMovieButtonId = ['div#player div#title-details-button .player-button',
                                 'div#player div#my-redbox-button .player-button',
                                 'div#player div#add-bookmark-button .player-button',
                                 'div#player div#remove-bookmark-button .player-button'];
    $scope.progressBarId = '#titleProgressStatusBar';   // progress bar
    $scope.captionContainerId = '#caption-container';
    $scope.isPreview = false;


    //helper.ReleaseMemory();

	$scope.productId = $routeParams.productId;
    $scope.purchaseOptionId = '';  // initialize purchase option ID as blank

    $scope.playbackParams = {
        productID: 'undefined',
        purchaseOptionID: 'undefined',
        deviceSpec: 'undefined',
        token: 'undefined',
        status: RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT,
        progressWatched: 0,
        pcn: 'undefined'
    };

    // Video data
    $scope.mVideo = {
        duration: 0,
        bitrates: [],
        height: 0,
        width: 0,
        bitrate: 0
    };

    $scope.playerLoaded = false;
    $scope.playerState = 0;
    $scope.heartbeatPeriod = 30000; // send updates to the server every 30 seconds
    $scope.isOffline = false;
    $scope.progressWatched = 0;
    $scope.captionsEnabled = false;
    $scope.scenesOpen = false;
    $scope.isVideoLoading = false;
    $scope.scrubberInterval = 10;
    $scope.showScrubberImage = false;
    $scope.isVideoPaused = false;
    $scope.spinnerUp = false;
    $scope.licenseAcquired = false;
    $scope.showHD = false;
    $scope.resumeInProgress = false;
    $scope.startDoneOnce = false;
    $scope.currentSeekSpeed = 0;
    $scope.seekDirection = 0;
    $scope.controlBarTimer = null;
    $scope.isBuffering = false;
    $scope.seekIndex = 0;
    $scope.seekPosition;
    $scope.seekTimer = null;
    $scope.isControlBarDisplayed = false;
    $scope.showTitle = false;
    $scope.startTime = '0:00:00';
    $scope.chapterBarTimeout = null;
    $scope.currentButtonId = -1;
    $scope.showInfo = false;
    $scope.infoAvailable = false;
    $scope.heartbeatTimer = null;
    $scope.doExit = false;
    $scope.isSpeedTestEnabled = false;
    $scope.isConnected = internetConnected;
    $scope.ignoreKeyPress = false;
    $scope.seekInProgress = false;
    $scope.playbackStarted = false;
    $scope.networkErrorPopupVisible = false;
    $scope.restartPlayer = false;
    $scope.HD_indicatorShown = false;
    $scope.isPlayerStopped = false;
    $scope.vodDefined = (typeof vod == 'undefined')? false:true;
    $scope.startOver = false;
    $scope.showStartResumeButtons = false;
    $scope.pauseOnAppToggle = false;

    // button focus
    $scope.focusIndexMap = [];   // end of movie screen
    $scope.focusIndex = 0;       // for start / resume buttons
    $scope.currentFocusEl = '';
    $scope.focusLevel = 0;

    // Closed captions
    $scope.caption = {
        startTime: 0,
        endTime: 0,
        htmlData: ''
    };

    // End of movie exprience
    $scope.videoEnd = false;
    $scope.endOfMovie = false;
    $scope.showBookmarkPopUp = false;
    $scope.showRecommendedProducts = false;
    $scope.recommendedProducts = [];
    $scope.isCaptionDisplayed = false;

    $scope.titleDetails = {
        title: '',
        description: '',
        image: '',
        ccSupported: false,
        genres: '',
        actors: '',
        badges: 'undefined',
        isBookmarked: '',
        isHD: false,
        rating: '',
        genresDisp: ''  // for Info display (truncated)
    };

    $scope.hideCaptionTimer = null;
    $scope.adjustCaptionPos = 0;

    $scope.captionProperties = {
        textFont: CAPTION_FONT_DEFAULT,
        textSize: CAPTION_TEXT_SIZE_DEFAULT,
        textColor: CAPTION_TEXT_COLOR_DEFAULT, // white
        textOpacity: CAPTION_TEXT_OPACITY_DEFAULT,
        backgroundColor: CAPTION_BACKGROUND_COLOR_DEFAULT,  // none
        backgroundOpacity: CAPTION_BACKGROUND_OPACITY_DEFAULT,
        windowColor: CAPTION_WINDOW_COLOR_DEFAULT,
        windowOpacity: CAPTION_WINDOW_OPACITY_DEFAULT,
        edgeStyle: CAPTION_EDGE_STYLE_DEFAULT
    };

    // Chapter bar
    $scope.chapterData = [];
    $scope.numChapters = 0;
    $scope.currentChapter = 0;
    $scope.chaptersAvailable = false;
    $scope.focusedChapter = 0;    // need to keep this separate b/c LG can focus a different chapter

    $scope.CONTROL_BAR_TIMEOUT = 3000;     // Generic control bar timeout - 3 sec

    // Play position fix for LG
    $scope.playerPositionOffset = 0;
    $scope.currentPlayPosition = -1;

    // Parental control popup
    $scope.uiPWPopup = false;

    // If no parameters are supplied play preview
    if (!helper.isDefined($routeParams.purchaseOptionId)) {
        helper.debugLog('Preview productID: ' + $scope.productId);
        $scope.isPreview = true;
        $scope.playbackUrl = rbiCommonService.getSharedItem("PREVIEW_URL");
        $scope.previewMediaFormat = rbiCommonService.getSharedItem("PREVIEW_MEDIA_FORMAT");
        rbiCommonService.removeSharedItem("PREVIEW_URL");
        rbiCommonService.getSharedItem("PREVIEW_MEDIA_FORMAT");
    }
    else {
        $scope.purchaseOptionId = $routeParams.purchaseOptionId;
        helper.debugLog('productID: ' + $scope.productId);
        helper.debugLog('purchaseOptionID: ' + $scope.purchaseOptionId);
        $scope.isPreview = false;
        $scope.scrubberPath = '';
        $scope.playbackUrl = '';

        // remove PLAYBACK_TITLE_URL from RBI common service
        if (rbiCommonService.isSharedItemExist(PLAYBACK_TITLE_URL)) {
            rbiCommonService.removeSharedItem(PLAYBACK_TITLE_URL);
        }
    }


    $scope.eventHandler = new PlayerEventHandler($scope, $location, $routeParams);

    // Hide main menu
    hideMainMenu();

    if (isDefined(playerHelper.ClearScreen)) {
        playerHelper.ClearScreen($scope);
    }

    // Ger the RBI common service flags for HD indicator
    if (rbiCommonService.isSharedItemExist("HD_ASSET")) {
        $scope.titleDetails.isHD = rbiCommonService.getSharedItem("HD_ASSET");
        rbiCommonService.removeSharedItem("HD_ASSET");

        if ($scope.titleDetails.isHD) {
            helper.debugLog("Media format - HD");
        } else {
            helper.debugLog("Media format - SD");
        }
    }

    if ($scope.isPreview) {
        PlayerCoreUI_Initialize();
    }
    else {
        $scope.titleDetails.rating = rbiCommonService.getSharedItem(RATING);
        rbiCommonService.removeSharedItem(RATING);
        helper.debugLog("Product rating: " + $scope.titleDetails.rating);

        if (helper.isTitleContentResticted($scope.titleDetails.rating)) {
            // Show parental control popup
            pwPopupHelper.showPWPopup($scope, HEADER_TEXT, BODY_TEXT);
        }
        else {
            PlayerCoreUI_Initialize();
        }
    }

    //////////////////////////////////////////
    // Scope functions
    /////////////////////////////////////////

    // player.html
    // Start player
    $scope.startPlayer = function (restart){
        $scope.PlayerCoreUI_StartPlayer(restart);
    };

    // Show/hide progress bar
    $scope.showProgressBar = function () {
        return PlayerCoreUI_ShowProgressBar();
    };

    // Show/hide loading screen
    $scope.showLoadingScreen = function() {
        return PlayerCoreUI_ShowLoadingScreen();
    };

    // Returns true if video is currently playing / paused / seeking or buffering
    $scope.isVideoPlaying = function () {
        return PlayerCoreUI_IsVideoPlaying();
    };

    // End of movie screen
    // determines if title needs to be scrolled
    $scope.scrollTitle = function(item) {
        return PlayerCoreUI_scrollTitle(item);
    };

    $scope.goToTitleDetails = function() {
        $scope.PlayerCoreUI_GoToTitleDetails($scope.productId);
    };

    $scope.goToMyRedbox = function () {
        $scope.PlayerCoreUI_GoToMyRedbox();
    };

    $scope.addBookmark = function () {
        $scope.PlayerCoreUI_AddBookmark();
    };


    $scope.removeBookmark = function () {
        $scope.PlayerCoreUI_RemoveBookmark();
    };

    // Show/hide buttons
    $scope.showScenesButton = function() {
        return $scope.PlayerCoreUI_ShowScenesButton();
    };

    $scope.showFFRwButton = function() {
        return $scope.PlayerCoreUI_ShowFFRwButton();
    };
    $scope.showCCButton = function() {
        return $scope.PlayerCoreUI_ShowCCButton();
    };

    // ZOE-32257 Display Blu-Ray logo trademark
    $scope.isBluRay = function(item) {
        return (item.toUpperCase()==BLU_RAY)?true:false;
    };

    ////////////////////////////////////////////////////////////////
    // Plaform specific callbacks
    ////////////////////////////////////////////////////////////////

    ////////////////////////////////////////
    // VOD callbacks (PS3/PS4 ...)
    ////////////////////////////////////////

    // Send DRM license request (PS3/PS4)
    $scope.onRequestLicenseVOD = function (evt) {
        helper.debugLog("FY: Player::_requestLicenseServer");
        helper.debugLog("License request: " + evt.data.soapChallenge);
        if (isDefined(playerHelper.LicenseResponse)) {
            PlayerCoreUI_GetDRMLicense(evt.data.soapChallenge, playerHelper.LicenseResponse);
        }
    };

    // Video loaded
    $scope.onVideoLoadedVOD = function (evt) {
        $scope.PlayerCoreUI_OnVideoLoaded();
    };

    // Update playhead position
    $scope.onUpdatePositionVOD = function (evt) {
        $scope.PlayerCoreUI_UpdatePosition(evt.data.time);
    };

    // Video metatdata received
    // This function is platform specific
    $scope.onVideoMetadataVOD = function (evt) {
        helper.debugLog("Video metatdata received...");
        PlayerCoreUI_OnVideoMetadata(evt.data.duration);
    };

    // Playback started
    $scope.onPlaybackStartedVOD = function (evt) {
        helper.debugLog('playback started');
        PlayerCoreUI_OnPlaybackStarted();
    };


    // Buffering start
    $scope.onBufferingStartVOD = function (evt) {
        helper.debugLog('buffering_start fired');
        PlayerCoreUI_OnBufferingStart();
    };

    // Buffering end
    $scope.onBufferingEndVOD = function (evt) {
        PlayerCoreUI_OnBufferingEnd();
    };

    $scope.onResumeVOD = function (evt) {
        $scope.PlayerCoreUI_OnResume();
    };

    $scope.onSeekCompleteVOD = function (evt) {
        PlayerCoreUI_OnSeekComplete();
    };

    // Callback after the video is stopped
    $scope.onStopVOD = function (evtObj) {
        PlayerCoreUI_OnStop();
    };

    $scope.onPlaybackCompleteVOD = function (evt) {
        PlayerCoreUI_OnPlaybackComplete();
    };

    $scope.onBitrateChangeVOD = function (evt) {
        helper.debugLog("onBitrateChange - new bitrate: " + evt.data.newBitrate);
        PlayerCoreUI_OnBitrateChange(evt.data.newBitrate);
    };

    $scope.onTextMetadataVOD = function (evt) {
        PlayerCoreUI_OnTextMetadata(evt.data.name, evt.data.language);
    };

    $scope.onRenderCaptionVOD = function (evt) {
        PlayerCoreUI_OnRenderCaption(evt.data.startTime, evt.data.endTime, evt.data.htmlContent);
    };

    $scope.onAppToggleVOD = function(evt) {
        if (evt.data.visible) {
            PlayerCoreUI_PauseOnAppToggle();
        }
    };

    $scope.onErrorVOD = function (evt) {
        var errorCode = '';
        if (evt.data.name.toLowerCase() == "socketconnectfailed") {
            errorCode = networkConnectionErrorCode;
        }
        else if (evt.data.name.toUpperCase().search('DRM') >= 0) {
            errorCode = DRM_LICENSE_ERROR;   // DRM license failed
        }
        $scope.PlayerCoreUI_OnError(errorCode);

        if (config.debug) {
            var errorMessage = "Playback Error: \n";
            for (var prop in evt) {
                helper.debugLog(prop + ': ' + evt[prop]);
                errorMessage += prop + ': ' + evt[prop] + "\n";
                var evtt = evt[prop];
                if (typeof(evtt) == 'object') {
                    for (var propp in evtt) {
                        helper.debugLog(' ' + propp + ': ' + evtt[propp]);
                        errorMessage += ' ' + propp + ': ' + evtt[propp] + "\n";
                    }
                }
            }
            helper.debugLog(errorMessage);
        }
    };

    $scope.onConnectionChangedVOD = function (evt) {
        var connected = evt.data.connected;
        psnLogged = playerHelper.CheckPSN(connected);
        PlayerCoreUI_OnConnectionChange(connected);
    };

    /////////////////////////////
    // Samsung callbacks
    /////////////////////////////

    // These need to be registered in playerHelper.LoadPlayer
    $scope.onCurrentPlayTime = function (timeMs) {
        if (!$scope.resumeInProgress) {
            var progressTimeSec = Math.floor($scope.progressWatched / SECONDS_TO_MS);
            var currentPos = Math.floor(timeMs / SECONDS_TO_MS);
            //helper.debugLog("onCurrentPlayTime - progressWatched: " + $scope.progressWatched + ", timeMs: " + timeMs);
            //helper.debugLog("onCurrentPlayTime- progressTime: " + progressTimeSec + ", currentPos: " + currentPos);
            if (currentPos != progressTimeSec) {
                //helper.debugLog("onCurrentPlayTime - updating playback position: " + timeMs + " ms");
                $scope.PlayerCoreUI_UpdatePosition(timeMs);
            }
        }
    };

    $scope.onStreamInfoReady = function () {
        helper.debugLog("onStreamInfoReady called");
        PlayerCoreUI_OnPlaybackStarted();
    };

    $scope.onBufferingComplete = function (onResume) {
        //helper.debugLog("onBufferingComplete called");
        PlayerCoreUI_OnBufferingEnd();
        // ZOE-32635: playback resumes after this call; highlight the pause icon
        helper.debugLog("onBufferingComplete - calling set button focus with button ID: " +  PlayerButton.PLAY);
        playerHelper.SetButtonFocus($scope, PlayerButton.PLAY);
        if (onResume) {
            $scope.PlayerCoreUI_OnResume();
        }
    };

    $scope.onBufferingProgress = function() {
        // not supported by Player core UI
    };

    $scope.onBufferingStart = function () {
        //helper.debugLog("onBufferingStart called");
        PlayerCoreUI_OnBufferingStart();
    };

    $scope.onConnectionFailed = function() {
        helper.debugLog("onConnectionFailed called");
        // Needs to be mapped to the generic playback error
        // From Samsung SDK documentation - This event is sent only when media player fails
        // to connect to server at the begining or at the jump in HTTP and HTTPS streaming.
        $scope.PlayerCoreUI_OnError('');
    };

    $scope.onNetworkDisconnected = function() {
        helper.debugLog("onNetworkDisconnected called");
        $scope.PlayerCoreUI_OnError(networkConnectionErrorCode);
    };

    $scope.onRenderError = function (errorType) {
        helper.debugLog("onRenderError called - error type:" + errorType);
        //TODO: Handle different render error types
        $scope.PlayerCoreUI_OnError('');
    };

    $scope.onRenderingComplete  = function () {
        helper.debugLog("onRenderingComplete called");
        PlayerCoreUI_OnPlaybackComplete();
    };


    $scope.onResolutionChanged = function() {
        helper.debugLog("onResolutionChanged called");
    };


    $scope.onStreamNotFound = function () {
        helper.debugLog("onStreamNotFound called");
        $scope.PlayerCoreUI_OnError('PLAYBACK_INIT');
    };


    $scope.onAuthenticationFailed = function () {
        helper.debugLog("onAuthenticationFailed called");
        $scope.PlayerCoreUI_OnError(DRM_LICENSE_ERROR);
    };

    /** Update player position callback for LG ***/
    $scope.updatePlayerPosition = function (timeMs) {
        if (!$scope.resumeInProgress) {    // ignore position updates during initial resume
            if ($scope.currentPlayPosition == -1) {
                // In the case we only receive offset and not the current position, add the offset to
                // the current player position
                var progressTimeSec = Math.floor($scope.progressWatched / SECONDS_TO_MS);
                var currentPos = Math.floor(timeMs / SECONDS_TO_MS);
                if (currentPos <= 1 && progressTimeSec > 60) {
                    // adjust the offset for calculating the player position
                    $scope.playerPositionOffset = $scope.progressWatched;
                }
                else {
                    // we have received a correct currentPosition or the movie has been watched for less than 1 min
                    $scope.playerPositionOffset = 0;
                }
                helper.debugLog("updatePlayerPosition - progressWatched: " + $scope.progressWatched + ", time ms: " + timeMs);
                helper.debugLog("updatePlayerPosition - current pos: " + currentPos + ", progressTimeSec: " + progressTimeSec + ", offset:" + $scope.playerPositionOffset);
            }
            $scope.currentPlayPosition = timeMs + $scope.playerPositionOffset;
            //helper.debugLog("updatePlayerPosition - adjusted pos: " + $scope.currentPlayPosition + ", time ms: " + timeMs);
            $scope.PlayerCoreUI_UpdatePosition($scope.currentPlayPosition);

        }
    };


    /* Player time conversion utility to convert seconds to hh:mm:ss format */
    $scope.PlayerCoreUI_TimeConvert = function (totalSec) {
        var hours = parseInt(totalSec / 3600) % 24;
        var minutes = parseInt(totalSec / 60) % 60;
        var seconds = totalSec % 60;
        return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    };


    // Set player state (needed for rewind on Samsung if we rewind / seek before starting position)
    $scope.PlayerCoreUI_SetPlayerState = function (state) {
        $scope.playerState = state;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // RBI_CoreUI functions
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // Conviva start
    /**
     * Initalize Conviva tags
     */
    function PlayerCoreUI_ConvivaInit() {
        if (RBI.PlatformConfig.convivaEnabled) {
            var convivaTags = {
                productId: $scope.productId,
                purchaseOptionId: ($scope.isPreview) ? '' : $scope.purchaseOptionId,
                purchaseType: ($scope.isPreview) ? '' : $scope.titleDetails.purchaseType,
                contentType: $scope.isPreview ? "Trailer" : "Movie",
                title: $scope.titleDetails.title,
                genre: $scope.titleDetails.genres,
                mediaFormat: ($scope.isPreview)? $scope.previewMediaFormat:(($scope.titleDetails.isHD)? "HD" : "SD")
            };

            //Initialize Conviva
            playerHelper.ConvivaInit();

            //Set Conviva tags
            conviva.setTags(convivaTags);
        }
    }

    /**
     * Create Conviva session
     */
    $scope.PlayerCoreUI_CreateConvivaSession = function () {
        if (RBI.PlatformConfig.convivaEnabled) {
            try {
                if (conviva.sessionId == null || conviva.sessionId == undefined) {
                    var customerID = '';

                    // ZOE-34329: If surrogate customer ID is not found in platform storage, call GetCustomer API
                    if (helper.isUserLoggedIn()) {
                        if (isDefined(platformStorage.getItem(SURROGATE_CUSTOMER_ID))) {
                            customerID = platformStorage.getItem(SURROGATE_CUSTOMER_ID);
                            helper.debugLog("Customer ID: " + customerID);
                            conviva.createSession(customerID, $scope.playbackUrl);
                        }
                        else  {
                            customerService.getCustomer(function(data) {
                                    customerID = data.getSurrogateCustomerID();
                                    platformStorage.setItem(SURROGATE_CUSTOMER_ID, customerID);
                                    helper.debugLog("Customer ID: " + customerID);
                                    conviva.createSession(customerID, $scope.playbackUrl);
                                },
                                function (data) {
                                    helper.debugLog("Get Customer failed, sending blank customer ID");
                                    conviva.createSession(customerID, $scope.playbackUrl);
                                });
                        }
                    }
                    else {
                        helper.debugLog("User not logged in, sending blank customer ID");
                        conviva.createSession(customerID, $scope.playbackUrl);
                    }

                }
            } catch (e) {
                Logger.Log("Exception in Creating Conviva Session : " + e);
            }
        }
    };
    // Conviva end


    // Get current player state
    $scope.PlayerCoreUI_GetPlayerState = function () {
        if ($scope.vodDefined) {
            $scope.playerState = vod.player.getState().id;
        }
        return $scope.playerState;
    };

    // video loaded - this callback is called after the DRM license request was successful and video is loaded
    $scope.PlayerCoreUI_OnVideoLoaded = function () {
        helper.debugLog('load fired');
        if ($scope.doExit) {
            playerHelper.Stop();
            $scope.playerState =0;
            $scope.restartPlayer = false;
            $scope.PlayerCoreUI_ExitPlayer(null);
        }
        else {
            $scope.playerState = PLAYER_STATE_LOADED;
            PlayerCoreUI_StartPlayback();
        }
    };


    /**
     * PlayerCoreUI_StartPlayer
     *
     * @param restart - true: start playing from the beginning / false: resume playing at current position
     */
    $scope.PlayerCoreUI_StartPlayer = function (restart) {
        $scope.startOver = restart;
        $scope.showStartResumeButtons = false;
        if (!$scope.spinnerUp) {
            var spinnerPosition = PlayerCoreUI_SetSpinnerPosition();
            helper.showSpinner(SPINNER_FADEOUT_MS, spinnerPosition);
            $scope.spinnerUp = true;
        }

        if ($scope.showInfo) {
            $scope.showInfo = false;
            $scope.PlayerCoreUI_RepositionProgressBar($scope.showInfo, $scope.infoBarId);
        }

        if (!$scope.$$phase) {
            $scope.$apply();
        }

        // Start Conviva monitoring
        PlayerCoreUI_ConvivaInit();

        playerHelper.LoadPlayer($scope);
        $scope.playerLoaded = true;
    };

    // returns true only when the player is in playing state
    $scope.PlayerCoreUI_isPlayerInPlayingState = function () {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (playerState == PLAYER_STATE_PLAYING) {
            return true;
        }
        else {
            return false;
        }
    };

    // Resume play function
    $scope.PlayerCoreUI_ResumePlay = function () {
        playerHelper.Pause();
        $scope.playerState = PLAYER_STATE_PAUSED;
        var resumePos = Math.floor($scope.progressWatched / SECONDS_TO_MS);
        helper.debugLog("Resuming playback at : " + resumePos + " sec");
        $scope.seekInProgress = true;
        var resumeStatus = playerHelper.SeekForward(resumePos, resumePos);
        helper.debugLog("Resume status : " + resumeStatus);
        if (resumeStatus == 0) {
            // if resume fails the movie will start playing from the beginning
            $scope.progressWatched = 0;
            PlayerCoreUI_OnSeekComplete();
            $scope.PlayerCoreUI_OnResume();
        }
        else {
            PlayerCoreUI_OnSeekComplete();
        }
        return resumeStatus;
    };

    /**
     * Update current playhead position
     * Note: This call is ignored when the player is resuming playback on startup
     * This event is only consumed when player is in playing state
     * If this event is fired during buffering, then the playback has resumed and the control bar and buffering screen is hidden
     */
    $scope.PlayerCoreUI_UpdatePosition = function(playheadPosition) {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (playerState == PLAYER_STATE_PLAYING && playheadPosition > 0) {
            $scope.progressWatched = playheadPosition; // ms
            //helper.debugLog("PlayerCoreUI_UpdatePosition: " + $scope.progressWatched);
            if ($scope.isBuffering) {
                // Resumed playing from buffering - hide control bar
                // Buffering end event not firing sometimes
                $scope.isBuffering = false;
                $scope.playerState = PLAYER_STATE_PLAYING;
                helper.debugLog("Resumed playing from buffering - hide spinner");
                //if ($scope.spinnerUp)  {    // Removed the check b/c it caused the spinner to stay on duirng playback
                helper.hideSpinner();
                $scope.spinnerUp = false;
                //}
                // if the video needs to be paused after PS4 button is pressed
                if ($scope.pauseOnAppToggle) {
                    $scope.isVideoPaused = true;
                    playerHelper.Pause();
                    $scope.playerState = PLAYER_STATE_PAUSED;
                    $scope.pauseOnAppToggle = false;
                    $scope.isControlBarDisplayed = true;
                }
                else {
                    $scope.isVideoPaused = false;
                    if (!$scope.scenesOpen && !$scope.showInfo) {
                        $scope.isControlBarDisplayed = false;
                    }
                }
                //$scope.$apply();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            if ($scope.isControlBarDisplayed) {
                var progressTimeSec = $scope.progressWatched / SECONDS_TO_MS;
                PlayerCoreUI_UpdateProgressBar(progressTimeSec);
                //$scope.$apply();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    };

    /* Player Controls */
    // Play / Pause key
    $scope.PlayerCoreUI_HandlePlayPauseKey = function () {
        if ($scope.scenesOpen) {
            $scope.PlayerCoreUI_PlayScene();
        } else {
            $scope.PlayerCoreUI_PlayPause();
        }
    };

    $scope.PlayerCoreUI_PlayPause = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && $scope.playbackStarted) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if ($scope.seekTimer !== null) {
                PlayerCoreUI_Resume();
                // ZOE-34456: set the focus back on play button
                if ($scope.isControlBarDisplayed && !$scope.showInfo && isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_PlayPause - calling set button focus with button ID: " +  PlayerButton.PLAY);
                    playerHelper.SetButtonFocus($scope, PlayerButton.PLAY);
                }
            }
            else {
                // Toggle control bar on play pause
                if (playerState == PLAYER_STATE_PLAYING) {
                    if (!$scope.showInfo && !$scope.pauseOnAppToggle) {
                        if (isDefined(playerHelper.SetButtonFocus)) {
                            helper.debugLog("PlayerCoreUI_PlayPause - calling set button focus with button ID: " +  PlayerButton.PAUSE);
                            playerHelper.SetButtonFocus($scope, PlayerButton.PAUSE);
                        }
                    }
                    pause();
                }
                else {
                    if ($scope.isControlBarDisplayed && !$scope.showInfo && isDefined(playerHelper.SetButtonFocus)) {
                        helper.debugLog("PlayerCoreUI_PlayPause - calling set button focus with button ID: " +  PlayerButton.PLAY);
                        playerHelper.SetButtonFocus($scope, PlayerButton.PLAY);
                    }
                    play();
                }
            }
        }
    };

    // Play/pause functions for Samsung/LG devices that have dedicated play and pause buttons
    $scope.PlayerCoreUI_Pause = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && $scope.playbackStarted) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState == PLAYER_STATE_PLAYING) {
                if (isDefined(playerHelper.SetButtonFocus && !$scope.pauseOnAppToggle)) {
                    helper.debugLog("PlayerCoreUI_Pause - calling set button focus with button ID: " +  PlayerButton.PAUSE);
                    playerHelper.SetButtonFocus($scope, PlayerButton.PAUSE);
                }
                pause();
            }
        }
    }


    $scope.PlayerCoreUI_Play = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && $scope.playbackStarted) {
            if ($scope.seekTimer !== null) {
                PlayerCoreUI_Resume();
                // ZOE-34456: set the focus back on play button
                if ($scope.isControlBarDisplayed && !$scope.showInfo && isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("Resume playback - calling set button focus with button ID: " +  PlayerButton.PLAY);
                    playerHelper.SetButtonFocus($scope, PlayerButton.PLAY);
                }
            }
            else {
                var playerState = $scope.PlayerCoreUI_GetPlayerState();
                if (playerState == PLAYER_STATE_PAUSED) {
                    if (isDefined(playerHelper.SetButtonFocus)) {
                        helper.debugLog("PlayerCoreUI_Play - calling set button focus with button ID: " +  PlayerButton.PLAY);
                        playerHelper.SetButtonFocus($scope, PlayerButton.PLAY);
                    }
                    play();
                }
            }
        }
    }

    function pause() {
        // clear pending control bar timeout so that we can show it
        if ($scope.controlBarTimer != null) {
            clearTimeout($scope.controlBarTimer);
            helper.debugLog("pause - Cleared control bar timer id: " + $scope.controlBarTimer);
            $scope.controlBarTimer = null;
        }
        $scope.isControlBarDisplayed = true;
        PlayerCoreUI_PlayVideo();
        PlayerCoreUI_UpdateProgressBar($scope.progressWatched/SECONDS_TO_MS);
        //$scope.$apply();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function play() {
        if ($scope.isControlBarDisplayed && !$scope.showInfo) {
            PlayerCoreUI_SetControlBarTimeout($scope.CONTROL_BAR_TIMEOUT);
        }
        PlayerCoreUI_PlayVideo();
        // reset pauseOnAppToggle flag when playback resumes
        if ($scope.pauseOnAppToggle) {
            $scope.pauseOnAppToggle = false;
        }
        //$scope.$apply();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    // Resume playback from fast forward rewind
    function PlayerCoreUI_Resume() {
        PlayerCoreUI_StopSeeking();
        var seekComplete = false;
        var offset = 0;
        var currentPosition = $scope.progressWatched/SECONDS_TO_MS;
        if (currentPosition > $scope.seekPosition) {
            offset = Math.round(currentPosition - $scope.seekPosition);
            helper.debugLog("seek offset: " + offset);
            if (offset > 0) {
                seekComplete = playerHelper.SeekBackward($scope.seekPosition, offset);
            }
        }
        else if (currentPosition < $scope.seekPosition) {
            offset = Math.round($scope.seekPosition - currentPosition);
            helper.debugLog("seek offset: " + offset);
            if (offset > 0) {
                seekComplete = playerHelper.SeekForward($scope.seekPosition, offset);
            }
        }

        if (offset == 0) {
            // the current position and seek position are the same
            PlayerCoreUI_ClearSeekFlags();
            PlayerCoreUI_OnSeekComplete();
        }
        else {
            if (seekComplete) {
                $scope.progressWatched = $scope.seekPosition * SECONDS_TO_MS;
                PlayerCoreUI_OnSeekComplete();
            }
            else if ($scope.vodDefined) {
                // show spinner, wait for onSeekComplete callback
                $scope.progressWatched = $scope.seekPosition * SECONDS_TO_MS;
                helper.showSpinner(SPINNER_FADEOUT_MS, config.spinnerPosition);
                $scope.spinnerUp = true;
                $scope.ignoreKeyPress = true;
                helper.debugLog("key press disabled");
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            else {
                // Handle seek error for Samsung / LG
                PlayerCoreUI_ClearSeekFlags();
                PlayerCoreUI_OnSeekComplete();
            }
        }
    }


    // ZOE-32239: Show control bar with a 10 sec timer to hide it
    // Only show control bar if the player is in playing state and the control bar
    // is not already shown (such as during info or scenes) otherwise the timer will
    // hide the control bar when it should not.
    $scope.PlayerCoreUI_ShowControlBar = function () {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (playerState == PLAYER_STATE_PLAYING && !$scope.isControlBarDisplayed) {
            $scope.PlayerCoreUI_ShowControls(SHOW_CONTROL_BAR_TIMEOUT);
        }
    };


    // Skip forward (next chapter)
    $scope.PlayerCoreUI_SkipForward = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && !$scope.isPreview && $scope.playbackStarted && !$scope.seekInProgress) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState == PLAYER_STATE_PLAYING ||
                playerState == PLAYER_STATE_PAUSED) {
                helper.debugLog("Skip forward fired, player state: " + playerState);
                $scope.PlayerCoreUI_ShowControls(0);
                $scope.PlayerCoreUI_HideCaption();
                if ($scope.isVideoPaused) {
                    $scope.isVideoPaused = false;
                }

                if (isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_SkipForward - calling set button focus with button ID: " +  PlayerButton.SKIP_FWD);
                    playerHelper.SetButtonFocus($scope, PlayerButton.SKIP_FWD);
                }

                var chapterIndex = Math.floor($scope.progressWatched / (CHAPTER_INTERVAL * SECONDS_TO_MS)) + 1;
                if (chapterIndex * CHAPTER_INTERVAL < $scope.mVideo.duration) {
                    PlayerCoreUI_GoToChapter(chapterIndex);
                }
            }
            else {
                helper.debugLog("Key press ignored, player state: " + playerState);
            }
        }
    };

    // Skip backward (previous chapter)
    $scope.PlayerCoreUI_SkipBackward = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && !$scope.isPreview && $scope.playbackStarted && !$scope.seekInProgress) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState == PLAYER_STATE_PLAYING ||
                playerState == PLAYER_STATE_PAUSED) {
                helper.debugLog("Skip backward fired, player state: " + playerState);
                $scope.PlayerCoreUI_ShowControls(0);
                $scope.PlayerCoreUI_HideCaption();
                if ($scope.isVideoPaused) {
                    $scope.isVideoPaused = false;
                }

                if (isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_SkipBackward - calling set button focus with button ID: " +  PlayerButton.SKIP_RWD);
                    playerHelper.SetButtonFocus($scope, PlayerButton.SKIP_RWD);
                }

                var chapterIndex = Math.floor($scope.progressWatched / (CHAPTER_INTERVAL * SECONDS_TO_MS)) - 1;
                if (chapterIndex >= 0) {
                    PlayerCoreUI_GoToChapter(chapterIndex);
                }
            }
            else {
                helper.debugLog("Key press ignored, player state: " + playerState);
            }
        }
    };

    // Fast forward
    $scope.PlayerCoreUI_FastForward = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && $scope.playbackStarted) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState == PLAYER_STATE_PLAYING ||
                playerState == PLAYER_STATE_PAUSED) {
                helper.debugLog("Fast forward fired");
                if ($scope.isVideoPaused) {
                    $scope.isVideoPaused = false;
                }
                // only needed for LG
                if (isDefined(playerHelper.stopProgressTimer)){
                    playerHelper.stopProgressTimer();
                }
                $scope.PlayerCoreUI_ShowControls(0);
                $scope.PlayerCoreUI_HideCaption();
                if (isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_FastForward - calling set button focus with button ID: " + PlayerButton.FFW);
                    playerHelper.SetButtonFocus($scope, PlayerButton.FFW);
                }
                // Only needed for LG / Samsung to change icon of play/pause button to play icon
                if (isDefined(playerHelper.SetPlayButtonIcon)) {
                    playerHelper.SetPlayButtonIcon();
                }
                PlayerCoreUI_Seek(1); // seek direction - ffwd
            }
            else {
                helper.debugLog("Key press ignored, player state: " + playerState);
            }
        }
    };


    // Rewind
    $scope.PlayerCoreUI_Rewind = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && $scope.playbackStarted) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState == PLAYER_STATE_PLAYING ||
                playerState == PLAYER_STATE_PAUSED) {
                helper.debugLog("Rewind fired");
                if ($scope.isVideoPaused) {
                    $scope.isVideoPaused = false;
                }
                // only needed for LG
                if (isDefined(playerHelper.stopProgressTimer)){
                    playerHelper.stopProgressTimer();
                }
                $scope.PlayerCoreUI_ShowControls(0);
                $scope.PlayerCoreUI_HideCaption();
                if (isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_Rewind - calling set button focus with button ID: " + PlayerButton.RWD);
                    playerHelper.SetButtonFocus($scope, PlayerButton.RWD);
                }
                // Only needed for LG / Samsung to change icon of play/pause button to play icon
                if (isDefined(playerHelper.SetPlayButtonIcon)) {
                    playerHelper.SetPlayButtonIcon();
                }
                PlayerCoreUI_Seek(-1); // seek direction - rwd
            }
            else {
                helper.debugLog("Key press ignored, player state: " + playerState);
            }
        }
    };

    // Resume callback - called when playback resumes from seek
    $scope.PlayerCoreUI_OnResume = function () {

        var scopeApply = false;
        if ($scope.resumeInProgress && !$scope.seekInProgress) {
            // Ignore this event since seek has not started yet
            helper.debugLog("OnResume event ignored");
            return;
        }

        helper.debugLog("OnResume Fired");
        $scope.playerState = PLAYER_STATE_PLAYING;
        helper.debugLog("Player state: " + $scope.playerState);

        if ($scope.ignoreKeyPress) {
            // enable back key presses disabled during seeking
            $scope.ignoreKeyPress = false;
            helper.debugLog("onResume - key press enabled");
        }


        if ($scope.resumeInProgress) {
            $scope.resumeInProgress = false;
            $scope.playbackStarted = true;
            PlayerCoreUI_SetControlBarTimeout($scope.CONTROL_BAR_TIMEOUT);
            scopeApply = true;
        }


        if ($scope.seekInProgress) {
            $scope.seekInProgress = false;
            if ($scope.spinnerUp)  {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
            scopeApply = true;
        }

        if ($scope.showScrubberImage) {
            $scope.showScrubberImage = false;
        }

        if (scopeApply && !$scope.$$phase) {
            $scope.$apply();
        }
    };

    /**
     * Key handling for open/close scenes
     */
    $scope.PlayerUI_HandleKeyScenes = function() {
        if ($scope.PlayerCoreUI_ShowScenesButton() && !$scope.PlayerCoreUI_ShowBufferingScreen())
            if ($scope.scenesOpen) {
                $scope.PlayerCoreUI_CloseScenes();
            }
            else {
                if ($scope.showInfo) {
                    $scope.PlayerCoreUI_ShowInfoBar();
                }
                $scope.PlayerCoreUI_OpenScenes();
            }
    };


    $scope.PlayerCoreUI_ScrollChapterBar = function (increment) {
        if (!$scope.playPreview && $scope.scenesOpen && $scope.playbackStarted) {
            if ($scope.chapterBarTimeout != null) {
                clearTimeout($scope.chapterBarTimeout);
                $scope.chapterBarTimeout = null;
            }
            var nextChapter = $scope.focusedChapter + increment;
            if (nextChapter < $scope.numChapters && nextChapter >= 0) {
                $scope.currentChapter = nextChapter;
                $scope.focusedChapter = nextChapter;
            }
            PlayerCoreUI_ShowChapterBar();
            PlayerCoreUI_SetChapterBarTimeout(SCENES_CONTROL_BAR_TIMEOUT); // 30 seconds
        }
    };

    // Open scenes
    $scope.PlayerCoreUI_OpenScenes = function() {
        $scope.PlayerCoreUI_ShowControls(0);
        $scope.scenesOpen = true;
        $scope.currentChapter = Math.floor($scope.progressWatched/(CHAPTER_INTERVAL*SECONDS_TO_MS));
        $scope.focusedChapter = $scope.currentChapter;
        PlayerCoreUI_ShowChapterBar();
        $scope.PlayerCoreUI_RepositionProgressBar($scope.scenesOpen, $scope.chapterBarId);

        // Start a 30 sec timeout to hide the chapter bar
        if ($scope.chapterBarTimeout != null) {
            clearTimeout($scope.chapterBarTimeout);
            $scope.chapterBarTimeout = null;
        }
        PlayerCoreUI_SetChapterBarTimeout(SCENES_CONTROL_BAR_TIMEOUT); // 30 seconds
        if (isDefined(playerHelper.SetButtonFocus)) {
            helper.debugLog("PlayerCoreUI_OpenScenes - calling set button focus with button ID: " + PlayerButton.CLOSE_SCENES);
            playerHelper.SetButtonFocus($scope, PlayerButton.CLOSE_SCENES);
        }
    };

    // Close scenes
    $scope.PlayerCoreUI_CloseScenes = function() {
        if ($scope.isConnected) {
            // ZOE-31846: if video is paused do not hide the progress bar
            $scope.PlayerCoreUI_ShowControls(($scope.endOfMovie || $scope.isVideoPaused)?0:$scope.CONTROL_BAR_TIMEOUT);
        }
        $scope.scenesOpen = false;
        $scope.chapterData = [];
        if ($scope.chapterBarTimeout != null) {
            clearTimeout($scope.chapterBarTimeout);
            $scope.chapterBarTimeout = null;
        }
        if ($scope.isConnected && isDefined(playerHelper.SetButtonFocus)) {
            helper.debugLog("PlayerCoreUI_CloseScenes - calling set button focus with button ID: " + PlayerButton.OPEN_SCENES);
            playerHelper.SetButtonFocus($scope, PlayerButton.OPEN_SCENES);
        }
        $scope.PlayerCoreUI_RepositionProgressBar($scope.scenesOpen, $scope.chapterBarId);
    };

    // For ng-click event on select scene - highlight selected scene and play it
    $scope.PlayerCoreUI_SelectScene = function (chapterNumber) {
        if ($scope.focusedChapter != chapterNumber) {
            $scope.PlayerCoreUI_FocusScene(chapterNumber);
        }
        $scope.currentChapter = $scope.focusedChapter;
        helper.debugLog("Playing chapter nummber: " + $scope.currentChapter);
        $scope.PlayerCoreUI_PlayScene();
    };

    // For ng-mouseover event for current scene - highlight the selected scene
    $scope.PlayerCoreUI_FocusScene = function (chapterNumber) {
        for (var i = 0; i < NUM_CHAPTERS_PER_PAGE; i++) {
            $scope.chapterData[i].isSelected = ($scope.chapterData[i].chapterNumber == chapterNumber) ? true : false;
        }
        $scope.focusedChapter = chapterNumber;
        helper.debugLog("focus on chapter number: " + chapterNumber);
        //$scope.$apply();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.PlayerCoreUI_PlayScene = function () {
        if ($scope.chapterBarTimeout != null) {
            clearTimeout($scope.chapterBarTimeout);
            $scope.chapterBarTimeout = null;
        }

        PlayerCoreUI_GoToChapter($scope.currentChapter);
        $scope.PlayerCoreUI_HideCaption();
        if ($scope.isVideoPaused) {
            // if the video was paused while scenes were open reset the paused flag to hide the indicator
            $scope.isVideoPaused = false;
        }
        PlayerCoreUI_SetChapterBarTimeout(5000); // 5 seconds
    };

    $scope.PlayerCoreUI_ShowControls = function (controlBarTimeout) {
        if ($scope.controlBarTimer != null) {
            clearTimeout($scope.controlBarTimer);
            helper.debugLog("Show controls - Cleared control bar timer id: " + $scope.controlBarTimer);
            $scope.controlBarTimer = null;
        }
        if (!$scope.isControlBarDisplayed) {
            $scope.isControlBarDisplayed = true;
            PlayerCoreUI_UpdateProgressBar($scope.progressWatched/SECONDS_TO_MS);
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
        if ($scope.isControlBarDisplayed && controlBarTimeout > 0) {
            PlayerCoreUI_SetControlBarTimeout(controlBarTimeout);
        }
    };

    /**
     * Show / hide info bar
     */
    $scope.PlayerCoreUI_ShowInfoBar = function() {
        if (!$scope.endOfMovie && $scope.scenesOpen) {
            $scope.PlayerCoreUI_CloseScenes();
        }
        if ($scope.infoAvailable) {
            if (!$scope.showInfo) {
                if ($scope.chapterBarTimeout != null) {
                    clearTimeout($scope.chapterBarTimeout);
                    $scope.chapterBarTimeout = null;
                }

                // Open info
                $scope.showInfo = true;
                $scope.PlayerCoreUI_ShowControls(0);
                $scope.PlayerCoreUI_RepositionProgressBar($scope.showInfo, $scope.infoBarId);
                if (isDefined(playerHelper.SetButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_ShowInfoBar - calling set button focus with button ID: " + PlayerButton.CLOSE_INFO);
                    playerHelper.SetButtonFocus($scope, PlayerButton.CLOSE_INFO);
                }
                PlayerCoreUI_SetChapterBarTimeout(SCENES_CONTROL_BAR_TIMEOUT); // 30 seconds
            }
            else {
                // Close info and hide control bar
                $scope.showInfo = false;
                $scope.PlayerCoreUI_RepositionProgressBar($scope.showInfo, $scope.infoBarId);
                if (isDefined(playerHelper.RemoveButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_ShowInfoBar - calling remove button focus with button ID: " + PlayerButton.OPEN_INFO);
                    playerHelper.RemoveButtonFocus(PlayerButton.OPEN_INFO);
                }
                if ($scope.PlayerCoreUI_isPlayerInPlayingState() && !$scope.endOfMovie) {
                    // hide the control bar
                    $scope.isControlBarDisplayed = false;
                }
            }
           // $scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    };

    // Stop player (user pressed stop button)
    $scope.PlayerCoreUI_StopPlayer = function () {
        helper.debugLog("Stop fired");

        if ($scope.isVideoLoading) {
            $scope.doExit = true;
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState == PLAYER_STATE_NOT_LOADED) {
                $scope.PlayerCoreUI_ExitPlayer(null);
            }
            else {
                $scope.startDoneOnce = false;
                $scope.isPlayerStopped = true;
            }
        }
        else if ($scope.isConnected) {
            if ($scope.endOfMovie || $scope.isPreview ||
                (PlayerCoreUI_IsVideoPlaying() &&
                    ($scope.mVideo.duration - $scope.progressWatched / SECONDS_TO_MS < END_OF_MOVIE_THRESHOLD))) {
                PlayerCoreUI_StopPlaying(false);
            }
            else {
                // JIRA 23209 - Show confirmation popup
                PlayerCoreUI_ShowExitPlayerPopup();
            }
        }
        else {
            PlayerCoreUI_StopPlaying(true);
            $scope.PlayerCoreUI_ExitPlayer(null);
        }
    };

    // Show / hide captions
    $scope.PlayerCoreUI_ClosedCaptions = function () {
        if (!$scope.PlayerCoreUI_ShowBufferingScreen() && !$scope.isPreview && $scope.titleDetails.ccSupported && !$scope.endOfMovie && $scope.playbackStarted) {

            if (!$scope.scenesOpen && !$scope.showInfo && !$scope.isVideoPaused && !$scope.seekInProgress) {
                // Only show the control bar with timeout if the player is not paused and scenes/info are not open
                $scope.PlayerCoreUI_ShowControls($scope.CONTROL_BAR_TIMEOUT);
            }

            if ($scope.captionsEnabled) {
                $scope.captionsEnabled = false;
                if (isDefined( playerHelper.CaptionOff)) {
                    playerHelper.CaptionOff();
                }
            }
            else {
                $scope.captionsEnabled = true;
                if (isDefined( playerHelper.CaptionOn)) {
                    playerHelper.CaptionOn();
                }
                accountHelper.getCaptionAttributes($scope.captionProperties);
                accountHelper.applyCaptionAttributes($scope.captionContainerId, '#caption-text', $scope.captionProperties);
            }
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    };

    // Hide the caption
    $scope.PlayerCoreUI_HideCaption = function() {
        //helper.debugLog("PlayerCoreUI_HideCaption fired isCaptionDisplayed = " + $scope.isCaptionDisplayed);
        if ($scope.isCaptionDisplayed) {
            $scope.isCaptionDisplayed = false;
            if ($scope.hideCaptionTimer != null) {
                clearTimeout($scope.hideCaptionTimer);
                $scope.hideCaptionTimer = null;
            }
            $scope.caption.htmlData = '';
            $('#caption-text').html('');
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    };

    ////////////////////////////////////////////////////////////////////
    // End of movie screen
    ////////////////////////////////////////////////////////////////////

    $scope.PlayerCoreUI_GoToTitleDetails = function(productId)  {
        $scope.PlayerCoreUI_ExitPlayer('/titledetail/' + productId);
    };

    $scope.PlayerCoreUI_GoToMyRedbox = function() {
        $scope.PlayerCoreUI_ExitPlayer('/myredbox/dashboard');
    };

    $scope.PlayerCoreUI_RemoveBookmark = function(){
        productService.RemoveBookmark($scope.productId, function (data) {
                $scope.showBookmarkPopUp = true;
                $scope.titleDetails.isBookmarked = false;
                $scope.focusIndexMap[$scope.focusLevel]--;
                helper.RemoveButtonFocus($scope.currentFocusEl);
                $scope.currentFocusEl = $scope.endOfMovieButtonId[$scope.focusIndexMap[$scope.focusLevel]];
                helper.SetButtonFocus($scope.currentFocusEl);

                setTimeout(function () {
                    $scope.showBookmarkPopUp = false;
                    //$scope.$apply();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, 3000);

            }, function (data) {
                helper.debugLog("removeBookmark>>failed");
            }
        );
    };


    $scope.PlayerCoreUI_AddBookmark = function() {
        productService.AddBookmark($scope.productId, function (data) {
                $scope.showBookmarkPopUp = true;
                $scope.titleDetails.isBookmarked = true;
                $scope.focusIndexMap[$scope.focusLevel]++;
                helper.RemoveButtonFocus($scope.currentFocusEl);
                $scope.currentFocusEl = $scope.endOfMovieButtonId[$scope.focusIndexMap[$scope.focusLevel]];
                helper.SetButtonFocus($scope.currentFocusEl);
                setTimeout(function () {
                    $scope.showBookmarkPopUp = false;
                    //$scope.$apply();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, 3000);

            }, function (data) {
                helper.debugLog("addBookmark>>failed");
            }
        );
    };

    $scope.PlayerCoreUI_ShowBufferingScreen = function() {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (!$scope.endOfMovie &&
            (playerState == PLAYER_STATE_BUFFERING ||
                playerState == PLAYER_STATE_SEEKING)) {
            return true;
        }
        else {
            return false;
        }
    };


    // show scenes button
    $scope.PlayerCoreUI_ShowScenesButton = function () {
        return $scope.chaptersAvailable&&!$scope.isPreview&&!$scope.endOfMovie&&!$scope.seekInProgress&&$scope.playbackStarted;
    };

    // show fast forward / rewind button
    $scope.PlayerCoreUI_ShowFFRwButton = function() {
        return !$scope.scenesOpen&&!$scope.isPreview&&!$scope.endOfMovie&&$scope.playbackStarted;
    };

    // show closed captioning button
    $scope.PlayerCoreUI_ShowCCButton = function () {
        var showCCButton = (RBI.Config.handleCaptionFromAccount)? false : $scope.titleDetails.ccSupported&&!$scope.isPreview&&!$scope.endOfMovie&&$scope.playbackStarted;
        return showCCButton;
    };

    /**
     * RBI_CoreUI_ExitPlayer
     *
     * @param redirectUrl
     */
    $scope.PlayerCoreUI_ExitPlayer = function(redirectUrl) {

        // This needs to be handled in the case the internet gets disconnected while the player is being loaded
        if (!internetConnected) {
            $scope.isOffline = true;
            $scope.isConnected = false;
            if (!$scope.isPlayerStopped && $scope.PlayerCoreUI_GetPlayerState () != 0) {
                // need to stop the player if it hasn't been stopped already
                // this only occurs when Internet has been disconnected while the player was loading
                PlayerCoreUI_StopPlayer(false, null);
            }
        }

        if ($scope.playerLoaded) {
            // For VOD clients (PS3, PS4 and PS Vita) delay session cleanup
            // using a timer so that Conviva can capture errors
            if ($scope.vodDefined) {
                setTimeout(function() {
                    PlayerCoreUI_CleanupSession();
                }, PLAYER_SESSION_CLEANUP_DELAY);
            }
            else {
                PlayerCoreUI_CleanupSession();
            }
        }

        if ($scope.spinnerUp) {
            helper.hideSpinner();
            $scope.spinnerUp = false;
        }
        // Enable spinner for HTTP requests
        disableHttpSpinner = false;

        // Clear memory
        $scope.recommendedProducts = [];
        $scope.chapterData = [];
        $scope.focusIndexMap = [];

        if (isDefined(playerHelper.ExitPlayer)) {
            playerHelper.ExitPlayer($scope);
        }

        // Omniture start
        $scope.omnitureCollectOnClick();
        // Omniture end

        if (!$scope.isOffline) {
            PLAYER_ACTIVE = false;
            if (redirectUrl != null && redirectUrl != '') {
                $location.path(redirectUrl);
            }
            else {
                $scope.PlayerCoreUI_GoBack();

                // Force scope apply when user exits preview
                if ($scope.isPreview) {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }
        }
        else {
            // call shared scope with menu to enable main menu navigation from the offline page
            sharedScopeWithMenu($scope, $location);
        }
        helper.debugLog("PlayerCoreUI_ExitPlayer - internetConnected: " +  internetConnected + ", player active: " + PLAYER_ACTIVE);
    };

    // Go back to previous page
    $scope.PlayerCoreUI_GoBack = function () {
        var prevUrl = backPaths[backPaths.length - 1];

        // Need to pop the back paths if player url is in the back paths stack
        if (prevUrl.indexOf('player') != -1) {
            backPaths.pop();
            prevUrl = backPaths[backPaths.length - 1];
        }
        helper.debugLog("redirecting to: " + prevUrl);
        $location.path(prevUrl);
    }

    $scope.PlayerCoreUI_OnError = function (errorCode) {

        if ($scope.spinnerUp) {
            helper.hideSpinner();
            $scope.spinnerUp = false;
        }

        if ($scope.isVideoLoading) {
            $scope.isVideoLoading = false;
        }

        // Clear the seek timer if FFW/RWD is in progress
        if ($scope.seekTimer != null) {
            PlayerCoreUI_ClearSeekTimer();
            $scope.seekInProgress = false;
            $scope.showScrubberImage = false;
            helper.debugLog("PlayerCoreUI_OnError - seek timer cancelled");
        }

        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        $scope.isConnected = (errorCode == networkConnectionErrorCode)? false : true;
        helper.debugLog("PlayerCoreUI_OnError - errorCode: " +  errorCode + "isConnected: " + $scope.isConnected + "playerState: " + playerState);

        // clear heartbeat timer
        if (!$scope.isPreview && $scope.heartbeatTimer != null) {
            helper.debugLog("Playback error - Cleared heartbeat timer id: " + $scope.heartbeatTimer);
            clearInterval($scope.heartbeatTimer);
            $scope.heartbeatTimer = null;
        }

        POP_ALERT_BOX_VISIBLE = true;
        $scope.doExit = $scope.isConnected;

        if (!$scope.isConnected) {
            internetConnected = false;
            if (playerState != PLAYER_STATE_NOT_LOADED) {
                PlayerCoreUI_StopPlaying(true);
            }

            // need to check if the popup is not displayed b/c we are handling disconnect error when heartbeat fails
            if (!$scope.networkErrorPopupVisible) {
                $scope.PlayerCoreUI_ShowErrorMessage(errorCode);
                $scope.networkErrorPopupVisible = true;
            }
            $scope.PlayerCoreUI_ExitPlayer(null);
        }
        else {

            if (errorCode != '') {
                $scope.PlayerCoreUI_ShowErrorMessage(errorCode);
            }
            else {
                if ($scope.isPreview) {
                    // Generic playback error (for preview)
                    helper.ShowPopupBox('Popup_PREVIEW_ERROR', $scope);
                } else if (playerState >= PLAYER_STATE_PLAYING && $scope.progressWatched > 0)  {
                    $scope.PlayerCoreUI_ShowErrorMessage('PLAYBACK_ERROR');   // Playback failed in the middle of the movie
                }
                else {
                    $scope.PlayerCoreUI_ShowErrorMessage('PLAYBACK_INIT');   // Playback failed at the beginning of the movie
                }
            }

            if (playerState != PLAYER_STATE_NOT_LOADED) {
                PlayerCoreUI_StopPlayer(true, function () {
                    $scope.PlayerCoreUI_ExitPlayer(null);
                });
            }
        }
        helper.debugLog("PlayerCoreUI_OnError - internetConnected: " +  internetConnected);

    };

    // Omniture start
    $scope.omnitureCollectOnClick = function() {
        Omniture.Clear();
        if (internetConnected) {
            var omnitureData = $scope.titleDetails.title + '|' + $scope.progressWatched;
            if ($scope.isPreview) {
                Omniture.Variables.eVar67 = omnitureData;
            }
            else {
                Omniture.Variables.eVar68 = omnitureData;
            }
            Omniture.InvokeOmniture(Omniture.InvokeType.click);
        }
    }
    // Omniture end

    $scope.PlayerCoreUI_ShowErrorMessage = function (errorCode) {
        var errorObj = {
            ResultInfo: { ResultCode: errorCode }
        };
        helper.showErrorMessage(errorObj, $scope);
    }


    /******************
     * Parental control popup
     ********************/

    $scope.PlayerCoreUI_CheckParentalControlPassword = function () {
        customerService.checkAccountPassword($scope.userPassword,
            function (data) {
                pwPopupHelper.hidePWPopup($scope);
                PlayerCoreUI_Initialize();
            }, function (data) {
                pwPopupHelper.showPWError($scope);
            });
    };

    //***** End of scope functions *******************************************************

    /**
     * PlayerCoreUI_Initialize
     * Initialize player, get title details for info overlay
     */
    function PlayerCoreUI_Initialize() {

        if (!$scope.doExit) {
            $scope.isVideoLoading = true;

            // Hide HTTP spinner
            disableHttpSpinner = true;

            var spinnerPosition = PlayerCoreUI_SetSpinnerPosition();
            helper.showSpinner(SPINNER_FADEOUT_MS, spinnerPosition);
            $scope.spinnerUp = true;
            PLAYER_ACTIVE = true;  // Global flag used in PS3/PS4

            if ($scope.isPreview) {
                helper.debugLog("Preview URL: " + $scope.playbackUrl);
                PlayerCoreUI_GetTitleDetails();
            }
            else {
                var deviceActivated = true;  // Needs to be set to true for platforms that do not need device activation
                if (RBI.PlatformConfig.activateDevice) {
                    if (isDefined(platformStorage.getItem(DEVICE_ACTIVE))) {
                        if (platformStorage.getItem(DEVICE_ACTIVE).toLowerCase() == 'true') {
                            deviceActivated = true;
                        }
                        else {
                            deviceActivated = false;
                        }
                    }
                    else {
                        deviceActivated = false;
                    }
                }

                helper.debugLog("PlayerCoreUI_Initialize - deviceActivated flag:" + deviceActivated);

                var activateDeviceSuccessCB = function (){
                    $scope.playbackParams.productID = $scope.productId;
                    $scope.playbackParams.purchaseOptionID = $scope.purchaseOptionId;
                    PlayerCoreUI_GetTitleDetails();
                };

                var activateDeviceErrorCB = function (){
                    // Error message already shown from ActivateDevice function
                    $scope.PlayerCoreUI_ExitPlayer(null);
                };

                if (deviceActivated) {
                    activateDeviceSuccessCB();
                }
                else {
                    loginService.ActivateDevice(activateDeviceSuccessCB, activateDeviceErrorCB);
                }
            }
        }
        else {
            $scope.PlayerCoreUI_ExitPlayer(null);
        }
    }

    // Cleanup player session
    function PlayerCoreUI_CleanupSession() {
        // Cleanup Conviva session
        if (RBI.PlatformConfig.convivaEnabled) {
            helper.debugLog("Conviva session cleanup");
            conviva.cleanUpSession();
        }

        // destroy the player instance to clear memory
        if (isDefined(playerHelper.DestroyPlayer)) {
            helper.debugLog("Player destroyed");
            playerHelper.DestroyPlayer();
        }
    }

    // VOD specific callback
    function PlayerCoreUI_OnVideoMetadata (duration) {
        $scope.mVideo.duration = duration;
    }

    /***
     * Get title details (needed for Info bar and to enable CC button)
     */
    function PlayerCoreUI_GetTitleDetails () {
        var params = [];
        params.productId = $scope.productId;

        var errorCallback = function() {
            $scope.doExit = true;
            if (!POP_ALERT_BOX_VISIBLE) {
                POP_ALERT_BOX_VISIBLE = true;
                $scope.PlayerCoreUI_ShowErrorMessage('PLAYBACK_INIT');
            }
            $scope.showTitle = false;
            $scope.infoAvailable = false;
            if ($scope.spinnerUp)  {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
            $scope.PlayerCoreUI_ExitPlayer(null);
        }

        productService.GetProductDetailByProductID(params, function (data) {
                if (data == null) {
                    // if we do not get data from the server treat it as error
                    errorCallback();
                    return;
                }

                $scope.showTitle = true;
                $scope.titleDetails.title = data.getTitle();
                $scope.titleDetails.image = data.getThumbnailImage();
                $scope.titleDetails.badges = data.getBadgesForTitleDetails();
                if (isDefined(data.getActors())) {
                    $scope.titleDetails.actors = helper.truncateString(helper.convertArrayToString(data.getActors()), MAX_LENGTH_ACTORS);
                }
                else {
                    $scope.titleDetails.actors = '';
                }
                if (isDefined(data.getGenres())) {
                    $scope.titleDetails.genres = helper.convertArrayToString(data.getGenres()); // need full genres string for Conviva
                    $scope.titleDetails.genresDisp = helper.truncateString($scope.titleDetails.genres, MAX_LENGTH_GENRES);  // truncate for info
                }
                else {
                    $scope.titleDetails.genres = '';
                    $scope.titleDetails.genresDisp = '';
                }

                var titleDescription = data.getLongDescription();
                var maxDescriptionLength = helper.getMaxDescriptionLength(titleDescription, TITLE_DESCRIPTION_NUM_LINES, TITLE_DESCRIPTION_NUM_CHARS_PER_LINE);
                $scope.titleDetails.description = helper.truncateString(titleDescription, maxDescriptionLength);
                $scope.titleDetails.isBookmarked = data.getIsBookmarked();
                $scope.titleDetails.ccSupported = playerService.IsCCSupported(data, $scope.purchaseOptionId);
                $scope.titleDetails.purchaseType = playerService.getPurchaseType(data, $scope.purchaseOptionId);

                if (isDefined(data.getRunningTime())) {
                    $scope.totalTime = data.getRunningTime();    // get the total time of the video
                }
                else {
                    $scope.totalTime = '';
                }
                helper.debugLog("Title: " + $scope.titleDetails.title);
                helper.debugLog("Thumbnail: " + $scope.titleDetails.image);
                if ($scope.titleDetails.actors != '') helper.debugLog("Actors: " + $scope.titleDetails.actors);
                if ($scope.titleDetails.genres != '') helper.debugLog("Genres: " + $scope.titleDetails.genres);
                if ($scope.titleDetails.description != '') helper.debugLog("Description: " + $scope.titleDetails.description);
                helper.debugLog("Is Bookmarked: " + $scope.titleDetails.isBookmarked);
                if ($scope.totalTime != '') helper.debugLog("Running time: " + $scope.totalTime);
                helper.debugLog("CC supported: " + $scope.titleDetails.ccSupported);
                helper.debugLog("Purchase type: " + $scope.titleDetails.purchaseType);
                $scope.infoAvailable = true;

                if ($scope.isPreview) {
                    PlayerCoreUI_ShowStartupScreen();
                }
                else {
                    // ZOE-30494: Check CanWatchNow flag for subscription movies
                    var canWatchNow = ($scope.titleDetails.purchaseType != null && $scope.titleDetails.purchaseType.toUpperCase() == SUBSCRIPTION.toUpperCase()) ? data.getCanWatchNow() : true;
                    if (canWatchNow) {
                        PlayerCoreUI_InitializePlayback();
                    }
                    else {
                        helper.hideSpinner();
                        PlayerCoreUI_ShowCanWatchNowError();
                    }
                }
            },
            function (data) {
                errorCallback();
            });
    }


    /**
     * RBI_CoreUI_Initialize playback
     *
     * Performs speed test and fetches playback URL based on available bandwidth
     */
    function PlayerCoreUI_InitializePlayback() {

        // show spinner
        if (!$scope.spinnerUp) {
            var spinnerPosition = PlayerCoreUI_SetSpinnerPosition();
            helper.showSpinner(SPINNER_FADEOUT_MS, spinnerPosition);
            $scope.spinnerUp = true;
        }
        $scope.startDoneOnce = false;

        if (playerHelper.CheckHDScreenResolution()) {
            if (RBI.PlatformConfig.speedTestEnabled) {
                // HD asset on HD device - run speed test
                var speedTestResult = -1;
                if (rbiCommonService.isSharedItemExist(SPEED_TEST_RESULT)) {
                    speedTestResult = rbiCommonService.getSharedItem(SPEED_TEST_RESULT);
                }

                if (speedTestResult < 0) {
                    // Speed test on home page failed; try it again and save the result
                    $scope.isSpeedTestEnabled = true;
                    playerService.SpeedTest(function (speedTestResult) {
                        // Speed test - if download speed < 2 MBPs switch to SD
                        if (speedTestResult < 0) {
                            // show connection error popup
                            $scope.isConnected = false;
                            if ($scope.spinnerUp) {
                                helper.hideSpinner();
                                $scope.spinnerUp = false;
                            }
                            $scope.PlayerCoreUI_ShowErrorMessage(networkConnectionErrorCode);
                            $scope.networkErrorPopupVisible = true;
                            $scope.PlayerCoreUI_ExitPlayer(null);
                            return;
                        }
                        else {
                            rbiCommonService.setSharedItem(SPEED_TEST_RESULT, speedTestResult);
                            helper.debugLog("Speed test result: " + speedTestResult);
                            helper.debugLog("Device spec:" + $scope.playbackParams.deviceSpec);
                            if (!$scope.doExit) {
                                PlayerCoreUI_GetPlaybackUrl(true, speedTestResult);
                            }
                        }
                    });
                }
                else {
                    $scope.isSpeedTestEnabled = false;
                    if (!$scope.doExit) {
                        PlayerCoreUI_GetPlaybackUrl(true, speedTestResult);
                    }
                }
            }
            else {
                $scope.isSpeedTestEnabled = false;
                if (!$scope.doExit) {
                    PlayerCoreUI_GetPlaybackUrl(true, 0);
                }
            }
        }
        else {
            // SD device, request SD
            if (!$scope.doExit) {
                PlayerCoreUI_GetPlaybackUrl(false, 0);
            }
        }
    }

    /**
     * Initialize progress bar and chapter bar
     */
   function  PlayerCoreUI_InitializeProgressBar () {
       if ($scope.totalTime != '') {
            $scope.mVideo.duration = helper.ConvertRunningTime($scope.totalTime, 1); // convert to seconds
            helper.debugLog("Video duration: " + $scope.mVideo.duration);
            var playbackPosition = $scope.progressWatched / SECONDS_TO_MS; // convert to seconds
            PlayerCoreUI_UpdateProgressBar(playbackPosition);
       }
    }


    /**
     * Get playback URL from the server and initialize custom data
     */
    function PlayerCoreUI_GetPlaybackUrl(isHD, speedTestResult) {

        if (isHD) {
            if (RBI.PlatformConfig.speedTestEnabled) {
                if (speedTestResult < MIN_HD_BITRATE_SPEED_TEST) {
                    $scope.playbackParams.deviceSpec = RBI.PlatformConfig.deviceSpecSD;
                    $scope.titleDetails.isHD = false;
                } else {
                    $scope.playbackParams.deviceSpec = RBI.PlatformConfig.deviceSpec;
                }
                helper.debugLog("Speed test result: " + speedTestResult);
                helper.debugLog("Device spec:" + $scope.playbackParams.deviceSpec);
            }
            else {
                $scope.playbackParams.deviceSpec = RBI.PlatformConfig.deviceSpec;
                helper.debugLog("Speed test disabled, device spec:" + $scope.playbackParams.deviceSpec);
            }
        }
        else {
            // SD device, request SD
            $scope.isSpeedTestEnabled = false;
            $scope.playbackParams.deviceSpec = RBI.PlatformConfig.deviceSpecSD;
            $scope.titleDetails.isHD = false;
            helper.debugLog("Device spec:" + $scope.playbackParams.deviceSpec);
        }

        playerService.GetPlaybackUrl($scope.playbackParams, function (playbackData) {
            $scope.playbackUrl = playbackData.playbackUrl;
            $scope.progressWatched = parseInt(playbackData.progressWatched);
            $scope.playbackParams.token = playbackData.token;
            if (playbackData.scrubberInterval != null && playbackData.scrubberInterval != 0) {
                $scope.scrubberInterval = playbackData.scrubberInterval;
            }
            $scope.playbackParams.pcn = playbackData.pcn;

            helper.debugLog('Get playback URL successful');
            helper.debugLog('Playback URL:' + $scope.playbackUrl);
            helper.debugLog('Progress watched:' + $scope.progressWatched);
            helper.debugLog('Token: ' + $scope.playbackParams.token);
            helper.debugLog('componentID: '+ playbackData.componentID);
            helper.debugLog('entitlementID: '+ playbackData.entitlementID);
            helper.debugLog('PCN: ' + playbackData.pcn);
            helper.debugLog("Scrubber interval: " + $scope.scrubberInterval);
            helper.debugLog("Scrubber path: " + playbackData.scrubberPath);

            //Generate custom data
            $scope.customData = playerHelper.GetCustomData(playbackData);
            helper.debugLog('Custom Data:' + $scope.customData);
            if (!$scope.doExit) {
                if (typeof playbackData.scrubberPath !== 'undefined' && playbackData.scrubberPath != null && playbackData.scrubberPath !== '') {
                    // Check if scrubber path is valid (ZOE-22057 and ZOE-19915)
                    if ((playbackData.scrubberPath.indexOf('http:')) != -1) {
                        $scope.chaptersAvailable = true;
                        $scope.scrubberPath = playbackData.scrubberPath;
                    }
                    else {
                        // Do not display chapters if scrubber path is incorrect
                        $scope.chaptersAvailable = false;
                        $scope.scrubberPath = '';
                    }
                }
                else {
                    // Invalid scrubber path - disable chapters and scrubber images
                    $scope.chaptersAvailable = false;
                    $scope.scrubberPath = '';
                }
                PlayerCoreUI_ShowStartupScreen();
            }

        }, function (data) {
            // Error handling
            if ($scope.spinnerUp)  {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
            $scope.isVideoLoading = false;
            helper.debugLog("Get Playback URL failed:");

            if (data == null) {
                // If no error data is received, show a generic error message
                helper.debugLog("No error data, showing a generic error message.");
                $scope.PlayerCoreUI_ShowErrorMessage('PLAYBACK_INIT');
            }
            else {
                helper.debugLog("Error data: " + JSON.stringify(data));
                helper.showErrorMessage(data, $scope);
            }
            $scope.PlayerCoreUI_ExitPlayer(null);
        });
    };

    /***
     * Get DRM license
     * @param licenseRequest
     * @param licenseResponse
     */
    function PlayerCoreUI_GetDRMLicense(licenseRequest, licenseResponse) {
        playerService.GetLicense(licenseRequest, function (responseText) {
            helper.debugLog("FY: responseText: " + responseText);
            if (isDefined(licenseResponse)) {
                licenseResponse(responseText);
            }
            $scope.licenseAcquired = true;
            helper.debugLog("FY: finished requestLicense");
        }, function (responseText) {
            helper.debugLog("License request error: " + responseText);
            PlayerCoreUI_StopPlayer(false, null);
            $scope.doExit = true;
            if ($scope.spinnerUp)  {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
            helper.debugLog("Could not acquire rights to play the movie.");
            $scope.PlayerCoreUI_ShowErrorMessage(DRM_LICENSE_ERROR);
            $scope.PlayerCoreUI_ExitPlayer(null);
        });
    }


    /**
     * Start playback
     */
    function PlayerCoreUI_ShowStartupScreen() {
        helper.debugLog("Starting...");
        $scope.isControlBarDisplayed = true;
        $scope.isVideoLoading = false;
        if (!$scope.startDoneOnce) {
            $scope.startDoneOnce = true;
            PlayerCoreUI_InitializeProgressBar();
            PlayerCoreUI_RemoveFocusFromAllButtons();

            if ($scope.isPreview || $scope.progressWatched == 0) {
                $scope.PlayerCoreUI_StartPlayer(false);
            }
            else {
                if ($scope.spinnerUp)  {
                    helper.hideSpinner();
                    $scope.spinnerUp = false;
                }
                $scope.showStartResumeButtons = true;
            	helper.SetButtonFocus($scope.resumeButtonID);
                helper.RemoveButtonFocus($scope.startOverButtonID);

            }
        }
    }


    /**
     * Start playback
     */
    function PlayerCoreUI_StartPlayback() {

        if ($scope.heartbeatTimer != null) {
            helper.debugLog("PlayerCoreUI_StartPlayback - Clearing timer id: " + $scope.heartbeatTimer);
            clearInterval($scope.heartbeatTimer );
            $scope.heartbeatTimer = null;
        }
        if ($scope.startOver) {
            $scope.progressWatched = 0;
            PlayerCoreUI_UpdateProgressBar($scope.progressWatched);
            if (!$scope.isPreview) {
                PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT, null);  // Need to inform the server that user has restarted the movie
            }
        }
        helper.debugLog("ProgressWatched: " + $scope.progressWatched);

        // start a heartbeat timer
        if (!$scope.isPreview) {
            $scope.heartbeatTimer = setInterval(function () {
                PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT, null);
            }, $scope.heartbeatPeriod);
            helper.debugLog("PlayerCoreUI_StartPlayback - New heartbeat timer id: " + $scope.heartbeatTimer);
        }
        $scope.startDoneOnce = true;

        if ($scope.progressWatched != 0) {
            // send at least one heartbeat if progressWatched is != 0 otherwise completeWatchingTitle may fail
            PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT, null);
            $scope.resumeInProgress = (RBI.PlatformConfig.playbackResumeSupported)? false:true;
        }
        else {
            $scope.resumeInProgress = false;
        }

        if (!$scope.spinnerUp) {
            var spinnerPosition = PlayerCoreUI_SetSpinnerPosition();
            helper.showSpinner(SPINNER_FADEOUT_MS, spinnerPosition);
            $scope.spinnerUp = true;
        }

        if (!$scope.$$phase) {
            $scope.$apply();
        }

        PlayerCoreUI_PlayVideo();
    }

    function PlayerCoreUI_UpdateProgressBar (progressTimeSec) {
        if ($scope.mVideo.duration > 0) {
            $scope.progressTime = $scope.PlayerCoreUI_TimeConvert(Math.ceil(progressTimeSec));
            var progressBarSize = Math.floor((progressTimeSec / $scope.mVideo.duration) * PROGRESS_BAR_TOTAL_WIDTH);
            var currentPosition = CURRENT_POSITION_BASE + progressBarSize;
            //helper.debugLog("Update progress bar - progressTimeSec: " + progressTimeSec);
            //helper.debugLog("ProgressBarSize: " + progressBarSize + " currentPosition: " + currentPosition);
            if (isDefined(playerHelper.UpdateProgressBar)) {
                playerHelper.UpdateProgressBar (progressBarSize, currentPosition);
            }
        }
    }

    // Restart video playback after network disconnection
    function PlayerCoreUI_RestartPlayback () {
        $scope.startDoneOnce = false;
        $scope.isVideoLoading = true;
        helper.showSpinner(SPINNER_FADEOUT_MS, spinnerPosLoading);
        $scope.spinnerUp = true;
        $scope.isPlayerStopped = false; // indicates player restart
        if (!disableHttpSpinner) {
            disableHttpSpinner = true;
        }

        // Restart playback
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (playerState == 0) {
            PlayerCoreUI_Initialize();
        }
        else {
             // If the player is not in stopped state, stop the player and then reload it
             if (isDefined(playerHelper.Stop)) {
                 playerHelper.Stop();
                 $scope.playerState = 0;
             }
             $scope.restartPlayer = true;
             $scope.isSpeedTestEnabled = true;
        }
     }


    /**
     * Play / pause
     */
    function PlayerCoreUI_PlayVideo () {
        helper.debugLog("PlayerCoreUI_PlayVideo");
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        helper.debugLog("Player state: " + playerState);
        if (playerState == PLAYER_STATE_LOADED || playerState == PLAYER_STATE_LOAD_DISPATCHED) {
            var playheadPosition = ($scope.progressWatched == 0)? 0:Math.floor($scope.progressWatched/SECONDS_TO_MS);
            if (!playerHelper.StartPlayback($scope, playheadPosition)) {
               // handle error
               helper.debugLog("StartPlayback failed");
               $scope.PlayerCoreUI_OnError('');
            }
        }
        else if (playerState == PLAYER_STATE_PAUSED) {
            $scope.isVideoPaused = false;
            playerHelper.Resume();
            $scope.playerState = PLAYER_STATE_PLAYING;
        }
        else if (playerState == PLAYER_STATE_PLAYING) {
            $scope.isVideoPaused = true;
            playerHelper.Pause();
            $scope.playerState = PLAYER_STATE_PAUSED;
        }
    }


    function PlayerCoreUI_ShowProgressBar() {
        if ($scope.isOffline) {
            return false;
        }
        else if (!$scope.isVideoLoading || PlayerCoreUI_IsVideoPlaying()) {
            return $scope.isControlBarDisplayed;
        }
        else if ($scope.endOfMovie) {
            return true;
        }
        else {
            return false;
        }
    }

    function PlayerCoreUI_IsVideoPlaying() {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (playerState >= PLAYER_STATE_PREPARE_PLAYING) {
            return true;
        }
        else {
            return false;
        }
    }


    // Skip forward / backward
    function PlayerCoreUI_GoToChapter(chapterIndex) {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        $scope.ignoreKeyPress = true;
        helper.debugLog("goToChapter - key press disabled");
        helper.debugLog("goToChapter - chapter number: " + chapterIndex + ", player state: " + playerState);
        // If a rew / fwd is in progress, stop it.
        // Since goto chapter has a higher preference, update progress bar accordingly
        if ($scope.seekTimer != null) {
            PlayerCoreUI_ClearSeekTimer();
            $scope.seekInProgress = false;
            helper.debugLog("goToChapter - seek timer cancelled");
        }

        if (playerState == PLAYER_STATE_PLAYING) {
            playerHelper.Pause();
            $scope.playerState = PLAYER_STATE_PAUSED;
        }
        $scope.PlayerCoreUI_HideCaption();
        var playerPosition = chapterIndex * CHAPTER_INTERVAL;
        helper.debugLog("goToChapter - currentPosition: " + $scope.progressWatched / SECONDS_TO_MS + " new position: " + playerPosition);
        if (playerPosition >= $scope.mVideo.duration) {
            playerPosition = $scope.mVideo.duration;
        }
        if (playerPosition < 0) playerPosition = 0;
        helper.debugLog("goToChapter - seeking to position: " + playerPosition);
        var currentPosition = Math.round($scope.progressWatched/SECONDS_TO_MS);
        var offset = 0;
        var seekComplete = false;
        if (currentPosition > playerPosition) {
            offset = currentPosition - playerPosition;
            if (offset > 0) {
                seekComplete = playerHelper.SeekBackward(playerPosition, offset);
            }
        }
        else {
            offset = playerPosition - currentPosition;
            if (offset > 0) {
                seekComplete = playerHelper.SeekForward(playerPosition, offset);
            }
        }

        if (offset == 0) {
            // current position and player position are the same
            PlayerCoreUI_ClearSeekFlags();
            PlayerCoreUI_OnSeekComplete();
        }
        else {
            if (seekComplete) {
                $scope.progressWatched = playerPosition * SECONDS_TO_MS;
                PlayerCoreUI_OnSeekComplete();
            }
            else if ($scope.vodDefined) {
                // show spinner, wait for onSeekComplete callback
                $scope.progressWatched = playerPosition * SECONDS_TO_MS;
                helper.showSpinner(SPINNER_FADEOUT_MS, config.spinnerPosition);
                $scope.spinnerUp = true;
                PlayerCoreUI_UpdateProgressBar(playerPosition);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            else {
                // Handle seek error for Samsung / LG
                PlayerCoreUI_ClearSeekFlags();
                PlayerCoreUI_OnSeekComplete();
            }
        }
    }

    /**
     * Seek functionality - fast forward and rewind
     * seek direction: +1 - FF / -1 - RW
     * each click toggles between 2x / 4x and 8x speeds that move
     * the playhead by currentSeekSpeed x 10 seconds each second
     */
    function PlayerCoreUI_Seek(seekDirection) {

        if ($scope.seekTimer == null) {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            $scope.seekDirection = seekDirection;
            $scope.seekIndex = 0;
            $scope.seekInProgress = true;
            $scope.currentSeekSpeed = SEEK_SPEEDS[$scope.seekIndex];
            // Video is paused during REW / FFW
            if (playerState == PLAYER_STATE_PLAYING) {
                playerHelper.Pause();
                $scope.playerState = PLAYER_STATE_PAUSED;
            }
            if (typeof $scope.scrubberPath !== 'undefined' && $scope.scrubberPath != null && $scope.scrubberPath !== '') {
                $scope.showScrubberImage = true;
            }

            $scope.seekPosition = $scope.progressWatched / SECONDS_TO_MS;  // initialize seek position; convert to seconds
            PlayerCoreUI_UpdateProgressBar($scope.seekPosition);
            if ($scope.showScrubberImage) {
                $scope.scrubberImageUrl = PlayerCoreUI_GetScrubberImageUrl($scope.seekPosition);
                helper.debugLog("Scrubber image URL: " + $scope.scrubberImageUrl);
            }
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            // Start a 1 sec timer to trigger seek position updates
            $scope.seekTimer = setInterval(function () {
                PlayerCoreUI_SetSeekPosition();
            }, SEEK_TIMER_MS);
        }
        else {
            if (seekDirection == $scope.seekDirection) {
                $scope.seekIndex++;
                if ($scope.seekIndex >= SEEK_SPEEDS.length) {
                    $scope.seekIndex = 0;
                }
            } else {
                // reverse seek direction; start at 2x speed
                $scope.seekDirection = seekDirection;
                $scope.seekIndex = 0;
            }
            $scope.currentSeekSpeed = SEEK_SPEEDS[$scope.seekIndex];
        }
    };

    function PlayerCoreUI_ClearSeekTimer() {
         clearTimeout($scope.seekTimer);
         $scope.seekTimer = null;
         $scope.seekDirection = 0;
         $scope.currentSeekSpeed = 0;
    }

    function PlayerCoreUI_StopSeeking() {
        PlayerCoreUI_ClearSeekTimer();
        PlayerCoreUI_UpdateProgressBar($scope.seekPosition);
    }


    function PlayerCoreUI_ClearSeekFlags() {
        // clear all seek/scrubber image flags
        if ($scope.seekInProgress) {
            $scope.seekInProgress = false;
        }
        $scope.showScrubberImage = false;
        $scope.ignoreKeyPress = false;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function PlayerCoreUI_SetSeekPosition() {
        var seekIncrement = $scope.currentSeekSpeed * SEEK_INTERVAL;
        $scope.seekPosition += seekIncrement * $scope.seekDirection;
        if ($scope.seekPosition <= 0) {
            $scope.seekPosition = 0;
            PlayerCoreUI_StopSeeking();
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            var currentPosition = $scope.progressWatched/SECONDS_TO_MS;
            if (playerHelper.SeekBackward($scope.seekPosition, currentPosition)) {
                $scope.progressWatched = 0;
                PlayerCoreUI_OnSeekComplete();
            }
            else if ($scope.vodDefined) {
                // show spinner, wait for onSeekComplete callback
                $scope.progressWatched = 0;
                helper.showSpinner(SPINNER_FADEOUT_MS, config.spinnerPosition);
                $scope.spinnerUp = true;
            }
            else {
                PlayerCoreUI_ClearSeekFlags();
                PlayerCoreUI_OnSeekComplete();
            }
        }
        else if ($scope.seekPosition >= $scope.mVideo.duration) {
            $scope.seekPosition = $scope.mVideo.duration;
            PlayerCoreUI_StopSeeking();
            $scope.progressWatched = $scope.mVideo.duration * SECONDS_TO_MS;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
            // Show end of movie screen
            PlayerCoreUI_VideoEnd();
        }
        else {
            helper.debugLog("Seeking at speed: " + seekIncrement + " sec, current position: " + $scope.seekPosition + " sec");
            PlayerCoreUI_UpdateProgressBar($scope.seekPosition);
            if ($scope.showScrubberImage) {
                $scope.scrubberImageUrl = PlayerCoreUI_GetScrubberImageUrl($scope.seekPosition);
                helper.debugLog("Scrubber image URL: " + $scope.scrubberImageUrl);
            }
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }


    // Get scrubber image URL
    function PlayerCoreUI_GetScrubberImageUrl(seekPosition) {
        var scrubberImagePos = Math.floor(seekPosition / $scope.scrubberInterval);
        var pad;
        if (scrubberImagePos < 10) {
            pad = '000';
        } else if (scrubberImagePos < 100) {
            pad = '00';
        }
        else if (scrubberImagePos < 1000) {
            pad = '0';
        }
        else {
            pad = '';
        }
        var url = $scope.scrubberPath + '/' + pad + scrubberImagePos + '.jpg';
        return url;
    }


    // show chapter bar
    function PlayerCoreUI_ShowChapterBar () {
        var chapterOffset = Math.floor(NUM_CHAPTERS_PER_PAGE/2);
        helper.debugLog("Current chapter: " + $scope.currentChapter);
        $scope.chapterData = [];
        for (var index = 0; index < NUM_CHAPTERS_PER_PAGE; index++ )  {
            var chapterNumber = $scope.currentChapter - chapterOffset + index;
            if (chapterNumber < 0 || chapterNumber >= $scope.numChapters)  {
                $scope.chapterData.push({
                    thumbnail: '',
                    chapterTime: '',
                    isSelected: false,
                    showThumbnail: false,
                    chapterNumber: '',
                    chapterName: ''
                });
            }
            else {
                var currentPosition = chapterNumber*CHAPTER_INTERVAL;
                helper.debugLog("Current chapter: " + chapterNumber + " current position: " + currentPosition);
                var thumbnailImage = PlayerCoreUI_GetScrubberImageUrl(currentPosition);
                helper.debugLog("Chapter thumbnail: " + thumbnailImage);
                $scope.chapterData.push({
                    thumbnail: thumbnailImage,
                    chapterTime: $scope.PlayerCoreUI_TimeConvert(currentPosition),
                    isSelected: (chapterNumber == $scope.currentChapter)? true:false,
                    showThumbnail: true,
                    chapterNumber: chapterNumber,
                    chapterName: 'Chapter ' + (chapterNumber+1)
                });
            }
        }
    }


    // Show exit player popup
    function PlayerCoreUI_ShowExitPlayerPopup() {
        //POP_ALERT_BOX_VISIBLE = true;  // not needed
        var popupKey = "Popup_EXIT_PLAYER";
        popupObj_Meta[popupKey].button_2_click = function () {
            helper.HidePopupBox();
            PlayerCoreUI_StopPlaying(false);
        };
        $scope.doExit = false;
        helper.ShowPopupBox(popupKey, $scope);
    }


    function PlayerCoreUI_ShowCanWatchNowError() {
        var popupKey = "Popup_WATCH_NOW_ERROR";
        popupObj_Meta[popupKey].button_2_click = function () {
            helper.HidePopupBox();
            $scope.doExit = true;
            $scope.PlayerCoreUI_ExitPlayer(null);
        };
        helper.ShowPopupBox(popupKey, $scope);
    }

    /**
     * Stop playing
     * Stop all pending functions and prepare to stop
     *
     * @param isError
     */
    function PlayerCoreUI_StopPlaying (isError) {
        if ($scope.isVideoPaused) {
            $scope.isVideoPaused = false;
        }
        if ($scope.seekTimer != null) {
            PlayerCoreUI_ClearSeekTimer();
            $scope.showScrubberImage = false;
        }

        // If seek was in progress enable key presses back
        if ($scope.seekInProgress) {
            $scope.seekInProgress = false;
        }

        if ($scope.ignoreKeyPress) {
            $scope.ignoreKeyPress = false;
        }
        if ($scope.controlBarTimer != null) {
            clearTimeout($scope.controlBarTimer);
            helper.debugLog("Stop playing - Cleared control bar timer id: " + $scope.controlBarTimer);
            $scope.controlBarTimer = null;
        }

        if ($scope.showStartResumeButtons) {
            $scope.showStartResumeButtons = false;
        }
        if ($scope.spinnerUp) {
            helper.hideSpinner();
            $scope.spinnerUp = false;
        }

        if ($scope.scenesOpen) {
            $scope.PlayerCoreUI_CloseScenes();
        }
        if ($scope.showInfo) {
            $scope.showInfo = false;
            $scope.PlayerCoreUI_RepositionProgressBar($scope.showInfo, $scope.infoBarId);
        }

        if (!isError && $scope.isConnected) {
            if (!$scope.endOfMovie && !$scope.isPreview && PlayerCoreUI_IsVideoPlaying() &&
                ($scope.mVideo.duration - $scope.progressWatched / SECONDS_TO_MS < END_OF_MOVIE_THRESHOLD)) {
                PlayerCoreUI_VideoEnd();
            }
            else {
                $scope.isControlBarDisplayed = false;
                $scope.doExit = true;
                if (!$scope.endOfMovie) {
                     PlayerCoreUI_StopPlayer(!$scope.isPreview, ($scope.isPreview)? null: function () {
                         $scope.PlayerCoreUI_ExitPlayer(null);
                     });
                     if ($scope.isPreview) {
                         $scope.PlayerCoreUI_ExitPlayer(null);
                     }
                }
                else {
                    $scope.PlayerCoreUI_ExitPlayer(null);
                }
            }
        }
        else {

            if (!$scope.endOfMovie) {
                $scope.isControlBarDisplayed = false;
            }
            PlayerCoreUI_StopPlayer($scope.isConnected, $scope.isConnected? function () {
                $scope.PlayerCoreUI_ExitPlayer(null);
            }:null); // ZOE-34566: need to send heartbeat if error occurs
        }
    }

    /***
     * Stop player
     *
     * @param sendPosition
     */
    function PlayerCoreUI_StopPlayer(sendPosition, callbackFunc) {
        $scope.startDoneOnce = false;
        $scope.isPlayerStopped = true;
        $scope.restartPlayer = false;
        $scope.PlayerCoreUI_HideCaption();

        if (!$scope.isPreview) {
            if (sendPosition) {
                PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.STOP, callbackFunc);
            }
            if ($scope.heartbeatTimer != null) {
                helper.debugLog("stop - Cleared heartbeat timer id: " + $scope.heartbeatTimer);
                clearInterval($scope.heartbeatTimer);
                $scope.heartbeatTimer = null;
            }
        }
        else if (callbackFunc != null) {
            // exit preview on error
            callbackFunc();
        }

        // ZOE-34748: Exit from Start/Resume screen before playback starts
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        if (playerState > 0) {
            // Do not call stop player if playback has not started
            playerHelper.Stop();
            $scope.playerState = 0;
        }
    }

    /*****************************************************
     * Player Callbacks
     *****************************************************/

    // Playback started - this callback is called when video is fully loaded
    function PlayerCoreUI_OnPlaybackStarted() {
        helper.debugLog("PlayerCoreUI_OnPlaybackStarted");
        $scope.mVideo.height = playerHelper.GetVideoHeight();
        $scope.mVideo.width = playerHelper.GetVideoWidth();
        var playerDuration = playerHelper.GetDuration();   // Note: needed for Samsung and LG b/c we do not receive onVideoMetadata event
        if (playerDuration != 0) {
            $scope.mVideo.duration = playerDuration;
        }
        helper.debugLog("OnPlaybackStarted - Video duration: " + $scope.mVideo.duration);
        helper.debugLog("Video height: " + $scope.mVideo.height + ", width: " + $scope.mVideo.width);
        $scope.totalTime = $scope.PlayerCoreUI_TimeConvert(Math.ceil($scope.mVideo.duration));

        // Initialize chapter bar
        if (!$scope.isPreview) {
            $scope.numChapters = Math.floor($scope.mVideo.duration / CHAPTER_INTERVAL);
            if ($scope.mVideo.duration - $scope.numChapters * CHAPTER_INTERVAL > END_OF_MOVIE_THRESHOLD) {
                // add the last chapter if it is longer than 5 min
                $scope.numChapters++;
            }
            helper.debugLog("Number of chapters: " + $scope.numChapters);
        }

        $scope.videoBitrate = playerHelper.GetCurrentBitrate();
        helper.debugLog("OnPlaybackStarted - bitrate: " + $scope.videoBitrate);
        // Show HD indicator
        if ($scope.titleDetails.isHD && $scope.videoBitrate >= MIN_HD_BITRATE_BPS) {
            $scope.showHD = true;
            $scope.HD_indicatorShown = true;
            // set a timeout to hide HD indicator
            PlayerCoreUI_SetHDindicatorTimeout();
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        if (!$scope.resumeInProgress) {
            $scope.playbackStarted = true;
            $scope.playerState = PLAYER_STATE_PLAYING;
            helper.debugLog("OnPlaybackStarted - player state: " + $scope.PlayerCoreUI_GetPlayerState());

            if ($scope.spinnerUp) {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }

            if ($scope.pauseOnAppToggle) {
                playerHelper.Pause();
                $scope.playerState = PLAYER_STATE_PAUSED;
                $scope.isVideoPaused = true;
                $scope.pauseOnAppToggle = false;
                $scope.PlayerCoreUI_ShowControls(0);
            }
            else {
                // start a timer to hide the progress bar after 10 seconds
                PlayerCoreUI_SetControlBarTimeout(INIT_CONTROL_BAR_TIMEOUT);
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }

    // Bitrate change
    function PlayerCoreUI_OnBitrateChange(newBitrate) {
        $scope.mVideo.bitrate = newBitrate;

        if ($scope.titleDetails.isHD) {
            // if the HD indicator has not been shown, show HD indicator for 5 sec if the bitrate is HD
            if ($scope.mVideo.bitrate >= MIN_HD_BITRATE_BPS && !$scope.showHD && !$scope.HD_indicatorShown) {
                $scope.showHD = true;
                $scope.HD_indicatorShown = true;
                // set a timeout to hide HD indicator
                PlayerCoreUI_SetHDindicatorTimeout();
                //$scope.$apply();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            else if ($scope.mVideo.bitrate < MIN_HD_BITRATE_BPS && $scope.showHD) {
                $scope.showHD = false;
                //$scope.$apply();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    }

    // start buffering
    function PlayerCoreUI_OnBufferingStart() {
        $scope.isBuffering = true;
        $scope.PlayerCoreUI_HideCaption();
        $scope.playerState = PLAYER_STATE_BUFFERING;
        var scopeApply = false;

        if (!$scope.spinnerUp) {
            var spinnerPosition = PlayerCoreUI_SetSpinnerPosition();
            helper.showSpinner(SPINNER_FADEOUT_MS, spinnerPosition);
            $scope.spinnerUp = true;
            scopeApply = !$scope.vodDefined;
        }

        // Since on Samsung buffering event comes in during FF/RWD and on startup do not change the progress bar
        if ($scope.vodDefined && !$scope.isControlBarDisplayed) {
            $scope.isControlBarDisplayed = true;
            PlayerCoreUI_UpdateProgressBar($scope.progressWatched/SECONDS_TO_MS);
            PlayerCoreUI_RemoveFocusFromAllButtons();
            scopeApply = true;
        }

        if (scopeApply && !$scope.$$phase) {
            $scope.$apply();
        }
    }

    // end buffering
    function PlayerCoreUI_OnBufferingEnd() {
        helper.debugLog('buffering_end fired');
        $scope.isBuffering = false;
        $scope.playerState = PLAYER_STATE_PLAYING;

        // Spinner is cleared in onResume callback for LG / Samsung
        if (!$scope.seekInProgress && $scope.spinnerUp) {
            helper.hideSpinner();
            $scope.spinnerUp = false;
        }

        if ($scope.vodDefined) {
            // Only needs to be handled on PS3/PS4
            // if the video needs to be paused after PS button is pressed
            if ($scope.pauseOnAppToggle) {
                var playerState = $scope.PlayerCoreUI_GetPlayerState();
                $scope.isVideoPaused = true;
                if (playerState == PLAYER_STATE_PLAYING) {
                    playerHelper.Pause();
                    $scope.playerState = PLAYER_STATE_PAUSED;
                }
                $scope.pauseOnAppToggle = false;
                $scope.PlayerCoreUI_ShowControls(0);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            else {
                if ($scope.isControlBarDisplayed && !$scope.showInfo && !$scope.scenesOpen) {
                    // Since on Samsung buffering event comes in during FF/RWD and on startup do not hide the progress bar
                    $scope.isControlBarDisplayed = false;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }
        }
    }


    // Text metadata callback - called during manifest parsing on text_metadata event
    function PlayerCoreUI_OnTextMetadata(name, language) {
        helper.debugLog("text_metadata event fired - name: " + name);
        helper.debugLog("text_metadata event language: " + language);
        helper.debugLog(" CC supported: " + $scope.titleDetails.ccSupported);
        if ($scope.titleDetails.ccSupported && (language.toLowerCase() == 'en' || language.toLowerCase() == 'eng')) {
            if (isDefined(playerHelper.InitializeClosedCaptions(name))) {
                playerHelper.InitializeClosedCaptions(name);
            }
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }

    // Render closed captions callback
    function PlayerCoreUI_OnRenderCaption(startTime, endTime, captionData)  {
        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        $scope.caption.startTime = startTime;
        $scope.caption.endTime = endTime;
        $scope.caption.htmlData = "";

        if (playerState == PLAYER_STATE_PLAYING && $scope.captionsEnabled) {
            $scope.isCaptionDisplayed = true;

            var htmlContent =  captionData;
            var captionSegment = htmlContent.split('>');
            if ($scope.hideCaptionTimer != null) {
                clearTimeout($scope.hideCaptionTimer);
            }

            if (captionSegment.length > 3) {
                // Multi-line caption - parse the lines and put them in a <span>
                $scope.caption.htmlData = '<span>';
                var firstSegment = 1;
                while (captionSegment[firstSegment][0] == '<')  { firstSegment++;}
                var lastSegment = captionSegment.length - (firstSegment + 1);
                for (var n = firstSegment; n<lastSegment; n++)  {
                    $scope.caption.htmlData += captionSegment[n] + '>';
                }
                $scope.caption.htmlData += captionSegment[lastSegment].split('<')[0] + '</span>';
            }
            else {
                // single line caption
                $scope.caption.htmlData = '<span>' + captionSegment[1].split('<')[0] + '</span>';

            }
            accountHelper.applyCaptionAttributes($scope.captionContainerId, '#caption-text', $scope.captionProperties);
            $('#caption-text').html($scope.caption.htmlData);

            // adjust caption window height and position according to text size
            //var numLines = $scope.caption.htmlData.split('<br/>').length;
            //var lineHeight = parseInt($scope.captionProperties.textSize) * 1.5;
            //var captionWindowHeight = lineHeight * numLines;
            //var captionWindowTop = SCREEN_HEIGHT_UI - captionWindowHeight - CAPTION_BOTTOM_OFFSET;

            //helper.debugLog("caption window height: " + captionWindowHeight + ", top: " + captionWindowTop + "lineHeight: " + lineHeight + "number of lines: " + numLines);
            //$($scope.captionContainerId).css('height', captionWindowHeight);
            //$($scope.captionContainerId).css('top', captionWindowTop);

            helper.debugLog("Received caption - startTime: " + $scope.caption.startTime + ", end time: " + $scope.caption.endTime);
            helper.debugLog("Caption data: " + captionData);
            helper.debugLog("Caption text: " + $scope.caption.htmlData);
            PlayerCoreUI_AdjustCaptionPosition();

            var captionTimeout = $scope.caption.endTime - $scope.caption.startTime;
            if (captionTimeout <= 0)  {
                captionTimeout = CAPTION_TIMEOUT_MS;
            }
            $scope.hideCaptionTimer = setTimeout(function() { $scope.PlayerCoreUI_HideCaption();}, captionTimeout);
//            helper.debugLog("Caption timeout set to " + captionTimeout + " ms");
            //$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }

    // Called when seek is completed
    function PlayerCoreUI_OnSeekComplete() {
        helper.debugLog('seeking complete');
        if ($scope.vodDefined) {
            if ($scope.seekInProgress) {
                $scope.seekInProgress = false;
            }

            if ($scope.spinnerUp) {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
        }

        helper.debugLog("seekComplete - ProgressWatched: " + $scope.progressWatched);
        var playbackPosition = $scope.progressWatched / SECONDS_TO_MS; // convert to seconds
        PlayerCoreUI_UpdateProgressBar(playbackPosition);

        var playerState = $scope.PlayerCoreUI_GetPlayerState();
        helper.debugLog('seekComplete playerState: ' + playerState);

        if ($scope.pauseOnAppToggle) {
            $scope.isVideoPaused = true;
            if (playerState == PLAYER_STATE_PLAYING)  {
                playerHelper.Pause();
                $scope.playerState = PLAYER_STATE_PAUSED;
            }
            if ($scope.showScrubberImage) {
                $scope.showScrubberImage = false;
            }
            $scope.pauseOnAppToggle = false;
            $scope.PlayerCoreUI_ShowControls(0);
        }
        else {

            if (playerState == PLAYER_STATE_PAUSED || playerState == PLAYER_STATE_SEEKING) {
                playerHelper.Resume();     // The player should be in paused state before seeking
                $scope.playerState = PLAYER_STATE_PLAYING;
            }
            else if ($scope.showScrubberImage) {
                $scope.showScrubberImage = false;
            }
            helper.debugLog("Player state after resume: " + $scope.playerState);

            // start a timer to hide chapter bar/progress bar
            if (!$scope.resumeInProgress && !$scope.scenesOpen && !$scope.showInfo) {
                PlayerCoreUI_SetControlBarTimeout($scope.CONTROL_BAR_TIMEOUT);
            }
        }

        if (!$scope.resumeInProgress && $scope.progressWatched != 0 && !$scope.isPreview) {
            // Clear the heartbeat timer and start a new one
            if ($scope.heartbeatTimer != null) {
                helper.debugLog("seekComplete - Cleared heartbeat timer id: " + $scope.heartbeatTimer);
                clearInterval($scope.heartbeatTimer);
                $scope.heartbeatTimer = null;
            }
            PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT, null);
            $scope.heartbeatTimer = setInterval(function () {
                PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT, null);
            }, $scope.heartbeatPeriod);
            helper.debugLog("seekComplete - New heartbeat timer id: " + $scope.heartbeatTimer);
        }
        //$scope.$apply();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        $scope.ignoreKeyPress = false;
        helper.debugLog("key press enabled");
    }

    function PlayerCoreUI_PauseOnAppToggle() {
        if (!$scope.pauseOnAppToggle) {
            $scope.pauseOnAppToggle = true; // set the app toggle flag
            var playerState = $scope.PlayerCoreUI_GetPlayerState();

            // If the player is not seeking or buffering or paused, pause the player
            // Otherwise just set the flag and pause it in the callback (seekComplete or buffering_end)
            if (playerState != PLAYER_STATE_SEEKING &&
                playerState != PLAYER_STATE_BUFFERING &&
                playerState != PLAYER_STATE_PREPARE_PLAYING && !$scope.isVideoPaused) {
                $scope.PlayerCoreUI_PlayPause();
            }
        }
        else {
            helper.debugLog("reset pauseOnAppToggle flag");
            $scope.pauseOnAppToggle = false; // reset the app toggle flag
        }

    }

    function PlayerCoreUI_OnStop() {
        if ($scope.restartPlayer) {
            helper.debugLog("Player restarted");
            PlayerCoreUI_InitializePlayback();
        }
        else {
            helper.debugLog("Player stopped");
        }
    }

    function PlayerCoreUI_OnPlaybackComplete() {
        helper.debugLog("playbackComplete fired");
        $scope.ignoreKeyPress = false;
        PlayerCoreUI_VideoEnd();
    }




    function PlayerCoreUI_OnConnectionChange(isConnected) {
        helper.debugLog("Player - connection_change event fired = " + isConnected);
        internetConnected = isConnected;
        if (internetConnected)   {
            if (!$scope.isConnected) {
                // Dismiss the popup
                $scope.doExit = false;
                if ($scope.networkErrorPopupVisible)  {
                    helper.HidePopupBox();
                    $scope.networkErrorPopupVisible = false;
                }

                if (!$scope.endOfMovie && PLAYER_ACTIVE) {  // Do not trigger restart if user backs out of the player
                    if ($scope.isOffline) {
                        if (isDefined(playerHelper.ClearScreen)) {
                            playerHelper.ClearScreen($scope);
                        }
                    }
                    $scope.isOffline = false;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }

                    // restart player
                    if (!$scope.isVideoLoading) {
                        PlayerCoreUI_RestartPlayback();
                    }
                }
            }
            $scope.isConnected = internetConnected;
        }
        else {

            if ($scope.spinnerUp) {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
            if ($scope.showStartResumeButtons) {
                $scope.showStartResumeButtons = false;
            }
            // clear heartbeat timer
            if (!$scope.isPreview && $scope.heartbeatTimer != null) {
                helper.debugLog("connectionChanged - Cleared heartbeat timer id: " + $scope.heartbeatTimer);
                clearInterval($scope.heartbeatTimer);
                $scope.heartbeatTimer = null;
            }
            $scope.doExit = false;
            $scope.isVideoLoading = false;
            $scope.isConnected = internetConnected;
            PlayerCoreUI_StopPlaying(true);
            POP_ALERT_BOX_VISIBLE = true;
            $scope.networkErrorPopupVisible = true;
            $scope.PlayerCoreUI_ShowErrorMessage(networkConnectionErrorCode);
            $scope.PlayerCoreUI_ExitPlayer(null);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // End of movie experience
    ///////////////////////////////////////////////////////////////////////////////////////////////

    function PlayerCoreUI_VideoEnd() {
        $scope.videoEnd = true;
        playerHelper.Stop();
        $scope.playerState = 0;
        $scope.isPlayerStopped = true;
        $scope.restartPlayer = false;

        if ($scope.spinnerUp) {
            helper.hideSpinner();
            $scope.spinnerUp = false;
        }
        $scope.progressWatched = $scope.mVideo.duration * SECONDS_TO_MS;
        $scope.PlayerCoreUI_HideCaption();

        if ($scope.scenesOpen) {
            $scope.PlayerCoreUI_CloseScenes();
        }

        // Remove info overlay if it is displayed
        if ($scope.showInfo) {
            $scope.PlayerCoreUI_ShowInfoBar();
        }

        if ($scope.isPreview) {
            $scope.doExit = true;
            $scope.PlayerCoreUI_ExitPlayer(null);
        }
        else {
            // Clear heartbeat timer
            if ($scope.heartbeatTimer != null) {
                helper.debugLog("videoEnd: Cleared heartbeat timer id: " + $scope.heartbeatTimer);
                clearInterval($scope.heartbeatTimer);
                $scope.heartbeatTimer = null;
            }

            disableHttpSpinner = false;      // enable http spinner
            $scope.endOfMovie = true;

            // ZOE-29961: send the last heartbeat before calling complete watching title.
            PlayerCoreUI_SendHeartbeat(RBI.SetPlaybackLocationRequest.Defines.STOP, function () {
                PlayerCoreUI_CompleteWatchingTitle();
            });

            // Show end of movie screen
            PlayerCoreUI_ShowEndOfMovieScreen();
        }
    }


    function PlayerCoreUI_ShowEndOfMovieScreen () {
        $scope.PlayerCoreUI_ShowControls(0);
        $scope.focusIndexMap[0] = 0;
        $scope.focusIndexMap[1] = 0;
        $scope.focusLevel = 0;
        $scope.currentFocusEl = $scope.endOfMovieButtonId[$scope.focusIndexMap[$scope.focusLevel]];

        PlayerCoreUI_UpdateProgressBar($scope.progressWatched / SECONDS_TO_MS);
            PlayerCoreUI_RemoveFocusFromAllButtons();

        if (!$scope.vodDefined) {
            $('#player-right-controls').addClass('end-of-movie');
        }

        helper.SetButtonFocus($scope.currentFocusEl);
        for (var i = 1; i < $scope.endOfMovieButtonId.length; i++) {
            helper.RemoveButtonFocus($scope.endOfMovieButtonId[i]);
        }

        // Get MoreLikeThis titles
        var params = {
            productId: $scope.productId,
            kioskId: ""
        };

        $scope.recommendedProducts = [];
        productService.getRecommendedProducts(params, function (data) {
            // Change of return value to getRecommendedProducts API
            var recommendedProducts = data.getRecommendedProducts();
            $scope.showRecommendedProducts = (recommendedProducts.length > 0)? true:false;
            for (var item = 0; item < recommendedProducts.length && item < MAX_RECOMMENDED_PRODUCTS; item++) {
                var badges = recommendedProducts[item].getDeliveryTypeBadges();
                $scope.recommendedProducts.push({
                    imageUrl: recommendedProducts[item].getImageOfType('poster'),
                    title: recommendedProducts[item].getTitle(),
                    productId: recommendedProducts[item].getProductID(),
                    badges: recommendedProducts[item].getDeliveryTypeBadges(),
                    isSubscription: (helper.hasSubscriptionBadge(badges))? 'display':'none',
                    isRentBuy: (helper.hasRentBuyBadge(badges))? 'display':'none',
                    isKiosk: (helper.hasKioskBadge(badges))? 'display':'none',
                    width: helper.getTitleWidth(IMAGE_POSTER_WIDTH, badges.length, MEDIA_FORMAT_BADGE_WIDTH) + 'px',
                    isSelected: false
                });
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, function (data) {
            // error
            $scope.showRecommendedProducts = false;
        });
    }

    function PlayerCoreUI_scrollTitle(item) {
        if (item.isSelected && helper.needsScroll(item.title, item.badges.length, false)) {
            return true;
        }
        else {
            return false;
        }
    }

    ////////////////////////////////////////
    // Other functions
    //////////////////////////////////////

    function PlayerCoreUI_ShowLoadingScreen() {
        // Loading screen is disabled for preview
        if ($scope.isPreview || $scope.showStartResumeButtons || $scope.isOffline || $scope.endOfMovie || $scope.videoEnd || $scope.isPlayerStopped) {
            return false;
        }
        else if ($scope.isVideoLoading || $scope.resumeInProgress) {
            return true;
        }
        else {
            var playerState = $scope.PlayerCoreUI_GetPlayerState();
            if (playerState <= PLAYER_STATE_PREPARE_PLAYING || (playerState == PLAYER_STATE_BUFFERING && $scope.progressWatched == 0)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    // Set timeout for the control bar
    function PlayerCoreUI_SetControlBarTimeout (controlBarTimeout) {
        $scope.controlBarTimer = setTimeout (function () {
        	$scope.isControlBarDisplayed = false;
        	//$scope.$apply();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, controlBarTimeout);
        helper.debugLog("Created control bar timer id: " + $scope.controlBarTimer);
    }

    // Set timeout for the chapter bar
    function PlayerCoreUI_SetChapterBarTimeout(timeoutPeriod) {
        $scope.chapterBarTimeout = setTimeout (function () {
            // ZOE-31846: Show control bar if the player is paused
            $scope.isControlBarDisplayed = ($scope.isVideoPaused || $scope.seekInProgress || $scope.showStartResumeButtons)?true:false;
            if ($scope.scenesOpen) {
                // automatic timeout from open scenes
                $scope.scenesOpen = false;
                $scope.PlayerCoreUI_RepositionProgressBar($scope.scenesOpen, $scope.chapterBarId);
            }
            else if ($scope.showInfo) {
                $scope.showInfo = false;
                $scope.PlayerCoreUI_RepositionProgressBar($scope.showInfo, $scope.infoBarId);
                // ? Check if needed ??
                if (isDefined(playerHelper.RemoveButtonFocus)) {
                    helper.debugLog("PlayerCoreUI_ShowInfoBar - calling remove button focus with button ID: " + PlayerButton.OPEN_INFO);
                    playerHelper.RemoveButtonFocus(PlayerButton.OPEN_INFO);
                }
            }

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, timeoutPeriod);
    }


    function PlayerCoreUI_SetHDindicatorTimeout() {
        setTimeout(function () {
            if ($scope.showHD) {
                $scope.showHD = false;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        },  HD_INDICATOR_TIMEOUT);
    }


    // Display / hide chapter bar
    $scope.PlayerCoreUI_RepositionProgressBar = function(bShow, elementId) {
        // move the progress bar and CC container (if a caption is being displayed)

        var elementHeight = parseInt($(elementId).css('height').split('p'));
        var progressBarPos = parseInt($($scope.progressBarId).css('top').split('p'));

        if (bShow) {
            $($scope.progressBarId).css('top', (progressBarPos - elementHeight) + 'px');
            if ($scope.titleDetails.ccSupported) {
                if ($scope.isCaptionDisplayed)  {
                    PlayerCoreUI_AdjustCaptionPosition();
                }
            }
        }  else {

            $($scope.progressBarId).css('top', (progressBarPos + elementHeight) + 'px');
            if ($scope.titleDetails.ccSupported) {
                if ($scope.isCaptionDisplayed) {
                    PlayerCoreUI_AdjustCaptionPosition();
                }
            }
        }
    };

    /**
     * Send Heartbeat (SetPlyabackLocation call to OL)
     */
    function PlayerCoreUI_SendHeartbeat(status, callbackFunc) {
        helper.debugLog("Sending playback Location to server: " + $scope.progressWatched + "ms, status: " + status);
        $scope.playbackParams.progressWatched = Math.floor($scope.progressWatched);   // make sure we always send an integer
        $scope.playbackParams.status = status;
        if (callbackFunc) {
            helper.showSpinner(SPINNER_FADEOUT_MS, config.spinnerPosition);
        }
        playerService.SetPlaybackLocation($scope.playbackParams, function (heartbeatPeriod) {
            if (heartbeatPeriod > 0) {
                $scope.heartbeatPeriod = heartbeatPeriod; // Note - we can ignore this value for now
            }
            helper.debugLog("Heartbeat sent successfully; current position: " + $scope.progressWatched + " ms");

            // ZOE-29961 - call  Complete WatchingTitle API if user has reached the end of movie
            if (callbackFunc) {
                callbackFunc();
                helper.hideSpinner();
            }
        }, function (data) {
            if ($scope.spinnerUp)  {
                helper.hideSpinner();
                $scope.spinnerUp = false;
            }
            if (data.status == 0) {
                // check for API timeout
                $scope.isConnected = false;
            }
            else if (isDefined(data.ResultInfo)) {
                if (data.ResultInfo.ResultCode == networkConnectionErrorCode) {
                    $scope.isConnected = false;
                }
            }

            if (!$scope.isConnected) {
                // Only exit player if a connection error occurs, otherwise ignore heartbeat errors
                $scope.isPlayerStopped = true;
                $scope.PlayerCoreUI_HideCaption();

                if (!$scope.isPreview) {
                    if ($scope.heartbeatTimer != null) {
                        helper.debugLog("stop - Cleared heartbeat timer id: " + $scope.heartbeatTimer);
                        clearInterval($scope.heartbeatTimer);
                        $scope.heartbeatTimer = null;
                    }
                }
                $scope.PlayerCoreUI_OnError(networkConnectionErrorCode);
            }
            else {
                // call exit callback function if heartbeat fails for other reason than network disconnect
                if (callbackFunc) {
                    callbackFunc();
                }
            }
        });
    }

     // If the control bar is present, move the caption so that it is above the control bar
    function PlayerCoreUI_AdjustCaptionPosition () {
        var ccContainerPos = parseInt($($scope.captionContainerId).css('bottom').split('p'));

        if ($scope.isControlBarDisplayed) {
            // need to adjust the caption position
            var progressBarPos = SCREEN_HEIGHT_UI - parseInt($($scope.progressBarId).css('top').split('p'));
            helper.debugLog("PlayerCoreUI_AdjustCaptionPosition - progressBarPos: " + progressBarPos);
            if (ccContainerPos <  progressBarPos) {
                $scope.adjustCaptionPos =  progressBarPos - ccContainerPos + 2;
                ccContainerPos += $scope.adjustCaptionPos;
            }
            else {
                var diff =  ccContainerPos - progressBarPos - 5;
                $scope.adjustCaptionPos -= diff;
                ccContainerPos -= diff;
            }
            helper.debugLog("PlayerCoreUI_AdjustCaptionPosition - adjustCaptionPos: " + $scope.adjustCaptionPos + ", ccContainerPos: " + ccContainerPos);
            $($scope.captionContainerId).css('bottom', ccContainerPos);
        }
        else if ($scope.adjustCaptionPos > 0){
            //helper.debugLog("PlayerCoreUI_AdjustCaptionPosition - adjustCaptionPos: " + $scope.adjustCaptionPos + ", ccContainerPos: " + ccContainerPos);
            $($scope.captionContainerId).css('bottom', CAPTION_BOTTOM_OFFSET);
            $scope.adjustCaptionPos = 0;
        }
    }


    function PlayerCoreUI_CompleteWatchingTitle () {
        playerService.CompleteWatchingTitle($scope.playbackParams, function(data) {
            helper.debugLog("CompleteWatchingTitle successful");
        }, function (data) {
            helper.debugLog("Error occurred in CompleteWatchingTitle request");
        });
    }


    // Remove highlight from all buttons
    function PlayerCoreUI_RemoveFocusFromAllButtons() {
        helper.debugLog("Removing focus from all buttons");
        if (isDefined(playerHelper.RemoveButtonFocus)) {
            for (var i=0; i<=PlayerButton.QMENU; i++)  {
                //helper.debugLog("Removing focus from button: " + i);
                playerHelper.RemoveButtonFocus(i);
            }
        }
        $scope.currentButtonId = ($scope.vodDefined)?'':-1;   // no button is focused
    }

    function PlayerCoreUI_SetSpinnerPosition() {
        return (PlayerCoreUI_ShowLoadingScreen())? spinnerPosLoading:config.spinnerPosition;
    }
});