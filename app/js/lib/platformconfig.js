(function initPlaystationConfig() {
  'use strict';
  if (!window.RBI) {
    window.RBI = {};
  }
  RBI.OmnitureRSID = {
	SIT:"rirbismsglgappdev",
	STG:"rirbismsglgappdev",
	DIT:"rirbismsglgappdev",
	PROD:"rirbinstanttenfoot"
  };
  RBI.PlatformConfig = {
    transactionAccessPoint: "JVPSAMSUNGGTW",
    transactionAccessPointOL: "JVPSAMSUNG",
    createSessionTransactionAccessPoint: "JVPSAMSUNG",
    forceTransactionAccessPoint: true,
    forceTransactionDeviceID: true,
    forceHttps: true,
	userReLogin: true,
    mixedMode: true,
    genericKeyboard: true,
    deviceId: platformInfo.getDeviceID(),
    transactionDeviceID: platformInfo.getTransactionDeviceID(),
    deviceType: 'Samsung',
    promotionsDeviceType: 'Samsung',
    deviceSpec: 'SAM_DEFAULT',
    deviceSpecSD: 'SAM_SD',
    previewTargetDevice: 'HLS_SM_HD,HLS_SM_SD',
    activateDevice: true,
    showGames: true,
    piiCheck: true,
    brand: 'Samsung',
    brandTM: '\u2122',
    deviceManufacturer: 'Samsung',
    saleChannel: 'SMSG:CE',
    speedTestEnabled: false,    // ZOE-30513: Removed speed test
    useLogoutTimer: true,
    menuAnimationTime:200,
    clientIdDIT: '93040871d531b12b5d892d19fec2e0fa',
    clientSecretDIT: 'd1223dc2166547aa',
    clientIdSIT: '93040871d531b12b5d892d19fec2e0fa',
    clientSecretSIT: 'd1223dc2166547aa',
    clientIdSTG: 'e1bf5fbab4d8058da3377dde23a268be',
    clientSecretSTG: '9e491083decec5f1',
    clientIdPROD: '11ae93360ee79f59bc0bc5e8c0b19675',
    clientSecretPROD: 'd989ebef9d64b9c9',
    securedIframePrefixName: 'secureIFrame',
    securedIframePath: 'app/secureCallFrame-playstation.html',
    securedProtocol: 'http',
    appPath: 'app/',
    emulatorPath: 'emulator/',
    authIDMXmlRequestFilePath: 'js/services/auth.xml',
    olXmlRequestFilePath: 'js/services/olTemplate.xml',
    isExitPopUpRequired: true,
	handlePipelineEvent: false,
    OmnitureTargetDevice: 'rbismsgapp',
    OmnitureEnabled: true,
    RSID: RBI.OmnitureRSID[config.environment],
    DRM_SERVER_URL : getDRMURL(),

    // Conviva
    convivaEnabled: true,
    convivaStreamingProtocol: 'HLS',
    convivaPlayerName: "Redbox Instant Samsung",
    customDeviceModelRequired: true,

    playbackResumeSupported: true,
    handleCaptionFromAccount: false,
    captionEditorEnabled: false,
    checkAppVersion: true
   // appVersion: '4.0'  // ZOE-35303 - App version needs to be configured as 4.0 to sync up with version number stored on server
  };
}());

//Get DRM SERVER URL depending on Environment
function getDRMURL(){
	if(config.environment == "STG"){
		return "https://api-stg.redboxinstant.com/esam/esamservice";
	}else if(config.environment == "SIT"){
		return "https://zoe-sit.verizon.net/esam/esamservice";
	}else if(config.environment == "DIT"){
		return "http://96.226.112.92:8082/esam/esamservice";
	}else if(config.environment == "PROD"){
		return "https://api.redboxinstant.com/esam/esamservice";
	}
}
