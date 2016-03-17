/**
 * My Redbox Service
 * This service is responsible for retrieving bookmarks, purchases and watch history.
 */


'use strict';
rbi.service("myRedboxService", function ($http) {
    // Initialize product service
    var RBICustomerService = new RBI.CustomerService();
    RBICustomerService.init(new RBI.CustomerServiceConfig(), new RBI.AngularTransport());

    // Set http transport for Angular
    RBICustomerService.setAngularHttp($http);

    var RBIReviewRatingService = new RBI.ReviewRatingService();
    RBIReviewRatingService.init(new RBI.ReviewRatingServiceConfig(), new RBI.AngularTransport());
    RBIReviewRatingService.setAngularHttp($http);

    var RBIProductService = new RBI.ProductService();
    RBIProductService.init(new RBI.ProductServiceConfig(), new RBI.AngularTransport());
    RBIProductService.setAngularHttp($http);

    var RBIProductRating = new RBI.ProductRating();

    return {
        getBookmarks: function (isDashboardCall, successCallback, errorCallback) {
            var sr = new RBI.GetCustomerBookMarkRequest();
            if (isDashboardCall) {
                sr.setPageSize(6);
                sr.setPageNumber(1);
            }
            else {
                sr.setPageSize(100);
                sr.setPageNumber(1);
            }
            sr.setSortField("DateAdded");
            sr.setSortOrder("desc");

            RBICustomerService.getBookmarks(sr, function (data) {

                var bookmarks = [];
                data = data.value.Bookmarks;

                for (var i = 0; i < data.length; i++) {
                    var bookmark = {
                        productId: undefined,
                        imageUrl: undefined,
                        title: undefined,
                        isSubscribe: undefined,
                        isKiosk: undefined,
                        isComingSoon: "hidden",
                        isVOD: undefined,
                        dateAdded: undefined,
                        isExpired: "hidden",
                        isUnavailable: "hidden"
                    };
                    try {
                        if(data[i].DeliveryTypeValue == "VOD") {
                            var timeDiff = geTimeDiff(data[i].ProductInfo.Expires);
                            if (timeDiff < 0) {
                                bookmark.isExpired = "visible";
                            }
                        }


                    }
                    catch (object) {
                        // TO-DO
                    }

                    try {
                        var unavailableRibbonFlag = getUnavailabeRibbonFlag(data[i].BlackoutWindowStart, data[i].BlackoutWindowEnd);
                        if (unavailableRibbonFlag == true) {
                            bookmark.isUnavailable = "visible";
                        }
                    }
                    catch (object) {
                        // TO-DO
                    }

                    try {
                        var unavailableRibbonFlag = getUnavailabeRibbonFlag(data[i].BlackoutWindowStart, data[i].BlackoutWindowEnd);
                        if (unavailableRibbonFlag == true) {
                            bookmark.isUnavailable = "visible";
                        }
                    }
                    catch (object) {
                        // TO-DO
                    }

                    for (var j = 0; j < data[i].ProductInfo.ImageList.length; j++) {
                        if (data[i].ProductInfo.ImageList[j].ImageType == "box cover") {
                            bookmark.imageUrl = data[i].ProductInfo.ImageList[j].URL;
                        }
                    }


                    for (var j = 0; j < data[i].ProductInfo.DeliveryTypes.length; j++) {
                        if (data[i].ProductInfo.DeliveryTypes[j].TypeValue == "VOD" || data[i].ProductInfo.DeliveryTypes[j].TypeValue == "EST") {

                            bookmark.isVOD = "vod";
                        }
                        else if (data[i].ProductInfo.DeliveryTypes[j].TypeValue == "Subscription") {
                            bookmark.isSubscribe = "Subscription";
                        }
                        else {
                            bookmark.isKiosk = "Kiosk";
                        }
                    }

                    try {


                        bookmark.dateAdded = data[i].DateAdded;
                        bookmark.isComingSoon = data[i].ProductInfo.DeliveryTypes[0].MediaFormats[0].IsComingSoon;

                        if (bookmark.isComingSoon == undefined || bookmark.isComingSoon == null || bookmark.isComingSoon == "FALSE") {
                            bookmark.isComingSoon = "hidden"
                        }
                        else {
                            bookmark.isComingSoon = "visible"
                        }
                    }
                    catch (object) {
                        // TO-DO
                    }
                    bookmark.productId = data[i].ProductInfo.ProductID;

                    bookmark.title = data[i].ProductInfo.Title;
                   if(RBI.PlatformConfig.showGames==true)
                        bookmarks.push(bookmark);
                   else
                   {
                       if (isDefined(data[i]) && isDefined(data[i].ProductInfo) && data[i].ProductInfo.ProductType.toLowerCase() == "movie") {
                           bookmarks.push(bookmark);
                       }
                   }
                }

                // success callback
                successCallback(bookmarks);
            },
                function (data) {
                    // error callback
                    errorCallback(data);
                });
        },
        getPurchases: function (isDashboardCall, successCallback, errorCallback) {
            //var sr = new RBI.GetCustomerSimpleRequest();
            var sr = new RBI.GetCustomerPurchasesRequest();

            if (isDashboardCall) {
                sr.setPageSize(6);
                sr.setPageNumber(1);
            }
            else {
                sr.setPageSize(100);
                sr.setPageNumber(1);
            }
            // sr.setSortField("relevance");
            // sr.setSortOrder("desc");
            //sr.addParam("_", (new Date()).getTime());

            RBICustomerService.getPurchases(sr, function (data) {
                // success callback
                var purchases = [];
                data = data.value.PurchaseOptions;

                for (var i = 0; i < data.length; i++) {
                    var purchase = {
                        productId: undefined,
                        imageUrl: undefined,
                        title: undefined,
                        watchedProgress: undefined,
                        transactionDate: undefined,
                        runningTime: undefined,
                        isUnavailable: "hidden"
                    };
                    for (var j = 0; j < data[i].ImageList.length; j++) {
                        if (data[i].ImageList[j].ImageType == "box cover") {
                            purchase.imageUrl = data[i].ImageList[j].URL;
                        }
                    }
                    try {
                        var unavailableRibbonFlag = getUnavailabeRibbonFlag(data[i].BlackoutWindowStart, data[i].BlackoutWindowEnd);
                        if (unavailableRibbonFlag == true) {
                            purchase.isUnavailable = "visible";
                        }
                    }
                    catch (object) {
                    }
                    purchase.productId = data[i].ProductID;
                    var progressWatched = parseInt(data[i].ProgressWatched);
                    purchase.watchedProgress = helper.GetProgressWatchedPercentage(progressWatched, data[i].RunningTime, isDefined(data[i].DateComplete));
                    purchase.title = data[i].Title;
                    helper.debugLog("Title: " + purchase.title + "; progressWatched: " + purchase.watchedProgress);
                    purchase.transactionDate = data[i].TransactionDate;
                    purchase.runningTime = data[i].RunningTime;
                    if(RBI.PlatformConfig.showGames==true)
                        purchases.push(purchase);
                    else
                    {
                        if (isDefined(data[i]) && isDefined(data[i].ProductType) && data[i].ProductType.toLowerCase() == "movie") {
                            purchases.push(purchase);
                        }
                    }
                }

                successCallback(purchases);

            },
                function (data) {
                    // error callback
                    errorCallback(data);
                });
        },

        getWatchHistory: function (isDashboardCall, pageSize, pageCount, successCallback, errorCallback) {
            //var sr = new RBI.GetCustomerReminderRequest();
        	var sr = new RBI.GetCustomerWatchHistoryRequest();
            if (isDashboardCall) {
                sr.setPageSize(pageSize);
                sr.setPageNumber(pageCount);     
                sr.setInProgress(true);
            }
            else {
                sr.setPageSize(pageSize);
                sr.setPageNumber(pageCount);
                sr.setInProgress(false);
            }
            //sr.setSortField("DateComplete");
            //sr.setSortOrder("asc");
            RBICustomerService.getWatchHistory(sr, function (data) {
                // success callback
                var runningTime;
                var progressWatched;
                var timeRemaining;
                var avgUserRatingInt;
                var watchHistories = [];
                var watchHistoryAllRecords = {
                    pagecount: 0,
                    watchHistories: []
                };
                var iterate = -1;
                if (data.getPageInfo() != null) {
                    watchHistoryAllRecords.pagecount = data.getPageInfo().value.Count;
                }

                data = data.value.PurchaseOptions;

                for (var i = 0; i < data.length; i++) {
                    var watchHistoryItem = {
                        Title: undefined,
                        URL: undefined,
                        progressBarWidth: undefined,
                        RemainingTime: "00:00",
                        watchedProgress: undefined,
                        DateLastViewed: undefined,
                        AverageUserRating: undefined,
                        CustomerRating: undefined,
                        avgUserPngOffset: undefined,
                        ProductID: undefined,
                        ProductPurchaseOption: undefined,
                        BlackoutIndicator: undefined,
                        PurchaseOptionID: undefined,
                        DoneClick: undefined,
                        AltCode: undefined,
                        Rating: undefined,
                        isStarInit: undefined,
                        isExpired: "hidden",
                        isUnavailable: "hidden",
                        isLeavingSoon: "hidden",
                        isNowAvailable: "hidden",
                        isReadyForPick: "hidden",
                        isDiskAtHome: "hidden",
                        isComingSoon: "hidden",
                        isSubscription: "hidden",
                        isKiosk: "hidden",
                        isVOD: "hidden",
                        canPlayTitle: true,
                        DateComplete: undefined
                    }


                    var timeDiff = geTimeDiff(data[i].Expires);
                    var isSubscriptionTitle = (data[i].PurchaseOptionName.toLowerCase() == RBI.PurchaseOption.Defines.TYPE_SUBSCRIPTION.toLowerCase())? true:false;
                    var canPlayTitle = (data[i].BillingTransaction.toLowerCase() == "true") ? true : false;

                    if (data[i].DeliveryTypeValue == "VOD") {
                        if (timeDiff < 0) {
                            watchHistoryItem.isExpired = "visible";
                        }
                    }
                   
                    if (data[i].BlackoutWindowEnd != null || data[i].BlackoutWindowEnd != undefined) {
                        watchHistoryItem.isUnavailable = showBlackoutRibbon(data[i].BlackoutWindowEnd);
                        if (watchHistoryItem.isUnavailable == 'hidden') {
                            watchHistoryItem.BlackoutIndicator = 'FALSE';
                        }
                        else {
                            watchHistoryItem.BlackoutIndicator = 'TRUE';
                        }
                    }
                    else {
                        // ZOE-33935: Check if the title is available
                        var isAvaliable = (data[i].Availability != null)? ((data[i].Availability.toUpperCase() == 'TRUE')? true:false):false;
                        watchHistoryItem.isUnavailable = (isAvaliable)? 'hidden' : ((!isSubscriptionTitle && canPlayTitle)? 'hidden' :'visible');
                    }


                    watchHistoryItem.ProductID = data[i].ProductID;
                    watchHistoryItem.AltCode = data[i].AltCode;
                    watchHistoryItem.PurchaseOptionID = data[i].PurchaseOptionID;
                    watchHistoryItem.PurchaseOptionName = data[i].PurchaseOptionName;
                    watchHistoryItem.DeliveryTypeValue = data[i].DeliveryTypeValue;
                    watchHistoryItem.FormatType = data[i].FormatType;
                    watchHistoryItem.DateComplete = data[i].DateComplete;
                    watchHistoryItem.Rating = data[i].Rating;
                    watchHistoryItem.Title = data[i].Title;
                    watchHistoryItem.URL = data[i].ImageList[0].URL;
                    runningTime = data[i].RunningTime;
                    progressWatched = parseInt(data[i].ProgressWatched);
                    watchHistoryItem.watchedProgress = helper.GetProgressWatchedPercentage(progressWatched, runningTime, watchHistoryItem.DateComplete != null);
                    watchHistoryItem.progressBarWidth = (RED_LOADING_BAR_WIDTH * watchHistoryItem.watchedProgress) / 100;
                    timeRemaining = helper.getTimeRemaining(runningTime, progressWatched);
                    watchHistoryItem.RemainingTime = '-' + helper.GetFormattedTime(timeRemaining);
                    watchHistoryItem.DateLastViewed = data[i].DateLastViewed;
                    watchHistoryItem.AverageUserRating = data[i].AverageUserRating;
                    avgUserRatingInt = helper.calcAvgUserRating(data[i].AverageUserRating);
                    watchHistoryItem.avgUserPngOffset = helper.getAvgUserPngOffset(avgUserRatingInt);

                    if (isSubscriptionTitle) {
                        // ZOE 24873 - check if billing transaction is true for subscription movies
                        watchHistoryItem.canPlayTitle = canPlayTitle;
                        // ZOE-33828: FormatType returned by the server is incorrect for subscription titles (always SD)
                        // Hence the format type string is blank in this case
                        // can be removed once this issue is fixed.
                        watchHistoryItem.FormatType = '';
                    }

                    try {
                        watchHistoryItem.isLeavingSoon = data[i].IsLeaving.toUpperCase() == "TRUE" ? "visible" : "hidden";
                        watchHistoryItem.isNowAvailable = data[i].IsNewRelease.toUpperCase() == "TRUE" ? "visible" : "hidden";
                        watchHistoryItem.isReadyForPick = "hidden"; //ToDo: data[i].ISReadyForPick.toUpperCase()=="TRUE" ?"visible":"hidden";
                        watchHistoryItem.isDiskAtHome = "hidden"; //ToDo:data[i].IsDiskAtHome.toUpperCase()=="TRUE" ?"visible":"hidden";
                        watchHistoryItem.isComingSoon = data[i].IsComingSoon.toUpperCase() == "TRUE" ? "visible" : "hidden";
                    }
                    catch (object) {
                        // TO-DO
                    }
                    if(RBI.PlatformConfig.showGames==true)
                        watchHistories.push(watchHistoryItem);
                    else
                    {
                        if (isDefined(data[i]) && isDefined(data[i].ProductType) && data[i].ProductType.toLowerCase() == "movie") {
                            watchHistories.push(watchHistoryItem);
                        }
                    }
                }
               
                watchHistoryAllRecords.watchHistories = watchHistories;
                //sortByDateComplete(watchHistories);
                successCallback(watchHistoryAllRecords);
            },
                function (data) {
                    // error callback
                    errorCallback(data);
                    // reset the userLoggedIn flag so that we can re-login
                    // Not needed anymore since proxy maintains the session
                    //helper.logoutUser();
                });
        },
        getRemindersByCustomer: function (isDashboardCall, successCallback, errorCallback) {

            var sr = new RBI.GetCustomerReminderRequest();
            sr.setPageSize(30);
            sr.setPageNumber(1);
            RBICustomerService.getRemindersByCustomer(sr, function (data) {
                // success callback
                var reminders = [];
                var iterate = -1;
                data = data.value.Reminders;

                if (isDashboardCall && data.length >= 6) {
                    iterate = 6;
                }
                else {
                    iterate = data.length;
                }
                for (var i = 0; i < iterate; i++) {

                    var reminder = {
                        productId: undefined,
                        imageUrl: undefined,
                        title: undefined,
                        watchedProgress: undefined,
                        progressWatched: undefined,
                        runningTime: undefined,
                        remiderType: undefined,
                        reminderText: "",
                        isLeavingSoon: false,
                        isNowAvailable: false,
                        isReadyForPick: false,
                        isDiskAtHome: false,
                        purchaseOptionType: "",
                        expires: undefined
                    };

                    reminder.remiderType = data[i].ReminderType;

                    if (data[i].ReminderType == "VOD Expiring"
                            || data[i].ReminderType == "VOD") {

                        var expMinutes = geTimeDiff(data[i].ReminderActionDate);
                        var expHours = Math.floor(expMinutes/60);
                        var expDays = Math.round(expHours/24);

                        if (expDays >= 1) {
                            reminder.reminderDate = expDays;
                            reminder.reminderDays = (expDays > 1)? "Days":"Day";
							reminder.reminderDaysLeft = "In" + " " + reminder.reminderDate +" " + reminder.reminderDays;
                        }
                        else if (expHours >= 1) {
                            reminder.reminderDate = expHours;
                            reminder.reminderDays = (reminder.reminderDate > 1)? "Hours":"Hour";
							reminder.reminderDaysLeft = "In" + " " + reminder.reminderDate +" " + reminder.reminderDays;
                        }
                        else if (expMinutes > 0) {
							var minutes = (expMinutes > 1)? "Minutes":"Minute";
						    reminder.reminderDaysLeft = "In" + " " + expMinutes + " " + minutes;
                        }
                        // reminder.reminderText = "Expires in";
                        reminder.reminderText = "EXPIRES: ";
                        reminder.expires = data[i].PurchaseOption.Expires;
                    } else if (data[i].PurchaseOption.IsLeaving != null && data[i].PurchaseOption.IsLeaving != undefined
                            && data[i].PurchaseOption.IsLeaving == "TRUE") {

                        reminder.reminderText = "LEAVING SOON";
                        reminder.isLeavingSoon = true;
                    } else if (data[i].PurchaseOption.IsNewRelease != null
                            && data[i].PurchaseOption.IsNewRelease != undefined
                            && data[i].PurchaseOption.IsNewRelease == "TRUE") {
                        if (data[i].ReminderType == "Ready for pickup") {
                            reminder.reminderText = "READY FOR PICKUP";
                        } else {
                            reminder.reminderText = "AVAILABLE NOW";
                            reminder.isNowAvailable = true;
                        }
                    } else {
                        reminder.reminderText = data[i].ReminderType;
                    }

                    for (var j = 0; j < data[i].PurchaseOption.ImageList.length; j++) {
                        if (data[i].PurchaseOption.ImageList[j].ImageType == "box cover") {
                            reminder.imageUrl = data[i].PurchaseOption.ImageList[j].URL;
                            break;
                        }
                    }

                    reminder.productId = data[i].PurchaseOption.ProductID;
                    reminder.watchedProgress = helper.GetProgressWatchedPercentage(parseInt(data[i].PurchaseOption.ProgressWatched), data[i].PurchaseOption.RunningTime, isDefined(data[i].PurchaseOption.DateComplete));
                    reminder.imageUrl = data[i].PurchaseOption.ImageList[0].URL;
                    reminder.title = data[i].PurchaseOption.Title;
                    reminder.progressWatched = data[i].PurchaseOption.ProgressWatched;
                    reminder.runningTime = data[i].PurchaseOption.RunningTime;
                    reminder.purchaseOptionType = data[i].PurchaseOption.PurchaseOptionType;
                    
                    if(RBI.PlatformConfig.showGames==true)
                        reminders.push(reminder);
                    else
                    {
                        if (isDefined(data[i]) && isDefined(data[i].PurchaseOption) && data[i].PurchaseOption.ProductType.toLowerCase() == "movie") {
                            reminders.push(reminder);
                        }
                    }
                }
                successCallback(reminders);
            },
                function (data) {
                    // error callback
                    errorCallback(data);
                });
        },

        getProductRating: function (params, titleIndex, successCallback, errorCallback) {

            var sr = new RBI.GetProductRatingsRequest();
            sr.setAltCode(params.altCode);
            sr.setProductID(params.productID);
            if(helper.isUserLoggedIn() == false)
            {
                sr.addParam("_", (new Date()).getTime());
            }
            RBIReviewRatingService.getProductRatings(sr, function (data) {
                // success callback
                successCallback(data, titleIndex);
            },
                function (data) {
                    // error callback
                    errorCallback(data);
                }, helper.isUserLoggedIn());

        },

        completedWatch: function (productID, purchaseOptionID, deviceID, deviceSpec, successCallback, errorCallback) {

            var sr = new RBI.CompleteWatchingTitleRequest;
            sr.setProductID(productID);
            sr.setPurchaseOptionID(purchaseOptionID);
            sr.setDeviceID(deviceID);
            sr.setDeviceSpec(deviceSpec);

            RBIProductService.completeWatchingTitle(sr, function (data) {
                helper.debugLog('completedWatch success');
                successCallback(data);

            }, function (data) {
                helper.debugLog('completedWatch failed');
                errorCallback(data);
            });
        },

        getProductReviews: function (productID, successCallback, errorCallback) {
            var sr = new RBI.GetProductRatingsRequest();
            sr.setProductID(productID);
            RBIReviewRatingService.getProductReviews(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });

        }
    };

    function sortByDateComplete(historyItems) {
        historyItems.sort(compare);
    }

    function compare(a, b) {
        if (a.DateComplete < b.DateComplete)
            return -1;
        if (a.DateComplete > b.DateComplete)
            return 1;
        return 0;
    }
});
