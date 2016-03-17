/* general */
var LEVEL_MENU = 100;

/*  WatchHistory Constants */
var RED_LOADING_BAR_WIDTH = 300;


var SELECTED_KOISK_KEY = "CurrentKiosk";
var DVD_RESERVATION = "DVD Reservation";
var BLURAY_RESERVATION = "Blu-ray Reservation";
var FIND_DVD = "Find DVD";
var RESERVE_DVD = "Reserve DVD";
var RESERVE_BLURAY = "Reserve Blu-ray";
var FIND_BLURAY = "Find Blu-ray";
var RENT = "Rent";
var RENT_HD = "Rent HD";
var BUY = "Buy";
var BUY_HD = "Buy HD";
var SUBSCRIPTION = "Subscription";
var KIOSK_CHECKOUT_KEY = "KIOSK_CHECKOUT_KEY";
var REDBOX_GIFT="Gift";
var WATCH_NOW_LABEL = "WATCH NOW";
var WATCH_NOW_LABEL_WITH_SUB = "WATCH NOW WITH SUBSCRIPTION";
var RENT_BUY_LABEL = "RENT or BUY";
var RENT_LABEL = "Rent";
var BUY_LABEL = "Buy";
var ON_DVD_AND_BLU_RAY_LABEL = "ON DVD and Blu-ray";
var ON_DVD_LABEL = "ON DVD";
var ON_BLU_RAY_LABEL = "ON Blu-ray";
var SUBSCRIBE_NOW_LABEL = "SUBSCRIBE NOW";
var RENT_HD_LABEL = "Rent HD";
var BUY_HD_LABEL = "Buy HD";

/* Auto scroll time interval in mili seconds */
var HOME_AUTO_SCROLL_TIME = 600;
var HOME_AUTO_SCROLL_TIME_DELAY = 7000;
var HOME_IDLE_TIME_TO_START_CALL = 7000;

/*Constants for the EULA page*/
var MAX_HEIGHT_EULA = 7100;

/*Constants for the Browse page */
// offset for popup
var POPUP_OFFSET = 40;
// offset for top padding for popup
var POPUP_TOP_PADDING_OFFSET = 25;



//Popup constants
var GO_TO_WEB_FOR_SUBSCRIPTION="GO_TO_WEB_FOR_SUBSCRIPTION";

//Account COnstants
var SUBSCRIBED="subscribed";
var SUBSCRIPTION_CANCELLED="SubscriptionCancelled";
var LOGIN_TIMEOUT = 60000;
var SELECTED_INSTANT_OPTION = "SELECTED_INSTANT_OPTION";
var INSTANT_OPTIONS  = "INSTANT_OPTION" ;
var SELECTED_ACCOUNT = "SELECTED_ACCOUNT";
var TITLE_CHECKOUT_CURRENT_CONTROL_INDEX = "TITLE_CHECKOUT_CURRENT_CONTROL_INDEX";
var TITLE_CHECKOUT_RENT_BUY_CURRENT_COUNT ="TITLE_CHECKOUT_RENT_BUY_CURRENT_COUNT";
var TITLE_CHECKOUT_CHANGE_CARD_CURRENT_COUNT= "TITLE_CHECKOUT_CHANGE_CARD_CURRENT_COUNT";
var TITLE_DETAIL = "TITLE_DETAIL";
var MORE_LIKE_THIS = "MORE_LIKE_THIS";
var RATING = "RATING";
var IS_CHECKOUT_CARD="IS_CHECKOUT_CARD";
var SELECTED_KIOSK_OPTION = "SELECTED_KIOSK_OPTION";
var KIOSK_OPTIONS = "KIOSK_OPTIONS";
var TITLE_DETAIL_PATH = "TITLE_DETAIL_PATH";
var CURRENT_INDEX = "CURRENT_INDEX";
var IS_INSTANT_OPTION= "IS_INSTANT_OPTION";
var NO_SUBSCRIPTION= "NO_SUBSCRIPTION";
var IS_SUBSCRIPTION= "IS_SUBSCRIPTION";
var IS_CARD= "IS_CARD";
var IS_ALREADY_PREFERRED= "IS_ALREADY_PREFERRED";
var CARD_OPERATION="CARD_OPERATION";
var OPERATED_ACCOUNT_NUMBER="OPERATED_ACCOUNT_NUMBER";
var AVAILABLE_CREDIT="available_credits";
var AGE_VERIFICATION = "AGE_VERIFICATION";
var NAVIGATED_FROM_ADD_CARD = "NAVIGATED_FROM_ADD_CARD";

var WATCH_HISTORY_PAGESIZE = 25;
var POP_ALERT_BOX_VISIBLE = false;
var UPGRADE_POP_UP_VISIBLE = false;
var MISSING_CARD_POP_UP_VISIBLE = false;
var PREFERENCE_POP_UP_VISIBLE = false;
var PLAYER_ACTIVE = false;


var CART_LIST = "CART_LIST";
var ACCOUNT_USED_FOR_CHECKOUT="";
var SPEED_TEST_RESULT = 'SPEED_TEST_RESULT';
var DEVICE_ACTIVE = 'DEVICE_ACTIVE';
var FREE_TRIAL_ENTRY = "FREE_TRIAL_ENTRY";
var CURRENT_CUSTOMER_ACCOUNT_NO = "CURRENT_CUSTOMER_ACCOUNT_NO";
var PLAYBACK_TITLE_URL = "PLAYBACK_TITLE_URL";
var BROWSE_FILTER = "BROWSE_FILTER";

// Credit card storage
var CREDIT_CARD_DATA = "CREDIT_CARD_DATA";
var PREFERRED_CARD = "PREFERRED_CARD";
var SUBSCRIPTION_CARD = "SUBSCRIPTION_CARD";

var MAX_TITLE_LENGTH_CHECKOUT = 27;
var MAX_FILTER_LENGTH = 25;
var IMAGE_POSTER_WIDTH = 150;
var KIOSK_BADGE_WIDTH = 33;
var MEDIA_FORMAT_BADGE_WIDTH = 24;

// Local storage flags for Omniture
var OMNITURE_KIOSK_SEARCH_VISITED = "OMNITURE_KIOSK_SEARCH_VISITED";
// ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
//var UPDATE_NEEDED = "UPDATE_NEEDED";

// Subscription types
var SUBSCRIPTION_TYPE = "SUBSCRIPTION_TYPE";
var NO_SUBSCRIPTION = 0;     // user does not choose a free trial but decides to add a credit card
var FREE_TRIAL = 1;          // Indicates free trial; user automatically gets a subscription with DVD package
var DVD_SUBSCRIPTION = 2;    // monthly subscription with DVD package (no FT)
var BLURAY_SUBSCRIPTION = 3; // monthly subscription with BluRay package (no FT)
var STREAMING_ONLY = 4;      // streaming only subscription with no DVD or Blu-Ray credits. (no FT)

var SUBSCRIPTION_CARD_EXPIRED = "SUBSCRIPTION_CARD_EXPIRED";
var APP_LAUNCHED = 'APP_LAUNCHED';
var USER_START_DATE = "USER_START_DATE"; // Omniture

// // ZOE-32242: Moved this flag from jquery.keyboard.js
//var KeyboardOccurrenceFlag = false;

// ZOE-32241: limit #of entries in the back paths stack
var MAX_BACK_PATHS_LENGTH = 20;

var BLU_RAY = 'BLU-RAY';

// Constant to hold to keyboard population during keyboard complets its function
var KeyboardFocus = false;

// ZOE-32100 Surrogate customer ID for Conviva
var SURROGATE_CUSTOMER_ID = "SURROGATE_CUSTOMER_ID";

// Closed caption settings
var CAPTION_TEXT_FONT = 'CAPTION_TEXT_FONT';
var CAPTION_TEXT_SIZE = 'CAPTION_TEXT_SIZE';
var CAPTION_TEXT_COLOR = 'CAPTION_TEXT_COLOR';
var CAPTION_TEXT_OPACITY = 'CAPTION_TEXT_OPACITY';
var CAPTION_WINDOW_COLOR = 'CAPTION_WINDOW_COLOR';
var CAPTION_WINDOW_OPACITY = 'CAPTION_WINDOW_OPACITY';
var CAPTION_BACKGROUND_COLOR = 'CAPTION_BACKGROUND_COLOR';
var CAPTION_BACKGROUND_OPACITY = 'CAPTION_BACKGROUND_OPACITY';
var CAPTION_EDGE_STYLE = 'CAPTION_EDGE_STYLE';

// Text edge styles
var TEXT_EDGE_NONE = '0px 0px 0px #000';
var TEXT_EDGE_DEFAULT = '1px 1px 1px #000';  // small drop shadow
var TEXT_EDGE_RAISED = '2px 2px 5px #000';
var TEXT_EDGE_DEPRESSED = '-2px -2px 2px #000';
var TEXT_EDGE_UNIFORM = '0px 0px 5px #000';
var TEXT_EDGE_DROP_SHADOW = '5px 5px 5px #000';

// Default values for caption editor
var CAPTION_TEXT_SIZE_DEFAULT = 25;
var CAPTION_TEXT_COLOR_DEFAULT = '#ffffff';         // white
var CAPTION_TEXT_OPACITY_DEFAULT = 1.0;             // 100% opacity
var CAPTION_WINDOW_COLOR_DEFAULT = '#000000';       // black
var CAPTION_WINDOW_OPACITY_DEFAULT = 0.0;           // transparent
var CAPTION_BACKGROUND_COLOR_DEFAULT = '#000000';   // black
var CAPTION_BACKGROUND_OPACITY_DEFAULT = 0.0;       // transparent
var CAPTION_EDGE_STYLE_DEFAULT = TEXT_EDGE_DEFAULT; // small drop shadow

// Caption fonts by webfont Font family name defined in app.css, based on FCC mandated list
var CAPTION_FONT_DEFAULT = "default_font"; // abstract name removes specific font expectation. Device default
var CAPTION_FONT_MONO_SERIF = "mono_serif";
var CAPTION_FONT_SERIF = "_serif"; // _ stops reserved font-family name
var CAPTION_FONT_MONO_SANSERIF = "mono_sanserif";
var CAPTION_FONT_SANSERIF = "sanserif";
var CAPTION_FONT_CASUAL = "casual";
var CAPTION_FONT_CURSIVE = "_cursive"; // _ stops reserved font-family name
var CAPTION_FONT_SMALLCAPS = "smallcaps";

//password verification popup
var HEADER_TEXT = "Before You Continue";
var BODY_TEXT = "Please enter your account password.";
var FROM_NEW_ACCT = "FROM_NEW_ACCT";

// ZOE-35303: Need to store app version in local storage
var APP_VERSION = 'APP_VERSION';
