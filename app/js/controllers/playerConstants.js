// Player states
var PLAYER_STATE_NOT_LOADED = 0;
var PLAYER_STATE_LOADING = 1;
var PLAYER_STATE_LOADED = 2;
var PLAYER_STATE_LOAD_DISPATCHED = 3;
var PLAYER_STATE_PREPARE_PLAYING = 4;
var PLAYER_STATE_PLAYING = 5;
var PLAYER_STATE_BUFFERING = 6;
var PLAYER_STATE_PAUSED = 7;
var PLAYER_STATE_SEEKING = 8;

// Player button IDs
var PlayerButton = {
    PLAY: 0,
    PAUSE: 1,
    FFW: 2,
    RWD: 3,
    STOP: 4,
    OPEN_SCENES: 5,
    CLOSE_SCENES: 6,
    OPEN_INFO: 7,
    CLOSE_INFO: 8,
    SKIP_FWD: 9,
    SKIP_RWD: 10,
    CAPTIONS: 11,
    BACK: 12,      // back button on end of movie screen (only LG/Samsung)
    QMENU: 13
};

// Constants
var MIN_HD_BITRATE_SPEED_TEST = 3.0;     // Speed test at 3.0 MBps
var MIN_HD_BITRATE_BPS = 2000000;        // For HD indicator
var NUM_CHAPTERS_PER_PAGE = 5;
var INIT_CONTROL_BAR_TIMEOUT = 7000;    // 10 seconds for hiding control bar after user starts playback
var END_OF_MOVIE_THRESHOLD = 300;   // Mark the movie as completely watched when user gets to the end  (in seconds)
var MAX_RECOMMENDED_PRODUCTS = 5;      // Max # of items in More Like This list
var MAX_LENGTH_ACTORS = 70;
var MAX_LENGTH_GENRES = 23;
var TITLE_DESCRIPTION_NUM_LINES = 4;
var TITLE_DESCRIPTION_NUM_CHARS_PER_LINE = 70;
var CAPTION_TIMEOUT_MS = 3000;
var SCENES_CONTROL_BAR_TIMEOUT = 30000; // 30 seconds for scenes
var CURRENT_POSITION_BASE = 155;
var PROGRESS_BAR_TOTAL_WIDTH = 887;
var CHAPTER_INTERVAL = 600; // 10 min
var SECONDS_TO_MS = 1000;
var SEEK_SPEEDS = [2, 4, 8];
var SEEK_INTERVAL = 10; // seconds
var CAPTION_BOTTOM_OFFSET = 30;
var SCREEN_HEIGHT_UI = 720;     // sceen height for caption positioning

var SPINNER_FADEOUT_MS = 500;
var HD_INDICATOR_TIMEOUT = 5000;      // 5 seconds
var SEEK_TIMER_MS = 1000;             // 1 second

var SHOW_CONTROL_BAR_TIMEOUT = 10000;   // show control bar on any key press on the remote for 10 seconds
var PLAYER_SESSION_CLEANUP_DELAY = 2000; // 2 seconds
//var PLAYER_RESUME_DELAY = 1000;          // Player resume delay (only used for Samsung/LG)  // Not used

// Error message codes
var NETWORK_CONNECTION_ERROR = '101';
var DRM_LICENSE_ERROR = '200009';