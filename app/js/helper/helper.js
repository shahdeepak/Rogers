/**
 * @ngdoc object
 * @name  Helper
 */
var xhttp;
var helper = {
    watchers: function () {
        'use strict';
        var root = angular.element(document.getElementsByTagName('body'));

        function getElemWatchers(element) {
            var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
            var scopeWatchers = getWatchersFromScope(element.data().$scope);
            var watchers = scopeWatchers.concat(isolateWatchers);
            angular.forEach(element.children(), function (childElement) {
                watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
            });
            return watchers;
        }

        function getWatchersFromScope(scope) {
            if (scope) {
                return scope.$$watchers || [];
            } else {
                return [];
            }
        }

        return getElemWatchers(root);
    },
    /**
     * @ngdoc method
     * @name Helper:debugLog
     * @methodOf Helper
     * @param {string} logData - Data
     * @description Logs the logData to browser console
     */
    debugLog: function (logData) {
        if (config.environment !== Environment.PROD) {
            try {
                console.log(JSON.stringify(logData));
            } catch (a) {
                console.log(a);
                console.log(logData);
            }
        }
    },
    /**
     *
     * @ngdoc method
     * @name Helper:redirectToSSP
     * @methodOf Helper
     * @description redirects to SSP.
     *
     */
    redirectToSSP: function (url) {
        var win = window.open(url, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Broswer has blocked it
        }
    },
    /**
     *
     * @ngdoc method
     * @name Helper:singlePinEntryPopup
     * @methodOf Helper
     * @description for setting flag for single pin entry popup.
     *
     */
    singlePinEntryPopup: function (popup) {
        popup.updatePin = false;
        popup.showButton = false;
        return popup;
    },
    /**
     *
     * @ngdoc method
     * @name Helper:setDataToLocal
     * @methodOf Helper
     * @param {string} key - Key
     * @param {string} val - Value
     * @description Set item to the  Local Storage using key/value pairs
     *
     */
    setDataToLocal: function (key, val) {
        if (typeof val !== "string") {
            localStorage.setItem(key, JSON.stringify(val));
        } else {
            localStorage.setItem(key, val);
        }
    },
    /**
     * @returns current page name
     * @param  path - path
     */
    getPageName: function (path) {
        var pageName;
        if (isDefined(path)) {
            var splitUrl;
            if (path.indexOf("/") !== -1) {
                splitUrl = path.split("/");
            }
            pageName = splitUrl[1];
            if (pageName === "LiveTv") {
                pageName = "Guide";
            } else if (path === "Home") {
                pageName = path;
            }
        }
        return pageName;
    },
    /**
     * @returns return menu name
     * @param  path - path
     */
    getMenuName: function (path) {
        var menuName;
        if (isDefined(path)) {
            var splitUrl;
            if (path.indexOf("/") !== -1) {
                splitUrl = path.split("/");
            }
            menuName = splitUrl[1];
            if (path === "Home") {
                menuName = path;
            } else if (menuName === "LiveTv") {
                menuName = "Guide";
            }
        }
        return menuName;
    },
    /**
     * @returns Sub menu name
     * @param  path - path
     */
    getSubMenuName: function (path) {
        var subMenuName;
        if (isDefined(path)) {
            var splitUrl;
            if (path.indexOf("/") !== -1) {
                splitUrl = path.split("/");
            }
            if (path === "Home") {
                subMenuName = "";
            } else {
                subMenuName = splitUrl[2];
            }
        }
        return subMenuName;
    },
    /**
     * @ngdoc method
     * @name Helper:getDataFromLocal
     * @methodOf Helper
     * @param {string} key - Key
     * @description Return item Key to get the Data from Local Storage
     */
    getDataFromLocal: function (key) {
        var value; // value to be return from localStorage

        // This is a temporary logic to fix javascript integer precision handling
        // issue where 17 digit number is getting converted, so converting to
        // number in case of HHID
        if (key === "HHID") {
            (value = localStorage.getItem(key));
        } else {
            try {
                value = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                value = localStorage.getItem(key);
            }
        }
        return value;
    },
    /**
     *
     * @ngdoc method
     * @name Helper:addListener
     * @methodOf Helper
     * @param {string} key - Key
     * @param {string} keyDown - keyDown Object
     * @description add listner to window for scroll
     *
     */
    addListener: function (key, keyDown) {
        window.addEventListener(key, keyDown, false);
    },
    /**
     * @ngdoc method
     * @name Helper:removeListener
     * @methodOf Helper
     * @param {string} key - Key
     * @param {string} keyDown - keyDown Object
     * @description remove listener
     */
    removeListener: function (key, keyDown) {
        window.removeEventListener(key, keyDown, false);
    },
    /**
     * @ngdoc method
     * @name Helper:removeDataFromLocal
     * @methodOf Helper
     * @param {string} key - Key
     * @description Remove item Key from the Data from Local Storage
     */
    removeDataFromLocal: function (key) {
        return localStorage.removeItem(key);
    },
    /**
     * @ngdoc method
     * @name Helper:isPlayerPluginInstalled
     * @methodOf Helper
     * @returns {boolean} status of VisualOn plugin
     * @description Looks for VisualOn plugin installed or not.
     */
    isPlayerPluginInstalled: function () {
        var plugins = navigator.plugins;
        var os = platformHelper.getPlatformDetails().os;
        var reg = /npvoBrowserPlugin/i;
        if (os === 'win') {
            reg = /npvoBrowserPlugin/i;
        } else if (os === 'mac') {
            reg = /VisualOn/i;
        }
        for (var i in plugins) {
            var reg_val = reg.test(plugins[i].description);
            if (reg_val) {
                return true;
            }
        }
        return false;
    },
    /**
     *
     * @ngdoc method
     * @name Helper:getDeviceUniqueId
     * @methodOf Helper
     * @return {Integer} Device unique identifier
     * @description Tries to get device id from localStorage if already stored,
     * if not it will try to get it using VisualOn plugin if it installed.
     */
    getDeviceUniqueId: function () {
        // Check for VisualOn plugin installed or not
        console.log("this.isPlayerPluginInstalled() :" + this.isPlayerPluginInstalled());
        if (this.isPlayerPluginInstalled()) {
            if (isDefined(helper.getDataFromLocal(LS_UNIQUE_DEVICE_ID)) && isDefined(helper.getDataFromLocal(VO_VERSION))) {
                config.setDeviceId(helper.getDataFromLocal(LS_UNIQUE_DEVICE_ID));
                return helper.getDataFromLocal(LS_UNIQUE_DEVICE_ID);
            } else {
                // Create new object
                var pluginObj = document.createElement("object");
                pluginObj.setAttribute("id", 'VisualOn');
                pluginObj.setAttribute("type", "application/x-visualon-osmp");
                pluginObj.style.visibility = "hidden";
                var contentWrapper = document.getElementById("contentWrapper");
                contentWrapper.appendChild(pluginObj);
                var counter = 0;
                while (counter <= 3) {
                    try {
                        var voplayer = new VOCommonPlayer(pluginObj);
                        voplayer.init(voOSMPType.VO_OSMP_PLAYER_ENGINE.VO_OSMP_VOME2_PLAYER, '');
                        voplayer.setDRMLibrary(strDRMLibName, strDRMApiName);
                        var uniqueDeviceId = voplayer.getDRMUniqueIdentifier();
                        localStorage.setItem(VO_VERSION, voplayer.getVersion(voOSMPType.VO_OSMP_MODULE_TYPE.VO_OSMP_MODULE_TYPE_SDK));
                        //  RTV-4374  Blocked Plugin flow is not working as expected
                        if (uniqueDeviceId) {
                            config.setDeviceId(uniqueDeviceId);
                            helper.setDataToLocal(LS_UNIQUE_DEVICE_ID, uniqueDeviceId);
                            if ($('#contentWrapper').find(pluginObj).length > 0) {
                                contentWrapper.removeChild(pluginObj);
                            }
                            if (config.log) {
                                config.log(uniqueDeviceId);
                            }
                            return uniqueDeviceId;
                        }
                    } catch (e) {
                        if (counter > 2) {
                            this.setDataToLocal('PLUGIN_BLOCKED', true);
                            document.location = "#/PluginBlocked";
                        }
                    }
                    counter++;
                }
                // Remove VisualOn Object from app
                contentWrapper.removeChild(pluginObj);
            }
        } else {
            this.setDataToLocal('PLUGIN_REQUIRED', true);
            document.location = "#/PluginRequired";
        }
    },
    /**
     * @ngdoc method
     * @name Helper:applyChanges
     * @methodOf Helper
     * @param {Object} scope - controller where we want to apply changes
     * @description Apply changes to controller entity
     */
    applyChanges: function (scope) {
        if (!(scope.$$phase || (scope.$root && scope.$root.$$phase))) {
            scope.$apply();
        }
    },
    /**
     * Install plugin pop up.
     */
    installPlugin: function () {
        var os = platformHelper.getPlatformDetails().os;
        var pluginUrl;
        if (os === "win") {
            pluginUrl = applications[0].attributes['com.uxpsystems.mint.videos.webconsole.player.vcas.download.pc'];
        } else if (os === "mac") {
            pluginUrl = applications[0].attributes['com.uxpsystems.mint.videos.webconsole.player.vcas.download.mac'];
        }
        window.open(pluginUrl, "_self");
    },
    /**
     * Dismiss install plugin pop up and close the tab.
     */
    dismiss: function () {
        $('#plugin_popUp_overlay').css('display', 'none');
    },
    /**
     * @ngdoc method
     * @name Helper:getBlockedChannels
     * @methodOf Helper
     * @param {Object} channelList - all channels Data
     * @returns {Object} Channel object by adding blocked property
     * @description Checks for all blocked channels Id's and change ChannelsData Object by
     * adding blocked property to blocked channels.
     */
    getBlockedChannels: function (channelList) {
        //blocked channel array
        var blockedChannels = helper.getDataFromLocal(LS_BLOCKED_CHANNELS) || [];
        // check for blocked channels
        for (var i in channelList) {
            if (blockedChannels.indexOf(channelList[i].id) !== -1) {
                channelList[i].isBlocked = true;
            } else {
                channelList[i].isBlocked = false;
            }
        }
        return channelList;
    },
    /**
     * @ngdoc method
     * @name Helper:getDeviceLocation
     * @methodOf Helper
     * @returns {Object} Location Object containing device's current latitude
     * longitude position
     * @description Tries to fetch Device location using GeoLocation API
     */
    getDeviceLocation: function (callback) {
        var location = {};
        if (location.latitude && location.longitude) {
            callback(location);
        } else {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    location.latitude = position.coords.latitude;
                    location.longitude = position.coords.longitude;
                    callback(location);
                }, function (err) {
                    // Error Fetching device Location
                    helper.debugLog(err);
                });
            } else {
                // Error Fetching device Location
                helper.debugLog("Error fetching device location");
            }
        }
    },
    /**
     * @ngdoc method
     * @name Helper:isPCRated
     * @methodOf Helper
     * @param {Object} ratings - System Ratings i.e. AGVOT ratings
     * @param {Number} programRating - program's rating id
     * @returns {Boolean} Check for parental Control ratings against the program ratings
     * @description Validates the current device level parental Control ratings against the program ratings
     */
    isPCRated: function (ratings, programRating) {
        if (isDefined(this.getDataFromLocal(LS_PARENTAL_CTRL))) {
            for (var i in ratings) {
                if ((ratings[i].id === programRating) &&
                    (isDefined(helper.getDataFromLocal(LS_PARENTAL_CTRL_INDEX)) &&
                        parentalControl[this.getDataFromLocal(LS_PARENTAL_CTRL_INDEX)].maxAge <= ratings[i].ageEquivalence)) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * @ngdoc method
     * @name Helper:getTImeStamp
     * @methodOf Helper
     * @param {Number} diff - difference in minutes with current time
     * @returns {Number} timestamp - timestamp of time calculated after adding or subtracting diff
     * @description Returns the timestamp in milliseconds by adding/subtracting
     * time specified by diff parameter. If diff is a negative value then it will
     * return timestamp for already passed time.
     */
    getTimeStamp: function (diff) {
        return isDefined(Date.now()) ? Date.now() + (diff * 1000) :
            new Date().getTime() + (diff * 1000);
    },
    /**
     * @ngdoc method
     * @name Helper:isColdStartDone
     * @methodOf Helper
     * @returns {Boolean} Cold strat status for device
     * @description Returns status of cold start on device
     */
    isColdStartDone: function () {
        return this.getBoolean(this.getDataFromLocal(LS_COLDSTART_DONE));
    },
    /**
     * @ngdoc method
     * @name Helper:scrollTop
     * @methodOf Helper
     * @description it  scrolls to top of the window
     */
    scrollTop: function () {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
    },

    getPrevPageName: function (current) {
        var pageName;
        //In production change the check for #
        if (isDefined(current) && current.indexOf("#") !== -1) {
            var url = current.split("#")[1];
            if (isDefined(url) && url.indexOf("/") !== -1) {
                pageName = url.split("/")[1];
            }
        } else {
            pageName = "";
        }
        return pageName;
    },

    /**
     * Returns the name of next page
     * @param next
     * @returns {*}
     */
    getNextPageName: function (next) {
        var nextPage;
        // In production change the check for #
        if (isDefined(next) && next.indexOf("#") !== -1) {
            var url = next.split("#")[1];
            if (isDefined(url) && url.indexOf("/") !== -1) {
                nextPage = url.split("/")[1];
            }
        } else {
            nextPage = "";
        }
        return nextPage;
    },

    /**
     * Returns name of secondary:tertiary menu
     * @param current
     * @param next
     * @returns {string}
     */
    getSecTertiaryPageName: function (current, next) {
        var secondaryMenuName;
        var tertiaryMenuName;
        if (isDefined(current) && current.indexOf("#") !== -1) {
            var url = current.split("#")[1];
            if (isDefined(url) && url.indexOf("/") !== -1) {
                secondaryMenuName = url.split("/")[2];
            }
        }
        if (isDefined(next) && next.indexOf("#") !== -1) {
            var url = next.split("#")[1];
            if (isDefined(url) && url.indexOf("/") !== -1) {
                tertiaryMenuName = decodeURIComponent(url.split("/")[3]);
            }

        }
        return secondaryMenuName + ":" + tertiaryMenuName;
    },
    /**
     * @ngdoc method
     * @name Helper:setMomentLang
     * @methodOf Helper
     * @description it  sets the lang of moment (date library)
     */
    setMomentLang: function (lang) {
        lang === LANG_ENG ? moment.lang('en') : moment.lang('fr');
    },
    /**
     * @ngdoc method
     * @name Helper:globalNavigateChannel
     * @methodOf Helper
     * @description handle channel navigation globally
     */
    globalNavigateChannel: function () {
        return "Movies/Channels/";
    },
    /**
     * @ngdoc method
     * @name Helper:getBoolean
     * @methodOf Helper
     * @description Return boolean value for passed value
     */
    getBoolean: function (value) {
        try {
            return Boolean(JSON.parse(value));
        } catch (e) {
            return false;
        }
    },
    /**
     * @ngdoc method
     * @name Helper:getXml
     * @methodOf Helper
     * @param {string} xmlUrl - url for xml file
     * @param {function} success -success
     * @returns {string}  retirn xmldoc
     * @description Get XMl file from URL and xml tags
     .
     */
    getXml: function (xmlUrl, success) {
        loadXMLDoc(xmlUrl, function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                success(xhttp.responseText);
            }
        });
    },
    /**
     * @ngdoc method
     * @name Helper:getIPAddress
     * @methodOf Helper
     * @description Return Ip address stored locally if any
     */
    getIPAddress: function () {
        return (this.getDataFromLocal(IPAddress) ? this.getDataFromLocal(IPAddress) : false);
    },
    /**
     * @ngdoc method
     * @name Helper:getHHID
     * @methodOf Helper
     * @description Return HHID stored locally if any
     */
    getHHID: function () {
        return (this.getDataFromLocal(HHID) ? this.getDataFromLocal(HHID) : false);
    },
    /**
     * @ngdoc method
     * @name Helper:removeBookarmsFromLocal
     * @methodOf Helper
     * @description remove boomarks for aall stored VOD assets
     .
     */
    removeBookarmsFromLocal: function () {
        var bookmarkedAssetArray = helper.getDataFromLocal(VOD_BOOKMARKED_KEY);
        if (isDefined(bookmarkedAssetArray)) {
            for (var index = 0; index < bookmarkedAssetArray.length; index++) {
                helper.removeDataFromLocal(bookmarkedAssetArray[index]);
            }
            helper.removeDataFromLocal(VOD_BOOKMARKED_KEY);
        }
    },
    /**
     * @ngdoc method
     * @name Helper:getLiveBadges
     * @methodOf Helper
     * @description returs object of badges related to live
     */
    getLiveBadges: function (startDateTime, endDateTime, duration) {
        var obj = {};
        var comp;
        var currentTime = moment().utc();
        var within_hour = moment().utc().add(BADGE_NEXT_HOUR, 'h');
        var next_day = moment().utc().add(BADGE_NEXT_DAY, 'd');
        var next2next_day = moment().utc().add(BADGE_TOMORROW, 'd');
        var next_7_days = moment().utc().add(BADGE_NEXT_SEVEN_DAY, 'd');
        if ((currentTime.isSame(startDateTime) || moment(startDateTime).isAfter(currentTime)) && (currentTime.isSame(startDateTime) || moment(endDateTime).isBefore(currentTime))) {
            comp = moment().utc().diff(startDateTime);
            obj.percent = parseInt(comp / (duration * 600));
            obj.percentHide = true;
            obj.isOnNow = true;
            obj.label = 'GUIDE_SCHEDULE_LABEL_ON_NOW';
            obj.class = 'badge-on-now';
            return obj;
        } else if (moment(startDateTime).isAfter(currentTime) && moment(startDateTime).isBefore(within_hour)) {
            obj.label = 'GUIDE_SCHEDULE_LABEL_ON_SOON';
            obj.class = 'badge-on-soon';
            return obj;
        } else if (moment(startDateTime).isAfter(within_hour) && moment(startDateTime).isBefore(next_day)) {
            obj.label = 'GUIDE_SCHEDULE_LABEL_ON_LATER';
            obj.time = moment(startDateTime).format('hh:00 a');
            obj.class = 'badge-on-soon';
            return obj;
        } else if ((next_day.isSame(startDateTime) || moment(startDateTime).isAfter(next_day)) && moment(startDateTime).isBefore(next2next_day)) {
            obj.label = 'GUIDE_SCHEDULE_LABEL_ON_TOMORROW';
            obj.class = 'badge-on-soon';
            return obj;
        } else if ((moment(startDateTime).isSame(next2next_day) || moment(startDateTime).isAfter(next2next_day)) && (next_7_days.isSame(startDateTime) || moment(startDateTime).isBefore(next_7_days))) {
            obj.label = 'GUIDE_SCHEDULE_LABEL_ON_DAY';
            obj.class = 'badge-on-soon';
            obj.day = moment(startDateTime).format("dddd");
            return obj;
        }
    },
    /**
     * @ngdoc method
     * @name Helper:setTimer
     * @methodOf Helper
     * @param {Number} val - Value
     * @description Set time out
     */
    setTimer: function (val) {
        setTimeout(function () {
            config.canCloseL1 = true;
        }, val);
    },

    /**
     *
     * @ngdoc method
     * @name rogersWeb.controllers:vodNewCtrl#appendContents
     * @methodOf rogersWeb.controllers:vodNewCtrl
     * @description Returns push data one by one need for pagination list
     */
    appendContents: function (oldData, newData) {
        var i, latest = newData.concat();
        for (i = 0; i < latest.length; i++) {
            oldData.push(latest[i]);
        }
        return oldData;
    },
    /**
     * @ngdoc method
     * @name Helper:setSavedNotifications
     * @methodOf Helper
     * @param {Number} rootScope - Value
     * @description Set time out
     */
    getSavedNotifications: function (rootScope) {
        return rootScope.rentedNotifications + rootScope.recordingsNotifications;
    },
    /**
     * @ngdoc method
     * @name Helper:setTimer
     * @methodOf Helper
     * @param {Number} rootScope - Value
     * @description Set time out
     */
    setSavedNotifications: function (rootScope, flag, value) {
        var localStorageKey, localStorageNotificationValue = '';
        if (flag === 'recordings') {
            localStorageKey = 'LS_RECORDINGS_NOTIFICATIONS';
            (!isDefined(value) || value === '') ? rootScope.recordingsNotifications += 1 : rootScope.recordingsNotifications = value;
            localStorageNotificationValue = rootScope.recordingsNotifications;
        } else if (flag === 'rented') {
            localStorageKey = 'LS_RENTED_NOTIFICATIONS';
            (!isDefined(value) || value === '') ? rootScope.rentedNotifications += 1 : rootScope.rentedNotifications = value;
            localStorageNotificationValue = rootScope.rentedNotifications;
        }
        helper.setDataToLocal(localStorageKey, localStorageNotificationValue);
        rootScope.savedNotifications = helper.getSavedNotifications(rootScope) || DEFAULT_INDEX;
    },
    setProperties: function (systemProperties) {
        for (var i = 0, len = systemProperties.length; i < len; i++) {
            var property = systemProperties[i];
            var localStorageKey;
            if (property.name === 'rogers.img.vodPosterURLprefix') {
                localStorageKey = LS_VOD_PREFIX;
            } else if ((property.name === 'rogers.img.svodPosterURLprefix)') || (property.name === 'ericsson.vod.svodPosterURLprefix')) {
                localStorageKey = LS_SVOD_PREFIX;
            } else if ((property.name === 'rogers.img.genrePostersURLprefix') || (property.name === 'ericsson.vod.genre.PostersURLprefix')) {
                localStorageKey = LS_GENRE_PREFIX;
            } else if (property.name === 'rogers.img.crewImageURLprefix') {
                localStorageKey = LS_CREW_PREFIX;
            } else if ((property.name === 'rogers.img.epgPosterURLprefix') || (property.name === 'ericsson.ltv.epgPosterURLprefix')) {
                localStorageKey = LS_EPG_PREFIX;
            }

            if ((isDefined(localStorageKey) && localStorageKey !== '') && ((property.value).substr(-1) !== '/')) {
                helper.setDataToLocal(localStorageKey, (property.value + '/'));
            } else {
                helper.setDataToLocal(localStorageKey, property.value);
            }
            localStorageKey = '';
        }
    }
};
/**
 *
 * @param dname
 * @param callback -callback
 */
function loadXMLDoc(dname, callback) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = callback;
    xhttp.open("GET", dname, false);
    xhttp.send();
}
/**
 * @ngdoc method
 * @name Helper:isDefined
 * @methodOf Helper
 * @param {Object} obj - object to be validated
 * @returns {Boolean} TO check Overlay div for Sub-Menu Click
 * @description To display Overlay div for Sub-Menu Click.
 */
function isDefined(obj) {
    return (typeof obj !== 'undefined' && obj !== null && obj !== 'null' && obj !== '' &&
        obj !== undefined && obj !== 'undefined');
}
/**
 * @ngdoc method
 * @name Helper:verifyPin
 * @methodOf Helper
 * @param {string} pin - pin to be verified
 * @returns {Boolean}  To verify Pin length
 * @description Checks if object is defined and its length in four digits
 */
function verifyPin(pin) {
    return (isDefined(pin) && (pin.length === 4));
}
/**
 * @ngdoc method
 * @name Helper:removeElement
 * @methodOf Helper
 * @param {Object} item - Element to be removed.
 * @returns {Integer} represents number of elements removed from Array
 * @description This method is used to remove element from an Array and compatible for Internet Explorer 9+, Firefox 4+, Chrome 5+, Safari 5+, and Opera 12+.
 */
Object.defineProperty(Array.prototype, "removeElement", {
    enumerable: false,
    value: function (item) {
        var removeCounter = 0;
        for (var index = 0; index < this.length; index++) {
            if (this[index] === item) {
                this.splice(index, 1);
                removeCounter++;
                index--;
            }
        }
        return removeCounter;
    }
});