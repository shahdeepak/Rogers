/* APP_ENVIRONMENT is variable used to identify weather app is running on Local Web Serevr on LG TV or This is running on Remote SERVER, For Remote change this to REMOTE*/
var APP_ENVIRONMENT = "LOCAL" ;

/* HOST_ENVIRONMENT is variable used to point specific server */
var HOST_ENVIRONMENT = "DIT_DYN2" ;

/* Default TIME OUT in milliseconds for network requests */
var REQUEST_TIME_OUT = 20000;

/* Default Error code */
var DEFAULT_ERROR_CODE = 100;

/* Auto scroll time interval in mili seconds */
var HOME_AUTO_SCROLL_TIME = 600;
HOME_AUTO_SCROLL_TIME_DELAY = 7000;
var HOME_IDLE_TIME_TOSTART_CALL = 7000;

var FILTTER_POPUP_MAGICREMOTE_SELECTION_DELAY = 500;

/* Application Exit  code */
var APPLICATION_EXIT_CODE = "103";

/* Application Exit  code */
var HOME_PAGE_KEY = "HOME_PAGE_KEY";

/* Application Exit  code */
var BROWSE_PAGE_KEY = "BROWSE_PAGE_KEY";

/* Application Exit  code */
var TITLE_DETAIL_PAGE_KEY = "TITLE_DETAIL_PAGE_KEY";

var ABOUT_YOU_PAGE_KEY = "ABOUT_YOU_PAGE_KEY";

var BILLING_INFO_PAGE_KEY = "BILLING_INFO_PAGE_KEY";


//search page key
var SEARCH_PAGE_KEY = "SEARCH_PAGE_KEY";

/*My Redbox page key*/
var MY_REDBOX_PAGE_KEY = "MYREDBOXPAGEKEY";

/* Application Exit  code */
var ACCOUNT_PAGE_KEY = "ACCOUNT_PAGE_KEY";

/* Application Software BUILD VERSION for more Clarification Refer Issue-VLGS-1024 */
var SOFTWARE_VERSION = "0.6.0.0";

/* Application Software Version BUILD DATE for more Clarification Refer Issue-VLGS-1024 */

/* Kiosk checkout page key */
var KIOSK_CHECKOUT_KEY = "KIOSK_CHECKOUT_KEY";
var SOFTWARE_UPDATE_DATE = "2013-1-10";

//kiosk key
var KIOSK_KEY = "KIOSK_KEY";

//error code to identify reserve product in kiosk checkout
var KIOSK_CHECKOUT_ERROR_CODE = "RBXAPI-RES-026";

//kiosk list key
var KIOSK_LIST_KEY = "KIOSK_LIST_KEY";

//Selected kisok puchase option
var SELECTED_KIOSK_PURCHASE_OPTION = "SELECTED_KIOSK_PURCHASE_OPTION";

//upgrade subscription key
var UPGRADE_SUB_PAGE_KEY = "UPGRADE_SUB_PAGE_KEY";

/* Location page key */
var LOCATION_PAGE_KEY = "LOCATION_PAGE_KEY";

var LOGIN_USERNAME = "USERNAME";
var LOGIN_PASSWORD = "PASSWORD";

var USER_DATA = {
FIRST_ELEMENT:"USERNAME",
SECOND_ELEMENT:"PASSWORD"
};

var OMNITURE_SUBSCRIPTION = {
   PAGE_LOAD_WITH_FREE_TRIAL : "pageLoad",
   PAGE_LOAD_WITHOUT_FREE_TRIAL : "pageLoadWithoutFreeTrail",
   START_WATCH_CLICK:"startWatchingClick",
   THUMBNAIL_CLICK:"thumbnailClick",
   SUBSCRIBE_CLICK:"subscribeClick",
   SHOW_MORE_CLICK:"linkClicked"
};

var OMNITURE_HOME = {
    PAGE_LOAD : "pageLoad",
    THUMBNAIL_CLICK: "event"
};


var OMNITURE_BROWSE = {
    PAGE_LOAD : "pageLoad",
    THUMBNAIL_CLICK: "thumbnailClicked" ,
    LINK_CLICK :"linkClicked",
    GENRE_CLICK:"genreClicked"
};