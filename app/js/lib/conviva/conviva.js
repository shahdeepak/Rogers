/**
 *  Conviva.js
 *  
 *  Conviva Integration common code (all platforms)
 *  
 */

// Object for Storing Conviva Tags
var convivaTags = {
    contentId: '',
    productId: '',
    contentType: '',
    connectionType: '',
    genre: '',
    show: '',
    purchaseType: '',
    deliveryType: '',
    purchaseOptionId: '',
    environment: '',
    playerVersion: '',
    streamProtocol: '',
    customDeviceModel: ''
};


// Conviva tags for purchase type
var CONVIVA_TAG_SUBSCRIPTION = "Subscription";
var CONVIVA_TAG_BUY_SD = "Buy_SD";
var CONVIVA_TAG_BUY_HD = "Buy_HD";
var CONVIVA_TAG_RENT_SD = "Rent_SD";
var CONVIVA_TAG_RENT_HD = "Rent_HD";

var conviva = {
    // Prerequisites
    CUSTOMER_KEY: (config.environment.toLowerCase() == RBI.Config.Defines.PROD)? 'b3aff8512a16938cd8ef427f5771d93fedbac317':'e3ee5b08b8508ed9dd4422167417f40565f36c96',

    // References to the current sessionId and streamer
    sessionId: null,
    streamer: null,

    /**
     * Set the Conviva tags
     */
    setTags: function (titleData) {
        convivaTags.contentId = titleData.productId;
        convivaTags.productId = titleData.productId;
        convivaTags.purchaseOptionId = titleData.purchaseOptionId;
        convivaTags.contentType = titleData.contentType;
        convivaTags.connectionType = playerHelper.GetConnectionType();
        convivaTags.show = titleData.title;
        convivaTags.genre = "" + titleData.genre + ""; // not sure hwy we need empty strings here
        convivaTags.purchaseType = this.setPurchaseTypeTag(titleData.purchaseType);
        convivaTags.deliveryType = titleData.mediaFormat;
        convivaTags.streamProtocol = RBI.PlatformConfig.convivaStreamingProtocol;
        convivaTags.playerVersion = platformInfo.getPlatform() + '-' +platformInfo.getFirmware()+ '-' + config.appVersion;
        convivaTags.environment = "Console-" + ((config.environment == Environment.PROD)?"Prod":config.environment);
        
        // Add Custom Device Model name for Samsung
        if(helper.isDefined(RBI.PlatformConfig.customDeviceModelRequired) && RBI.PlatformConfig.customDeviceModelRequired){
        	convivaTags.customDeviceModel = platformInfo.getModelName();
        }
       
        helper.debugLog("Set conviva tags: " + JSON.stringify(convivaTags));
    },

    setPurchaseTypeTag: function (purchaseType) {
        var purchaseTypeTag = '';
        switch (purchaseType) {
            case BUY:
                purchaseTypeTag = CONVIVA_TAG_BUY_SD;
                break;
            case BUY_HD:
                purchaseTypeTag = CONVIVA_TAG_BUY_HD;
                break;
            case RENT:
                purchaseTypeTag = CONVIVA_TAG_RENT_SD;
                break;
            case RENT_HD:
                purchaseTypeTag = CONVIVA_TAG_RENT_HD;
                break;
            case SUBSCRIPTION:
                purchaseTypeTag = CONVIVA_TAG_SUBSCRIPTION;
                break;
        }
        return purchaseTypeTag;
    },


    /**
     * Creates the conviva monitoring session when videoPlayback Starts.
     *
     * @param assetData contains info of asset
     * @param url Streaming Url
     * @param player Player Object
     *
     */
    createSession: function (customerID, playbackUrl) {
        // Clean up previous session
        conviva.cleanUpSession();

        // assetName is combination of [ProductID][ProductType]Title
        var assetName = "[" + convivaTags.productId + "] [" + convivaTags.contentType + "] " + convivaTags.show;
        helper.debugLog("Conviva monitoring session starting for AssetName: " + assetName);
        helper.debugLog("Conviva tags are contentId: " + convivaTags.contentId +
            ", productId: " + convivaTags.productId +
            ", contentType: " + convivaTags.contentType +
            ", connectionType: " + convivaTags.connectionType +
            ", genre: " + convivaTags.genre +
            ", show: " + convivaTags.show +
            ", purchaseType: " + convivaTags.purchaseType +
            ", deliveryType: " + convivaTags.deliveryType +
            ", purchaseOptionId: " + convivaTags.purchaseOptionId +
            ", environment: " + convivaTags.environment +
            ", playerVersion: " + convivaTags.playerVersion +
            ", streamProtocol: " + convivaTags.streamProtocol +
            ", customDeviceModel: " + convivaTags.customDeviceModel +			
            ", viewerId: " + customerID);

        var convivaMetadata = new Conviva.ConvivaContentInfo(assetName, convivaTags);
        convivaMetadata.defaultReportingCdnName = Conviva.ConvivaContentInfo.CDN_NAME_VELOCIX;
        convivaMetadata.isLive = false; // automatic - not needed
        convivaMetadata.playerName = RBI.PlatformConfig.convivaPlayerName;
        convivaMetadata.viewerId = customerID;
        convivaMetadata.streamUrl = playbackUrl;
        helper.debugLog("Conviva metadata: " + JSON.stringify(convivaMetadata));

        playerHelper.CreateConvivaSession(convivaMetadata);
    },

    /**
     * Terminates the Conviva monitoring Session when Playback ends.
     */
    cleanUpSession: function () {
        if (conviva.sessionId != null) {
            Conviva.LivePass.cleanupSession(conviva.sessionId);
            conviva.sessionId = null;
            conviva.streamer = null;
        }
    }
};