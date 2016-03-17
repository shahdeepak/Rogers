/**
 * Platform-specific callback functions used by CoreUI
 * 
 * This file needs to be overridden by each platform
 */

var playerHelper = {

	/***************************************************************************
	 * LoadPlayer - mandatory callback Performs initial loading of the video
	 * player Called after GetPlaybackUrl
	 * 
	 * @param playbackUrl
	 * @param customData
	 * @constructor
	 */
	videoPlayer : null,
	nnavi : document.getElementById("pluginObjectNNavi"),
	DrmPlugin : document.getElementById("pluginDRM"),
	pluginAPI : setPlugin(), // Screen Saver API
	startPosition: 0,
    playbackUrl: '',
    // Flag that indicates if ResumePlay API is supported on the device
    playbackResumeSupported: platformInfo.playbackResumeSupported(),
    streamInfoReady: false,   // this flag indicates if onStreamInfoReady callback was received
	
	// Need to get these values from the device
	SCREEN_WIDTH : 1920,
	SCREEN_HEIGHT : 1080,

    // initial buffer size
    INIT_BUFFER_SIZE: 5120 * 1024,  // 5 MB

	LoadPlayer : function($scope) {
		helper.debugLog("Loading player ...");
		
		playerHelper.scope = $scope;
		this.videoPlayer = document.getElementById('pluginPlayer');
		this.videoPlayer.SetDisplayArea(0, 0,playerHelper.SCREEN_WIDTH, playerHelper.SCREEN_HEIGHT);
		
		//Handling Samsung Player Events
		this.videoPlayer.OnAuthenticationFailed = 'playerHelper.OnAuthenticationFailed';
		this.videoPlayer.OnBufferingComplete = 'playerHelper.OnBufferingComplete';
		this.videoPlayer.OnBufferingProgress = 'playerHelper.OnBufferingProgress';
		this.videoPlayer.OnBufferingStart = 'playerHelper.OnBufferingStart';
		this.videoPlayer.OnConnectionFailed = 'playerHelper.OnConnectionFailed';
		this.videoPlayer.OnCurrentPlayTime = 'playerHelper.OnCurrentPlayTime';		
		this.videoPlayer.OnNetworkDisconnected = 'playerHelper.OnNetworkDisconnected';
		this.videoPlayer.OnRenderError = 'playerHelper.OnRenderError';
		this.videoPlayer.OnRenderingComplete = 'playerHelper.OnRenderingComplete';
		this.videoPlayer.OnResolutionChanged = 'playerHelper.OnResolutionChanged';
		this.videoPlayer.OnStreamInfoReady = 'playerHelper.OnStreamInfoReady';
		this.videoPlayer.OnStreamNotFound = 'playerHelper.OnStreamNotFound';
				
		if (isDefined($scope.customData)) {
			// Pass custom data to the soap challenge
			helper.debugLog("Passing custom data: " + $scope.customData);
		}

		helper.debugLog("Calling LoadPlayer player state: "
				+ $scope.playerState);
		if ($scope.isPreview) {
            // ZOE-34329: Create Conviva session before playback starts
            $scope.PlayerCoreUI_CreateConvivaSession();
			$scope.PlayerCoreUI_OnVideoLoaded();
		} else {
			playerHelper.ExecuteDRM($scope, function() {
                // ZOE-34329: Create Conviva session before playback starts
                $scope.PlayerCoreUI_CreateConvivaSession();
				$scope.PlayerCoreUI_OnVideoLoaded();
			});
		}
	},
	
	// Handling OnAuthenticationFailed event of Samsung videoPlayer object
	 OnAuthenticationFailed : function(){
		helper.debugLog('onAuthenticationFailed');
		playerHelper.scope.onAuthenticationFailed();
	},
	
	// Handling OnBufferingComplete event of Samsung videoPlayer object
    OnBufferingComplete: function () {
        helper.debugLog('onBufferingComplete');
        // parameter indicates if we need to call onResume callback
        // This callback is called automatically on PS3/PS4/Vita and LG
        playerHelper.scope.onBufferingComplete(true);
    },
	
	// Handling OnBufferingProgress event of Samsung videoPlayer object
	 OnBufferingProgress : function(){
		helper.debugLog('onBufferingProgress');
	},
	
	// Handling OnBufferingStart event of Samsung videoPlayer object
	 OnBufferingStart : function(){
		helper.debugLog('onBufferingStart');
		playerHelper.scope.onBufferingStart();
	},
	
	// Handling OnConnectionFailed event of Samsung videoPlayer object
	 OnConnectionFailed : function(){
		helper.debugLog('onConnectionFailed');
		playerHelper.scope.onConnectionFailed();
	},
	
	// Handling OnCurrentPlayTime event of Samsung videoPlayer object
	 OnCurrentPlayTime : function(timeStamp) {
		//helper.debugLog('onCurrentPlayTime :' + timeStamp);
        if (this.startPosition > 0) {
            timeStamp += this.startPosition;
            //helper.debugLog('onCurrentPlayTime - adjusted position:' + timeStamp);
        }
		playerHelper.scope.onCurrentPlayTime(timeStamp);
	},

	// Handling OnNetworkDisconnected event of Samsung videoPlayer object
	 OnNetworkDisconnected : function(){
		helper.debugLog('onNetworkDisconnected');
		playerHelper.scope.onNetworkDisconnected();
	},
	
	// Handling OnRenderError event of Samsung videoPlayer object
	 OnRenderError : function(errorType){
		helper.debugLog('onRenderError - error type:' + errorType);
		playerHelper.scope.onRenderError(errorType);
	},
	
	// Handling OnRenderingComplete event of Samsung videoPlayer object
	 OnRenderingComplete : function(){
		helper.debugLog('onRenderingComplete');
		playerHelper.scope.onRenderingComplete();
	},
	
	// Handling OnResolutionChanged event of Samsung videoPlayer object
	 OnResolutionChanged : function(){
		helper.debugLog('onResolutionChanged');
	},
	
	// Handling OnStreamInfoReady event of Samsung videoPlayer object
	 OnStreamInfoReady : function(){
		helper.debugLog('onStreamInfoReady');
        if (!playerHelper.streamInfoReady) {
            playerHelper.scope.onStreamInfoReady();
            playerHelper.streamInfoReady = true;
        }
	},
	
	// Handling OnStreamNotFound event of Samsung videoPlayer object
	 OnStreamNotFound : function(){
		helper.debugLog('onStreamNotFound');
		playerHelper.scope.onStreamNotFound();
	},

	/**
	 * Override to update custom data
	 * 
	 * @playbackData
	 */
	GetCustomData : function(playbackData) {
		var token = playbackData.token.replace(/^\s+|\s+$/g, "");
		var customData = "<appData><partnerCustomerNumber>"
				+ playbackData.pcn
				+ "</partnerCustomerNumber>"
				+ "<componentId>"
				+ playbackData.componentID
				+ "</componentId>"
				+ "<deviceId>"
				+ platformInfo.deviceId
				+ "</deviceId>"
				+ "<entitlementId>"
				+ playbackData.entitlementID
				+ ""
				+ "</entitlementId><downloadActive>false</downloadActive><token>"
				+ token + "</token></appData>";
		helper.debugLog("GetCustomData:customData :" + customData);
		return customData;
	},

	/**
	 * Execute DRM
	 */

	ExecuteDRM : function($scope, successCallBack) {
		try {

			if ($scope.titleDetails.isHD) {
                this.playbackUrl = $scope.playbackUrl.replace(".m3u8",
						"_HD_HLS.m3u8");
			} else {
                this.playbackUrl = $scope.playbackUrl.replace(".m3u8",
						"_CE_DEVICES.m3u8");
			}

            this.playbackUrl += "|DRM_TYPE=SECURE-MEDIA|DRM_INFO={DEVICE_ID="
					+ platformInfo.deviceId + "|AINFO=" + $scope.customData
					+ "|";
			this.playbackUrl += "REGISTER_URL="+RBI.PlatformConfig.DRM_SERVER_URL+"}|COMPONENT=HLS";
			var pcn = $scope.playbackParams.pcn;

			this.DrmPlugin.Open("DRM", "1.000", "DRM");
			this.DrmPlugin.Execute("Initialize", "1", "Redbox");
			var drmexec = this.DrmPlugin.Execute("Registration",
					platformInfo.deviceId,
					RBI.PlatformConfig.DRM_SERVER_URL,
					"<appData><partnerCustomerNumber>" + pcn
							+ "</partnerCustomerNumber>" + "<deviceId>"
							+ platformInfo.deviceId + "</deviceId>"
							+ "<downloadActive>false</downloadActive>"
							+ "</appData>");
			successCallBack();

		} catch (e) {
			helper.debugLog("Exception in modifying SMUrl :" + e);
		}

	},


	/**
	 * Starts playback
	 *
	 * @param $scope
     * @param startPosition
	 */
	StartPlayback : function($scope, startPosition) {
		helper.debugLog("Start PlayBack");
        var retValue = false;
		try {
			// For Preview, change url specific to preview type and media format
			// replace .m3u8 with appropriate String. (_HD_HLS.m3u8 for HD and
			// _CE_DEVICES.m3u8 for SD).
			// And if playback type is hls append COMPONENT=HLS into URL.

			if ($scope.isPreview) {
				if ($scope.previewMediaFormat == "HD") {
					this.playbackUrl = $scope.playbackUrl.replace(".m3u8",
							"_HD_HLS.m3u8");
				} else {
					this.playbackUrl = $scope.playbackUrl.replace(".m3u8",
							"_CE_DEVICES.m3u8");
				}
				var type = this.playbackUrl.indexOf("mp4") >= 0 ? "mp4"
						: "hls";
				if (type == "hls")
                    this.playbackUrl += "|COMPONENT=HLS";
			}

            playerHelper.streamInfoReady = false;
            if (!$scope.isPreview && startPosition > 0 && !this.playbackResumeSupported) {
                retValue = playerHelper.ResumePlayback(startPosition);
                if (retValue) {
                    playerHelper.EnableVolume();
                    // Turning off screen saver
                    this.pluginAPI.setOffScreenSaver();
                }
            }
            else {
                helper.debugLog("Playback URL :" + this.playbackUrl);
                playerHelper.startPosition = 0;
                retValue = playerHelper.videoPlayer.InitPlayer(this.playbackUrl);
                if (retValue) {

                    // Set buffer values for play back (not required for preview)
                    if (!$scope.isPreview) {
                        this.videoPlayer.SetInitialBuffer(this.INIT_BUFFER_SIZE);
                        this.videoPlayer.SetPendingBuffer(this.INIT_BUFFER_SIZE);
                    }

                    playerHelper.EnableVolume();

                    // Turning off screen saver
                    this.pluginAPI.setOffScreenSaver();

                    // Decide whether to Resume or Start from Beginning
                    if (startPosition > 0) {

                        var resumeStatus = this.videoPlayer.ResumePlay(this.playbackUrl, startPosition);
                        helper.debugLog("ResumePlay Complete :" + resumeStatus);
                        if (resumeStatus == false) {
                            // If resume fails start playing from the beginning
                            this.videoPlayer.StartPlayback();
                        }
                    }
                    else {
                        this.videoPlayer.StartPlayback();
                    }
                }
            }
		}
        catch (e) {
			helper.debugLog("Exception in :" + e);
		}

        return retValue;
	},

	/**
	 * Pause the current playing video
	 * 
	 * @constructor
	 */

	Pause : function() {
		// Turn screen saver ON
		// this.pluginAPI.setOnScreenSaver(); // PR probably not needed here
		playerHelper.videoPlayer.Pause();
	},

	/*
	 * Resumes the playback if its in paused state @constructor
	 */

	Resume : function() {
		playerHelper.videoPlayer.Resume();
	},

    /**
     * Resume playback from a given start position by appending a STARTTIME parameter to the playback URL
     * @param startPosition
     * @returns boolean (true if success, false on error
     */
    ResumePlayback: function(startPosition) {
        playerHelper.startPosition = startPosition * SECONDS_TO_MS;
        var playbackUrl  = this.playbackUrl + "|STARTTIME=" + playerHelper.scope.PlayerCoreUI_TimeConvert(startPosition);
        helper.debugLog("Playback URL :" + playbackUrl);
        var retValue = playerHelper.videoPlayer.InitPlayer(playbackUrl);
        if (retValue) {
            // Set buffer values for playback
            this.videoPlayer.SetInitialBuffer(this.INIT_BUFFER_SIZE);
            this.videoPlayer.SetPendingBuffer(this.INIT_BUFFER_SIZE);
            this.videoPlayer.StartPlayback();
        }
        return retValue;
    },

	/**
	 * Stops video playback
	 */

	Stop : function() {
		playerHelper.videoPlayer.Stop();
	},

	/**
	 * Forwards video playback by time specified by offset
	 * 
	 * @param newPosition -
	 *            new seek position (in seconds; used in PS3/PS4/LG)
	 * @param offset
	 *            the difference between current position and new position
	 *            (in seconds - used by Samsung)
	 */

	SeekForward : function(newPosition, offset) {
		return playerHelper.videoPlayer.JumpForward(offset);
	},

	/**
	 * Rewinds video playback by time specified by offset
	 * 
	 * @param newPosition -
	 *            new seek position (in seconds; used in PS3/PS4/LG)
	 * @param offset
	 *            the difference between current position and new position
	 *            (in seconds - used by Samsung)
	 */

	SeekBackward : function(newPosition, offset) {
        var retValue;

        // if rewinding before startPosition, we need to call ResumePlayback which appends the new
        // start position to the URL
        if (playerHelper.startPosition > 0 && newPosition < playerHelper.startPosition) {
            playerHelper.Stop();  // need to stop playback since we are re-initializing the player with a new url
            var resumePos = Math.floor(newPosition);
            retValue = playerHelper.ResumePlayback(resumePos);

            // set player state to playing so that we do not call resume again and that
            // scrubber image is cleared
            if (retValue) {
                playerHelper.scope.PlayerCoreUI_SetPlayerState(PLAYER_STATE_PLAYING);
            }
        }
        else {
            retValue = playerHelper.videoPlayer.JumpBackward(offset);
        }
		return retValue;
	},

	/**
	 * Returns the height of video player object
	 * 
	 * @returns height width of player object
	 * @constructor
	 */

	GetVideoHeight : function() {
		return playerHelper.videoPlayer.GetVideoHeight();
	},

	/**
	 * Returns the width of video player object
	 * 
	 * @returns width width of player object
	 * @constructor
	 */

	GetVideoWidth : function() {
		return playerHelper.videoPlayer.GetVideoWidth();
	},

	/**
	 * Returns current bitrate of running video
	 */
	GetCurrentBitrate : function() {
		var bps = playerHelper.videoPlayer.GetCurrentBitrates();
		helper.debugLog("Current bitrates :" + bps);
		return bps;
	},

	/**
	 * Returns the duration of playback in seconds.
	 */
	GetDuration : function() {
        var duration = this.videoPlayer.GetDuration();
        if (playerHelper.startPosition > 0) {
            // Add start time if necessary
            duration += playerHelper.startPosition;
        }
		helper.debugLog("Duration :" + duration + " ms");
        // convert to seconds
		return duration / SECONDS_TO_MS;
	},

	// GetScreenHeight
	GetScreenHeight : function() {
		return playerHelper.SCREEN_HEIGHT;
	},

	// GetScreenWidth
	GetScreenWidth : function() {
		return playerHelper.SCREEN_WIDTH;
	},

	// IsWidescreen
	IsWidescreen : function() {
		return true; // Need to call an API to detect HD/SD here
	},

    // HD screen resolution check - return true since all Samsung TVs are HD
    CheckHDScreenResolution: function () {
        return true;
    },

	// license response callback
	// not needed for Samsung
	LicenseResponse : function(responseText) {
	},

	/**
	 * UpdateProgressBar Mandatory callback to update the progress bar
	 * 
	 * @param progressBarSize -
	 *            current progress bar size
	 * @param currentPosition -
	 *            current position of progress indicator
	 */

	UpdateProgressBar : function(progressBarSize, currentPosition) {
		$('#white-loading').css('width', progressBarSize + 'px');
		$('#progress-bar').css('width', progressBarSize + 'px');
		$('#current-position-indicator').css('left', currentPosition + 'px');
	},

	// Clear screen for the player; hide all DOM elements from other screens
	// that are not shown in the player
	// Optional
	ClearScreen : function($scope) {
		$('#main-menu-return').hide();
		// Hide the header
		$('#header').hide();
	},

	// Platform-specific exit player function
	// Executed on all exit paths from the player
	ExitPlayer : function($scope) {
		// Show the header and the back/menu buttons
		$('#header').show();
		$('#main-menu-return').show();

		// Turn screen Saver ON
		this.pluginAPI.setOnScreenSaver();
	},

	// Destroy player memory, unregister DRM
	DestroyPlayer : function() {
		helper.debugLog("DestroyPlayer - Turn Caption Off before unregistering DRM");
        //Turn Caption Off before unregistering DRM
        this.CaptionOff();
        
        helper.debugLog("DestroyPlayer - Unregister DRM");
        // Unregister DRM
        if (this.DrmPlugin) {
            this.DrmPlugin.Execute('Stop');
            this.DrmPlugin.Execute('Finalize');
            this.DrmPlugin.Close();
        }
	},

	/**
	 * Initialize closed captions Optional
	 * 
	 * @param name -
	 *            text stream metadata name
	 */

	InitializeClosedCaptions : function(name) {
		// Many Samsung devices does not support captions,
		// Need to decide on showing CC button in this case
		// PR - Is there an API to find out??
		// This fuanction car return true/false depending on if captions are
		// supported or not
	},

	/**
	 * Enables volume controls for Samsung
	 */

	EnableVolume : function() {
		helper.debugLog("Enabling Volume Control");
		var tvmwObject = document.getElementById("pluginObjectTVMW");
		tvmwObject.UnregisterKey(KEY_CODES.PL_TVMW_KEY_VOL_UP);
		tvmwObject.UnregisterKey(KEY_CODES.PL_TVMW_KEY_VOL_DOWN);
		tvmwObject.UnregisterKey(KEY_CODES.PL_TVMW_KEY_MUTE);
		tvmwObject.UnregisterKey(KEY_CODES.MUTE);
		this.nnavi.SetBannerState(1);
	},

	// Sets button focus for a specific button
	SetButtonFocus : function($scope, buttonId) {

		if (buttonId != PlayerButton.CLOSE_INFO) {
			this.RemoveButtonFocus($scope.currentButtonId);
			$scope.currentButtonId = buttonId;
		}

		switch (buttonId) {
		    case PlayerButton.PLAY:
                if ($('#playPause').hasClass("play-icons play-btn")) {
                    $('#playPause').removeClass("play-icons play-btn");
                }
                else {
                    $('#playPause').removeClass("play-icons pause-btn");
                }
                $('#playPause').addClass(
                    "play-icons pause-btn-highlight");
                break;

            case PlayerButton.PAUSE:
                if ($('#playPause').hasClass("play-icons play-btn")) {
                    $('#playPause').removeClass("play-icons play-btn");
                }
                else {
                    $('#playPause').removeClass("play-icons pause-btn");
                }
                $('#playPause').addClass(
                    "play-icons play-btn-highlight");
                break;

		case PlayerButton.FFW:
			$('#Fwd').removeClass("play-icons forward-btn").addClass(
					"play-icons forward-btn-highlight");
			break;

		case PlayerButton.RWD:
			$('#Rwd').removeClass("play-icons backward-btn").addClass(
					"play-icons backward-btn-highlight");
			break;

		case PlayerButton.SKIP_FWD:
			$('#skipFwd').removeClass("play-icons skip-farward-btn").addClass(
					"play-icons skip-farward-btn-highlight");
			break;

		case PlayerButton.SKIP_RWD:
			$('#skipRwd').removeClass("play-icons skip-backward-btn").addClass(
					"play-icons skip-backward-btn-highlight");
			break;

		case PlayerButton.STOP:
			$('#stop').removeClass("play-icons stop-btn").addClass(
					"play-icons stop-btn-highlight");
			break;

		default:
			break;
		}

		helper.debugLog("Button focus set: " + buttonId);
	},

	/**
	 * Removes focus all focused elements In this case we do not use button id
	 */

	RemoveButtonFocus : function(buttonId) {
		if (buttonId >= 0) {
			helper.debugLog("Removed focus from button: " + buttonId);
			switch (buttonId) {
			case PlayerButton.PLAY:
			case PlayerButton.PAUSE:
				document.getElementById("playPause").className = "play-icons play-btn";
				break;

			case PlayerButton.FFW:
				document.getElementById("Fwd").className = "play-icons forward-btn";
				break;

			case PlayerButton.RWD:
				document.getElementById("Rwd").className = "play-icons backward-btn";
				break;

			case PlayerButton.SKIP_FWD:
				document.getElementById("skipFwd").className = "play-icons skip-farward-btn";
				break;

			case PlayerButton.SKIP_RWD:
				document.getElementById("skipRwd").className = "play-icons skip-backward-btn";
				break;

			case PlayerButton.STOP:
				document.getElementById("stop").className = "play-icons stop-btn";
				break;

			default:
				break;
			}
		}
	},

    // Remove pause icon from the playPause button to indicate playback resume
    SetPlayButtonIcon: function () {
        if ($('#playPause').hasClass("play-icons pause-btn")) {
            $('#playPause').removeClass("play-icons pause-btn");
        }
        else if ($('#playPause').hasClass("play-icons pause-btn-highlight")) {
            $('#playPause').removeClass("play-icons pause-btn-highlight");
        }
        $('#playPause').addClass("play-icons play-btn");
    },

	/**
	 * Turns ON movie Closed Caption
	 */

	CaptionOn : function() {
		this.nnavi.SetCaptionState(1);
		this.DrmPlugin.Open("TV", 1.000, "TV");
		this.DrmPlugin.Execute("ShowCaption", 1);
	},

	/**
	 * Turns OFF the Closed Captions
	 */
	CaptionOff : function() {
		this.nnavi.SetCaptionState(0);
		this.DrmPlugin.Open("TV", 1.000, "TV");
		this.DrmPlugin.Execute("ShowCaption", 0);
	},

	/**
	 * Key event handler for the player
	 * 
	 * @param event
	 * @param $scope
	 */

	HandleKeyDownPlayer : function(event, $scope) {
		switch (event.keyCode) {

		case KEY_CODES.PLAY:
			if ($scope.scenesOpen) {
				$scope.PlayerCoreUI_PlayScene();
			} else {
				$scope.PlayerCoreUI_Play();
			}
			break;

			// select key
		case KEY_CODES.X:
			if ($scope.scenesOpen) {
				$scope.PlayerCoreUI_PlayScene();
			}
            else {
                $scope.PlayerCoreUI_ShowControlBar();
            }
			break;

		// Right Arrow
		case KEY_CODES.DPAD_RIGHT:
			$scope.PlayerCoreUI_ScrollChapterBar(1);
			break;

		// Left Arrow
		case KEY_CODES.DPAD_LEFT:
			$scope.PlayerCoreUI_ScrollChapterBar(-1);
			break;

		// Pause key
		case KEY_CODES.PAUSE:
			$scope.PlayerCoreUI_Pause();
			break;

		case KEY_CODES.FFWD:
			// Fast Forward
			$scope.PlayerCoreUI_FastForward();
			break;

		case KEY_CODES.REWIND:
			// Rewind
			$scope.PlayerCoreUI_Rewind();
			break;

		case KEY_CODES.SCENES:
			$scope.PlayerUI_HandleKeyScenes();
			break;

		case KEY_CODES.SKIP_RWD:
			$scope.PlayerCoreUI_SkipBackward();
			break;

		case KEY_CODES.SKIP_FWD:
			$scope.PlayerCoreUI_SkipForward();
			break;

		case KEY_CODES.INFO:
			// Show info
			$scope.PlayerCoreUI_ShowInfoBar();
			break;

		case KEY_CODES.TRIANGLE:
		case KEY_CODES.CAPTION:
		case KEY_CODES.CAPTION_BRD:
			$scope.PlayerCoreUI_ClosedCaptions();
			break;

		case KEY_CODES.CIRCLE:
		case KEY_CODES.STOP:
			$scope.PlayerCoreUI_StopPlayer();
			break;

		}
	},

    ConvivaInit: function () {
        /**
         * Initialization for the Samsung Smart TV
         */

        LoadLivePass(); //TODO: Find where this is defined
        // Pass in extra settings to notify LivePass that this is a Samsung TV device
        var samsungApi = new Conviva.SamsungApi(document.getElementById("pluginObjectNNavi"));
        Conviva.LivePass.initWithSettings(conviva.CUSTOMER_KEY, { platformApi: samsungApi });
    },

    CreateConvivaSession: function (convivaMetadata) {
        conviva.streamer  = new Conviva.SamsungStreamer(this.videoPlayer);

        try{
            conviva.sessionId = Conviva.LivePass.createSession(
                conviva.streamer, convivaMetadata);
            helper.debugLog("conviva.sessionId : " +conviva.sessionId);
        }catch(e){
            helper.debugLog("Exception in Creating Conviva Session :" +e);
        }
    },

    // Get connection Type
    GetConnectionType: function () {
        var connectionType = "";  //TODO: check the return value if error occurs
        try {
            var SefPlugin = document.getElementById("pluginObjectNetwork");
            connectionType = (SefPlugin.GetActiveType() == 1) ? "Ethernet" : "WiFi";
        } catch (e) {
            helper.debugLog("Error occured while retrieving Connetion Type value" + e);
        }
        return connectionType;
    }
    // Conviva end

};

/**
 * Returns common plugin value for tv else set value to "", while running on
 * browser.
 */
function setPlugin() {
	try {
		return new Common.API.Plugin();
	} catch (e) {
		return "";
	}
}
