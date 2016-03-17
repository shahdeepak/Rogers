'use strict';

var rbi = angular.module('rbi', ['ui', 'ui.bootstrap','sharedServices']);
var HTTPS_RELATIVE_PATH =  config.useHTTPS ? 'https://' : 'http://';
var pathName = '';
var routeChangeTimeout = 0;
var deepLinking = false; // for deep linking

if(location.pathname.indexOf('index.html') && location.pathname.indexOf('index-debug.html') === -1)
{
    pathName = location.pathname.replace('index.html', '');
}
else
{
    pathName = location.pathname.replace('index-debug.html', '');
}

HTTPS_RELATIVE_PATH = HTTPS_RELATIVE_PATH + location.host + pathName;
var HTTP_RELATIVE_PATH = 'http://' + location.host + pathName;

//for the emulator fix
if(location.pathname.indexOf('start.html'))
{
    HTTP_RELATIVE_PATH='';
    HTTPS_RELATIVE_PATH = '';
}

function handleRouteChangeError($rootScope) {
    helper.hideSpinner(0);
    $(document).on();
    internetConnected = false;
    httpRequestInProgress = false;
    checkConnectionPrompts(KEY_CODES.X, $rootScope);
}



rbi.config(function ($routeProvider) {

    $routeProvider.when('/eula', { templateUrl: HTTP_RELATIVE_PATH + 'views/eula.html', controller: 'eulaCtrl' })
        .when('/index', { templateUrl: HTTP_RELATIVE_PATH + 'views/splash.html', controller: 'splashCtrl' })
        .when('/home', {templateUrl: HTTP_RELATIVE_PATH + 'views/home.html', controller: 'homeCtrl'})
        .when('/signUp', {templateUrl: HTTP_RELATIVE_PATH + 'views/signUp.html', controller: 'signupCtrl'})
        .when('/locations', {templateUrl: HTTP_RELATIVE_PATH + 'views/locations.html', controller: 'kioskCtrl'})
        .when('/locations/:productId/:purchaseOptionId', {templateUrl: HTTP_RELATIVE_PATH + 'views/locations.html', controller: 'kioskCtrl'})
        .when('/search', {templateUrl: HTTP_RELATIVE_PATH + 'views/search.html', controller: 'searchCtrl'})
        .when('/myredbox/bookmarks', {templateUrl: HTTP_RELATIVE_PATH + 'views/myRedbox/bookmarks.html', controller: 'bookmarksCtrl'})
        .when('/myredbox/purchases', {templateUrl: HTTP_RELATIVE_PATH + 'views/myRedbox/purchases.html', controller: 'purchasesCtrl'})
        .when('/myredbox/dashboard', { templateUrl: HTTP_RELATIVE_PATH + 'views/myRedbox/dashboard.html', controller: 'dashboardCtrl' })
        .when('/myredbox/watchhistory', {templateUrl: HTTP_RELATIVE_PATH + 'views/myRedbox/watchHistory.html', controller: 'watchHistoryCtrl'})
        .when('/browse/:productType', { templateUrl: HTTP_RELATIVE_PATH + 'views/browse.html', controllers: 'browseCtrl' })
        .when('/browse/:productType/:kioskId', { templateUrl: HTTP_RELATIVE_PATH + 'views/browse.html', controllers: 'browseCtrl' })
        .when('/browse/:productType/RentBuy/:filterItem', { templateUrl: HTTP_RELATIVE_PATH + 'views/browse.html', controllers: 'browseCtrl' })
        .when('/account', {templateUrl: HTTP_RELATIVE_PATH + 'views/account/summary.html', controller: 'summaryCtrl'})
        .when('/account/summary', {templateUrl: HTTP_RELATIVE_PATH + 'views/account/summary.html', controller: 'summaryCtrl'})
        .when('/account/creditCards', {templateUrl: HTTP_RELATIVE_PATH + 'views/account/creditCards.html', controller: 'creditCardsCtrl'})
        .when('/account/preferences', {templateUrl: HTTP_RELATIVE_PATH + 'views/account/preferences.html', controller: 'preferencesCtrl'})
        .when('/account/captionEditor', {templateUrl: HTTP_RELATIVE_PATH + 'views/account/captionEditor.html', controller: 'captionEditorCtrl'})
        .when('/createAccount', { templateUrl: HTTP_RELATIVE_PATH + 'views/createAccount.html', controller: 'createAccountCtrl' })
        //.when('/createAccount/:isExistingUser', { templateUrl: HTTP_RELATIVE_PATH + 'views/createAccount.html', controller: 'createAccountCtrl' })   // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
        .when('/freeTrial', { templateUrl: HTTP_RELATIVE_PATH + 'views/freeTrail.html', controller: 'freeTrialCtrl' })
        .when('/subscribeNoFreeTrial', { templateUrl: HTTP_RELATIVE_PATH + 'views/subscribeNoFreeTrial.html', controller: 'subscribeNoFreeTrialCtrl' })
		.when('/subscription', { templateUrl: HTTP_RELATIVE_PATH + 'views/subscription.html', controller: 'subscriptionCtrl' })
		.when('/confirmSubscription', { templateUrl: HTTP_RELATIVE_PATH + 'views/confirmSubscription.html', controller: 'confirmSubscriptionCtrl' })
        .when('/confirmSubscription/:productType', { templateUrl: HTTP_RELATIVE_PATH + 'views/confirmSubscription.html', controller: 'confirmSubscriptionCtrl' })
        .when('/player/:productId/:purchaseOptionId', {templateUrl: HTTP_RELATIVE_PATH + 'views/player.html', controller: 'playerCtrl'})
        .when('/player/:productId', {templateUrl: HTTP_RELATIVE_PATH + 'views/player.html', controller: 'playerCtrl'})
        .when('/preview/:productId', {templateUrl: HTTP_RELATIVE_PATH + 'views/player.html', controller: 'playerCtrl'})
        .when('/titleCollection/:productId', {templateUrl: HTTP_RELATIVE_PATH + 'views/titleCollection.html', controller: 'titleCollectionCtrl'})
        .when('/login', {templateUrl: HTTP_RELATIVE_PATH + 'views/login.html', controller: 'loginCtrl'})
        .when('/login/:returnURL1', { templateUrl: HTTP_RELATIVE_PATH + 'views/login.html', controller: 'loginCtrl' })
        .when('/login/:returnURL1/:returnURL2', { templateUrl: HTTP_RELATIVE_PATH + 'views/login.html', controller: 'loginCtrl' })
        .when('/login/:returnURL1/:returnURL2/:returnURL3', { templateUrl: HTTP_RELATIVE_PATH + 'views/login.html', controller: 'loginCtrl' })
        .when('/login/:returnURL1/:returnURL2/:returnURL3/:returnURL4', { templateUrl: HTTP_RELATIVE_PATH + 'views/login.html', controller: 'loginCtrl' })
        .when('/impNotice', {templateUrl: HTTP_RELATIVE_PATH + 'views/importantNotice.html', controller: 'impNoticeCtrl'})
        .when('/impNotice/:returnURL1', {templateUrl: HTTP_RELATIVE_PATH + 'views/importantNotice.html', controller: 'impNoticeCtrl'})
        .when('/impNotice/:returnURL1/:returnURL2', {templateUrl: HTTP_RELATIVE_PATH + 'views/importantNotice.html', controller: 'impNoticeCtrl'})
        .when('/impNotice/:returnURL1/:returnURL2/:returnURL3', {templateUrl: HTTP_RELATIVE_PATH + 'views/importantNotice.html', controller: 'impNoticeCtrl'})
        .when('/titledetail/:productID', { templateUrl: HTTP_RELATIVE_PATH + 'views/titleDetail.html', controller: 'titleDetailCtrl' })
        .when('/titledetail/:productID/:kioskID', { templateUrl: HTTP_RELATIVE_PATH + 'views/titleDetail.html', controller: 'titleDetailCtrl' })
        .when('/titledetail/:productID/:kioskID/:purchaseOptionId', { templateUrl: HTTP_RELATIVE_PATH + 'views/titleDetail.html', controller: 'titleDetailCtrl' })
        .when('/account/creditCards/cardDetails/:cardAction', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/cardDetails.html', controller: 'cardDetailsCtrl'})
        .when('/account/creditCards/cardDetails/:cardAction/:accountNo', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/cardDetails.html', controller: 'cardDetailsCtrl'})
        .when('/account/creditCards/cardDetails', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/cardDetails.html', controller: 'cardDetailsCtrl'})
        .when('/account/creditCards/billingInfo/:cardAction', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/billingInfo.html', controller: 'billingInfoCtrl'})
        .when('/account/creditCards/billingInfo/:cardAction/:accountNo', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/billingInfo.html', controller: 'billingInfoCtrl'})
        .when('/account/creditCards/billingInfo', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/billingInfo.html', controller: 'billingInfoCtrl'})
        .when('/account/creditCards/cardPreferences/:cardAction', {templateUrl: HTTPS_RELATIVE_PATH +'views/account/creditCards/cardPreferences.html', controller: 'cardPreferencesCtrl'})
        .when('/account/creditCards/cardPreferences/:cardAction/:accountNo', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/cardPreferences.html', controller: 'cardPreferencesCtrl'})
        .when('/account/creditCards/cardPreferences', {templateUrl: HTTPS_RELATIVE_PATH + 'views/account/creditCards/cardPreferences.html', controller: 'cardPreferencesCtrl'})
        .when('/offline', {templateUrl: HTTP_RELATIVE_PATH + 'views/offline.html', controller: 'offlineCtrl'})
        .when('/titleCheckout', {templateUrl: HTTP_RELATIVE_PATH + 'views/checkout/titleCheckout.html', controller: 'titleCheckoutCtrl'})
        .when('/titleCheckoutSuccess/:titleSuccess', { templateUrl: HTTP_RELATIVE_PATH + 'views/checkout/titleCheckoutSuccess.html', controller: 'titleCheckoutCtrl' })
        .when('/kioskCheckout', { templateUrl: HTTP_RELATIVE_PATH + 'views/checkout/kioskCheckout.html', controller: 'kioskCheckoutCtrl' })
        .when('/kioskCheckout/:productID/:kioskID/:purchaseOptionId', { templateUrl: HTTP_RELATIVE_PATH + 'views/checkout/kioskCheckout.html', controller: 'kioskCheckoutCtrl' })
        .when('/kioskCheckoutSuccess/:kioskSuccess', { templateUrl: HTTP_RELATIVE_PATH + 'views/checkout/kioskCheckoutSuccess.html', controller: 'kioskCheckoutCtrl' })
        

        .otherwise({redirectTo: '/index'});
}).run(function ($rootScope, $location,$http,$templateCache){
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            routeChangeTimeout = setTimeout(function() {
                helper.debugLog("Route change timeout expired - trigger route change error");
                handleRouteChangeError($rootScope);
            }, 30*SECONDS_TO_MS);
            helper.debugLog("route change start");
			//helper.debugLog('Start DOM Trimmer');
			//$("#main-view").children().remove();
            //detaching all the events from document - Releases Memory
            $(document).unbind();
            $(document).off();
            Omniture.previousPageName=Omniture.pageName;
        });
        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            if (routeChangeTimeout != 0) {
                clearTimeout(routeChangeTimeout);
                routeChangeTimeout = 0;
                helper.debugLog("Route change success - route change timeout cancelled");
            }
            helper.debugLog('Route Success ~ ' + $location.url() );
            /*if ($templateCache.size > 0) {
                $templateCache.removeAll();
                helper.debugLog('Remove Template Cache: ' + JSON.stringify($templateCache.info()));
            }*/
            helper.LGMemoryInfo();
            //helper.ReleaseMemory();
        });
        $rootScope.$on("$routeChangeError", function (event, next, current) {
            if (routeChangeTimeout != 0) {
                clearTimeout(routeChangeTimeout);
                routeChangeTimeout = 0;
                helper.debugLog("Route change error - route change timeout cancelled");
            }
            helper.debugLog('route error on ' + current.templateUrl);
            handleRouteChangeError($rootScope)
        });
    });

