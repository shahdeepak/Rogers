/**
 * Player service functions
 * Calls Core API functions
 *
 * Author: Peter Rajcani
 */

'use strict';

rbi.service('playerService', function ($http, $q) {

    var playbackData = {
        playbackUrl: 'undefined',
        componentID: 'undefined',
        entitlementID: 'undefined',
        progressWatched: 'undefined',
        scrubberPath: 'undefined',
        scrubberInterval: 'undefined',
        token: 'undefined',
        pcn: 'undefined'
    };

    var RBIProductService = new RBI.ProductService();
    RBIProductService.init(new RBI.ProductServiceConfig());
    RBIProductService.setAngularHttp($http);

    var scrubberImages = [];

    var httpGet = function ($http, $q, url) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: url,
            data: undefined,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).
            success(function (data, status, headers, config) {
                defer.resolve(data);
            }).
            error(function (data, status, headers, config) {
                defer.reject(data);
            });

        return defer.promise;
    }


    //Calculate the average speed
    function getAvgSpeed(results) {
        var avg = 0;
        for (var i = 0; i < results.length; i++) {
            avg = avg + (parseFloat(results[i]));
        }
        if (results.length > 0) {
            avg = (avg / results.length).toFixed(2);
        }

        if (isNaN(avg)) avg = -1;
        return avg;
    }


    function calculateBandwidth(callback) {
        var images = [
            {
                "url": 'http://ztc.verizon.net/promos/merchandising/random1000k.jpg?n=' + Math.random(),
                "size": 1051754
            },
            {
                "url": 'http://ztc.verizon.net/promos/merchandising/random1000k.jpg?n=' + Math.random(),
                "size": 1051754
            }
        ];
        var results = [];
        var imageNum = 0;
        var startTime, endTime;
        var download1, download2, download3;
        var downloadTimeout = null;
        var DOWNLOAD_TIMEOUT_MS = 30000; // 30 second timeout

        function downloadImage() {
            var duration = (new Date()).getTime() - startTime;
            if (downloadTimeout != null) {
                clearTimeout(downloadTimeout);
            }
            var downloadSize = images[imageNum].size*8;
            var speedMbps = (downloadSize / (duration*1000)).toFixed(2);
            helper.debugLog("duration: " + duration + " ms, bitsLoaded: " + downloadSize);
            helper.debugLog("download speed: " + speedMbps + ' Mbps');
            results.push(speedMbps);

            if (imageNum == images.length - 1) {
                callback(getAvgSpeed(results));
            }
            else {
                imageNum++;
                startTime = (new Date()).getTime();
                download2.src = images[imageNum].url;
                downloadTimeout = setTimeout(downloadTimeoutFunc, DOWNLOAD_TIMEOUT_MS);
            }
        }

        function downloadTimeoutFunc () {
            callback(-1);
        }

        download1 = new Image();
        download1.onload = downloadImage;
        download1.onerror = function (e) {
            callback(getAvgSpeed(results));
        }

        download2 = new Image();
        download2.onload = downloadImage;
        download2.onerror = function (e) {
            callback(getAvgSpeed(results));
        }

        startTime = (new Date()).getTime();
        download1.src = images[imageNum].url;
        downloadTimeout = setTimeout(downloadTimeoutFunc, DOWNLOAD_TIMEOUT_MS);
    }

    return {

        GetPlaybackUrl: function (playerServiceParams, successCallback, errorCallback) {

            var playbackUrlRequest = new RBI.PlaybackRequest();

            playbackUrlRequest.setDeviceID(platformInfo.getDeviceID());
            playbackUrlRequest.setDeviceSpec(playerServiceParams.deviceSpec);
            playbackUrlRequest.setIsDownload(false);
            playbackUrlRequest.setProductID(playerServiceParams.productID);
            playbackUrlRequest.setPurchaseOptionID(playerServiceParams.purchaseOptionID);
            playbackUrlRequest.setTransactionDeviceID(RBI.PlatformConfig.transactionDeviceID);

            helper.debugLog ("Playback URL request:");
            helper.debugLog("TransactionAccessPoint: " + playbackUrlRequest.transactionAccessPoint);
            helper.debugLog("TransactionDeviceID: " + playbackUrlRequest.transactionDeviceID);
            helper.debugLog("DeviceID: " + playbackUrlRequest.DeviceID);
            helper.debugLog("DeviceSpec: " + playbackUrlRequest.DeviceSpec);
            helper.debugLog("ProductID: " + playbackUrlRequest.ProductId);
            helper.debugLog("PurchaseOptionID: " + playbackUrlRequest.PurchaseOptionID);

            RBIProductService.getPlaybackUrl(playbackUrlRequest,
                function (data) {
                    if (data == null) {
                        // If the server sends us empty data treat it as error
                        errorCallback(null);
                        return null;
                    }

                    playbackData.playbackUrl = data.getCDNUrl();
                    playbackData.componentID = data.getComponentId();
                    playbackData.entitlementID = data.getEntitlementId();
                    playbackData.progressWatched = data.getProgressWatched();
                    playbackData.scrubberInterval = data.getScrubberInterval();
                    playbackData.scrubberPath = data.getScrubberPath();
                    playbackData.token = data.getToken();
                    playbackData.pcn = data.getPartnerCustomerNumber();
                    helper.debugLog ("Playback URL response:");
                    helper.debugLog("DeviceID: " + data.getDeviceId());
                    helper.debugLog("TransactionDeviceID: " + data.getTransactionDeviceId());
                    helper.debugLog("Device Spec: " + data.getDeviceSpec());
                    successCallback(playbackData);
                    return playbackData;
                },
                function (data) {
                    // Handle error
                    errorCallback(data);
                });

        },

        GetPlaybackLocation: function (playerServiceParams, successCallback, errorCallback) {

            var getPlaybackLocationRequest = new RBI.GetPlaybackLocationRequest();
            getPlaybackLocationRequest.setProductID(playerServiceParams.productID);
            getPlaybackLocationRequest.setToken(playerServiceParams.token);

            RBIProductService.getPlaybackLocation(getPlaybackLocationRequest,
                function (data) {
                    var progressWatched = data.getProgressWatched();
                    successCallback(progressWatched);
                    return progressWatched;
                },
                function (data) {
                    errorCallback(data);
                    // TODO: Handle error
                });


        },

        SetPlaybackLocation: function (playerServiceParams, successCallback, errorCallback) {

            var setPlaybackLocationRequest = new RBI.SetPlaybackLocationRequest();
            setPlaybackLocationRequest.setDeviceID(platformInfo.getDeviceID());
            setPlaybackLocationRequest.setDeviceSpec(playerServiceParams.deviceSpec);
            setPlaybackLocationRequest.setProductID(playerServiceParams.productID);
            setPlaybackLocationRequest.setProgressWatched(playerServiceParams.progressWatched);
            setPlaybackLocationRequest.setPurchaseOptionID(playerServiceParams.purchaseOptionID);
            setPlaybackLocationRequest.setStatus(playerServiceParams.status);
            setPlaybackLocationRequest.setToken(playerServiceParams.token);
            setPlaybackLocationRequest.setPCN(playerServiceParams.pcn);
            // ZOE-32739 - need to specify transactionDeviceID in the request
            setPlaybackLocationRequest.setTransactionDeviceID(RBI.PlatformConfig.transactionDeviceID);
            setPlaybackLocationRequest.setTransactionAccessPoint(RBI.PlatformConfig.transactionAccessPointOL);

            RBIProductService.setPlaybackLocationOL(setPlaybackLocationRequest,
                function (data) {
                    var heartbeatPeriod = parseInt(data.getHeartbeatPeriod());
                    successCallback(heartbeatPeriod);
                    return heartbeatPeriod;
                },
                function (data) {
                    // TODO: Handle error
                    errorCallback(data);
                });
        },

        CompleteWatchingTitle: function (playerServiceParams, successCallback, errorCallback) {

            var completeWatchingTitleRequest = new RBI.CompleteWatchingTitleRequest();
            completeWatchingTitleRequest.setDeviceID(platformInfo.getDeviceID());
            completeWatchingTitleRequest.setDeviceSpec(playerServiceParams.deviceSpec);
            completeWatchingTitleRequest.setProductID(playerServiceParams.productID);
            completeWatchingTitleRequest.setPurchaseOptionID(playerServiceParams.purchaseOptionID);
            completeWatchingTitleRequest.setPCN(playerServiceParams.pcn);
            completeWatchingTitleRequest.setToken(playerServiceParams.token);
            // ZOE-32739 - need to specify transactionDeviceID in the request
            completeWatchingTitleRequest.setTransactionDeviceID(RBI.PlatformConfig.transactionDeviceID);
            completeWatchingTitleRequest.setTransactionAccessPoint(RBI.PlatformConfig.transactionAccessPointOL);

            RBIProductService.completeWatchingTitleOL(completeWatchingTitleRequest,
                function (data) {
                    successCallback(data);
                },
                function (data) {
                    errorCallback(data);
                });
        },

        GetLicense: function (licenseRequest, successCallback, errorCallback) {
            RBIProductService.getLicense(licenseRequest,
                function (data) {
                    successCallback(data);
                },
                function (data) {
                    errorCallback(data);
                });

        },

        LoadScrubberImages: function (scrubberImagePath, scrubberInterval, minScrubberInterval) {
            var scrubberIndexStep = 1;
            var scrubberIndex = 0;
            var done = false;
            if (scrubberInterval < minScrubberInterval) {
                scrubberIndexStep = minScrubberInterval / scrubberInterval;
            }


            while (!done) {
                var url = scrubberImagePath + scrubberIndex + '.jpg';
                httpGet($http, $q, url).then(function (result) {
                        scrubberImages.push(result);
                    },
                    function (result) {
                        done = true;
                    });
                scrubberIndex += scrubberIndexStep;
            }
        },

        GetScrubberImage: function (index) {
            if (index >= scrubberImages.length) {
                index = scrubberImages.length;
            }
            return scrubberImages[index];
        },

        SpeedTest: function (callback) {
            calculateBandwidth(callback);
        },

        IsCCSupported: function (product, purchaseOptionID) {
            var ccSupported = false;
            var purchaseOptionList = product.getPurchaseOptionsList();
            for (var i = 0; i < purchaseOptionList.length; i++) {
                if (purchaseOptionID == purchaseOptionList[i].getPurchaseOptionID()) {
                    var mediaList = purchaseOptionList[i].getMediaList();
                    for (var j = 0; j < mediaList.length && !ccSupported; j++) {
                        var deviceType = mediaList[j].getTargetDevice().toUpperCase();
                        if (deviceType == RBI.Product.Defines.SMOOTH_HD || deviceType == RBI.Product.Defines.SMOOTH_SD) {
                            ccSupported = mediaList[j].isCCSupported();
                        }
                    }
                    break;
                }
            }

            return ccSupported;
        },
        
        getPurchaseType: function (product, purchaseOptionID) {
            var purchaseType = null;
            var purchaseOptionList = product.getPurchaseOptionsList();
            for (var i = 0; i < purchaseOptionList.length; i++) {
                if (purchaseOptionID == purchaseOptionList[i].getPurchaseOptionID()) {
                	purchaseType = purchaseOptionList[i].value.PurchaseOptionType;
                }
            }
            return purchaseType;
        }
    };

});
