// RBI CommonJS, version: 2.0
(function initConfig() {
    "use strict";

    if (!window.RBI) {
        window.RBI = {};
    }
    
    // this is the default for commonjs. Change for your folder structure
    if (!RBI.commonjsAssetFolder) {
    	RBI.commonjsAssetFolder = "js/services";
    }

    var hostname = "dit.redboxinstant.net";
    var wtrealm = "urn:RBI:Web:DIT2";
    var wreply = "https://" + hostname + "/rbproxy/login2";
    var whr = "DITRedbox:e";
//    var hostname = "dev.redboxinstant.net";
//    var wtrealm = "urn:RBI:Web:DEV2";
//    var wreply = "https://"+hostname+"/rbproxy/login2";

    RBI.Config = {
        baseDomain: ".redboxinstant.net",
        proxyBase: "http://" + hostname,
        proxyBaseSecure: "https://" + hostname,
        
        olBase: "https://zoe-dit-dyn2.verizon.net/orch/zoetrope/",
        
        openApiUrl: "http://dlb03redbox-2120579056.us-west-1.elb.amazonaws.com:9930/",
        updateCreditCardUrl: "v5/customers/{CustomerPartnerNumber}/accounts/{accountNo}?access_token={TOKEN}",
        addCreditCardUrl: "v5/customers/{CustomerPartnerNumber}/creditcard?access_token={TOKEN}",
        
        licenseServerUrl: "https://" + hostname + "/rbproxy/api/GetLicense",
        sessionShiftUrl: "https://zoe-dit-dyn2.verizon.net/orch/session_shift?access_token={TOKEN}",
        loginUrl: "https://dit-dmz.accessredbox.net/DIT-IdentityProvider-Encrypted/issue/wstrust/mixed/username",
        loginUrl2: "https://" + hostname + "/rbproxy/issue/wstrust/mixed/username",
        loginErrorTranslate: "https://" + hostname + "/rbproxy/error/wstrust/parse",
        issueTokenUrl: "https://redbox-rbi.accesscontrol.windows.net/v2/wstrust/13/issuedtoken-symmetric",
        issueTokenUrl2: "https://" + hostname + "/rbproxy/v2/wstrust/13/issuedtoken-symmetric-ol",
        //issueTokenUrl: "https://com-redbox-authentication.accesscontrol.windows.net/v2/wstrust/13/issuedtoken-symmetric",
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
                // this is the action that will be processed in login.jsp/login.jsp
                // Need to double-encode. Otherwice IDM decodes string and treats it as additional parameters for login.
                "cx": "?" + encodeURIComponent(encodeURIComponent("deviceType=" + RBI.PlatformConfig.deviceType + "&transactionAccessPoint=" + RBI.PlatformConfig.transactionAccessPoint))
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
            "wreply": "https://" + hostname + "/rbproxy/logout"
        },

        Cart: {
            maxItems: 5,
            maxGames: 2
        },

        // link data 
        myAccountPage: "https://" + hostname + "/myAccount.html",
        termsOfUsePage: "http://www.redboxinstant.com/termsOfUse.html",
        privacyPolicyPage: "http://www22.verizon.com/about/privacy/",
        customerHelpSite: "http://redboxinstant.custhelp.com/",

        // filter data
        filterCategories: ["MovieFilters", "GameFilters", "TVFilters"],
        activeFilterCategories: ["MovieFilters", "GameFilters"],
        filterAttributes: ["Avilaiablity", "ContentRating", "Format", "Genre", "SpecialFilters", "UserRating"],

        // These may be combined by the client to get all homepage promos. 
        homePageTrialPromotionType: "homepage-trial",
        homePagePromotionTypes: "homepage-trial,homepage-subscription,homepage-est,homepage-dvd",
        // TODO - move this to platform config
        homePageRollingPromotionTypes: "homepage-subscription,homepage-est,homepage-dvd",

        // search defaults - general rules all platforms

        defaultSearchSpecialFilter: "Featured",                 // filter to show when browsing for first time. The default
        defaultSearchDeliveryTypeFilter: "All",                        // filter to show when browsing for first time. The default
        defaultSearchSort: "ReleaseDate",                       // filter to show when browsing for first time. The default
        defaultSearchSortDirection: "desc",                       // filter to show when browsing for first time. The default
        defaultSearchSortDS: "",                       // filter to show when browsing for first time for Digital Smith. The default - FYI: only when browsing on Special Filter
        defaultSearchSortDSDirection: "",                       // filter to show when browsing for first time for Digital Smith. The default - FYI: only when browsing on Special Filter
        defaultSearchFormat: "All",                       // filter to show when browsing for first time. The default
        defaultSearchRating: "All",                       // filter to show when browsing for first time. The default

        scrubberSmall: "208x116",
        scrubberMedium: "300x168",                              // default size is 300x168 but DIT env has bad data so it may not work
        scrubberLarge: "640x360",
        scrubberPreviewTime: "00:10:00",

        // start deprecation - DO NOT USE
        IDM_Start_Message_Tag: "<Message>",
        IDM_End_Message_Tag: "</Message>",
        LoginLimit_IDM_ErrorCode: "RBXSTS-STS-003",
        LoginError_IDM_ErrorCode: "RBXSTS-STS-004",
        LoginChanged_IDM_ErrorCode: "RBXSTS-STS-005",
        PII_IDM_ErrorCode: "RBXSTS-STS-007",
        PIIAcceptanceRequired: "PIIAcceptanceRequired",
        // end deprecation - DO NOT USE
        
        //xml request Files
        authIDMXmlRequestFilePath: RBI.commonjsAssetFolder + "/auth.xml",
        olXmlRequestFilePath: RBI.commonjsAssetFolder + "/olTemplate.xml",
        updateCardFilePath: RBI.commonjsAssetFolder + "/updateCreditCard.xml",
        addCardFilePath: RBI.commonjsAssetFolder + "/addCreditCard.xml"
    };


    RBI.Config.debug = true;
    RBI.Config.showVersion = true;

    RBI.Config.forceTransactionAccessPoint = true;
    RBI.Config.forceTransactionDeviceID = true;
    RBI.Config.forceWithCredentials = true;
    RBI.Config.ssoEnabled = false;

    RBI.Config.pluckCachingTime = 15; //this is the caching time for pluck API on browser and akamai in minutes

    // all defines below this line
    RBI.Config.Defines = {};
    RBI.Config.Defines.LOCAL = "local";
    RBI.Config.Defines.LOCALSTG = "local-stg";
    RBI.Config.Defines.DEV = "dev";
    RBI.Config.Defines.DIT = "dit";
    RBI.Config.Defines.SIT = "sit";
    RBI.Config.Defines.STG = "stg";
    RBI.Config.Defines.PROD = "prod";


    // these defines are for parsing results directly from IDM on login. Do not use if your endpoint
    // is at rbproxy
    RBI.Config.Defines.IDM_Start_Message_Tag = "<Message>";
    RBI.Config.Defines.IDM_End_Message_Tag = "</Message>";
    RBI.Config.Defines.LoginLimit_IDM_ErrorCode = "RBXSTS-STS-003";
    RBI.Config.Defines.LoginError_IDM_ErrorCode = "RBXSTS-STS-004";
    RBI.Config.Defines.LoginChanged_IDM_ErrorCode = "RBXSTS-STS-005";
    RBI.Config.Defines.PII_IDM_ErrorCode = "RBXSTS-STS-007";
    RBI.Config.Defines.PIIAcceptanceRequired = "PIIAcceptanceRequired";
    
    // verify email constants   
    RBI.Config.Defines.NEW_CUSTOMER = "RBXAPI-EML-001";  // user hasn't been registered before
    RBI.Config.Defines.RBC_CUSTOMER = "RBXAPI-EML-002";  // RBC customer (no PCN)
    RBI.Config.Defines.RBI_CUSTOMER = "RBXAPI-EML-003";  // existing customer with PCN (Free Trial wasn't used)
    RBI.Config.Defines.RBI_CUSTOMER_USED_FT = "RBXAPI-EML-004";   // existing customer with PCN (Free Trial was used)

    // TODO - KWC - we need to put this into some file that may be cached and/or replaced without deployment
    RBI.Config.Defines.MAGIC_EMAIL_DOMAINS = ["redbox.com", "redboxinstant.com", "verizon.com", "one.verizon.com",
                             "yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com",
                             "aol.com", "mac.com", "live.com", "comcast.net", "googlemail.com",
                             "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com", "verizon.net",
                             "sbcglobal.net", "att.net", "outlook.com"];
    
    RBI.Config.Defines.COMMON_JS_VERSION = "2.0";

    if (config.environment.toLowerCase() == RBI.Config.Defines.STG) {
        // STG config


        RBI.Config.debug = true;
        RBI.Config.showVersion = false;
        RBI.Config.env = RBI.Config.Defines.STG;
        RBI.Config.baseDomain = ".redboxinstant.net";

    var hostname = "stg.redboxinstant.net";
    var whr = "STGRedbox:e";
    var wtrealm = "urn:RBI:Web:STG2";
    var wreply = "https://"+hostname+"/rbproxy/login2";

    RBI.Config.proxyBase = "http://" + hostname;
    RBI.Config.proxyBaseSecure = "https://" + hostname;
    RBI.Config.olBase = "https://api-stg.redboxinstant.com/orch-stg1/zoetrope/";
    RBI.Config.openApiUrl = "http://redbox-np-stage3.lb.apidn.net/";
    //RBI.Config.openApiUrl = "https://stg3-api.accessredbox.net/";  // ZOE 26799: Use secure open API url for CC update
    
    // TODO - KWC - next two lines deprecated
    RBI.Config.openApiOAuthUrl = "http://redbox-np-stage3.lb.apidn.net/";
    RBI.Config.openApiOAuthClientId = "70b45b884a1cdd64be8cde1deb7227ff";

    RBI.Config.licenseServerUrl = RBI.Config.proxyBaseSecure + "/rbproxy/api/GetLicense";
    RBI.Config.sessionShiftUrl = "https://api-stg.redboxinstant.com/orch-stg1/session_shift?access_token={TOKEN}";
    RBI.Config.loginUrl = "https://stg-auth.accessredbox.net/IdentityProvider-Encrypted/issue/wstrust/mixed/username";
    RBI.Config.loginUrl2 = "https://" + hostname + "/rbproxy/issue/wstrust/mixed/username";
	RBI.Config.loginErrorTranslate = "https://" + hostname + "/rbproxy/error/wstrust/parse";

    RBI.Config.SSOConfig.action = "https://stg-auth.accessredbox.net/IdentityProvider-Encrypted/wsfed/issue";
    RBI.Config.SSOConfig.whr = whr;
    RBI.Config.SSOConfig.wreply = "https://redbox-rbi.accesscontrol.windows.net/v2/wsfederation";
    RBI.Config.SSOConfig.wctx.rm = wtrealm;
    RBI.Config.SSOConfig.wctx.ry = wreply;

        RBI.Config.LogoutConfig.action = "https://stg-auth.accessredbox.net/IdentityProvider-Encrypted/wsfed/issue";
        RBI.Config.LogoutConfig.whr = whr;
        RBI.Config.LogoutConfig.wtrealm = wtrealm;
        RBI.Config.LogoutConfig.wreply = "https://" + hostname + "/rbproxy/logout";

        RBI.Config.scrubberMedium = "300x168";

        RBI.Config.homePage = {
            moviesFilterName: "Top Subscription",
            carouselDelayMilliseconds: 7000
        };

        RBI.Config.clientId = RBI.PlatformConfig.clientIdSTG;
        RBI.Config.clientSecret = RBI.PlatformConfig.clientSecretSTG;

        RBI.Config.EndpointReferenceAddress = "https://redbox-rbi.accesscontrol.windows.net/";
        RBI.Config.forceTransactionAccessPoint = true;   // false;
        RBI.Config.forceTransactionDeviceID = true;
    }
    else if (config.environment.toLowerCase() == RBI.Config.Defines.PROD) {
        // PROD config
        RBI.Config.debug = false;
        RBI.Config.showVersion = false;
        RBI.Config.env = RBI.Config.Defines.PROD;
        RBI.Config.baseDomain = ".redboxinstant.com";

        var hostname = "www.redboxinstant.com";
        var whr = "Redbox";
        var wtrealm = "urn:RBI:Web:PROD2";


    RBI.Config.proxyBase = "http://" + hostname;
    RBI.Config.proxyBaseSecure = "https://" + hostname;
    RBI.Config.olBase = "https://api.redboxinstant.com/orch-prod1/zoetrope/";
    RBI.Config.openApiUrl = "https://api.redbox.com/";
    
    //Still STG data but properties are not used
    /*RBI.Config.olBase = "https://api-stg.redboxinstant.com/orch-stg1/zoetrope/"; */
	// TODO - KWC - the next two apis are deprecated
    RBI.Config.openApiOAuthUrl = "https://api.redbox.com/";
    RBI.Config.openApiOAuthClientId = "70b45b884a1cdd64be8cde1deb7227ff";

        RBI.Config.licenseServerUrl = RBI.Config.proxyBaseSecure + "/rbproxy/api/GetLicense";
        RBI.Config.sessionShiftUrl = "https://api.redboxinstant.com/orch-prod1/session_shift?access_token={TOKEN}";
        RBI.Config.loginUrl = "https://login.redbox.com/IdentityProvider/issue/wstrust/mixed/username";
        RBI.Config.loginUrl2 = "https://" + hostname + "/rbproxy/issue/wstrust/mixed/username";
        RBI.Config.loginErrorTranslate = "https://" + hostname + "/rbproxy/error/wstrust/parse";

        RBI.Config.SSOConfig.action = "https://login.redbox.com/IdentityProvider/wsfed/issue";
        RBI.Config.SSOConfig.whr = whr;
        RBI.Config.SSOConfig.wreply = "https://com-redbox-authentication.accesscontrol.windows.net/v2/wsfederation";
        RBI.Config.SSOConfig.wtrealm = "https://com-redbox-authentication.accesscontrol.windows.net/";
        RBI.Config.SSOConfig.wctx.rm = wtrealm;
        RBI.Config.SSOConfig.wctx.ry = "https://" + hostname + "/rbproxy/login2";
        RBI.Config.SSOConfig.wctx.cx = "?deviceType%253D" + RBI.PlatformConfig.deviceType;

        RBI.Config.LogoutConfig.action = "https://login.redbox.com/IdentityProvider/wsfed/issue";
        RBI.Config.LogoutConfig.whr = whr;
        RBI.Config.LogoutConfig.wtrealm = wtrealm;
        RBI.Config.LogoutConfig.wreply = "https://" + hostname + "/rbproxy/logout";

        RBI.Config.scrubberMedium = "320x168";

        RBI.Config.homePage = {
            moviesFilterName: "Top Subscription",
            carouselDelayMilliseconds: 7000
        };

        RBI.Config.clientId = RBI.PlatformConfig.clientIdPROD;
        RBI.Config.clientSecret = RBI.PlatformConfig.clientSecretPROD;

        RBI.Config.EndpointReferenceAddress = "https://com-redbox-authentication.accesscontrol.windows.net/";
        RBI.Config.forceTransactionAccessPoint = true;   // false;
        RBI.Config.forceTransactionDeviceID = true;
    }
    else if (config.environment.toLowerCase() == RBI.Config.Defines.SIT) {
        // SIT Config
        // SIT Config
        RBI.Config.debug = true;
        RBI.Config.showVersion = true;
        RBI.Config.env = RBI.Config.Defines.SIT;
        RBI.Config.baseDomain = ".redboxinstant.net";

        var hostname = "sit.redboxinstant.net";
        var whr = "SITRedbox:e";
        var wtrealm = "urn:RBI:Web:SIT2";


        RBI.Config.proxyBase = "http://" + hostname;
        RBI.Config.proxyBaseSecure = "https://" + hostname;
        RBI.Config.proxyXBOXOneAPISecure = "https://" + hostname;
        RBI.Config.olBase = "https://zoe-sit.verizon.net/orch/zoetrope/";
        RBI.Config.openApiUrl = "http://redbox-np-stage3.lb.apidn.net/";

        // TODO - KWC this is deprecated
        RBI.Config.openApiOAuthUrl = "http://redbox-np-stage3.lb.apidn.net/";

        RBI.Config.licenseServerUrl = RBI.Config.proxyBaseSecure + "/rbproxy/api/GetLicense";
        RBI.Config.sessionShiftUrl = "http://zoe-sit.verizon.net/orch/session_shift?access_token={TOKEN}";
        RBI.Config.loginUrl = "https://sit-dmz.accessredbox.net/IdentityProvider-Encrypted/issue/wstrust/mixed/username";
        RBI.Config.loginUrl2 = "https://" + hostname + "/rbproxy/issue/wstrust/mixed/username";
        RBI.Config.loginErrorTranslate = "https://" + hostname + "/rbproxy/error/wstrust/parse";

        RBI.Config.SSOConfig.action = "https://sit-dmz.accessredbox.net/IdentityProvider-Encrypted/wsfed/issue";
        RBI.Config.SSOConfig.whr = whr;
        RBI.Config.SSOConfig.wreply = "https://redbox-rbi.accesscontrol.windows.net/v2/wsfederation";
        RBI.Config.SSOConfig.wctx.rm = wtrealm;
        RBI.Config.SSOConfig.wctx.ry = "https://" + hostname + "/rbproxy/login2";

        RBI.Config.LogoutConfig.action = "https://sit-dmz.accessredbox.net/IdentityProvider-Encrypted/wsfed/issue";
        RBI.Config.LogoutConfig.whr = whr;
        RBI.Config.LogoutConfig.wtrealm = wtrealm;
        RBI.Config.LogoutConfig.wreply = "https://" + hostname + "/rbproxy/logout";




        RBI.Config.scrubberMedium = "300x168";

        RBI.Config.homePage = {
            moviesFilterName: "Top Subscription",
            carouselDelayMilliseconds: 7000
        };


        RBI.Config.clientId = RBI.PlatformConfig.clientIdSIT;
        RBI.Config.clientSecret = RBI.PlatformConfig.clientSecretSIT;

        RBI.Config.EndpointReferenceAddress = "https://redbox-rbi.accesscontrol.windows.net/";
        RBI.Config.forceTransactionAccessPoint = true;   // false;
        RBI.Config.forceTransactionDeviceID = true;
    }
}());


(function initExtensions() {
	"use strict";

if (!String.prototype.encodeHTML) {
  String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;');
  };
}

if (!String.prototype.decodeHTML) {
  String.prototype.decodeHTML = function () {
    return this.replace(/&quot;/g, '"')
               .replace(/&gt;/g, '>')
               .replace(/&lt;/g, '<')
               .replace(/&amp;/g, '&');
  };
}

// Adds string format function.
// From: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// Example of usage:
// "{0} is dead, but {1} is alive!".format("ASP", "ASP.NET")
if (!String.prototype.format) {
	String.prototype.format = function () {
		var arg, formatted = this;
		for (arg in arguments) {
			formatted = formatted.replace("{" + arg + "}", arguments[arg]);
		}
		return formatted;
	};
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Compatibility
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Compatibility
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		if (!this) {
			throw new TypeError();
		}
		var n, k, t = Object(this),
			len = t.length >>> 0;

		if (len === 0) {
			return -1;
		}
		n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}


//TODO: Added the params check to serialize only properties assigned in params  - Will need to integrate this in all requests
//Currently only integrated for productService _ getRecommendedProducts - this will allow us to use OLRequests for both RBProxy get requests as for OL post requests
window.serializeUrl = function(obj) {
    var p, str = [];
    if(obj.params){
        for (p in obj.params) {
            if (obj.params[p]) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj.params[p]));
            }
        }
    }else{
        for (p in obj) {
            if (obj[p]) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
    }

    return str.join("&");
};

if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) { return n < 10 ? '0' + n : n }
        return this.getUTCFullYear() + '-'
            + pad(this.getUTCMonth() + 1) + '-'
            + pad(this.getUTCDate()) + 'T'
            + pad(this.getUTCHours()) + ':'
            + pad(this.getUTCMinutes()) + ':'
            + pad(this.getUTCSeconds()) + 'Z';
    };
}

//Base 64 encoding/decoding functionality
window.Base64 = {
// private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

        }

        return output;
    },

// public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

// private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var n, utftext = "";

        for (n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

// private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = 0, c1 = 0, c2 = 0, c3 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
};
}());

(function initUtil() {
	"use strict";

RBI.ProxyErrorHandler = function () {
	if (RBI.ProxyErrorHandler.prototype._singletonInstance) {
		return RBI.ProxyErrorHandler.prototype._singletonInstance;
	}
	RBI.ProxyErrorHandler.prototype._singletonInstance = this;
};

RBI.ProxyErrorHandler.prototype.getErrorObject = function (errorResult) {
    var i;

    //When request get cancelled the errorResult will be empty so we have to return the empty response right away - was happening on WinJS
    if (!errorResult) {
        return errorResult;
    }


    // Angular.
    var responseJSON = errorResult.data;

    // TODO - KWC - delegate to transport.
    // WinJS
    if (errorResult.responseText || typeof errorResult === "string") {
        //when error coming back is string we will parse that otherwise if its the response Object we need to take the responseText from it
        var responseText = "";
        typeof errorResult === "string" ? responseText = errorResult : responseText = errorResult.responseText;
        try {
            responseJSON = JSON.parse(responseText);
        } catch (exception) {
        }
    }

        if (responseJSON) {
            return new RBI.Error(responseJSON.ResultInfo);
        }
        else if (errorResult.status != 0) {
            if (errorResult.status === 200) {
                return new RBI.Error({
                    "ResultCode": "TODO",
                    "ResultMessage": errorResult.responseText,
                    "Title": null,
                    "Description": null,
                    "PublicErrorCode": "TODO",
                    "Type": "TODO",
                    "HelpID": "TODO",
                    "ActivityID": "TODO",
                    "MachineID": "TODO"
                });
            } else {
                for (i = 0; i < RBI.Errors.length; i++) {
                    if (RBI.Errors[i].ErrorCode === errorResult.status) {
                        var error = RBI.Errors[i];
                        return new RBI.Error({
                            "ResultCode": errorResult.status,
                            "ResultMessage": errorResult.responseText,
                            "Title": error.Title,
                            "Description": error.Description,
                            "PublicErrorCode": error.PublicErrorCode,
                            "Type": error.Type,
                            "HelpID": error.HelpID,
                            "ActivityID": null,
                            "MachineID": null
                        });
                     }
                }
                // could not find match
                return new RBI.Error({
                    "ResultCode": errorResult.status,
                    "ResultMessage": errorResult.responseText,
                    "Title": null,
                    "Description": null,
                    "PublicErrorCode": "TODO",
                    "Type": "OK",
                    "HelpID": "TODO",
                    "ActivityID": null,
                    "MachineID": null
                });
            }
        }
        return errorResult;
    };

/*
 * This method takes a http status code that is non-200 received from OL or proxy and converts to
 * an error object
 * 
 * @param errorCode - the http status code
 * @return RBI.Error object
 */

RBI.ProxyErrorHandler.prototype.getErrorObjectForHttpError = function (errorCode) {

};
RBI.CartErrorHelper = {};

RBI.CartErrorHelper.processErrorDescription = function (errorResult) {
    if (errorResult && errorResult instanceof RBI.Error && errorResult.getResultCode() === "RBXAPI-RES-026") {
        var description = errorResult.getDescription();
        var message = errorResult.getResultMessage();

        var regExp = 'productRef=[';
        var mediaIdsStartIndex = message.substr(message.indexOf(regExp) + regExp.length);
        var mediaIdsEndIndex = mediaIdsStartIndex.indexOf(']');
        var mediaIdsString = mediaIdsStartIndex.substr(0, mediaIdsEndIndex);
        var mediaIds = mediaIdsString ? mediaIdsString.split(',') : [];
        var i, itemNames = [], hasMovie = false, hasGame = false;

        for (i in mediaIds) {
            mediaIds[i] = mediaIds[i].trim();
        }

        var cart = new RBI.Cart();
        var cartItems = cart.getItems();
        if (cartItems && cartItems.length) {
            for (i in cartItems) {
                var cartItem = cartItems[i];
                if (mediaIds.indexOf(cartItem.getPurchaseOptionId()) > -1) {
                    var product = cartItem.getProduct();
                    itemNames.push('"' + product.getTitle() + '"');

                    var productType = product.getProductType();

                    if (productType === RBI.Product.Defines.TYPE_GAME) {
                        hasGame = true;
                    } else if (productType === RBI.Product.Defines.TYPE_MOVIE) {
                        hasMovie = true;
                    } else {
                        throw "Unsupported product type in the cart: " + productType;
                    }
                }
            }
        }



        description = description.replace('[ItemNames]', itemNames.join(', ')); //Need space between each items
        description = description.replace(/\[HasOrHave\]/g, itemNames.length > 1 ? 'have' : 'has');
        description = description.replace(/\[ItOrThem\]/g, itemNames.length > 1 ? 'them' : 'it');
        description = description.replace(/\[MovieOrGame\]/g, (hasMovie && hasGame) ? 'Movie/Game' : hasMovie ? 'movie' : hasGame ? 'game' : '');

        errorResult.setDescription(description);
    }
}


RBI.Util = {};

RBI.Util.createCookie = function(name,value,days,domain) {
	var expires = "";
    var domainValue = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
        if(domain){
            domainValue = "; domain=" + domain;
        }
	}

	document.cookie = name+"="+value+expires+domainValue+"; path=/";
};

RBI.Util.readCookie = function(name) {
	var i, nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)===' ') {
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length,c.length);
		}
	}
	return null;
};

RBI.Util.eraseCookie = function(name) {
	RBI.Util.createCookie(name,"",-1);
};


/*
 * This is a callback function wrapper
 */
RBI.Util.callBackWrapper = function cbWrapper(fn, context) {
    return function() {
        try {
            return(fn.apply(context, arguments));
        } catch(e) {
            console.log(e);
            var myStackTrace = e.stack || e.stacktrace || "";
            console.log(myStackTrace);
        }
    };
};

/*
 * This is a callback function wrapper
 */
RBI.Util.getProtocolFromUrlString = function (urlString) {
    var urlSplitArray = urlString.split(':');
    if(urlSplitArray && urlSplitArray.length > 0){
        return urlSplitArray[0];
    }
    return null;
};

/**
 * Get the date exactly 1 year back
 * @return String representation of the Date
 */
function getDateFromYearBack() {
    var date = new Date();
    //substracting 364 days of the current date for edge cases in leap year
    date.setDate(date.getDate() - 364);
    return date.toISOString();
}


RBI.Util.extractValues = function(array, extractFunction) {
    var result = [];
    array.forEach(function (value) {
        result.push(extractFunction(value));
    });
    return result;
};

/**
 * Function to return the boolean value of a string
 * @param str
 * @return {*}
 */
RBI.Util.returnBoolean = function(str){
	var result;
    str = str ? str.toString().toLowerCase() : null;

    if(str==='true' || str==='1' || str==='yes' || str==='y' || str==='on' || str==='+'){
        result = true;
    }
    else if(str==='false' || str==='0' || str==='no' || str==='n' || str==='off' || str==='-'){
        result = false;
    }
	return result;
};

/**
 * Sort an array on a property name 
 */
RBI.Util.sortObject = function(arr, propname, desc)
{
    return arr.sort(function(a,b){
        if(desc)
        {
            if (a[propname] < b[propname]) {
				return 1;
			}
            if (a[propname] > b[propname]) {
				return -1;
			}
        }
        else
        {
            if (a[propname] < b[propname]) {
				return -1;
			}
            if (a[propname] > b[propname]) {
				return 1;
			}
        }
        return 0;
    });
};

RBI.Util.arrayContainsIgnoreCase = function (string) {
    var arrayContainsIgnoreCase = function (string) {
        var i = -1, found = false;
        for (i = 0; i < this.length; i++) {
            if (this[i].toLowerCase() === string.toLowerCase()) {
                found = true;
                break;
            }
        }

        return found;
    };
    return arrayContainsIgnoreCase.call(this, string);
};

RBI.Util.getiOSVersion = function () {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }else{
        return [0];
    }
};

var normalizeUrlRegexp = new RegExp('[ /?=_]');
RBI.Util.normalizeUrlString = function(str) {
    return str.split(normalizeUrlRegexp).join("-").toLowerCase().replace('&', 'and');
};

RBI.Util.inArray = function(val, array) {
    return array.indexOf(val) !== -1;
};
}());
(function initCookieStorage() {
	"use strict";
// uses this framework https://code.google.com/p/cookies/

RBI.CookieStorage = function () { };

RBI.CookieStorage.prototype.getItem = function(key) {
    return jaaulde.utils.cookies.get(key, { path: RBI.PersistenceDefines._COOKIE_PATH });
};

RBI.CookieStorage.prototype.setItem = function (key, value, params) {
    var cookieParameters = params;
    if (!cookieParameters) {
        cookieParameters = { path: RBI.PersistenceDefines._COOKIE_PATH };
    }
	jaaulde.utils.cookies.set(key, value, cookieParameters);
};

RBI.CookieStorage.prototype.removeItem = function(key) {
    jaaulde.utils.cookies.del(key);
};
}());
(function initObjectSerializer() {
	"use strict";

RBI.ObjectSerializer = function() {};

RBI.ObjectSerializer.prototype.serializeKiosks = function(kiosks) {
	var i, valuesArray = [];
	// If you need to change format, change first field from 0 to 1,... so we can support users with old and new format.
	var serializerVersion = 0;
	this.writeInt(valuesArray, serializerVersion);

	var kiosksLength = kiosks && kiosks.length ? kiosks.length : 0;
	this.writeInt(valuesArray, kiosksLength);

	if (kiosksLength) {
		for (i = 0; i < kiosksLength; i++) {
			var kiosk = kiosks[i];
			this.writeString(valuesArray, kiosk.address1);
			this.writeString(valuesArray, kiosk.address2);
			this.writeString(valuesArray, kiosk.city);
			this.writeString(valuesArray, kiosk.kioskId);
			this.writeString(valuesArray, kiosk.location);
			this.writeString(valuesArray, kiosk.state);
			this.writeString(valuesArray, kiosk.stateName);
			this.writeString(valuesArray, kiosk.status);
			this.writeString(valuesArray, kiosk.vendor);
			this.writeString(valuesArray, kiosk.zipcode);
		}
	}
	return valuesArray.join("|");
};

RBI.ObjectSerializer.prototype.deserializeKiosks = function(kiosksString) {
	var kiosks = [];
	if (kiosksString) {
		var valuesArray = kiosksString.split("|");

		var serializerVersion = this.readInt(valuesArray);
		if (serializerVersion !== 0) {
			throw new Error("Unsupported KiosksSerializer version: " + serializerVersion);
		}

		var kiosksLength = this.readInt(valuesArray);
		var i;
		for (i = 0; i < kiosksLength; i++) {
			var kiosk = {
				address1: this.readString(valuesArray),
				address2: this.readString(valuesArray),
				city: this.readString(valuesArray),
				kioskId: this.readString(valuesArray),
				location: this.readString(valuesArray),
				state: this.readString(valuesArray),
				stateName: this.readString(valuesArray),
				status: this.readString(valuesArray),
				vendor: this.readString(valuesArray),
				zipcode: this.readString(valuesArray)
			};
			kiosks.push(kiosk);
		}
	}
	return kiosks;
};

RBI.ObjectSerializer.prototype.serializeParentalControls = function(webParentalControls) {
	var valuesArray = [];
	// If you need to change format, change first field from 0 to 1,... so we can support users with old and new format.
	var serializerVersion = 0;
	this.writeInt(valuesArray, serializerVersion);

	if (webParentalControls) {
		this.writeString(valuesArray, webParentalControls.RestrictPurchases);
		var j, allowedRatings = webParentalControls.AllowedRatings;
		var allowedRatingsLength = allowedRatings && allowedRatings.length;
		this.writeInt(valuesArray, allowedRatingsLength);
		for (j = 0; j < allowedRatingsLength; j++) {
			this.writeString(valuesArray, allowedRatings[j]);
		}
	}

	return valuesArray.join("|");
};

RBI.ObjectSerializer.prototype.deserializeParentalControls = function(parentalControlsString) {
	var i, parentalControls = {};
	if (parentalControlsString) {
		var valueArray = parentalControlsString.split("|");

		var serializerVersion = this.readInt(valueArray);
		if (serializerVersion !== 0) {
			throw new Error("Unsupported ParentalControlsSerializer version: " + serializerVersion);
		}

		parentalControls.DeviceID = RBI.PlatformConfig.deviceId;
		parentalControls.RestrictPurchases  = this.readString(valueArray);
		parentalControls.AllowedRatings = [];

		var allowedRatingsLength = this.readInt(valueArray);
		for (i = 0; i < allowedRatingsLength; i++) {
			var rating = this.readString(valueArray);
			parentalControls.AllowedRatings.push(rating);
		}
	}

	return parentalControls;
};


RBI.ObjectSerializer.prototype.writeString = function(valueArray, strValue) {
	if (strValue === undefined || strValue === null) {
		valueArray.push(null);
	} else {
		var encodedValue = encodeURIComponent(strValue);
		valueArray.push(encodedValue);
	}
};

RBI.ObjectSerializer.prototype.readString = function(valueArray) {
	var rawValue = valueArray.shift();
	return decodeURIComponent(rawValue);
};

RBI.ObjectSerializer.prototype.writeInt = function(valueArray, intValue) {
	if (intValue === undefined || intValue === null) {
		valueArray.push(null);
	} else {
		valueArray.push(intValue);
	}
};

RBI.ObjectSerializer.prototype.readInt = function(valueArray) {
	var rawValue = valueArray.shift();
	return parseInt(rawValue);
};

RBI.ObjectSerializer.prototype.writeBoolean = function(valueArray, boolValue) {
	if (boolValue === undefined || boolValue === null) {
		valueArray.push(null);
	} else {
		valueArray.push(boolValue ? 1 : 0);
	}
};

RBI.ObjectSerializer.prototype.readBoolean = function(valueArray) {
	var rawValue = valueArray.shift();
	var value;
	if (rawValue === "") {
		value = null;
	} else if (rawValue === "0") {
		value = false;
	} else if (rawValue === "1") {
		value = true;
	} else {
		throw new Error("Cannot deserialize boolean value: " + rawValue);
	}
	return value;
};
}());
(function initPersistenceDefines() {
	"use strict";

// For details see:
// https://ctlabs.verizon.net/docs/display/Zoetrope/Website+Cookie+Details

RBI.PersistenceDefines = {
	"_COOKIE_PATH": "/",

    "_COOKIE_IS_LOGGED_IN_" : "isLoggedIn",
    "_COOKIE_IS_RBC_CUSTOMER_" :"isRbcCustomer",
    "_COOKIE_PROFILE_DISPLAY_NAME_" : "profileDisplayName",
    "_COOKIE_CREATE_CUSTOMER_FLOW_" : "inCreateCustomerFlow",
	"_COOKIE_LOGIN_ANALYTICS_EVENT" : "loginAnalyticsEvent",
    "_COOKIE_PCN_" : "pcn",
    "_COOKIE_USERZIPCODE_" : "userZipcode",
    "_COOKIE_SUB_PKG_ID_" :"subscriptionPackageId",
    "_COOKIE_SUB_ID_" :"subscriptionId",
    "_COOKIE_SUB_ANNIVERSARY_DATE_" :"subscriptionAnnivDate",
	// ??? We store whole JSON object here. Can be optimized. We actually need just several bits of data.
    "_COOKIE_PARENTAL_CONTROLS_" : "parentalControls",
    "_COOKIE_CREDITS_TOTAL_" : "creditsTotal",
    "_COOKIE_IN_FREE_TRIAL_" : "currentlyInFreeTrial",
    "_COOKIE_CURRENT_PRODUCT_TITLE_" : "currentProductTitle",
    "_COOKIE_SESSION_FILTERS_" : "sessionFilters",
	// ??? We store whole JSON object here with product details. Can be optimized.
    "_COOKIE_CART_" : "cart",
    //Config page - web console logging
    "_COOKIE_WEBCONSOLE_LOGGING_" : "webConsolLogs",
	// Skip Mobile splash.
    "_COOKIE_SKIP_SPLASH_" : "skipSplash",
    "_COOKIE_APP_DOWNLOADED_" : "appDownloaded",
	"_COOKIE_WELCOME_PAGE_SHOWN_" : "welcomePageShown",
	// Kiosk search history.
    "_COOKIE_KIOSK_SEARCH_" : "lastKioskSearch",
	// ??? Should we make this cookie more generic, like "previous page". May need it in some other cases.
    "_COOKIE_IS_CATEGORY_PAGE_" : "isCP",
    "_COOKIE_PREVIOUS_PAGE_" : "previousPage",
    "_COOKIE_CURRENT_KID_" : "currentKid",
	// ??? We store full kiosk info. Most probably can be optimized to have only KioskId and Title.
    "_COOKIE_RECENT_BROWSE_KIOSKS_" : "recentBrowseKiosks",
    "_COOKIE_REFERRAL_CODE_" : "refCode",
    "_COOKIE_DEFAULT_HEADER_HASHPATH_" : "defaultHeaderHashpath",
	"_COOKIE_IS_FREE_TRIAL_USED_": "isFreeTrialUsed",
	"_COOKIE_SHOW_START_TRIAL_" : "showStartTrial",
    "_COOKIE_OPEN_START_TRIAL_BANNER" : "openStartTrialBanner",
    "_COOKIE_SHOW_START_TRIAL_DISPLAYED_" : "showStartTrialDisplayed",
	"_COOKIE_DECIDE_LATER_" : "decideLater",

	// ??? Refactor? Used as a flag to show checkout screen after login. Probably author didn't know how to pass "callback action" into login flow.
    "_COOKIE_PERFORM_KIOSK_CHECKOUT_" : "kioskCheckout",
	// ??? Bad name, acutally it is flag: Do not show Blu-ray warning message (on add to cart).
    "_COOKIE_DO_NOT_SHOW_MESSAGE_" : "Donotshowmessage",
    "_COOKIE_INVALIDATECARDS_CACHE" : "invCardCache",
	// ??? Refactor. Some omniture events triggered right before page reload have to be postponed till next page load.
    "_COOKIE_SEND_OMNITURE_LOGIN_EVENT_ON_NEXT_PAGE_LOAD" : "sendOmnitureLoginEvtOnNextPageLoad",
    "_COOKIE_PLUCK" : "at",
	// ??? What is this?
    "_COOKIE_NOTIFYSUBFAIL" : "notifySubFail",
	// ??? What is this?
    "_COOKIE_NOTIFYSUBFAILPOPUPALREADYSHOWN" : "notifySubFailPopupAlreadyShown",
	// ??? Refactor to model. When user entered personal info on registration screen and pressed back button we save the info in the cookie to show it if user clicks register again.
    "_COOKIE_REGISTARTION_CACHE" : "registrationCache",
    "_COOKIE_GATEKEEPER_" : "GKAC",
	// This cookie hack is here for ZOE-10236
    "_COOKIE_HRL" : "hrl",
	// ??? Rename to AlreadyVisited. Sets to true on a first visit. So we can track when user opened web site for the first time.
	"_COOKIE_FIRST_VISIT_NAME" : "RBIFirstVisit",
	// cookie set by backend. It will be "success" or "failed". It is used to trigger to force UI to call rbproxy layer to get the user profile and credits
	"_COOKIE_LOGINSTATE" : "loginState",
	"_COOKIE_LOGINERROR" : "loginError",
	//Cookies needed for the checkout flow - Buy-Rent
	"_COOKIE_ONDEMAND_PRODUCTID" : "ondemandProductId",
	"_COOKIE_ONDEMAND_POID" : "ondemandPurchaseOptionId",
	//WCTX cookie
	"_COOKIE_WCTX_" : "wctx" ,

    //PLuck No Caching flags - when user does a rating or review we will need to get the latest data coming back from rbproxy
    "_PLUCK_REVIEWS_NO_CACHING_TIME_STARTED" : "pluckReviewsNoCachingTimeStarted",
    "_PLUCK_RATINGS_NO_CACHING_TIME_STARTED" : "pluckRatingsNoCachingTimeStarted"
};
}());
(function initPersistenceManager() {
	"use strict";

RBI.PersistenceManager = function() {
	if (RBI.PersistenceManager.prototype._singletonInstance) {
		return RBI.PersistenceManager.prototype._singletonInstance;
	}
	RBI.PersistenceManager.prototype._singletonInstance = this;

	this.objectSerializer = new RBI.ObjectSerializer();

	this.cookieStorage = new RBI.CookieStorage();
	// For now we use cookie as a local storage.
	// To switch implementation, update this line to something like this: 
	// this.localStorage = window.localStorage;
	this.localStorage = this.cookieStorage;
};

RBI.PersistenceManager.prototype.cookieStorage = null;
RBI.PersistenceManager.prototype.localStorage = null;
RBI.PersistenceManager.prototype.cookieDomain = null;

RBI.PersistenceManager.prototype.setCookieStorage = function(cookieStorage) {
	this.cookieStorage = cookieStorage;
};

RBI.PersistenceManager.prototype.getCookieStorage = function() {
    return this.cookieStorage;
};

RBI.PersistenceManager.prototype.setLocalStorage = function(localStorage) {
	this.localStorage = localStorage;
};

RBI.PersistenceManager.prototype.getLocalStorage = function() {
    return this.localStorage;
};

RBI.PersistenceManager.prototype.setCookieDomain = function(cookieDomain) {
	this.cookieDomain = cookieDomain;
};

RBI.PersistenceManager.prototype.getCookieDomain = function() {
	if (!this.cookieDomain) {
		// Clients can override the value in setCookieDomain(domain).
		// This code here for backward compatibility.
		var hostname = document.location.hostname;
		var indexOfDomain = hostname.indexOf(".") + 1;
		// Removing sub domain
		this.cookieDomain = hostname.substr(indexOfDomain, hostname.length);
	}
	return this.cookieDomain;
};

/*** CART DATA ***/
//Get all the cart Items that are present in the cart
RBI.PersistenceManager.prototype.getCartItems = function() {
    var cart = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CART_);
    if (cart && cart.products) {
		return cart.products;
    }
    return [];
};
//Get the cart object
RBI.PersistenceManager.prototype.getCart = function() {
    var cart = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CART_);
    return cart;
};
RBI.PersistenceManager.prototype.removeCartItems = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_CART_);
};
RBI.PersistenceManager.prototype.setCartItems = function(cartData) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_CART_,cartData);
};
//Get number of items that are currently stored in the cart 
RBI.PersistenceManager.prototype.getNumberCartItems = function()
{ 
    var cart = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CART_);
    if(cart){
    	return cart.products.length;
    }
    return 0;
};
RBI.PersistenceManager.prototype.isEmptyCart = function()
{
    return !!this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CART_);
};

/*** CONFIG DATA ***/

RBI.PersistenceManager.prototype.getWebConsoleLogging = function() {
    var webConsoleLogging = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_WEBCONSOLE_LOGGING_);
    return webConsoleLogging;
};



/*** CREDIT CARD DATA ***/ 
RBI.PersistenceManager.prototype.isInvalidateCardsCache = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_INVALIDATECARDS_CACHE);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removeInvalidateCardsCache = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_INVALIDATECARDS_CACHE);
};
RBI.PersistenceManager.prototype.setInvalidateCardsCache = function(invalidateCache) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_INVALIDATECARDS_CACHE, invalidateCache);
};


/*** KIOSK DATA ***/
RBI.PersistenceManager.prototype.setCurrentKioskIdCookie = function(kioskId) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_CURRENT_KID_, kioskId && kioskId.length > 0 ? kioskId : null);
};
RBI.PersistenceManager.prototype.getCurrentKioskIdCookie = function() {
    return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CURRENT_KID_);
};
RBI.PersistenceManager.prototype.removeCurrentKioskIdCookie = function() {
    this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_CURRENT_KID_);
};
RBI.PersistenceManager.prototype.setKioskSearchTermCookie = function(searchTerm) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_KIOSK_SEARCH_, searchTerm);
};
RBI.PersistenceManager.prototype.getKioskSearchTermCookie = function() {
    return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_KIOSK_SEARCH_);
};
RBI.PersistenceManager.prototype.removeKioskSearchTermCookie = function() {
    this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_KIOSK_SEARCH_);
};
RBI.PersistenceManager.prototype.getRecentBrowseKiosk = function() {
	var serializedKiosks = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_RECENT_BROWSE_KIOSKS_);
	return this.objectSerializer.deserializeKiosks(serializedKiosks);

//	var fRet = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_RECENT_BROWSE_KIOSKS_);
//
//
//	if (!fRet) {
//		fRet = [];
//	} else if(fRet.length>=2) {
//		fRet = fRet.reverse(); // To get Recent kiosk first
//	}
//	return fRet;
};
RBI.PersistenceManager.prototype.setRecentBrowseKiosk = function(kiosks) {
	var serializedKiosks = this.objectSerializer.serializeKiosks(kiosks);
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_RECENT_BROWSE_KIOSKS_, serializedKiosks);
//	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_RECENT_BROWSE_KIOSKS_, kiosks);
};
RBI.PersistenceManager.prototype.removeRecentBrowseKiosk = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_RECENT_BROWSE_KIOSKS_);
};

//setter for the current productTitle chosen when browsing kiosks
RBI.PersistenceManager.prototype.setCurrentProductTitle = function(productTitle)
{
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_CURRENT_PRODUCT_TITLE_, productTitle);
};

//getter for the current productTitle chosen when browsing kiosks
RBI.PersistenceManager.prototype.getCurrentProductTitle = function()
{ 
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CURRENT_PRODUCT_TITLE_);
};

RBI.PersistenceManager.prototype.removeKioskCount = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_KIOSKS_COUNT_);
};

/*** USER DATA ***/

RBI.PersistenceManager.prototype.getUserZipCode = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_USERZIPCODE_);
};

RBI.PersistenceManager.prototype.setUserZipCode = function(zip) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_USERZIPCODE_, zip);
};

RBI.PersistenceManager.prototype.removeUserZipCode = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_USERZIPCODE_);
};

RBI.PersistenceManager.prototype.isInCreateCustomerFlow = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CREATE_CUSTOMER_FLOW_);
};

RBI.PersistenceManager.prototype.setInCreateCustomerFlow = function(createCustomerFlow) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_CREATE_CUSTOMER_FLOW_, createCustomerFlow);
};

RBI.PersistenceManager.prototype.removeInCreateCustomerFlow = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_CREATE_CUSTOMER_FLOW_);
};

RBI.PersistenceManager.prototype.getProfileDisplayName = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_PROFILE_DISPLAY_NAME_);
};

RBI.PersistenceManager.prototype.setProfileDisplayName = function(profileDisplayName) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_PROFILE_DISPLAY_NAME_, profileDisplayName);
};

RBI.PersistenceManager.prototype.isRbcCustomer = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_IS_RBC_CUSTOMER_);
	return value ? true : false;
};

RBI.PersistenceManager.prototype.setRbcCustomer = function (rbcCustomer) {
    this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_IS_RBC_CUSTOMER_, rbcCustomer);
};

RBI.PersistenceManager.prototype.removeIsRbcCustomer = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_IS_RBC_CUSTOMER_);
};

RBI.PersistenceManager.prototype.getParentalControls = function() {
	var parentalControlsString = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_PARENTAL_CONTROLS_);
	var webParentalControls = $.parseJSON(parentalControlsString);
	return webParentalControls;
};

RBI.PersistenceManager.prototype.getCreditsTotal = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_CREDITS_TOTAL_);
};

/*** SUBSCRIPTION DATA ***/
RBI.PersistenceManager.prototype.isNotifySubscriptionFail = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_NOTIFYSUBFAIL);
	return value ? true : false;
};

RBI.PersistenceManager.prototype.isNotifySubscriptionFailPopupAlreadyShown = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_NOTIFYSUBFAILPOPUPALREADYSHOWN);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removeNotifySubscriptionFailPopupAlreadyShown = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_NOTIFYSUBFAILPOPUPALREADYSHOWN);
};
RBI.PersistenceManager.prototype.setNotifySubscriptionFailPopupAlreadyShown = function(isPopupShown) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_NOTIFYSUBFAILPOPUPALREADYSHOWN, isPopupShown);
};

RBI.PersistenceManager.prototype.getSubscriptionPackageId = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_SUB_PKG_ID_);
};

RBI.PersistenceManager.prototype.removeSubscriptionPackageId = function () {
    this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_SUB_PKG_ID_);
};

RBI.PersistenceManager.prototype.setSubscriptionPackageId = function (subscriptionPackageId) {
    this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_SUB_PKG_ID_, subscriptionPackageId);
};

RBI.PersistenceManager.prototype.getSubscriptionId = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_SUB_ID_);
};

RBI.PersistenceManager.prototype.getSubscriptionAnniversaryDate = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_SUB_ANNIVERSARY_DATE_);
};

RBI.PersistenceManager.prototype.isSubscribed = function() {
	return this.getSubscriptionPackageId() ? true : false;
};

RBI.PersistenceManager.prototype.isStartTrialBannerOpen = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_OPEN_START_TRIAL_BANNER);
	return value;
};
RBI.PersistenceManager.prototype.removeStartTrialBannerOpen = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_OPEN_START_TRIAL_BANNER);
};
RBI.PersistenceManager.prototype.setStartTrialBannerOpen = function(isStartTrialBannerOpen) {
	if (this.IsLoggedIn() || !isStartTrialBannerOpen) {
		this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_OPEN_START_TRIAL_BANNER, isStartTrialBannerOpen);
	} else {
		// when not logged in remove the flag so it does not carry into a logged in user state
		this.removeStartTrialBannerOpen();
	}
};

RBI.PersistenceManager.prototype.isFreeTrialUsed = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_IS_FREE_TRIAL_USED_);
	return value ? true : false;
};

RBI.PersistenceManager.prototype.isCurrentlyInFreeTrial = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_IN_FREE_TRIAL_);
	return value ? true : false;
};

RBI.PersistenceManager.prototype.isStartTrialDisplayed = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_SHOW_START_TRIAL_DISPLAYED_);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removeStartTrialDisplayed = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_SHOW_START_TRIAL_DISPLAYED_);
};
RBI.PersistenceManager.prototype.setStartTrialDisplayed = function(startTrialDisplayed) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_SHOW_START_TRIAL_DISPLAYED_, startTrialDisplayed);
};

RBI.PersistenceManager.prototype.isShowStartTrial = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_SHOW_START_TRIAL_);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removeShowStartTrial = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_SHOW_START_TRIAL_);
};
RBI.PersistenceManager.prototype.setShowStartTrial = function(showStartTrial) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_SHOW_START_TRIAL_, showStartTrial);
};

RBI.PersistenceManager.prototype.getPluckCookie = function() {
	return this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_PLUCK);
};

RBI.PersistenceManager.prototype.getRefCode = function() {
	return this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_REFERRAL_CODE_);
};
RBI.PersistenceManager.prototype.removeRefCode = function() {
	this.cookieStorage.removeItem(RBI.PersistenceDefines._COOKIE_REFERRAL_CODE_);
};
RBI.PersistenceManager.prototype.setRefCode = function(refCode) {
	var domainName = document.location.hostname.substring((document.location.hostname).indexOf('.'),document.location.hostname.length);
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_REFERRAL_CODE_, refCode, { path: '/', domain: domainName });
};

// We set this cookie on first visit in safari browser only to solve 3-rd party cookie issue with IDM. Talk to Stijn for details.
RBI.PersistenceManager.prototype.getFirstVisitCookie = function() {
	var value = this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_FIRST_VISIT_NAME);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removeFirstVisitCookie = function() {
	this.cookieStorage.removeItem(RBI.PersistenceDefines._COOKIE_FIRST_VISIT_NAME);
};
RBI.PersistenceManager.prototype.setFirstVisitCookie = function(userVisited) {
	var expiresInDays = 365 * 20;
	var expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + expiresInDays);
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_FIRST_VISIT_NAME, userVisited, {expiresAt : expirationDate});
};

RBI.PersistenceManager.prototype.isPreviousPageCategoryPage = function() {
	var value = this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_IS_CATEGORY_PAGE_);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removePreviousPageCategoryPage  = function() {
	this.cookieStorage.removeItem(RBI.PersistenceDefines._COOKIE_IS_CATEGORY_PAGE_);
};
RBI.PersistenceManager.prototype.setPreviousPageCategoryPage  = function(isCategoryPage) {
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_IS_CATEGORY_PAGE_, isCategoryPage, { path: '/', domain: "." + this.getCookieDomain() });
};
RBI.PersistenceManager.prototype.setPreviousPage  = function(previousPage) {
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_IS_CATEGORY_PAGE_, previousPage, { path: '/'});
};

RBI.PersistenceManager.prototype.getGateKeeperCookie = function() {
	return this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_GATEKEEPER_);
};

RBI.PersistenceManager.prototype.isSkipMobileSplash = function() {
	var value = this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_SKIP_SPLASH_);
	return value ? true : false;
};

RBI.PersistenceManager.prototype.setSkipMobileSplash = function(skipMobileSplash) {
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_SKIP_SPLASH_, skipMobileSplash, { path: '/', domain: "." + this.getCookieDomain() });
};

RBI.PersistenceManager.prototype.isWelcomePageShown = function() {
	var value = this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_WELCOME_PAGE_SHOWN_);
	return !!value;
};

RBI.PersistenceManager.prototype.setWelcomePageShown = function(welcomePageShown) {
	var expiresInDays = 365 * 20;
	var expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + expiresInDays);
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_WELCOME_PAGE_SHOWN_, welcomePageShown, {expiresAt : expirationDate});
};

RBI.PersistenceManager.prototype.isMobileAppDownloaded = function() {
	var value = this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_APP_DOWNLOADED_);
	return value ? true : false;
};

RBI.PersistenceManager.prototype.setMobileAppDownloaded = function(appDownloaded) {
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_APP_DOWNLOADED_, appDownloaded, { path: '/', domain: "." + this.getCookieDomain() });
};

RBI.PersistenceManager.prototype.isDoNotShowMessage = function() {
	var value = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_DO_NOT_SHOW_MESSAGE_);
	return value ? true : false;
};
RBI.PersistenceManager.prototype.removeDoNotShowMessage = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_DO_NOT_SHOW_MESSAGE_);
};
RBI.PersistenceManager.prototype.setDoNotShowMessage = function(doNotShowMessage) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_DO_NOT_SHOW_MESSAGE_, doNotShowMessage);
};

RBI.PersistenceManager.prototype.getSessionFilters = function() {
	return this.cookieStorage.getItem(RBI.PersistenceDefines._COOKIE_SESSION_FILTERS_);
};
RBI.PersistenceManager.prototype.removeSessionFilters = function() {
	this.cookieStorage.removeItem(RBI.PersistenceDefines._COOKIE_SESSION_FILTERS_);
};
RBI.PersistenceManager.prototype.setSessionFilters = function(sessionFilters) {
	var expirationDate = new Date();
	// Add 15 minutes.
	expirationDate.setTime(expirationDate.getTime() + 900000);
	console.log(sessionFilters);
	this.cookieStorage.setItem(RBI.PersistenceDefines._COOKIE_SESSION_FILTERS_, sessionFilters, {expiresAt : expirationDate});
};

RBI.PersistenceManager.prototype.getDefaultHeaderHashPath = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_DEFAULT_HEADER_HASHPATH_);
};
RBI.PersistenceManager.prototype.removeDefaultHeaderHashPath = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_DEFAULT_HEADER_HASHPATH_);
};
RBI.PersistenceManager.prototype.setDefaultHeaderHashPath = function(hashPath) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_DEFAULT_HEADER_HASHPATH_, hashPath);
};

RBI.PersistenceManager.prototype.isDecideLater = function() {
	var decideLater = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_DECIDE_LATER_);
	return decideLater ? true : false;
};
RBI.PersistenceManager.prototype.removeDecideLater = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_DECIDE_LATER_);
};
RBI.PersistenceManager.prototype.setDecideLater = function(decideLater) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_DECIDE_LATER_, decideLater);
};
//TODO - KWC - to be removed
RBI.PersistenceManager.prototype.getRegistrationCache = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_REGISTARTION_CACHE);
};
//TODO - KWC - to be removed
RBI.PersistenceManager.prototype.removeRegistrationCache = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_REGISTARTION_CACHE);
};
//TODO - KWC - to be removed
RBI.PersistenceManager.prototype.setRegistrationCache = function(registrationCache) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_REGISTARTION_CACHE, registrationCache);
};

RBI.PersistenceManager.prototype.IsLoggedIn = function() {
	var loggedIn = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_IS_LOGGED_IN_);
	return loggedIn ? true : false;
};

RBI.PersistenceManager.prototype.setLoggedIn = function (loggedIn) {
    this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_IS_LOGGED_IN_, loggedIn);
};

RBI.PersistenceManager.prototype.removeLoggedIn = function () {
    this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_IS_LOGGED_IN_);
};



/*** CHECKOUT DATA ***/
RBI.PersistenceManager.prototype.setPerformKioskCheckout = function(flag) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_PERFORM_KIOSK_CHECKOUT_, flag);
};
RBI.PersistenceManager.prototype.getPerformKioskCheckout = function() {
	var flag = this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_PERFORM_KIOSK_CHECKOUT_);
    var cartItemsCount = this.getNumberCartItems();
    return (cartItemsCount > 0 && flag) ? true : false;
};

RBI.PersistenceManager.prototype.setOnDemandProductId = function(productId) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_ONDEMAND_PRODUCTID, productId);
};
RBI.PersistenceManager.prototype.getOnDemandProductId = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_ONDEMAND_PRODUCTID);
};
RBI.PersistenceManager.prototype.deleteOnDemandProductId = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_ONDEMAND_PRODUCTID);
};
RBI.PersistenceManager.prototype.setOnDemandPurchaseOptionId = function(purchaseOptionId) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_ONDEMAND_POID, purchaseOptionId);
};
RBI.PersistenceManager.prototype.getOnDemandPurchaseOptionId = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_ONDEMAND_POID);
};
RBI.PersistenceManager.prototype.deleteOnDemandPurchaseOptionId = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_ONDEMAND_POID);
};

/*** ANALYTICS DATA***/
RBI.PersistenceManager.prototype.getAnalyticsOmnitureLoginEventNextPageLoad = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_SEND_OMNITURE_LOGIN_EVENT_ON_NEXT_PAGE_LOAD);
};
RBI.PersistenceManager.prototype.setAnalyticsOmnitureLoginEventNextPageLoad = function(value) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_SEND_OMNITURE_LOGIN_EVENT_ON_NEXT_PAGE_LOAD,value);
};
RBI.PersistenceManager.prototype.deleteAnalyticsOmnitureLoginEventNextPageLoad = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_SEND_OMNITURE_LOGIN_EVENT_ON_NEXT_PAGE_LOAD);
};

/*** SECURITY DATA ***/

//this cookie hack is here for ZOE-10236. Basically IE will put the hidden login iframe in browser back history. We cannot avoid this...
//so as the user is switching pages we do not keep calling the hidden iframe. In order to track this we need a cookie. 

RBI.PersistenceManager.prototype.removeCookieLoginAnalyticsEvent = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_LOGIN_ANALYTICS_EVENT);
};

RBI.PersistenceManager.prototype.getCookieLoginAnalyticsEvent = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_LOGIN_ANALYTICS_EVENT);
};

RBI.PersistenceManager.prototype.setCookieLoginAnalyticsEvent = function(value) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_LOGIN_ANALYTICS_EVENT,value);
};

RBI.PersistenceManager.prototype.removeCookiePcn = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_PCN_);
};

RBI.PersistenceManager.prototype.getCookiePcn = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_PCN_);
};

RBI.PersistenceManager.prototype.setCookiePcn = function(value) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_PCN_,value);
};

RBI.PersistenceManager.prototype.removeCookieRenderedHiddenLoginFrame = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_HRL);
};

RBI.PersistenceManager.prototype.getHasRenderedHiddenLogin = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_HRL) === true;
};

RBI.PersistenceManager.prototype.setHasRenderedHiddenLogin = function(value) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_HRL,value);
};

RBI.PersistenceManager.prototype.getLoginState = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_LOGINSTATE);
};

RBI.PersistenceManager.prototype.removeLoginState = function() {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_LOGINSTATE);
};

RBI.PersistenceManager.prototype.getLoginError = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_LOGINERROR);
};

RBI.PersistenceManager.prototype.removeLoginError = function() {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_LOGINERROR);
};
/*** WCTX cookie ***/
RBI.PersistenceManager.prototype.getWctxCookie = function() {
	return this.localStorage.getItem(RBI.PersistenceDefines._COOKIE_WCTX_);
};

RBI.PersistenceManager.prototype.setWctxCookie = function(wctx) {
	this.localStorage.setItem(RBI.PersistenceDefines._COOKIE_WCTX_, wctx);
};

RBI.PersistenceManager.prototype.removeWctxCookie = function() {
	this.localStorage.removeItem(RBI.PersistenceDefines._COOKIE_WCTX_);
};

/*** Pluck No Caching flags ***/

RBI.PersistenceManager.prototype.isPluckReviewsNoCaching = function() {
    var startTime = this.getPluckReviewsNoCachingStartTime();
    var noCaching = false;
    if(startTime){
        var currentTime = new Date().getTime();
        var oldTimeElapsed = new Date(new Date(startTime).getTime() + (RBI.Config.pluckCachingTime *60000)).getTime();
        if((currentTime - oldTimeElapsed) < 0){
            noCaching  = true;
        }else{
             this.removePluckReviewsNoCachingStartTime();
        }
    }
    return noCaching;
};

RBI.PersistenceManager.prototype.getPluckReviewsNoCachingStartTime = function() {
    return this.localStorage.getItem(RBI.PersistenceDefines._PLUCK_REVIEWS_NO_CACHING_TIME_STARTED);
};

RBI.PersistenceManager.prototype.setPluckReviewsNoCachingStartTime = function(time) {
    this.localStorage.setItem(RBI.PersistenceDefines._PLUCK_REVIEWS_NO_CACHING_TIME_STARTED, time);
};

RBI.PersistenceManager.prototype.removePluckReviewsNoCachingStartTime = function() {
    this.localStorage.removeItem(RBI.PersistenceDefines._PLUCK_REVIEWS_NO_CACHING_TIME_STARTED);
};

RBI.PersistenceManager.prototype.isPluckRatingsNoCaching = function() {
    var startTime = this.getPluckRatingsNoCachingStartTime();
    var noCaching = false;
    if(startTime){
        var currentTime = new Date().getTime();
        var oldTimeElapsed = new Date(new Date(startTime).getTime() + (RBI.Config.pluckCachingTime *60000)).getTime();
        if((currentTime - oldTimeElapsed) < 0){
            noCaching  = true;
        }else{
            this.removePluckRatingsNoCachingStartTime();
        }
    }
    return noCaching;
};

RBI.PersistenceManager.prototype.getPluckRatingsNoCachingStartTime = function() {
    return this.localStorage.getItem(RBI.PersistenceDefines._PLUCK_RATINGS_NO_CACHING_TIME_STARTED);
};

RBI.PersistenceManager.prototype.setPluckRatingsNoCachingStartTime = function(time) {
    this.localStorage.setItem(RBI.PersistenceDefines._PLUCK_RATINGS_NO_CACHING_TIME_STARTED, time);
};

RBI.PersistenceManager.prototype.removePluckRatingsNoCachingStartTime = function() {
    this.localStorage.removeItem(RBI.PersistenceDefines._PLUCK_RATINGS_NO_CACHING_TIME_STARTED);
};


}());

(function initDispatcher() {
	"use strict";

/**
* @author Erik Karlsson, www.nonobtrusive.com
* @author Kevin Clark, www.objsoft.com  
* 	Modified with comments from post - http://www.nonobtrusive.com/2009/07/24/custom-events-in-javascript-by-making-your-own-dispatcher-class/
*   Modified to add context to add listener and when calling back
*/
function Dispatcher(){
	this.events=[];
}
window.Dispatcher = Dispatcher;

Dispatcher.prototype.addEventlistener=function(event,callback,context){
	this.events[event] = this.events[event] || [];
	if ( this.events[event] ) {
		this.events[event].unshift({
			callback : callback,
			context : context
		});
	}
};
Dispatcher.prototype.removeEventlistener=function(event,callback){
	if ( this.events[event] ) {
		var i, listeners = this.events[event];
		for (i = listeners.length-1; i>=0; --i){
			if ( listeners[i].callback === callback ) {
				listeners.splice( i, 1 );
				return true;
			}
		}
	}
	return false;
};

Dispatcher.prototype.canDispatch = function(event){
	var listeners = this.events[event];
	return listeners && listeners.length;
};

Dispatcher.prototype.dispatch = function(event, data){
	
	if(this.events[event])
	{
		var listeners = this.events[event];
		var len = listeners.length;

		while(len--)
		{
            var args = [];
            if(data !== undefined) {
                // Convert data parameter to array.
            	args = Array.isArray(data) ? data : [data];
            }
            // args.push(listeners[len].context);

			listeners[len].callback.apply(listeners[len].context, args);
		}
	}
};

/** Below is some test-code to verify the most basic functionality **/
//function SomeClass(){
//	Dispatcher.call(this);
//}
//SomeClass.prototype = new Dispatcher();
// 
//SomeClass.prototype.sendSomeEvent=function(){
//	this.dispatch("test", {});
//};
// 
//var foo = new SomeClass();
//foo.addEventlistener( "test", function(){ alert("bah"); }, foo );
//foo.sendSomeEvent();

RBI.DispatcherRegistry = function(){
	if (RBI.DispatcherRegistry.prototype._singletonInstance) {
		return RBI.DispatcherRegistry.prototype._singletonInstance;
	}
	RBI.DispatcherRegistry.prototype._singletonInstance = this;
	Dispatcher.call(this);
};

RBI.DispatcherRegistry.prototype = new Dispatcher();

//function SomeClass() {
//	
//}
//
//SomeClass.prototype.handleFunction = function() { alert("bah"); };
//var foo = new SomeClass();
//
//var dispatcherRegistry = new DispatcherRegistry();
//dispatcherRegistry.addEventlistener( "test", foo.handleFunction, foo );
//dispatcherRegistry.dispatch("test", {});

window.RBIDispatcherRegistry = new RBI.DispatcherRegistry();
}());
(function initEvents() {
	"use strict";

// Core events, used by all clients.
// Can be overridden or extended in events-X.js, where X is a platform.

RBI.Events = {
	Core: {}
};

RBI.Events.Login = "RBI.Events.Core.Login";
RBI.Events.Logout = "RBI.Events.Core.Logout";
RBI.Events.Subscribe = "RBI.Events.Core.Subscribe";


// VOD/EST events
RBI.Events.VOD = {};
RBI.Events.EST = {};
RBI.Events.VOD.Purchase = "RBI.Events.Core.VOD.Purchase";
RBI.Events.EST.Purchase = "RBI.Events.Core.EST.Purchase";

// Kiosk events
RBI.Events.Kiosk = {};
RBI.Events.Kiosk.Reservation = "RBI.Events.Core.Kiosk.Reservation";

// Subscription events
RBI.Events.StartWatching = "RBI.Events.Core.StartWatching";
RBI.Events.CompleteWatching = "RBI.Events.Core.CompleteWatching";

// Account related
RBI.Events.Account = {};
RBI.Events.Account.Purchase = {};

// platform specific events
RBI.Events.Interaction = {};

// Rent, Purchase, kiosk reserved
RBI.Events.Account.Purchase.CheckoutMoviePurchased = "RBI.Events.Account.Purchase.CheckoutMoviePurchased";
RBI.Events.Account.Purchase.CheckoutMovieRented = "RBI.Events.Account.Purchase.CheckoutMovieRented";
RBI.Events.Account.Purchase.CheckoutMovieReserved = "RBI.Events.Account.Purchase.CheckoutMovieReserved";
RBI.Events.Account.Purchase.CheckoutMovieReservedCredits = "RBI.Events.Account.Purchase.CheckoutMovieReservedCredits";

// Watch events
RBI.Events.StartWatching = "RBI.Events.StartWatching";
RBI.Events.CompleteWatching = "RBI.Events.CompleteWatching";
RBI.Events.PlaybackResumed = "RBI.Events.PlaybackResumed";
RBI.Events.PlaybackPaused = "RBI.Events.PlaybackPaused";
RBI.Events.PlaybackInfo = "RBI.Events.PlaybackInfo";

RBI.Events.Account.UseAllCredits = "RBI.Events.UseAllCredits";
RBI.Events.Account.BookmarkAdded = "RBI.Events.BookmarkAdded";
RBI.Events.Account.BookmarkRemoved = "RBI.Events.BookmarkRemoved";
}());
/**
 * UUID.js: The RFC-compliant UUID generator for JavaScript.
 *
 * @fileOverview
 * @author  LiosK
 * @version 3.2 beta
 * @license The MIT License: Copyright (c) 2010 LiosK.
 */

// Core Component {{{

/** @constructor */
function UUID() {}

/**
 * The simplest function to get an UUID string.
 * @returns {string} A version 4 UUID string.
 */
UUID.generate = function() {
  var rand = UUID._getRandomInt, hex = UUID._hexAligner;
  return  hex(rand(32), 8)          // time_low
        + "-"
        + hex(rand(16), 4)          // time_mid
        + "-"
        + hex(0x4000 | rand(12), 4) // time_hi_and_version
        + "-"
        + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
        + "-"
        + hex(rand(48), 12);        // node
};

/**
 * Returns an unsigned x-bit random integer.
 * @param {int} x A positive integer ranging from 0 to 53, inclusive.
 * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
 */
UUID._getRandomInt = function(x) {
  if (x <   0) return NaN;
  if (x <= 30) return (0 | Math.random() * (1 <<      x));
  if (x <= 53) return (0 | Math.random() * (1 <<     30))
                    + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
  return NaN;
};

/**
 * Returns a function that converts an integer to a zero-filled string.
 * @param {int} radix
 * @returns {function(num&#44; length)}
 */
UUID._getIntAligner = function(radix) {
  return function(num, length) {
    var hex = num.toString(radix), i = length - hex.length, z = "0";
    for (; i > 0; i >>>= 1, z += z) { if (i & 1) { hex = z + hex; } }
    return hex;
  };
};

UUID._hexAligner = UUID._getIntAligner(16);

// }}}

// UUID Object Component {{{

/**
 * Names of each UUID field.
 * @type string[]
 * @constant
 * @since 3.0
 */
UUID.FIELD_NAMES = ["timeLow", "timeMid", "timeHiAndVersion",
                    "clockSeqHiAndReserved", "clockSeqLow", "node"];

/**
 * Sizes of each UUID field.
 * @type int[]
 * @constant
 * @since 3.0
 */
UUID.FIELD_SIZES = [32, 16, 16, 8, 8, 48];

/**
 * Generates a version 4 {@link UUID}.
 * @returns {UUID} A version 4 {@link UUID} object.
 * @since 3.0
 */
UUID.genV4 = function() {
  var rand = UUID._getRandomInt;
  return new UUID()._init(rand(32), rand(16), // time_low time_mid
                          0x4000 | rand(12),  // time_hi_and_version
                          0x80   | rand(6),   // clock_seq_hi_and_reserved
                          rand(8), rand(48)); // clock_seq_low node
};

/**
 * Converts hexadecimal UUID string to an {@link UUID} object.
 * @param {string} strId UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
 * @returns {UUID} {@link UUID} object or null.
 * @since 3.0
 */
UUID.parse = function(strId) {
  var r, p = /^(?:urn:uuid:|\{)?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{2})([0-9a-f]{2})-([0-9a-f]{12})(?:\})?$/i;
  if (r = p.exec(strId)) {
    return new UUID()._init(parseInt(r[1], 16), parseInt(r[2], 16),
                            parseInt(r[3], 16), parseInt(r[4], 16),
                            parseInt(r[5], 16), parseInt(r[6], 16));
  } else {
    return null;
  }
};

/**
 * Initializes {@link UUID} object.
 * @param {uint32} [timeLow=0] time_low field (octet 0-3).
 * @param {uint16} [timeMid=0] time_mid field (octet 4-5).
 * @param {uint16} [timeHiAndVersion=0] time_hi_and_version field (octet 6-7).
 * @param {uint8} [clockSeqHiAndReserved=0] clock_seq_hi_and_reserved field (octet 8).
 * @param {uint8} [clockSeqLow=0] clock_seq_low field (octet 9).
 * @param {uint48} [node=0] node field (octet 10-15).
 * @returns {UUID} this.
 */
UUID.prototype._init = function() {
  var names = UUID.FIELD_NAMES, sizes = UUID.FIELD_SIZES;
  var bin = UUID._binAligner, hex = UUID._hexAligner;

  /**
   * List of UUID field values (as integer values).
   * @type int[]
   */
  this.intFields = new Array(6);

  /**
   * List of UUID field values (as binary bit string values).
   * @type string[]
   */
  this.bitFields = new Array(6);

  /**
   * List of UUID field values (as hexadecimal string values).
   * @type string[]
   */
  this.hexFields = new Array(6);

  for (var i = 0; i < 6; i++) {
    var intValue = parseInt(arguments[i] || 0);
    this.intFields[i] = this.intFields[names[i]] = intValue;
    this.bitFields[i] = this.bitFields[names[i]] = bin(intValue, sizes[i]);
    this.hexFields[i] = this.hexFields[names[i]] = hex(intValue, sizes[i] / 4);
  }

  /**
   * UUID version number defined in RFC 4122.
   * @type int
   */
  this.version = (this.intFields.timeHiAndVersion >> 12) & 0xF;

  /**
   * 128-bit binary bit string representation.
   * @type string
   */
  this.bitString = this.bitFields.join("");

  /**
   * UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
   * @type string
   */
  this.hexString = this.hexFields[0] + "-" + this.hexFields[1] + "-" + this.hexFields[2]
                 + "-" + this.hexFields[3] + this.hexFields[4] + "-" + this.hexFields[5];

  /**
   * UUID string representation as a URN ("urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
   * @type string
   */
  this.urn = "urn:uuid:" + this.hexString;

  return this;
};

UUID._binAligner = UUID._getIntAligner(2);

/**
 * Returns UUID string representation.
 * @returns {string} {@link UUID#hexString}.
 */
UUID.prototype.toString = function() { return this.hexString; };

/**
 * Tests if two {@link UUID} objects are equal.
 * @param {UUID} uuid
 * @returns {bool} True if two {@link UUID} objects are equal.
 */
UUID.prototype.equals = function(uuid) {
  if (!(uuid instanceof UUID)) { return false; }
  for (var i = 0; i < 6; i++) {
    if (this.intFields[i] !== uuid.intFields[i]) { return false; }
  }
  return true;
};

// }}}

// UUID Version 1 Component {{{

/**
 * Generates a version 1 {@link UUID}.
 * @returns {UUID} A version 1 {@link UUID} object.
 * @since 3.0
 */
UUID.genV1 = function() {
  var now = new Date().getTime(), st = UUID._state;
  if (now != st.timestamp) {
    if (now < st.timestamp) { st.sequence++; }
    st.timestamp = now;
    st.tick = UUID._getRandomInt(4);
  } else if (Math.random() < UUID._tsRatio && st.tick < 9984) {
    // advance the timestamp fraction at a probability
    // to compensate for the low timestamp resolution
    st.tick += 1 + UUID._getRandomInt(4);
  } else {
    st.sequence++;
  }

  // format time fields
  var tf = UUID._getTimeFieldValues(st.timestamp);
  var tl = tf.low + st.tick;
  var thav = (tf.hi & 0xFFF) | 0x1000;  // set version '0001'

  // format clock sequence
  st.sequence &= 0x3FFF;
  var cshar = (st.sequence >>> 8) | 0x80; // set variant '10'
  var csl = st.sequence & 0xFF;

  return new UUID()._init(tl, tf.mid, thav, cshar, csl, st.node);
};

/**
 * Re-initializes version 1 UUID state.
 * @since 3.0
 */
UUID.resetState = function() {
  UUID._state = new UUID._state.constructor();
};

/**
 * Probability to advance the timestamp fraction: the ratio of tick movements to sequence increments.
 * @type float
 */
UUID._tsRatio = 1 / 4;

/**
 * Persistent state for UUID version 1.
 * @type UUIDState
 */
UUID._state = new function UUIDState() {
  var rand = UUID._getRandomInt;
  this.timestamp = 0;
  this.sequence = rand(14);
  this.node = (rand(8) | 1) * 0x10000000000 + rand(40); // set multicast bit '1'
  this.tick = rand(4);  // timestamp fraction smaller than a millisecond
};

/**
 * @param {Date|int} time ECMAScript Date Object or milliseconds from 1970-01-01.
 * @returns {object}
 */
UUID._getTimeFieldValues = function(time) {
  var ts = time - Date.UTC(1582, 9, 15);
  var hm = ((ts / 0x100000000) * 10000) & 0xFFFFFFF;
  return  { low: ((ts & 0xFFFFFFF) * 10000) % 0x100000000,
            mid: hm & 0xFFFF, hi: hm >>> 16, timestamp: ts };
};

// }}}

// Backward Compatibility Component {{{

/**
 * Reinstalls {@link UUID.generate} method to emulate the interface of UUID.js version 2.x.
 * @since 3.1
 * @deprecated Version 2.x. compatible interface is not recommended.
 */
UUID.makeBackwardCompatible = function() {
  var f = UUID.generate;
  UUID.generate = function(o) {
    return (o && o.version == 1) ? UUID.genV1().hexString : f.call(UUID);
  };
  UUID.makeBackwardCompatible = function() {};
};

// }}}

// vim: et ts=2 sw=2 fdm=marker fmr&

(function initAccountModel() {
	"use strict";
RBI.Errors = [

    {
        "ErrorCode": 500,
        "Title": "Sorry",
        "Description": "We're having some problems with our system. If this problem continues, please contact customer service via Contact Us on our Help Center.",
        "Type": "OK",
        "PublicErrorCode": 225,
        "HelpID": 461
    },
    {
        "ErrorCode": 503,
        "Title": "Sorry",
        "Description": "We're having some problems with our system. If this problem continues, please contact customer service via Contact Us on our Help Center.",
        "Type": "OK",
        "PublicErrorCode": 225,
        "HelpID": 461
    },
    {
        "ErrorCode": 510,
        "Title": "Sorry",
        "Description": "Your email or password is incorrect. Please try again.",
        "Type": "OK",
        "PublicErrorCode": 225,
        "HelpID": 461
    },
    {
        "ErrorCode": "RBXSTS-STS-004",
        "Title": "Sorry",
        "Description": "Your email or password is incorrect. Please try again.",
        "Type": "OK",
        "PublicErrorCode": 225,
        "HelpID": 461
    }

];
}());
(function initTransport() {
	"use strict";

/*
 * Define the generic singleton transport
 *
 * @author Kevin Clark   monster910@hotmail.com
 */
RBI.Transport = function () {
	if (RBI.Transport.prototype._singletonInstance) {
		return RBI.Transport.prototype._singletonInstance;
	}
	RBI.Transport.prototype._singletonInstance = this;
};

/*
 * Get a url with current timestamp param
 */
RBI.Transport.getTimeStampedUrl = function (url) {
    var timeStampParam = new Date().getTime();
    if(url.indexOf("?") == -1){
        url = url + "?_=" + timeStampParam;
    }else{
        url = url + "&_=" + timeStampParam;
    }
    return url;
};

/*
 * Parse response headers
 */
RBI.Transport.getResponseHeaders = function (response) {
    var headers = response.getAllResponseHeaders();
    var lines = headers.split("\r\n");
    var map = {};
    for (var i = 0; i < lines.length; i++) {
        var pieces = lines[i].split(": ");
        if (pieces.length == 2)
            map[pieces[0]] = pieces[1];
    }
    return map;
};

RBI.Transport.isContentTypeEqual = function (responseHeaders, contentType) {
	return responseHeaders["Content-Type"] && responseHeaders["Content-Type"].indexOf(contentType) !== -1;	
};
}());
(function initAccountModel() {
	"use strict";

RBI.UserProfile = function (username, password) {
	this.username = username;
	this.password = password;
	this.isLoggedInValue = false;
};
RBI.UserProfile.prototype.getUserName = function () {
	return this.username;
};
RBI.UserProfile.prototype.getPassword = function () {
	return this.password;
};
RBI.UserProfile.prototype.isLoggedIn = function () {
	return this.isLoggedInValue;
};
RBI.UserProfile.prototype.setIsLoggedIn = function (state) {
	this.isLoggedInValue = state;
};

/*
 * Account Model
 *
 * Model object for Account. The constructor takes one argument:
 * @param value - the JSON of the Account object.
 */
RBI.Account = function(value)  {
	this.value = value;
	this.postConstruct && this.postConstruct();
};

/**
 * Get The Type of this AccountNumber
 * @return AccountNumber for the account.
 */
RBI.Account.prototype.getAccountNumber = function () {
	return this.value.AccountNumber;
};
RBI.Account.prototype.getAVSChecked = function () {
    var AVSChecked = false;
    if(this.value.AVSChecked != null){
       AVSChecked = (this.value.AVSChecked.toLowerCase() == "true")? true:false;
    }
    return AVSChecked;
};
RBI.Account.prototype.getAccountAlias = function () {
	return this.value.AccountAlias;
};
RBI.Account.prototype.getAccountBillingAddress = function () {
	return this.value.AccountBillingAddress;
};
RBI.Account.prototype.getCVVChecked = function () {
    var CVVChecked = false;
    if (this.value.CVVChecked != null) {
        CVVChecked = (this.value.CVVChecked.toLowerCase() == "true")? true:false;
    }
    return CVVChecked;
};
RBI.Account.prototype.getExpirationMonth = function () {
	return this.value.ExpirationMonth;
};
RBI.Account.prototype.getExpirationYear = function () {
	return this.value.ExpirationYear;
};
RBI.Account.prototype.getFirstName = function () {
	return this.value.FirstName;
};
RBI.Account.prototype.getFreeTrialUsed = function () {
	return this.value.FreeTrialUsed;
};
RBI.Account.prototype.isExpired = function () {
	return this.value.IsExpired;   // Boolean
};
RBI.Account.prototype.isPreferred = function () {
    var isPreferred = false;
    if (this.value.IsPreferred != null) {
        isPreferred = (this.value.IsPreferred.toLowerCase() == "true")? true:false;
    }
    return isPreferred;
};
RBI.Account.prototype.getIsSubscriptionPrimary = function () {
    var isSubscriptionPrimary = false;
    if (this.value.IsSubscriptionPrimary != null) {
        isSubscriptionPrimary = (this.value.IsSubscriptionPrimary.toLowerCase() == "true")? true:false;
    }
    return isSubscriptionPrimary;
};
RBI.Account.prototype.isValid = function () {
	return this.value.IsValid;    // Boolean
};
RBI.Account.prototype.getLastFour = function () {
	return this.value.LastFour;
};
RBI.Account.prototype.getLastName = function () {
	return this.value.LastName;
};
RBI.Account.prototype.getExpirationMonth = function () {
	return this.value.ExpirationMonth;
};
RBI.Account.prototype.getExpirationYear = function () {
	return this.value.ExpirationYear;
};

RBI.CardsData = function(accounts)  {
	this.accounts = accounts;
};
RBI.CardsData.prototype.getAccounts = function () {
	return this.accounts;
};

RBI.CardsData.prototype.getPrimaryAccount = function () {
	var i, account;
	for (i in this.accounts) {
		account = this.accounts[i];
        // If primary and valid (not expired,...).
		if (account.isPreferred()) {
            if (!account.isValid()) {
			    account = null;
            }
            break;
		}
	}
	return account;
};

RBI.CardsData.prototype.getAccountsForSubscription = function () {
    if (!this.accountsForSubscription) {
        this.accountsForSubscription = [];
        var i, account, subscriptionAccount = null;
        for (i in this.accounts) {
            account = this.accounts[i];
            // If primary and valid (not expired,...).
            if (account.getIsSubscriptionPrimary()) {
                subscriptionAccount = account;
            } else {
                this.accountsForSubscription.push(account);
            }
        }
        if (subscriptionAccount) {
            this.accountsForSubscription = [subscriptionAccount].concat(this.accountsForSubscription);
        } else if (this.getPrimaryAccount()) {
            this.accountsForSubscription = this.getAccountsForKiosk();
        }
    }
    return this.accountsForSubscription;
};

RBI.CardsData.prototype.getAccountsForKiosk = function () {
    if (!this.accountsForKiosk) {
        this.accountsForKiosk = [];
        var i, account, kioskAccount = null;
        for (i in this.accounts) {
            account = this.accounts[i];
            // If primary and valid (not expired,...).
            if (account.isPreferred()) {
                kioskAccount = account;
            } else {
                this.accountsForKiosk.push(account);
            }
        }
        if (kioskAccount) {
            this.accountsForKiosk = [kioskAccount].concat(this.accountsForKiosk);
        } else if (this.getSubscriptionAccount()) {
            this.accountsForSubscription = this.getAccountsForSubscription();
        }
    }
    return this.accountsForKiosk;
};

RBI.CardsData.prototype.getSubscriptionAccount = function () {
	var account;
	for (var i in this.accounts) {
		account = this.accounts[i];
		if (account.getIsSubscriptionPrimary()) {
			return account;
		}
	}
	return null;
};

RBI.CardsData.prototype.getValidAccounts = function() {
    var validAccounts = [];

    for (var i = 0; i < this.accounts.length;i++) {
        if (this.accounts[i].isValid()) {
            validAccounts.push(this.accounts[i]);
        }
    }
    return validAccounts;
};

RBI.CardsData.prototype.hasValidAccounts = function() {
	return this.getValidAccounts().length > 0;
};

RBI.CardsData.prototype.getAccountByAlias = function(alias) {
	var account;
	for (var i in this.accounts) {
		account = this.accounts[i];
		if (account.getAccountAlias() == alias) {
			return account;
		}
	}
	return null;
};

}());
(function initCartModel() {
    "use strict";


/**
 * Shopping cart model.
 * @constructor
 */
RBI.Cart = function() {
	// Cart is a singleton.
    if (RBI.Cart.prototype._singletonInstance) {
		return RBI.Cart.prototype._singletonInstance;
	}
	RBI.Cart.prototype._singletonInstance = this;

	// Expects that application has already bootstrapped reservation service with valid configuration and transport layer.
	this.reservationService = new RBI.ReservationService();
	this.productService = new RBI.ProductService();

	// TODO: Read initial state from cookie/storage.
};

RBI.Cart.prototype.items = [];
RBI.Cart.prototype.pricing = null;
RBI.Cart.prototype.kioskId = null;
// We send this to OL in get pricing call.
RBI.Cart.prototype.applyCredits = null;

RBI.Cart.prototype.getItems = function() {
    return this.items;
};

RBI.Cart.prototype.isEmpty = function () {
    return !this.items || !this.items.length;
};

RBI.Cart.prototype.getProducts = function () {
    var i, product, products = [];
    for (i in this.items) {
        product = this.items[i].product;
        // TODO: if product === null - load it.
        products.push(product);
    }
    return products;
};

/**
 * Returns instance of RBI.KioskCartPricing.
 */
RBI.Cart.prototype.getPricing = function() {
	return this.pricing;
};


RBI.Cart.prototype.getKioskId = function () {
    return this.kioskId;
};

RBI.Cart.prototype.setKioskId = function (kioskId) {
    this.kioskId = kioskId;
};


/**
 * Client sets this to let OL know that user wants to apply credits.
 */
RBI.Cart.prototype.setApplyCredits = function(applyCredits) {
	this.applyCredits = applyCredits;
};
RBI.Cart.prototype.isApplyCredits = function() {
	return this.applyCredits;
};

// TODO: Error codes (constants) for failure callback, so client code can understand what was the problem.
// TODO: Error message.
RBI.Cart.prototype.addProduct = function(product, purchaseOptionId, successCbk, failureCbk) {
	var self = this;

	this.canAddProduct(product, purchaseOptionId, function() {
		var newCartItem = new RBI.CartItem(product, purchaseOptionId);

		// If get Pricing call fails, the item will be removed from cart.
		self.items.push(newCartItem);

		// Recalculate cart price.
		self.recalculatePrice(function(kioskCartPricing) {
				// TODO: Implement success call back (create cart items, price,...).

				successCbk(kioskCartPricing);
			},
			function(errorData) {
				// Recalculate price failed - remove just added element from cart (most probably it is not available any more).
				self.removeByPurchaseOptionId(purchaseOptionId, null, null, true);
				failureCbk(errorData);
		});
	}, failureCbk);
};

RBI.Cart.prototype.getItemsByType = function(productType) {
	var i, filteredItems = [];
	for (i in this.items) {
		if (this.items[i].type === productType) {
			filteredItems.push(this.items[i]);
		}
	}
	return filteredItems;
};

/**
 * Recalculates cart items price (makes call to server side).
 * @param successCbk
 * @param failureCbk
 */
RBI.Cart.prototype.recalculatePrice = function(successCbk, failureCbk) {
	var self = this;

	self.pricing = null;

	var purchaseOptionIds = this.getPurchaseOptionIds();
	if (purchaseOptionIds && purchaseOptionIds.length) {
	    var request = new RBI.GetKioskCartPricingRequest();
	    request.ApplyCredits = self.isApplyCredits();
	    request.KioskID = this.kioskId;
	    request.PurchaseOptionIDs = purchaseOptionIds;

	    self.reservationService.getKioskCartPricing(request, function (kioskCartPricing) {
	        var i, j, totalCreditsUsedCount, cartPricingItem,
			cartPricingItems = kioskCartPricing.getItems();
	        self.pricing = kioskCartPricing;

	        totalCreditsUsedCount = 0;
	        for (i in cartPricingItems) {
	            cartPricingItem = cartPricingItems[i];

	            // If the discount (e.g. -1.2) + the price is 0, a credit is being used.
	            // Check for 0.009 - if difference is less than one cent - we assume numbers the same.
	            var isCreditApplied = Math.abs(parseFloat(cartPricingItem.value.Discount) + parseFloat(cartPricingItem.value.Price)) < 0.009;
	            if (isCreditApplied) {
	                totalCreditsUsedCount += 1;
	            }
	        }
	        self.pricing.totalCreditsUsedCount = totalCreditsUsedCount;

	        // Match cart items with pricing items
	        // (not sure if ol always sends price items in the same response as we they are listed in request).
	        for (i in self.items) {
	            var cartItem = self.items[i];
	            cartItem.setPricing(null);

	            for (j in cartPricingItems) {
	                cartPricingItem = cartPricingItems[j];
	                if (cartItem.getPurchaseOptionId() === cartPricingItem.getPurchaseOptionId()) {
	                    cartItem.setPricing(cartPricingItem);
	                    break;
	                }
	            }
//	             if (!cartItem.getPricing()) {
//	                throw new Error("Got price from server for item which is not in the cart.");
//	            }
	        }

	        if (successCbk) {
	            successCbk(kioskCartPricing);
	        }
	    }, function failure(result) {
	        RBI.CartErrorHelper.processErrorDescription(result);
			if (failureCbk) {
				failureCbk(result);
			}
			return result;
		});
	} else {
		this.pricing = new RBI.KioskCartPricing({});
		if (successCbk) {
			successCbk();
		}
	}
};

/**
 * Checks if user can add a product to the cart (product is not empty, cart is not full, ...).
 * Client can invoke the method and check result (boolean) or pass success and failure callback to get error code / message also.
 * @param product - to be added.
 * @param purchaseOptionId - of the product.
 * @param successCbk - will be invoked if can add.
 * @param failureCbk - will be invoked if can not add.
 * @returns {boolean} - true if can add.
 */
RBI.Cart.prototype.canAddProduct = function(product, purchaseOptionId, successCbk, failureCbk) {
	if (!product) {
		// TODO: failure with invalid parameter message.
		failureCbk();
		return false;
	}

	if (this.getByPurchaseOptionId(purchaseOptionId)) {
		failureCbk(new RBI.Error({"ResultMessage": "Media already exists in the Cart"}));
		return false;
	}

	// Check max cart items count (current 5).
	if (this.items.length >= RBI.Config.Cart.maxItems) {
		failureCbk(new RBI.Error({"ResultMessage": "Cart is full"}));
		return false;
	}

	// Check max games count (current 2)
	if (product.getDeliveryType() === RBI.Product.TYPE_GAME && this.getItemsByType(RBI.Product.TYPE_GAME).length >= RBI.Config.Cart.maxGames) {
		failureCbk(new RBI.Error({"ResultMessage": "Can't be add more than 2 Games"}));
		return false;
	}

	successCbk();
	return true;
};

RBI.Cart.prototype.performReservation = function (userCardAccount, successCbk, failureCbk) {
	var self = this,
    	performKioskReservationRequest = new RBI.PerformKioskReservationRequest(this.kioskId, this.applyCredits, userCardAccount, this.getPurchaseOptionIds());

    return this.reservationService.performKioskReservation(performKioskReservationRequest, function (reservationResponse) {
        successCbk(reservationResponse);
		self.clear();
	}, function (response) {
        failureCbk(response);
    });
};

RBI.Cart.prototype.getByPurchaseOptionId = function(purchaseOptionId) {
	var i, item = null;
	for (i in this.items) {
		if (this.items[i].purchaseOptionId === purchaseOptionId) {
			item = this.items[i];
			break;
		}
	}
	return item;
};

RBI.Cart.prototype.getPurchaseOptionIds = function() {
	var i, purchaseOptionIds = [];
	for (i in this.items) {
		purchaseOptionIds.push(this.items[i].purchaseOptionId);
	}
	return purchaseOptionIds;
};

RBI.Cart.prototype.hasProductsWithRating = function(rating) {
    var i, result = false;
    for (i = 0; !result && i < this.items.length; i++) {
        result = this.items[i].product.getRating() === rating;
    }
    return result;
};

RBI.Cart.prototype.clear = function() {
	// Do not want to instantiate new array, to be sure all local (client) variables also updated.
	this.items.length = 0;
	this.recalculatePrice(null, null);
};

RBI.Cart.prototype.removeByPurchaseOptionId = function(purchaseOptionId, successCbk, failureCbk, skipPriceRecalculation) {
	var i, self = this, removedItem = null;
	for (i in this.items) {
		if (this.items[i].purchaseOptionId === purchaseOptionId) {
			removedItem = this.items[i];
			this.items.splice(i, 1);
			break;
		}
	}

	if (!removedItem) {
		// TODO: What if not found?
	    if (failureCbk) {
	        failureCbk();
	    }
	}

	if (!skipPriceRecalculation) {
		// Recalculate cart price.
		self.recalculatePrice(successCbk, failureCbk);
	} else {
	    if (successCbk) {
	        successCbk();
	    }
	}
};

RBI.Cart.prototype.findDoubleFeature = function(successCbk, failureCbk) {
	var self = this;

	// Double feature is enabled only for cart with one item in it.
	if (self.items.length === 1) {
		var productId = self.items[0].getProductId();

		// TODO: Pass image types as a parameter.
		var imageTypes = null;
		var request = new RBI.RecommendedProductRequest();
        request.setImageTypes(imageTypes);
        request.setKioskID(self.kioskId);
        request.setNumberOfResults(1);
        request.setProductID(productId);
		self.productService.getRecommendedProducts(request, function(recommendedProductsModelResponse) {
            var products = recommendedProductsModelResponse.getRecommendedProducts();
			if (products.length > 0) {
				// This object doesn't have purchase options, so need to make get product details call.
				var doubleFeatureDetailsRequest = new RBI.ProductDetailsRequest(products[0].getProductID());
                doubleFeatureDetailsRequest.setKioskID(self.kioskId);
				self.productService.getProductDetails(doubleFeatureDetailsRequest, function(productDetails) {
					successCbk(productDetails);
				}, function(response) {
					failureCbk(response);
				});
			} else {
				successCbk(null);
			}
		}, failureCbk);
	} else {
		// No Double feature, return null. No need to use failure callback here.
		successCbk(null);
	}
};

RBI.Cart.prototype.addDoubleFeature = function(product, successCbk, failureCbk) {
	var self = this;

	var cartItems = self.getItems();
	if (cartItems.length === 1) {
		var existingCartItem = cartItems[0];
		console.log(existingCartItem);
		var format = existingCartItem.getFormat();

		var purchaseOption = product.getPurchaseOptionForDeliveryTypeAndMediaFormat(RBI.Product.Defines.DELIVERY_TYPE_KIOSK, format);
		self.addProduct(product, purchaseOption.getPurchaseOptionID(), successCbk, failureCbk);
	} else {
		// TODO: We can add double feature only when cart has one element.
		failureCbk();
	}
};

/**
 * Cart Item model.
 * @constructor
 */
RBI.CartItem = function(product, purchaseOptionId) {
    this.product = product;
    this.type = product.getDeliveryType();
	this.productId = product.getProductID();
	this.purchaseOptionId = purchaseOptionId;
	this.productTitle = product.getTitle();
	this.image = product.getThumbnailImage();

	this.format = product.getPurchaseOptionForPurchaseOptionId(purchaseOptionId).getMediaFormat();
	this.rating = product.getRating();
};

// See RBI.Product.Defines.TYPE_X constants
RBI.CartItem.prototype.type = null;
RBI.CartItem.prototype.productId = null;
RBI.CartItem.prototype.purchaseOptionId = null;
RBI.CartItem.prototype.productTitle = null;
RBI.CartItem.prototype.image = null;
// See RBI.Product.Defines.MEDIA_FORMAT_TYPE_X constants
RBI.CartItem.prototype.format = null;
RBI.CartItem.prototype.rating = null; // TODO: Define rating enum: "R", "PG13", ...

RBI.CartItem.prototype.pricing = null;

RBI.CartItem.prototype.getProduct = function() {
	return this.product;
};

RBI.CartItem.prototype.getType = function() {
	return this.type;
};

RBI.CartItem.prototype.getProductId = function() {
	return this.productId;
};
RBI.CartItem.prototype.getPurchaseOptionId = function() {
	return this.purchaseOptionId;
};

RBI.CartItem.prototype.getTitle = function() {
	return this.productTitle;
};

RBI.CartItem.prototype.getImage = function() {
	return this.image;
};

RBI.CartItem.prototype.getFormat = function() {
	return this.format;
};

RBI.CartItem.prototype.getRating = function() {
	return this.rating;
};
RBI.CartItem.prototype.getPricing = function() {
	return this.pricing;
};
RBI.CartItem.prototype.setPricing = function(pricing) {
	this.pricing = pricing;
};
}());
(function initCreditCardModel() {
	"use strict";

    RBI.CreditCard = function(value) {
        this.value = value || {};
    };

    /*
     * This method will take an account object and convert to this model
     * @see RBI.Account model
     */
    RBI.CreditCard.prototype.createFromAccount = function(account) {
        this.value = account.value;
    };
    
    RBI.CreditCard.prototype.getAccountNumber = function() {
        return this.value["AccountNumber"]?this.value["AccountNumber"]:"";
    };
    RBI.CreditCard.prototype.setAccountNumber = function(accountNumber) {
        this.value["AccountNumber"] = accountNumber;
    };  
    RBI.CreditCard.prototype.getAccountAlias = function() {
        return this.value["AccountAlias"]?this.value["AccountAlias"]:"";
    };
    RBI.CreditCard.prototype.setAccountAlias = function(alias) {
        this.value["AccountAlias"] = alias;
    };    
    RBI.CreditCard.prototype.getCvv = function() {
        return this.value["CVV"]?this.value["CVV"]:"";
    };
    RBI.CreditCard.prototype.setCvv = function(cvv) {
        this.value["CVV"] = cvv;
    };
    RBI.CreditCard.prototype.getAccountBillingAddress = function() {
    	if (!this.value["AccountBillingAddress"]) {
    		this.value["AccountBillingAddress"] = {};
    	}
        return this.value["AccountBillingAddress"];
    };     
    RBI.CreditCard.prototype.getAddress1 = function() {
    	return this.getAccountBillingAddress()["StreetAddressLine1"]?this.getAccountBillingAddress()["StreetAddressLine1"]:"";
    };
    RBI.CreditCard.prototype.setAddress1 = function(address1) {
    	this.getAccountBillingAddress()["StreetAddressLine1"] = address1;
    };
    RBI.CreditCard.prototype.getAddress2 = function() {
        return this.getAccountBillingAddress()["StreetAddressLine2"]?this.getAccountBillingAddress()["StreetAddressLine2"]:"";
    };
    RBI.CreditCard.prototype.setAddress2 = function(address2) {
    	this.getAccountBillingAddress()["StreetAddressLine2"] = address2;
    };
    RBI.CreditCard.prototype.getCity = function() {
        return this.getAccountBillingAddress()["City"]?this.getAccountBillingAddress()["City"]:"";
    };
    RBI.CreditCard.prototype.setCity = function(city) {
    	this.getAccountBillingAddress().City = city;
    };
    RBI.CreditCard.prototype.getState = function() {
        return this.getAccountBillingAddress()["State"]?this.getAccountBillingAddress()["State"]:"";
    };
    RBI.CreditCard.prototype.setState = function(state) {
    	this.getAccountBillingAddress()["State"] = state;
    };
    // used on add card api
    RBI.CreditCard.prototype.getZip = function() {
        return this.value["Zip"]?this.value["Zip"]:"";
    };
    RBI.CreditCard.prototype.setZip = function(zip) {
        this.value["Zip"] = zip;
    };    
    RBI.CreditCard.prototype.getZipPostalCode = function() {
        return this.getAccountBillingAddress()["ZipPostalCode"]?this.getAccountBillingAddress()["ZipPostalCode"]:"";
    };
    RBI.CreditCard.prototype.setZipPostalCode = function(zip) {
    	this.getAccountBillingAddress()["ZipPostalCode"] = zip;
    };    
    RBI.CreditCard.prototype.getExpirationMonth = function() {
        return this.value["ExpirationMonth"]?this.value["ExpirationMonth"]:"";
    };
    RBI.CreditCard.prototype.setExpirationMonth = function(expirationMonth) {
        this.value["ExpirationMonth"] = expirationMonth;
    };
    RBI.CreditCard.prototype.getExpirationYear = function() {
        return this.value["ExpirationYear"]?this.value["ExpirationYear"]:"";
    };
    RBI.CreditCard.prototype.setExpirationYear = function(expirationYear) {
        this.value["ExpirationYear"] = expirationYear;
    };
    RBI.CreditCard.prototype.getHolderName = function() {
        return this.value["HolderName"];
    };
    RBI.CreditCard.prototype.setHolderName = function(holderName) {
        this.value["HolderName"] = holderName;
    };
    RBI.CreditCard.prototype.getFirstName = function() {
        return this.value["FirstName"]?this.value["FirstName"]:"";
    };
    RBI.CreditCard.prototype.setFirstName = function(firstName) {
        this.value["FirstName"] = firstName;
    };
    RBI.CreditCard.prototype.getLastName = function() {
        return this.value["LastName"]?this.value["LastName"]:"";
    };
    RBI.CreditCard.prototype.setLastName = function(lastName) {
        this.value["LastName"] = lastName;
    };
    RBI.CreditCard.prototype.getLastFour = function() {
        return this.value["LastFour"]?this.value["LastFour"]:"";
    };
    RBI.CreditCard.prototype.setLastFour = function(lastFour) {
        this.value["LastFour"] = lastFour;
    };
    /**
     * Number printed on a card.
     */
    RBI.CreditCard.prototype.getNumber = function() {
        return this.value["Number"]?this.value["Number"]:"";
    };
    RBI.CreditCard.prototype.setNumber = function(number) {
        this.value["Number"] = number;
    };
    RBI.CreditCard.prototype.isPreferred = function() {
        return !!this.value["Preferred"];
    };
    RBI.CreditCard.prototype.setPreferred = function(preferred) {
        this.value["Preferred"] = preferred;
    };
    RBI.CreditCard.prototype.isAVSChecked = function() {
        return !!this.value["AVSChecked"];
    };
    RBI.CreditCard.prototype.setAVSChecked = function(avsChecked) {
        this.value["AVSChecked"] = avsChecked;
    };
    RBI.CreditCard.prototype.isCVVChecked = function() {
        return !!this.value["CVVChecked"];
    };
    RBI.CreditCard.prototype.setCVVChecked = function(cvvChecked) {
        this.value["CVVChecked"] = cvvChecked;
    };
    
    RBI.CreditCard.prototype.getSaveToProfile = function() {
        return !!this.value["SaveToProfile"];
    };
    RBI.CreditCard.prototype.setSaveToProfile = function(saveToProfile) {
        this.value["SaveToProfile"] = saveToProfile;
    };

}());
(function initCustomerModel() {
	"use strict";

/**
 * Customer Model
 *
 * Model object for Customer. The constructor takes one argument:
 * @param value - the JSON of the Customer object.
 */
RBI.Customer = function(value)  {
    this.value = value;
    this.postConstruct && this.postConstruct();
};

RBI.Customer.prototype.updateProfileNeeded = function () {
    var needUpdate = false;
    if (!this.value.EmailAddresses || !this.value.EmailAddresses.PERSONALEMAIL) {
        needUpdate = true;
    } else if (!this.value.FirstName) {
        needUpdate = true;
    } else if (!this.value.LastName) {
        needUpdate = true;
    } else if (!this.value.Addresses || !this.value.Addresses.HOME || !this.value.Addresses.HOME.Zip) {
        needUpdate = true;
    }
    return needUpdate;
};

// Adds wrapper around accounts array to add additional functionality (getPrimaryAccount, getSubscriptionAccount, ...);
/*RBI.Customer.prototype.getCardsData = function () {
    return new RBI.CardsData(this.getAccounts());
};
*/

RBI.Customer.prototype.getAnniversaryDate = function () {
    var result = new Date(this.value.AnniversaryDate);
    if (isNaN(result.getTime())) {
        return null;
    }
    return result;
};

RBI.Customer.prototype.getSubscription = function () {
    var subscription = new RBI.Subscription(this.value.Subscription);
    return subscription;
};

RBI.Customer.prototype.getSubscriptionBillingAccountReference = function () {
    return this.value.SubscriptionBillingAccountReference;
};

RBI.Customer.prototype.getEmailAddress = function () {
    return this.value.EmailAddresses.PERSONALEMAIL;
};

RBI.Customer.prototype.getFirstName = function () {
    return this.value.FirstName;
};

RBI.Customer.prototype.getLastName = function () {
    return this.value.LastName;
};

RBI.Customer.prototype.getFirstAndLastNames = function () {
    return this.value.FirstName + this.value.LastName;
};

RBI.Customer.prototype.isFreeTrialUsed = function () {
    return this.value.FreeTrialUsed;
};

RBI.Customer.prototype.getBillingServiceAgreementDate = function () {
    return this.value.BillingServiceAgreementDate;
};

RBI.Customer.prototype.getSubscriptionAnniversaryDate = function () {
    return this.value.SubscriptionAnniversaryDate;
};

RBI.Customer.prototype.getSurrogateCustomerID = function () {
    return this.value.SurrogateCustomerID;
};

RBI.Customer.prototype.getAccountNumber = function () {
    return this.value.RBCustomerNumber;
};

RBI.Customer.prototype.getPartnerCustomerNumber = function () {
    return this.value.PartnerCustomerNumber;
};

RBI.Customer.prototype.getSubscriptionID = function () {
    return this.value.Subscription.SubscriptionID;
};

RBI.Customer.prototype.isSubscriptionCancelled = function () {
    return this.value.SubscriptionCancelled;
};

RBI.Customer.prototype.getCreditOptionID = function () {
    return this.value.Subscription.CreditOptionID;
};

RBI.Customer.prototype.getDisplayName = function () {
    return this.value.DisplayName;
};

RBI.Customer.prototype.getXboxShareOptOut = function () {
    return RBI.Util.returnBoolean(this.value.XboxShareOptOut);
};

RBI.Customer.prototype.getRatingsAllowed = function () {
    return this.value.RatingsAllowed;
};

RBI.Customer.prototype.getParentalControls = function () {
    return this.value.ParentalControls;
};

RBI.Customer.prototype.getPCN = function () {
    return this.value.PartnerCustomerNumber;
};

// Added for ZOE-30490: Notification of Expired Subscription
RBI.Customer.prototype.getNotifyOfSubscriptionFail = function () {
    var notifyOfSubscriptionFail = false;
    if (this.value.NotifyOfSubscriptionFail != null) {
       if (this.value.NotifyOfSubscriptionFail.toLowerCase() == 'true')  {
           notifyOfSubscriptionFail = true;
        }
    }
    return notifyOfSubscriptionFail;
 };

 RBI.Customer.prototype.getZipCode = function () {
    return this.value.ZipCode;
 };

/**
 * Create Customer Token Response Object
 * @param value  JSON object retrieved from Data layer
 * @constructor
 */
RBI.CreateCustomerTokenResponse = function(value)  {
    this.value = value;
};

/**
 * Getter of the token in the create Customer Token Response
 * @return String Token
 */
RBI.CreateCustomerTokenResponse.prototype.getToken = function () {
    return this.value['content'];
};

/**
 * Create Customer Response Object
 * @param value  JSON object retrieved from Data layer
 * @constructor
 */
RBI.CreateCustomerResponse = function(value)  {
    this.value = value;
};

/**
 * Getter of the PartnerCustomerNumber in the create customer Response
 * @return String PartnerCustomerNumber
 */
RBI.CreateCustomerResponse.prototype.getPCN = function () {
    return this.value['PartnerCustomerNumber'];
};

/*
 * Transaction Model
 */
RBI.Transaction = function (value) {
    this.value = value;
    this.postConstruct && this.postConstruct();
};
RBI.Transaction.prototype.getType = function () {
    return this.value.Type;
};
RBI.Transaction.prototype.getTitle = function () {
    return this.value.Title;
};
RBI.Transaction.prototype.getProductID = function () {
    return this.value.ProductID;
};
RBI.Transaction.prototype.getSEOURL = function () {
    return this.value.SEOURL;
};
RBI.Transaction.prototype.getDatePurchased = function () {
    return this.value.DatePurchased;
};
RBI.Transaction.prototype.getDateReturned = function () {
    return this.value.DateReturned;
};
RBI.Transaction.prototype.getInvoiceID = function () {
    return this.value.InvoiceID;
};
RBI.Transaction.prototype.getStatus = function () {
    return this.value.Status;
};
RBI.Transaction.prototype.getTotal = function() {
    return this.value.Total;
};
////






RBI.CreditBalance = function (credits) {
    var i, credit;

    this.credits = credits;
    this.totalCredits = 0;
    this.totalSubscriptionCredits = 0;

    for (i in credits) {
        credit = credits[i];
        this.totalCredits += credit.getQuantity();
        if (credit.isSubscription()) {
            this.totalSubscriptionCredits += credit.getQuantity();
        }
    }

    this.totalExtraCredits = this.totalCredits - this.totalSubscriptionCredits;
};

RBI.CreditBalance.prototype.getCredits = function() {
    return this.credits;
};

RBI.CreditBalance.prototype.getTotalCredits = function () {
    return this.totalCredits;
};

/*
 * Credit Model
 */
RBI.Credit = function (value) {
    this.value = value;
    this.postConstruct && this.postConstruct();
};
RBI.Credit.prototype.getQuantity = function () {
    return this.value.Quantity;
};
RBI.Credit.prototype.getDaystoExpire = function () {
    return this.value.DaystoExpire;
};
RBI.Credit.prototype.getExpirationDate = function () {
    return this.value.ExpirationDate;
};
RBI.Credit.prototype.getCreditType = function () {
    return this.value.CreditType;
};
RBI.Credit.prototype.getQuantity = function () {
    return this.value.Quantity;
};
RBI.Credit.prototype.isBluray = function () {
    return this.value.bluRay;
};
RBI.Credit.prototype.getCode = function () {
    return this.value.code;
};
RBI.Credit.prototype.getDescription = function () {
    return this.value.description;
};
RBI.Credit.prototype.getName = function () {
    return this.value.name;
};
RBI.Credit.prototype.getPackageName = function () {
    return this.value.packageName;
};
RBI.Credit.prototype.isSubscription = function () {
    return this.value.subscription;
};

////

/**
 * Add/Remove Bookmark Response
 * Author: Peter Rajcani
 * Date: 7/22/13
 */

/*
 * Model object(Response) for Add/Remove Bookmark. The constructor takes one argument:
 * @param value - the JSON of the data service layer
 */
RBI.BookmarkActionResponse = function(value)  {
    this.value = value;
};

/**
 * Response Object of the Add/Remove Bookmark
 * @return JSON Value of the ResultInfo
 */
RBI.BookmarkActionResponse.prototype.getResultInfo = function () {
    return this.value["ResultInfo"];
};

/*
 * Bookmark Response Model
 */
RBI.BookMarkResponse = function (value) {
	var i;
    this.value = value;
    this.bookmarks = [];
    this.pageInfo = new RBI.PageInfo(value.PageInfo);
    var bookmarkList = value.Bookmarks;
    if (bookmarkList) {
        for (i in bookmarkList) {
            if (bookmarkList[i] && bookmarkList[i].ProductInfo) {
                var bookmark = new RBI.Product(bookmarkList[i].ProductInfo.ProductType.toLowerCase(), bookmarkList[i].ProductInfo);
                bookmark.DateAdded = bookmarkList[i].DateAdded;
                this.bookmarks.push(bookmark);
            }
        }
    }
};

RBI.BookMarkResponse.prototype.getBookmarks = function () {
    return this.bookmarks;
};

RBI.BookMarkResponse.prototype.getPageInfo = function () {
    return this.pageInfo;
};

RBI.BookMarkUtility = {};
RBI.BookMarkUtility.getBookmarksByType = function (bookmarks, productType) {
    var i, results = [];
    for (i in bookmarks) {
        if (bookmarks[i].getProductType() === productType) {
            results.push(bookmarks[i]);
        }
    }
    return results;
};

/*
 * WatchHistory Response Model
 */
RBI.WatchHistoryResponse = function (value) {
	var i;
    this.value = value;
    this.watchHistory = [];
    this.pageInfo = new RBI.PageInfo(value.PageInfo);
    var watchHistoryList = value.PurchaseOptions;
    if (watchHistoryList) {
        for (i in watchHistoryList) {
            var watchHistoryItem = new RBI.PurchaseOption(watchHistoryList[i]);
            this.watchHistory.push(watchHistoryItem);
        }
    }
};

RBI.WatchHistoryResponse.prototype.getWatchHistory = function () {
    return this.watchHistory;
};

RBI.WatchHistoryResponse.prototype.getPageInfo = function () {
    return this.pageInfo;
};


/*
 * Purchase Response Model
 */
RBI.PurchaseResponse = function (value) {
	var i;
    this.value = value;
    this.purchases = [];
    this.pageInfo = new RBI.PageInfo(value.PageInfo);
    var purchaseList = value.PurchaseOptions;
    if (purchaseList) {
        for (i in purchaseList) {
            var purchaseItem = new RBI.PurchaseOption(purchaseList[i]);
            this.purchases.push(purchaseItem);
        }
    }
};

RBI.PurchaseResponse.prototype.getPurchases = function () {
    return this.purchases;
};

RBI.PurchaseResponse.prototype.getPageInfo = function () {
    return this.pageInfo;
};
}());

(function initDeviceModel() {
    "use strict";

    /**
     * Device Model
     * Author: Peter Rajcani
     * Date: 10/8/13
     */

    /*
     * Model object for Device. The constructor takes one argument:
     * @param value - the JSON of the data service layer
     */
    RBI.Device = function (value) {
        this.value = value;
    };

    /**
     * Getter for the device name
     * @return String device name
     */
    RBI.Device.prototype.getName = function () {
        return this.value["Name"];
    };

    /**
     * Getter for the Device ID
     * @return String Device ID
     */
    RBI.Device.prototype.getDeviceId = function () {
        return this.value["DeviceID"];
    };

    /**
     * Getter for the active flag
     * @return boolean
     */
    RBI.Device.prototype.isActive = function () {
        var isActive = this.value["Active"];
        if (isActive.toLowerCase() == 'true') {
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Getter for the device type
     * @return String device type
     */
    RBI.Device.prototype.getType = function () {
        return this.value["Type"];
    };

    /**
     * Getter for allowed ratings
     * @return array of allowed ratings
     */
    RBI.Device.prototype.getAllowedRatings = function () {
        return this.value["AllowedRatings"];
    };

    /**
     * Getter for restict purchases
     * @return array of restict purchases
     */
    RBI.Device.prototype.getRestrictPurchases = function () {
        return this.value["RestrictPurchases"];
    };

    /**
     * UpdateDeviceResponse Response
     */

    /*
     * Model object(Response) for UpdateDevice. The constructor takes one argument:
     * @param value - the JSON of the data service layer
     */
    RBI.UpdateDeviceResponse = function (value) {
        this.value = value;
    };

    /**
     * Response Object of the Complete Watching Title
     * @return JSON Value of the ResultInfo
     */
    RBI.UpdateDeviceResponse.prototype.getResultInfo = function () {
        return this.value["ResultInfo"];
    };

    /**
     * ActivateDeviceResponse Response
     */

    /*
     * Model object(Response) for ActivateDevice. The constructor takes one argument:
     * @param value - the JSON of the data service layer
     */
    RBI.ActivateDeviceResponse = function (value) {
        this.value = value;
    };

    /**
     * Response Object of the ActivateDevice
     * @return JSON Value of the ResultInfo
     */
    RBI.ActivateDeviceResponse.prototype.getResultInfo = function () {
        return this.value["ResultInfo"];
    };

    /**
     * RemoveDeviceResponse Response
     */

    /*
     * Model object(Response) for RemoveDevice. The constructor takes one argument:
     * @param value - the JSON of the data service layer
     */
    RBI.RemoveDeviceResponse = function (value) {
        this.value = value;
    };

    /**
     * Response Object of the RemoveDevice
     * @return JSON Value of the ResultInfo
     */
    RBI.RemoveDeviceResponse.prototype.getResultInfo = function () {
        return this.value["ResultInfo"];
    };

    /**
     * CheckVersionResponse Response
     */

    /*
     * Model object(Response) for CheckVersion. The constructor takes one argument:
     * @param value - the JSON of the data service layer
     */
    RBI.CheckVersionResponse = function (value) {
        this.value = value;
    };

    /**
     * Response Object of the CheckVersion
     * @return JSON Value of the ResultInfo
     */
    RBI.CheckVersionResponse.prototype.getResultInfo = function () {
        return this.value["ResultInfo"];
    };

    /**
     * Check if upgrade is mandatory
     * @return JSON Value of the ResultInfo
     */
    RBI.CheckVersionResponse.prototype.isMandatory = function () {
        return this.value["Mandatory"];
    };

    /**
     * Check if upgrade is available
     * @return JSON Value of the ResultInfo
     */
    RBI.CheckVersionResponse.prototype.isUpgradeAvailable = function () {
        return this.value["UpgradeAvailable"];
    };

    /**
     * Get the Upgrade app Version
     * @return JSON Value of the ResultInfo
     */
    RBI.CheckVersionResponse.prototype.getUpgradeAppVersion = function () {
        return this.value["UpgradeAppVersion"];
    };
}());

(function initErrorModel() {
	"use strict";

/*
 * Model object for Error.
 */
RBI.Error = function (value) {
    this.value = value;
};

RBI.Error.prototype.getResultCode = function () {
    return this.value["ResultCode"];
};

RBI.Error.prototype.getResultMessage = function () {
    return this.value["ResultMessage"];
};

RBI.Error.prototype.getTitle = function () {
    return this.value["Title"];
};

RBI.Error.prototype.getDescription = function () {
    return this.value["Description"];
};

RBI.Error.prototype.setDescription = function (description) {
	this.value["Description"] = description;
};

RBI.Error.prototype.getPublicErrorCode = function () {
    return this.value["PublicErrorCode"];
};

RBI.Error.prototype.getType = function () {
    return this.value["Type"];
};
RBI.Error.prototype.getHelpId = function () {
    return this.value["HelpId"];
};

RBI.Error.prototype.getActivityID = function () {
    return this.value["ActivityID"];
};

RBI.Error.prototype.getMachineID = function () {
    return this.value["MachineID"];
};
}());
(function initFilterModel() {
    "use strict";


/**
 *
 * FilterGroup - 0..n -> FilterType
 * 
 * FilterType -> 1..n Filter -> (Availability, ContentRating, Custom, Format, Genre, SpecialFilters, UserRating)
 *  
 * Filter = {FilterName, FilterID, FilterValue, IsNavigation, IsHome}
 *
 */

/**
 * FilterType Model
 * Author: Kevin Clark
 * @param type - Type of filterGroup ("GameFilters","MovieFilters","TVFilters")
 * @param value - the JSON of the data service layer
 */
RBI.FilterType = function (type, value) {
	var i;
    this.type = type;
    this.value = value;
    this.navigationFilters = [];
    this.homeFilters = [];

    //ZOE-1322: Ratings List Sort Order -> Remove the NC-17 contentRating
    var contentRating = this.getContentRating();
    var contentRatingFiltered = [];
    if (contentRating) {
        for (i in contentRating) {
            if (contentRating[i].FilterName != "NC-17") {
                contentRatingFiltered.push(contentRating[i]);
            }
        }
        this.value.ContentRating = contentRatingFiltered;
    }
};

// FilterGroup type constants.
RBI.FilterType.Defines = {};
RBI.FilterType.Defines.FILTER_TYPE_GAMES = "GameFilters";
RBI.FilterType.Defines.FILTER_TYPE_MOVIES = "MovieFilters";
RBI.FilterType.Defines.FILTER_TYPE_TV = "TVFilters";
RBI.FilterType.Defines.FILTER_TYPES = [RBI.FilterType.Defines.FILTER_TYPE_GAMES, RBI.FilterType.Defines.FILTER_TYPE_MOVIES, RBI.FilterType.Defines.FILTER_TYPE_TV];

// TODO - see RBI.Product.Defines which seem to be repeats
RBI.FilterType.Defines.AVAILABILITY_KIOSK = "Kiosk";
RBI.FilterType.Defines.AVAILABILITY_EST = "EST";
RBI.FilterType.Defines.AVAILABILITY_VOD = "VOD";
RBI.FilterType.Defines.AVAILABILITY_SUBSCRIPTION = "Subscription";
RBI.FilterType.Defines.AVAILABILITY_ALL = "All";

RBI.FilterType.Defines.SORT_RELEASEDATE = "ReleaseDate";
RBI.FilterType.Defines.SORT_RELEASEDATE_LABEL = "Release Date";
RBI.FilterType.Defines.SORT_USERRATING = "UserRating";
RBI.FilterType.Defines.SORT_USERRATING_LABEL = "Fan Rating";
RBI.FilterType.Defines.SORT_TITLE = "Title";
RBI.FilterType.Defines.SORT_TITLE_ASC = "TitleAsc";
RBI.FilterType.Defines.SORT_TITLE_DESC = "TitleDesc";
RBI.FilterType.Defines.SORT_TITLE_ASC_LABEL = "A - Z";
RBI.FilterType.Defines.SORT_TITLE_DESC_LABEL = "Z - A";
RBI.FilterType.Defines.SORT_ORIGINAL_AIR_DATE = "Original Air Date";
RBI.FilterType.Defines.SORT_REDBOXRELEASEDATE = "RedBoxReleaseDate";
RBI.FilterType.Defines.SORT_RELEVANCE_ID = "defaultSort";
RBI.FilterType.Defines.SORT_RELEVANCE = "";
RBI.FilterType.Defines.SORT_RELEVANCE_LABEL = "Relevance";

RBI.FilterType.Defines.SORT_ORDER_DESC = "desc";
RBI.FilterType.Defines.SORT_ORDER_ASC = "asc";
RBI.FilterType.Defines.SORT_ORDER_BLANK = "";

/**
 * Get The Type of this filterGroup
 * @return JSON filter Group Type ("GameFilters","MovieFilters","TVFilters")
 */
RBI.FilterType.prototype.getType = function () {
    return this.type;
};

/**
 * Get the complete value object of this FilterType
 * @return JSON of the Filter
 */
RBI.FilterType.prototype.getValue = function () {
    return this.value;
};

/**
 * Get the availability Filters
 * @return JSON Array of the availability filters
 */
RBI.FilterType.prototype.getAvailability = function () {
    return this.value["Availability"];
};

/**
 * Get the availability filter matching a name
 * Example
 *    var filter = aFilterType.getAvailabilityFilter(RBI.FilterType.Defines.AVAILABILITY_EST);
 *
 * @return A filter object or null
 */
RBI.FilterType.prototype.getAvailabilityFilter = function (aName) {
    var i, availabilityFilters = this.getAvailability();
    for (i in availabilityFilters) {
        if (availabilityFilters[i].FilterName === aName) {
            return availabilityFilters[i];
        }
    }
    return null;
};

/**
 * Get the availability Filters ids as array from specified filternames
 * This method is used to get filter ids used for queries. For example,
 *
 *    var filterIds = aFilterType.getAvailabilityValues([RBI.FilterType.Defines.AVAILABILITY_EST, RBI.FilterType.Defines.AVAILABILITY_VOD]);
 *
 * @return Array of strings of ids
 */
RBI.FilterType.prototype.getAvailabilityValues = function (filterNames) {
    var availabilityFilters = this.getAvailability();
    var availabilityIds = [];
    var self = this;
    filterNames.forEach(function (aName) {
        var filter = self.getAvailabilityFilter(aName);
        if (filter !== null) {
            availabilityIds.push(filter.FilterID);
        }
    });
    return availabilityIds;
};

/**
 * Get the Content Rating Filters
 * @return JSON Array of the Content Rating filters
 */
RBI.FilterType.prototype.getContentRating = function () {
    return this.value["ContentRating"];
};

/**
 * Get the Content Rating Filters Sorted Following the Recommendation
 * @return JSON Array of the Content Rating filters
 */
RBI.FilterType.prototype.getContentRatingSorted = function () {
    var contentRatings = this.getContentRating();
    for (var i = 0; i < contentRatings.length; i++) {
        var contentRating = contentRatings[i];
        if (contentRating.FilterName === "All") {
            contentRating.priority = 1;
        }else if (contentRating.FilterName === "G") {
            contentRating.priority = 2;
        }else if (contentRating.FilterName === "PG") {
            contentRating.priority = 3;
        }else if (contentRating.FilterName === "PG-13") {
            contentRating.priority = 4;
        }else if (contentRating.FilterName === "R") {
            contentRating.priority = 5;
        } else if (contentRating.FilterName === "NR") {
            contentRating.priority = 6;
        } else {
            contentRating.priority = 7;
        }
    }


    contentRatings.sort(function (a, b)
    {
        if (a.priority == b.priority)
        {
            return 0;
        } else if (a.priority < b.priority) {
            return -1;
        } else {
            return 1;
        }
    });

    return contentRatings;
};

/**
 * Get the Format Filters
 * @return JSON Array of the Format filters
 */
RBI.FilterType.prototype.getFormat = function () {
    return this.value["Format"];
};

/**
 * Get the Genre Filters
 * @return JSON Array of the Genre filters
 */
RBI.FilterType.prototype.getGenre = function () {
    return this.value["Genre"];
};

/**
 * Get the User Rating Filters
 * @return JSON Array of the User Rating filters
 */
RBI.FilterType.prototype.getUserRating = function () {
    return this.value["UserRating"];
};

/**
 * Get the Special Filters
 * @return JSON Array of the Special filters
 */
RBI.FilterType.prototype.getSpecialFilters = function () {
    return this.value["SpecialFilters"];
};

/**
 * Get the Filters by a particular type (in JSON Structure) that has to be displayed on Home screen
 * @param filterJson - JSON object of a particular filter (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @return JSON Array of Filters
 */
RBI.FilterType.prototype.getFiltersForHome = function (filterJson) {
    var result = [];
    if (filterJson) {
        filterJson.forEach(function (filter) {
            if (filter.IsHome === "true") {
                result.push(filter);
            }
        });
    }
    return result;
};

/**
 * Get the Filters by a String array of Filters Types that has to be displayed on Home screen
 * @param attributes - String array of filters  (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @return JSON Array of the Filters
 */
RBI.FilterType.prototype.getHomeFilters = function (attributes) {
    if (this.homeFilters.length > 0) {
        return this.homeFilters;
    }
    var self = this;
    attributes.forEach(function (attribute) {
        var filtersForAttribute = self.getFiltersForHome(self.value[attribute]);
        filtersForAttribute.forEach(function (filter) {
            self.homeFilters.push(filter);
        });
    });
    return this.homeFilters;
};

/**
 * Get the Filters by a particular type (in JSON Structure) that are used for Navigation
 * @param filterJson - JSON object of a particular filter (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @return JSON Array of Filters
 */
RBI.FilterType.prototype.getFiltersForNavigation = function (filterJson) {
    var result = [];
    filterJson.forEach(function (filter) {
        //        console.log(filter.IsNavigation);
        //        console.log(filter["IsNavigation"]);
        if (filter.IsNavigation === "true") {
            result.push(filter);
        }
    });
    return result;
};

/**
 * Get the Filters by a String array of Filters Types that are used for Navigation
 * @param attributes - String array of filters  (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @return JSON Array of the Filters
 */
RBI.FilterType.prototype.getNavigationFilters = function (attributes) {
    if (this.navigationFilters.length > 0) {
        return this.navigationFilters;
    }
    var self = this;
    attributes.forEach(function (attribute) {
        var filtersForAttribute = self.getFiltersForNavigation(self.value[attribute]);
        filtersForAttribute.forEach(function (filter) {
            self.navigationFilters.push(filter);
        });
    });
    return this.navigationFilters;
};

/**
 * Get all the filters where the filterName matches a value in an array of possible names
 * @param filterArray - Array of a filterType  (For example an array of availability filters)
 * @param namesArray  - Array of filterNames that you need to extract from a filterType array
 * @return Array of filters that matches the FilterNames you passed
 */
RBI.FilterType.prototype.getFilterListsMatching = function (filterArray, namesArray) {
    var i, j, results = [];
    if (namesArray) {
        for (i in filterArray) {
            for (j in namesArray) {
                if (namesArray[j].indexOf(filterArray[i].FilterName) >= 0) {
                    results.push(filterArray[i]);
                }
            }
        }
    } else {
		// Push all onto results if no names filter is in place
        results.push(filterArray);
    }
    return results;
};

/**
 * Get all the filters where the filterName matches a value in an array of possible names
 * @param filterType - String value of the filterType where to search for matching filterNames
 *                      (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @param names  - Array of filterNames that you need to extract from a filterType array
 * @return Array of filters that matches the FilterNames you passed
 *
 * Example
 *      var filterType = filterUtility.getFilterTypesByType(RBI.FilterType.Defines.FILTER_TYPE_MOVIES);
 *      var filters = filterType.getFiltersMatching("Availability", ["Subscription", "VOD"]);
 */
RBI.FilterType.prototype.getFiltersMatching = function (filterType, names) {
    return this.getFilterListsMatching(this.value[filterType], names);
};

// TODO - maybe move to utils.js
/**
 * Filter Utility
 *
 * This is not intended to be a singleton. So do not use it in applications as such unless you really want 
 * all parts of the application using modified filter data changed by this utility.
 * Some methods may filter out values. Some methods may sort values on the internal instances
 *
 * Author: Kevin Clark
 * @param filterTypes - array of all filter types (i.e. MovieFilters, GameFilters, TVFilters, etc...)
 */
RBI.FilterUtility = function (filterTypes) {
    this.filterTypes = filterTypes;
};

/**
 * Get filter types for given category.
 * @param type - One of RBI.FilterType.Defines.FILTER_TYPES.
 * @param filterTypes - OPTIONAL Array of FilterTypes. If missing, the function works with this.filterTypes.
 * @return Array of FilterType objects
 * 
 * Example
 *  var movieFilters = new RBI.FilterUtility(filters).getFilterTypesByType(RBI.FilterType.Defines.FILTER_TYPE_MOVIES);
 */
RBI.FilterUtility.prototype.getFilterTypesByType = function (type, filterTypes) {
    var i, filterType, result = null;

    // Can work with param or field.
    filterTypes = filterTypes || this.filterTypes;

    for (i in filterTypes) {
        filterType = filterTypes[i];

        if (filterType.getType() === type) {
            result = filterType;
            break;
        }
    }
    return result;
};

/**
 * Get all the filters where the filterName matches a value in an array of possible names
 * @param selectedFilters - Array of filters that are currently selected. One of RBI.FilterType.Defines.FILTER_TYPES.
 * @param filterType - String value of the filterType where to search for matching filterNames
 *                      (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @param names  - Array of filterNames that you need to extract from a filterType array
 * @return Array of FilterType's that matches the names you passed
 * 
 * Examples
 *   var specialFilters = filterUtility.getFiltersMatching(RBI.PlatformConfig.activeFilterCategories, "SpecialFilters");
 *   var genreFilters = filterUtility.getFiltersMatching(RBI.PlatformConfig.activeFilterCategories, "Genre");
 *
 */
RBI.FilterUtility.prototype.getFiltersMatching = function (selectedFilters, filterType, names) {
    var i, each, filter, matchArray = [];
    for (i in selectedFilters) {
        var idx = RBI.FilterType.Defines.FILTER_TYPES.indexOf(selectedFilters[i]);     // get index of order in list
        var filterObj = this.filterTypes[idx];                                              // get the filter object in data element
        var matching = filterObj.getFiltersMatching(filterType, names)[0];
        for (each in matching) {
            filter = matching[each];
            filter.filterType = filterType;
            matchArray.push(filter);
        }
    }
    return matchArray;
};

/**
 * Create a delimited List of filters by a given filterType
 * @param list - List of filters
 * @param fieldValue - FilterType (Availability, ContentRating, Format, Genre, UserRating, SpecialFilters)
 * @param delimiter - The delimiter to use
 * @return String value delimited of all the filters
 */
RBI.FilterUtility.prototype.createDelimitedList = function (list, fieldValue, delimiter) {
    var result = [];
    list.forEach(function (value) {
        result.push(value[fieldValue]);
    });
    return result.join(delimiter);
};

/**
 * Static method Extract array of values from filters based on function
 *
 * @param filters - array of FilterTypes
 * @param extractFunction - extraction function
 * 
 * @return array of values/objects
 */
RBI.FilterUtility.extract = function (filters, extractFunction) {
    var result = [];
    filters.forEach(function (value) {
        result.push(extractFunction(value));
    });
    return result;
};

/**
 * Iterates through array checking each value with a callback 
 *
 * @param callback - check function
 * 
 * @return int - the index found or -1 if not found
 */

RBI.FilterUtility.indexOfCallback = function (anArray, callback) {
    var i, result = [];
    for (i = 0; i < anArray.length; i++) {
        if (callback(anArray[i])) {
            return i;
        }
    }
    return -1;
};

/**
 * Looks through array and puts element first that matches the selector function 
 *
 * @param anArray the array of filters
 * @param selectionCallback to select the element
 * 
 * @return int - the index found or -1 if not found
 */

RBI.FilterUtility.setElementFirst = function (anArray, selectionCallback) {
	var i;
    for (i = 0; i < anArray.length; i++) {
        if (selectionCallback(anArray[i])) {
            var element = anArray[i];
            var modified = anArray.splice(i, 1);
            anArray.unshift(element);
        }
    }
    // return original as default
    return anArray;
};


/**
 * Get the sort values for specific type
 * @param type - One of RBI.FilterType.Defines.FILTER_TYPES.
 */
RBI.FilterUtility.prototype.getSortDataByProductType = function (type) {
    var sortValues = [];
    if (type == RBI.FilterType.Defines.FILTER_TYPE_MOVIES) {
        var sortOptionReleaseDate = this.createSortObject(RBI.FilterType.Defines.SORT_RELEASEDATE_LABEL, RBI.FilterType.Defines.SORT_RELEASEDATE,RBI.FilterType.Defines.SORT_RELEASEDATE, RBI.FilterType.Defines.SORT_ORDER_DESC);
        var sortOptionFanRating = this.createSortObject(RBI.FilterType.Defines.SORT_USERRATING_LABEL, RBI.FilterType.Defines.SORT_USERRATING,RBI.FilterType.Defines.SORT_USERRATING, RBI.FilterType.Defines.SORT_ORDER_DESC);
        var sortOptionTitleAsc = this.createSortObject(RBI.FilterType.Defines.SORT_TITLE_ASC_LABEL, RBI.FilterType.Defines.SORT_TITLE_ASC,RBI.FilterType.Defines.SORT_TITLE, RBI.FilterType.Defines.SORT_ORDER_ASC);
        var sortOptionTitleDesc = this.createSortObject(RBI.FilterType.Defines.SORT_TITLE_DESC_LABEL, RBI.FilterType.Defines.SORT_TITLE_DESC, RBI.FilterType.Defines.SORT_TITLE, RBI.FilterType.Defines.SORT_ORDER_DESC);
        var sortOptionRelevance = this.createSortObject(RBI.FilterType.Defines.SORT_RELEVANCE_LABEL, RBI.FilterType.Defines.SORT_RELEVANCE_ID,RBI.FilterType.Defines.SORT_RELEVANCE, RBI.FilterType.Defines.SORT_ORDER_BLANK);
        sortValues.push(sortOptionReleaseDate);
        sortValues.push(sortOptionFanRating);
        sortValues.push(sortOptionTitleAsc);
        sortValues.push(sortOptionRelevance);
        //Remove the Z-A sorting function
        //sortValues.push(sortOptionTitleDesc);
    }
    return sortValues;
};

/**
 * Get a sort object created with passing params
 * @param label - The label of the sort value (to display)
 * @param id - The id of the sort value (uniqueness)
 * @param key - The key of the sort value (to pass to backend)
 * @param order - The order direction of the sort value
 */
RBI.FilterUtility.prototype.createSortObject = function (label, id, key, order) {
    var sortOption = {};
    sortOption.label = label;
    sortOption.id = id;
    sortOption.key = key;
    sortOption.order = order;
    return sortOption;
};

    RBI.FilterUtility.prototype.getGenreFilters = function (filterType) {
        var genreFilters = this.getFiltersMatching([filterType], "Genre");
        return RBI.FilterUtility.setElementFirst(genreFilters, function (item) {
            return item.FilterName === "All";
        });
    };

    RBI.FilterUtility.prototype.getMovieFormatFilters = function(selectedDeliveryFilter, filterType) {
        var format = this.getFilterTypesByType(filterType, null).getFormat();

        var selectedFilterId = selectedDeliveryFilter && selectedDeliveryFilter.id || RBI.Product.Defines.DELIVERY_TYPE_ALL;

        //Filter out formats depending on the deliveryType that is currently selected
        var formatFilterDataFiltered = [];

        for (var i = 0; i < format.length; i++) {
            var filterName = format[i].FilterName.toLowerCase();

            if (filterName === RBI.Product.Defines.MEDIA_FORMAT_TYPE_ALL.toLowerCase()) {
                format[i].FilterLabel = "In All Formats";
                formatFilterDataFiltered.push(format[i]);
            }

            if ((RBI.Util.inArray(filterName, [RBI.Product.Defines.MEDIA_FORMAT_TYPE_SD.toLowerCase(), RBI.Product.Defines.MEDIA_FORMAT_TYPE_HD.toLowerCase()]) && RBI.Util.inArray(selectedFilterId, [RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION, RBI.Product.Defines.DELIVERY_TYPE_RENTBUY, RBI.Product.Defines.DELIVERY_TYPE_ALL])) ||
                (RBI.Util.inArray(filterName, [RBI.Product.Defines.MEDIA_FORMAT_TYPE_BLU_RAY.toLowerCase(), RBI.Product.Defines.MEDIA_FORMAT_TYPE_DVD.toLowerCase()]) && RBI.Util.inArray(selectedFilterId, [RBI.Product.Defines.DELIVERY_TYPE_KIOSK, RBI.Product.Defines.DELIVERY_TYPE_ALL]))) {

                if (format[i].FilterValue === 'Blu-ray') {
                    format[i].FilterLabel = 'Blu-ray\u2122';
                } else {
                    format[i].FilterLabel = format[i].FilterName;
                }
                formatFilterDataFiltered.push(format[i]);
            }
        }

        return formatFilterDataFiltered;
    };

    RBI.FilterUtility.prototype.getGameFormatFilters = function(selectedDeliveryFilter, filterType) {
        var format = this.getFilterTypesByType(filterType, null).getFormat();

        var formatFilterDataFiltered = [];
        for (var i = 0; i < format.length; i++) {
            var filterName = format[i].FilterName.toLowerCase();

            if (filterName !== RBI.Product.Defines.MEDIA_FORMAT_TYPE_ALL.toLowerCase()) {
                formatFilterDataFiltered.push(format[i]);
            }
        }
        return formatFilterDataFiltered;
    };

    RBI.FilterUtility.prototype.getAvailabilityFilters = function (filterType) {
        var availabilityFiltersUnfiltered = this.getFiltersMatching([ filterType], "Availability");

        var allFilters = availabilityFiltersUnfiltered.filter(function (aFilter) {
            return aFilter.FilterValue === RBI.Product.Defines.DELIVERY_TYPE_ALL;
        });

        var subscriptionFilters = availabilityFiltersUnfiltered.filter(function (aFilter) {
            return aFilter.FilterValue === RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION;
        });

        var kioskFilters = availabilityFiltersUnfiltered.filter(function (aFilter) {
            return aFilter.FilterValue === RBI.Product.Defines.DELIVERY_TYPE_KIOSK;
        });

        var rentBuyFilters = availabilityFiltersUnfiltered.filter(function (aFilter) {
            return RBI.Util.inArray(aFilter.FilterValue, [RBI.Product.Defines.DELIVERY_TYPE_EST, RBI.Product.Defines.DELIVERY_TYPE_VOD]);
        });

        return [
            {
                id: RBI.Product.Defines.DELIVERY_TYPE_ALL,
                label: "All",
                filters: allFilters
            },
            {
                id: RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION,
                label: "Watch Now with Subscription",
                filters: subscriptionFilters
            },
            {
                id: RBI.Product.Defines.DELIVERY_TYPE_RENTBUY,
                label: "Rent or Buy Instantly",
                filters: rentBuyFilters
            },
            {
                id: RBI.Product.Defines.DELIVERY_TYPE_KIOSK,
                label: "Reserve at the Box",
                filters: kioskFilters
            }
        ];
    };

    RBI.FilterUtility.prototype.getRatingFilters = function(filterType) {
        var ratingFilters = this.getFilterTypesByType(filterType, null).getContentRating();

        for (var i = 0; i < ratingFilters.length; i++) {
            var filterName = ratingFilters[i].FilterName;
            ratingFilters[i].FilterLabel = filterName === "All" ? "All Ratings" : filterName;
        }

        return ratingFilters;
    }

}());
(function initKioskModel() {
	"use strict";

/**
 * Kiosk Model
 * Author: Peter Rajcani
 * Date: 6/6/13
 */

/*
 * Model object for Kiosk. The constructor takes ome argument:
 * @param value - the JSON of the kiosk object
 */
RBI.Kiosk = function(value)  {
    this.value = value;
    this.key = value["KioskID"];
    this.postConstruct && this.postConstruct();
};

// Get kiosk ID
RBI.Kiosk.prototype.getKioskID = function () {
    return this.key;
};

// Get kiosk name
RBI.Kiosk.prototype.getName = function () {
    return this.value["Displayname"];
};

// Get kiosk address line 1
RBI.Kiosk.prototype.getAddress1 = function () {
    return this.value["Address1"];
};

// Get kiosk address line 2 (if present), empty string otherwise
RBI.Kiosk.prototype.getAddress2 = function () {
    return this.value["Address2"] || "";
};

// Get kiosk city
RBI.Kiosk.prototype.getCity = function () {
    return this.value["City"];
};

// Get kiosk state
RBI.Kiosk.prototype.getState = function () {
    return this.value["State"];
};

// Get kiosk zip code
RBI.Kiosk.prototype.getZipCode = function () {
    return this.value["ZipCode"];
};

// Get kiosk vendor
RBI.Kiosk.prototype.getVendor = function () {
    return this.value["Vendor"];
};

// Get kiosk label (if present)
RBI.Kiosk.prototype.getLabel = function () {
    return this.value["Label"] || "";
};

// Get kiosk location (indoor/outdoor)
RBI.Kiosk.prototype.getLocation = function () {
    return this.value["Location"] || "";
};

// Get kiosk latitude
RBI.Kiosk.prototype.getLatitude = function () {
    return this.value["Latitude"];
};

// Get kiosk longitude
RBI.Kiosk.prototype.getLongitude = function () {
    return this.value["Longitude"];
};

// Get kiosk status
RBI.Kiosk.prototype.getStatus = function () {
	return this.value["Status"];
};

// Determine if the kiosk is online
RBI.Kiosk.prototype.isOnline = function () {
    return this.getStatus() === RBI.Kiosk.Defines.TYPE_STATUS_ONLINE;
};

// Get kiosk distance (if present) rounded to 2 digits past the decimal point
RBI.Kiosk.prototype.getDistance = function () {
	var result = "";

    if (this.value["Distance"]) {
        var distance = this.value["Distance"];
        var scFactor = Math.pow(10, 2);
        var distRounded = distance * scFactor + 0.5;
        var div = Math.floor(distRounded / scFactor);
        var rem = Math.floor(distRounded % scFactor);
        result = (div + "." + rem);
    }

	return result;
};

RBI.Kiosk.prototype.getFullDisplayName = function () {
    return this.getName() + " " + this.getAddress1() + ", " + (this.getAddress2() ? this.getAddress2() + ", " : "") + this.getCity() + ", " + this.getState() + " " + this.getZipCode();
};

RBI.Kiosk.Defines = {};

// Kiosk status type constants.
RBI.Kiosk.Defines.TYPE_STATUS_ONLINE = "Online";
RBI.Kiosk.Defines.TYPE_STATUS_OFFLINE = "Offline";


}());
(function initParentalModel() {
	"use strict";

/*
 * ParentalControl Model
 *
 * Model object for ParentalControl. The constructor takes one argument:
 * @param value - the JSON of the ParentalControl object.
 */
RBI.ParentalControl = function(value)  {
    this.value = value;
    this.key = value["ParentalControlOptionID"];
};

/**
 * Get The Type of this ParentalControlOptionID
 * @return ParentalControlOptionID for the account.
 */
RBI.ParentalControl.prototype.getName = function () {
	return this.value["Name"];
};

/**
 * Get The Type of this Description
 * @return Description for the account.
 */
RBI.ParentalControl.prototype.getDescription = function () {
	return this.value["Description"];
};

/**
 * Get The Type of this RatingsAllowed
 * @return RatingsAllowed for the account.
 */
RBI.ParentalControl.prototype.getRatingsAllowed = function () {
	return this.value["RatingsAllowed"];
};
}());
(function initPlaybackModel() {
	"use strict";

/**
 * Playback Model
 * Author: Stijn Asnong
 * Date: 6/14/13 
 *
 * Added licensing and other utility methods
 * Author: Kevin Clark
 * Date: 8/4/13 
 */

/*
 * Model object for Playback. The constructor takes one argument:
 * @param value - the JSON of the data service layer
 */
RBI.Playback = function(value)  {
    this.value = value;
};

/**
 * Getter for the PartnerCustomerNumber
 * @return String partnerCustomerNumber
 */
RBI.Playback.prototype.getPartnerCustomerNumber = function () {
    return this.value["PCN"];
};

/**
 * Getter for the Transaction Device ID
 * @return String Transaction Device ID
 */
RBI.Playback.prototype.getTransactionDeviceId = function () {
    return this.value["TransactionDeviceID"];
};

/**
 * Getter for the Transaction ID
 * @return String Transaction ID
 */
RBI.Playback.prototype.getTransactionId = function () {
    return this.value["TransactionID"];
};

/**
 * Getter for the Device Spec
 * @return String Device Spec
 */
RBI.Playback.prototype.getDeviceSpec = function () {
    return this.value["DeviceSpec"];
};

/**
 * Getter for the Device ID
 * @return String Device ID
 */
RBI.Playback.prototype.getDeviceId = function () {
    return this.value["DeviceID"];
};

/**
 * Getter for the Scrubber Path
 * @return String Scrubber Path
 */
RBI.Playback.prototype.getScrubberPath = function () {
    return this.value["ScrubberPath"];
};

/**
 * Getter for the Scrubber Interval
 * @return String Scrubber Interval
 */
RBI.Playback.prototype.getScrubberInterval = function () {
    return this.value["ScrubberInterval"];
};

/**
 * Getter for the Token
 * @return String Token
 */
RBI.Playback.prototype.getToken = function () {
    return this.value["Token"];
};

/**
 * Getter for the Entitlement ID
 * @return String Entitlement ID
 */
RBI.Playback.prototype.getEntitlementId = function () {
    return this.value["EntitlementID"];
};

/**
 * Getter for the Component ID
 * @return String Component ID
 */
RBI.Playback.prototype.getComponentId = function () {
    return this.value["ComponentID"];
};

/**
 * Getter productid
 * @return String the id or null
 */
RBI.Playback.prototype.getProductID = function () {
    return this.value["ProductID"];
};

/**
 * Getter purchase option id
 * @return String the id or null
 */
RBI.Playback.prototype.getPurchaseOptionID = function () {
    return this.value["PurchaseOptionID"];
};

/**
 * Getter for the Progress Watched
 * @return String Progress Watched
 */
RBI.Playback.prototype.getProgressWatched = function () {
    return this.value["ProgressWatched"];
};

/**
 * Getter for the CDN URL
 * @return String CDN URL
 */
RBI.Playback.prototype.getCDNUrl = function () {
    return this.value["CDNURL"];
};

/**
 * Getter for the playback URL
 * @return String playback URL
 */
RBI.Playback.prototype.getPlaybackUrl = function () {
    return this.value["CDNURL"];
};

/**
 * Getter for the closed captioning URL
 * @return String closed captioning URL
 */
RBI.Playback.prototype.getClosedCaptionUrl = function () {
    var url = new String(this.value["CDNURL"]);
    return url.replace(".ism/Manifest", ".dfxp");
};

/**
 * Generate custom data section for Microsoft Playread license DRM
 * @return String of custom data for license request
 * @author Kevin Clark
 */
RBI.Playback.prototype.generatePlayReadyData = function () {
    return '<em:credentials xmlns:em="http://opencase.extend.com/em"><em:credential em:name="COMPONENT_ID">'+  this.getComponentId() +
        '</em:credential><em:credential em:name="ENTITLEMENT_ID">' + this.getEntitlementId() +
        '</em:credential><em:credential em:name="PCN">' + this.getPartnerCustomerNumber() +
        '</em:credential><em:credential em:name="TOKEN">' + this.getToken() +
        '</em:credential></em:credentials>';
};

/**
 * Return progress watched in seconds 
 *
 * @return fixed number in seconds
 */
RBI.Playback.prototype.getProgressInSeconds = function (aTime) {
    if (!aTime) {
        aTime = this.getProgressWatched();
    }
    var pw = parseFloat(aTime + ".0");
    return pw / 1000;
};

/**
 * CompleteWatchingTitle Response
 * Author: Stijn Asnong
 * Date: 6/14/13
 */

/*
 * Model object(Response) for CompleteWatchingTitle. The constructor takes one argument:
 * @param value - the JSON of the data service layer
 */
RBI.CompleteWatchingTitleResponse = function(value)  {
    this.value = value;
};

/**
 * Response Object of the Complete Watching Title
 * @return JSON Value of the ResultInfo
 */
RBI.CompleteWatchingTitleResponse.prototype.getResultInfo = function () {
    return this.value["ResultInfo"];
};


/**
 * SetPlaybackLocation Response
 * Author: Stijn Asnong
 * Date: 6/14/13
 */

/*
 * Model object(Response) for SetPlaybackLocation. The constructor takes one argument:
 * @param value - the JSON of the data service layer
 */
RBI.SetPlaybackLocationResponse = function(value)  {
    this.value = value;
};

/**
 * Get the HeartbeatPeriod of the set playback location response
 * @return String HeartbeatPeriod
 */
RBI.SetPlaybackLocationResponse.prototype.getHeartbeatPeriod = function () {
    return this.value["HeartbeatPeriod"];
};

/**
 * GetPlaybackLocation Response
 * Author: Stijn Asnong
 * Date: 6/14/13
 */

/*
 * Model object(Response) for GetPlaybackLocation. The constructor takes one argument:
 * @param value - the JSON of the data service layer
 */
RBI.GetPlaybackLocationResponse = function(value)  {
    this.value = value;
};

/**
 * Get the Progress Watched of the get playback location response
 * @return String ProgressWatched
 */
RBI.GetPlaybackLocationResponse.prototype.getProgressWatched = function () {
    return this.value["ProgressWatched"];
};
}());

(function initProductModel() {
	"use strict";

/*
	 * Model object for Bookmark. The constructor takes two arguments - type and value
	 * @param value - the JSON of the data service layer
	 */
RBI.Bookmark = function (value) {
	this.value = value;
    this.DateAdded = value["DateAdded"];
    this.ProductInfo = new RBI.Product(value["ProductInfo"].ProductType, value["ProductInfo"]);
};

/*
 * Abstract Model object for Product. Just a placeholder of methods
 */
RBI.AbstractProduct = function () {
};

/**
 * Getter for the product type.
 * !!! NOTE: ProductType in product has first letter capital. In Purchase options - lowercase.
 * To make code generic: lowercase all values.
 * @return String - the product type
 */
RBI.AbstractProduct.prototype.getProductType = function () {
	var productType = this.value["ProductType"];
	return  productType ? productType.toLowerCase() : productType;
};

RBI.AbstractProduct.prototype.isMovie = function () {
    return  this.getProductType() === RBI.Product.Defines.TYPE_MOVIE;
};

RBI.AbstractProduct.prototype.isGame = function () {
    return  this.getProductType() === RBI.Product.Defines.TYPE_GAME;
};

/**
 * Getter for the Actors
 * @return Array String of Actors
 */
RBI.AbstractProduct.prototype.getActors = function () {
    return this.value["Actors"];
};

/**
 * Getter for the Running time of the product
 * @return String - RunningTime
 */
RBI.AbstractProduct.prototype.getRunningTime = function () {
    return this.value["RunningTime"];
};

/**
 * Get the running time removing leading zeros and trailing seconds
 * @return String - RunningTime  hh:mm format
 */
RBI.AbstractProduct.prototype.getFormattedRunningTime = function (trimSeconds) {
    var rt = this.value["RunningTime"].replace(/^0+/, '');
    if (!trimSeconds) {
        return rt;
    }
    var n = rt.lastIndexOf(":");
    return rt.substring(0, n);

};

/**
 * Getter for the releaseYear of product 
 * @return String - releaseYear or empty string if does not exist
 */
RBI.AbstractProduct.prototype.getReleaseYear = function () {
	var result = "";
    if (this.value["ReleaseYear"]) {
        result = this.value["ReleaseYear"];
    }
	return result;
};

RBI.AbstractProduct.prototype.getProgressWatchedPercentage = function () {
    var percentage = 0;
    if (this.getProgressWatched && this.getRunningTime) {
        var progressWatched = this.getProgressWatched();
        var runningTime = this.getRunningTime();

        if (progressWatched) {
            progressWatched = parseInt(progressWatched);
        }
        if (progressWatched && runningTime) {
            var length = this.getMovieTimeInMilliseconds(runningTime);
            if (length) {
                if (this.getDateComplete && this.getDateComplete() && (this.getDateComplete() >= this.getDateLastViewed())) {
                    progressWatched = length;
                }
                percentage = Math.round(progressWatched / length * 100);
            }
        }
    }
    return percentage;
};

RBI.AbstractProduct.prototype.isCompleted = function () {
    return this.getDateLastViewed && this.getDateLastViewed() && !this.getProgressWatchedPercentage();
};

RBI.AbstractProduct.prototype.getMovieTimeInMilliseconds = function (movieLength) {
    var timeArray = (movieLength || "").split(":");
    if (timeArray && timeArray.length === 3) {
        return ((timeArray[0] * 60 * 60) + (timeArray[1] * 60) + (timeArray[2] * 1)) * 1000;
    }
    else {
        return null;
    }
};

/*
 * Get the playback data
 * @see RBI.Playback
 */
RBI.AbstractProduct.prototype.getPlaybackData = function () {
    return this.value["PlaybackData"];
};

/*
 * Get the Closed Caption
 * @return String - Closed Caption
 */
RBI.AbstractProduct.prototype.getClosedCaption = function () {
    return this.value["ClosedCaption"];
};


/*
 * Is the playback a preview
 * @see RBI.Playback
 */
RBI.AbstractProduct.prototype.isPreview = function () {
    return this.getPlaybackData() && !this.getPlaybackData().getEntitlementId();
};

/*
 * Set the playback data on the product. This would be the data from a GetPlaybackURL type of call
 * @see RBI.Playback
 */
RBI.AbstractProduct.prototype.setPlaybackData = function (playbackData) {
    this.value.PlaybackData = playbackData;
};

/**
 * Get the playback data manifest for product id
 * @return Url of the manifest for product id
 */
RBI.AbstractProduct.prototype.getPlaybackManifest = function () {
    var playbackData = this.value["PlaybackData"];
	return playbackData ? playbackData["CDNURL"] : null;
};

/**
 * Get the playback data scrubber path for product id
 * @return Url of the manifest for product id
 */
RBI.AbstractProduct.prototype.getPlaybackScrubberPath = function () {
    var playbackData = this.value["PlaybackData"];
	return playbackData ? playbackData["ScrubberPath"] : null;
};


/**
 * Get the image URL of a product purchaseOption with passing the type of image that has to be returned
 * @param type  - Type of image  for example ("thumb nail","poster",...)
 * @return String value of Image URL
 */
RBI.AbstractProduct.prototype.getImageOfType = function (type) {
    var i, images = this.value["ImageList"];
    if (!images && this.value.PurchaseOption) {
        images = this.value.PurchaseOption.ImageList;
    }
    if (images) {
        for (i = 0; i < images.length; i++) {
            if (images[i].ImageType === type) {
                return images[i].URL;
            }
        }
    }
    return null;
};

/**
 * Get the scrubber XML
 * @param type  - size of scrubber image ("320x200",...)
 * @return String of URL or null
 */
RBI.AbstractProduct.prototype.getScrubberXMLOfSize = function (aSize) {
    var i, images = this.value["ImageList"];
    var type = RBI.Product.Defines.SCRUBBER_IMAGE_PREFIX + aSize;
    if (images) {
        for (i = 0; i < images.length; i++) {
            if (images[i].ImageType === type) {
                return images[i].URL;
            }
        }
    }
    return null;
};

/**
 * Get the scrubber image URLs in array
 * @param type  - size of scrubber image ("320x200",...)
 * @return String[] of URLs for scrubber images or [] (empty array) if no scrubbers for that size
 */
RBI.AbstractProduct.prototype.getScrubbersOfSize = function (aSize) {
    var i, images = this.value["ImageList"];
    var type = RBI.Product.Defines.CHAPTER_IMAGE_PREFIX + aSize;
    var scrubbers = [];
    
    var locateFunc = function locate(array, compareFunc) {
        for (var j = 0; j < array.length; j++) {
            if (compareFunc(array[j])) {
                return j;
            }
        }
        return -1;
    };

    if (images) {
        for (var i = 0; i < images.length; i++) {
            if (images[i].ImageType.indexOf(type) > -1) {
                var idx = images[i].ImageType.lastIndexOf("_");
                images[i].time = images[i].ImageType.substring(idx + 1, images[i].ImageType.length);
                var n = images[i].time.split(":");
                var t = parseInt(n[0]) * 3600 + parseInt(n[1]) * 60 + parseInt(n[2]);
                images[i].sortTime = t;
                var foundIndex = locateFunc(scrubbers, function (element) {
                    return element.time == images[i].time;
                });
                if (foundIndex === -1) {
                    scrubbers.push(images[i]);
                }
            }
        }
    }
    var sortFunc = function compare(a, b) {
        if (a.sortTime < b.sortTime)
            return -1;
        if (a.sortTime > b.sortTime)
            return 1;
        return 0;
    };

    return scrubbers.sort(sortFunc);
};

/**
 * For rented movies, takes expiration date parameter and generates user friendly expiration message.
 */
RBI.AbstractProduct.prototype.getVODExpirationDateLabel = function (expiration) {
    var expires = new Date(expiration);
    var localTime = new Date();

    // get the timezone offset based on users current timezone
    var localOffset = localTime.getTimezoneOffset() * 60000;
    var localTimeInMilliseconds = Date.UTC(localTime.getUTCFullYear(), localTime.getUTCMonth(), localTime.getUTCDate(), localTime.getUTCHours(), localTime.getUTCMinutes(), localTime.getUTCSeconds(), localTime.getUTCMilliseconds());

    // get current time(now) and expiration time(expiresInMilliseconds) in milliseconds
    var now = localTimeInMilliseconds + localOffset;
    var expiresInMilliseconds = Date.UTC(expires.getUTCFullYear(), expires.getUTCMonth(), expires.getUTCDate(), expires.getUTCHours(), expires.getUTCMinutes(), expires.getUTCSeconds(), expires.getUTCMilliseconds())
    var reminderActionDateinMilliseconds = expiresInMilliseconds - now;

    var daysLeft = Math.floor(reminderActionDateinMilliseconds / (1000 * 60 * 60 * 24));
    var hoursLeft = Math.floor(reminderActionDateinMilliseconds / (1000 * 60 * 60));
    var minutesLeft = Math.floor(reminderActionDateinMilliseconds / (1000 * 60));

    var remindersPageVODExpiring = "Expires in ",
        remindersPageVODExpiringDays = " days",
        remindersPageVODExpiringHours = " hours",
        remindersPageVODExpiringMinutes = " minutes",
        remindersPageVODExpiringOneMinute = " minute",
        remindersPageVODExpiringOneHour = " hour";


    if (minutesLeft <= 1) {
        return (remindersPageVODExpiring + minutesLeft + remindersPageVODExpiringOneMinute);
    }
    else if (minutesLeft < 60) {
        return (remindersPageVODExpiring + minutesLeft + remindersPageVODExpiringMinutes);
    }
    else if (hoursLeft === 1) {
        return (remindersPageVODExpiring + hoursLeft + remindersPageVODExpiringOneHour);
    }
    else if (hoursLeft < 48) {
        return (remindersPageVODExpiring + hoursLeft + remindersPageVODExpiringHours);
    }
    else {
        return (remindersPageVODExpiring + daysLeft + remindersPageVODExpiringDays);
    }
}

    RBI.AbstractProduct.prototype.getTitleDetailsBadgeForGroup = function (groupName) {
        var i, object, badgesData = this.composeBadgesForTitleDetails();
        for (i = 0; i < badgesData.length; i++) {
            for (object in badgesData[i]) {
                if (object === groupName) {
                    return badgesData[i][object];
                }
            }
        }
        return null;
    };

    RBI.AbstractProduct.prototype.composeBadgesForTitleDetails = function () {
        var i, j, n, deliveryTypesLength,
            mediaFormatLength, ccsupport, targetdevice, deliveryTypes = [];

        if (this.value['Rating'] && this.value['Rating'] !== "") {
            var ratingKeyMap = {};
            ratingKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_RATING] = this.value['Rating'];
            deliveryTypes[0] = ratingKeyMap;

        }
        var formatKeyMap = {};
        formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT] = [];
        if (this.value.FormatType) {
            formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT].push(this.value.FormatType);
        }
        if (this.value['DeliveryTypes']) {
            var k = 0;
            deliveryTypesLength = this.value['DeliveryTypes'].length;
            for (i = 0; i < deliveryTypesLength; i++) {
                mediaFormatLength = this.value['DeliveryTypes'][i]['MediaFormats'].length;
                for (j = 0; j < mediaFormatLength; j++) {
                    var tempValue = this.value['DeliveryTypes'][i]['MediaFormats'][j]['FormatType'];
                    //When Blu-ray we have to append the trademark to it
                    //if (tempValue === "Blu-Ray") { tempValue = tempValue + "&trade;"; }  // removed - breaks in Angular
                    formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT][k] = tempValue;
                    k++;
                }
            }
        }

        //remove duplicates from list
        var newArray = [];
        label: for (i = 0; i < formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT].length; i++) {
            for (j = 0; j < newArray.length; j++) {
                if (newArray[j] === formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT][i]) {
                    continue label;
                }
            }
            newArray[newArray.length] = formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT][i];
        }
        formatKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT] = newArray;
        deliveryTypes[deliveryTypes.length] = formatKeyMap;

        var runningTimeKeyMap = {};
        if (this.getRunningTime() && this.getRunningTime() !== "") {
            runningTimeKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_RUNNINGTIME] = this.getRunningTime();
            deliveryTypes[deliveryTypes.length] = runningTimeKeyMap;
        }


        //Add badge for closed caption
        var ccbadge = "";
        var purlist = this.value['PurchaseOptionList'];
        if (purlist) {
            for (i = 0; i < purlist.length; i++) {
                var purtype = purlist[i].PurchaseOptionType;
                var medialist = purlist[i].MediaList;

                if (purtype === RBI.Product.Defines.PURCHASE_TYPE_BUY_HD || purtype === RBI.Product.Defines.PURCHASE_TYPE_BUY
                    || purtype === RBI.Product.Defines.PURCHASE_TYPE_RENT || purtype === RBI.Product.Defines.PURCHASE_TYPE_RENT_HD) {
                    for (n = 0; n < medialist.length; n++) {
                        ccsupport = medialist[n].CCSupported;
                        targetdevice = medialist[n].TargetDevice;
                        if ((ccsupport && targetdevice === RBI.Product.Defines.SMOOTH_HD) || (ccsupport && targetdevice === RBI.Product.Defines.SMOOTH_SD)) {
                            ccbadge = RBI.Product.Defines.CC;
                        }
                    }
                } else if (purtype === RBI.Product.Defines.DVD_RESERVATION && purtype === RBI.Product.Defines.DVD_SUBSCRIPTION) {
                    for (n = 0; n < medialist.length; n++) {
                        ccsupport = medialist[n].CCSupported;
                        targetdevice = medialist[n].TargetDevice;
                        if ((ccsupport && targetdevice === RBI.Product.Defines.SMOOTH_HD) || (ccsupport && targetdevice === RBI.Product.Defines.SMOOTH_SD)) {
                            ccbadge = RBI.Product.Defines.CC_INSTANT_ONLY;
                        }
                    }
                } else if (purtype === RBI.Product.Defines.DVD_RESERVATION) {
                    for (n = 0; n < medialist.length; n++) {
                        ccsupport = medialist[n].CCSupported;
                        targetdevice = medialist[n].TargetDevice;
                        if (ccsupport) {
                            ccbadge = RBI.Product.Defines.CC_DISC_ONLY;
                        }
                    }
                }
                else if (purtype === RBI.Product.Defines.DVD_SUBSCRIPTION) {
                    for (n = 0; n < medialist.length; n++) {
                        ccsupport = medialist[n].CCSupported;
                        targetdevice = medialist[n].TargetDevice;
                        if (ccsupport && targetdevice === RBI.Product.Defines.SMOOTH_SD) {
                            ccbadge = RBI.Product.Defines.CC;
                        }
                    }
                }
            }
        }
        if (ccbadge !== "") {
            var ccKeyMap = {};
            ccKeyMap[RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_CLOSECAPTION] = ccbadge;
            deliveryTypes[deliveryTypes.length] = ccKeyMap;
        }

        return deliveryTypes;
    };

    /*
     * Model object for Product. The constructor takes two arguments - type and value
     * @param type - a string of the product type. See RBI.Product.Defines
     * @param value - the JSON of the data service layer
     */
RBI.Product = function (type, value,count) {
    this.type = type;
    this.value = value;
    this.key = value["ProductID"];
    this.isProduct = true;
    this.postConstruct();
    this.count = count;
};

// inherit base methods
RBI.Product.prototype = new RBI.AbstractProduct();

RBI.Product.Defines = {};
// Product type constants.
RBI.Product.Defines.TYPE_MOVIE = "movie";
RBI.Product.Defines.TYPE_GAME = "game";

// Deprecated, will be deleted shortly.
RBI.Product.Defines.BADGES = ["kioskBadge", "ondemandBadge", "subscriptionBadge", "dvdBadge", "blurayBadge"];
RBI.Product.Defines.BADGE_KIOSK = "kioskBadge";
RBI.Product.Defines.BADGE_SUBSCRIPTION = "subscriptionBadge";
RBI.Product.Defines.BADGE_ONDEMAND = "ondemandBadge";
RBI.Product.Defines.BADGE_DVD = "dvdBadge";
RBI.Product.Defines.BADGE_BLURAY = "blurayBadge";

RBI.Product.Defines.MEDIA_FORMAT_TYPE_ALL = "All";
RBI.Product.Defines.MEDIA_FORMAT_TYPE_BLU_RAY = "Blu-Ray";
RBI.Product.Defines.MEDIA_FORMAT_TYPE_DVD = "DVD";
RBI.Product.Defines.MEDIA_FORMAT_TYPE_SD = "SD";
RBI.Product.Defines.MEDIA_FORMAT_TYPE_HD = "HD";

// TODO - Consider a global define between filters since availability in filters is the same
RBI.Product.Defines.DELIVERY_TYPE_KIOSK = "Kiosk";
RBI.Product.Defines.DELIVERY_TYPE_EST = "EST";
RBI.Product.Defines.DELIVERY_TYPE_VOD = "VOD";
RBI.Product.Defines.DELIVERY_TYPE_RENTBUY = "RentBuy";              // not actually a delivery type in OL but used heavily on all UIs
RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION = "Subscription";
RBI.Product.Defines.DELIVERY_TYPE_ALL = "All";

RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK = "kioskBadge";
RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION = "subscriptionBadge";
RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND = "ondemandBadge";
RBI.Product.Defines.BADGES_DELIVERY_TYPES = [RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK, RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION, RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND];

// Title details page
RBI.Product.Defines.PURCHASE_TYPE_BUY_HD = "Buy HD";
RBI.Product.Defines.PURCHASE_TYPE_BUY = "Buy";
RBI.Product.Defines.PURCHASE_TYPE_RENT = "Rent";
RBI.Product.Defines.PURCHASE_TYPE_RENT_HD = "Rent HD";
RBI.Product.Defines.PROGRESS_WATCHED = "ProgressWatched";
RBI.Product.Defines.RUNNING_TIME = "RunningTime";
 
RBI.Product.Defines.CC = "CC";
RBI.Product.Defines.CC_INSTANT_ONLY = "CC (Instant only)";
RBI.Product.Defines.CC_DISC_ONLY = "CC (Disc only)";
RBI.Product.Defines.DVD_RESERVATION = "DVD Reservation";
RBI.Product.Defines.BLURAY_RESERVATION = "Blu-ray Reservation";
RBI.Product.Defines.DVD_SUBSCRIPTION = "Subscription";

RBI.Product.Defines.SMOOTH_SD = "SMOOTH_SD";
RBI.Product.Defines.SMOOTH_HD = "SMOOTH_HD";

//Target Devices
RBI.Product.Defines.TARGETDEVICE_SMOOTH = ["SMOOTH_SD","SMOOTH_HD"];
RBI.Product.Defines.TARGETDEVICE_HLS_SM = ["HLS_SM_HD", "HLS_SM_HD"];
RBI.Product.Defines.TARGETDEVICE_IPHONE = ["iPHONE"];

RBI.Product.Defines.DELIVERY_TYPE_TO_BADGE_MAP = {
    "Kiosk": RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK,
    "EST": RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND,
    "VOD": RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND,
    "RentBuy": RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND,
    "Subscription": RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION
};

RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD = "dvdBadge";
RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY = "blurayBadge";
RBI.Product.Defines.BADGES_MEDIA_FORMATS = [RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD, RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY];

RBI.Product.Defines.MEDIA_FORMAT_TO_BADGE_MAP = {
    "DVD": RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD,
    "Blu-Ray": RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY
};

RBI.Product.Defines.BADGE_AVAILABILITY_COMING_SOON = "comingSoonBadge";
RBI.Product.Defines.BADGE_AVAILABILITY_LEAVING_SOON = "leavingSoonBadge";
RBI.Product.Defines.BADGE_AVAILABILITY_NEW_RELEASE = "newReleaseBadge";

RBI.Product.Defines.THUMBNAIL_IMAGE_TYPE = "thumb nail";
RBI.Product.Defines.POSTER_IMAGE_TYPE = "poster";
RBI.Product.Defines.POSTER_SECURE_IMAGE_TYPE = "poster_secure";
RBI.Product.Defines.BOXCOVER_IMAGE_TYPE = "box cover";
RBI.Product.Defines.HIRES_IMAGE_TYPE = "high res";
RBI.Product.Defines.IHIRES_IMAGE_TYPE = "ihigh res";
RBI.Product.Defines.IHIRES_SECURE_IMAGE_TYPE = "ihigh res_secure";
RBI.Product.Defines.WEB_IMAGE_TYPES = "thumb nail,poster,box cover";
RBI.Product.Defines.SCRUBBER_IMAGE_PREFIX = "scrubber image_";
RBI.Product.Defines.CHAPTER_IMAGE_PREFIX = "chapter_";

RBI.Product.Defines.PURCHASEGROUP_TYPE_DIGITAL = "Digital";
RBI.Product.Defines.PURCHASEGROUP_TYPE_DISC = "Disc";
RBI.Product.Defines.PURCHASEGROUP_TYPE_RENT_BUY = "Rent&Buy";

RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_RATING = "Rating";
RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_FORMAT = "Format";
RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_RUNNINGTIME = "RunningTime";
RBI.Product.Defines.PRODUCTDETAIL_GROUPBADGE_CLOSECAPTION = "CloseCaption";

/*
 * Execute after constructor. Subclasses do something more interesting
 */
RBI.Product.prototype.postConstruct = function () {

};

/**
 * Getter for the ProductID
 * @return String value of product ID
 */
RBI.Product.prototype.getProductID = function () {
    return this.key;
};

/**
 * Getter for the product altcode
 * @return String value of product altcode
 */
RBI.Product.prototype.getAltCode = function () {
    return this.value["AltCode"];
};

/**
 * Getter for the product title
 * @return String value of product Title
 */
RBI.Product.prototype.getTitle = function () {
    return this.value["Title"];
};

RBI.Product.prototype.getSEOURL = function () {
    return this.value["SEOURL"];
};

/**
 * Getter for the Long description of the product
 * @return String value of Product Long Description
 */
RBI.Product.prototype.getLongDescription = function () {
    return this.value["LongDescription"];
};

/**
 * Getter for the Short description of the product
 * @return String value of Product Short Description
 */
RBI.Product.prototype.getShortDescription = function () {
    return this.value["ShortDescription"];
};

/**
 * Getter for the DeliveryType of the product
 * @return a comma delimited string of delivery types
 */
RBI.Product.prototype.getDeliveryType = function () {
    return this.value["DeliveryType"];
};

/**
 * Getter for the DeliveryType MediaFormat of the product by a specific mediaFormatType
 * @return MediaFormat Object
 */
RBI.Product.prototype.getMediaFormatByMediaFormatType = function (mediaFormatType) {
    var i, j, mediaFormat = null;
    var deliveryTypes = this.getDeliveryTypes();
    for (i in deliveryTypes) {
        var mediaFormats = deliveryTypes[i]["MediaFormats"];
        for (j in mediaFormats) {
            if (mediaFormatType === mediaFormats[j]["FormatType"]) {
                return mediaFormats[j];
            }
        }
    }
    return null;
};

/**
 * Getter for the DeliveryType of the product
 * @return an array of delivery type objects
 */
RBI.Product.prototype.getDeliveryTypes = function () {
    return this.value["DeliveryTypes"];
};


/**
 * Getter for the Product Genres
 * @return Array String of Genres
 */
RBI.Product.prototype.getGenres = function () {
    return this.value["Genres"];
};

/**
 * Getter for the BlackoutIndicator
 * @return boolean of BlackoutIndicator
 */
RBI.Product.prototype.isBlackoutIndicator = function () {
    return this.value["BlackoutIndicator"];
};

/**
 * Getter for the BlackoutWindowStart
 * @return Array String of BlackoutWindowStart
 */
RBI.Product.prototype.getBlackoutWindowStart = function () {
    return this.value["BlackoutWindowStart"];
};

/**
 * Getter for the BlackoutWindowEnd
 * @return Array String of BlackoutWindowEnd
 */
RBI.Product.prototype.getBlackoutWindowEnd = function () {
    return this.value["BlackoutWindowEnd"];
};

/**
 * Getter for the Actors as a list
 * @return JSON List of Actors
 */
RBI.Product.prototype.getActorsAsList = function () {
    var i, actors = this.value["Actors"];
    var jsonActors;
    var actorsString = "[";
    for (i = 0; i < actors.length; i++) {
        if(i !== 0)  {
            actorsString = actorsString + ",";
        }
        actorsString = actorsString + "{ \"name\": \""+actors[i]+"\" }";
    }
    actorsString = actorsString + "]";
    jsonActors = JSON.parse(actorsString);
    return jsonActors;
};

/**
 * Getter for the Directors
 * @return Array String of directors
 */
RBI.Product.prototype.getDirectors = function () {
    return this.value["Directors"];
};

/**
 * Getter for the "high res" type Image URL
 * @return String url of the image
 */
RBI.Product.prototype.getHighResImage = function () {
    return this.getImageOfType(RBI.Product.Defines.HIRES_IMAGE_TYPE);
};

/**
 * Getter for the "box cover" type Image URL
 * @return String url of the image
 */
RBI.Product.prototype.getBoxCoverImage = function () {
    return this.getImageOfType(RBI.Product.Defines.BOXCOVER_IMAGE_TYPE);
};

/**
 * Getter for the "thumb nail" type Image URL
 * @return String url of the image
 */
RBI.Product.prototype.getThumbnailImage = function () {
    return this.getImageOfType(RBI.Product.Defines.THUMBNAIL_IMAGE_TYPE);
};

/**
 * Getter for the scrubber image
 * @return String url of the image
 */
RBI.Product.prototype.getScrubberImage = function (aSize, aTime) {
    // TODO - really a hack. OL does not guarantee this will be the imageType
    return this.getImageOfType("chapter_"+aSize+"_"+aTime);
};

/**
 * Getter for the product Rating
 * @return String Rating of the product
 */
RBI.Product.prototype.getRating = function () {
    return this.value["Rating"];
};

/**
 * Does the product match passed genre
 * @return boolean true if matched, false otherwise
 */
RBI.Product.prototype.matchGenre = function (genre) {
    var i, genres = this.getGenres();
    console.log(genres);
    for (i in genres) {
        if (genres[i] === genre) {
            return true;
        }
    }
    return false;
};

/**
 * Getter for IsBookmarkedFlag (True or False)
 */
RBI.Product.prototype.getIsBookmarked = function () {
	var result;
	if (this.value["IsBookmarked"] === undefined || this.value["IsBookmarked"] === null) {
		result = false;
	} else {
		result = this.value["IsBookmarked"].toUpperCase() === 'TRUE';
	}
	return result;
};

/**
 * Get the PurchaseOption Object by Type
 * @param type  possible values(Rent,Rent HD, Buy, Buy HD, Subscription)
 * @return JSON Object of purchaseOption
 */
RBI.Product.prototype.getPurchaseOptionForType = function(type) {
    var i, list = this.value["PurchaseOptionList"];
    var purchaseOption = null;
    for(i in list){
        if (list[i].PurchaseOptionType === type) {
            purchaseOption = new RBI.PurchaseOption(list[i]);
        }
    }
    return purchaseOption;
};

RBI.Product.prototype.getPurchaseOptionForPurchaseOptionId = function(purchaseOptionId) {
    var i, list = this.value["PurchaseOptionList"];
    var purchaseOption = null;
    for(i in list){
        if (list[i].PurchaseOptionID === purchaseOptionId) {
            purchaseOption = new RBI.PurchaseOption(list[i]);
        }
    }
    return purchaseOption;
};

RBI.Product.prototype.getPurchaseOptionForDeliveryTypeAndMediaFormat = function(deliveryType, mediaFormat) {
    var i, list = this.value["PurchaseOptionList"];
    var result = null;
    for(i in list){
		var purchaseOption = new RBI.PurchaseOption(list[i]);
		if (purchaseOption.getDeliveryType() === deliveryType && purchaseOption.getMediaFormat() === mediaFormat) {
            result = purchaseOption;
        }
    }
    return result;
};

/**
 * Get the PurchaseOption ID by Type
 * @param type  possible values(Rent,Rent HD, Buy, Buy HD, Subscription)
 * @return String - purchaseOptionID
 */
RBI.Product.prototype.getPurchaseOptionIDForType = function(type) {
    var purchaseOption = this.getPurchaseOptionForType(type);
    if (!purchaseOption) {
        return null;
    }
    return purchaseOption.getPurchaseOptionID();
};

//TODO: Hardcoded Values in here - they do not belong here
/**
 * Get the playback Data (Combine purchaseOptionID with playbackData
 * @param type  - possible values(Rent,Rent HD, Buy, Buy HD, Subscription)
 * @return JSON of playbackData
 */
RBI.Product.prototype.getPlaybackURLData = function (type) {
    if (!type) {
        type = "Subscription";
    }
    // TODO - check ProductId and if it can be made consistent to ProductID
    return {
		ProductId: this.key,
		PurchaseOptionID: this.getPurchaseOptionIDForType(type),
		DeviceID: RBI.PlatformConfig.deviceId,
		DeviceSpec: RBI.PlatformConfig.deviceSpec
    };
};

/**
 * Getter for recommended Products
 * @return JSON of recommended Products
 */
RBI.Product.prototype.getRecommendedProducts = function () {
    return this.value["RecommendedProducts"];
};

/**
* Setter for recommended Products
* @param products - List of recommended products
*/
RBI.Product.prototype.setRecommendedProducts = function (products) {
    this.value["RecommendedProducts"] = products;
};

RBI.Product.prototype.hasDeliveryType = function (deliveryType) {
	var result;
    if (deliveryType === RBI.Product.Defines.DELIVERY_TYPE_ALL) {
        result = true;
    } else {
        result = this.getDeliveryType().indexOf(deliveryType) !== -1;
    }
	return result;
};

RBI.Product.prototype.getDeliveryTypeBadges = function () {
    var i, badge, deliveryType, deliveryTypeList = this.value["DeliveryTypes"];

    // Lazy initialization.
    if (!this.deliveryTypeBadges) {
        var badges = [];

        for (i in deliveryTypeList) {
            deliveryType = deliveryTypeList[i];
            badge = RBI.Product.Defines.DELIVERY_TYPE_TO_BADGE_MAP[deliveryType.TypeValue];

            if (badge && badges.indexOf(badge) < 0) {
                badges.push(badge);
            }
        }

        this.deliveryTypeBadges = badges;
    }

    return this.deliveryTypeBadges;
};

RBI.Product.prototype.getMediaFormatBadges = function () {
    // Lazy initialization.
    if (!this.mediaFormatBadges) {
        var i, j,
            badge,
            badges = [],
            mediaFormat,
            deliveryType,
            deliveryTypeList = this.value["DeliveryTypes"];

        // Iterate over all delivery types to get all mediaformats.
        for (i in deliveryTypeList) {
            deliveryType = deliveryTypeList[i];

            // Iterate over mediaformats to get badge and check in stock information.
            // BTW: server sends InStock=null if there is not kiosk selected.
            for (j in deliveryType.MediaFormats) {
                mediaFormat = deliveryType.MediaFormats[j];
                if (mediaFormat.InStock != "false" && mediaFormat.InStock != "FALSE") {
                    badge = RBI.Product.Defines.MEDIA_FORMAT_TO_BADGE_MAP[mediaFormat.FormatType];

                    if (badge && badges.indexOf(badge) < 0) {
                        badges.push(badge);
                    }
                }
            }
        }

        this.mediaFormatBadges = badges;
    }

    return this.mediaFormatBadges;
};

// TODO - code needs to be fixed to make methods to handle bad boolean values
RBI.Product.prototype.getAvailabilityBadges = function () {
    var i, j, badge, mediaFormat, mediaFormatList, deliveryTypeList = this.value["DeliveryTypes"];

    // Lazy initialization.
    if (!this.availabilityBadges) {
        this.availabilityBadges = [];

        // TODO: Soumitra is still clarifying logic around these fields.
        // "Coming Soon", "Last Chance", "Now available".
        var isCommingSoon = null, isLeaving = false, isNewRelease = false;

        for (i in deliveryTypeList) {
            mediaFormatList = deliveryTypeList[i].MediaFormats;
            for (j in mediaFormatList) {
                mediaFormat = mediaFormatList[j];

                if (mediaFormat.IsComingSoon.toUpperCase() === "TRUE" && isCommingSoon === null) {
                    isCommingSoon = true;
                } else {
                    isCommingSoon = false;
                }

                if (mediaFormat.IsLeaving.toUpperCase() === "TRUE") {
                    isLeaving = true;
                }

                if (mediaFormat.IsNewRelease.toUpperCase() === "TRUE") {
                    isNewRelease = true;
                }
            }
        }

        if (isCommingSoon) {
            this.availabilityBadges.push(RBI.Product.Defines.BADGE_AVAILABILITY_COMING_SOON);
        }
        if (isLeaving) {
            this.availabilityBadges.push(RBI.Product.Defines.BADGE_AVAILABILITY_LEAVING_SOON);
        }
        if (isNewRelease) {
            this.availabilityBadges.push(RBI.Product.Defines.BADGE_AVAILABILITY_NEW_RELEASE);
        }
    }

    return this.availabilityBadges;
};

RBI.Product.prototype.getSubtitleList = function () {
    return this.value["SubtitleList"];
};

RBI.Product.prototype.getStudio = function () {
    return this.value["Studio"];
};

RBI.Product.prototype.getFormat = function () {
    var temp = this.value["PurchaseOptionList"] || [];
    return temp.length > 0 ? temp[0]['MediaList'][0]['ScreenFormat'] : "";
};

RBI.Product.prototype.getMedia = function (purchaseOptionID, componentID) {
    var i, purchaseOption = this.getPurchaseOptionForPurchaseOptionId(purchaseOptionID);
    if (purchaseOption) {
        var mediaList = purchaseOption.getMediaList();
        for (i in mediaList) {
            var media = mediaList[i];
            if (media.getComponentID() === componentID) {
                return media;
            }
        }

    }
    return null;
};

RBI.Product.prototype.getPlatform = function () {
    return this.value["Platform"];

};

RBI.Product.prototype.getBadgesForTitleDetails = function () {
    var badgesData = this.composeBadgesForTitleDetails();
    var badges = [];
    try
    {
    for (var i = 0; i < badgesData.length; i++) {
        for (var object in badgesData[i]) {
            if( i == 1)   //For the formats there can be inner details
            {
                for(var innerLoopForFormat = 0; innerLoopForFormat < badgesData[1].Format.length;innerLoopForFormat++)
                {
                    badges.push(badgesData[1].Format[innerLoopForFormat]);
                }
            }
            else   //For the other details there can be single level of detail
            {
                badges.push(badgesData[i][object]);
            }
        }
    }
    }
    catch(obj)
    {}
    return badges;
};

RBI.Product.prototype.getPreviewList = function () {
    return this.value["PreviewList"];
};

RBI.Product.prototype.getExpiresDate = function () {
	var m, purchaseOptns = this.value["PurchaseOptionList"];
    var expiresOn = "";
    var isBuy = false;
    var expireDate;
    var rentHD = false;
    var buyHD = false;
    var buyOnly = false;
	for (m = 0; m < purchaseOptns.length; m++) {
		if (purchaseOptns[m].BillingTransaction === "true") {
			if (!expireDate || new Date(purchaseOptns[m].Expires) > expireDate) {
				if (purchaseOptns[m].PurchaseOptionType && purchaseOptns[m].PurchaseOptionType.indexOf("Buy HD") > -1) {
					buyHD = true;
					expireDate = "";
					break;
				} else if (!buyHD && !rentHD && purchaseOptns[m].PurchaseOptionType && purchaseOptns[m].PurchaseOptionType.indexOf("Buy") > -1) {
					expireDate = "";
					buyOnly = true;
				} else if (purchaseOptns[m].PurchaseOptionType && purchaseOptns[m].PurchaseOptionType.indexOf("Rent HD") > -1) {
					rentHD = true;
					expireDate = new Date(purchaseOptns[m].Expires);
				} else if (!buyOnly) {//Rent
					expireDate = new Date(purchaseOptns[m].Expires);
				}
			}
		}
	}
    return expireDate;
};


RBI.Product.prototype.getPreviewUrl = function (targetDevice) {
    var i, list = this.value['PreviewList'];
    for (i in list) {
        if (list[i].TargetDevice === targetDevice) {
            return list[i].URL;
        }
    }
    return null;
};

RBI.Product.prototype.hasPreview = function (targetDevice) {
    return this.value['PreviewList'].length > 0;
};

/**
 * Get all the Purchase options that are returned
 * @return {Array}
 */
RBI.Product.prototype.getPurchaseOptionsList = function () {
    var i, purchaseOptionList = this.value["PurchaseOptionList"];
    if (!this.purchaseOptionListModel) {
        this.purchaseOptionListModel = [];
        for (i = 0; i < purchaseOptionList.length; i++) {
            var purchaseOption =  new RBI.PurchaseOption(purchaseOptionList[i]);
            this.purchaseOptionListModel.push(purchaseOption);
        }
    }
    return this.purchaseOptionListModel;
};

/**
 * Get purchaseOption that is the primary ranked as billed  - is watchable
 * @param targetDevice - Target Device like (look at the defines with prefix RBI.Product.Defines.TARGETDEVICE)
 * @return {*}
 */
RBI.Product.prototype.getPrimaryBilledPurchaseOption = function (targetDevice) {
    var i, result = null,
        purchaseOption, isBilledTransaction, isTargetDeviceSupported,
        purchaseOptionList = this.getPurchaseOptionsList();

    for (i in purchaseOptionList) {
        purchaseOption = purchaseOptionList[i];
        isBilledTransaction = RBI.Util.returnBoolean(purchaseOption.getBillingTransaction());
        isTargetDeviceSupported = purchaseOption.isTargetDeviceSupported(targetDevice);

        if (isBilledTransaction && isTargetDeviceSupported) {
            result = purchaseOption;
            if (purchaseOption.isHD()) {
                // If billed purchase option is HD, exit the loop, we found result.
                // If SD, continue, probably user also has HD purchased.
                break;
            }
        }
    }
    return result;
};

/**
 * Get All The Available purchaseOptions that is not watchable - not billed yet
 *           These will options that the user can still do actions on
 * @param targetDevice - Target Device like (look at the defines with prefix RBI.Product.Defines.TARGETDEVICE)
 * @param PurchaseGroupType - pass in the group name of the purchase you want to get a list from 
 *                              (look at the defines with prefix RBI.Product.Defines.PURCHASEGROUP_TYPE)
 * @return {*}
 */
RBI.Product.prototype.getAvailablePurchaseOptions = function (targetDevice, purchaseGroupType) {
    var i, j, purchaseOptionListRanked = this.getRankedPurchaseOptions(targetDevice, purchaseGroupType);
    purchaseOptionListRanked = RBI.Util.sortObject(purchaseOptionListRanked, 'priority');
    var purchaseOptionsAvailable = [];

    if (RBI.Product.Defines.PURCHASEGROUP_TYPE_DIGITAL === purchaseGroupType ||
        RBI.Product.Defines.PURCHASEGROUP_TYPE_RENT_BUY === purchaseGroupType) {
        var purchaseOptionsAvailableTemp = [];
        for (i in purchaseOptionListRanked) {
            if (!RBI.Util.returnBoolean(purchaseOptionListRanked[i].getBillingTransaction())) {
                purchaseOptionsAvailable.push(purchaseOptionListRanked[i]);
            } else {
                purchaseOptionsAvailableTemp = [];
                for (j in purchaseOptionsAvailable) {
                    if (1 === purchaseOptionsAvailable[j].getPriority()) {
                        purchaseOptionsAvailableTemp.push(purchaseOptionsAvailable[j]);
                    }
                }
                purchaseOptionsAvailable = purchaseOptionsAvailableTemp;
            }
        }
    } else if (RBI.Product.Defines.PURCHASEGROUP_TYPE_DISC === purchaseGroupType) {
        for (i in purchaseOptionListRanked) {
            var mediaFormatType = purchaseOptionListRanked[i].getMediaFormat();
            var mediaFormat = this.getMediaFormatByMediaFormatType(mediaFormatType);
            if (!RBI.Util.returnBoolean(mediaFormat["IsComingSoon"]) &&
                (!mediaFormat["InStock"] || (mediaFormat["InStock"] && RBI.Util.returnBoolean(mediaFormat["InStock"])))) {
                purchaseOptionsAvailable.push(purchaseOptionListRanked[i]);
            }
        }
    }
    
    return purchaseOptionsAvailable;
};


/**
 * Get all the Digital PurchaseOptions that will be ranked on priority  for a specified targetDevice
 * @param targetDevice      - Target Device like (look at the defines with prefix RBI.Product.Defines.TARGETDEVICE)
 * @param PurchaseGroupType - pass in the group name of the purchase you want to get a list from 
 *                              (look at the defines with prefix RBI.Product.Defines.PURCHASEGROUP_TYPE)
 * @return {*}
 */
RBI.Product.prototype.getRankedPurchaseOptions = function (targetDevice,purchaseGroupType) {
    var i, purchaseOptionListRanked = [];
    var purchaseOptionList = this.getPurchaseOptionsList();
    for(i in purchaseOptionList){
        var purchaseOption = purchaseOptionList[i];
        var purchaseOptionType = purchaseOption.getPurchaseOptionType();
        if (RBI.Product.Defines.PURCHASEGROUP_TYPE_DISC === purchaseGroupType) {
            //priority 2 - 1 / 2 is lowest and 1 is highest
            if (purchaseOptionType.toLowerCase().match('blu-ray reservation') !== null) {
                purchaseOption.priority = 2;
                purchaseOptionListRanked.push(purchaseOption);
            }
            else if (purchaseOptionType.toLowerCase().match('dvd reservation') !== null) {
                purchaseOption.priority = 1;
                purchaseOptionListRanked.push(purchaseOption);
            }
        }

        if (RBI.Product.Defines.PURCHASEGROUP_TYPE_DIGITAL === purchaseGroupType ||
            RBI.Product.Defines.PURCHASEGROUP_TYPE_RENT_BUY === purchaseGroupType) {
            //priority 5 - 1 / 5 is lowest and 1 is highest
            if ((purchaseOption.isTargetDeviceSupported(targetDevice)
                && purchaseOptionType.toLowerCase().match('hd') !== null)
                && (purchaseOptionType.toLowerCase().match('buy') !== null)) {
                purchaseOption.priority = 5;
                purchaseOptionListRanked.push(purchaseOption);
            }
            else if ((purchaseOption.isTargetDeviceSupported(targetDevice)
                && purchaseOptionType.toLowerCase().match('buy') !== null)) {
                purchaseOption.priority = 4;
                purchaseOptionListRanked.push(purchaseOption);
            }
            else if ((purchaseOption.isTargetDeviceSupported(targetDevice)
            && purchaseOptionType.toLowerCase().match('hd') !== null)
            && (purchaseOptionType.toLowerCase().match('rent') !== null)) {
                purchaseOption.priority = 3;
                purchaseOptionListRanked.push(purchaseOption);
            }
            else if ((purchaseOption.isTargetDeviceSupported(targetDevice)
                && purchaseOptionType.toLowerCase().match('rent') !== null)) {
                purchaseOption.priority = 2;
                purchaseOptionListRanked.push(purchaseOption);
            }
            else if (purchaseOption.isTargetDeviceSupported(targetDevice)
                && purchaseOptionType.toLowerCase().match('subscription') !== null &&
                RBI.Product.Defines.PURCHASEGROUP_TYPE_RENT_BUY !== purchaseGroupType) {
                purchaseOption.priority = 1;
                purchaseOptionListRanked.push(purchaseOption);
            }
        }
    }
    return purchaseOptionListRanked;
};

RBI.Product.prototype.getProgressWatched = function(){
    return this.value[RBI.Product.Defines.PROGRESS_WATCHED];
};

RBI.Product.prototype.isVOD = function(){
	return this.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND) >= 0;
};
RBI.Product.prototype.isSubscription = function() { 
	return this.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION) >= 0;
};
RBI.Product.prototype.isKiosk = function() {
	return this.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK) >= 0;
};
RBI.Product.prototype.isDVD = function() { 
	return this.getMediaFormatBadges().indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD) >= 0;
};
RBI.Product.prototype.isBluRay=function() { 
	return this.getMediaFormatBadges().indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY) >= 0;
};

RBI.Product.prototype.isComingSoon = function(){ 
	return this.getAvailabilityBadges().indexOf(RBI.Product.Defines.BADGE_AVAILABILITY_COMING_SOON) >= 0;
};
RBI.Product.prototype.isLeavingSoon = function(){
	return this.getAvailabilityBadges().indexOf(RBI.Product.Defines.BADGE_AVAILABILITY_LEAVING_SOON) >= 0;
};
RBI.Product.prototype.newRelease = function() {
	return this.getAvailabilityBadges().indexOf(RBI.Product.Defines.BADGE_AVAILABILITY_NEW_RELEASE) >= 0;
};
RBI.Product.prototype.isHD = function () {
    return this.value["MediaFormat"].indexOf("HD") !== -1;
};

// ZOE-30494 - Get CanWatchNow flag
RBI.Product.prototype.getCanWatchNow = function () {
    var canWatchNow = this.value['CanWatchNow'];
    if (canWatchNow != null && canWatchNow.toLowerCase() == 'true') {
       return true;
    }
    else {
       return false;
    }
}


/**
 * Media Model
 * @param value
 * @constructor
 */
RBI.Media = function (value) {
    this.value = value;
};

RBI.Media.prototype.getAspectRatio = function () {
    return this.value["AspectRatio"];
};

RBI.Media.prototype.isCCSupported = function () {
    return this.value["CCSupported"];
};

RBI.Media.prototype.getComponentID = function () {
    return this.value["ComponentID"];
};

RBI.Media.prototype.getScreenFormat = function () {
    return this.value["ScreenFormat"];
};

RBI.Media.prototype.getTargetDevice = function () {
    return this.value["TargetDevice"];
};


RBI.PurchaseOption = function (value) {
    this.value = value;
    this.badges = {};
    this.isProduct = false;
    this.postConstruct();
};

// inhereit base methods
RBI.PurchaseOption.prototype = new RBI.AbstractProduct();

RBI.PurchaseOption.Defines = {};
RBI.PurchaseOption.Defines.BLURAY_RESERVATION = "Blu-ray Reservation";
RBI.PurchaseOption.Defines.DVD_RESERVATION = "DVD Reservation";
RBI.PurchaseOption.Defines.TYPE_BUY_HD = "Buy HD";
RBI.PurchaseOption.Defines.TYPE_BUY = "Buy";
RBI.PurchaseOption.Defines.TYPE_RENT_HD = "Rent HD";
RBI.PurchaseOption.Defines.TYPE_RENT = "Rent";
RBI.PurchaseOption.Defines.TYPE_SUBSCRIPTION = "Subscription";

/*
 * Execute after constructor. Subclasses do something more interesting
 */
RBI.PurchaseOption.prototype.postConstruct = function () {

};

RBI.PurchaseOption.prototype.getBillingTransaction = function () {
	return this.value.BillingTransaction && this.value.BillingTransaction.toLowerCase() === "true";
};

RBI.PurchaseOption.prototype.setBillingTransaction = function (billingTransaction) {
	return this.value.BillingTransaction = !!billingTransaction ? "true" : "false";
};

RBI.PurchaseOption.prototype.getDateComplete = function () {
	return this.value.DateComplete ? new Date(this.value.DateComplete) : null;
};

RBI.PurchaseOption.prototype.getDateLastViewed = function () {
	return this.value.DateLastViewed ? new Date(this.value.DateLastViewed) : null;
};

RBI.PurchaseOption.prototype.getDateStarted = function () {
	return this.value.DateStarted;
};

RBI.PurchaseOption.prototype.getPriority = function () {
    return this.priority;
};

RBI.PurchaseOption.prototype.getExpires = function () {
	return this.value.Expires;
};

RBI.PurchaseOption.prototype.getIsLeaving = function () {
    return this.value['IsLeaving'] && this.value['IsLeaving'].toLowerCase() === "true";
};

/*
 * Build the media list as an object model 
 * @return Media[] 
 */
RBI.PurchaseOption.prototype.getMediaList = function () {
	var index;
    if (this.mediaListModel) {
        return this.mediaListModel;
    }
    var mediaListData = this.value["MediaList"];
    this.mediaListModel = [];
    for(index in mediaListData){
        this.mediaListModel.push(new RBI.Media(mediaListData[index]));
    }
    return this.mediaListModel;
};


/*
 * Get the media object given a component id
 * @return Media or null 
 */
RBI.PurchaseOption.prototype.getMediaForComponentId = function (componentId) {
    var index, mediaList = this.getMediaList();
    for (index in mediaList) {
        if (mediaList[index].getComponentID() === componentId) {
            return mediaList[index];
        }
    }
    return null;
};

RBI.PurchaseOption.prototype.isCCSupportedForTargetDevice = function (targetDevice) {
    var index, mediaList = this.getMediaList();
    for (index in mediaList) {
        if (RBI.Util.arrayContainsIgnoreCase.call(targetDevice, mediaList[index].getTargetDevice().toLowerCase())
            && mediaList[index].isCCSupported()){
            return true;
        }
    }
    return false;
};

RBI.PurchaseOption.prototype.isTargetDeviceSupported = function (targetDevice) {
    var index, mediaList = this.getMediaList();
    for(index in mediaList){
        var mediaListTargetDevice = mediaList[index].getTargetDevice();
        if (mediaListTargetDevice) {
            if (RBI.Util.arrayContainsIgnoreCase.call(targetDevice, mediaListTargetDevice.toLowerCase())) {
                return true;
            }
        }
    }
    return false;
};

RBI.PurchaseOption.prototype.getPrice = function () {
	return this.value.Price;
};
RBI.PurchaseOption.prototype.getProgressWatched = function () {
	return this.value.ProgressWatched;
};
RBI.PurchaseOption.prototype.getPurchaseOptionID = function () {
	return this.value.PurchaseOptionID;
};
RBI.PurchaseOption.prototype.getPurchaseOptionName = function () {
	return this.value.PurchaseOptionName;
};
RBI.PurchaseOption.prototype.getPurchaseOptionType = function () {
	return this.value.PurchaseOptionType;
};
RBI.PurchaseOption.prototype.getDeliveryTypeValue = function () {
	switch (this.value.PurchaseOptionType) {
		// Kiosk
		case RBI.PurchaseOption.Defines.BLURAY_RESERVATION:
		case RBI.PurchaseOption.Defines.DVD_RESERVATION:
			return RBI.Product.Defines.DELIVERY_TYPE_KIOSK;
		// Buy
		case RBI.PurchaseOption.Defines.TYPE_BUY_HD:
		case RBI.PurchaseOption.Defines.TYPE_BUY:
			return RBI.Product.Defines.DELIVERY_TYPE_EST;
		// Rent
		case RBI.PurchaseOption.Defines.TYPE_RENT_HD:
		case RBI.PurchaseOption.Defines.TYPE_RENT:
			return RBI.Product.Defines.DELIVERY_TYPE_VOD;
		// Subscription
		case RBI.PurchaseOption.Defines.TYPE_SUBSCRIPTION:
			return RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION;
		default:
			throw new Error("Unsupported PurchaseOptionType: " + this.value.PurchaseOptionType);
	}
};
RBI.PurchaseOption.prototype.getMediaFormat = function () {
	switch (this.value.PurchaseOptionType) {
		// Kiosk
		case RBI.PurchaseOption.Defines.BLURAY_RESERVATION:
			return RBI.Product.Defines.MEDIA_FORMAT_TYPE_BLU_RAY;
		case RBI.PurchaseOption.Defines.DVD_RESERVATION:
			return RBI.Product.Defines.MEDIA_FORMAT_TYPE_DVD;
		// HD
		case RBI.PurchaseOption.Defines.TYPE_BUY_HD:
		case RBI.PurchaseOption.Defines.TYPE_RENT_HD:
			return "HD";
		// SD
		case RBI.PurchaseOption.Defines.TYPE_BUY:
		case RBI.PurchaseOption.Defines.TYPE_RENT:
		case RBI.PurchaseOption.Defines.TYPE_SUBSCRIPTION:
			return "SD";
		default:
			throw new Error("Unsupported PurchaseOptionType: " + this.value.PurchaseOptionType);
	}
};

RBI.PurchaseOption.prototype.getTitle = function () {
    return this.value["Title"];
};

/**
 * Getter for the product id of the purchaseOption
 * @return String - the product id
 */
RBI.PurchaseOption.prototype.getProductID = function () {
    return this.value["ProductID"];
};

/**
 * Is HD available
 * @return boolean true or false
 */
RBI.PurchaseOption.prototype.isHD = function () {
    return this.value["PurchaseOptionType"].toLowerCase().match('hd') !== null;
};

/**
 * Is SD available
 * @return boolean true or false
 */
RBI.PurchaseOption.prototype.isSD = function () {
    return !this.isHD();
};

/**
 * Getter for the purchaseOption Rating
 * @return String Rating of the purchaseOption
 */
RBI.PurchaseOption.prototype.getRating = function () {
    return this.value["Rating"];
};

/**
 * Getter for the DeliveryType of the product
 * @return a comma delimited string of delivery types
 */
RBI.PurchaseOption.prototype.getDeliveryType = function () {
    return this.value["DeliveryTypeValue"];
};


RBI.PurchaseOption.prototype.getDeliveryTypeBadges = function () {
    var i, badge, deliveryType, deliveryTypeList = this.value["DeliveryTypes"], deliveryTypeValue = [this.value["DeliveryTypeValue"]];

    // Lazy initialization.
    if (!this.deliveryTypeBadges) {
        var badges = [];
        if (!deliveryTypeList) {
            badge = RBI.Product.Defines.DELIVERY_TYPE_TO_BADGE_MAP[deliveryTypeValue];
            if (badge && badges.indexOf(badge) < 0) {
                badges.push(badge);
            }
        } else {
            for (i in deliveryTypeList) {
                deliveryType = deliveryTypeList[i];
                badge = RBI.Product.Defines.DELIVERY_TYPE_TO_BADGE_MAP[deliveryType.TypeValue];

                if (badge && badges.indexOf(badge) < 0) {
                    badges.push(badge);
                }
            }
        }

        this.deliveryTypeBadges = badges;
    }

    return this.deliveryTypeBadges;
};

RBI.PurchaseOption.prototype.hasKioskBadge = function () {
    return this.badges[RBI.Product.Defines.BADGE_KIOSK];
};

RBI.PurchaseOption.prototype.hasDvdBadge = function () {
    return this.badges[RBI.Product.Defines.BADGE_DVD];
};

RBI.PurchaseOption.prototype.hasBlurayBadge = function () {
    return this.badges[RBI.Product.Defines.BADGE_BLURAY];
};

RBI.PurchaseOption.prototype.hasOndemandBadge = function () {
    return this.badges[RBI.Product.Defines.BADGE_ONDEMAND];
};

RBI.PurchaseOption.prototype.hasSubscriptionBadge = function () {
    return this.badges[RBI.Product.Defines.BADGE_SUBSCRIPTION];
};

RBI.Product.prototype.getPurchaseOptionsForWatchNowButton = function(kioskSelected) {
    // If user purchased/subscribed here we get purchase option with higher quality/priority.
    var primaryBilledPurchaseOption = this.getPrimaryBilledPurchaseOption(RBI.Product.Defines.TARGETDEVICE_SMOOTH);
    // Array with all purchase options we are going to render.
    var buttonPurchaseOptions = primaryBilledPurchaseOption ? [primaryBilledPurchaseOption] : [];

    var moreToWatchDigital = this.getAvailablePurchaseOptions(RBI.Product.Defines.TARGETDEVICE_SMOOTH, RBI.Product.Defines.PURCHASEGROUP_TYPE_DIGITAL);
    var moreToWatchDiscs = this.getAvailablePurchaseOptions(RBI.Product.Defines.TARGETDEVICE_SMOOTH, RBI.Product.Defines.PURCHASEGROUP_TYPE_DISC);

    // if kiosk is selected add disk options first, otherwice add digital options first.
    if (kioskSelected) {
        buttonPurchaseOptions = buttonPurchaseOptions.concat(moreToWatchDiscs);
        buttonPurchaseOptions = buttonPurchaseOptions.concat(moreToWatchDigital);
    } else {
        buttonPurchaseOptions = buttonPurchaseOptions.concat(moreToWatchDigital);
        buttonPurchaseOptions = buttonPurchaseOptions.concat(moreToWatchDiscs);
    }

    if (buttonPurchaseOptions && buttonPurchaseOptions.length) {
        for (var i in buttonPurchaseOptions) {
            buttonPurchaseOptions[i].initWatchNowButtonLabels(kioskSelected, this.getProductType());
        }
    }
    return buttonPurchaseOptions;
};

RBI.PurchaseOption.prototype.initWatchNowButtonLabels = function(kioskSelected, productType) {
    var isGame = productType === RBI.Product.Defines.TYPE_GAME;
    if (RBI.PurchaseOption.Defines.TYPE_SUBSCRIPTION === this.getPurchaseOptionType()) {
        var isSubscribed = new RBI.PersistenceManager().getSubscriptionPackageId() ? true : false;
        if (isSubscribed && RBI.Util.returnBoolean(this.getBillingTransaction())) {
            this.purchaseOptionLabel = "Watch Now";
            this.purchaseOptionPriceLabel = null;
        } else {
            this.purchaseOptionLabel = "Watch Now (Subscription Required)";
            this.purchaseOptionPriceLabel = null;
        }
    } else if (RBI.PurchaseOption.Defines.DVD_RESERVATION === this.getPurchaseOptionType()) {
        this.findLabel = 'Find ' + (isGame ? 'Game' : 'DVD');
        if (kioskSelected) {
            this.purchaseOptionLabel = 'Reserve ' + (isGame ? 'Game' : 'DVD');
            this.purchaseOptionPriceLabel = "$" + this.getPrice();
        } else {
            this.purchaseOptionLabel = this.findLabel;
            this.purchaseOptionPriceLabel = null;
        }
    } else if (RBI.PurchaseOption.Defines.BLURAY_RESERVATION === this.getPurchaseOptionType()) {
        this.findLabel = 'Find ' + (isGame ? 'Game' : 'Blu-ray\u2122');
        if (kioskSelected) {
            this.purchaseOptionLabel = 'Reserve '  + (isGame ? 'Game' : 'Blu-ray\u2122');
            this.purchaseOptionPriceLabel = "$" + this.getPrice();
        } else {
            this.purchaseOptionLabel = this.findLabel;
            this.purchaseOptionPriceLabel = null;
        }
    } else {
        if (RBI.Util.returnBoolean(this.getBillingTransaction())) {
            this.purchaseOptionLabel = "Watch Now";
            if (RBI.PurchaseOption.Defines.TYPE_RENT === this.getPurchaseOptionType() ||
                RBI.PurchaseOption.Defines.TYPE_RENT_HD === this.getPurchaseOptionType()) {
                //Rent - we need to show the expire time as the price label
                if (this.getExpires()) {
                    this.purchaseOptionPriceLabel = this.getVODExpirationDateLabel(this.getExpires());
                    this.expirationTimeLeft = this.purchaseOptionPriceLabel;
                }
            } else if (RBI.PurchaseOption.Defines.TYPE_BUY === this.getPurchaseOptionType() ||
                RBI.PurchaseOption.Defines.TYPE_BUY_HD === this.getPurchaseOptionType()) {
                //Buy - we need to show "Purchased" as the price label
                this.purchaseOptionPriceLabel = "Purchased";
            }
        } else {
            this.purchaseOptionLabel = this.getPurchaseOptionName();
            this.purchaseOptionPriceLabel = "$" + this.getPrice();
        }
    }
};

    /*
     * Reminder Model and Utility
     */
    RBI.Reminder = function (value) {
        this.value = value;
        this.postConstruct && this.postConstruct();
    };

// inherit base methods
    RBI.Reminder.prototype = new RBI.AbstractProduct();

    RBI.Reminder.prototype.getReminderType = function () {
        return this.value.ReminderType;
    };
    RBI.Reminder.prototype.getReminderActionDate = function () {
        return this.value.ReminderActionDate;
    };
    RBI.Reminder.prototype.getPurchaseOption = function () {
        return new RBI.PurchaseOption(this.value.PurchaseOption);
    };
    RBI.Reminder.prototype.isVODExpiring = function () {
        return this.getReminderType() === RBI.Reminder.Defines.VOD_EXPIRING;
    };
    RBI.Reminder.prototype.isReadyForPickup = function () {
        return this.getReminderType() === RBI.Reminder.Defines.READY_FOR_PICKUP;
    };
    RBI.Reminder.prototype.isAtHome = function () {
        return this.getReminderType() === RBI.Reminder.Defines.AT_HOME;
    };
    RBI.Reminder.prototype.isAvailableNow = function () {
        return this.getReminderType() === RBI.Reminder.Defines.NOW_AVAILABLE;
    };
    RBI.Reminder.prototype.getDeliveryTypeBadges = function () {
        var badge = RBI.Product.Defines.DELIVERY_TYPE_TO_BADGE_MAP[this.value.PurchaseOption.DeliveryTypeValue];
        return badge ? [badge] : [];
    };

    RBI.Reminder.Defines = {};
    RBI.Reminder.Defines.VOD_EXPIRING = "VOD Expiring";
    RBI.Reminder.Defines.READY_FOR_PICKUP = "Ready for pickup";
    RBI.Reminder.Defines.NOW_AVAILABLE = "Now Available";
    RBI.Reminder.Defines.AT_HOME = "At Home";

    RBI.ReminderUtility = {};
    RBI.ReminderUtility.getRemindersByType = function (reminders, productType) {
        var i, results = [];
        for (i in reminders) {
            if (reminders[i].getPurchaseOption().getProductType() === productType) {
                results.push(reminders[i]);
            }
        }
        return results;
    };

    /*
     * Reminder Response Model and Utility
     */
    RBI.ReminderResponse = function (value) {
        var i;
        this.value = value;
        this.reminders = [];
        this.pageInfo = new RBI.PageInfo(value.PageInfo);
        var remindersList = value.Reminders;
        if (remindersList) {
            for (i in remindersList) {
                var reminder = new RBI.Reminder(remindersList[i]);
                this.reminders.push(reminder);
            }
        }
    };

    RBI.ReminderResponse.prototype.getReminders = function () {
        return this.reminders;
    };

    RBI.ReminderResponse.prototype.getPageInfo = function () {
        return this.pageInfo;
    };


    RBI.ProductAutocompleteSuggestionsResponse = function (response) {
        var i,
            suggestionJson,
            suggestions = [];

        if (response.ListSuggestions && response.ListSuggestions.length) {
            for (i = 0; i < response.ListSuggestions.length; i++) {
                suggestionJson = response.ListSuggestions[i];
                suggestions.push(new RBI.ProductAutocompleteSuggestion(suggestionJson.ProductID, suggestionJson.Title));
            }
        }

        this.suggestions = suggestions;
        this.postConstruct();
    };

    RBI.ProductAutocompleteSuggestionsResponse.prototype.postConstruct = function () {
    };

    RBI.ProductAutocompleteSuggestionsResponse.prototype.getAutocompleteSuggestions = function () {
        return this.suggestions;
    };

    RBI.ProductAutocompleteSuggestion = function (productId, title) {
        this.productId = productId;
        this.title = title;
        var startMarker = '&lt;b&gt;';
        if (title.indexOf(startMarker) === 0) {
            var endMarker = '&lt;/b&gt;';
            this.prefix = title.substring(startMarker.length, title.indexOf(endMarker));
            this.suffix = title.substring(startMarker.length + this.prefix.length + endMarker.length);
        }
        this.postConstruct();
    };

    RBI.ProductAutocompleteSuggestion.prototype.postConstruct = function () {
    };

    RBI.ProductAutocompleteSuggestion.prototype.getProductId = function () {
        return this.productId;
    };

    RBI.ProductAutocompleteSuggestion.prototype.getTitle = function () {
        return this.title;
    };

    RBI.ProductAutocompleteSuggestion.prototype.getPrefix = function () {
        return this.prefix;
    };

    RBI.ProductAutocompleteSuggestion.prototype.getSuffix = function () {
        return this.suffix;
    };

    /*
     * Recommended Products Response Model and Utility
     */
    RBI.RecommendedProductsResponse = function (value) {
        var i;
        this.value = value;
        this.recommendedProducts = [];
        var recommendedProductsList = value.Recommendations;

        if (recommendedProductsList) {
            for (i = 0; i < recommendedProductsList.length; i++) {
                var productObject = new RBI.Product(recommendedProductsList[i].ProductType, recommendedProductsList[i].ProductInfo);
                this.recommendedProducts.push(productObject);
            }
        }
    };

    RBI.RecommendedProductsResponse.prototype.getRecommendedProducts = function () {
        return this.recommendedProducts;
    };

    RBI.RecommendedProductsResponse.prototype.getQueryID = function () {
        return this.value["QueryID"];
    };

    /*
     * Recommended Products By Search Criteria Response Model and Utility
     */
    RBI.RecommendedProductsBySearchCriteriaResponse = function (value) {
        var i;
        this.value = value;
        this.recommendedProducts = [];
        this.pageInfo = new RBI.PageInfo(value.PageInfo);
        var recommendedProductsList = value.Recommendations;

        if (recommendedProductsList) {
            for (i = 0; i < recommendedProductsList.length; i++) {
                var productObject = new RBI.Product(recommendedProductsList[i].ProductType, recommendedProductsList[i].ProductInfo);
                this.recommendedProducts.push(productObject);
            }
        }
    };

    RBI.RecommendedProductsBySearchCriteriaResponse.prototype.getRecommendedProducts = function () {
        return this.recommendedProducts;
    };

    RBI.RecommendedProductsBySearchCriteriaResponse.prototype.getPageInfo = function () {
        return this.pageInfo;
    };

    RBI.RecommendedProductsBySearchCriteriaResponse.prototype.getQueryID = function () {
        return this.value["QueryID"];
    };


    /*
     * ProductSearch Response Model and Utility
     */
    RBI.ProductSearchResponse = function (value) {
        var i;
        this.value = value;
        this.products = [];
        this.pageInfo = new RBI.PageInfo(value.PageInfo);
        var productList = value.ProductList;

        if (productList) {
            for (i = 0; i < productList.length; i++) {
                var productObject = new RBI.Product(productList[i].ProductType, productList[i]);
                this.products.push(productObject);
            }
        }
    };

    RBI.ProductSearchResponse.Defines = {};
    // ProductSearchResponse type constants.
    RBI.ProductSearchResponse.Defines.DATASOURCE_DIGITALSMITH_SUGGESTED = "DS_Suggestions";
    RBI.ProductSearchResponse.Defines.DATASOURCE_DIGITALSMITH_SEARCH = "DS_Search";
    RBI.ProductSearchResponse.Defines.DATASOURCE_PRODUCTSEARCH = "ProductSearch";

    RBI.ProductSearchResponse.prototype.getProducts = function () {
        return this.products;
    };

    RBI.ProductSearchResponse.prototype.getPageInfo = function () {
        return this.pageInfo;
    };

    RBI.ProductSearchResponse.prototype.getDataSource = function () {
        return this.value["Datasource"];
    };

    RBI.ProductSearchResponse.prototype.getQueryID = function () {
        return this.value["QueryID"];
    };

}());
(function initPromotionModel() {
	"use strict";

/**
 * Promotion Model
 * Author: Stijn Asnong, Kevin Clark
 * Date: 6/18/13, 6/27/13 (expand model)
 */

/**
 * Model object for Promotion. The constructor takes one argument:
 * @param value - the JSON of the data service layer
 */
RBI.Promotion = function (value) {
	var i;
    this.value = value;
    this.products = [];

    //put the promotion products on this promotion object
    for(i in value.Products){
        var promotionProduct = new RBI.PromotionProduct(value.Products[i]);
        this.products.push(promotionProduct);
    }
    this.isPromotion = true;
    this.postConstruct();
};

RBI.Promotion.prototype.postConstruct = function () {
};

/**
 * Getter of the start date of the promotion
 * @return String of Start date promotion
 */
RBI.Promotion.prototype.getStartDate = function () {
    return this.value["StartDate"];
};

/**
 * Getter of the end date of the promotion
 * @return String of end date promotion
 */
RBI.Promotion.prototype.getEndDate = function () {
    return this.value["EndDate"];
};

/**
 * Getter of all the products of the promotion
 * @return List of PromotionProducts
 */
RBI.Promotion.prototype.getProducts = function () {
    return this.products;
};

/**
 * Getter of the url link of the promotion
 * @return String of url promotion
 */
RBI.Promotion.prototype.getLink = function () {
    return this.value["Link"];
};

/**
 * Getter of the plain text of the promotion
 * @return String of promotion plain text
 */
RBI.Promotion.prototype.getPlainText = function () {
    return this.value["PlainText"];
};

/**
 * Getter of the promotion ID
 * @return String of promotionID
 */
RBI.Promotion.prototype.getPromotionId = function () {
    return this.value["PromotionId"];
};

/**
 * Getter of the Promotion title
 * @return String promotion title
 */
RBI.Promotion.prototype.getPromotionTitle = function () {
    return this.value["PromotionTitle"];
};

/**
 * Getter of the promotion type
 * @return String of promotion type
 */
RBI.Promotion.prototype.getPromotionType = function () {
    return this.value["PromotionType"];
};

/**
 * Getter of the Content Text of the promotion
 * @return String of promotion content Text
 */
RBI.Promotion.prototype.getContentText = function () {
    return this.value["ContentText"];
};

/**
 * Getter if the promotion is a collection of products
 * @return Boolean of collection or not
 */
RBI.Promotion.prototype.isCollection = function () {
    return this.getProducts() && this.getProducts().length > 1;
};

/**
 * Determine if rating of promotion. Of one title, return title rating
 * If multiple titles, return highest (i.e. G + R = R)
 * @return String of rating
 */
RBI.Promotion.prototype.getRating = function () {
    if (this.getProducts().length === 1) {
        return this.getProducts()[0].getRating();
    }
};

/**
 * Get the small image url
 * @return String the image url
 */
RBI.Promotion.prototype.getSmallImageUrl = function () {
    return this.value["Image"]["SmallImageUrl"];
};

RBI.Promotion.prototype.getLargeImageUrl = function () {
    return this.value["Image"]["LargeImageUrl"];
};

/**
 * Get the background image url
 * @return String the image url
 */
RBI.Promotion.prototype.getBackgroundImageUrl = function () {
    return this.value["Image"]["BackgroundImageUrl"];
};

/*
 * Model object for Promotions Product which is an array inside of promotions.
 * 
 * @param value - the JSON of the data service layer
 */
RBI.PromotionProduct = function (value) {
    this.value = value;
};

/**
 * Getter of the promotion product ID
 * @return String product ID
 */
RBI.PromotionProduct.prototype.getProductId = function () {
    return this.value["ProductID"];
};

/**
 * Getter of the promotion product type - (VHS Movie, Game)
 * @return String product Type
 */
RBI.PromotionProduct.prototype.getProductType = function () {
    return this.value["ProductType"];
};

/**
 * Getter of the promotion product Rating
 * @return String product Rating
 */
RBI.PromotionProduct.prototype.getRating = function () {
    return this.value["Rating"];
};

/*
 * Model object for Promotions. This contains an array of Promotion 
 * objects
 * 
 * @param promotions - An array of RBI.Promotion objects
 */
RBI.Promotions = function (promotions) {
    this.promotions = promotions;
};

/*
 * Get saved promotions

 * @return Promotion[] - the 
 */
RBI.Promotions.prototype.getPromotions = function () {
    return this.promotions;
};

/*
 * Returns array of promotions whose has product sets sizes of 1
 * @return Promotion[] - the promotions whose product set size = 1
 */
RBI.Promotions.prototype.getTitlePromotions = function () {
    var i, results = [];
    for (i = 0; i < this.promotions.length; i++) {
        if (this.promotions[i].getProducts().length === 1) {
            results.push(this.promotions[i]);
        }
    }
    return new RBI.Promotions(results);
};

/*
 * Returns array of promotions whose product set size > 1
 * @return Promotion[] - the promotions whose product set size > 1
 */
RBI.Promotions.prototype.getMultipleTitlePromotions = function () {
    var i, results = [];
    for (i = 0; i < this.promotions.length; i++) {
        if (this.promotions[i].getProducts().length > 1) {
            results.push(this.promotions[i]);
        }
    }
    return new RBI.Promotions(results);
};

/*
 * Get Promotions by type. Type can be a comma delimited list of strings
 * @param type - comma delimited list of strings
 * @param promotions - optional parameter of promotions that is an array of Promotion objects
 * @return Promotion[] - the promotions that match type
 */
RBI.Promotions.prototype.getPromotionsByType = function (type) {
    var i, results = [];
    for (i = 0; i < this.promotions.length; i++) {
        if (type.indexOf(this.promotions[i].getPromotionType().toLowerCase()) !== -1) {
            results.push(this.promotions[i]);
        }
    }
    return new RBI.Promotions(results);
};
RBI.Promotions.prototype.getPromotionById = function (promotionId) {
    var i, results = [];
    for (i = 0; i < this.promotions.length; i++) {
        if (this.promotions[i].getPromotionId() === promotionId) {
            return this.promotions[i];
        }
    }
    return null;
};
}());
(function initRequest() {
	"use strict";

//Base request object for call through proxy
// TODO - KWC - this is not used
RBI.Request = function () {
    this.params = {};
};

//Base request Object for direct OL call. Note: format is specifically left out of this call. 
// TODO - KWC - fix case inconsistency
RBI.RequestOL = function () {
    this.params = {};
    this.transactionID = UUID.generate();
    this.transactionTime = new Date().toISOString();
    this.transactionAccessPoint = RBI.PlatformConfig.transactionAccessPoint;
    // TransactionDeviceID should not be initialized here - native API may not be ready yet.
    // It is injected into request in addParameters() function.
    // this.transactionDeviceID = RBI.PlatformConfig.transactionDeviceID;
    this.event;
    this.content;
    this.requestFormat = "json";            // default response type
};

RBI.RequestOL.prototype.setTransactionDeviceID = function (aID) {
    this.transactionDeviceID = aID;
};

// KWC - hack to get around OL restriction on CreateSession, CompleteWatchingTitle and GetGrantTokenForRBOAuth on JVPWEB 
RBI.RequestOL.prototype.setTransactionAccessPoint = function (tap) {
	this.transactionAccessPoint = tap;
};

RBI.RequestOL.prototype.addParam = function (key,value) {
    if(!this.params){
        this.params = {};
    }
    if (value === undefined || value === null) {
        return;
    }
    this.params[key] = value;
};

RBI.RequestOL.prototype.clearParams = function () {
    this.params = {};
};

RBI.RequestOL.prototype.getParam = function (key) {
    return this.params[key];
};


RBI.RequestOL.TRANSACTION_DEVICE_ID = "transDeviceId";
RBI.RequestOL.prototype.addParameters = function () {
    var savedParams = this.getParameters();
   
    var tapAdded = false;
    var transactionDeviceIDAdded = false;
    for (var i in savedParams) {
        var value = this[savedParams[i]];
        if (value === "transactionAccessPoint") {
            tapAdded = true;
        }
        //Do not add transactionDeviceID as a param to the request
        if (value != "transactionDeviceID") {
            this.addParam(savedParams[i], value);
        }
    }
    // always add transaction access point to calls
    if (!tapAdded && RBI.Config.forceTransactionAccessPoint) {
        this.addParam("transactionAccessPoint", this.transactionAccessPoint);
    }
    if (RBI.Config.forceTransactionDeviceID || this.transactionDeviceID) {
        RBI.Util.createCookie(RBI.RequestOL.TRANSACTION_DEVICE_ID,this.transactionDeviceID || RBI.PlatformConfig.transactionDeviceID,1,RBI.Config.baseDomain);
    }
/*
RBI.RequestOL.prototype.addParameters = function () {
    var savedParams = this.getParameters();
   
    var tapAdded = false;
    var transactionDeviceIDAdded = false;
    for (var i in savedParams) {
        var value = this[savedParams[i]];
        if (value === "transactionAccessPoint") {
            tapAdded = true;
        }
        if (value === "transactionDeviceID") {
            transactionDeviceIDAdded = true;
        }

        this.addParam(savedParams[i], value);
    }
    // always add transaction access point to calls
    if (!tapAdded && RBI.Config.forceTransactionAccessPoint) {
        this.addParam("transactionAccessPoint", this.transactionAccessPoint);
    }
    if (!transactionDeviceIDAdded && RBI.Config.forceTransactionDeviceID) {
        this.addParam("transactionDeviceID", this.transactionDeviceID || RBI.PlatformConfig.transactionDeviceID);
    } */

};

RBI.RequestOL.prototype.getParameters = function () {
    // subclasses do something more interesting
    return [];
};

// TODO - KWC - whoever put this in needs to read from the template and use string substitution
RBI.RequestOL.prototype.getRequestAsXML = function () {
	return "<Zoe><TransactionInfo>" +
    "<TransactionID>" + this.transactionID + "</TransactionID>" +
    "<TransactionTime>" + this.transactionTime + "</TransactionTime>" +
    "<TransactionAccessPoint>" + this.transactionAccessPoint + "</TransactionAccessPoint>" +
    "<TransactionDeviceID>" +this.transactionDeviceID + "</TransactionDeviceID>" +
    "<Format>"+this.requestFormat+"</Format>" +
    "</TransactionInfo><RequestInfo>" +
    "<Event>"+this.event+"</Event>" +
    this.content +
    "</RequestInfo></Zoe>";
};

/**
 * Request Options Object to pass along to the baseService on each call if there are options to pass along
 * @param noCache
 * @param withCredentials
 * @constructor
 */
RBI.RequestOptions = function (noCache,withCredentials) {
    this.noCache = noCache;
    this.withCredentials = withCredentials;
};

/** RESERVATION SERVICE Requests & Request Helpers **/
/**
 * Get Subscriptions Request
 * @constructor
 */
RBI.SubscriptionsRequest = function () {
};

/**
 * Get Subscriptions Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.SubscriptionsRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.SubscriptionsRequest.prototype.getParameters = function () {
    return [];
};

/**
 * Get Subscriptions Request Helper
 * @constructor
 */
RBI.SubscriptionsRequestHelper = function () {};

/**
 * Get Subscriptions Request helper - Get request data as XML
 * @param request - request object to transform into an xml format
 * @param contentType
 * @return {*}
 */
RBI.SubscriptionsRequestHelper.prototype.getRequestData = function (request, contentType) {
	if (contentType === "application/xml") {
		return this.getRequestAsXML(request);
	}
	return request;
};

/**
 * Get Subscription Pricing Request
 * @constructor
 */
RBI.SubscriptionPricingRequest = function (accountNumber, creditOptionId, packageId, saleChannel) {
	this.AccountNumber = accountNumber;
	this.CreditOptionID = creditOptionId;
	this.PackageID = packageId;
	this.SaleChannel = saleChannel;
};

/**
 * Get Subscriptions Pricing Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.SubscriptionPricingRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.SubscriptionPricingRequest.prototype.getParameters = function () {
    return ["AccountNumber", "CreditOptionID", "PackageID", "CreationPlatform", "WirelessCarrier", "DeviceManufacturer", "SaleChannel", "PlatformOS"];
};

RBI.SubscriptionPricingRequest.prototype.setAccountNumber = function (accountNumber) {
    this.AccountNumber = accountNumber;
};

RBI.SubscriptionPricingRequest.prototype.setCreditOptionID = function (creditOptionID) {
    this.CreditOptionID = creditOptionID;
};

RBI.SubscriptionPricingRequest.prototype.setPackageID = function (packageID) {
    this.PackageID = packageID;
};
RBI.SubscriptionPricingRequest.prototype.setCreationPlatform = function (creationPlatform) {
    this.CreationPlatform = creationPlatform;
};

RBI.SubscriptionPricingRequest.prototype.setWirelessCarrier = function (wirelessCarrier) {
    this.WirelessCarrier = wirelessCarrier;
};

RBI.SubscriptionPricingRequest.prototype.setDeviceManufacturer = function (deviceManufacturer) {
    this.DeviceManufacturer = deviceManufacturer;
};

RBI.SubscriptionPricingRequest.prototype.setSaleChannel = function (saleChannel) {
    this.SaleChannel = saleChannel;
};

RBI.SubscriptionPricingRequest.prototype.setPlatformOS = function (platformOS) {
    this.PlatformOS = platformOS;
};

/**
 * Subscribe Customer Pricing Request
 * @constructor
 */
RBI.SubscribeCustomerRequest = function (accountNumber, creditOptionId, packageId, confirmationNumber) {
    this.AccountNumber = accountNumber;
    this.CreditOptionID = creditOptionId;
    this.PackageID = packageId;
    this.ConfirmationNumber = confirmationNumber;
};

/**
 * Subscribe Customer Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.SubscribeCustomerRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.SubscribeCustomerRequest.prototype.getParameters = function () {
    return ["AccountNumber", "CreditOptionID", "PackageID", "ConfirmationNumber"];
};

/**
 * Setter for the accountNumber
 * @param accountNumber
 */
RBI.SubscribeCustomerRequest.prototype.setAccountNumber = function (accountNumber) {
    this.AccountNumber = accountNumber;
};

/**
 * Setter for the creditOptionID
 * @param creditOptionID
 */
RBI.SubscribeCustomerRequest.prototype.setCreditOptionID = function (creditOptionID) {
    this.CreditOptionID = creditOptionID;
};

/**
 * Setter for the ID of the required package
 * @param packageID
 */
RBI.SubscribeCustomerRequest.prototype.setPackageID = function (packageID) {
    this.PackageID = packageID;
};

/**
 * Setter for the confirmationNumber
 * @param confirmationNumber
 */
RBI.SubscribeCustomerRequest.prototype.setConfirmationNumber = function (confirmationNumber) {
    this.ConfirmationNumber = confirmationNumber;
};

/**
 * Cancel Subscription Request
 * @constructor
 */
RBI.CancelSubscriptionRequest = function () {
};

/**
 * Cancel Subscription Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.CancelSubscriptionRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.CancelSubscriptionRequest.prototype.getParameters = function () {
    return ["AccountNumber", "SubscriptionID"];
};

/**
 * Setter for the accountNumber
 * @param accountNumber
 */
RBI.CancelSubscriptionRequest.prototype.setAccountNumber = function (accountNumber) {
    this.AccountNumber = accountNumber;
};

/**
 * Setter for the SubscriptionID
 * @param subscriptionID
 */
RBI.CancelSubscriptionRequest.prototype.setSubscriptionID = function (subscriptionID) {
    this.SubscriptionID = subscriptionID;
};

/**
 * Get Kiosk Cart Pricing Request
 * @constructor
 */
RBI.GetKioskCartPricingRequest = function () {
	this.ApplyCredits = false;
};

/**
 * GGet Kiosk Cart Pricing Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetKioskCartPricingRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetKioskCartPricingRequest.prototype.getParameters = function () {
    return ["ApplyCredits", "KioskID", "PurchaseOptionIDs"];
};

/**
 * Setter for indicator to apply credits on the pricing or not
 * @param applyCredits
 */
RBI.GetKioskCartPricingRequest.prototype.setApplyCredits = function (applyCredits) {
    this.ApplyCredits = applyCredits;
};

/**
 * Setter for the KioskID for pricing matters
 * @param kioskId
 */
RBI.GetKioskCartPricingRequest.prototype.setKioskID = function (kioskId) {
    this.KioskID = kioskId;
};

/**
 * Setter for the Purchase Option ID's to request pricing for
 * @param purchaseOptionIDs - list of purchase Option ID's
 */
RBI.GetKioskCartPricingRequest.prototype.setPurchaseOptionIDs = function (purchaseOptionIDs) {
    this.PurchaseOptionIDs = purchaseOptionIDs;
};

/**
 * Setter for the PartnerCustomerNumber
 * @param pcn   - partner customer number
 */
RBI.GetKioskCartPricingRequest.prototype.setPcn = function (pcn) {
    this.PartnerCustomerNumber = pcn;
};

/**
 * Get Kiosk Cart Pricing Request Helper
 * @constructor
 */
RBI.GetKioskCartPricingRequestHelper = function () {
};

/**
 * Get Kiosk Cart Pricing Request Helper - Get request Data as XML format
 * @param request  - request to transform it into xml
 * @param contentType
 * @return {*}
 */
RBI.GetKioskCartPricingRequestHelper.prototype.getRequestData = function (request, contentType) {
	if (contentType === "application/xml") {
		var i;
		request.event = "GetKioskCartPricing";
		request.content = "";
		request.content += "<PartnerCustomerNumber>"+request.PartnerCustomerNumber+"</PartnerCustomerNumber>";
		request.content += "<KioskID>"+request.KioskID+"</KioskID>";
		request.content += "<ApplyCredits>" + request.ApplyCredits + "</ApplyCredits>";
		request.content += "<PurchaseOptionIDs>";
		if (request.PurchaseOptionIDs) {
			for (i in request.PurchaseOptionIDs) {
				request.content += "<PurchaseOptionID>" + request.PurchaseOptionIDs[i] + "</PurchaseOptionID>";
			}
		}
		request.content += "</PurchaseOptionIDs>";
		return request.getRequestAsXML();
	}
	return request;
};

/**
 * Get OnDemand Cart Pricing Request
 * @constructor
 */
RBI.OnDemandCartPricingRequest = function () {
};

/**
 * Get OnDemand Cart Pricing Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.OnDemandCartPricingRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.OnDemandCartPricingRequest.prototype.getParameters = function () {
    return ["AccountNumber", "PurchaseOptionID", "UserPassword", "CreationPlatform", "WirelessCarrier", "DeviceManufacturer", "SaleChannel", "PlatformOS"];
};

/**
 * Setter for the AccountNumber of the user his credit card
 * @param accountNumber
 */
RBI.OnDemandCartPricingRequest.prototype.setAccountNumber = function (accountNumber) {
    this.AccountNumber = accountNumber;
};

/**
 * Setter for the PurchaseOptionID for pricing matters
 * @param purchaseOptionId
 */
RBI.OnDemandCartPricingRequest.prototype.setPurchaseOptionID = function (purchaseOptionId) {
    this.PurchaseOptionID = purchaseOptionId;
};

/**
 * If user has purchase parental controls enabled - need to send user password to verify it on server side.
 * @param userPassword
 */
RBI.OnDemandCartPricingRequest.prototype.setUserPassword = function (userPassword) {
    this.UserPassword = userPassword;
};


RBI.OnDemandCartPricingRequest.prototype.setCreationPlatform = function (creationPlatform) {
    this.CreationPlatform = creationPlatform;
};

RBI.OnDemandCartPricingRequest.prototype.setWirelessCarrier = function (wirelessCarrier) {
    this.WirelessCarrier = wirelessCarrier;
};

RBI.OnDemandCartPricingRequest.prototype.setDeviceManufacturer = function (deviceManufacturer) {
    this.DeviceManufacturer = deviceManufacturer;
};

RBI.OnDemandCartPricingRequest.prototype.setSaleChannel = function (saleChannel) {
    this.SaleChannel = saleChannel;
};

RBI.OnDemandCartPricingRequest.prototype.setPlatformOS = function (platformOS) {
    this.PlatformOS = platformOS;
};

/**
 * Perform OnDemand Purchase Request
 * @constructor
 */
RBI.PerformOnDemandPurchaseRequest = function () {
};

/**
 * Perform OnDemand Purchase Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.PerformOnDemandPurchaseRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.PerformOnDemandPurchaseRequest.prototype.getParameters = function () {
    return ["ConfirmationID"];
};

/**
 * Setter for the ConfirmationID needed for a perform OnDemand Purchase
 * @param confirmationID
 */
RBI.PerformOnDemandPurchaseRequest.prototype.setConfirmationID = function (confirmationID) {
    this.ConfirmationID = confirmationID;
};



/** KIOSK SERVICE Requests & Request Helpers **/
/**
 * Kiosk Search Request
 * @constructor
 */
RBI.KioskSearchRequest = function () {
    this.radius = 50;
};

/**
 * Kiosk Search  Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.KioskSearchRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.KioskSearchRequest.prototype.getParameters = function () {
    return ["searchTerm","radius","maxKiosks"];
};

/**
 * Setter for the searchTerm to search for kiosks
 * @param searchTerm
 */
RBI.KioskSearchRequest.prototype.setSearchTerm = function (searchTerm) {
    this.searchTerm = searchTerm;
};

/**
 * Setter for the maximum number of kiosks in search results
 * @param maxKiosks 
 */
RBI.KioskSearchRequest.prototype.setMaxKiosk = function (maxKiosks) {
    this.maxKiosks = maxKiosks;
};

/**
 * Get Kiosk By Kiosk ID Request
 * @constructor
 */

RBI.GetKioskByKioskIdRequest = function () {
    this.KioskID = '';
};

/**
 * Get Kiosk By Kiosk ID  Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetKioskByKioskIdRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetKioskByKioskIdRequest.prototype.getParameters = function () {
    return ["KioskID"];
};

/**
 * Setter for the Kiosk Id (single kiosk id)
 * @param kioskID
 */
RBI.GetKioskByKioskIdRequest.prototype.setKioskID = function (kioskID) {
    this.KioskID = kioskID;
};

/**
 * Setter for multiple Kiosk Ids
 * @param kioskIDs - An array of kiosk IDs
 */
RBI.GetKioskByKioskIdRequest.prototype.setKioskIDs = function (kioskIDs) {
	var i;
    for (i=0; i<kioskIDs.length-1; i++)  {
        this.KioskID += kioskIDs[i] + ',';
    }
    this.KioskID += kioskIDs[kioskIDs.length-1];
};

/**
 * Get The Kiosks Cities When passing a particular state Search Request
 * @constructor
 */
RBI.GetKioskCitiesByStateRequest = function () {
};

/**
 * Get The Kiosks Cities When passing a particular state Search Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetKioskCitiesByStateRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetKioskCitiesByStateRequest.prototype.getParameters = function () {
    return ["state"];
};

/**
 * Setter for the state
 * @param state  - The state to search in
 */
RBI.GetKioskCitiesByStateRequest.prototype.setState = function (state) {
    this.state = state;
};

/**
 * Get The Kiosks Zipcodes When passing a particular city and state Search Request
 * @constructor
 */
RBI.GetKioskZipcodesByCityRequest = function () {
};

/**
 * Get The Kiosks Zipcodes When passing a particular city and state Search Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetKioskZipcodesByCityRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetKioskZipcodesByCityRequest.prototype.getParameters = function () {
    return ["state","city"];
};

/**
 * Setter for the state
 * @param state  - The state to search in
 */
RBI.GetKioskZipcodesByCityRequest.prototype.setState = function (state) {
    this.state = state;
};

/**
 * Setter for the city
 * @param city  - The city to search in
 */
RBI.GetKioskZipcodesByCityRequest.prototype.setCity = function (city) {
    this.city = city;
};

/**
 * Get The Kiosks When passing a particular city and state and zipcode Search Request
 * @constructor
 */
RBI.GetKiosksByCityZipStateRequest = function () {
};

/**
 * Get The Kiosks When passing a particular city and state and zipcode Search Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetKiosksByCityZipStateRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetKiosksByCityZipStateRequest.prototype.getParameters = function () {
    return ["state","city","zip"];
};

/**
 * Setter for the state
 * @param state  - The state to search in
 */
RBI.GetKiosksByCityZipStateRequest.prototype.setState = function (state) {
    this.state = state;
};

/**
 * Setter for the city
 * @param city  - The city to search in
 */
RBI.GetKiosksByCityZipStateRequest.prototype.setCity = function (city) {
    this.city = city;
};

/**
 * Setter for the zipcode
 * @param zip  - The zip to search in
 */
RBI.GetKiosksByCityZipStateRequest.prototype.setZip = function (zip) {
    this.zip = zip;
};


/**
 * Get The recent Kiosks Search Request
 * @constructor
 */
RBI.GetRecentKiosksRequest = function () {
    
};

/**
 * Get The recent Kiosks Search Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetRecentKiosksRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetRecentKiosksRequest.prototype.getParameters = function () {
    return [];
};


// Get recent kiosks request helper for XML requetst (direct OL calls)
// Fills in the request specific data - request type and PCN
RBI.GetRecentKiosksHelper = function () {
};

RBI.GetRecentKiosksHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetRecentKiosks";
        request.content = "<PartnerCustomerNumber>"+request.partnerCustomerNumber+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }
    return request;
};


/**
 * GetKiosksByProductID Request
 * @constructor
 */
RBI.GetKiosksByProductIDRequest = function () {
	this.ProductIDs = [];
	this.KioskIDs = [];
	this.Latitude = "";
	this.Longitude = "";
	this.Radius = 50;
};

/**
 * GetKiosksByProductIDRequest initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetKiosksByProductIDRequest.prototype = new RBI.RequestOL();

/** 
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetKiosksByProductIDRequest.prototype.getParameters = function () {
    return ["ProductIDs", "KioskIDs", "Latitude", "Longitude", "SearchTerm", "Radius", "MaxKiosks"];
};

/**
 * Setter for the Product ID
 * @param productID
 */
RBI.GetKiosksByProductIDRequest.prototype.setProductID = function (productID) {
    this.ProductIDs.push(productID);
};

/**
 * Setter for the kiosk ID
 * @param kioskID
 */
RBI.GetKiosksByProductIDRequest.prototype.setKioskID = function (kioskID) {
    this.KioskIDs.push(kioskID);
};

/**
 * Setter for search term
 * @param searchTerm
 */
RBI.GetKiosksByProductIDRequest.prototype.setSearchTerm = function (searchTerm) {
    this.SearchTerm = searchTerm;
};


/**
 * Setter for the maximum number of kiosks in search results
 * @param maxKiosks 
 */
RBI.GetKiosksByProductIDRequest.prototype.setMaxKiosks = function (maxKiosks) {
    this.MaxKiosks = maxKiosks;
};

/* Request factory objects */

// code below is not used as of 6.6.13 in core. It is used in Xbox and Win8. Do not delete yet

RBI.RequestFactory = function () {
	if (RBI.RequestFactory.prototype._singletonInstance) {
		return RBI.RequestFactory.prototype._singletonInstance;
	}
	RBI.RequestFactory.prototype._singletonInstance = this;
};

RBI.RequestFactory.prototype.getSearchRequest = function (searchTerm, availability) {
    var sr = new RBI.SearchRequest(searchTerm);
    sr.availability = availability;
    sr.format = null;
    return sr;
};

RBI.RequestFactory.prototype.getHomePageSearchRequest = function (aFilter) {
    var sr = new RBI.SearchRequest();
    sr.productType = RBI.Product.Defines.TYPE_MOVIE;
    sr.pageSize = "6";
    //Usage of the Digital Smith because in the request special filter is used
    sr.sortField = RBI.Config.defaultSearchSortDS;
    sr.sortOrder = RBI.Config.defaultSearchSortDSDirection;
    sr.includeComingSoon = null;
    sr.specialFilter = aFilter.FilterID;
    sr.imageTypes = null;
    sr.format = null;
    return sr;
};

RBI.RequestFactory.prototype.getBrowseSearchRequest = function (aFilter) {
    var sr = new RBI.SearchRequest();
    sr.pageSize = "6";
    //Usage of the Digital Smith because in the request special filter is used
    sr.sortField = RBI.Config.defaultSearchSortDS;
    sr.sortOrder = RBI.Config.defaultSearchSortDSDirection;
    sr.includeComingSoon = null;
    sr.specialFilter = aFilter.FilterID;
    sr.imageTypes = null;
    sr.format = null;
    return sr;
};

/** CUSTOMER SERVICE Requests & Request Helpers **/
RBI.GetCustomerSimpleRequest = function () {};

RBI.GetCustomerSimpleRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerSimpleRequest.prototype.getParameters = function () {
    return [];
};

/**
 *  GetCustomer OL Request Object
 * @constructor
 */
RBI.GetCustomerOLRequest = function () {

};

/**
 * Get Customer OL Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCustomerOLRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerOLRequest.prototype.getParameters = function () {
    return ["partnerCustomerNumber"];
};

/**
 * Setter for the PartnerCustomerNumber
 * @param partnerCustomerNumber  - The Pcn Needed for getting the customer When going through OL directly
 */
RBI.GetCustomerOLRequest.prototype.setPartnerCustomerNumber = function (partnerCustomerNumber) {
    this.partnerCustomerNumber = partnerCustomerNumber;
};

/**
 *  GetCustomer Request Object
 * @constructor
 */
RBI.GetCustomerRequest = function () {

};

/**
 * Get Customer Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCustomerRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerRequest.prototype.getParameters = function () {
    return ["evictCache"];
};

/**
 * Setter for the Evict cache on RBProxy - flush out and renew the customer in rbproxy session
 * @param evictCache  - True or false
 */
RBI.GetCustomerRequest.prototype.setEvictCache = function (evictCache) {
    this.evictCache = evictCache;
};

/**
 * Request Helper Object for Get Customer
 */
RBI.GetCustomerRequestHelper = function () {

};

/**
 *  Request Helper Object for Get Customer - get the requestData as XML
 * @param request - GetCustomer Request Object
 * @param contentType
 * @return {*}
 */
RBI.GetCustomerRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetCustomer";
        request.content = "<PartnerCustomerNumber>"+request.getParam("partnerCustomerNumber")+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }
    return request;
};

/**
 *  Get Customer Reminder Request Object
 * @constructor
 */
RBI.GetCustomerReminderRequest = function () {
};

/**
 * Get Customer Remainders Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCustomerReminderRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerReminderRequest.prototype.getParameters = function () {
    return ["PageSize", "PageNumber", "SortField", "SortOrder"];
};

/**
 * Setter for the Page size
 * @param pageSize  - The Page Size (amount of results coming back for 1 page)
 */
RBI.GetCustomerReminderRequest.prototype.setPageSize = function (pageSize) {
    this.PageSize = pageSize;
};

/**
 * Setter for the Page Number
 * @param pageNumber  - The page number to return
 */
RBI.GetCustomerReminderRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the Field to Sort the results on
 * @param sortField
 */
RBI.GetCustomerReminderRequest.prototype.setSortField = function (sortField) {
    this.SortField = sortField;
};

/**
 * Setter for the Sort Order Direction
 * @param sortOrder
 */
RBI.GetCustomerReminderRequest.prototype.setSortOrder = function (sortOrder) {
    this.SortOrder = sortOrder;
};

/**
 * Request Helper Object for Customer Remainders
 */
RBI.GetCustomerReminderRequestHelper = function () {

};

/**
 *  Request Helper Object for Customer Remainders - get the requestData as XML
 * @param request - CustomerRemainder Request Object
 * @param contentType
 * @return {*}
 */
RBI.GetCustomerReminderRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetRemindersByCustomer";
        request.content = "<PartnerCustomerNumber>"+request.partnerCustomerNumber+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }

    return request;
};

/**
 * Request Object for getting the watchHistory
 * @constructor
 */
RBI.GetCustomerWatchHistoryRequest = function () {
};

/**
 * Get Customer WatchHistory Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCustomerWatchHistoryRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerWatchHistoryRequest.prototype.getParameters = function () {
    return ["StartDate", "EndDate", "ImageTypes", "FilterByType", "InProgress", "PageSize", "PageNumber", "SortField", "SortOrder"];
};

/**
 * Setter for the Page size
 * @param pageSize  - The Page Size (amount of results coming back for 1 page)
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setPageSize = function (pageSize) {
    this.PageSize = pageSize;
};

/**
 * Setter for the Page Number
 * @param pageNumber  - The page number to return
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the Field to Sort the results on
 * @param sortField
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setSortField = function (sortField) {
    this.SortField = sortField;
};

/**
 * Setter for the Sort Order Direction
 * @param sortOrder
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setSortOrder = function (sortOrder) {
    this.SortOrder = sortOrder;
};

/**
 * Setter for the StartDate
 * @param startDate
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setStartDate = function (startDate) {
    this.StartDate = startDate;
};

/**
 * Setter for the EndDate
 * @param endDate
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setEndDate = function (endDate) {
    this.EndDate = endDate;
};

/**
 * Setter for the ImageTypes - what ImageTypes you want to be returned
 * @param imageTypes
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setImageTypes = function (imageTypes) {
    this.ImageTypes = imageTypes;
};

/**
 * Setter for the Type on what to filter the results on
 * @param filterByType
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setFilterByType = function (filterByType) {
    this.FilterByType = filterByType;
};

/**
 * Setter for the InProgress - return in progress titles only or not
 * @param inProgress
 */
RBI.GetCustomerWatchHistoryRequest.prototype.setInProgress = function (inProgress) {
    this.InProgress = inProgress;
};

/**
 * Request Helper Object for Customer WatchHistory
 */
RBI.GetCustomerWatchHistoryRequestHelper = function () {

};

/**
 *  Request Helper Object for Customer Watch History - get the requestData as XML
 * @param request - CustomerWatchHistory Request Object
 * @param contentType
 * @return {*}
 */
RBI.GetCustomerWatchHistoryRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetWatchHistory";
        request.content = "<PartnerCustomerNumber>"+request.partnerCustomerNumber+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }

    return request;
};

/**
 *  Get Customer Bookmarks Request Object
 * @constructor
 */
RBI.GetCustomerBookMarkRequest = function () {
};

/**
 * Get The Bookmarks Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCustomerBookMarkRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerBookMarkRequest.prototype.getParameters = function () {
    return ["PageSize", "PageNumber", "SortField", "SortOrder"];
};

/**
 * Setter for the Page size  - amount of items requested on 1 page
 * @param pageSize
 */
RBI.GetCustomerBookMarkRequest.prototype.setPageSize = function(pageSize){
    this.PageSize = pageSize;
};

/**
 * Setter for the Page number  - current page number
 * @param pageNumber
 */
RBI.GetCustomerBookMarkRequest.prototype.setPageNumber = function(pageNumber){
    this.PageNumber = pageNumber;
};

/**
 * Setter for the sortField  - Field where to sort on
 * @param sortField
 */
RBI.GetCustomerBookMarkRequest.prototype.setSortField = function(sortField){
    this.SortField = sortField;
};

/**
 * Setter for the sortOrder  - direction on how to sort
 * @param sortOrder
 */
RBI.GetCustomerBookMarkRequest.prototype.setSortOrder = function(sortOrder){
    this.SortOrder = sortOrder;
};

/**
 * Request Helper Object for Customer Bookmarks
 */
RBI.GetCustomerBookMarkRequestHelper = function () {

};

/**
 *  Request Helper Object for Customer Bookmarks - get the requestData as XML
 * @param request - CustomerBookmarks Request Object
 * @param contentType
 * @return {*}
 */
RBI.GetCustomerBookMarkRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetBookmarks";
        request.content = "<PartnerCustomerNumber>"+request.partnerCustomerNumber+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }

    return request;
};

/**
 *  Get Customer Purchases Request Object
 * @constructor
 */
RBI.GetCustomerPurchasesRequest = function () {
};

/**
 * Get Customer Purchases Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCustomerPurchasesRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCustomerPurchasesRequest.prototype.getParameters = function () {
    return ["PageSize", "PageNumber", "InProgress", "SortField", "SortOrder"];
};

/**
 * Setter for the Page size  - amount of items requested on 1 page
 * @param pageSize
 */
RBI.GetCustomerPurchasesRequest.prototype.setPageSize = function(pageSize){
    this.PageSize = pageSize;
};

/**
 * Setter for the Page number  - current page number
 * @param pageNumber
 */
RBI.GetCustomerPurchasesRequest.prototype.setPageNumber = function(pageNumber){
    this.PageNumber = pageNumber;
};

/**
 * Setter for the sortField  - Field where to sort on
 * @param sortField
 */
RBI.GetCustomerPurchasesRequest.prototype.setSortField = function(sortField){
    this.SortField = sortField;
};

/**
 * Setter for the sortOrder  - direction on how to sort
 * @param sortOrder
 */
RBI.GetCustomerPurchasesRequest.prototype.setSortOrder = function(sortOrder){
    this.SortOrder = sortOrder;
};

/**
 * Setter for the InProgress  - Include the InProgress titles in results
 * @param inProgress
 */
RBI.GetCustomerPurchasesRequest.prototype.setInProgress = function(inProgress){
    this.InProgress = inProgress;
};

/**
 * Request Helper Object for Customer Purchases
 */
RBI.GetCustomerPurchasesRequestHelper = function () {

};
/**
 *  Request Helper Object for Customer Purchases - get the requestData as XML
 * @param request - CustomerPurchases Request Object
 * @param contentType
 * @return {*}
 */
RBI.GetCustomerPurchasesRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetPurchases";
        request.content = "<PartnerCustomerNumber>"+request.partnerCustomerNumber+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }

    return request;
};

/**
 *  Create Customer Token Request Object
 * @constructor
 */
RBI.CreateCustomerTokenRequest = function () {
};

/**
 * Create Customer Token Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.CreateCustomerTokenRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.CreateCustomerTokenRequest.prototype.getParameters = function () {
    return [];
};

/**
 *  Create Customer Request Object
 * @constructor
 */
RBI.CreateCustomerRequest = function () {
};

/**
 * Create Customer Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.CreateCustomerRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.CreateCustomerRequest.prototype.getParameters = function () {
    return ["FirstName", "LastName", "LoginEmail", "ZipCode", "Password","Token"];
};

/**
 * Setter for the FirstName
 * @param firstName
 */
RBI.CreateCustomerRequest.prototype.setFirstName = function(firstName){
    this.FirstName = firstName;
};

/**
 * Setter for the LastName
 * @param lastName
 */
RBI.CreateCustomerRequest.prototype.setLastName = function(lastName){
    this.LastName = lastName;
};

/**
 * Setter for the LoginEmail
 * @param loginEmail
 */
RBI.CreateCustomerRequest.prototype.setLoginEmail = function(loginEmail){
    this.LoginEmail = loginEmail;
};

/**
 * Setter for the ZipCode
 * @param zipCode
 */
RBI.CreateCustomerRequest.prototype.setZipCode = function(zipCode){
    this.ZipCode = zipCode;
};

/**
 * Setter for the Password
 * @param password
 */
RBI.CreateCustomerRequest.prototype.setPassword = function(password){
    this.Password = password;
};

/**
 * Setter for the Token
 * @param token
 */
RBI.CreateCustomerRequest.prototype.setToken = function(token){
    this.Token = token;
};

/**
 *  Update Customer Request Object
 * @constructor
 */
RBI.UpdateCustomerRequest = function () {

};

/**
 * Update Customer Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.UpdateCustomerRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.UpdateCustomerRequest.prototype.getParameters = function () {
    return ["FirstName", "LastName", "DisplayName", "BirthDay", "BirthMonth", "NotifyOfSubscriptionFail", "CVV", "ZipCode", "City", "State", "MobileNumber", "Address1", "Address2", "NotificationPreferences", "PCN","XboxShareOptOut"];
};

/**
 * Setter for the FirstName
 * @param firstName
 */
RBI.UpdateCustomerRequest.prototype.setFirstName = function(firstName){
    this.FirstName = firstName;
};

/**
 * Setter for the LastName
 * @param lastName
 */
RBI.UpdateCustomerRequest.prototype.setLastName = function(lastName){
    this.LastName = lastName;
};

RBI.UpdateCustomerRequest.prototype.setDisplayName = function(displayName){
    this.DisplayName = displayName;
};

RBI.UpdateCustomerRequest.prototype.setBirthDay = function(birthDay){
    this.BirthDay = birthDay;
};

RBI.UpdateCustomerRequest.prototype.setBirthMonth = function(birthMonth){
    this.BirthMonth = birthMonth;
};

/**
 * Setter for the CVV
 * @param cvv
 */
RBI.UpdateCustomerRequest.prototype.setCVV = function(cvv){
    this.CVV = cvv;
};

/**
 * Setter for the ZipCode
 * @param zipCode
 */
RBI.UpdateCustomerRequest.prototype.setZipCode = function(zipCode){
    this.ZipCode = zipCode;
};

RBI.UpdateCustomerRequest.prototype.setCity = function(city){
    this.City = city;
};

RBI.UpdateCustomerRequest.prototype.setState = function(state){
    this.State = state;
};

RBI.UpdateCustomerRequest.prototype.setMobileNumber = function(mobileNumber){
    this.MobileNumber = mobileNumber;
};

RBI.UpdateCustomerRequest.prototype.setAddress1 = function(address1){
    this.Address1 = address1;
};

RBI.UpdateCustomerRequest.prototype.setAddress2 = function(address2){
    this.Address2 = address2;
};

RBI.UpdateCustomerRequest.prototype.setNotificationPreferences = function(notificationPreferences){
    this.NotificationPreferences = notificationPreferences;
};

/**
 * Setter for the partnerCustomerNumber
 * @param partnerCustomerNumber
 */
RBI.UpdateCustomerRequest.prototype.setPCN = function(partnerCustomerNumber){
    this.PCN = partnerCustomerNumber;
};

/**
 * Setter for the XboxShareOptOut
 * @param partnerCustomerNumber
 */
RBI.UpdateCustomerRequest.prototype.setXboxShareOptOut = function (xboxShareOptOut) {
    this.XboxShareOptOut = xboxShareOptOut;
};

// ZOE-30490: Notification of Expired Subscription
/**
 * Set NotifyOfSubscriptionFail
 */

RBI.UpdateCustomerRequest.prototype.setNotifyOfSubscriptionFail = function(notifyOfSubscriptionFail){
    this.NotifyOfSubscriptionFail = notifyOfSubscriptionFail;
};

/**
 * Request Helper Object for Update Customer
 */
RBI.UpdateCustomerRequestHelper = function () {};

/**
 * Get History Request
 * @constructor
 */
RBI.GetHistoryRequest = function () {
};

/**
 * Get History Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetHistoryRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetHistoryRequest.prototype.getParameters = function () {
    return ["StartDate", "EndDate"];
};

/**
 * Setter For StartDate
 * @param startDate
 */
RBI.GetHistoryRequest.prototype.setStartDate = function (startDate) {
    this.StartDate = startDate;
};

/**
 * Setter For EndDate
 * @param endDate
 */
RBI.GetHistoryRequest.prototype.setEndDate = function (endDate) {
    this.EndDate = endDate;
};

/**
 * Get History Request Helper
 * @constructor
 */
RBI.GetHistoryRequestHelper = function () {};

/**
 * Get History Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @param event  - event Name of the request
 * @return XML String of the Request
 */
RBI.GetHistoryRequestHelper.prototype.getRequestData = function (request, contentType, event) {
    if (contentType === "application/xml") {
        request.event = event;
        request.content = "<PartnerCustomerNumber>"+ request.PartnerCustomerNumber+"</PartnerCustomerNumber>"
            + "<StartDate>"+request.StartDate+"</StartDate>"
            + "<EndDate>"+request.EndDate+"</EndDate>";

        return request.getRequestAsXML();
    }
    return request;
};


/**
 * Get Credit Balance Request
 * @constructor
 */
RBI.GetCreditBalanceRequest = function () {

};

/**
 * Get Credit Balance Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCreditBalanceRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCreditBalanceRequest.prototype.getParameters = function () {
    return ["PartnerCustomerNumber"];
};

/**
 * Setter For PartnerCustomerNumber
 * @param partnerCustomerNumber
 */
RBI.GetCreditBalanceRequest.prototype.setPartnerCustomerNumber = function (partnerCustomerNumber) {
    this.PartnerCustomerNumber = partnerCustomerNumber;
};

/**
 * Get Credit Balance Request Helper
 * @constructor
 */
RBI.GetCreditBalanceRequestHelper = function () {};

/**
 * Get Credit Balance Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.GetCreditBalanceRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetCreditBalance";
        request.content = "<PartnerCustomerNumber>"+ request.PartnerCustomerNumber+"</PartnerCustomerNumber>";

        return request.getRequestAsXML();
    }
    return request;
};

/**
 * Get Cards  Request
 * @constructor
 */
RBI.GetCardsRequest = function () {
    this.InvalidateCache = true;
};

/**
 * Get Cards Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetCardsRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetCardsRequest.prototype.getParameters = function () {
    return ["InvalidateCache"];
};

/**
 * Setter For PartnerCustomerNumber
 * @param partnerCustomerNumber
 */
RBI.GetCardsRequest.prototype.setInvalidateCache = function (invalidateCache) {
    this.InvalidateCache = invalidateCache;
};

/**
 * Setter For PartnerCustomerNumber
 * @param partnerCustomerNumber
 */
RBI.GetCardsRequest.prototype.setPartnerCustomerNumber = function (partnerCustomerNumber) {
    this.PartnerCustomerNumber = partnerCustomerNumber;
};

/**
 * Get Cards Request Helper
 * @constructor
 */
RBI.GetCardsRequestHelper = function () {};

/**
 * Get Cards Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.GetCardsRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetCards";
        request.content = "<PartnerCustomerNumber>"+ request.PartnerCustomerNumber+"</PartnerCustomerNumber>";

        return request.getRequestAsXML();
    }
    return request;
};




/** PRODUCT SERVICE Requests & Request Helpers **/
/**
 * Search Request Constructor
 * @param searchTerm  - The searchTerm
 * @param productType  - The type of product (movie,game,..)
 */
RBI.SearchRequest = function (searchTerm, productType) {
    this.params = {};
    this.searchTerm = searchTerm;
    this.productType = productType;
    this.format = null;
};

/**
 * Search Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.SearchRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.SearchRequest.prototype.getParameters = function () {
    return ["searchTerm", "productType", "specialFilter", "pageNumber", "pageSize",
        "sortField", "sortOrder", "includeComingSoon", "availability", "format", "platform", "genre",
        "contentRating", "userRating", "imageTypes", "scrubberSizes", "kioskID", "useDigitalSmith","totalSuggestions" ];
};

/**
 * Setter For Special Filter on Search Request
 * @param specialFilter
 */
RBI.SearchRequest.prototype.setSpecialFilter = function (specialFilter) {
    this.specialFilter = specialFilter;
};

/**
 * Setter For PageNumber on Search Request
 * @param pageNumber
 */
RBI.SearchRequest.prototype.setPageNumber = function (pageNumber) {
    this.pageNumber = pageNumber;
};

/**
 * Setter For PageSize on Search Request
 * @param pageSize
 */
RBI.SearchRequest.prototype.setPageSize = function (pageSize) {
    this.pageSize = pageSize;
};

/**
 * Setter For SearchTerm on Search Request
 * @param searchTerm
 */
RBI.SearchRequest.prototype.setSearchTerm = function (searchTerm) {
    this.searchTerm = searchTerm;
};
/**
 * Setter for the Kiosk Id
 * @param kioskId  - Unique identifier of a Kiosk
 */
RBI.SearchRequest.prototype.setKioskID = function (kioskId) {
    this.kioskID = kioskId;
};

/**
* Setter For User Rating on Search Request
* @param userRating
*/
RBI.SearchRequest.prototype.setUserRating = function (userRating) {
    this.userRating = userRating;
};

/**
* Setter For Format on Search Request
* @param format
*/
RBI.SearchRequest.prototype.setFormat = function (format) {
    this.format = format;
};
/**
* Setter For Platform on Search Request. For example, WII, PS3, XBOX.
* @param userRating
*/
RBI.SearchRequest.prototype.setPlatform = function (platform) {
    this.platform = platform;
};


/**
 * Setter For ProductType on Search Request
 * @param productType
 */
RBI.SearchRequest.prototype.setProductType = function (productType) {
    this.productType = productType;
};

/**
 * Setter For SortField on Search Request
 * @param sortField
 */
RBI.SearchRequest.prototype.setSortField = function (sortField) {
    this.sortField = sortField;
};

/**
 * Setter For SortOrder on Search Request
 * @param sortOrder
 */
RBI.SearchRequest.prototype.setSortOrder = function (sortOrder) {
    this.sortOrder = sortOrder;
};

/**
 * Setter For Include Coming Soon on Search Request
 * @param includeComingSoon
 */
RBI.SearchRequest.prototype.setIncludeComingSoon = function (includeComingSoon) {
    this.includeComingSoon = includeComingSoon;
};

/**
 * Setter For Availability on Search Request. 
 * @param availability string or comma delimited string of filter ids
 */
RBI.SearchRequest.prototype.setAvailability = function (availability) {
    this.availability = availability;
};

/**
 * Setter For Genre on Search Request
 * @param genre
 */
RBI.SearchRequest.prototype.setGenre = function (genre) {
    this.genre = genre;
};

/**
 * Setter For Content Rating on Search Request
 * @param contentRating
 */
RBI.SearchRequest.prototype.setContentRating = function (contentRating) {
    this.contentRating = contentRating;
};

/**
 * Setter For Image Types on Search Request
 * @param imageTypes
 */
RBI.SearchRequest.prototype.setImageTypes = function (imageTypes) {
    this.imageTypes = imageTypes;
};

/**
 * Setter For Scrubber Image Sizes on Search Request
 * @param scrubberSizes comma delimited list. See config.js for sizes of scrubbers
 */
RBI.SearchRequest.prototype.setScrubberSizes = function (scrubberSizes) {
    this.scrubberSizes = scrubberSizes;
};

/**
 * Setter For Using Digital Smith API on Proxy or regular ProductSearch on Search Request
 * @param useDigitalSmith boolean
 */
RBI.SearchRequest.prototype.setUseDigitalSmith = function (useDigitalSmith) {
    this.useDigitalSmith = useDigitalSmith;
};

/**
 * Setter For Total number of suggestions the client can receive on a productSearch
 * @param totalSuggestions total number of Suggestions
 */
RBI.SearchRequest.prototype.setTotalSuggestions = function (totalSuggestions) {
    this.totalSuggestions = totalSuggestions;
};

/**
 * FilterRequest
 * @param deviceType - device Type for example (web)
 * @constructor
 */
RBI.FilterRequest = function (deviceType) {
    if (deviceType) {
        this.deviceType = deviceType;
    } else {
        this.deviceType = RBI.PlatformConfig.deviceType;
    }
};

/**
 * Filter Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.FilterRequest.prototype = new RBI.RequestOL();


/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.FilterRequest.prototype.getParameters = function () {
    return ["deviceType"];
};

/**
 * Setter For DeviceType on Filter Request
 * @param deviceType
 */
RBI.FilterRequest.prototype.setDeviceType = function (deviceType) {
    this.deviceType = deviceType;
};

/**
 * Promotion Request
 * @param deviceType - Type of device for example (web)
 * @param promotionTypes - comma seperated list of promotion types
 * @constructor
 */
RBI.PromotionRequest = function (deviceType, promotionTypes) {
    if (deviceType) {
        this.deviceType = deviceType;
    } else {
        this.deviceType = RBI.PlatformConfig.deviceType;
    }
    this.promotionTypes = promotionTypes;
};

/**
 * Promotion Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.PromotionRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.PromotionRequest.prototype.getParameters = function () {
    return ["deviceType", "promotionTypes","LocalTime"];
};

/**
 * Setter For DeviceType on Promotion Request
 * @param deviceType
 */
RBI.PromotionRequest.prototype.setDeviceType = function (deviceType) {
    this.deviceType = deviceType;
};

/**
 * Setter For promotionTypes on Promotion Request
 * @param promotionTypes
 */
RBI.PromotionRequest.prototype.setPromotionTypes = function (promotionTypes) {
    this.promotionTypes = promotionTypes;
};

/**
 * Setter For localtime on Promotion Request
 * @param localTime
 */
RBI.PromotionRequest.prototype.setLocalTime = function (localTime) {
    this.LocalTime = localTime;
};
/**
 * Promotion Request Helper
 * @constructor
 */
RBI.PromotionRequestHelper = function () {

};

/**
 * Promotions Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.PromotionRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        return this.getRequestAsXML(request);
    }
    //if (contentType == "application/json") {
    //    return JSON.stringify(request);
    //}
    return request;
};

/**
 * Recommended Products Request
 * @constructor
 */
RBI.RecommendedProductRequest = function () {

};

/**
 * Recommended Products Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.RecommendedProductRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.RecommendedProductRequest.prototype.getParameters = function () {
    return ["ProductID", "NumberOfResults", "KioskID", "ImageTypes"];
};

/**
 * Setter For productId for which to search recommended products for
 * @param productID
 */
RBI.RecommendedProductRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};

/**
 * Setter For kioskID when you want to search inside specific kiosk
 * @param kioskID
 */
RBI.RecommendedProductRequest.prototype.setKioskID = function (kioskID) {
    this.KioskID = kioskID;
};

/**
 * Setter For ImageTypes of which images has to be returned in the results
 * @param imageTypes
 */
RBI.RecommendedProductRequest.prototype.setImageTypes = function (imageTypes) {
    this.ImageTypes = imageTypes;
};

/**
 * Setter For how many results should be included in the response
 * @param numberOfResults
 */
RBI.RecommendedProductRequest.prototype.setNumberOfResults = function (numberOfResults) {
    this.NumberOfResults = numberOfResults;
};

/**
 * When true the request will inform the service to call https via POST for logged in customers. Else this will be anonymous
 * @param secureFlag - boolean
 */
RBI.RecommendedProductRequest.prototype.setSecure = function (secureFlag) {
    this.secure = secureFlag;
};

/**
 * Recommended Products Request Helper
 * @constructor
 */
RBI.RecommendedProductRequestHelper = function () {
};

/**
 * Recommended Product Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.RecommendedProductRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetRecommendedProductsByProductID";
        request.content =
            "<PartnerCustomerNumber>"+request.getParam("PartnerCustomerNumber") +"</PartnerCustomerNumber>"
            + "<ProductID>"+request.getParam("ProductID")+"</ProductID>"
            + "<NumberofResults>"+request.getParam("NumberOfResults")+"</NumberofResults>";

		if (request.getParam("KioskID")) {
			request.content += "<KioskID>"+request.getParam("KioskID")+"</KioskID>";
		}
        return request.getRequestAsXML();
    }
    return request;
};

/**
 * Recommended Products By Search Criteria Request
 * @constructor
 */
RBI.RecommendedProductsBySearchCriteriaRequest = function () {

};

/**
 * Recommended Products By Search Criteria Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.getParameters = function () {
    return ["ProductID", "NumberOfResults", "KioskID", "ImageTypes", "Genre", "SpecialFilter", "Availability", "ContentRating", "Format", "PageNumber", "SortField", "SortOrder", "SearchQuery"];
};

/**
 * Setter For availability filter for which to search recommended products for
 * @param availabilityFilter
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setAvailability = function (availabilityFilter) {
    this.Availability = availabilityFilter;
};

/**
 * Setter For special filter for which to search recommended products for
 * @param specialFilter
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setSpecialFilter = function (specialFilter) {
    this.SpecialFilter = specialFilter;
};

/**
 * Setter For Genre filter for which to search recommended products for
 * @param genreFilter
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setGenre = function (genreFilter) {
    this.Genre = genreFilter;
};

/**
 * Setter For any SearchQuery for which to search recommended products for
 * @param searchQuery
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setSearchQuery = function (searchQuery) {
    this.SearchQuery = searchQuery;
};

/**
 * Setter For kioskID when you want to search inside specific kiosk
 * @param kioskID
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setKioskID = function (kioskID) {
    this.KioskID = kioskID;
};

/**
 * Setter For contentRatingID
 * @param contentRatingID
 */
 RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setContentRating = function (contentRatingID) {
        this.ContentRating = contentRatingID;
};

/**
 * Setter For formatID 
 * @param formatID
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setFormat = function (formatID) {
        this.Format = formatID;
};
	
/**
 * Setter For ImageTypes of which images has to be returned in the results
 * @param imageTypes
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setImageTypes = function (imageTypes) {
    this.ImageTypes = imageTypes;
};

/**
 * Setter For how many results should be included in the response
 * @param numberOfResults
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setNumberOfResults = function (numberOfResults) {
    this.NumberOfResults = numberOfResults;
};

/**
 * Setter for the page Number
 * @param pageNumber   - The page number of the resultSet
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the SortOrder
 * @param sortOrder   - The Direction of the sorting
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setSortOrder = function (sortOrder) {
    this.SortOrder = sortOrder;
};

/**
 * Setter for the field on which to sort on
 * @param sortField   - The field for sorting
 */
RBI.RecommendedProductsBySearchCriteriaRequest.prototype.setSortField = function (sortField) {
    this.SortField = sortField;
};


    /**
 * Product Detail Request
 * @param productId - product ID
 * @constructor
 */
RBI.ProductDetailsRequest = function (productId) {
    this.ProductID = productId;
    this.ImageTypes = "thumb nail";
};

/**
 * Product Detail Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.ProductDetailsRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.ProductDetailsRequest.prototype.getParameters = function () {
    return ["ProductID", "KioskID", "ImageTypes", "ScrubberSizes", "TargetDevices", "QueryID"];
};

/**
 * Setter For kioskID when you want to search inside specific kiosk
 * @param kioskID
 */
RBI.ProductDetailsRequest.prototype.setKioskID = function (kioskID) {
    this.KioskID = kioskID;
};

RBI.ProductDetailsRequest.prototype.setQueryID = function (queryID) {
    this.QueryID = queryID;
};

/**
 * Setter For ImageTypes of which images has to be returned in the results
 * @param imageTypes
 */
RBI.ProductDetailsRequest.prototype.setImageTypes = function (imageTypes) {
    this.ImageTypes = imageTypes;
};

/**
 * Setter For ProductId
 * @param productID
 */
RBI.ProductDetailsRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};

/**
 * Setter For Scrubber Image Sizes on Search Request
 * @param scrubberSizes comma delimited list. See config.js for sizes of scrubbers
 */
RBI.ProductDetailsRequest.prototype.setScrubberSizes = function (scrubberSizes) {
    this.ScrubberSizes = scrubberSizes;
};

/**
 * Setter for target devices to filter details request
 * @param targetDevices comma delimited list. See config.js for sizes of target devices
 */
RBI.ProductDetailsRequest.prototype.setTargetDevices = function (targetDevices) {
    this.TargetDevices = targetDevices;
};

/**
 * Set secure flag for request to shift the query for non customer vs customers
 * @param secureFlag
 */
RBI.ProductDetailsRequest.prototype.setSecure = function (secureFlag) {
    this.secure = secureFlag;
};

/**
 * Product Details Request Helper
 * @constructor
 */
RBI.ProductDetailsRequestHelper = function () {
};

/**
 * Product Details Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.ProductDetailsRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetProductDetailByProductID";
        request.content =
                "<PartnerCustomerNumber>"+request.getParam("PartnerCustomerNumber")+"</PartnerCustomerNumber>"
                + "<ProductID>"+request.getParam("ProductID")+"</ProductID>";

		if (request.getParam("KioskID")) {
			request.content += "<KioskID>"+request.getParam("KioskID")+"</KioskID>";
		}
        return request.getRequestAsXML();
    }
    return request;
};

/**
 * Set Playback Location Request
 * @param playbackData is optional constructor param
 * 
 * @constructor
 */
RBI.SetPlaybackLocationRequest = function (playbackData) {
    if (playbackData) {
        this.Token = playbackData.getToken();
        this.DeviceID = playbackData.getDeviceId();
        this.DeviceSpec = playbackData.getDeviceSpec();
        this.PCN = playbackData.getPartnerCustomerNumber();
        this.PurchaseOptionID = playbackData.value.PurchaseOptionID;
    }
};

RBI.SetPlaybackLocationRequest.Defines = {};
RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT = "HeartBeat";
RBI.SetPlaybackLocationRequest.Defines.STOP = "Stop";


/**
 * Set Playback Location Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.SetPlaybackLocationRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request (to proxy)
 * @return {Array}
 */
RBI.SetPlaybackLocationRequest.prototype.getParameters = function () {
    return ["Token", "DeviceID", "DeviceSpec", "PurchaseOptionID", "ProductID", "Status", "ProgressWatched"];
};

/**
 * Setter For Token
 * @param token
 */
RBI.SetPlaybackLocationRequest.prototype.setToken = function (token) {
    this.Token = token;
};

/**
 * Setter For DeviceID
 * @param deviceID
 */
RBI.SetPlaybackLocationRequest.prototype.setDeviceID = function (deviceID) {
    this.DeviceID = deviceID;
};

/**
 * Setter For deviceSpec
 * @param deviceSpec
 */
RBI.SetPlaybackLocationRequest.prototype.setDeviceSpec = function (deviceSpec) {
    this.DeviceSpec = deviceSpec;
};

/**
 * Setter For PurchaseOptionID
 * @param purchaseOptionID
 */
RBI.SetPlaybackLocationRequest.prototype.setPurchaseOptionID = function (purchaseOptionID) {
    this.PurchaseOptionID = purchaseOptionID;
};

/**
 * Setter For ProductId
 * @param productID
 */
RBI.SetPlaybackLocationRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};

/**
 * Setter For Status
 * @param status
 */
RBI.SetPlaybackLocationRequest.prototype.setStatus = function (status) {
    this.Status = status;
};

/**
 * Setter For ProgressWatched
 * @param progressWatched
 */
RBI.SetPlaybackLocationRequest.prototype.setProgressWatched = function (progressWatched) {
    this.ProgressWatched = progressWatched;
};


/**
 * Setter For PCN
 * @param pcn
 */
RBI.SetPlaybackLocationRequest.prototype.setPCN = function (pcn) {
    this.PCN = pcn;
};

/**
 * Set Playback Location Request Helper
 * @constructor
 */
RBI.SetPlaybackLocationRequestHelper = function () {
};

/**
 * Set Playback Location Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.SetPlaybackLocationRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "SetPlaybackLocation";
        request.requestFormat = "xml";
        request.content = "<PartnerCustomerNumber>"+ request.PCN+"</PartnerCustomerNumber>"
         + "<ProductID>" + request.ProductID + "</ProductID>"
        + "<PurchaseOptionID>" + request.PurchaseOptionID + "</PurchaseOptionID>"
        + "<ProgressWatched>" + request.ProgressWatched + "</ProgressWatched>"
        + "<Status>" + request.Status + "</Status>"
        + "<DeviceID>" + request.DeviceID + "</DeviceID>"
        + "<DeviceSpec>" + request.DeviceSpec + "</DeviceSpec>";
        return request.getRequestAsXML();
    }
    return request;
};

/**
 * Get Playback Location Request
 * @constructor
 */
RBI.GetPlaybackLocationRequest = function () {
};

/**
 * Get Playback location Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.GetPlaybackLocationRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetPlaybackLocationRequest.prototype.getParameters = function () {
    return ["ProductID", "Token"];
};

/**
 * Setter For Token
 * @param token
 */
RBI.GetPlaybackLocationRequest.prototype.setToken = function (token) {
    this.Token = token;
};

/**
 * Setter For ProductID
 * @param productID
 */
RBI.GetPlaybackLocationRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};

/**
 * Get Playback Location Request Helper
 * @constructor
 */
RBI.GetPlaybackLocationRequestHelper = function () {
};

/**
 * Get Playback Location Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.GetPlaybackLocationRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetPlaybackLocation";
        request.content = "<ProductID>" + request.getParam("productId") + "</ProductID>"
        + "<PartnerCustomerNumber>"+request.getParam("partnerCustomerNumber")+"</PartnerCustomerNumber>";
        return request.getRequestAsXML();
    }
    return request;
};

/**
 * Playback Request
 * @constructor
 */
RBI.PlaybackRequest = function () {
};

/**
 * Playback Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.PlaybackRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.PlaybackRequest.prototype.getParameters = function () {
    return ["DeviceID", "transactionDeviceID", "DeviceSpec", "PurchaseOptionID", "ProductId", "IsDownload", "UserPassword"];
};

/**
 * Setter For IsDownload
 * @param isDownload
 */
RBI.PlaybackRequest.prototype.setIsDownload = function (isDownload) {
    this.IsDownload = isDownload;
};

/**
 * Setter For DeviceID
 * @param deviceID
 */
RBI.PlaybackRequest.prototype.setDeviceID = function (deviceID) {
    this.DeviceID = deviceID;
};

RBI.PlaybackRequest.prototype.setTransactionDeviceID = function (transactionDeviceID) {
    this.transactionDeviceID = transactionDeviceID;
};

/**
 * Setter For deviceSpec
 * @param deviceSpec
 */
RBI.PlaybackRequest.prototype.setDeviceSpec = function (deviceSpec) {
    this.DeviceSpec = deviceSpec;
};

/**
 * Setter For PurchaseOptionID
 * @param purchaseOptionID
 */
RBI.PlaybackRequest.prototype.setPurchaseOptionID = function (purchaseOptionID) {
    this.PurchaseOptionID = purchaseOptionID;
};

/**
 * Setter For ProductId
 * @param productID
 */
RBI.PlaybackRequest.prototype.setProductID = function (productID) {
    this.ProductId = productID;
};

/**
 * Setter For UserPassword
 * @param userPassword
 */
RBI.PlaybackRequest.prototype.setUserPassword = function (userPassword) {
    this.UserPassword = userPassword;
};


/**
 * Get Playback URL Request Helper
 * @constructor
 */
RBI.GetPlaybackURLRequestHelper = function () {
};

/**
 * Get Playback URL Request Helper - For transforming it into XML
 * @param request  - Request data. @See RBI.PlaybackRequest
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.GetPlaybackURLRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "GetPlaybackURL";
        request.content = "<PartnerCustomerNumber>"+request.getParam("PartnerCustomerNumber")+"</PartnerCustomerNumber>"
            + "<DeviceID>"+request.getParam("DeviceID")+"</DeviceID>"
            + "<DeviceSpec>"+request.getParam("DeviceSpec")+"</DeviceSpec>"
            + "<IsDownload>"+request.getParam("IsDownload")+"</IsDownload>"
            + "<PurchaseOptionID>" + request.getParam("PurchaseOptionID") + "</PurchaseOptionID>";
        return request.getRequestAsXML();
    }
    return request;
};

/**
 * Complete Watching Title Request
 * @constructor
 */
RBI.CompleteWatchingTitleRequest = function (playbackData) {
    if (playbackData) {
        this.PartnerCustomerNumber = playbackData.getPartnerCustomerNumber();
        this.DeviceID = playbackData.getDeviceId();
        this.DeviceSpec = playbackData.getDeviceSpec();
        this.Token = playbackData.getToken();
    }
};

/**
 * Complete Watching Title Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.CompleteWatchingTitleRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.CompleteWatchingTitleRequest.prototype.getParameters = function () {
    return ["PurchaseOptionID", "DeviceID", "DeviceSpec", "ProductID", "PartnerCustomerNumber"];
};

/**
 * Setter For DeviceID
 * @param deviceID
 */
RBI.CompleteWatchingTitleRequest.prototype.setDeviceID = function (deviceID) {
    this.DeviceID = deviceID;
};

/**
 * Setter For deviceSpec
 * @param deviceSpec
 */
RBI.CompleteWatchingTitleRequest.prototype.setDeviceSpec = function (deviceSpec) {
    this.DeviceSpec = deviceSpec;
};

/**
 * Setter For PurchaseOptionID
 * @param purchaseOptionID
 */
RBI.CompleteWatchingTitleRequest.prototype.setPurchaseOptionID = function (purchaseOptionID) {
    this.PurchaseOptionID = purchaseOptionID;
};

/**
 * Setter For ProductId
 * @param productID
 */
RBI.CompleteWatchingTitleRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};


/**
 * Setter For PCN
 * @param pcn
 */
RBI.CompleteWatchingTitleRequest.prototype.setPCN = function (pcn) {
    this.PartnerCustomerNumber = pcn;
};


/**
 * Setter For the playback token
 * @param token
 */
RBI.CompleteWatchingTitleRequest.prototype.setToken = function (token) {
    this.Token = token;
};

/**
 * Complete Watching Title Request Helper
 * @constructor
 */
RBI.CompleteWatchingTitleRequestHelper = function () {
};

/**
 * Complete Watching Title Request Helper - For transforming it into XML
 * @param request  - Request data
 * @param contentType  - contentType of the transport
 * @return XML String of the Request
 */
RBI.CompleteWatchingTitleRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/xml") {
        request.event = "CompleteWatchingTitle";
        request.content = "<PartnerCustomerNumber>"+request.getParam("PartnerCustomerNumber")+"</PartnerCustomerNumber>"
            + "<ProductID>"+request.getParam("ProductID")+"</ProductID>";
        return request.getRequestAsXML();
    }
    return request;
};


/** REVIEW & RATINGS SERVICE Requests & Request Helpers **/
/**
 * Get ProductReviews Request
 * @constructor
 */
RBI.GetProductReviewsRequest = function () {
};

/**
 * Get ProductReviews Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetProductReviewsRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetProductReviewsRequest.prototype.getParameters = function () {
    return ["ProductID", "SortField", "SortOrder", "Altcode",
        "PageSize", "PageNumber"];
};

/**
 * Setter for the page Number
 * @param pageNumber   - The page number of the resultSet
 */
RBI.GetProductReviewsRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the page size
 * @param pageSize   - The page size of the resultSet
 */
RBI.GetProductReviewsRequest.prototype.setPageSize = function (pageSize) {
    this.PageSize = pageSize;
};

/**
 * Setter for the SortOrder
 * @param sortOrder   - The Direction of the sorting
 */
RBI.GetProductReviewsRequest.prototype.setSortOrder = function (sortOrder) {
    this.SortOrder = sortOrder;
};

/**
 * Setter for the field on which to sort on
 * @param sortField   - The field for sorting
 */
RBI.GetProductReviewsRequest.prototype.setSortField = function (sortField) {
    this.SortField = sortField;
};

/**
 * Setter for the ProductId
 * @param productId   - The productId unique identifier of a product
 */
RBI.GetProductReviewsRequest.prototype.setProductID = function (productId) {
    this.ProductID = productId;
};

/**
 * Setter for the AltCode
 * @param altCode   - The altCode unique identifier of a product
 */
RBI.GetProductReviewsRequest.prototype.setAltcode = function (altCode) {
    this.Altcode = altCode;
};

/**
 * Get ProductRatings Request
 * @constructor
 */
RBI.GetProductRatingsRequest = function () {
};

/**
 * Get ProductRatings Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.GetProductRatingsRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.GetProductRatingsRequest.prototype.getParameters = function () {
    return ["ProductID", "Altcode", "PageSize", "PageNumber"];
};
/**
 * Setter for the page Number
 * @param pageNumber   - The page number of the resultSet
 */
 RBI.GetProductRatingsRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the page size
 * @param pageSize   - The page size of the resultSet
 */
RBI.GetProductRatingsRequest.prototype.setPageSize = function (pageSize) {
    this.PageSize = pageSize;
};

/**
 * Setter for the productId
 * @param productId   - Unique Identifier of a product - IF using OL
 */
RBI.GetProductRatingsRequest.prototype.setProductID = function (productId) {
    this.ProductID = productId;
};

/**
 * Setter for the altCode
 * @param altCode   - Unique Identifier of a product - IF using pluckService
 */
RBI.GetProductRatingsRequest.prototype.setAltCode = function (altCode) {
    this.Altcode = altCode;
};

/**
 * Rate Product Request
 * @constructor
 */
RBI.RateProductRequest = function (productModel) {
    if(productModel){
        this.ProductID = productModel.getProductID();
        this.Altcode = productModel.getAltCode();
        this.ProductTitle = productModel.getTitle();
        this.ProductUrl = productModel.getSEOURL();
    }
};

/**
 * Rate Product Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.RateProductRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.RateProductRequest.prototype.getParameters = function () {
    return ["ProductID", "Rating", "Altcode","ProductTitle","ProductUrl"];
};

/**
 * Setter for the rating
 * @param rating   - Star Rating value
 */
RBI.RateProductRequest.prototype.setRating = function (rating) {
    this.Rating = rating;
};

/**
 * Setter for the productId
 * @param productId   - Unique Identifier of a product - IF using OL
 */
RBI.RateProductRequest.prototype.setProductID = function (productId) {
    this.ProductID = productId;
};

/**
 * Setter for the altCode
 * @param altCode   - Unique Identifier of a product - IF using pluckService
 */
RBI.RateProductRequest.prototype.setAltCode = function (altCode) {
    this.Altcode = altCode;
};

/**
 * Setter for the productTitle
 * @param productTitle   - Title of the product
 */
RBI.RateProductRequest.prototype.setProductTitle = function (productTitle) {
    this.ProductTitle = productTitle;
};

/**
 * Setter for the productUrl
 * @param productUrl   - Url of detail page of the product
 */
RBI.RateProductRequest.prototype.setProductUrl = function (productUrl) {
    this.ProductUrl = productUrl;
};

/**
 * Review Product Request
 * @constructor
 */
RBI.ReviewProductRequest = function (productModel) {
    if(productModel){
        this.ProductID = productModel.getProductID();
        this.Altcode = productModel.getAltCode();
        this.ProductTitle = productModel.getTitle();
        this.ProductUrl = productModel.getSEOURL();
    }
};

/**
 * Review Product Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.ReviewProductRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.ReviewProductRequest.prototype.getParameters = function () {
    return ["ProductID", "ReviewRating", "ReviewText", "Altcode",
        "ReviewTitle", "ProductTitle","ProductUrl", "SortField",
        "SortOrder", "PageSize", "PageNumber"];
};

/**
 * Setter for the Rating on a particular review
 * @param reviewRating   - Rating
 */
RBI.ReviewProductRequest.prototype.setReviewRating = function (reviewRating) {
    this.ReviewRating = reviewRating;
};

/**
 * Setter for the review Text
 * @param reviewText   - The body text of the review
 */
RBI.ReviewProductRequest.prototype.setReviewText = function (reviewText) {
    this.ReviewText = reviewText;
};

/**
 * Setter for the page Number
 * @param pageNumber   - The page number of the resultSet
 */
RBI.ReviewProductRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the page size
 * @param pageSize   - The page size of the resultSet
 */
RBI.ReviewProductRequest.prototype.setPageSize = function (pageSize) {
    this.PageSize = pageSize;
};

/**
 * Setter for the SortOrder
 * @param sortOrder   - The Direction of the sorting
 */
RBI.ReviewProductRequest.prototype.setSortOrder = function (sortOrder) {
    this.SortOrder = sortOrder;
};

/**
 * Setter for the field on which to sort on
 * @param sortField   - The field for sorting
 */
RBI.ReviewProductRequest.prototype.setSortField = function (sortField) {
    this.SortField = sortField;
};

/**
 * Setter for the ProductId
 * @param productId   - The productId unique identifier of a product
 */
RBI.ReviewProductRequest.prototype.setProductID = function (productId) {
    this.ProductID = productId;
};

/**
 * Setter for the AltCode
 * @param altCode   - The altCode unique identifier of a product
 */
RBI.ReviewProductRequest.prototype.setAltcode = function (altCode) {
    this.Altcode = altCode;
};

/**
 * Setter for the productTitle
 * @param productTitle   - Title of the product
 */
RBI.ReviewProductRequest.prototype.setProductTitle = function (productTitle) {
    this.ProductTitle = productTitle;
};

/**
 * Setter for the productUrl
 * @param productUrl   - Url of detail page of the product
 */
RBI.ReviewProductRequest.prototype.setProductUrl = function (productUrl) {
    this.ProductUrl = productUrl;
};


/**
 * Remove Review Product Request
 * @constructor
 */
RBI.RemoveReviewRequest = function () {
};

/**
 * Remove Review Product Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.RemoveReviewRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.RemoveReviewRequest.prototype.getParameters = function () {
    return ["ProductID", "Altcode", "SortField", "SortOrder",
        "PageSize", "PageNumber", "ReviewKeyId"];
};

/**
 * Setter for the review Key
 * @param reviewKeyId   - The reviewKeyId - unique identifier of a specific review
 */
RBI.RemoveReviewRequest.prototype.setReviewKeyId = function (reviewKeyId) {
    this.ReviewKeyId = reviewKeyId;
};

/**
 * Setter for the page Number
 * @param pageNumber   - The page number of the resultSet
 */
RBI.RemoveReviewRequest.prototype.setPageNumber = function (pageNumber) {
    this.PageNumber = pageNumber;
};

/**
 * Setter for the page size
 * @param pageSize   - The page size of the resultSet
 */
RBI.RemoveReviewRequest.prototype.setPageSize = function (pageSize) {
    this.PageSize = pageSize;
};

/**
 * Setter for the SortOrder
 * @param sortOrder   - The Direction of the sorting
 */
RBI.RemoveReviewRequest.prototype.setSortOrder = function (sortOrder) {
    this.SortOrder = sortOrder;
};

/**
 * Setter for the field on which to sort on
 * @param sortField   - The field for sorting
 */
RBI.RemoveReviewRequest.prototype.setSortField = function (sortField) {
    this.SortField = sortField;
};

/**
 * Setter for the ProductId
 * @param productId   - The productId unique identifier of a product
 */
RBI.RemoveReviewRequest.prototype.setProductID = function (productId) {
    this.ProductID = productId;
};

/**
 * Setter for the AltCode
 * @param altCode   - The altCode unique identifier of a product
 */
RBI.RemoveReviewRequest.prototype.setAltcode = function (altCode) {
    this.Altcode = altCode;
};

/**
 * Update PluckFields Request
 * @constructor
 */
RBI.UpdatePluckFieldsRequest = function () {
};

/**
 * UpdatePluckFields Request initializing Base Request
 * @type {RBI.RequestOL}
 */
RBI.UpdatePluckFieldsRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.UpdatePluckFieldsRequest.prototype.getParameters = function () {
    return ["DisplayName", "PluckTerms"];
};

/**
 * Setter for the DisplayName
 * @param displayName   - The displayName of the current user
 */
RBI.UpdatePluckFieldsRequest.prototype.setDisplayName = function (displayName) {
    this.DisplayName = displayName;
};

/**
 * Setter for the pluckTerms
 * @param pluckTerms   - The pluckTerms agreement of the current user
 */
RBI.UpdatePluckFieldsRequest.prototype.setPluckTerms = function (pluckTerms) {
    this.PluckTerms = pluckTerms;
};


/**
 * Add Bookmark request
 * @constructor
 */
RBI.AddBookmarkRequest = function () {
};

/**
 * Add Bookmark Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.AddBookmarkRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.AddBookmarkRequest.prototype.getParameters = function () {
    return ["ProductID"];
};

/**
 * Setter For ProductID
 * @param productID
 */
RBI.AddBookmarkRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};

/**
 * Remove Bookmark request
 * @constructor
 */
RBI.RemoveBookmarkRequest = function () {
};

/**
 * Remove Bookmark Request initializing Base Request
 * @type {RBI.Request}
 */
RBI.RemoveBookmarkRequest.prototype = new RBI.RequestOL();

/**
 * The array of parameters that we should persist in the request
 * @return {Array}
 */
RBI.RemoveBookmarkRequest.prototype.getParameters = function () {
    return ["ProductID"];
};

/**
 * Setter For ProductID
 * @param productID
 */
RBI.RemoveBookmarkRequest.prototype.setProductID = function (productID) {
    this.ProductID = productID;
};


/**
 * Request Object for updating customer parental controls
 * @constructor
 */
RBI.UpdateParentalControlsRequest = function () {
};

RBI.UpdateParentalControlsRequest.prototype = new RBI.RequestOL();

RBI.UpdateParentalControlsRequest.prototype.getParameters = function () {
    return ["DeviceID", "ParentalControlOptionID", "RestrictPurchases"];
};

/**
 * Setter For DeviceID
 * @param deviceID
 */
RBI.UpdateParentalControlsRequest.prototype.setDeviceID = function (deviceID) {
    this.DeviceID = deviceID;
};

/**
 * Setter For ParentalControlOptionID
 * @param parentalControlOptionID
 */
RBI.UpdateParentalControlsRequest.prototype.setParentalControlOptionID = function (parentalControlOptionID) {
    this.ParentalControlOptionID = parentalControlOptionID;
};

/**
 * Setter For RestrictPurchases
 * @param restrictPurchases
 */
RBI.UpdateParentalControlsRequest.prototype.setRestrictPurchases = function (restrictPurchases) {
    this.RestrictPurchases = restrictPurchases;
};


/**
 * Request Object for updating customer parental controls
 * @constructor
 */
RBI.CheckParentalControlPWRequest = function (password) {
	this.Password = password;
};

RBI.CheckParentalControlPWRequest.prototype = new RBI.RequestOL();

RBI.CheckParentalControlPWRequest.prototype.getParameters = function () {
    return ["Password"];
};

    /**
     *  GetDevicesRequest Request Object
     * @constructor
     */
    RBI.GetDevicesRequest = function () {
    };

    /**
     * GetDevicesRequest initializing Base Request
     * @type {RBI.RequestOL}
     */
    RBI.GetDevicesRequest.prototype = new RBI.RequestOL();

    /**
     * The array of parameters that we should persist in the request
     * @return {Array}
     */
    RBI.GetDevicesRequest.prototype.getParameters = function () {
        return [];
    };

    /**
     *  GetActiveDevicesRequest Request Object
     * @constructor
     */
    RBI.GetActiveDevicesRequest = function () {
    };

    /**
     * GetActiveDevicesRequest initializing Base Request
     * @type {RBI.RequestOL}
     */
    RBI.GetActiveDevicesRequest.prototype = new RBI.RequestOL();

    /**
     * The array of parameters that we should persist in the request
     * @return {Array}
     */
    RBI.GetActiveDevicesRequest.prototype.getParameters = function () {
        return [];
    };

    /**
     *  UpdateDeviceRequest Request Object
     * @constructor
     */
    RBI.UpdateDeviceRequest = function () {
    };

    /**
     * UpdateDeviceRequest initializing Base Request
     * @type {RBI.RequestOL}
     */
    RBI.UpdateDeviceRequest.prototype = new RBI.RequestOL();

    /**
     * The array of parameters that we should persist in the request
     * @return {Array}
     */
    RBI.UpdateDeviceRequest.prototype.getParameters = function () {
        return ["DeviceID", "Name", "Active"];
    };


    /**
     * UpdateDeviceRequest
     * Setter for device ID
     */
    RBI.UpdateDeviceRequest.prototype.setDeviceID = function(deviceID) {
        this.DeviceID = deviceID;
    };

    /**
     * UpdateDeviceRequest
     * Setter for name
     */
    RBI.UpdateDeviceRequest.prototype.setName = function(name) {
        this.Name = name;
    };

    /**
     * UpdateDeviceRequest
     * Setter for active parameter
     */
    RBI.UpdateDeviceRequest.prototype.setActive = function(isActive) {
        this.Active = isActive;
    };


    /**
     *  RemoveDeviceRequest Request Object
     * @constructor
     */
    RBI.RemoveDeviceRequest = function () {
        // Optional parameters
        this.DeactivateOnly = false;
        // rbproxy fails with IsLocalDevice though it is listed in API
        //this.IsLocalDevice = false;
    };

    /**
     * RemoveDeviceRequest initializing Base Request
     * @type {RBI.RequestOL}
     */
    RBI.RemoveDeviceRequest.prototype = new RBI.RequestOL();

    /**
     * The array of parameters that we should persist in the request
     * @return {Array}
     */
    RBI.RemoveDeviceRequest.prototype.getParameters = function () {
        return ["DeviceID", "DeactivateOnly"];
    };

    /**
     * RemoveDeviceRequest
     * Setter for device ID
     */
    RBI.RemoveDeviceRequest.prototype.setDeviceID = function(deviceID) {
        this.DeviceID = deviceID;
    };

    /**
     * RemoveDeviceRequest
     * Setter for DeactivateOnly parameter
     */
    RBI.RemoveDeviceRequest.prototype.setDeactivateOnly = function(isDeactivateOnly) {
        this.DeactivateOnly = isDeactivateOnly;
    };

    /**
     * RemoveDeviceRequest
     * Setter for IsLocalDevice parameter
     */
    RBI.RemoveDeviceRequest.prototype.setIsLocalDevice = function(isLocalDevice) {
        this.IsLocalDevice = isLocalDevice;
    };

    /**
     *  ActivateDeviceRequest Request Object
     * @constructor
     */
    RBI.ActivateDeviceRequest = function () {
    };

    /**
     * ActivateDeviceRequest initializing Base Request
     * @type {RBI.RequestOL}
     */
    RBI.ActivateDeviceRequest.prototype = new RBI.RequestOL();

    /**
     * The array of parameters that we should persist in the request
     * @return {Array}
     */
    RBI.ActivateDeviceRequest.prototype.getParameters = function () {
        return ["DeviceID", "Name", "Type", "DownloadActive"];
    };

    /**
     * ActivateDeviceRequest
     * Setter for device ID
     */
    RBI.ActivateDeviceRequest.prototype.setDeviceID = function(deviceID) {
        this.DeviceID = deviceID;
    };

    /**
     * ActivateDeviceRequest
     * Setter for name parameter
     */
    RBI.ActivateDeviceRequest.prototype.setName = function(name) {
        this.Name = name;
    };

    /**
     * ActivateDeviceRequest
     * Setter for type
     */
    RBI.ActivateDeviceRequest.prototype.setType = function(type) {
        this.Type = type;
    };


    /**
     * ActivateDeviceRequest
     * Setter for DownloadActive parameter
     */
    RBI.ActivateDeviceRequest.prototype.setDownloadActive = function(isActive) {
        this.DownloadActive = isActive;
    };
}());

(function initReservationModel() {
	"use strict";

/*
 * Model object for Subscription. The constructor takes one parameter: value
 * @param value - the JSON of the data service layer
 */
RBI.Subscription = function(value) {
	var i;
	this.value = value;
	this.creditOptions = [];
	if (value.CreditOptions) {
		for (i in value.CreditOptions) {
			this.creditOptions.push(new RBI.CreditOption(value.CreditOptions[i]));
		}
	}

	this.packages = [];
	if (value.Packages) {
		for (i in value.Packages) {
			this.packages.push(new RBI.Package(value.Packages[i]));
		}
	}
};

RBI.Subscription.prototype.getCreditOptions = function() {
	return this.creditOptions;
};

RBI.Subscription.prototype.getPackages = function() {
	return this.packages;
};

RBI.CreditOption = function(value) {
	this.value = value;
};

RBI.CreditOption.prototype.getDescription = function() {
	return this.value.CreditOptionDescription;
};
RBI.CreditOption.prototype.getId = function() {
	return this.value.CreditOptionID;
};
RBI.CreditOption.prototype.getName = function() {
	return this.value.CreditOptionName;
};
RBI.CreditOption.prototype.isFreeTrialAvailable = function() {
	return this.value.FreeTrialAvail && this.value.FreeTrialAvail.toLowerCase() === "true";
};
RBI.CreditOption.prototype.getPrice = function() {
	return this.value.Price;
};
RBI.CreditOption.prototype.getPriceDescription = function() {
	return this.value.PriceDescription;
};
RBI.CreditOption.prototype.getSortOrder = function() {
	return this.value.SortOrder;
};

/*
 * CreditUseHistory Model
 */

RBI.CreditUseHistory = function(value) {
	this.value = value;
};

RBI.CreditUseHistory.prototype.getCreditState = function() {
	return this.value.CreditState;
};
RBI.CreditUseHistory.prototype.getEffectiveDate = function() {
	return this.value.EffectiveDate;
};
RBI.CreditUseHistory.prototype.getExpirationDate = function() {
	return this.value.ExpirationDate;
};
RBI.CreditUseHistory.prototype.getInvoiceNumber = function() {
	return this.value.InvoiceNumber;
};
RBI.CreditUseHistory.prototype.getRedemptionDate = function() {
	return this.value.RedemptionDate;
};
RBI.CreditUseHistory.prototype.getType = function() {
	return this.value.Type;
};
////

/*
 * SubscriptionHistory Model
 */
RBI.SubscriptionHistory = function(value) {
	this.value = value;
    this.postConstruct && this.postConstruct();
};

RBI.SubscriptionHistory.prototype.getCharge = function() {
	return this.value.Charge;
};
RBI.SubscriptionHistory.prototype.getDate = function() {
	return this.value.Date;
};
RBI.SubscriptionHistory.prototype.getEndDate = function() {
	return this.value.EndDate;
};
RBI.SubscriptionHistory.prototype.getLastFour = function() {
	return this.value.LastFour;
};
RBI.SubscriptionHistory.prototype.getPlan = function() {
	return this.value.Plan;
};
RBI.SubscriptionHistory.prototype.getSubTotal = function() {
	return this.value.SubTotal;
};
RBI.SubscriptionHistory.prototype.getTax = function() {
	return this.value.Tax;
};
RBI.SubscriptionHistory.prototype.getTaxState = function() {
	return this.value.TaxState;
};
RBI.SubscriptionHistory.prototype.getType = function() {
	return this.value.Type;
};
////

RBI.Package = function(value) {
	this.value = value;
};

RBI.Package.prototype.getDescription = function() {
	return this.value.PackageDescription;
};
RBI.Package.prototype.getId = function() {
	return this.value.PackageID;
};
RBI.Package.prototype.getName = function() {
	return this.value.PackageName;
};
RBI.Package.prototype.isFreeTrialAvailable = function() {
	return this.value.FreeTrialAvail && this.value.FreeTrialAvail.toLowerCase() === "true";
};
RBI.Package.prototype.getPrice = function() {
	return this.value.Price;
};
RBI.Package.prototype.getPriceDescription = function() {
	return this.value.PriceDescription;
};
RBI.Package.prototype.getSortOrder = function() {
	return this.value.SortOrder;
};

/**
 * Model object for KioskCartPricing. The constructor takes one parameter: value
 * @param value - the JSON of the data service layer
 * @constructor
 */
RBI.KioskCartPricing = function(value) {
	var i;
	this.value = value;
	this.items = [];
	if (value.KioskCartPricing) {
		for (i in value.KioskCartPricing) {
			this.items.push(new RBI.KioskCartPricingItem(value.KioskCartPricing[i]));
		}
	}
};

RBI.KioskCartPricing.prototype.getItems = function() {
	return this.items;
};

// OL returns this. Sum of all discounts for all items in the cart.
RBI.KioskCartPricing.prototype.getDiscountedSubTotal = function() {
    var discountedSubTotalValue = this.value.DiscountedSubTotal;
    discountedSubTotalValue ? discountedSubTotalValue = Number(discountedSubTotalValue).toFixed(2) : discountedSubTotalValue;
    return discountedSubTotalValue;
};
// OL calculates it, but formula is the following: (sum of all item.price) + this.tax - this.discountedSubTotal.
RBI.KioskCartPricing.prototype.getGrandTotal = function() {
    var grandTotalValue = this.value.GrandTotal;
    grandTotalValue ? grandTotalValue = Number(grandTotalValue).toFixed(2) : grandTotalValue;
    return grandTotalValue;
};
// The same as previous but without this.tax.
RBI.KioskCartPricing.prototype.getSubTotal = function() {
    var subTotalValue = this.value.SubTotal;
    subTotalValue ? subTotalValue = Number(subTotalValue).toFixed(2) : subTotalValue;
    return subTotalValue;
};
RBI.KioskCartPricing.prototype.getTax = function () {
    var taxValue = this.value.Tax;
    taxValue ? taxValue = Number(taxValue).toFixed(2) : taxValue;
    return taxValue;
};

RBI.KioskCartPricingItem = function(value) {
	this.value = value;
};
RBI.KioskCartPricingItem.prototype.getPurchaseOptionId = function() {
	return this.value.PurchaseOptionID;
};
// Price for the first day.
RBI.KioskCartPricingItem.prototype.getPrice = function() {
	return this.value.Price;
};
// Price for the following days.
RBI.KioskCartPricingItem.prototype.getExtraPrice = function() {
	return this.value.ExtraPrice;
};
// TODO: Recheck if OL returns other price/discount fields.
RBI.KioskCartPricingItem.prototype.getDiscountedPrice = function() {
	return this.value.DiscountedPrice;
};
RBI.KioskCartPricingItem.prototype.getDiscount = function() {
	return this.value.Discount;
};


RBI.PerformKioskReservationResponse = function(value) {
	var i;
	this.value = value;

	this.reservedItems = [];
	if (value.ReservedItems) {
		for (i in value.ReservedItems) {
			this.reservedItems.push(new RBI.KioskReservedItem(value.ReservedItems[i]));
		}
	}
};
RBI.PerformKioskReservationResponse.prototype.getReservedItems = function() {
	return this.reservedItems;
};
RBI.PerformKioskReservationResponse.prototype.getSubTotal = function() {
	return this.value.SubTotal;
};
RBI.PerformKioskReservationResponse.prototype.getDiscountedSubTotal = function() {
	return this.value.DiscountedSubTotal;
};
RBI.PerformKioskReservationResponse.prototype.getTax = function() {
	return this.value.Tax;
};
RBI.PerformKioskReservationResponse.prototype.getHideTax = function() {
	return this.value.HideTax && this.value.HideTax.toLowerCase() === "true";
};
RBI.PerformKioskReservationResponse.prototype.getGrandTotal = function() {
	return this.value.GrandTotal;
};
RBI.PerformKioskReservationResponse.prototype.getPickupBy = function() {
	return this.value.PickupBy;
};
RBI.PerformKioskReservationResponse.prototype.getReservationId = function() {
	return this.value.ReservationId;
};
RBI.PerformKioskReservationResponse.prototype.getPartnerCustomerNumber = function() {
	return this.value.PartnerCustomerNumber;
};

RBI.KioskReservedItem = function(value) {
	this.value = value;
};
RBI.KioskReservedItem.prototype.getProductID = function() {
	return this.value.ProductID;
};
RBI.KioskReservedItem.prototype.getPurchaseOptionID = function() {
	return this.value.PurchaseOptionID;
};
RBI.KioskReservedItem.prototype.getPrice = function() {
	return this.value.Price;
};
RBI.KioskReservedItem.prototype.getDiscount = function() {
	return this.value.Discount;
};
RBI.KioskReservedItem.prototype.getDiscountedPrice = function() {
	return this.value.DiscountedPrice;
};
RBI.KioskReservedItem.prototype.getExtraPrice = function() {
	return this.value.ExtraPrice;
};

/**
 * The model describes response from server for GetOnDemandCartPricing call.
 * @param value - json representation of the model.
 * @constructor
 */
RBI.OnDemandCartPricing = function(value) {
	this.value = value;
};
RBI.OnDemandCartPricing.prototype.getConfirmationId = function() {
	return this.value.ConfirmationID;
};
RBI.OnDemandCartPricing.prototype.getPrice = function() {
	return this.value.Price;
};
RBI.OnDemandCartPricing.prototype.getTax = function() {
	return this.value.Tax;
};
RBI.OnDemandCartPricing.prototype.getTotal = function() {
	return this.value.Total;
};

RBI.OnDemandPurchase = function(value) {
	this.value = value;
};
RBI.OnDemandPurchase.prototype.getBillingTransactionId = function() {
	return this.value.BillingTransactionID;
};
RBI.OnDemandPurchase.prototype.getPartnerCustomerNumber = function() {
	return this.value.PartnerCustomerNumber;
};

RBI.SubscriptionPricing = function(value) {
	this.value = value;
};
RBI.SubscriptionPricing.prototype.getConfirmationId = function() {
	return this.value.ConfirmationID;
};
RBI.SubscriptionPricing.prototype.getPrice = function() {
	return this.value.Price;
};
RBI.SubscriptionPricing.prototype.getProratedAmount = function() {
	return this.value.ProratedAmount;
};
RBI.SubscriptionPricing.prototype.getTax = function() {
	return this.value.Tax;
};
RBI.SubscriptionPricing.prototype.getTotal = function() {
	return this.value.Total;
};

RBI.SubscriptionResponse = function(value) {
	this.value = value;
	this.customer = new RBI.Customer(value.content.CustomerInfo);
};
RBI.SubscriptionResponse.prototype.getBeginDate = function() {
	return this.value.BeginDate;
};
RBI.SubscriptionResponse.prototype.getBillingTransactionId = function() {
	return this.value.BillingTransactionID;
};
RBI.SubscriptionResponse.prototype.getCustomer = function() {
	return this.customer;
};

RBI.CancelSubscriptionResponse = function(value) {
	this.value = value;
	this.customer = new RBI.Customer(value.content.CustomerInfo);
};
RBI.CancelSubscriptionResponse.prototype.getCustomer = function() {
	return this.customer;
};
}());
(function initResponseModel() {
	"use strict";

/*
 * Common Response Model
 *
 * Model object for a common response. The constructor takes one argument:
 * @param value - the JSON of the Response object.
 */
RBI.Response = function(value)  {
    this.value = value;
    this.resultInfo = new RBI.ResultInfo(value["ResultInfo"]);
};

RBI.Response.prototype.getResponseCode = function () {
    return this.value["responseCode"];
};

RBI.Response.prototype.isSuccessful = function () {
    return this.value["successful"];
};

RBI.Response.prototype.getResultInfo = function () {
    return this.resultInfo;
};

/*
 * Common ResultInfo Model
 *
 * Model object for a common ResultInfo response. The constructor takes one argument:
 * @param value - the JSON of the ResultInfo object.
 */
RBI.ResultInfo = function(value)  {
    this.value = value;

};

RBI.ResultInfo.prototype.isSuccessful = function () {
    return this.value["ResultCode"];
};

RBI.ResultInfo.prototype.isSuccessful = function () {
    return this.value["successful"];
};

/**
 * Common OAuth Response model. This wraps the actual oauth token and relates it to a PCN used to 
 * originally create the token. It also provides utility methods to determine if token expired
 * 
 */
RBI.OAuthToken = function(token, pcn) {
	this.token = token;
	this.pcn = pcn;
	
	
	
};


/*
 * PageInfo Model
 */
RBI.PageInfo = function (value) {
    this.value = value;
};

RBI.PageInfo.prototype.getCount = function (value) {
    return this.value["Count"];
};

RBI.PageInfo.prototype.getStartNumber = function (value) {
    return this.value["StartNumber"];
};

RBI.PageInfo.prototype.getEndNumber = function (value) {
    return this.value["EndNumber"];
};



}());
(function initReviewRatingModel() {
	"use strict";

/**
 * Product Review Response  Model
 * Author: Stijn Asnong
 * Date: 6/25/13
 * @param value - the JSON of the data service layer
 */
RBI.ProductReviewResponse = function (value) {
	var i;
    this.reviews = [];
    this.value = value;
    var reviewList = this.value["Reviews"];
    for(i in reviewList){
        var review = new RBI.ProductReview(reviewList[i]);
        this.reviews.push(review);
    }
};

/**
 * Get The Average Review Rating
 * @return int - the average review rating
 */
RBI.ProductReviewResponse.prototype.getAverageReviewRating = function () {
    return this.value["AverageReviewRating"];
};

/**
 * Get The total Reviews for this product
 * @return int - the total of reviews
 */
RBI.ProductReviewResponse.prototype.getTotalReviews = function () {
    return this.value["TotalReviews"];
};

/**
 * Look if the current user Has Reviewed this title already
 * @return boolean - customer has reviewed
 */
RBI.ProductReviewResponse.prototype.getCustomerHasReviewed = function () {
    return this.value["CustomerHasReview"];
};

/**
 * Get collection of Reviews
 * @return Array of Reviews
 */
RBI.ProductReviewResponse.prototype.getReviews = function () {
    return this.reviews;
};

/**
 * Product Review Model
 * Author: Stijn Asnong
 * Date: 6/25/13
 * @param value - the JSON of the data service layer
 */
RBI.ProductReview = function (value) {
    this.value = value;
    this.postConstruct();
};

/*
 * Execute after constructor. Subclasses do something more interesting
 */
RBI.ProductReview.prototype.postConstruct = function () {

};

/**
 * Get the rating of this specific review
 * @return Integer - rating
 */
RBI.ProductReview.prototype.getReviewRating = function () {
    return this.value["ReviewRating"];
};

/**
 * Get the review Text the user entered
 * @return String - review Text
 */
RBI.ProductReview.prototype.getReviewText = function () {
    return this.value["ReviewText"];
};

/**
 * Get the review Key - unique identifier of each review
 * @return String - review key
 */
RBI.ProductReview.prototype.getReviewKey = function () {
    return this.value["ReviewKeyId"];
};

/**
 * Get the DisplayName of the user that entered the review
 * @return String - DisplayName
 */
RBI.ProductReview.prototype.getDisplayName = function () {
    return this.value["DisplayName"];
};

/**
 * Get the review Date
 * @return Date - ReviewDate
 */
RBI.ProductReview.prototype.getReviewDate = function () {
    return this.value["ReviewDate"];
};

/**
 * Look up if the review is from the current customer
 * @return boolean - IsCurrentCustomer
 */
RBI.ProductReview.prototype.getIsCurrentCustomer = function () {
    return this.value["IsCurrentCustomer"];
};


/**
 * Product Rating  Model
 * Author: Stijn Asnong
 * Date: 6/25/13
 * @param value - the JSON of the data service layer
 */
RBI.ProductRating = function (value) {
    this.value = value;
    this.postConstruct && this.postConstruct();
};

/**
 * Get the Customer Rating
 * @return int - rating of the current user
 */
RBI.ProductRating.prototype.getCustomerRating = function () {
    return this.value["CustomerRating"];
};

/**
 * Get The average rating
 * @return int - average rating
 */
RBI.ProductRating.prototype.getAverageRating = function () {
    return this.value["AverageRating"];
};

/**
 * Get the Total Ratings
 * @return int - Total ratings
 */
RBI.ProductRating.prototype.getTotalRatings = function () {
    return this.value["TotalRatings"];
};
}());
(function initSecurityRequests() {
	"use strict";

/**
 * The request object used for login with username and password credentials
 */
RBI.LoginRequest = function (username, password) {
    this.username = username;
    this.password = password;
};

RBI.LoginRequest.prototype = new RBI.Request();

// @deprecated. User setPIIAccepted
RBI.LoginRequest.prototype.setPIIAcceptance = function(value){
    this.piiAccepted = value;
};

RBI.LoginRequest.prototype.setPIIAccepted = function(value) {
    this.piiAccepted = value;
};

RBI.LoginRequest.prototype.isPIIAccepted = function() {
    return this.piiAccepted;
};

/**
 * The request object used for create OL session based on IDM Tokens
 *
 * @author Kevin Clark (monster910@hotmail.com)
 */
RBI.LoginOLRequest = function (token) {
    this.token = token;
};

RBI.LoginOLRequest.prototype = new RBI.RequestOL();

RBI.LoginOLRequest.prototype.getParameters = function () {
    return ["token"];
};


/**
 * The request object used for create session based on XBOX XSTS tokens
 *
 * @author Kevin Clark (monster910@hotmail.com)
 */
RBI.CreateXBOXSessionRequest = function (token) {
    this.token = token;
};

RBI.CreateXBOXSessionRequest.prototype = new RBI.RequestOL();


RBI.CreateXBOXSessionRequest.prototype.setDeviceType = function (deviceType) {
    this.deviceType = deviceType;
};

RBI.CreateXBOXSessionRequest.prototype.getParameters = function () {
    return ["token", "deviceType"];
};

/**
 * The request object used for create session based ws-trust tokens. This is used
 * to create session on the rbproxy using the OL
 * 
 * token = the SAML token obtained from Identity provider to validate 
 * deviceType = the device type of the request
 * loadCustomer = a boolean. If true and create session successful this will call GetCustomer and load
 *  customer information into session and return it to requester
 *
 * @author Kevin Clark (monster910@hotmail.com)
 */
RBI.CreateSessionRequest = function (token) {
    this.token = token;
};

RBI.CreateSessionRequest.prototype = new RBI.RequestOL();

RBI.CreateSessionRequest.prototype.setDeviceType = function (deviceType) {
    this.deviceType = deviceType;
};

RBI.CreateSessionRequest.prototype.setLoadCustomer = function (aBooleanValue) {
    this.loadCustomer = aBooleanValue;
};

RBI.CreateSessionRequest.prototype.getLoadCustomer = function () {
    return this.loadCustomer;
};

RBI.CreateSessionRequest.prototype.setLoadCustomerTAP = function (aGatewayTAP) {
    this.loadCustomerTAP = aGatewayTAP;
};

RBI.CreateSessionRequest.prototype.getLoadCustomerTAP = function () {
    return this.loadCustomerTAP;
};

RBI.CreateSessionRequest.prototype.getParameters = function () {
    return ["token", "deviceType", "loadCustomer", "loadCustomerTAP"];
};

/**
 * The request object used for get a RBCore Oauth token. It passes a ws-trust token to service api
 * to get back an OAuth token
 *
 * @author Kevin Clark (monster910@hotmail.com)
 */
RBI.OAuthTokenRequest = function (token) {
    this.token = token;
};

RBI.OAuthTokenRequest.prototype = new RBI.RequestOL();

RBI.OAuthTokenRequest.prototype.setPCN = function (pcn) {
    this.pcn = pcn;
};

RBI.OAuthTokenRequest.prototype.getPCN = function () {
    return this.pcn;
};

RBI.OAuthTokenRequest.prototype.getParameters = function () {
    return ["token"];
};


/**
 * The request object used for link and unlink requests for devices
 * @author Kevin Clark (monster910@hotmail.com)
 */
RBI.LinkAccountRequest = function (token) {
    this.token = token;
};

RBI.LinkAccountRequest.prototype = new RBI.RequestOL();

RBI.LinkAccountRequest.prototype.setDeviceType = function (deviceType) {
    this.deviceType = deviceType;
};

RBI.LinkAccountRequest.prototype.setUnlinkAll = function (unlinkAll) {
    this.unlinkAll = unlinkAll;
};

RBI.LinkAccountRequest.prototype.getParameters = function () {
    // hack to put client side in control of what is sent to decouple server and client implementation
    if (this.unlinkAll == undefined) {
        return ["token", "deviceType"];
    } else {
        return ["token", "deviceType", "unlinkAll"];
    }
};

}());
(function initBaseService() {
	"use strict";

RBI.ServiceConfig = function () {};

RBI.ServiceConfig.prototype.getConfig = function () {
    return this.config;
};

RBI.ServiceConfig.prototype.setConfig = function (config) {
    this.config = config;
};

RBI.ServiceConfig.prototype.getConfigByName = function (name) {
    var filtered = this.config.filter(function (aConfig) {
        return aConfig.Name === name;
    });
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
};

RBI.BaseService = function () {
};

RBI.BaseService.Defines = {};
RBI.BaseService.Defines.SECURED_IFRAME_CONTAINER_ID = "securedIframeContainer";

RBI.BaseService.prototype.initBase = function (config, transport) {
	this.config = config;
	this.transport = transport;
};

RBI.BaseService.prototype.getRequestData = function (apiName) {
    var aConfig = this.config.getConfigByName(apiName);
	// clone and extend the object with additional properties if needed.
    return aConfig;
};

// Initialize Angular http transport
RBI.BaseService.prototype.setAngularHttp = function (http) {
    if (this.transport instanceof RBI.AngularTransport)
    {
        this.transport.setAngularHttp(http);
    }
};

// Initialize promise provider
RBI.BaseService.prototype.setPromiseProvider = function (promiseProvider) {
    if (this.transport.setPromiseProvider) {
        this.transport.setPromiseProvider(promiseProvider);
    }
};

RBI.BaseService.prototype.prepareRequest = function (request, requestData) {
    var data;
    request.addParameters();
	if (requestData.Helper !== null) {
		data = requestData.Helper.getRequestData(request, requestData.ContentType, requestData.Event);
	} else if (requestData.Protocol === "POST" && requestData.ContentType === "application/json") {
		data = request.params ? JSON.stringify(request.params) : JSON.stringify(request);
	} else {
		data = request.params || request;
	}
	return data;
};

/*
 * Common method to handle failures. It will attempt to process the response with the error handler. 
 * @param transport the transport layer
 * @param errorHandler the error handling layer
 * @param failureCallback the failure callback
 * @return a function that will process the response
 */
RBI.BaseService.prototype.transportFailureCallback = function (transport, errorHandler, failureCallback) {
    return function (response) {
        //Error Handling on the API Response
        if (errorHandler) {
            response = errorHandler.getErrorObject(response);
        }
        if (failureCallback) {
            return failureCallback(response);
        }
        // transport decides to return or throw response
        return transport.returnFailed(response);
    };
};


/**
 * If client tries to create 2 secured frames in one milisecond - the can get the same id and listeners will be listening for wrong events.
 * This static variable is to protect from such cases and to be sure each secured frame gets unique id.
 */
RBI.BaseService.previousSecureFrameId = 0;
/*
 * This method will create a secure frame in the body of the dom document
 *
 * @param cbk - the callback to execute when frame is loaded and ready for processing
 * @param frameName - the id of the frame to be combined with the timestamp (optional, defaults to secureIFrame)
 * @param frameUrl - the frame url to load html to use for secure frames (optional, defaults to secureCallFrame.html)
 */
RBI.BaseService.prototype.createSecureFrame = function(cbk, frameName, frameUrl) {
    var path = frameUrl;
    if (!frameName) {
        frameName = RBI.PlatformConfig.securedIframePrefixName;
    }
    if (!frameUrl) {
        path = this.getFramePath(RBI.PlatformConfig.securedIframePath);
    }
    var ts = (new Date()).getTime();

    // To be sure the frame has unique name.
    if (ts <= RBI.BaseService.previousSecureFrameId) {
        ts = RBI.BaseService.previousSecureFrameId + 1;
    }
    RBI.BaseService.previousSecureFrameId = ts;

    var frameId = frameName + ts;

    //Create Secured Iframe & integrate the values into the iframe
    var iFrame = document.createElement("iframe");
    iFrame.setAttribute('src',path);
    iFrame.setAttribute('style',"display: none;position: absolute;");
    iFrame.setAttribute('hidden',"true");
    iFrame.setAttribute('frameborder','0');
    iFrame.setAttribute('name',frameId);
    iFrame.setAttribute('id',frameId);

    //Add event listener to iframe for porthole
    var secureProxyParent = null;
    iFrame.addEventListener('load',function(){
        if (secureProxyParent && secureProxyParent.targetWindowName === frameId){
             //do nothing - duplicate Iframe load call
        }else{
            secureProxyParent = new Porthole.WindowProxy(path, frameId);
            cbk(secureProxyParent);

        }
    });

    //Check for the secured iframe container if it does not exist - create it
    if(!document.getElementById(RBI.BaseService.Defines.SECURED_IFRAME_CONTAINER_ID)){
        var iFrameContainer = document.createElement("div");
        iFrameContainer.setAttribute("id",RBI.BaseService.Defines.SECURED_IFRAME_CONTAINER_ID);
        document.body.appendChild(iFrameContainer);
    }
    document.getElementById(RBI.BaseService.Defines.SECURED_IFRAME_CONTAINER_ID).appendChild(iFrame);
};

/**
 * Get the full URL of the Iframe
 * @param framePath - relative path of the iframe html file
 * @return String of the URL
 */
RBI.BaseService.prototype.getFramePath = function(framePath) {
    var appPath = document.location.pathname.split(RBI.PlatformConfig.appPath);
    if (appPath.length == 1) {
        var appPath =
            document.location.pathname.split(RBI.PlatformConfig.emulatorPath);
    }
    var path = RBI.PlatformConfig.securedProtocol + "://" + document.location.hostname + appPath[0] + framePath;
    return path;
};

/**
 * For Porthole usage we need to check for response success
 * @param data  - porthole response
 * @return boolean if it is success or failure
 */
RBI.BaseService.prototype.checkResponseSuccess =  function(data)
{
    return data && data.ResultInfo && data.ResultInfo.ResultCode === "0";
};

/**
 * Porthole call back function that will call out to success or failure callbacks
 * @param event - Data outcome of the porthole
 * @param transportSuccessCallBack - The transport success Callback
 * @param transportFailureCallBack  - The transport failure Callback
 */
RBI.BaseService.prototype.portHoleCallBackFunction =  function(event,transportSuccessCallBack,transportFailureCallBack, deferred)
{
    var responseSuccess = this.checkResponseSuccess(event.data.result),
        result = null;
    if (event.data.status === 'success' && responseSuccess) {
    	if (RBI.Config.debug) {
        	console.log("Transport Porthole Success on "+event.source.targetWindowName+"->" + JSON.stringify(event.data.result));
        }
        result = transportSuccessCallBack(event.data.result);
    }
    if (event.data.status === 'error' || !responseSuccess) {
    	if (RBI.Config.debug) {
        	console.log("Transport Porthole Failure on "+event.source.targetWindowName+"->" + JSON.stringify(event.data.result));
        }
    	result = transportFailureCallBack(event.data.result);
    }

    if (deferred) {
        return this.transport.resolveDeferred(deferred, result);
    } else {
        return result;
    }

    // TODO: We already used iframe and handled response, lets remove the ifrmae from dom.
};

/**
 * Create The transportOptions Object
 * @param requestOptions  - porthole response
 * @param requestConfigData  - All the config data of the request
 * @return transportOptions Object
 */
RBI.BaseService.prototype.composeTransportOptions =  function(requestOptions,requestConfigData)
{
    //Create Options Object to pass along to Transport layer
    var transportOptions = {};
    transportOptions.xhrFields={};
    if(requestConfigData.Protocol === 'POST'){
        //Set the withCredentials to true for any POST calls - Send cookies information along
        transportOptions.xhrFields.withCredentials = true;
        // fixing iOS 6.0 and 6.0.1 caching bug for POST requests
        var iOSVersion = RBI.Util.getiOSVersion();
        if (iOSVersion && iOSVersion[0] == 6) {
            transportOptions.noCache = true;
        }
    }

    //Check for any options that may have been passed from the services to override the default behavior
    if(requestOptions){
        if(requestOptions.withCredentials){
            transportOptions.xhrFields.withCredentials = true;
        }
        if(requestOptions.noCache){
            transportOptions.noCache= true;
        }
    }

    //There is input data needed by cookies for calls going to Proxy so we need to force here the withCredentials for GET and POST if the config is enabled
    if(RBI.Config.forceWithCredentials){
        transportOptions.xhrFields.withCredentials = true;
    }

    return transportOptions;
};

/**
 * Send request using appropriate transport
 * @param data  - request Data
 * @param requestConfigData  - The config of the request
 * 		This also includes RequestOptions  - RBI.RequestOptions Object that will contain any options needed for the transport
 *
 * @param transportSuccessCallBack - successful callback
 * @param transportFailureCallBack  - failure callback
 */
RBI.BaseService.prototype.sendRequest =  function(data,requestConfigData,transportSuccessCallBack,transportFailureCallBack) {

	//Create Options Object to pass along to Transport layer
    var transportOptions = this.composeTransportOptions(requestConfigData.RequestOptions,requestConfigData);

    //Determine what protocol is currently used and see if this requestCall is a securedCall
    var targetUrlProtocol = RBI.Util.getProtocolFromUrlString(requestConfigData.URL);

	// Some clients (e.g. XB1) need to send all requests over httpS protocol.
	// If RBI.PlatformConfig.forceHttps is true - convert all http to httpS.
    if (RBI.PlatformConfig.forceHttps && targetUrlProtocol.toLowerCase() !== "https") {
        requestConfigData.URL = "https" + requestConfigData.URL.substring(4);
    }

    var self = this;
    if (document.location.protocol === "http:" && targetUrlProtocol === "https" &&
        RBI.PlatformConfig.mixedMode == false) {

        var deferred = null;
        if (this.transport.createDeferred) {
            deferred = this.transport.createDeferred();
        }
        var portHoleWrapperCallBack = RBI.Util.callBackWrapper(function(event){
            return this.portHoleCallBackFunction(event,transportSuccessCallBack,transportFailureCallBack, deferred);
        },this);

        this.createSecureFrame(function(secureProxyParent){
            secureProxyParent.removeEventListener();
            secureProxyParent.addEventListener(portHoleWrapperCallBack);
            if (RBI.Config.debug) {
            	var getData = { url: requestConfigData.URL, headers: { "Content-type": requestConfigData.ContentType } };
                console.log("Transport Porthole Action "+requestConfigData.Protocol+" on "+secureProxyParent.targetWindowName+" for (" + requestConfigData.URL + ")->" + JSON.stringify(getData));
            }
            
            secureProxyParent.post({'action': requestConfigData.Protocol, 'postData': data,'xhrFields':transportOptions.xhrFields,
                'contentType':requestConfigData.ContentType, 'cache': false, 'url': requestConfigData.URL });
        });
        if (deferred && this.transport.deferredToPromise) {
            return this.transport.deferredToPromise(deferred);
        }
    }else{
        if(requestConfigData.Protocol === 'POST' || requestConfigData.Protocol === 'PUT'){
            return this.transport.put(
                requestConfigData.URL,
                data,
                requestConfigData.ContentType,
                transportOptions, // allows OL token to be passed
                function (response, status) {
                	if (transportSuccessCallBack) {
                		return transportSuccessCallBack(response);
                	}
                	return response;
                },
                function (response, status) {
                	if (transportFailureCallBack) {
                		return transportFailureCallBack(response);	
                	}
                	return response;
                }	
            );
        }else if(requestConfigData.Protocol === 'GET'){
            return this.transport.get(
                requestConfigData.URL,
                data,
                requestConfigData.ContentType,
                transportOptions,
                function (response, status) {
                	if (transportSuccessCallBack) {
                		return transportSuccessCallBack(response);
                	}
                	return response;                   
                },
                function (response, status) {
                	if (transportFailureCallBack) {
                		return transportFailureCallBack(response);	
                	}
                	return response;
                    
                }
              );
        }
    }
};
}());
(function initConfigService() {
    "use strict";

    /**
     * Cluster Config Request
     * @param additionalClusterNodes - additional cluster nodes, comma delimited string of valid http(s) addresses
     * @constructor
     */
    RBI.ClusterConfigRequest = function (serverAddresses){
        this.serverAddresses = serverAddresses; //(additionalClusterNodes||[]).join(",");
    };

    RBI.ClusterConfigRequest.prototype = new RBI.RequestOL();


    RBI.ClusterConfigRequest.prototype.getParameters = function () {
        return ["serverAddresses"];
    };

    /*
     * Define the configuration service settings
     *
     */
    RBI.ConfigServiceConfig = function () {
        this.setConfig([
            { Name: "getClusterConfig", URL: RBI.Config.proxyBase + "/rbproxy/clusterConfig", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "getConfig", URL: RBI.Config.proxyBase + "/rbproxy/config", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "getKioskLoaderConfig", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetKioskLoaderConfiguration", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }
        ]);
    };

    RBI.ConfigServiceConfig.prototype = new RBI.ServiceConfig();


    /*
     * Create singleton of the config service
     *
     */
    RBI.ConfigService = function () {
        if (RBI.ConfigService.prototype._singletonInstance) {
            return RBI.ConfigService.prototype._singletonInstance;
        }
        RBI.ConfigService.prototype._singletonInstance = this;
    };

    RBI.ConfigService.prototype = new RBI.BaseService();

    RBI.ConfigService.prototype.init = function (config) {
        if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
            throw new Error("config param must be of RBI.ServiceConfig type.");
        }
        this.initBase(config, new RBI.Transport());
    };

    /*
     * Gets cluster configuration
     * @param clusterInfoRequest - instance of ClusterConfigRequest
     */
    RBI.ConfigService.prototype.getClusterConfig = function (clusterInfoRequest, successCallback, failureCallback) {
        var requestConfig = this.getRequestData("getClusterConfig");

        var data = this.prepareRequest(clusterInfoRequest, requestConfig);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            successCallback(response);
            return response;
        };

        //FailureCallBack function for the transport
        var transportFailureCallBack = function (response) {
            //Error Handling on the API Response
            if (requestConfig.ErrorHandler) {
                response = requestConfig.ErrorHandler.getErrorObject(response);
            }
            console.log(response);
            failureCallback(response);
            return response;
        };

        return this.sendRequest(data, requestConfig, transportSuccessCallBack, transportFailureCallBack);
    };

    /*
     * Gets kiosk loader config
     */
    RBI.ConfigService.prototype.getKioskLoaderConfig = function (successCallback, failureCallback) {
        var requestConfig = this.getRequestData("getKioskLoaderConfig");
        var data = this.prepareRequest(new RBI.RequestOL(), requestConfig);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            successCallback(response);
            return response;
        };

        //FailureCallBack function for the transport
        var transportFailureCallBack = function (response) {
            //Error Handling on the API Response
            if (requestConfig.ErrorHandler) {
                response = requestConfig.ErrorHandler.getErrorObject(response);
            }
            console.log(response);
            failureCallback(response);
            return response;
        };

        return this.sendRequest(data, requestConfig, transportSuccessCallBack, transportFailureCallBack);
    };

    /*
     * Gets RBProxy config
     */
    RBI.ConfigService.prototype.getConfig = function (successCallback, failureCallback) {
        var requestConfig = this.getRequestData("getConfig");
        var data = this.prepareRequest(new RBI.RequestOL(), requestConfig);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            successCallback(response);
            return response;
        };

        //FailureCallBack function for the transport
        var transportFailureCallBack = function (response) {
            //Error Handling on the API Response
            if (requestConfig.ErrorHandler) {
                response = requestConfig.ErrorHandler.getErrorObject(response);
            }
            console.log(response);
            failureCallback(response);
            return response;
        };

        return this.sendRequest(data, requestConfig, transportSuccessCallBack, transportFailureCallBack);
    };
}());
(function initCreditCardService() {
	"use strict";


    
    
    RBI.UpdateCreditCardRequestHelper = function() {
    	
        this.updateCardTemplate = null;

    	var xhttp;
        if (window.XMLHttpRequest) {
    		xhttp = new XMLHttpRequest();
        } else {    // IE 5/6
        	xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.open("GET", RBI.Config.updateCardFilePath, false);
        xhttp.send(null);
        this.updateCardTemplate = xhttp.responseText;  
	   
    };
    
    RBI.UpdateCreditCardRequestHelper.prototype.getRequestData = function (request, contentType) {
    	var template = new String(this.updateCardTemplate);
    	template = template.replace("$creditcard.AccountNumber", request.getCreditCardModel().getAccountNumber());
    	template = template.replace("$creditcard.Preferred", ""+request.getCreditCardModel().isPreferred());
    	template = template.replace("$creditcard.AVSChecked", "true");
    	template = template.replace("$creditcard.CVVChecked", ""+request.getCreditCardModel().isCVVChecked());
    	template = template.replace("$creditcard.CVV", request.getCreditCardModel().getCvv());
    	template = template.replace("$creditcard.AccountAlias", request.getCreditCardModel().getAccountAlias());
    	template = template.replace("$creditcard.FirstName", request.getCreditCardModel().getFirstName());
    	template = template.replace("$creditcard.LastName", request.getCreditCardModel().getLastName());
    	template = template.replace("$creditcard.LastFour", request.getCreditCardModel().getLastFour());
    	template = template.replace("$creditcard.ExpirationMonth", request.getCreditCardModel().getExpirationMonth());
    	template = template.replace("$creditcard.ExpirationYear", request.getCreditCardModel().getExpirationYear());
    	template = template.replace("$creditcard.City", request.getCreditCardModel().getCity());
    	template = template.replace("$creditcard.State", request.getCreditCardModel().getState());
    	template = template.replace("$creditcard.Address1", request.getCreditCardModel().getAddress1());
    	template = template.replace("$creditcard.Address2", request.getCreditCardModel().getAddress2());
    	template = template.replace("$creditcard.ZipPostalCode", request.getCreditCardModel().getZipPostalCode());
    	return template;
    };
    
    var updateCreditCardRequestHelper = new RBI.UpdateCreditCardRequestHelper();
    
    RBI.AddCreditCardRequestHelper = function() {
    	
        this.addCardTemplate = null;

    	var xhttp;
        if (window.XMLHttpRequest) {
    		xhttp = new XMLHttpRequest();
        } else {    // IE 5/6
        	xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.open("GET", RBI.Config.addCardFilePath, false);
        xhttp.send(null);
        this.addCardTemplate = xhttp.responseText;  
	   
    };
    
    RBI.AddCreditCardRequestHelper.prototype.getRequestData = function (request, contentType) {
    	var template = new String(this.addCardTemplate);
    	template = template.replace("$creditcard.Number", request.getCreditCardModel().getNumber());
    	template = template.replace("$creditcard.Preferred", ""+request.getCreditCardModel().isPreferred());
    	template = template.replace("$creditcard.SaveToProfile", ""+request.getCreditCardModel().getSaveToProfile());
    	template = template.replace("$creditcard.CVV", request.getCreditCardModel().getCvv());
    	template = template.replace("$creditcard.Alias", request.getCreditCardModel().getAccountAlias());
    	template = template.replace("$creditcard.FirstName", request.getCreditCardModel().getFirstName());
    	template = template.replace("$creditcard.LastName", request.getCreditCardModel().getLastName());
    	template = template.replace("$creditcard.LastFour", request.getCreditCardModel().getLastFour());
    	template = template.replace("$creditcard.ExpirationMonth", request.getCreditCardModel().getExpirationMonth());
    	template = template.replace("$creditcard.ExpirationYear", request.getCreditCardModel().getExpirationYear());
    	template = template.replace("$creditcard.City", request.getCreditCardModel().getCity());
    	template = template.replace("$creditcard.State", request.getCreditCardModel().getState());
    	template = template.replace("$creditcard.Address1", request.getCreditCardModel().getAddress1());
    	template = template.replace("$creditcard.Address2", request.getCreditCardModel().getAddress2());
    	template = template.replace("$creditcard.ZipPostalCode", request.getCreditCardModel().getZipPostalCode());
    	template = template.replace("$creditcard.Zip", request.getCreditCardModel().getZip());
    	return template;
    };
    
    var addCreditCardRequestHelper = new RBI.AddCreditCardRequestHelper();
    
	RBI.CreditCardServiceConfig = function() {
        this.setConfig(
        [
         	{ Name: "updateCreditCard", URL: RBI.Config.openApiUrl + RBI.Config.updateCreditCardUrl, Protocol: "PUT", ContentType: "application/xml", Helper: updateCreditCardRequestHelper },
         	{ Name: "addCreditCard", URL: RBI.Config.openApiUrl + RBI.Config.addCreditCardUrl, Protocol: "POST", ContentType: "application/xml", Helper: addCreditCardRequestHelper }
        ]);
    };
    RBI.CreditCardServiceConfig.prototype = new RBI.ServiceConfig();

    RBI.CreditCardService = function () {
        if (RBI.CreditCardService.prototype._singletonInstance) {
            return RBI.CreditCardService.prototype._singletonInstance;
        }
        RBI.CreditCardService.prototype._singletonInstance = this;
    };
    RBI.CreditCardService.prototype = new RBI.BaseService();

    // TODO: Pass transport as parameter.
    RBI.CreditCardService.prototype.init = function (config) {
        if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
            throw new Error("config param must be of RBI.ServiceConfig type.");
        }
        this.initBase(config, new RBI.Transport());
    };

    RBI.GetCreditCardRequest = function (accountNumber) {
        this.addParam("AccountNumber", accountNumber);
    };

    RBI.GetCreditCardRequest.prototype = new RBI.RequestOL();

    RBI.CreditCardService.prototype.getCreditCard = function (request, successCallback, failureCallback) {
    	if (RBI.Config.debug) {
    		console.log("CreditCardService.getCreditCard:");
    		console.log(request);
    	}
    	
        // TODO: Just a mock for now.
        successCallback(null);

    };

    RBI.AddUpdateCreditCardRequest = function () {
    };
    
    RBI.AddUpdateCreditCardRequest.prototype = new RBI.RequestOL();
    
    RBI.AddUpdateCreditCardRequest.prototype.getCreditCardModel = function() {
    	return this.creditCardModel;
    };

    RBI.AddUpdateCreditCardRequest.prototype.getCustomerNumber = function() {
    	return this.customerNumber;
    };
    
    RBI.AddUpdateCreditCardRequest.prototype.setCustomerNumber = function(cn) {
    	this.customerNumber = cn;
    };
    
    RBI.AddUpdateCreditCardRequest.prototype.getAccessToken = function() {
    	return this.accessToken;
    };
    
    RBI.AddUpdateCreditCardRequest.prototype.setAccessToken = function(accessToken) {
    	this.accessToken = accessToken;
    };
    
    RBI.AddUpdateCreditCardRequest.prototype.setCreditCardModel = function(creditCardModel) { //, updateFlag) {
    	this.creditCardModel = creditCardModel;
//    	this.clearParams();
//        this.addParam("AccountAlias", creditCardModel.getAccountAlias());
//        this.addParam("CVV", creditCardModel.getCvv());
//        if (updateFlag) {
//        	this.addParam("AccountNumber", creditCardModel.getAccountNumber());
//            this.addParam("CVVChecked", creditCardModel.isCVVChecked());
//        } else {
//        	this.addParam("SaveToProfile", creditCardModel.getSaveToProfile());
//        	this.addParam("Number", creditCardModel.getNumber());
//        	this.addParam("Zip", creditCardModel.getZip());
//        }
//        this.addParam("LastFour", creditCardModel.getLastFour());
//        this.addParam("ExpirationMonth", creditCardModel.getExpirationMonth());
//        this.addParam("ExpirationYear", creditCardModel.getExpirationYear());
//        this.addParam("FirstName", creditCardModel.getFirstName());
//        this.addParam("LastName", creditCardModel.getLastName());
//        this.addParam("Number", creditCardModel.getNumber());
//        this.addParam("Preferred", creditCardModel.isPreferred());
//        this.addParam("Address1", creditCardModel.getAddress1());
//        this.addParam("Address2", creditCardModel.getAddress2());
//        this.addParam("City", creditCardModel.getCity());
//        this.addParam("State", creditCardModel.getState());
//        this.addParam("ZipPostalCode", creditCardModel.getZipPostalCode());
    };
    

    RBI.CreditCardService.prototype.addUpdateCreditCard = function (request, updateFlag, successCallback, failureCallback) {
        
    	if (RBI.Config.debug) {
        	console.log("CreditCardService.addUpdateCreditCard:");
            //console.log(request);
    	}
        
        var requestData = updateFlag?this.config.getConfigByName("updateCreditCard"):this.config.getConfigByName("addCreditCard");
        
        var url = requestData.URL.replace("{TOKEN}", request.getAccessToken());
        url = url.replace("{CustomerPartnerNumber}", request.getCustomerNumber());
        if (updateFlag) {
        	url = url.replace("{accountNo}", request.getCreditCardModel().getAccountNumber());
        }
        console.log("request url: " + url);

        var data = this.prepareRequest(request,requestData);
        
        var options = {};
        options.xhrFields = {withCredentials: true};
        options.type = requestData.Protocol;
        var xhr = this.transport.put(
        		url,
        		data,
        		requestData.ContentType,
        		options,
        		function (response, status) {
        			if (successCallback) {
        				successCallback(response);
        			}
        			return response;
        		},
        		function (response, status) {
        			if (failureCallback) {
        				failureCallback(response);
        			}
        			return response;
        		}
        	);
        return xhr;

        // Not working now; reverted to earlier version of the code
        //requestData.URL = url;
        //var data = this.prepareRequest(request, requestData);
        /*requestData.RequestOptions = new RBI.RequestOptions(false, true);
        return this.sendRequest(data, requestData,
        		function (response, status) {
        			if (successCallback) {
        				successCallback(response);
        			}
        			return response;
        		},
        		function (response, status) {
        			if (failureCallback) {
        				failureCallback(response);
        			}
        			return response;
        		}
        	); */
    };
}());
(function initCustomerService() {
	"use strict";

/*
 * Customer Service
 * Author shoumik.chakravarty
 * This service is for all the customer related data
 */
RBI.CustomerServiceConfig = function () {
    this.setConfig([
        { Name: "getCustomerOL", URL: RBI.Config.olUrl, Protocol: "POST", ContentType: "application/xml", Helper: new RBI.GetCustomerRequestHelper() } ,
        { Name: "createCustomerToken", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetCreateCustomerToken", Protocol: "POST", ContentType: "application/json", Helper: null } ,
        { Name: "getCustomer", URL: RBI.Config.proxyBaseSecure + "/rbproxy/secureapi/GetCustomer", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "createCustomer", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/CreateCustomer", Protocol: "POST", ContentType: "application/json", Helper:null},
        { Name: "updateCustomer", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/UpdateCustomer", Protocol: "POST", ContentType: "application/json", Helper:null},
        { Name: "getRemindersByCustomer", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetRemindersByCustomer", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getWatchHistory",  URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetWatchHistory", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getBookmarks", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetBookmarks", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getPurchases", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetPurchases", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getSubscriptionHistory", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetSubscriptionHistory", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getTransactionHistory", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetTransactionHistory", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getCreditHistory", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetCreditHistory", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getCreditBalance", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetCreditBalance", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getCards", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetCards", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "addBookmark", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/AddBookmark", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "removeBookmark", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/RemoveBookmark", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "changeLogin", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/ChangeLogin", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "changePassword", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/ChangePassword", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "getParentalControlOptions", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetParentalControlOptions", Protocol: "GET", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "checkParentalControlPW", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/CheckParentalControlPW", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() },
        { Name: "updateParentalControls", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/UpdateParentalControls", Protocol: "POST", ContentType: "application/json", Helper:null, ErrorHandler:new RBI.ProxyErrorHandler() }
  ]);
};

RBI.CustomerServiceConfig.prototype = new RBI.ServiceConfig();

RBI.CustomerService = function () {
	if (RBI.CustomerService.prototype._singletonInstance) {
		return RBI.CustomerService.prototype._singletonInstance;
	}
	RBI.CustomerService.prototype._singletonInstance = this;
};

RBI.CustomerService.prototype = new RBI.BaseService();

RBI.CustomerService.prototype.init = function (config) {
    if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
        throw new Error("config param must be of RBI.ServiceConfig type.");
    }
    this.initBase(config, new RBI.Transport());
};


/*
 * GetCustomer
 * This method will get the customer data
 *
 * @param getCustomerRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Customer[] array
 */

RBI.CustomerService.prototype.getCustomerOL = function (getCustomerRequest, successCallback, failureCallback) {
    var requestData = this.getRequestData("getCustomerOL");
    var data = getCustomerRequest;
    if (requestData.Helper) {
        data = requestData.Helper.getRequestData(getCustomerRequest, requestData.ContentType);
    }
    
    // no cahcing (OL ignores it) and with credentials
    requestData.RequestOptions = new RBI.RequestOptions(false,true);
    return this.sendRequest(data, requestData,
    	function (response, status) {
	        var customer = new RBI.Customer(response);
	        if (successCallback) {
	        	return successCallback(customer);
	        }        
	        return customer;
    	},
    	function (response, status) {
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        if (failureCallback) {
	        	return failureCallback(response);
	        }	        
	        return response;
    	});
};

/*
 * GetCustomer
 * This method will get the customer data
 *
 * @param getCustomerRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Customer[] array
 */

RBI.CustomerService.prototype.getCustomer = function (request, successCallback, failureCallback) {
	    var requestData = this.getRequestData("getCustomer");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
	        var result = new RBI.Customer(response.content.CustomerInfo);
	        if (successCallback) {
	        	successCallback(result);
	        }
            return result;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        if (failureCallback) {
	        	failureCallback(response);
	        }
	        return response;
	    };
        //Send With a NoCaching = true & WithCredentials true options
        requestData.RequestOptions = new RBI.RequestOptions(true,true);
	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * GetCustomerReminders
 * This method will get the customer remainder for the movie and the games
 *
 * @param request the request object. @see GetCustomerReminderRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Reminders[] array
 */

RBI.CustomerService.prototype.getRemindersByCustomer = function (request, successCallback, failureCallback) {

    var requestData = this.getRequestData("getRemindersByCustomer");
    var data = this.prepareRequest(request,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        var reminderResponse = new RBI.ReminderResponse(response);
        successCallback(reminderResponse);
        return reminderResponse;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * GetPurchases
 * This method will get the purchase history of the customer
 *
 * @param getPurchases
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return PurchaseOptions[] array
 */
RBI.CustomerService.prototype.getPurchases = function (request, successCallback, failureCallback) {

    var requestData = this.getRequestData("getPurchases");
    var data = this.prepareRequest(request,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        var purchaseReponse = new RBI.PurchaseResponse(response);
        successCallback(purchaseReponse);
        return purchaseReponse;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Get the customer bookmarks
 *
 * @param getBookmarks
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return BookMarks[]
 */

RBI.CustomerService.prototype.getBookmarks = function (getBookmarks,successCallback, failureCallback) {

    var requestData = this.getRequestData("getBookmarks");
    var data = this.prepareRequest(getBookmarks,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var bookmarkResponse = new RBI.BookMarkResponse(response);
        successCallback(bookmarkResponse);
        return bookmarkResponse;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Add bookmark
 *
 * @param addBookmarkRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return - result info JSON object with result code and response message
 */

RBI.CustomerService.prototype.addBookmark = function (addBookmarkRequest, successCallback, failureCallback) {

    var requestData = this.getRequestData("addBookmark");
    var data = this.prepareRequest(addBookmarkRequest,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var result = new RBI.BookmarkActionResponse(response).getResultInfo();
        successCallback(result);
        return result;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};


/*
 * Remove bookmark
 *
 * @param removeBookmarkRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return - result info JSON object with result code and response message
 */

RBI.CustomerService.prototype.removeBookmark = function (removeBookmarkRequest, successCallback, failureCallback) {

    var requestData = this.getRequestData("removeBookmark");
    var data = this.prepareRequest(removeBookmarkRequest,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var result = new RBI.BookmarkActionResponse(response).getResultInfo();
        successCallback(result);
        return result;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Get the customer cards.
 * THIS METHOD IS USED BY GetCardsData, IF YOU CHANGE SOMETHING HERE, BE SURE YOU ARE NOT BRAKING THAT FUNCTION.
 * @deprecated. Use GetCardsData.
 *
 * @param getCards
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Cards[]
 */
RBI.CustomerService.prototype.getCards = function (getCardsRequest, successCallback, failureCallback) {

    var requestData = this.getRequestData("getCards");
    var data = this.prepareRequest(getCardsRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        var accounts = [],
			accountsList = response.AccountList;

        for (var i in accountsList) {
            accounts.push(new RBI.Account(accountsList[i]));
        }
        console.log(accounts);
        if (successCallback) {
        	return successCallback(accounts);
        }
        return accounts;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        if (failureCallback) {
        	return failureCallback(response);
        }
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

RBI.CustomerService.prototype.getCardsData = function (getCardsRequest, successCallback, failureCallback) {
    var transportSuccessCallBack = function (accounts) {
        var cardsData = new RBI.CardsData(accounts);
        successCallback(cardsData);
        return cardsData;
    };

    return this.getCards(getCardsRequest, transportSuccessCallBack, failureCallback);
};

/*
 * Get the subscription history
 *
 * @param request
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Cards[]
 */
RBI.CustomerService.prototype.getSubscriptionHistory = function (request, successCallback, failureCallback) {
	var i;
    var requestData = this.getRequestData("getSubscriptionHistory");
    var data = this.prepareRequest(request,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
    	var subscriptionHistoryList = response.SubscriptionHistories;
        var subscriptionHistory = [];
        for(i = 0; i < subscriptionHistoryList.length; i++){
        	var history = new RBI.SubscriptionHistory(subscriptionHistoryList[i]);
        	subscriptionHistory.push(history);
        }
        successCallback(subscriptionHistory);
        return subscriptionHistory;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};


/*
 * GetWatchHistory
 * This method will get the watch history of the customer
 *
 * @param getWatchHistory
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return WatchHistory[] array
 */

RBI.CustomerService.prototype.getWatchHistory = function (request, successCallback, failureCallback) {

	 var requestData = this.getRequestData("getWatchHistory");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function (response) {
	        var watchHistoryResponse = new RBI.WatchHistoryResponse(response);
	         successCallback(watchHistoryResponse);
	         return watchHistoryResponse;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        failureCallback(response);
	        return response;
	    };

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * create Customer Token on RBProxy
 *
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Response Model with Token
 */
RBI.CustomerService.prototype.createCustomerToken = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("createCustomerToken");
    var data = this.prepareRequest(request,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;
        var createCustomerTokenObject = new RBI.CreateCustomerTokenResponse(responseObject);
        successCallback(createCustomerTokenObject);
        return createCustomerTokenObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};


/*
 * create Customer
 *
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Response Model with PCN
 */
RBI.CustomerService.prototype.createCustomer = function (request,successCallback, failureCallback) {
    var requestData = this.getRequestData("createCustomer");
    var data = this.prepareRequest(request,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;
        var createCustomerObject = new RBI.CreateCustomerResponse(responseObject);
        successCallback(createCustomerObject);
        return createCustomerObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * update Customer
 *
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * 
 *  */
RBI.CustomerService.prototype.updateCustomer = function (request,successCallback, failureCallback) {
    var requestData = this.getRequestData("updateCustomer");
    var data = this.prepareRequest(request,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;
        var updateCustomerObject = new RBI.Customer(responseObject.content.CustomerInfo);
        successCallback(updateCustomerObject);
        return updateCustomerObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

RBI.CustomerService.prototype.getTransactionHistory = function (request, successCallback, failureCallback) {
	 var i;
	 var requestData = this.getRequestData("getTransactionHistory");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
			 var transactionHistoryList = response.Transactions;
	         var transactionHistory = [];
	         for(i = 0; i < transactionHistoryList.length; i++){
				var transaction = new RBI.Transaction(transactionHistoryList[i]);
				transactionHistory.push(transaction);
	         }
	         successCallback(transactionHistory);
             return transactionHistory;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        failureCallback(response);
	        return response;
	    };

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

RBI.CustomerService.prototype.getCreditHistory = function (request, successCallback, failureCallback) {
	var i;
	 var requestData = this.getRequestData("getCreditHistory");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
			var creditUseHistoryList = response.CreditUseHistory;
	         var creditUseHistory = [];
	         for(i = 0; i < creditUseHistoryList.length; i++){
				var history = new RBI.CreditUseHistory(creditUseHistoryList[i]);
				creditUseHistory.push(history);
	         }
	         successCallback(creditUseHistory);
            return creditUseHistory;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        failureCallback(response);
	        return response;
	    };

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

RBI.CustomerService.prototype.getCreditBalance = function (request, successCallback, failureCallback) {
	var i;
	 var requestData = this.getRequestData("getCreditBalance");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
            var creditBalanceList = response.creditBalance;
	        var credits = [];
	        for(i = 0; i < creditBalanceList.length; i++){
				var credit = new RBI.Credit(creditBalanceList[i]);
				credits.push(credit);
	        }

	        var creditBalance = new RBI.CreditBalance(credits);
	        successCallback(creditBalance);
	        return creditBalance;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        failureCallback(response);
	        return response;
	    };

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

RBI.CustomerService.prototype.getParentalControlOptions = function (request, successCallback, failureCallback) {
	 var i;
	 var requestData = this.getRequestData("getParentalControlOptions");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
	        var parentalControlList = response.ParentalControlOptions;
	        var parentalControls = [];
	        for(i = 0; i < parentalControlList.length; i++){
				var parentalControl = new RBI.ParentalControl(parentalControlList[i]);
				parentalControls.push(parentalControl);
	        }
	        successCallback(parentalControls);
            return parentalControls;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        failureCallback(response);
	        return response;
	    };

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

RBI.CustomerService.prototype.checkParentalControlPW = function (request, successCallback, failureCallback) {
	 var i;
	 var requestData = this.getRequestData("checkParentalControlPW");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
	        var parentalControlList = response.ParentalControlOptions;
	        var parentalControls = [];
	        if (parentalControlList && parentalControlList.length) {
	            for (i = 0; i < parentalControlList.length; i++) {
	                var parentalControl = new RBI.ParentalControl(parentalControlList[i]);
	                parentalControls.push(parentalControl);
	            }
	        }
	        successCallback(parentalControls);
            return parentalControls;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        //Error Handling on the API Response
	        if (requestData.ErrorHandler) {
	            response = requestData.ErrorHandler.getErrorObject(response);
	        }
	        console.log(response);
	        failureCallback(response);
	        return response;
	    };

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

RBI.ChangeLoginRequest = function (loginEmail, password) {
    this.LoginEmail = loginEmail;
    this.Password = password;
};

RBI.ChangeLoginRequest.prototype = new RBI.RequestOL();

RBI.ChangeLoginRequest.prototype.getParameters = function () {
    return ["LoginEmail", "Password"];
};

RBI.CustomerService.prototype.changeLogin = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("changeLogin");
    var data = this.prepareRequest(request,requestData);

    var transportSuccessCallBack = function(response){
        var updateCustomerObject = new RBI.Customer(response.content.CustomerInfo);
        successCallback(updateCustomerObject);
        return updateCustomerObject;
    };
    var transportFailureCallBack = function(response){
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

RBI.ChangePasswordRequest = function (newPassword, oldPassword) {
    this.NewPassword = newPassword;
    this.OldPassword = oldPassword;
};

RBI.ChangePasswordRequest.prototype = new RBI.RequestOL();

RBI.ChangePasswordRequest.prototype.getParameters = function () {
    return ["NewPassword", "OldPassword"];
};

RBI.CustomerService.prototype.changePassword = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("changePassword");
    var data = this.prepareRequest(request,requestData);

    var transportSuccessCallBack = function(response){
        successCallback(response);
        return response;
    };
    var transportFailureCallBack = function(response){
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

RBI.CustomerService.prototype.updateParentalControls = function (request, successCallback, failureCallback) {
	
		var requestData = this.getRequestData("updateParentalControls");
	    var data = this.prepareRequest(request,requestData);

	    //SuccessCallBack function for the transport
	    var transportSuccessCallBack = function(response){
	        successCallback(response);
            return response;
	    };

	    //FailureCallBack function for the transport
	    var transportFailureCallBack = function(response){
	        console.log("updateParentalControls fail- " + response);
	        failureCallback(response);
	        return response;
		};

	    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};
}());
(function initDeviceService() {
    "use strict";

    /**
     * Device service
     * Contains service functions for the device related API functions:
     * Website API:
     * GetDevices
     * GetActiveDevices
     * UpdateDevice
     * RemoveDevice
     * ActivateDevice
     * CheckVersion
     * @author: Peter Rajcani; used template developed by Kevin Clark
     */

    /**
     * Create Device service configuration for device service requests
     * @constructor
     */
    RBI.DeviceServiceConfig = function () {
        this.setConfig([
            { Name: "getDevices", URL: RBI.Config.proxyBase + "/rbproxy/api/GetDevices", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "getActiveDevices", URL: RBI.Config.proxyBase + "/rbproxy/api/GetActiveDevices", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "updateDevice", URL: RBI.Config.proxyBase + "/rbproxy/api/UpdateDevice", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "removeDevice", URL: RBI.Config.proxyBase + "/rbproxy/api/RemoveDevice", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "activateDevice", URL: RBI.Config.proxyBase + "/rbproxy/api/ActivateDevice", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
            { Name: "checkVersion", URL: RBI.Config.proxyBase + "/rbproxy/api/CheckVersion", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }
        ]);
    };
    RBI.DeviceServiceConfig.prototype = new RBI.ServiceConfig();


    /*
     * Create singleton of the device service
     */
    RBI.DeviceService = function () {
        if (RBI.DeviceService.prototype._singletonInstance) {
            return RBI.DeviceService.prototype._singletonInstance;
        }
        RBI.DeviceService.prototype._singletonInstance = this;
    };

    RBI.DeviceService.prototype = new RBI.BaseService();

    /**
     * Initialize device service configuration
     * @param config
     */
    RBI.DeviceService.prototype.init = function (config) {
        if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
            throw new Error("config param must be of RBI.ServiceConfig type.");
        }
        this.initBase(config, new RBI.Transport());
    };

    /*
     * getDevices
     * Get the list of all registered devices linked to the specified user
     *
     * @param searchRequest   See GetDevicesRequest object
     * @param successCallback is the callback function to invoke on success
     * @param failureCallback is the callback function to invoke on failure
     * @return                an array of Device objects
     */
    RBI.DeviceService.prototype.getDevices = function (request, successCallback, failureCallback) {
        var i, requestData = this.getRequestData("getDevices");
        var data = this.prepareRequest(request, requestData);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            var responseObject = response;
            var results = [];
            for (i = 0; i < responseObject.Devices.length; i++) {
                var deviceObj = new RBI.Device(responseObject.Devices[i]);
                results.push(deviceObj);
            }
            successCallback(results);
            return results;
        };

        //FailureCallBack function for the transport
        var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
        return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
    };

    /*
     * getActiveDevices
     * Get the list of all active devices linked to the specified user
     *
     * @param request   see GetActiveDevicesRequest object
     * @param successCallback is the callback function to invoke on success
     * @param failureCallback is the callback function to invoke on failure
     * @return          an array of Device objects
     */
    RBI.DeviceService.prototype.getActiveDevices = function (request, successCallback, failureCallback) {
        var i, requestData = this.getRequestData("getActiveDevices");
        var data = this.prepareRequest(request, requestData);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            var responseObject = response;
            var results = [];
            for (i = 0; i < responseObject.Devices.length; i++) {
                var deviceObject = new RBI.Device(responseObject.Devices[i]);
                results.push(deviceObject);
            }
            successCallback(results);
            return results;
        };

        //FailureCallBack function for the transport
        var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
        return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
    };

    /*
     * updateDevice
     *
     * @param request   see UpdateDeviceRequest object
     * @param successCallback is the callback function to invoke on success
     * @param failureCallback is the callback function to invoke on failure
     * @return RBI.UpdateDeviceResponse object
     */
    RBI.DeviceService.prototype.updateDevice = function (request, successCallback, failureCallback) {
        var requestData = this.getRequestData("updateDevice");
        var data = this.prepareRequest(request, requestData);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            console.log(response);
            var responseObject = new RBI.UpdateDeviceResponse(response);
            successCallback(responseObject);
            return responseObject;
        };

        //FailureCallBack function for the transport
        var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
        return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
    };

    /*
     * activateDevice
     *
     * @param request   see ActivateDeviceRequest object
     * @param successCallback is the callback function to invoke on success
     * @param failureCallback is the callback function to invoke on failure
     * @return RBI.ActivateDeviceResponse object
     */
    RBI.DeviceService.prototype.activateDevice = function (request, successCallback, failureCallback) {
        var requestData = this.getRequestData("activateDevice");
        var data = this.prepareRequest(request, requestData);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            var responseObject = new RBI.ActivateDeviceResponse(response);
            successCallback(responseObject);
            return responseObject;
        };

        //FailureCallBack function for the transport
        var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
        return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
    };

    /*
     * removeDevice
     *
     * @param request   see RemoveDeviceRequest object
     * @param successCallback is the callback function to invoke on success
     * @param failureCallback is the callback function to invoke on failure
     * @return RBI.RemoveDeviceResponse object
     */
    RBI.DeviceService.prototype.removeDevice = function (request, successCallback, failureCallback) {
        var requestData = this.getRequestData("removeDevice");
        var data = this.prepareRequest(request, requestData);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            var responseObject = new RBI.RemoveDeviceResponse(response);
            successCallback(responseObject);
            return responseObject;
        };

        //FailureCallBack function for the transport
        var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
        return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
    };

    RBI.CheckVersionRequest = function (appVersion, deviceSpec) {
        this.AppVersion = appVersion;
        this.DeviceSpec = deviceSpec;
    };

    RBI.CheckVersionRequest.prototype = new RBI.RequestOL();

    RBI.CheckVersionRequest.prototype.getParameters = function () {
        return ["AppVersion", "DeviceSpec"];
    };

    /*
     * CheckVersion
     *
     * @param request   see CheckVersionRequest object
     * @param successCallback is the callback function to invoke on success
     * @param failureCallback is the callback function to invoke on failure
     * @return RBI.CheckVersionResponse object
     */
    RBI.DeviceService.prototype.checkVersion = function (request, successCallback, failureCallback) {
        var requestData = this.getRequestData("checkVersion");
        var data = this.prepareRequest(request, requestData);

        //SuccessCallBack function for the transport
        var transportSuccessCallBack = function (response) {
            var responseObject = new RBI.CheckVersionResponse(response);
            successCallback(responseObject);
            return responseObject;
        };
        //FailureCallBack function for the transport
        var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
        return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
    };

}());

(function initKioskService() {
	"use strict";

/**
 * Kiosk service
 * Contains service functions for the following API functions:
 * Website API:
 * GetKioskByLatLong
 * GetKioskByKioskID
 * GetKioskCitiesByState
 * GetKioskZipcodesByCity
 * GetKiosksByCityZipState
 *
 * OL API
 * GetRecentKiosks
 *
 * @author: Peter Rajcani; used template developed by Kevin Clark
 */

/**
 * Create kiosk service cofiguration for kiosk service requests
 * @constructor
 */
RBI.KioskServiceConfig = function () {
    this.setConfig([
        // Proxy requests - Uses Website API (no authentication)
        { Name: "kioskSearch", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKioskByLatLong", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getKioskByKioskId", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKioskByKioskID", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getKioskCitiesByState", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKioskCitiesByState", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getKioskZipcodesByCity", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKioskZipcodesByCity", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getKiosksByCityZipState", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKiosksByCityZipState", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getKiosksByProductID", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKiosksByProductID", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getRecentKiosks", URL: RBI.Config.proxyBaseSecure+ "/rbproxy/api/GetRecentKiosks", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }
    ]);
};
RBI.KioskServiceConfig.prototype = new RBI.ServiceConfig();


/*
 * Create singleton of the kiosk service
 */
RBI.KioskService = function () {
	if (RBI.KioskService.prototype._singletonInstance) {
		return RBI.KioskService.prototype._singletonInstance;
	}
	RBI.KioskService.prototype._singletonInstance = this;
};

RBI.KioskService.prototype = new RBI.BaseService();

/**
 * Initialize kiosk service configuration
 * @param config
 */
RBI.KioskService.prototype.init = function (config) {
    if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
        throw new Error("config param must be of RBI.ServiceConfig type.");
    }
    this.initBase(config, new RBI.Transport());
};

/*
 * kioskSearch
 * Search for kiosks by address or zip code
 *
 * @param searchRequest   See KioskSearchRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Kiosk[] an array of Kiosk objects
 */
RBI.KioskService.prototype.kioskSearch = function (searchRequest, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("kioskSearch");
    var data = this.prepareRequest(searchRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;
        var results = [];
        for (i = 0; i < responseObject.Kiosks.length; i++) {
            var kioskObject = new RBI.Kiosk(responseObject.Kiosks[i]);
            results.push(kioskObject);
        }
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * getRecentKiosks
 * Search for recent kiosks populated using business logic
 *
 * @param request   see GetRecentKiosksRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Kiosk[] an array of Kiosk objects
 */
RBI.KioskService.prototype.getRecentKiosks = function (getRecentKiosksRequest, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("getRecentKiosks");
    var data = this.prepareRequest(getRecentKiosksRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = response;
        var results = [];
        for (i = 0; i < responseObject.Kiosks.length; i++) {
            var kioskObject = new RBI.Kiosk(responseObject.Kiosks[i]);
            results.push(kioskObject);
        }
        console.log(results);
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * getKioskByKioskId
 *
 * @param request   see GetKioskByKioskIdRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Kiosk          requested kiosk object
 */
RBI.KioskService.prototype.getKioskByKioskId = function (request, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("getKioskByKioskId");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = response;
        var results = [];
        for (i = 0; i < responseObject.Kiosks.length; i++) {
            var kioskObject = new RBI.Kiosk(responseObject.Kiosks[i]);
            results.push(kioskObject);
        }
        console.log(results);
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * getKioskCitiesByState
 *
 * @param request    see GetKioskCitiesByStateRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return an array of strings containing the kiosk cities
 */
RBI.KioskService.prototype.getKioskCitiesByState = function (request, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("getKioskCitiesByState");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = response;
        var results = [];
        for (i = 0; i < responseObject.Details.length; i++) {
            results.push(responseObject.Details[i]);
        }

        console.log(results);
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * getKioskZipcodesByCity
 *
 * @param request   see GetKioskZipcodesByCityRequest
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return an array of strings containing the kiosk zip codes
 */
RBI.KioskService.prototype.getKioskZipcodesByCity = function (request, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("getKioskZipcodesByCity");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = response;
        var results = [];
        for (i = 0; i < responseObject.Details.length; i++) {
            results.push(responseObject.Details[i]);
        }

        console.log(results);
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * GetKiosksByCityZipState
 * Get all kiosks in the specified city/state/zip
 *
 * @param searchRequest   See GetKiosksByCityZipStateequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Kiosk[] an array of Kiosk objects
 */
RBI.KioskService.prototype.getKiosksByCityZipState = function (searchRequest, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("getKiosksByCityZipState");
    var data = this.prepareRequest(searchRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;	// assume json returned
        var results = [];
        if (responseObject.Kiosks && responseObject.Kiosks.length) {
            for (i = 0; i < responseObject.Kiosks.length; i++) {
                var kioskObject = new RBI.Kiosk(responseObject.Kiosks[i]);
                results.push(kioskObject);
            }
        }
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};


/*
 * getKiosksByProductID
 * Search for kiosks by product ID
 *
 * @param request            See GetKiosksByProductIDRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Kiosk[] an array of Kiosk objects
 */
RBI.KioskService.prototype.getKiosksByProductID = function (request, successCallback, failureCallback) {
    var i, requestData = this.getRequestData("getKiosksByProductID");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;
        var results = [];
        for (i = 0; i < responseObject.Kiosks.length; i++) {
            var kioskObject = new RBI.Kiosk(responseObject.Kiosks[i]);
            results.push(kioskObject);
        }
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/**
 * mergeKioskLists
 *
 * Merge list of recent kiosks and list of kiosks from location search
 * If list of recent kiosks contains less than 3 items, it is populated from
 * the result of search by location
 *
 * @param recentKiosks  - list of recent kiosks
 * @param kiosks
 */
RBI.KioskService.prototype.mergeKioskLists = function (recentKiosks, kiosks) {
    var numRecentKiosks =  (this.isKioskListEmpty(recentKiosks))? 0:recentKiosks.length;
    var numKiosks =  (this.isKioskListEmpty(kiosks))? 0:kiosks.length;
    if (numRecentKiosks < 3 && numKiosks > 0) {
        var n;
        for (n = 0; n < 3 - numRecentKiosks && n < numKiosks; n++) {
            recentKiosks.push(kiosks[n]);
        }
        kiosks.splice(0, n);
    }
};

/**
 * isKioskListEmpty
 * Determine if kiosk list is empty
 *
 * @param kioskList
 * @returns {boolean}
 */
RBI.KioskService.prototype.isKioskListEmpty = function(kioskList) {
    var isEmpty = false;
    if (kioskList.length === 0) {
        isEmpty = true;
    }
    else if (kioskList.length === 1 && !kioskList[0]) {
        isEmpty = true;
    }
    return isEmpty;
};
}());
(function initProductService() {
	"use strict";

/*
 * Define the product service configuration
 *
 * @author Kevin Clark   monster910@hotmail.com plus others
 */
RBI.ProductServiceConfig = function () {
	this.setConfig([
		{ Name: "productSearch", URL: RBI.Config.proxyBase + "/rbproxy/api/ProductSearch", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "productSearchSecure", URL: RBI.Config.proxyBase + "/rbproxy/api/ProductSearchForCustomer", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getProductAutocompleteSuggestions", URL: RBI.Config.proxyBase + "/rbproxy/api/GetSuggestions", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getPromotions", URL: RBI.Config.proxyBase + "/rbproxy/api/GetPromotions", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getFilters", URL: RBI.Config.proxyBase + "/rbproxy/api/GetFilters", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getRecommendedProductsByProductID", URL: RBI.Config.proxyBase + "/rbproxy/api/GetRecommendedProductsByProductID", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getRecommendedProductsByProductIDSecure", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetRecommendedProductsByProductIDForCustomer", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getProductDetail", URL: RBI.Config.proxyBase + "/rbproxy/api/GetProductDetail", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getProductDetailSecure", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetProductDetailByProductIDForCustomer", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getProductDetailByQueryId", URL: RBI.Config.proxyBase + "/rbproxy/api/GetProductDetailByQueryId", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getLicense", URL: RBI.Config.proxyBase + "/rbproxy/api/GetLicense", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: null},
        { Name: "getPlaybackURL", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetPlaybackURL", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "completeWatchingTitle", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/CompleteWatchingTitle", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "completeWatchingTitleOL", URL: RBI.Config.sessionShiftUrl, OriginalURL: RBI.Config.sessionShiftUrl, Protocol: "POST", ContentType: "application/xml", Helper: new RBI.CompleteWatchingTitleRequestHelper(), ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "setPlaybackLocation",  URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/SetPlaybackLocation" , Protocol: "POST", ContentType: "application/json", Helper: null ,ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getPlaybackLocation", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetPlaybackLocation", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "setPlaybackLocationOL", URL: RBI.Config.sessionShiftUrl, OriginalURL: RBI.Config.sessionShiftUrl, Protocol: "POST", ContentType: "application/xml", Helper: new RBI.SetPlaybackLocationRequestHelper(), ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getRecommendedProductsBySearchCriteria", URL: RBI.Config.proxyBase + "/rbproxy/api/GetRecommendedProductsBySearchCriteria", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getRecommendedProductsBySearchCriteriaForCustomer", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetRecommendedProductsBySearchCriteriaForCustomer", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }

	]);
};

RBI.ProductServiceConfig.prototype = new RBI.ServiceConfig();


/*
 * Create singleton of the product service 
 *
 * @author Kevin Clark   monster910@hotmail.com
 */
RBI.ProductService = function () {
	if (RBI.ProductService.prototype._singletonInstance) {
		return RBI.ProductService.prototype._singletonInstance;
	}
	RBI.ProductService.prototype._singletonInstance = this;
};

RBI.ProductService.prototype = new RBI.BaseService();

// TODO: Pass transport as parameter.
RBI.ProductService.prototype.init = function (config) {
    if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
        throw new Error("config param must be of RBI.ServiceConfig type.");
    }
    this.initBase(config, new RBI.Transport());
};

/*
 * Search for products 
 *
 * @param searchData. See SearchRequest object
 * @param successCallback is the callback function to invoke on success
 *          Product[] a array of Product objects
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
*/
RBI.ProductService.prototype.productSearch = function (searchRequest, successCallback, failureCallback,secure) {
    var requestData = secure ? this.getRequestData("productSearchSecure"):this.getRequestData("productSearch");
    var data = this.prepareRequest(searchRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var productSearchResponseModel = new RBI.ProductSearchResponse(response);
        successCallback(productSearchResponseModel);
		return productSearchResponseModel;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);

};

/*
 * Search for products over https
 *
 * @param searchData. See SearchRequest object
 * @param successCallback is the callback function to invoke on success
 *          Product[] a array of Product objects
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.productSearchSecure = function (searchRequest, successCallback, failureCallback) {
    return this.productSearch(searchRequest, successCallback, failureCallback, true);
};

/**
 * Product Autocomplete Suggestions Request
 * @param searchQuery - search query
 * @constructor
 */
RBI.ProductAutocompleteSuggestionsRequest = function (searchQuery) {
    this.SearchQuery = searchQuery;
};

RBI.ProductAutocompleteSuggestionsRequest.prototype = new RBI.RequestOL();

RBI.ProductAutocompleteSuggestionsRequest.prototype.getParameters = function () {
    return ["SearchQuery"];
};

RBI.ProductAutocompleteSuggestionsRequest.prototype.getSearchQuery = function () {
    return this.SearchQuery;
};

RBI.ProductAutocompleteSuggestionsRequest.prototype.setSearchQuery = function (searchQuery) {
    this.SearchQuery = searchQuery;
};

RBI.ProductService.prototype.getProductAutocompleteSuggestions = function (getAutocompleteSuggestionsRequest, successCallback, failureCallback) {
    var requestData = this.getRequestData("getProductAutocompleteSuggestions");
    var data = this.prepareRequest(getAutocompleteSuggestionsRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var autocompleteSuggestions = new RBI.ProductAutocompleteSuggestionsResponse(response);

        successCallback(autocompleteSuggestions);
		return autocompleteSuggestions;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Get promotions based on device type and promotion types
 *
 * @param promotionRequest is the data for the promotion call request
 * @param successCallback is the callback function to invoke on success
 *          Promotion[] objects of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
*/
RBI.ProductService.prototype.getPromotions = function (promotionRequest, successCallback, failureCallback) {
    var requestData = this.getRequestData("getPromotions");
    var data = this.prepareRequest(promotionRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var i, responseObject = response;   // assume transport is returning json
        var results = [];
        if (responseObject.Promotions) {
            for (i = 0; i < responseObject.Promotions.length; i++) {
                var promotion = responseObject.Promotions[i];       // TODO - wrap in model object
                var promotionModel = new RBI.Promotion(promotion);
                results.push(promotionModel);
            }
        }
        var promotions = new RBI.Promotions(results);
        if (successCallback) {
        	successCallback(promotions);
        }
        return promotions;             // return for promise chain
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        if (failureCallback) {
        	failureCallback(response);
        }
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);

};

/*
 * Get filters based on filter request. See FilterRequest
 *
 * @param filterRequest is the data for the get filters call request
 
 * @param successCallback is the callback function to invoke on success with
 *          FilterType[] objects of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
*/
RBI.ProductService.prototype.getFilters = function (filterRequest, successCallback, failureCallback) {
    var requestData = this.getRequestData("getFilters");
    var data = this.prepareRequest(filterRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = response;   // assume transport is returning json
        var results = [];
        RBI.FilterType.Defines.FILTER_TYPES.forEach(function (category) {
            results.push(new RBI.FilterType(category, responseObject[category]));
        });
        successCallback(results);
		return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);

};

/*
 * Get RecommendedProducts 
 *
 * @param recommendedProductRequest is the data for the get recommended products
 
 * @param successCallback is the callback function to invoke on success with 
 *          Product[] objects of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
*/
RBI.ProductService.prototype.getRecommendedProducts = function (recommendedProductRequest, successCallback, failureCallback) {
    var requestData = recommendedProductRequest.secure? this.getRequestData("getRecommendedProductsByProductIDSecure") : this.getRequestData("getRecommendedProductsByProductID");
    var data = this.prepareRequest(recommendedProductRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = new RBI.RecommendedProductsResponse(response);
        if (successCallback) {
            return successCallback(responseObject);
        }
		return responseObject;
    };

    ////FailureCallBack function for the transport
    //var transportFailureCallBack = function(response){
    //    //Error Handling on the API Response
    //    if (requestData.ErrorHandler) {
    //        response = requestData.ErrorHandler.getErrorObject(response);
    //    }
    //    console.log(response);
    //    failureCallback(response);
    //    return response;
    //};

    var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);

};

/*
 * @deprecated - use getRecommendedProducts and set recommendedProductRequest.secure = true to use the https POST when customer is logged in
 * Get RecommendedProducts over https
 *
 * @param request is the data for the get product detail. @See RBI.ProductDetailsRequest
 * @param successCallback is the callback function to invoke on success with Product object of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 *
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.getRecommendedProductsSecure = function (recommendedProductRequest, successCallback, failureCallback) {
    recommendedProductRequest.secure = true;
    return this.getRecommendedProducts(recommendedProductRequest, successCallback, failureCallback);
};

/*
 * Get RecommendedProducts By Search Criteria
 *
 * @param recommendedProductBySearchCriteriaRequest is the data for the get recommended products

 * @param successCallback is the callback function to invoke on success with
 *          Product[] objects of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.getRecommendedProductsBySearchCriteria = function (recommendedProductBySearchCriteriaRequest, successCallback, failureCallback) {
    var requestData = recommendedProductBySearchCriteriaRequest.secure ? this.getRequestData("getRecommendedProductsBySearchCriteriaForCustomer") : this.getRequestData("getRecommendedProductsBySearchCriteria");
    var data = this.prepareRequest(recommendedProductBySearchCriteriaRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var responseObject = new RBI.RecommendedProductsBySearchCriteriaResponse(response);
        if (successCallback) {
            return successCallback(responseObject);
        }
        return responseObject;
    };

    ////FailureCallBack function for the transport
    //var transportFailureCallBack = function(response){
    //    //Error Handling on the API Response
    //    if (requestData.ErrorHandler) {
    //        response = requestData.ErrorHandler.getErrorObject(response);
    //    }
    //    console.log(response);
    //    failureCallback(response);
    //    return response;
    //};

    var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallback);

};

/*
 * @deprecated - use getRecommendedProductsBySearchCriteria and set request.secure = true to use the https POST when customer is logged in    
 * Get RecommendedProductsBySearchCriteria over https
 *
 * @param request is the data for the get product detail. @See RBI.RecommendedProductsBySearchCriteriaRequest
 * @param successCallback is the callback function to invoke on success with recommended products array object of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 *
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.getRecommendedProductsBySearchCriteriaForCustomer = function (request, successCallback, failureCallback) {
    request.secure = true;
    return this.getRecommendedProductsBySearchCriteria(request, successCallback, failureCallback);
};

/*
 * Get Product Details 
 *
 * @param request is the data for the get product detail. @See RBI.ProductDetailsRequest
 * @param successCallback is the callback function to invoke on success with Product object of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 * @param secure if true use secure protocol
 * @return Promise from transport layer
*/
RBI.ProductService.prototype.getProductDetails = function (request, successCallback, failureCallback) {
    var requestData = request.secure ? this.getRequestData("getProductDetailSecure") : this.getRequestData("getProductDetail");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport. This will convert the response to a object and return it
    var transportSuccessCallBack = function (response) {
        // TODO - can be consolidated with productSearch
        var responseObject = response;   // assume transport is returning json
        var product = null;
        if (responseObject.ProductInfo == null) {
            // if no product info is returned treat it as failure
            failureCallback(response);
        }
        else {
            product = new RBI.Product(responseObject.ProductInfo.ProductType, responseObject.ProductInfo);
            if (successCallback) {
                return successCallback(product);
            }
        }
        return product;
    };

    // when data includes a queryId and the lookup is NOT secure (i.e. a customer specific query), then fire and forget a request to OL
    if (data.QueryID && !request.secure) {
        //Following getProductDetailByQueryId call is made to Proxy / OL as a tracking purpose
        //so that they know about the queryID, we don't care about the data coming back for this call
        //This is done because this call will not be cached by akamai
        var requestWithQueryIdParameterData = this.getRequestData("getProductDetailByQueryId");
        var dataWithQueryIdParameter = this.prepareRequest(request, requestData);
        this.sendRequest(dataWithQueryIdParameter, requestWithQueryIdParameterData, function() {}, function() {});
        data.QueryID = null;
    }

    var transportFailureCallback = this.transportFailureCallback(this.transport, requestData.ErrorHandler, failureCallback);
    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallback);
};

/*
 * @deprecated - use getProductDetails and set request.secure = true to use the https POST when customer is logged in

 * Get Product Details over https
 *
 * @param request is the data for the get product detail. @See RBI.ProductDetailsRequest
 * @param successCallback is the callback function to invoke on success with Product object of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 *
 * @return Promise from transport layer
*/
RBI.ProductService.prototype.getProductDetailsSecure = function (request, successCallback, failureCallback) {
    request.secure = true;
    return this.getProductDetails(request, successCallback, failureCallback);
};

/*
 * Get Product Details for multiple movie ids. If any titles have errors on fetch 
 * we will omit them from results. If all the titles have errors, we will throw a failure
 * result
 *
 * @param requestArray is the array of requests for product details. @See RBI.ProductDetailsRequest
 
 * @param successCallback is the callback function to invoke on success with Product object of the result when successful
 * @param failureCallback is the callback function to invoke on failure
 * @return { Promise[], results[], failures[] }
*/
RBI.ProductService.prototype.getMultipleProductDetails = function (requestArray, successCallback, failureCallback) {

    var i, results = [];
    var failures = [];
    var promiseArray = [];
	var requestData = this.getRequestData("getProductDetail");

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        var responseObject = response;   // assume transport is returning json
        var product = new RBI.Product(responseObject.ProductInfo.ProductType, responseObject.ProductInfo);
        results.push(product);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failures.push(response);
        return response;
    };
    var previousPromise = null;
    for (i in requestArray) {
        var data = this.prepareRequest(requestArray[i], requestData);
        promiseArray[i] = this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
    }
    // we return to caller the promise array and collection structures so specific frameworks can process
    // for example winjs, jquery and angular all have different chaining of promises

    return { promises: promiseArray, results: results, failures: failures };
};

/*
 * Get License
 *
 * @param request is the XML String needed to go to License Server

 * @param successCallback is the callback function to invoke on success with XML response of the licenseServer
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.getLicense = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("getLicense");
    var data = request;

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        successCallback(response);
		return response;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);

};

/*
 * Get Playback URL
 *
 * @param request is the data for the get Playback URL

 * @param successCallback is the callback function to invoke on success with playback model
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.getPlaybackUrl = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("getPlaybackURL");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = new RBI.Playback(response);
        successCallback(responseObject);
		return responseObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        helper.debugLog(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Complete watching title against proxy (for something like I'm done on watch history)
 *
 * @param request is the data for the complete watching title

 * @param successCallback is the callback function to invoke on success
 *      complete Watching Title response that gives only a responseCode if succeed or not
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.completeWatchingTitle = function (request, successCallback, failureCallback, configurationAPIName) {
    var configurationName = configurationAPIName === undefined ? "completeWatchingTitle" : configurationAPIName;
    var requestData = this.getRequestData(configurationName);

    var data = this.prepareRequest(request, requestData);
    if (configurationName === "completeWatchingTitleOL") {
        // set session shift token
        var result = new String(requestData.OriginalURL).replace("{TOKEN}", request.Token);
        requestData.URL = result;
    }

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = new RBI.CompleteWatchingTitleResponse(response);
        successCallback(responseObject);
		return responseObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);

};

    /*
 * Complete watching title  - when playing a movie
 *
 * @param request is the data for the complete watching title

 * @param successCallback is the callback function to invoke on success
 *      complete Watching Title response that gives only a responseCode if succeed or not
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.completeWatchingTitleOL = function (request, successCallback, failureCallback) {
    return this.completeWatchingTitle(request, successCallback, failureCallback, "completeWatchingTitleOL");
};

/*
 * sessions shift call on OL API direct. This is an open call and does not require the 
 * OL Session Token
 *
 * @param request is the data for the Set playback location

 * @param successCallback is the callback function to invoke on success session shift
 * @param failureCallback is the callback function to invoke on failure for session shift
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.setPlaybackLocationOL = function (request, successCallback, failureCallback) {
    if (typeof request.Status == 'undefined' || request.Status == null) {
        // if status is not specified default to heartbeat
        request.setStatus(RBI.SetPlaybackLocationRequest.Defines.HEARTBEAT);
    }
    var requestData = this.getRequestData("setPlaybackLocationOL");
    var data = this.prepareRequest(request, requestData);
    //console.log(data);
    var result = new String(requestData.OriginalURL).replace("{TOKEN}", request.Token);
    requestData.URL = result;
    //console.log(requestData.URL);
    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        console.log(response);
        var responseObject = new RBI.SetPlaybackLocationResponse(response);
        successCallback(responseObject);
        return responseObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler != null && response.status != 0) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

/*
 * Set playback location  - when playing a movie
 *
 * @param request is the data for the Set playback location

 * @param successCallback is the callback function to invoke on success with setPlaybackLocation response Model
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.setPlaybackLocation = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("setPlaybackLocation");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = new RBI.SetPlaybackLocationResponse(response);
        successCallback(responseObject);
	    return responseObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);

        //requestData.URL +"?access_token=" + request.token,
};

/*
 * Get playback location  - when playing a movie
 *
 * @param request is the data for the Get playback location

 * @param successCallback is the callback function to invoke on success with getPlaybackLocation response Model
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise from transport layer
 */
RBI.ProductService.prototype.getPlaybackLocation = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("getPlaybackLocation");
    var data = this.prepareRequest(request, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        console.log(response);
        var responseObject = new RBI.GetPlaybackLocationResponse(response);
        successCallback(responseObject);
		return responseObject;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};
}());

(function initReservationService() {
	"use strict";

RBI.ReservationServiceProxyConfig = function() {
	this.setConfig([
		{ Name: "subscriptions", URL: RBI.Config.proxyBase + "/rbproxy/api/GetSubscriptions", Protocol: "GET", ContentType: "application/json", Helper: new RBI.SubscriptionsRequestHelper(),ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getSubscriptionPricing", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetSubscriptionPricing", Protocol: "POST", ContentType: "application/json", Helper: null,ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "subscribeCustomer", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/SubscribeCustomer", Protocol: "POST", ContentType: "application/json", Helper: null,ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "cancelSubscription", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/CancelSubscription", Protocol: "POST", ContentType: "application/json", Helper: null,ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getKioskCartPricing", URL: RBI.Config.proxyBase + "/rbproxy/api/GetKioskCartPricing", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getKioskCartPricingSecure", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetKioskCartPricingSecure", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "performKioskReservation", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/PerformKioskReservation", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getOnDemandCartPricing", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetOnDemandCartPricing", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "performOnDemandPurchase", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/PerformOnDemandPurchase", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "updateSubscriptionCard", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/UpdateSubscriptionCard", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }
	]);
};
RBI.ReservationServiceProxyConfig.prototype = new RBI.ServiceConfig();

RBI.ReservationService = function () {
	if (RBI.ReservationService.prototype._singletonInstance) {
		return RBI.ReservationService.prototype._singletonInstance;
	}
	RBI.ReservationService.prototype._singletonInstance = this;
};
RBI.ReservationService.prototype = new RBI.BaseService();

// TODO: Pass transport as parameter.
RBI.ReservationService.prototype.init = function (config) {
	if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
		throw new Error("config param must be of RBI.ServiceConfig type.");
	}
	this.initBase(config, new RBI.Transport());
};

/*
 * Returns list of available Subscription objects.
*/
RBI.ReservationService.prototype.getSubscriptions = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("subscriptions");
    var data = this.prepareRequest(request, requestData);

    this.sendRequest(data, requestData, function (response) {
            var subscription = new RBI.Subscription(response);
            successCallback(subscription);
            return subscription;
		}, function(response) {
			if (requestData.ErrorHandler !== null) {
				response = requestData.ErrorHandler.getErrorObject(response);
			}
			failureCallback(response);
			return response;
		});

};

RBI.ReservationService.prototype.getSubscriptionPricing = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("getSubscriptionPricing");
    var data = this.prepareRequest(request, requestData);

	this.sendRequest(data, requestData, function(response) {
		var pricing = new RBI.SubscriptionPricing(response);
		successCallback(pricing);
        return pricing;
	}, function(response) {
		//Error Handling on the API Response
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		failureCallback(response);
		return response;
	});
};
RBI.ReservationService.prototype.subscribeCustomer = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("subscribeCustomer");
    var data = this.prepareRequest(request, requestData);

	this.sendRequest(data, requestData, function(response) {
		var pricing = new RBI.SubscriptionResponse(response);
		successCallback(pricing);
		return pricing;
	}, function(response) {
		//Error Handling on the API Response
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		failureCallback(response);
		return response;
	});
};
RBI.ReservationService.prototype.cancelSubscription = function (request, successCallback, failureCallback) {
    var requestData = this.getRequestData("cancelSubscription");
    var data = this.prepareRequest(request, requestData);

	this.sendRequest(data, requestData, function(response) {
		var pricing = new RBI.CancelSubscriptionResponse(response);
		successCallback(pricing);
		return pricing;
	}, function(response) {
		//Error Handling on the API Response
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		failureCallback(response);
		return response;
	});
};

RBI.ReservationService.prototype.getKioskCartPricing = function (request, successCallback, failureCallback) {
    var requestData;

    if (new RBI.PersistenceManager().IsLoggedIn()) {
		requestData = this.getRequestData("getKioskCartPricingSecure");
	} else {
		requestData = this.getRequestData("getKioskCartPricing");
	}

	var data = this.prepareRequest(request, requestData);

	var successCbk = function (response) {
	    var pricing = new RBI.KioskCartPricing(response);
	    if (successCallback) {
	        successCallback(pricing);
	    }
	    return pricing;
	};
	var failureCbk = function(response) {
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		console.log(response);
		if (failureCallback) {
		    response = failureCallback(response) || response;
		}
		return response;
	};

	this.sendRequest(data, requestData, successCbk, failureCbk);
};



RBI.UpdateSubscriptionCardRequest = function (accountNumber) {
	this.addParam("AccountNumber", accountNumber);
};

RBI.UpdateSubscriptionCardRequest.prototype = new RBI.RequestOL();

RBI.ReservationService.prototype.updateSubscriptionCard = function (request, successCallback, failureCallback) {
	var requestData = this.getRequestData("updateSubscriptionCard");
	var data = this.prepareRequest(request, requestData);

	var successCbk = function (response) {
	    var subscriptionResponse = new RBI.SubscriptionResponse(response);
	    successCallback(subscriptionResponse);
	    return subscriptionResponse;
	};
	var failureCbk = function(response) {
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		console.log(response);
		failureCallback(response);
		return response;
	};

	this.sendRequest(data, requestData, successCbk, failureCbk);
};


RBI.PerformKioskReservationRequest = function (kioskId, applyCredits, accountNumber, purchaseOptionIds) {
	this.addParam("KioskID", kioskId);
	this.addParam("ApplyCredits", applyCredits);
	this.addParam("AccountNumber", accountNumber);
	this.addParam("PurchaseOptionIDs", {PurchaseOptionID : purchaseOptionIds});
};
RBI.PerformKioskReservationRequest.prototype = new RBI.RequestOL();

RBI.ReservationService.prototype.performKioskReservation = function (request, successCallback, failureCallback) {
	var requestData = this.getRequestData("performKioskReservation");
	var data = this.prepareRequest(request, requestData);

	var successCbk = function (response) {
	    var reservationResponseObject = new RBI.PerformKioskReservationResponse(response);
	    successCallback(reservationResponseObject);
	    return reservationResponseObject;
	};
	var failureCbk = function(response) {
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		RBI.CartErrorHelper.processErrorDescription(response);
		console.log(response);
		failureCallback(response);
		return response;
	};

	this.sendRequest(data, requestData, successCbk, failureCbk);
};

RBI.ReservationService.prototype.getOnDemandCartPricing = function (request, successCallback, failureCallback) {
	var requestData = this.getRequestData("getOnDemandCartPricing");
	var data = this.prepareRequest(request, requestData);

	var successCbk = function(response) {
		var pricing = new RBI.OnDemandCartPricing(response.OnDemandCartPricing);
		successCallback(pricing);
		return pricing;
	};
	var failureCbk = function(response) {
		//Error Handling on the API Response
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		console.log(response);
		failureCallback(response);
		return response;
	};

	return this.sendRequest(data, requestData, successCbk, failureCbk);
};

RBI.ReservationService.prototype.performOnDemandPurchase = function (request, successCallback, failureCallback) {
	var requestData = this.getRequestData("performOnDemandPurchase");
	var data = this.prepareRequest(request, requestData);

	var successCbk = function(response) {
		var purchase = new RBI.OnDemandPurchase(response);
		successCallback(purchase);
		return purchase;
	};
	var failureCbk = function(response) {
		//Error Handling on the API Response
		if (requestData.ErrorHandler !== null) {
			response = requestData.ErrorHandler.getErrorObject(response);
		}
		console.log(response);
		failureCallback(response);
		return response;
	};

	return this.sendRequest(data, requestData, successCbk, failureCbk);
};
}());
(function initReviewRatingService() {
	"use strict";

RBI.ReviewRatingServiceConfig = function() {
	this.setConfig([
		{ Name: "getProductReviews", URL: RBI.Config.proxyBase + "/rbproxy/api/GetProductReviews", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getProductReviewsSecure", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetProductReviewsForCustomer", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "getProductRatings", URL: RBI.Config.proxyBase + "/rbproxy/api/GetProductRatings", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getProductRatingsSecure", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/GetProductRatingsForCustomer", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getProductReviewsNoCache", URL: RBI.Config.proxyBase + "/rbproxy/api/GetProductReviewsNoCache", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "getProductRatingsNoCache", URL: RBI.Config.proxyBase + "/rbproxy/api/GetProductRatingsNoCache", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "rateProduct", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/RateProduct", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "reviewProduct", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/ReviewProduct", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "updatePluckFields", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/UpdatePluckFields", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() },
        { Name: "removeReview", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/RemoveReview", Protocol: "POST", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }
	]);
};

RBI.ReviewRatingServiceConfig.prototype = new RBI.ServiceConfig();


/*
 * Create singleton of the Rating & review Service
 *
 * @author Stijn Asnong
 */
RBI.ReviewRatingService = function () {
	if (RBI.ReviewRatingService.prototype._singletonInstance) {
		return RBI.ReviewRatingService.prototype._singletonInstance;
	}
	RBI.ReviewRatingService.prototype._singletonInstance = this;
};

RBI.ReviewRatingService.prototype = new RBI.BaseService();

// TODO: Pass transport as parameter.
RBI.ReviewRatingService.prototype.init = function (config) {
    if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
        throw new Error("config param must be of RBI.ServiceConfig type.");
    }
    this.initBase(config, new RBI.Transport());
};

/*
 * Get the Product Reviews
 *
 * @param getProductReviews
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @param secure if the call has to be made over https
 * @return ProductReview response - with a collection of reviews
 */
RBI.ReviewRatingService.prototype.getProductReviews = function (getProductReviews,successCallback, failureCallback,secure) {
    var requestData = null;
    var persistenceManager = new RBI.PersistenceManager();
    var noCaching = persistenceManager.isPluckReviewsNoCaching();
    if(secure){
        requestData = this.getRequestData("getProductReviewsSecure");
    }else{
        requestData = noCaching ? this.getRequestData("getProductReviewsNoCache") : this.getRequestData("getProductReviews");
    }

    var data = this.prepareRequest(getProductReviews,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var results = new RBI.ProductReviewResponse(response);
        console.log(results);
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    //Send With a NoCaching  option
    requestData.RequestOptions = new RBI.RequestOptions(noCaching,false);
    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

/*
 * Get the Product Reviews over https
 *
 * @param request is the data for the get The reviews 
 * @param successCallback is the callback function to invoke on success 
 * @param failureCallback is the callback function to invoke on failure
 *
 * @return Promise from transport layer
*/
RBI.ReviewRatingService.prototype.getProductReviewsSecure = function (request, successCallback, failureCallback) {
    return this.getProductReviews(request, successCallback, failureCallback, true);
};


/*
 * Get the Product Ratings
 *
 * @param getProductRatings
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @param secure if the call has to be made over https
 * @return ProductRating
 */

RBI.ReviewRatingService.prototype.getProductRatings = function (getProductRatings,successCallback, failureCallback,secure) {
    var requestData = null;
    var persistenceManager = new RBI.PersistenceManager();
    var noCaching = persistenceManager.isPluckRatingsNoCaching();
    if(secure){
        requestData = this.getRequestData("getProductRatingsSecure");
    }else{
        requestData = noCaching ? this.getRequestData("getProductRatingsNoCache") : this.getRequestData("getProductRatings");
    }

    var data = this.prepareRequest(getProductRatings,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        var results = new RBI.ProductRating(response);
        successCallback(results);
        return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };
    //Send With a NoCaching  option
    requestData.RequestOptions = new RBI.RequestOptions(noCaching,false);
    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Get the Product Ratings over https
 *
 * @param request is the data for the get The ratings 
 * @param successCallback is the callback function to invoke on success 
 * @param failureCallback is the callback function to invoke on failure
 *
 * @return Promise from transport layer
*/
RBI.ReviewRatingService.prototype.getProductRatingsSecure = function (request, successCallback, failureCallback) {
    return this.getProductRatings(request, successCallback, failureCallback, true);
};


/*
 * Rate a product
 *
 * @param rateProduct request
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return ProductRating
 */

RBI.ReviewRatingService.prototype.rateProduct = function (rateProduct,successCallback, failureCallback) {
    var persistenceManager = new RBI.PersistenceManager();
    var requestData = this.getRequestData("rateProduct");
    var data = this.prepareRequest(rateProduct,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        persistenceManager.setPluckRatingsNoCachingStartTime(new Date().getTime());
        var results = new RBI.ProductRating(response);
        successCallback(results);
		return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Review a product
 *
 * @param reviewProduct request
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return ProductReview Response
 */
RBI.ReviewRatingService.prototype.reviewProduct = function (reviewProduct,successCallback, failureCallback) {
    var persistenceManager = new RBI.PersistenceManager();
    var requestData = this.getRequestData("reviewProduct");
    var data = this.prepareRequest(reviewProduct,requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function(response){
        persistenceManager.setPluckReviewsNoCachingStartTime(new Date().getTime());
        var results = new RBI.ProductReviewResponse(response);
        successCallback(results);
		return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function(response){
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data,requestData,transportSuccessCallBack,transportFailureCallBack);
};

/*
 * Update the pluck Fields on CustomerObject
 *
 * @param updatePluckFieldsRequest request
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return ProductReview Response
 */
RBI.ReviewRatingService.prototype.updatePluckFields = function (updatePluckFieldsRequest, successCallback, failureCallback) {

    var requestData = this.getRequestData("updatePluckFields");
    var data = this.prepareRequest(updatePluckFieldsRequest, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        var responseResult = new RBI.Response(response);
        successCallback(responseResult);
        return responseResult;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

/*
 * Remove a Review of a product
 *
 * @param removeReview request
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return ProductReview Response
 */
RBI.ReviewRatingService.prototype.removeReview = function (removeReview, successCallback, failureCallback) {
    var persistenceManager = new RBI.PersistenceManager();
    var requestData = this.getRequestData("removeReview");
    var data = this.prepareRequest(removeReview, requestData);

    //SuccessCallBack function for the transport
    var transportSuccessCallBack = function (response) {
        persistenceManager.setPluckReviewsNoCachingStartTime(new Date().getTime());
        var results = new RBI.ProductReviewResponse(response);
        successCallback(results);
		return results;
    };

    //FailureCallBack function for the transport
    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        failureCallback(response);
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};
}());
(function initSecurityService() {
	"use strict";

var oauthToken = null;

/**
 * This helper class will assemble a XML request to send to OL or the RBProxy
 */

RBI.CreateSessionRequestHelper = function () {
    this.olTemplate = null;

	var xhttp;
    if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
    } else {    // IE 5/6
    	xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.open("GET", RBI.Config.olXmlRequestFilePath, false);
    xhttp.send(null);
    this.olTemplate = xhttp.responseText;
    if (this.olTemplate.indexOf("$requestInfo") == -1) {
    	throw new Error("CreateSessionRequestHelper(): Cannot load olTemplate. Check RBI.Config.olXmlRequestFilePath");
    };
};

RBI.CreateSessionRequestHelper.prototype.buildTransactionInfo = function (request) {
    var olTemplate = this.olTemplate;
    var tap = (request && request.transactionAccessPoint)?request.transactionAccessPoint:RBI.PlatformConfig.transactionAccessPointOL;
    var transactionDeviceID = (request && request.transactionDeviceID)?request.transactionDeviceID:RBI.PlatformConfig.transactionDeviceID;
    var transactionInfo = {id: UUID.generate(), time: new Date().toISOString(), transactionAccessPoint: tap, transactionDeviceID: transactionDeviceID, format: "json" };
    olTemplate = olTemplate.replace("$transactionInfo.id", transactionInfo.id);
    olTemplate = olTemplate.replace("$transactionInfo.time", transactionInfo.time);
    olTemplate = olTemplate.replace("$transactionInfo.transactionAccessPoint", transactionInfo.transactionAccessPoint);
    olTemplate = olTemplate.replace("$transactionInfo.transactionDeviceID", transactionInfo.transactionDeviceID);
    olTemplate = olTemplate.replace("$transactionInfo.format", transactionInfo.format);
//    console.log(olTemplate);
    return olTemplate;
};

RBI.CreateSessionRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/soap+xml; charset=utf-8") {
        return this.getRequestAsXML(request);
    }

    return this.getRequestAsJSON(request);
};

RBI.CreateSessionRequestHelper.prototype.getRequestAsXML = function (createSessionRequest) {
    var requestData = this.buildTransactionInfo(createSessionRequest);
    var content = "<Token><![CDATA[$token]]></Token>";
    if (createSessionRequest.deviceType) {
    	content += "<DeviceType>";
    	content += createSessionRequest.deviceType;
    	content += "</DeviceType>";
    }
    if (createSessionRequest.getLoadCustomer()) {
    	content += "<LoadCustomer>true</LoadCustomer>";
        if (createSessionRequest.loadCustomerTAP) {
        	content += "<LoadCustomerTAP>";
        	content += createSessionRequest.loadCustomerTAP;
        	content += "</LoadCustomerTAP>";
        }
    }
    
    var requestInfo = { event: "CreateSession", content: content };
    requestData = requestData.replace("$requestInfo.event", requestInfo.event);
    requestData = requestData.replace("$requestInfo.content", requestInfo.content);
    // base64 encode the response from IDM
    //var base64IDMResponse = window.btoa(createSessionRequest.token);
    requestData = requestData.replace("$token", createSessionRequest.token);
    if (RBI.Config.debug) {
    	console.log(requestData);
    }
    return requestData;   
};

RBI.CreateSessionRequestHelper.prototype.getRequestAsJSON = function (requestData) {
    return requestData.params ? JSON.stringify(requestData.params) : JSON.stringify(requestData);
};

RBI.GetGrantTokenForRBOAuthRequestHelper = function () {
};

RBI.GetGrantTokenForRBOAuthRequestHelper.prototype = new RBI.CreateSessionRequestHelper();

RBI.GetGrantTokenForRBOAuthRequestHelper.prototype.getRequestAsXML = function (idmResponse) {
    var requestData = this.buildTransactionInfo();
    var requestInfo = { event: "GetGrantTokenForRBOAuth", content: "<RSTRIdP><![CDATA[$token]]></RSTRIdP>" };
    requestData = requestData.replace("$requestInfo.event", requestInfo.event);
    requestData = requestData.replace("$requestInfo.content", requestInfo.content);
    // base64 encode the response from IDM
    //var base64IDMResponse = window.btoa(idmResponse);
    requestData = requestData.replace("$token", idmResponse);
    console.log(requestData);
    return requestData;   
};

RBI.LoginRequestHelper = function () {
    this.authTemplate = null;

	var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {    // IE 5/6
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.open("GET", RBI.Config.authIDMXmlRequestFilePath, false);
    xhttp.send(null);
    this.authTemplate = xhttp.responseText;
    if (this.authTemplate.indexOf("$authInfo") == -1) {
    	throw new Error("LoginRequestHelper(): Cannot load authTemplate. Check RBI.Config.authIDMXmlRequestFilePath");
    };
};

RBI.LoginRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/soap+xml; charset=utf-8") {
        return this.getRequestAsXML(request);
    }
    //if (contentType == "application/json") {
    //    return JSON.stringify(request);
    //}
    return request;
};

RBI.LoginRequestHelper.prototype.getRequestAsXML = function (request) {
    var authTemplate = this.authTemplate;
    var timestampId = UUID.generate();
    var messageId = UUID.generate();
    var tokenId = UUID.generate();
    var date = new Date();
    var createdISODate = date.toISOString();
    date.setUTCMinutes(date.getUTCMinutes() + 5);
    var expireISODate = date.toISOString();
    // we are putting this into a JSON so it can be used by a string lib to replace named patterns
    var authInfo = { messageId: messageId, mustUnderstand: RBI.Config.loginUrl, created: createdISODate, expires: expireISODate };
    authTemplate = authTemplate.replace("$authInfo.messageId", authInfo.messageId);
    authTemplate = authTemplate.replace("$authInfo.mustUnderstand", authInfo.mustUnderstand);
    authTemplate = authTemplate.replace("$authInfo.tokenId", tokenId);
    authTemplate = authTemplate.replace("$authInfo.username", request.username);
    authTemplate = authTemplate.replace("$authInfo.password", request.password);
    authTemplate = authTemplate.replace("$authInfo.endpoint", RBI.Config.SSOConfig.wtrealm);
    if (request.isPIIAccepted()) {
        authTemplate = authTemplate.replace("$authInfo.ppiacceptance", request.isPIIAccepted());
    } else {
        authTemplate = authTemplate.replace("$authInfo.ppiacceptance", false);
    }
    
    //$s(authTemplate.$s());

//    console.log(authTemplate);
    return authTemplate;
};

/*
 * Helper class to convert a request as JSON in post 
 *
 * @author Kevin Clark   monster910@hotmail.com
 */
RBI.DirectJSONRequestHelper = function () {

};

RBI.DirectJSONRequestHelper.prototype.getRequestData = function (request, contentType) {
    if (contentType === "application/soap+xml; charset=utf-8") {
        return this.getRequestAsXML(request);
    }
    return request.params ? JSON.stringify(request.params) : JSON.stringify(request);
};

RBI.DirectJSONRequestHelper.prototype.getRequestAsXML = function (request) {
    throw new Error("Not implemented");
};

RBI.SecurityServiceConfig = function () {
    //URL: RBI.Config.proxyBase + "/rbproxy/api/CreateSession"
    this.setConfig([
		{ Name: "createOLSession", URL: RBI.Config.olBase, Protocol: "POST", ContentType: "application/soap+xml; charset=utf-8", Helper: new RBI.CreateSessionRequestHelper() },
		{ Name: "createSession", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/CreateSession", Protocol: "POST", ContentType: "application/soap+xml; charset=utf-8", Helper: new RBI.CreateSessionRequestHelper(), ErrorHandler: new RBI.ProxyErrorHandler() },
		{ Name: "logout", URL: RBI.Config.proxyBaseSecure + "/rbproxy/logout", Protocol: "POST", ContentType: "application/json", Helper: new RBI.DirectJSONRequestHelper() },
		
		{ Name: "getGrantTokenForRBOAuth", URL: RBI.Config.olBase, Protocol: "POST", ContentType: "application/soap+xml; charset=utf-8", Helper: new RBI.GetGrantTokenForRBOAuthRequestHelper() },		
		{ Name: "getOpenAPIToken", URL: RBI.Config.proxyBaseSecure + "/rbproxy/secureapi/GetOpenAPIOAuthToken", Protocol: "POST", ContentType: "application/json", Helper: null },
		
		{ Name: "getSTSToken", URL: RBI.Config.loginUrl2, Protocol: "POST", ContentType: "application/soap+xml; charset=utf-8", Helper: new RBI.LoginRequestHelper() },
		{ Name: "stsErrorTranslate", URL: RBI.Config.loginErrorTranslate, Protocol: "POST", ContentType: "application/soap+xml; charset=utf-8", Helper: null },
		{ Name: "getFSTSToken", URL: RBI.Config.issueTokenUrl2, Protocol: "POST", ContentType: "application/soap+xml; charset=utf-8", Helper: null },
		
		
        { Name: "createXBOXSession", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/CreateXBOXSession", Protocol: "POST", ContentType: "application/json", Helper: new RBI.DirectJSONRequestHelper() },
	    { Name: "linkXBOXAccount", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/LinkAccount", Protocol: "POST", ContentType: "application/json", Helper: new RBI.DirectJSONRequestHelper() },
        { Name: "unlinkXBOXAccount", URL: RBI.Config.proxyBaseSecure + "/rbproxy/api/UnlinkAccount", Protocol: "POST", ContentType: "application/json", Helper: new RBI.DirectJSONRequestHelper() },
        
        { Name: "refreshAuthentication", URL: RBI.Config.proxyBaseSecure + "/rbproxy/refreshAuthentication", Protocol: "GET", ContentType: "application/json", Helper: null, ErrorHandler: new RBI.ProxyErrorHandler() }
        // logout is a direct url post. Does not require rbproxy
	]);
};

RBI.SecurityServiceConfig.prototype = new RBI.ServiceConfig();

/**
 * Create singleton of the security service. This service will
 * 1. createSession - this does not work for OL. NOT COMPLETE
 * 2. createXBOXSession - create a session on rbproxy given a MS XSTS token
 * 3. linkAccount - link an MS account with PCN 
 * 4. unlinkAccount - unlink a MS account from PCN
 * 5. login - DOES NOT WORK ON CORS ENFORCED BROWSERS. NOT COMPLETE
 * 6. loginSSO - directly calls IDM to get SAML token. Then calls ws fed authentication
 * 7. doLogout - logout a user from rbproxy
 * 
 * @author Kevin Clark   monster910@hotmail.com
 */
RBI.SecurityService = function () {
	if (RBI.SecurityService.prototype._singletonInstance) {
		return RBI.SecurityService.prototype._singletonInstance;
	}
	RBI.SecurityService.prototype._singletonInstance = this;
};

RBI.SecurityService.prototype = new RBI.BaseService();

//TODO: Pass transport as parameter.
RBI.SecurityService.prototype.init = function (config) {
    if (!(config instanceof RBI.ServiceConfig) && !(config.prototype instanceof RBI.ServiceConfig)) {
        throw new Error("config param must be of RBI.ServiceConfig type.");
    }
    this.initBase(config, new RBI.Transport());
};

/**
 * Create a OL session
 *
 * @param samlTokenResponse. A string of a response from the IDM that is an encrypted SAML token
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return 
 */
RBI.SecurityService.prototype.createOLSession = function (samlTokenResponse, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("createOLSession");
    //var data = requestData.Helper.getRequestData(samlTokenResponse, requestData.ContentType);
    var data = this.prepareRequest(samlTokenResponse, requestData);
    
    requestData.RequestOptions = new RBI.RequestOptions(false, true);
    var self = this;
    return this.sendRequest(data, requestData,
    	function (response) {
			console.log(response);
			if (successCallback) {
				return successCallback(response);
			}
			return response;
		},
		function (response) {
			console.log(response);
			if (failureCallback) {
				return failureCallback(response);
			}
			return self.transport.returnFailed(response);
		}
	);
};

/**
 * Create a RB proxy session
 *
 * @param samlTokenResponse. A string of a response from the IDM that is an encrypted SAML token
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return promise for the response
 */
RBI.SecurityService.prototype.createSession = function (request, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("createSession");
    var data = this.prepareRequest(request,requestData);

    requestData.RequestOptions = new RBI.RequestOptions(false, true);
    var self = this;
    return this.sendRequest(data, requestData, 
    	function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		},
		function (errorResponse) {
			if (requestData.ErrorHandler) {
		        errorResponse = requestData.ErrorHandler.getErrorObject(errorResponse);
		    }
			if (failureCallback) {
			    return failureCallback(errorResponse);
			}
			return self.transport.returnFailed(errorResponse);
		}
	);
};

/**
 * Logout of a RB proxy session
 *
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return Promise of the call
 */
RBI.SecurityService.prototype.logout = function (successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("logout");
    var data = null; // no data to send

    requestData.RequestOptions = new RBI.RequestOptions(false, true);
    requestData.forceIFrame = true;
    return this.sendRequest(data, requestData, 
    	function (response) {
			if (successCallback) {
				successCallback(response);
			}
			return response;
		},
		function (response) {
			var errorResponse = null;
		    if (requestData.ErrorHandler) {
		        errorResponse = requestData.ErrorHandler.getErrorObject(response);
		    }
			if (failureCallback) {
			    failureCallback(errorResponse);
                return errorResponse;
			}
			throw errorResponse;
		}
	);
};

/**
 * Create a RB proxy session
 *
 * @param samlTokenResponse. A string of a response from the IDM that is an encrypted SAML token
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return 
 */
RBI.SecurityService.prototype.testSecurity = function (request, successCallback, failureCallback) {    
	var requestData = this.config.getConfigByName("createSession");
	requestData.URL = RBI.Config.proxyBaseSecure + "/rbproxy/testSecurity";
	return this.sendRequest({},requestData,successCallback,failureCallback);
};

/**
 * Get the RBCore SAML token so we can use it to get OAuth
 *
 * @param samlTokenResponse. A string of a response from the IDM that is an encrypted SAML token
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return 
 */
RBI.SecurityService.prototype.getGrantTokenForRBOAuth = function (samlTokenResponse, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("getGrantTokenForRBOAuth");
    var data = requestData.Helper.getRequestData(samlTokenResponse, requestData.ContentType);

    requestData.RequestOptions = new RBI.RequestOptions(false, true);
    var self = this;
    return this.sendRequest(data, requestData, 
    	function (response) {
			if (successCallback) {
				return successCallback(response);
			}
			return response;
		},
		function (response) {
			if (failureCallback) {
			    return failureCallback(response);
			}
			return self.transport.returnFailed(response);
		}
	);
};
/**
 * This will extract a claim based on the claimName from a SAML assertion
 * @param claimName the name of the claim in the assertion
 * @param assertion the SAML assertion
 * @return String the value of the claim or null
 */
RBI.SecurityService.prototype.getClaimValueFromAssertion = function (claimName, assertion) {
	var i = assertion.lastIndexOf(claimName);
	var remainderStr = assertion.substring(i+claimName.length+1, assertion.length);
	var endValueIndex = remainderStr.indexOf("</AttributeValue>");
	var value = remainderStr.substring("<AttributeValue>".length+1,endValueIndex);
	console.log(value);
	return value;
};

/**
 * Check the token to see if it is expired
 * 
 */
RBI.SecurityService.prototype.isExpired = function(oauthToken) {
	var ts = new Date().getTime();
	return (oauthToken.timestamp + oauthToken.expires_in * 1) < ts;
};

/**
 * Can we use the cached token if any exists
 *
 * @param oauthTokenRequest used to check cached token pcn match
 * @return boolean - true if we can use the token
 */
RBI.SecurityService.prototype.canUseCachedToken = function (oauthTokenRequest) {
	if (oauthToken && this.isExpired(oauthToken)) {
		// if expired clear it
		oauthToken = null;
		return false;
	}
	// if PCN matches return it
	if (oauthToken && oauthToken.pcn == oauthTokenRequest.getPCN()) {
		return true;
	}
	return false;
};

/**
 * Save token in cache
 */
RBI.SecurityService.prototype.cacheToken = function (aToken, pcn) {
	oauthToken = JSON.parse(aToken);
	oauthToken.pcn = pcn;
	oauthToken.timestamp = new Date().getTime();
};

/**
 * Get the RBCore Oauth Token
 *
 * @param oauthTokenRequest. Includes an assertion and deviceType used to determine application id and client secret id
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return 
 */
RBI.SecurityService.prototype.getOpenAPIToken = function (oauthTokenRequest, successCallback, failureCallback) {
	if (this.canUseCachedToken(oauthTokenRequest)) {
		return this.transport.wrap(oauthToken);
	}
    var requestData = this.config.getConfigByName("getOpenAPIToken");
    var data = this.prepareRequest(oauthTokenRequest, requestData);

    var self = this;
    requestData.RequestOptions = new RBI.RequestOptions(false, true);
    return this.sendRequest(data, requestData,
    	function (response) {
			self.cacheToken(response.Token, oauthTokenRequest.getPCN());	// save current token
			if (successCallback) {
				return successCallback(response);
			}
			return response;
		},
		function (response) {
			if (failureCallback) {
			    return failureCallback(response);
			}
			return self.transport.returnFailed(response);
		}
	);
};

/**
 * Login user
 * 
 * The call sequence is as follows
 * 
 * 1. This will call IDM directly using ws-trust and get a SAML token
 * 	1a. If successful, then no PII acceptance is required. Goto step 2
 *  1b. If failed, the result is not encrypted and we get the error code. If PII error, invoke the 
 *  	piiFailureCallback
 * 2. We then encode the username and password in a SAML UsernameToken claim. Then base64 encode that
 * 3. Then we call 
 *
 * @param loginRequest. See LoginRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @param piiFailureCallBack is the callback function to invoke on Pii failure
 * @return none
*/
RBI.SecurityService.prototype.login = function (loginRequest, successCallback, failureCallback, piiFailureCallBack) {
    var self = this;

    var getSAMLTokenSuccess = function(idmResponse){
        self.createOLSession(idmResponse.AuthResponse, successCallback, failureCallback);
    };

    var getSAMLTokenFailure = function(data){
        if (data.response && data.response.indexOf(RBI.Config.PII_IDM_ErrorCode) !== -1) {
            //PII need to be accepted
            piiFailureCallBack();
        } else {
            failureCallback(data);
        }
    };

    this.getSAMLToken(loginRequest,getSAMLTokenSuccess,getSAMLTokenFailure);
};

/**
 * Create an XBOX session by passing XML (XBOX Live) token to service
 *
 * @param sessionRequest. See CreateXBOXSessionRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return result if the call
 */
RBI.SecurityService.prototype.createXBOXSession = function (sessionRequest, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("createXBOXSession");
    var data = this.prepareRequest(sessionRequest, requestData);

    var transportSuccessCallBack = function (response) {
        if (successCallback) {
            return successCallback(response);
        }
        return response;
    };

    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        if (failureCallback) {
            return failureCallback(response);
        }
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

/**
 * Link an xbox account based on what is in token to a PCN. The token is encrypted and signed.
 * The server side will validate, decrypt and establish a relationship
 *
 * @param sessionRequest. See LinkAccountRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return result if the call
 */
RBI.SecurityService.prototype.linkXBOXAccount = function (linkRequest, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("linkXBOXAccount");
    var data = this.prepareRequest(linkRequest, requestData);

    var transportSuccessCallBack = function (response) {
        if (successCallback) {
            return successCallback(response);
        }
        return response;
    };

    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        if (failureCallback) {
            return failureCallback(response);
        }
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

/**
 * Unlink an xbox account based PCN. Based on the session the PCN will be 
 * determined on the server. We are going to call this with a token in case some 
 * future requirements want to unlink by device id or user id
 *
 * @param sessionRequest. See LinkAccountRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return result if the call
 */
RBI.SecurityService.prototype.unlinkXBOXAccount = function (linkRequest, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("unlinkXBOXAccount");
    var data = this.prepareRequest(linkRequest, requestData);

    var transportSuccessCallBack = function (response) {
        if (successCallback) {
            return successCallback(response);
        }
        return response;
    };

    var transportFailureCallBack = function (response) {
        //Error Handling on the API Response
        if (requestData.ErrorHandler) {
            response = requestData.ErrorHandler.getErrorObject(response);
        }
        console.log(response);
        if (failureCallback) {
            return failureCallback(response);
        }
        return response;
    };

    return this.sendRequest(data, requestData, transportSuccessCallBack, transportFailureCallBack);
};

/**
 * Get WS-Trust SAML Token from IDM or RBProxy. This will contain info including PII needed to correctly
 * complete a signup/login workflow. If the call is successful, the user already agreed to PII.
 * If the call fails, then the error code is parsed to determine error. One error is that PII has 
 * not been accepted.
 *
 * @param loginRequest. See LoginRequest object
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return
 */
/*
RBI.SecurityService.prototype.getSAMLToken = function (loginRequest, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("getSTSToken");
    var data = requestData.Helper.getRequestData(loginRequest, requestData.ContentType);

    var getSuccessResponse = function (response) {
        var idmResponse = response;     // response assumed json. If XML from IDM direct, then wrap in json
        if (!response.ResultInfo) {
            idmResponse = { "AuthResponse": response };
        }
        return idmResponse;
    };

    var getFailedResponse = function (response) {
        var idmResponse = response;     // response assumed json. If XML from IDM direct, then wrap in json
        if (!response.ResultInfo && response.indexOf("ResultInfo") == -1) {
            idmResponse = { "AuthResponse": response };
        }
        return idmResponse;
    };
    
    var self = this;
    var transportOptions = {};
    transportOptions.xhrFields={};
    transportOptions.xhrFields.withCredentials = false;
    return this.transport.put(
        requestData.URL,
        data,
        requestData.ContentType,
        transportOptions,
        function (response) {
            var idmResponse = getSuccessResponse(response);
            if (successCallback) {
            	return successCallback(idmResponse);
            }
            return idmResponse;
        },
        // response is raw response object from transport
        function (response) {
            var idmResponse = getFailedResponse(self.transport.getResponseData(response));
            if (failureCallback) {
                return failureCallback(idmResponse);
            }
            return self.transport.returnFailed(idmResponse);
        }
    );
};
*/

RBI.SecurityService.prototype.getSAMLToken = function (loginRequest, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("getSTSToken");
    var data = requestData.Helper.getRequestData(loginRequest, requestData.ContentType);

    var self = this;

    var getIdmResponse = function (response) {
        var idmResponse;
        // TODO - why is Angular in this code. There should be no reason for this. The check should be if content type is not json
        if (RBI.AngularTransport && (self.transport instanceof RBI.AngularTransport) || requestData.ContentType.indexOf("json") === -1) {
            idmResponse = response;
        }
        else {
            idmResponse = response.responseText;
            if (!idmResponse) {
                idmResponse = xhr.responseText;
            }
        }
        return idmResponse;
    };
    
    var xhr = this.transport.put(
        requestData.URL,
        data,
        requestData.ContentType,
        null,
        function (response) {
            var idmResponse = getIdmResponse(response);
            if (successCallback) {
            	successCallback(idmResponse);
            }
            return idmResponse;
        },
        function (response, status) {
            // TODO - error handling on failure of call to IDM
            console.log(response);
            var idmResponse = getIdmResponse(response);
            if (failureCallback) {
                failureCallback(idmResponse);
                return idmResponse;
            }
            return idmResponse;
        }
    );
    return xhr;
};


/**
 * Takes a WS-Security SOAP payload and will parse it and translated into standard error message
 * with helpId. If the "data" argument sent is already a JSON object and matches format from RBProxy
 * then just return it.
 *
 * @param data a response returned from the call to IDM or RBProxy
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return
 */
/*
RBI.SecurityService.prototype.getSAMLErrorResponse = function (data, successCallback, failureCallback) {
	
    var requestData = this.config.getConfigByName("stsErrorTranslate");
    
    var transportOptions = {};
    transportOptions.xhrFields={};
    transportOptions.xhrFields.withCredentials = false;
    return this.transport.put(
        requestData.URL,
        data,
        requestData.ContentType,
        transportOptions
    );
}; */

RBI.SecurityService.prototype.getSAMLErrorResponse = function (data, successCallback, failureCallback) {
	try {
		var json = JSON.parse(data.responseText);
		// if ResultInfo them comes from rbproxy
		if (json.ResultInfo) {
			if (successCallback) {
				return successCallback(json);
			}
			return json;			
		}

	} catch (error) {
		// JSON was not passed so continue to send the result to server for parsing
	}
	
    var requestData = this.config.getConfigByName("stsErrorTranslate");
    
    var getResponse = function (response) {
        var proxyResponse = response.responseText;
        if (!proxyResponse) {
            proxyResponse = xhr.responseText;
        }
        return proxyResponse;
    };
    var xhr = this.transport.put(
        requestData.URL,
        data,
        requestData.ContentType,
        null,
        function (response) {
            var proxyResponse = getResponse(response);
            if (successCallback) {
                successCallback(proxyResponse);
            } else {
                return proxyResponse;
            }
        },
        function (response) {
            // jquery - response will be jxhr
            console.log(response);
            var proxyResponse = getResponse(response);
            if (failureCallback) {
                failureCallback(proxyResponse);
            } else {
                return proxyResponse;
            }
        }
    );
    return xhr;
};



/**
 * Takes a WS-Security encrypted token and sends to token issuer to get decrypted token
 *
 * @param data a raw token to place in body of request
 * @param successCallback is the callback function to invoke on success
 * @param failureCallback is the callback function to invoke on failure
 * @return promise for the action
 */
RBI.SecurityService.prototype.fstsIssueToken = function (data, successCallback, failureCallback) {
    var requestData = this.config.getConfigByName("getFSTSToken");
    
    var getResponse = function (response) {
        var proxyResponse = response.responseText;
        if (!proxyResponse) {
            proxyResponse = xhr.responseText;
        }
        return proxyResponse;
    };
    var self = this;
    var xhr = this.transport.put(
        requestData.URL + "?transactionAccessPoint="+RBI.PlatformConfig.transactionAccessPointOL,
        data,
        requestData.ContentType,
        null,
        function (response) {
            var proxyResponse = getResponse(response);
            if (successCallback) {
                return successCallback(proxyResponse);
            }
            return proxyResponse;
        },
        function (response) {
            console.log(response);
            if (failureCallback) {
                return failureCallback(getResponse(response));
            }
            return self.transport.returnFailed(response);
        }
    );
    return xhr;
};

/** 
 * Private method used to generate a SSO token which is POSTed to the federated auth
 * @see RBI.Config.SSOConfig which is the WS-Security post.
 */
RBI.SecurityService.prototype.getSSOEncodedTokenString = function ( username,password) {
    var encodedUsername = username.encodeHTML();
    var encodedPassword = password.encodeHTML();
    var xmlUserTokenString = '<UsernameToken xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" Id=\"uuid-bb8b6cad-bed6-4fe6-b9a8-8345676cab4e-1\" xmlns=\"http://docs.oasis-open.org/ws-sx/ws-trust/200512\">' +
	'<Username>' + encodedUsername + '</Username>' +
	'<Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">' + encodedPassword + '</Password>' +
	'</UsernameToken>';
    return Base64.encode(xmlUserTokenString);
};

/**
 * 
 * @param loginRequest
 * @param piiCheckValidatedCallBack
 */
RBI.SecurityService.prototype.validatePiiCheck = function (loginRequest, piiCheckValidatedCallBack) {

    var SAMLTokenCheckIDMSuccess = function (data) {
        piiCheckValidatedCallBack(true, '');
    };
/*
    var SAMLTokenCheckIDMFailure = function (data) {
        if (data && data.responseText && data.responseText.indexOf(RBI.Config.PII_IDM_ErrorCode) != -1) {
            //PII need to be accepted
            piiCheckValidatedCallBack(false, '');
        } else {
            piiCheckValidatedCallBack(true, data);
        }
    }; */

    var SAMLTokenCheckIDMFailure = function (responseText) {
        if (responseText && responseText.indexOf(RBI.Config.PII_IDM_ErrorCode) != -1) {
            //PII need to be accepted
            piiCheckValidatedCallBack(false, '');
        } else {
            piiCheckValidatedCallBack(true, responseText);
        }
    };

    // Enable - Disable the PII check
    if(RBI.PlatformConfig.piiCheck){
        this.getSAMLToken(loginRequest, SAMLTokenCheckIDMSuccess, SAMLTokenCheckIDMFailure);
    }else{
        piiCheckValidatedCallBack(true, '');
    }

};


/**
 * Login SSO - Against RBProxy
 * 
 * The call sequence is as follows
 * 
 * 1. This will call IDM and get a SAML token
 * 	1a. If successful, then no PII acceptance is required. Goto step 2
 *  1b. If failed, the result is not encrypted and we get the error code. If PII error, invoke the 
 *  	piiFailureCallback
 * 2. We then encode the username and password in a SAML UsernameToken claim. Then base64 encode that
 * 3. Then we POST to passive authentication 
 * 
 * 
 * @param loginRequest  - Login request object that contains username and password
 * @param successCbk  - successful callback after SSO login
 * @param failureCbk  - failure callback after SSO login
 * @param frameName - Name of the iFrame you want to add to DOM (Default it is generating a iframeName with prefix "secureIFrame")
 * @param framePath - Path Name of the html file that will be used as IFRAME (Default it is "pages/secureCallFrame.html")
 */
RBI.SecurityService.prototype.loginSSO = function (loginRequest, successCbk, failureCbk, frameName, framePath) {
    var self = this;
    var piiCheckValidatedCallBack = function (piiAccepted, errorResponse) {
        if (piiAccepted) {
            if (errorResponse != '') {
                //var errorMessage = errorResponse.response.substring(errorResponse.response.indexOf("<Message>") + 9, errorResponse.response.indexOf("</Message>"));
                //var errorCode = errorResponse.response.substring(errorResponse.response.indexOf("<Code>") + 6, errorResponse.response.indexOf("</Code>"));

                var errorMessage = errorResponse.substring(errorResponse.indexOf("<Message>") + 9, errorResponse.indexOf("</Message>"));
                var errorCode = errorResponse.substring(errorResponse.indexOf("<Code>") + 6, errorResponse.indexOf("</Code>"));
                var error = { "responseText": errorMessage, "status": errorCode };
                var errorHandler = new RBI.ProxyErrorHandler();
                var dataObject = errorHandler.getErrorObject(error);
                failureCbk(dataObject);
            }
            else {
                var encodedCredentials = self.getSSOEncodedTokenString(loginRequest.username, loginRequest.password);

                var ssoJson = RBI.Config.SSOConfig;
                var formAction = ssoJson.action + "?wa=" + ssoJson.wa + "&whr=" + ssoJson.whr + "&wtrealm=" + ssoJson.wtrealm +
                    "&wct=" + ssoJson.wct + "&wreply=" + ssoJson.wreply + "&wctx=pr=" + ssoJson.wctx.pr + "%26rm=" + ssoJson.wctx.rm +
                    "%26ry=" + ssoJson.wctx.ry + "%26cx=" + ssoJson.wctx.cx;
                var returnEvent = function (data) {
                    if (data.data.status === 'success') {
                        successCbk(data);
                    } else {
                        var errorHandler = new RBI.ProxyErrorHandler();
                        var dataObject = errorHandler.getErrorObject(data.data.result);
                        failureCbk(dataObject);
                    }
                };

                self.createSecureFrame(function (secureProxyParent) {
                    secureProxyParent.removeEventListener();
                    secureProxyParent.addEventListener(returnEvent);
                    secureProxyParent.post({ 'action': 'ssologin', 'ssousernametoken': encodedCredentials, 'formaction': formAction });
                }, frameName, framePath);
            }
        } else {
            failureCbk(RBI.Config.PIIAcceptanceRequired);
        }
    };
    this.validatePiiCheck(loginRequest, piiCheckValidatedCallBack);

};


/**
 * Login SSO - Against RBProxy with no PII
 * 
 * The call sequence is as follows
 * 
 * 1. We then encode the username and password in a SAML UsernameToken claim. Then base64 encode that
 * 2. Then we POST to passive authentication 
 * 
 * 
 * @param loginRequest  - Login request object that contains username and password
 * @param successCbk  - successful callback after SSO login
 * @param failureCbk  - failure callback after SSO login
 * @param frameName - Name of the iFrame you want to add to DOM (Default it is generating a iframeName with prefix "secureIFrame")
 * @param framePath - Path Name of the html file that will be used as IFRAME (Default it is "pages/secureCallFrame.html")
 */
RBI.SecurityService.prototype.loginSSONoPII = function (loginRequest, successCbk, failureCbk, frameName, framePath) {

    var encodedCredentials = this.getSSOEncodedTokenString(loginRequest.username, loginRequest.password);

    var ssoJson = RBI.Config.SSOConfig;
    
    ssoJson.action =  RBI.Config.proxyBaseSecure + "/rbproxy/wsfed/issue";
    
    var formAction = ssoJson.action + "?wa=" + ssoJson.wa + "&whr=" + ssoJson.whr + "&wtrealm=" + ssoJson.wtrealm +
        "&wct=" + ssoJson.wct + "&wreply=" + ssoJson.wreply + "&wctx=pr=" + ssoJson.wctx.pr + "%26rm=" + ssoJson.wctx.rm +
        "%26ry=" + ssoJson.wctx.ry + "%26cx=" + ssoJson.wctx.cx;
    var returnEvent = function (data) {
        if (data.data.status === 'success') {
            successCbk(data);
        } else {
            var errorHandler = new RBI.ProxyErrorHandler();
            var dataObject = errorHandler.getErrorObject(data.data.result);
            failureCbk(dataObject);
        }
    };
 	
    this.createSecureFrame(function (secureProxyParent) {
        secureProxyParent.removeEventListener();
        secureProxyParent.addEventListener(returnEvent);
        secureProxyParent.post({ 'action': 'ssologin', 'ssousernametoken': encodedCredentials, 'formaction': formAction });
    }, frameName, framePath);

};

/**
 * Logout  - Against RBProxy using WS-FED logout
 * 
 * @param successCbk - callback after logout happened successfully
 * @param failureCbk - callback after logout failure
 * @param frameName - Name of the iFrame you want to add to DOM (Default it is generating a iframeName with prefix "secureIFrame")
 * @param framePath - Path Name of the html file that will be used as IFRAME (Default it is "pages/secureCallFrame.html")
 */
RBI.SecurityService.prototype.doLogout = function (successCbk,failureCbk,frameName,framePath){
    var logoutJson = RBI.Config.LogoutConfig;
    var returnEvent = function(data){
           if(data.data.status === 'success'){
               successCbk(data);
           }else{
               failureCbk(data);
           }
    };

    this.createSecureFrame(function(secureProxyParent){
        secureProxyParent.removeEventListener();
        secureProxyParent.addEventListener(returnEvent);
        secureProxyParent.post({'action': 'logout', 'logoutJson': logoutJson,'formaction': logoutJson.action});
    },frameName,framePath);


};

///**
// * Request a WSTrust token from an identity provider
// * 
// * @param loginRequest - Login request object that contains username and password
// * @param successCbk - callback after logout happened successfully
// * @param failureCbk - callback after logout failure
// * 
// * @author Kevin Clark (monster910@hotmail.com)
// */
//RBI.SecurityService.prototype.requestWsTrustToken = function(loginRequest, successCbk, failureCbk) {
//	var url = RBI.Config.loginUrl2;
//	var encodedCredentials = this.getSSOEncodedTokenString(loginRequest.username, loginRequest.password);
//	var data = {"usernametoken":encodedCredentials};
//
//	var postToIDM = function(url, data, successCbk, failureCbk) {
//		$.ajax({
//			"type" : "POST", 
//			"context" : this,
//			"url" : url, 
//			"data" : data, 
//			"xhrFields" : {}, 
//			"contentType" : "application/x-www-form-urlencoded",
//			"success" : function(result) {
//				console.log(result);
//				alert("success");
//			}, "error" : function(result) {
//				console.log(result);
//				alert("error");
//			}
//		});
//	};
//	postToIDM(url, data, successCbk, failureCbk);
//};

/**
 * Checks if user is authenticated and restores session by RBDigiA cookie.
 * <UL>
 * <LI> If user is logged in and there is user session on server - the call just
 * returns status 200.
 * <LI> If server session expired but user has valid RBDigiA cookie - server
 * restores user session and returns status 200.
 * <LI> Otherwice (there is user session on server and there is no valid RBDigiB
 * cookie), 401 will be returned.
 * </UL>
 * 
 * @param successCbk
 * @param failureCbk
 */
RBI.SecurityService.prototype.refreshAuthentication = function (successCbk, failureCbk) {
    var requestData = this.getRequestData("refreshAuthentication");
    //Send with  WithCredentials true options
    requestData.RequestOptions = new RBI.RequestOptions(false,true);
    
    this.sendRequest(null, requestData, function() {
        return true;
    }, function() {
        return false;
    });


};


}());
(function initUserService() {
	"use strict";

RBI.UserService = function () {
	if (RBI.UserService.prototype._singletonInstance) {
		return RBI.UserService.prototype._singletonInstance;
	}
	RBI.UserService.prototype._singletonInstance = this;
    this.userProfile = new RBI.UserProfile(null, null);
};

RBI.UserService.prototype.getUserProfile = function () {
    return this.userProfile;
};

RBI.UserService.prototype.setUserProfile = function (aUserProfile) {
    this.userProfile = aUserProfile;
};
}());


// RBI CommonJS, version: 1.5

(function initAngularTransport() {
    "use strict";

    RBI.AngularTransport = function () {

    };

    RBI.AngularTransport.prototype.createDeferred = function () {
        return this.promiseProvider ? this.promiseProvider.defer() : null;
    };

    RBI.AngularTransport.prototype.resolveDeferred = function (deferred, values) {
        return deferred.resolve(values);
    };

    RBI.AngularTransport.prototype.deferredToPromise = function (deferred) {
        return deferred.promise;
    };

    RBI.AngularTransport.prototype.setPromiseProvider = function ($q) {
        this.promiseProvider = $q;
    };

    RBI.AngularTransport.prototype.setAngularHttp = function (http) {
        this.http = http;
    };

    var latestRequestId = 0;
    function getNextRequestId() {
        var nowMilliseconds = new Date().getTime();
        if (latestRequestId < nowMilliseconds) {
            latestRequestId = nowMilliseconds;
        } else {
            latestRequestId++;
        }

        return latestRequestId;
    }

    function decorateThen(promise) {
        var originalThen = promise.then;
        promise.then = function() {
            var newPromise = originalThen.apply(promise, arguments);
            newPromise.cancel = promise.cancel;
            newPromise.requestId = promise.requestId;
            decorateThen(newPromise);
            return newPromise;
        };
    }

    function wrapHttpResponse(responseHttpObject, successCallback, errorCallback, canceler, promiseProvider) {
        var deferWrapper = promiseProvider.defer();
        responseHttpObject.then(function (response) {
                if (!angular.isUndefined(response)) {
                    deferWrapper.resolve(successCallback(response.data));
                }
            }, function (response) {
                if (response.status !== 0) {
                    deferWrapper.reject(errorCallback(response));
                }
            }
        );
        deferWrapper.promise.cancel = function () {
            canceler.resolve('Cancelled event for $http.timeout');
        };
        deferWrapper.promise.requestId = getNextRequestId();
        decorateThen(deferWrapper.promise);
        return deferWrapper.promise;
    }

RBI.AngularTransport.prototype.get = function (url, data, contentType, options, successCallback, errorCallback) {
    options = options || {};

        var finalUrl = url;
        if (data) {
            finalUrl = url + "?" + serializeUrl(data);
        }

    if (RBI.Config.debug) {
        console.log("Request url: " + finalUrl);
    }

        var useCredentials = options.xhrFields && options.xhrFields.withCredentials;

    var canceler = this.promiseProvider ? this.promiseProvider.defer() : null;
    var responseHttpObject = this.http({
        method: 'GET',
        url: finalUrl,
        cache:!options.noCache,
        headers: {'Content-Type':contentType},
        withCredentials: useCredentials,
        timeout: 30000
    });
    //if (canceler) {
   //     return wrapHttpResponse(responseHttpObject, successCallback, errorCallback, canceler, this.promiseProvider);
   /// }
    return responseHttpObject.then(function(response) {
	    	if (RBI.Config.debug) {
				console.log("Transport Get (" + finalUrl + ") Success Result->" + JSON.stringify(response.data));
			}
            return successCallback(response.data);
        }, function(response){
        	if (RBI.Config.debug) {
    			console.log("Transport Get (" + finalUrl + ") Failure Result-> status: " + response.status + ", data: " + JSON.stringify(response.data));
    		}
    		//if (response.status !== 0) {  // we need to call error callback so that app can recover from the error
                return errorCallback(response);
//            }
        }
    );
};

RBI.AngularTransport.prototype.put = function (url, data, contentType, options, successCallback, errorCallback) {
    options = options || {};

        if (options.noCache) {
            url = RBI.Transport.getTimeStampedUrl(url);
        }

        var useCredentials = true;
        if (options.xhrFields && !options.xhrFields.withCredentials) {
            useCredentials = false;
        }

        if (!options.type) {
            options.type = "POST";
        }

    if (RBI.Config.debug) {
        console.log("Request url:" + url);
        console.log("Request data:" + data);
    }

    var canceler = this.promiseProvider ? this.promiseProvider.defer() : null;
    var responseHttpObject = this.http({
        method: options.type,
        url: url,
        data: data,
        headers: {'Content-Type': contentType},
        withCredentials: useCredentials,
        timeout: 30000
    });
//    if (canceler) {
//        return wrapHttpResponse(responseHttpObject, successCallback, errorCallback, canceler, this.promiseProvider);
//    }
    return responseHttpObject.then(function(response) {
    		if (RBI.Config.debug) {
    			console.log("Transport Put (" + url + ") Success Result->" + JSON.stringify(response.data));
    		}
            return successCallback(response.data);
        }, function(response){
        	if (RBI.Config.debug) {
    			console.log("Transport Put (" + url + ") Failure Result-> status: " + response.status + ", data: " + JSON.stringify(response.data));
    		}
            // The if check has been disabled b/c it was causing issues when the response failed with a status code 0 (ZOE-35331)
            //if (response.status !== 0) {
            //TODO: discuss w. Kevin
            if (errorCallback) {
               return errorCallback(response);
            } else {
                return response;
            }
            //}
        }
    );
};

    RBI.AngularTransport.prototype.wrap = function(value) {
        var deferred = this.createDeferred();
        deferred.resolve(value);
        return deferred.promise;
    };


    RBI.AngularTransport.prototype.returnFailed = function(response) {
        return response;
    };

// In the application you would execute the following to set the singleton.
    RBI.Transport.prototype = new RBI.AngularTransport();
}());

/*
// RBI CommonJS, version: 2.0

    (function initAngularTransport() {
        "use strict";

// TODO - Yehor - this class needs more doc
        RBI.AngularTransport = function () {

        };

        RBI.AngularTransport.prototype.createDeferred = function () {
            return this.promiseProvider ? this.promiseProvider.defer() : null;
        };

        RBI.AngularTransport.prototype.resolveDeferred = function (deferred, values) {
            return deferred.resolve(values);
        };

        RBI.AngularTransport.prototype.deferredToPromise = function (deferred) {
            return deferred.promise;
        };

        RBI.AngularTransport.prototype.setPromiseProvider = function ($q) {
            this.promiseProvider = $q;
        };

        RBI.AngularTransport.prototype.setAngularHttp = function (http) {
            this.http = http;
        };

        var latestRequestId = 0;
        // TODO - Yehor need doc
        function getNextRequestId() {
            var nowMilliseconds = new Date().getTime();
            if (latestRequestId < nowMilliseconds) {
                latestRequestId = nowMilliseconds;
            } else {
                latestRequestId++;
            }

            return latestRequestId;
        }

        // TODO - Yehor need doc
        function decorateThen(promise) {
            var originalThen = promise.then;
            promise.then = function() {
                var newPromise = originalThen.apply(promise, arguments);
                newPromise.cancel = promise.cancel;
                newPromise.requestId = promise.requestId;
                decorateThen(newPromise);
                return newPromise;
            };
        }
        // TODO - Yehor need doc
        function wrapHttpResponse(responseHttpObject, canceler, promiseProvider, successCallback, errorCallback) {
            var deferWrapper = promiseProvider.defer();
            responseHttpObject.then(function (response) {
                    if (RBI.Config.debug) {
                        console.log("Transport "+response.config.method+" (" + response.config.url + ") Success Result->" + JSON.stringify(response.data));
                    }
                    if (!angular.isUndefined(response)) {
                        if (successCallback) {
                            deferWrapper.resolve(successCallback(response.data));
                        } else {
                            deferWrapper.resolve(response.data);
                        }
                    }
                }, function (response) {
                    if (RBI.Config.debug) {
                        console.log("Transport "+response.config.method+" (" + response.config.url + ") Failure Result->" + JSON.stringify(response.data));
                    }
//	    		var finalResult = response;
//	    		if (response.headers("Content-Type").indexOf("application/json") != -1) {
//	    			finalResult = response.data;
//	    		}
                    // return raw response on error
                    if (response.status !== 0) {
                        if (errorCallback) {
                            deferWrapper.reject(errorCallback(response));
                        } else {
                            deferWrapper.reject(response);
                        }
                    }
                }
            );
            deferWrapper.promise.cancel = function () {
                canceler.resolve('Cancelled event for $http.timeout');
            };
            deferWrapper.promise.requestId = getNextRequestId();
            decorateThen(deferWrapper.promise);
            return deferWrapper.promise;
        }


        RBI.AngularTransport.prototype.get = function (url, data, contentType, options, successCallback, errorCallback) {
            options = options || {};

            var finalUrl = url;
            if (data) {
                finalUrl = url + "?" + serializeUrl(data);
            }

            var useCredentials = options.xhrFields && options.xhrFields.withCredentials;

            var canceler = this.promiseProvider ? this.promiseProvider.defer() : null;
            var responseHttpObject = this.http({
                method: 'GET',
                url: finalUrl,
                cache:true,
                headers: {'Content-Type':contentType},
                withCredentials: useCredentials,
                timeout: canceler ? canceler.promise : null
            });
            if (canceler) {
                return wrapHttpResponse(responseHttpObject, canceler, this.promiseProvider, successCallback, errorCallback);
            }
            return responseHttpObject.then(function(response) {
                    if (RBI.Config.debug) {
                        console.log("Transport Get (" + finalUrl + ") Success Result->" + JSON.stringify(response.data));
                    }
                    if (successCallback) {
                        return successCallback(response.data);
                    }
                    return response.data;
                }, function(response){
                    if (RBI.Config.debug) {
                        console.log("Transport Get (" + finalUrl + ") Failure Result->" + JSON.stringify(response.data));
                    }
                    if (response.status !== 0) {
                        if (errorCallback) {
                            return errorCallback(response);
                        }
                        return response;
                    }
                }
            );
        };

        RBI.AngularTransport.prototype.put = function (url, data, contentType, options, successCallback, errorCallback) {
            options = options || {};

            if (options.noCache) {
                url = RBI.Transport.getTimeStampedUrl(url);
            }

            var useCredentials = true;
            if (options.xhrFields && !options.xhrFields.withCredentials) {
                useCredentials = false;
            }

            if (!options.type) {
                options.type = "POST";
            }

            var canceler = this.promiseProvider ? this.promiseProvider.defer() : null;
            var responseHttpObject = this.http({
                method: options.type,
                url: url,
                data: data,
                headers: {'Content-Type': contentType},
                withCredentials: useCredentials,
                timeout: canceler ? canceler.promise : null
            });
            if (canceler) {
                return wrapHttpResponse(responseHttpObject, canceler, this.promiseProvider, successCallback, errorCallback);
            }
            // TODO - Yehor - document when this return is here bs the wrapped
            // for success return the data object. For failure return the raw response.
            // @see getResponseData which returns the data result
            return responseHttpObject.then(function(response) {
                    if (RBI.Config.debug) {

                        console.log("Transport Put (" + url + ") Success Result->" + JSON.stringify(response.data));
                    }
                    if (successCallback) {
                        return successCallback(response.data);
                    }
                    return response.data;
                }, function(response){
                    if (RBI.Config.debug) {
                        console.log("Transport Put (" + url + ") Failure Result->" + JSON.stringify(response.data));
                    }
                    if (response.status !== 0) {
                        if (errorCallback) {
                            return errorCallback(response);
                        } else {
                            return response;
                        }
                    }
                }
            );
        };

        RBI.AngularTransport.prototype.returnFailed = function(response) {
            return response;
        };

        RBI.AngularTransport.prototype.getResponseData = function(rawResponse) {
            return rawResponse.data;
        };

        RBI.AngularTransport.prototype.wrap = function(value) {
            var deferred = this.createDeferred();
            deferred.resolve(value);
            return deferred.promise;
        };

// In the application you would execute the following to set the singleton.
        RBI.Transport.prototype = new RBI.AngularTransport();
    }());
*/