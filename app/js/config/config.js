//FileName:config.js
var Environment={
    SIT:"SIT",
    STG:"STG",
    PROD:"PROD",
    DIT:"DIT"
};
var config = {
	BingMapsKey: "Aj2nlkctieuPuo_Qr0BpYyxIcO9c4eGplJUqrarxMx6tp4ccvERHZZRc3b_sqlSm",
    BingUrl: "http://dev.virtualearth.net/REST/v1/Locations",
    environment: Environment.STG,
    appVersion: "2.0.30",
    SPINNER_FADEOUT_MS: 1000,
    spinnerPosition: { x: 630, y: 350 },
	encryptionKey: '770A8A65DA156D24EE2A093277530142',
    debug: false,
    urlToVerifyOnline: "../keepalive.htm",
    numberOfPostersInTopInGenres:20,
    numberOfSuggestions:20,
    useHTTPS:false // off until we can test on SSL in SIT
};

// ZOE 30079 - Allow logging in non-prod environments
config.debug = (config.environment == Environment.PROD)? false:true;

var menuLocationMap = ['/home', '/browse/Movie', '/myredbox/dashboard', '/search', '/locations', '/account'];

// global variables needed for outside scopes. To be moved into an architected place in s3
var backPaths = ['/home']; // initial root for back button
var backPathsSign=[];      // Back paths need to be empty
var mainMenuMap = { curr: 0, last: 0, on: 0 }; // menu highlight switching (replacing CurrentLevelIndex tracking, so view locations are not affected)
