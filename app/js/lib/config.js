var hostName = "dev.redboxinstant.net";

var wtrealm = "urn:RBI:Web:DEV2";
var wreply = "https://"+hostName+"/rbproxy/login2";

RBI.Config = {
    proxyBase           : "http://"+hostName,
    proxyBaseSecure     : "https://"+hostName,
    olUrl               : "https://zoe-dit-dyn2.verizon.net/orch/zoetrope/",
    openApiOAuthUrl		: "http://dlb03redbox-2120579056.us-west-1.elb.amazonaws.com/",
    openApiOAuthClientId : "93040871d531b12b5d892d19fec2e0fa",
    licenseServerUrl    : "https://" + hostName + "/rbproxy/api/GetLicense",
    sessionShiftUrl     : "https://zoe-dit-dyn2.verizon.net/orch/session_shift/",
    loginUrl            : "https://dit-dmz.accessredbox.net/DIT-IdentityProvider-Encrypted/issue/wstrust/mixed/username",
    SSOConfig: {
        "action": "https://dit-dmz.accessredbox.net/DIT-IdentityProviderWeb/wsfed/issue",
        "wa": "wsignin1.0",
        "whr": "DITRedbox:e",
        "wtrealm": "https://redbox-rbi.accesscontrol.windows.net/",				// this is not a URN because the post is to IDM
        "wct": new Date().toISOString(),                                        // modified when used
        "wreply": "https://redbox-rbi.accesscontrol.windows.net/v2/wsfederation",
        "wctx": {
            "pr": "wsfederation",
            "rm": wtrealm,
            "ry": wreply,
            "cx": "?"													// this is the action that will be processed in login.jsp/login.jsp
        }
    },
    LogoutConfig: {
        "homePage": "/",
        "action": "https://dit-dmz.accessredbox.net/DIT-IdentityProviderWeb/wsfed/issue",
        "wa": "wsignout1.0",
        "whr": "DITRedbox:e",
        "wres": "",
        "wtrealm": wtrealm,
        "wctx": ",success=successfulLogout,failure=failedLogout",
        "wct": new Date().toISOString(),
        "wreply": "https://" + hostName + "/rbproxy/logout"
    },

    Cart: {
		maxItems: 5,
		maxGames: 2
    },

    Locations: {
        // The max number of pins to add to the map on the locations hub.
        maxMapKioskPinsToDisplay: 7
    },

    // link data 
    myAccountPage: "https://" + hostName + "/myAccount.html",
    termsOfUsePage: "http://www.redboxinstant.com/termsOfUse.html",
    privacyPolicyPage: "http://www22.verizon.com/about/privacy/",
    customerHelpSite: "http://redboxinstant.custhelp.com/",

    // filter data
    filterCategories: ["MovieFilters", "GameFilters", "TVFilters"],
    activeFilterCategories: ["MovieFilters", "GameFilters"],
    filterAttributes: ["Avilaiablity", "ContentRating", "Format", "Genre", "SpecialFilters", "UserRating"],

    // These may be combined by the client to get all homepage promos. 
    homePageTrialPromotionType: "homepage-trial",
    homePagePromotionTypes: "homepage-subscription,homepage-dvd,homepage-est,homepage-trial",
    // TODO - move this to platform config
    homePageRollingPromotionTypes: "homepage-subscription,homepage-dvd,homepage-est",

    // search defaults - general rules all platforms

    defaultSearchSpecialFilter: "Featured",                 // filter to show when browsing for first time. The default
    defaultSearchGenreFilter: "All",                        // filter to show when browsing for first time. The default
    defaultSearchSort: "ReleaseDate",                       // filter to show when browsing for first time. The default

    scrubberSmall: "208x116",
    scrubberMedium: "300x168,300x169",                      // default size is 300x168 but DIT env has bad data so it may not work
    scrubberLarge: "640x360",
    scrubberPreviewTime: "00:10:00",

    PII_IDM_ErrorCode: "RBXSTS-STS-007",
    PIIAcceptanceRequired: "PIIAcceptanceRequired"
};

RBI.Config.Defines = {};
RBI.Config.Defines.LOCAL = "local";
RBI.Config.Defines.DEV = "dev";
RBI.Config.Defines.DIT = "dit";
RBI.Config.Defines.SIT = "sit";
RBI.Config.Defines.STG = "stg";
RBI.Config.Defines.PROD = "prod";

RBI.Config.debug = true;
