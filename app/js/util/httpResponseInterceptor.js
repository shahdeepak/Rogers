/**
 * Ajax interceptor
 * @author  Sandip Nirmal
 *
 * Intercepts all ajax request, and handles spinner functionality based on requests.
 * It also logs requests and responses.
 */
// Array for all XHR calls
var xhrCallStack = [];
// Jquery ajax send
$(document).ajaxSend(function(e, xhr, settings) {
    settings.startTime = e.timeStamp;
    //show spinner
    showSpinner(settings.url);
    // Log all requests to console on debug mode
    if (config.debug) {
        helper.debugLog("Request started at : " + moment(settings.startTime).format("YYYY-MM-DD:hh:mm:ss"));
        helper.debugLog("Request URL: " + settings.url);
        helper.debugLog("Request Type: " + settings.type);
    }
}).ajaxComplete(function(e, xhr, settings) {
    var endTime = moment(e.timeStamp);
    // Log all responses to console on debug mode
    if (config.debug) {
        helper.debugLog("Request Completed at : " + endTime.format("YYYY-MM-DD:hh:mm:ss"));
        helper.debugLog("Request URL: " + settings.url);
        helper.debugLog("Request Completed in :" + endTime.diff(settings.startTime) + " millisecond");
        helper.debugLog("Ready State :" + xhr.readyState);
        helper.debugLog("statusText :" + xhr.statusText);
        helper.debugLog("Status Code :" + xhr.status);
    }
    // hide spinner
    hideSpinner(settings.url, xhr.status);
    // Log all errors to logstash
    if (config.isServerLogsEnabled && (xhr.status > 400 && (settings.url.indexOf(config.serverLogsURL) === -1))) {
    }
});
/**
 * @ngdoc object
 * @name  httpResponseInterceptor
 * @description Helper to live tv guide and Mini Epg guide
 */
/**
 * @ngdoc method
 * @name httpResponseInterceptor:trackXmlHttpRequest
 * @methodOf httpResponseInterceptor
 * @param {Number} state - state of xmlHttpRequest
 * @param {Number} status - xhr status
 * @param {string} url - url of xmlhttp request
 * @description Tracks the xmlHttpRequest states
 */
function trackXmlHttpRequest(state, status, url) {
    'use strict';
    switch (state) {
        case 0:
            //request not initialized       
        case 2:
            // request received
        case 3:
            // processing request
            break;
         case 1:
            // server connection established
            showSpinner(url);
            break;
        case 4:
            // request finished and response is ready
            hideSpinner(url, status);
            break;
        default:
            helper.debugLog("default");
            break;
    }
}
/**
 * @ngdoc method
 * @name httpResponseInterceptor:showSpinner
 * @methodOf httpResponseInterceptor
 * @param {string} url - xmlHttpRequest
 * @description displays spinner for xmlHttpRequest progress
 */
function showSpinner(url) {
    var showSpinner = true;
    for (var index in spinnerConfig) {
        (url.indexOf(spinnerConfig[index]) !== -1) && (showSpinner = false);
    }
    // Start spinner on request start
    showSpinner && xhrCallStack.push(url);
    // Show Spinner only if there is ajax request in progress
    (xhrCallStack.length > 0) && $("#spinner").css('display', 'block');
}
/**
 * @ngdoc method
 * @name httpResponseInterceptor:hideSpinner
 * @methodOf httpResponseInterceptor
 * @param {string} url - xmlHttpRequest url
 * @param {Number} status - xhr status
 * @description hides spinner once xmlHttpRequest progress completes
 */
function hideSpinner(url, status) {
    var unauthorised = false;
    // Check for http response status and unauthorisedConfig
    if (status === 401) {
        unauthorised = true;
        for (var index in unauthorisedConfig) {
            (url.indexOf(unauthorisedConfig[index]) !== -1) && (unauthorised = false);
        }
    }
    // If unauthorised start login flow again
    if (unauthorised) {
        $("#spinner").css('display', 'none');
        xhrCallStack = [];
        helper.reLogin();
    } else {
        var hideSpinner = true;
        for (var index in spinnerConfig) {
            (url.indexOf(spinnerConfig[index]) !== -1) && (hideSpinner = false);
        }
        // Stop spinner on request complete
        hideSpinner && xhrCallStack.splice(xhrCallStack.indexOf(url), 1);
        // hide spinner if no request in progress
        (xhrCallStack.length === 0) && $("#spinner").css('display', 'none');
    }
}