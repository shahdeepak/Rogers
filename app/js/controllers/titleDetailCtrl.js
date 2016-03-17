/**
* titleDetailCntrl.js
* Author:Mangesh Dhandale
*
* This file will be responsible as a controller for title details page.
*/
'use strict';

rbi.controller('titleDetailCtrl',
    function ($scope, $location, productService, $routeParams, $timeout, rbiCommonService, myRedboxService, customerService, ratingReviewService, $dialog) {
        //Omniture
        Omniture.pageName = "";
        $scope.buttonName = "";   // track button name for Omniture
        $scope.trackOmniture = "load";
        $scope.omnitureReady = [false, false, false];
        $scope.canMoveFocus = true;
        $scope.currentIndex = 0;
        //Omniture

        $scope.CurrentReviews = [];
        $scope.maxReviewPage = 0;
        
        $scope.titleDone = $scope.ratingDone = $scope.reviewDone = false;
        popCheckoutBackEntry();
        //helper.ReleaseMemory();
		$scope.bookmarkFocused = false;
        $scope.mainMenuReturn = { display: true };
        $scope.LEVEL_BUTTONS = 1;
        $scope.LEVEL_POPUP = 2;
        $scope.LEVEL_LIST = 3;
        $scope.LEVEL_INSTANT_LIST = 4;
        $scope.LEVEL_AT_KIOSK_LIST = 5;
        $scope.LEVEL_AGE_VERIFICATION = 6;
        $scope.LEVEL_HELP = 7;
        $scope.LEVEL_AT_PWPOPUP = 9;
        $scope.LEVEL_RESTRICTED_PURCHASE = 8;
        $scope.LEVEL_AT_PWPOPUP_SUBMIT = 10;
        $scope.LEVEL_AT_PWPOPUP_KIOSK = 11;
        $scope.LEVEL_AT_PWPOPUP_SUBMIT_KIOSK = 12;

        $scope.$root.showTitleConfirmCheckout = false;
        $scope.showKioskConfirmCheckout = false;
        $scope.$root.showTitleSuccessCheckout = false;
        $scope.$root.showKioskSuccessCheckout = false;

        $scope.moreLikethis_Gradient = false;
        $scope.isMoreLikeThisdataPresent = false;
        $scope.reserveFlag = false;
        $scope.isHD = false;
        $scope.initPos = 0;
        $scope.InstantOptionLevelIndex=0;
        $scope.RecommendedProductsResponse = [];
        $scope.noReviews = false;
        rbiCommonService.removeSharedItem(IS_INSTANT_OPTION);
        //This is to set QueryID
        if (helper.isDefined(rbiCommonService.getSharedItem('QueryID')) && (backPaths[backPaths.length - 1].indexOf('/titledetail') != -1 || backPaths[backPaths.length - 1].indexOf('/search') != -1 || backPaths[backPaths.length - 1].indexOf('/browse') != -1)) {
            $scope.queryId = rbiCommonService.getSharedItem('QueryID');
        }
       // rbiCommonService.removeSharedItem('QueryID');

        if (isDefined(platformStorage.getItem("checkouttype"))) {
            platformStorage.removeItem("checkouttype");
            platformStorage.removeItem("checkoutdata");
        }
        hideMainMenu();
        addToBackPaths($location.path());
        rbiCommonService.setSharedItem(TITLE_DETAIL_PATH, $location.path());
        $scope.showAbandonCheckout = false;
        $scope.showkioskAbandonCheckout = false;
        $scope.showBlurayPopup = false;
        $scope.month = '';
        $scope.day = '';
        $scope.year = '';
        $scope.ageVerificationLevelMap = new Array();

        $scope.ageVerificationLevelMap[0] = {
            CurrentIndex: 0,
            MaxElements: 3
        };

        $scope.ageVerificationErrorMessage = "";
        $scope.title = {
            "productId": "", "kioskId": "",
            "titleName": "", "titleDetail": "", "description": "", "longDescription": "",
            "posterImage": "", "expiresOn": "", "previewURL": "",
            "isMovie": true, "isBookmarked": false, "isMatureTitle:": false, "blackoutIndicator": false,
            "ratingValue": "", "ratingValueStr": "", "ratingLabel": "", "ratingMessage": "", "blackoutStartDate": "", "blackoutEndDate": "",
            "ratingsJson": [], "titleDetailJson": [], "progressWatched": "", "altCode": "", "watchNowPurchaseOptionId": ""
        };

        $scope.selectedKiosk = {
            "kioskId": "", "Address1": "", "City": "", "Displayname": "", "Distance": "", "Label": "",
            "Latitude": "", "Longitude": "", "Location": true, "State": "", "Status:": "", "Vendor": "",
            "ZipCode": ""
        };

        $scope.kioskName = "";
        $scope.kioskAddressLine1 = "";
        $scope.kioskAddressLine2 = "";
        $scope.isFromKiosk = false;

        $scope.startpos = 0;
        $scope.Offset = 150;

        $scope.CurrentLevelIndex = 1;
        $scope.isDescriptionElipsised = false;
        $scope.showPreview = false;




        $scope.title.productId = $routeParams.productID;
        $scope.title.kioskId = "";
		$scope.deepSearch="";
		if ($routeParams.kioskID == "deepsearch") {
    		$scope.deepSearch = $routeParams.kioskID;
    	} else {
    		$scope.title.kioskId = $routeParams.kioskID;
    	}

        $scope.showRatings = false;
        $scope.showBookmarkPopUp = false;
        $scope.showFullSynopsis = false;
        $scope.showAgeVerificationPopup = false;
        $scope.showHelpPopUp = false;
        $scope.showInstantOptionsPopUp = false;
        $scope.showAtKioskOptionsPopUp = false;
        $scope.uiPWPopup = false;

        $scope.ratingCss = "sprite-rating-image";

        $scope.$root.isSorryPopupVisible = false;
        $scope.instantOptionPopUpjsonObj = {
            instantoption: []
        };

        $scope.ratval = 0;

        $scope.instantOptionBadgeLabel = "";
        $scope.kioskOptionBadgeLabel = "";
        $scope.subscriptionBadge = false;
        $scope.rentBadge = false;

        $scope.isRentPresent = false;
        $scope.isRentHDPresent = false;
        $scope.isBuyPresent = false;
        $scope.isBuyHDPresent = false;
        $scope.isSubscriptionPresent = false;

        $scope.isRentBillingPresent = false;
        $scope.isRentHDBillingPresent = false;
        $scope.isBuyBilllingPresent = false;
        $scope.isBuyHDBillingPresent = false;

        $scope.onlyWatchNowPresent = false;
        $scope.onlySubscribeNowPresent = false;
        $scope.onlyRentHDPresent = false;
        $scope.onlyRentPresent = false;
        $scope.onlyBuyHDPresent = false;
        $scope.onlyBuyPresent = false;

        $scope.onlyFindDVDPresent = false;
        $scope.onlyFindBlueRayPresent = false;

        $scope.isKioskCheckoutVisible = false;

        $scope.instantOptionLabel = "INSTANT OPTIONS";
        $scope.isInstantOptionVisible = false;
        $scope.isInstantOptionListVisible = false;
        $scope.atKioskLabel = "At the Box";
        $scope.isATKioskVisible = false;
        $scope.isATKioskListVisible = false;
        $scope.fullSynopsisLabel = "";
        $scope.buttonIndex = 0;

        if (isDefined(platformStorage.getItem("checkouttype"))) {
            platformStorage.removeItem("checkouttype");
            platformStorage.removeItem("checkoutdata");
        }

        $scope.$dialog = $dialog;

        $scope.levelMap = [];
        $scope.CurrentLevelIndex = 1;
        $scope.levelMap[$scope.LEVEL_BUTTONS] = {
            CurrentIndex: 0,
            MaxElements: 2,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };
        $scope.levelMap[$scope.LEVEL_LIST] = {
            CurrentIndex: 0,
            MaxElements: 0,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };
        $scope.levelMap[$scope.LEVEL_INSTANT_LIST] = {
            CurrentIndex: 0,
            MaxElements: 0,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };
        $scope.levelMap[$scope.LEVEL_AT_KIOSK_LIST] = {
            CurrentIndex: 0,
            MaxElements: 0,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };

        $scope.levelMap[$scope.LEVEL_AT_PWPOPUP] = {
            CurrentIndex: 0,
            MaxElements: 0,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };
        $scope.levelMap[$scope.LEVEL_AT_PWPOPUP_KIOSK] = {
            CurrentIndex: 0,
            MaxElements: 0,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };
        var eventHandler = new TitleDetailEventHandler($scope, $location, $routeParams, rbiCommonService, customerService);
        sharedScopeWithMenu($scope, $location);
        $scope.eventHandler = eventHandler;

        $scope.callDone = false;

        var params = [];
        //$scope.ratings = ["PG-13", "HD", "S", "02:05", "CC"];
        params.productId = $routeParams.productID;
        params.kioskId = $scope.title.kioskId;
		params.queryId = $scope.queryId;
        $scope.$root.showCheckOut = undefined;
        //$scope.showTitleConfirmCheckout = false;
        //$scope.showTitleSuccessCheckout = false;
        $scope.reviewCount = 1;


        var popUpKey = 'Error_PopUp';

        $scope.getTitleDetail = function () {
            $scope.callDone = false;
            $scope.titleDetail = productService.GetProductDetailByProductID(params,
                function (data) {
                    $scope.titleDetail = data;
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|product|" + data.getProductType() + "s|" + data.getTitle();
                    var thumbnail_image = data.getImageOfType(RBI.Product.Defines.THUMBNAIL_IMAGE_TYPE);
                    var image_title = data.getTitle();
                    // Initial setting of isHD flag for subscription movies
                    // This flag is overriden in populateTitleDetailData for rent/buy titles depending on the selected instant option
                    $scope.isHD =  data.isHD();
                    helper.debugLog("Media format from product details - HD");
                    sessionStorage.setItem("imageURL", thumbnail_image);
                    sessionStorage.setItem("imageTitle", image_title);
                    sessionStorage.setItem("productGenre", helper.convertArrayToString(data.getGenres()));  // for Omniture
                    if ($scope.title.kioskId != undefined && $scope.title.kioskId != "") {
                        $scope.isFromKiosk = true;
                        titleDetailHelper.SetKioskDetails($scope);
                    }

                    var missingTransactionIndex = titleDetailHelper.CheckInstantOptions($scope, data);
                    if (missingTransactionIndex >= 0) {
                        // ZOE 21351 - If a billing transaction is missing check the subscription status by making a GetCustomer call
                        // If user has a valid subscription, populate instant options accordingly
                        $scope.checkSubscriptionStatus(function (isSubscriptionValid) {
                            helper.debugLog("TitleDetails - isSubscriptionValid: " + isSubscriptionValid);
                            data.getPurchaseOptionsList()[missingTransactionIndex].value.BillingTransaction = isSubscriptionValid ? 'true' : 'false';
                            titleDetailHelper.populateTitleDetailData($scope, data);
                        });

                    }
                    else {
                        titleDetailHelper.populateTitleDetailData($scope, data);
                    }


                    $scope.getRating();
                    $scope.getReviews(1, 5);

                    // This is to reset the kioskId param
                    // when user does not go through Kiosk Browse..ZOE-36617
                    if(!$scope.isFromKiosk) params.kioskId = "";

                    productService.getRecommendedProducts(params, function (data) {
                        // Change of return value to getRecommendedProducts API
                       // $scope.RecommendedProductsResponse = data.getRecommendedProducts();
                        var recommendedProducts = data.getRecommendedProducts();

						rbiCommonService.setSharedItem('QueryID',data.getQueryID());
                        $scope.ImageType = RBI.Product.Defines.POSTER_IMAGE_TYPE;
                        $scope.Height = 186;
                        $scope.Width = 132;
                        $scope.MoreLikeThisText = "";
                        // Optimized recommended products array to only store values we need
                        for (var item = 0; item < recommendedProducts.length; item++) {
                            $scope.RecommendedProductsResponse.push({
                                imageUrl: recommendedProducts[item].getImageOfType($scope.ImageType),
                                title: recommendedProducts[item].getTitle(),
                                productID: recommendedProducts[item].getProductID()
                            });
                        }

                        if ($scope.RecommendedProductsResponse.length > 0) {
                           $scope.MoreLikeThisText = "RELATED";
                            $scope.isMoreLikeThisdataPresent = true;
                        }
                        else {
                            $scope.isMoreLikeThisdataPresent = false;
                        }
                        $scope.title_list_margin = 0;

                        // offset to increase margin top of MLT
                        $scope.top_margin_offset = 110 * 3;

                        //offset to increase margin top of MLT
                        $scope.top_margin_con_offset = 400;

                        //offset to increase margin top of MLT
                        $scope.first_page_margin_offset = 30;


                        $scope.levelMap[$scope.LEVEL_LIST].MaxElements = $scope.RecommendedProductsResponse.length;
                        if ($scope.RecommendedProductsResponse.length >= 3) {
                            $scope.moreLikethis_Gradient = true;
                        }
                    },
                        function (data) {
                            helper.showErrorMessage(popUpKey, $scope);
                        });
                    $scope.omnitureReady[0] = true;
                    $scope.callDone = true;

                }, function (data) {
                    $scope.callDone = true;
                    $scope.omnitureReady[0] = true;
                    helper.showErrorMessage(popUpKey, $scope);
                }
            );

        };
        $scope.setSharedData = function () {
            rbiCommonService.setSharedItem(SELECTED_INSTANT_OPTION, $scope.selectedInstantOption);
            rbiCommonService.setSharedItem(INSTANT_OPTIONS, $scope.instantOptionPopUpjsonObj);
            rbiCommonService.setSharedItem(SELECTED_ACCOUNT, $scope.selectedCardAccount);
            rbiCommonService.setSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX, $scope.titleCheckoutCurrentControlIndex);
            rbiCommonService.setSharedItem(TITLE_CHECKOUT_RENT_BUY_CURRENT_COUNT, $scope.titleCheckoutRentBuyCurrentCount);
            rbiCommonService.setSharedItem(TITLE_CHECKOUT_CHANGE_CARD_CURRENT_COUNT, $scope.titleCheckoutChangeCardCurrentCount);
            rbiCommonService.setSharedItem(TITLE_DETAIL, $scope.title);
            rbiCommonService.setSharedItem(MORE_LIKE_THIS, $scope.RecommendedProductsResponse);
            rbiCommonService.setSharedItem(RATING, $scope.product.value.Rating);
        };

        $scope.setKioskSharedData = function () {
            rbiCommonService.setSharedItem(SELECTED_KIOSK_OPTION, $scope.selectedKioskPurchaseOption);
            rbiCommonService.setSharedItem(KIOSK_OPTIONS, $scope.aTkioskPopUpjsonObj);
            //rbiCommonService.setSharedItem(SELECTED_ACCOUNT, $scope.selectedCardAccount);
            rbiCommonService.setSharedItem(TITLE_CHECKOUT_CURRENT_CONTROL_INDEX, $scope.titleCheckoutCurrentControlIndex);
            rbiCommonService.setSharedItem(TITLE_CHECKOUT_RENT_BUY_CURRENT_COUNT, $scope.titleCheckoutRentBuyCurrentCount);
            rbiCommonService.setSharedItem(TITLE_CHECKOUT_CHANGE_CARD_CURRENT_COUNT, 0);
            rbiCommonService.setSharedItem(TITLE_DETAIL, $scope.title);
            rbiCommonService.setSharedItem(MORE_LIKE_THIS, $scope.RecommendedProductsResponse);
        };

        $scope.ReloadTitleDetail = function () {
            productService.GetProductDetailByProductID(params,
                function (data) {
                    try {
                        $scope.instantOptionPopUpjsonObj = {
                            instantoption: []
                        };
                        titleDetailHelper.PopulateInstantOptions($scope, data);
                        titleDetailHelper.GetButtons($scope);
                        titleDetailHelper.PopulateBadgeLabels($scope);
                    } catch (object) { }

                }, function (data) {
                    helper.showErrorMessage(popUpKey, $scope);
                });
        };

        $scope.getCards = function () {

            $scope.cards = helper.GetCards(rbiCommonService);
            $scope.selectedCardAccount = helper.isDefined(helper.GetPreferredCard(rbiCommonService)) ? helper.GetPreferredCard(rbiCommonService) : helper.GetSubscriptionCard(rbiCommonService);
            if ($scope.cards == undefined) {
                customerService.getCards(rbiCommonService,
    	 					function (data) {
    	 					    $scope.cards = data;
    	 					    $scope.selectedCardAccount = customerService.getPreferredCard(data);
    	 					    //$scope.navigateBackToCheckout();

    	 					},
                function (data) {
                    helper.debugLog("Error occureed with getCards.");
                    //$scope.navigateBackToCheckout();
                });
            }
        };

        if (helper.isUserLoggedIn()) {
            $scope.getCards();
        }

        $scope.getTitleDetail();


        $scope.watchNow = function () {
            $location.path("/player");
        };

        

        $scope.addBookmark = function () {
            
            if (checkLogin($location)) {
                $scope.canMoveFocus = false;
                productService.AddBookmark($routeParams.productID, function (data) {
                    $scope.showBookmarkPopUp = true;
                    $scope.title.isBookmarked = true;
                    setTimeout(function () {
                        $scope.showBookmarkPopUp = false;
                        $scope.canMoveFocus = true;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        //$scope.$apply();
                    }, 3000);

                }, function (data) {
                    $scope.canMoveFocus = true;
                    helper.showErrorMessage(popUpKey, $scope);
                }
                );
            }
            else
            {
                platformStorage.setItem("addBookmark",true);
            }

        };

        $scope.removeBookmark = function () {
            if (checkLogin($location)) {
                $scope.canMoveFocus = false;
                productService.RemoveBookmark($routeParams.productID, function (data) {
                    $scope.showBookmarkPopUp = true;
                    $scope.title.isBookmarked = false;
                    setTimeout(function () {
                        $scope.showBookmarkPopUp = false;
                        $scope.canMoveFocus = true;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        //$scope.$apply();
                    }, 3000);

                }, function (data) {
                    $scope.canMoveFocus = true;
                    helper.debugLog("removeBookmark>>failed");
                }
                );
            }

        };


        $scope.playPreview = function () {
            rbiCommonService.setSharedItem("PREVIEW_URL", $scope.title.previewURL);
            rbiCommonService.setSharedItem("PREVIEW_MEDIA_FORMAT", $scope.title.previewMediaFormat);
            $location.path('/preview/' + $scope.title.productId);
        };

        $scope.ShowRatingPopup = function () {
            $scope.showRatings = true;
        };

        $scope.RateMode = {
            Increase: 1,
            Decrease: -1
        };
        $scope.changeRating = function (ratemode) {
            switch (ratemode) {
                case $scope.RateMode.Increase:
                    $scope.ratval += 0.5;
                    $scope.ratval = $scope.ratval > 5 ? 5 : $scope.ratval;
                    break;
                case $scope.RateMode.Decrease:
                    $scope.ratval -= 0.5;
                    $scope.ratval = $scope.ratval < 0 ? 0 : $scope.ratval;
                    break;
            }
            angular.element(document.getElementsByClassName("rating_on")).css('width', $scope.rateWidth($scope.ratval));
            //$('.rating_on').css('width', $scope.rateWidth($scope.ratval));
        };

        $scope.rateWidth = function (value) {
            value = parseFloat(value);
            var $width = 0;
            switch (value) {
                case 0: $width = "0px"; break;
                case 0.5: $width = "28px"; break;
                case 1.0: $width = "56px"; break;
                case 1.5: $width = "88px"; break;
                case 2.0: $width = "116px"; break;
                case 2.5: $width = "150px"; break;
                case 3.0: $width = "178px"; break;
                case 3.5: $width = "208px"; break;
                case 4.0: $width = "236px"; break;
                case 4.5: $width = "270px"; break;
                case 5.0: $width = "297px"; break;
                default: $width = "0px";
            }
            return $width;
        };

        $scope.getRating = function () {
            var params = [];
            $scope.callDone = false;
            params.productID = $routeParams.productID;
            params.altCode = $scope.title.altCode;
            ratingReviewService.GetProductRating(params, function (data) {
                $scope.CustomerProductRating = data.getCustomerRating();
                $scope.AverageProductRating = data.getAverageRating();
                $scope.isRatedByCustomer = helper.isUserLoggedIn() && $scope.CustomerProductRating > 0;
                //$scope.isRatedByCustomer = false;
                var obj = titleDetailHelper.CalculateRatingFraction($scope.getTitleRating());
                $scope.title.ratingValue = obj.ratingValue;
                $scope.title.ratingValueStr = obj.ratingString;
                $scope.title.ratingCss = "sprite-rating-image";
                if ($scope.isRatedByCustomer) {
                    $scope.title.ratingMessage = "You have rated this title";
                    $scope.title.ratingLabel = "My Rating";
                    $('.rating_on').css('width', $scope.rateWidth($scope.title.ratingValue));
                    $scope.ratingCss = "sprite-red-rating-image";
                    $scope.title.ratingCss= "sprite-red-rating-image";
                } else {
                    $scope.title.ratingMessage = "Rate this title";
                    if ($scope.AverageProductRating == 0) {
                        $scope.title.ratingLabel = "Be the first to rate it!";
                        $scope.title.ratingMessage = "Be first to rate";
                    }
                    else { $scope.title.ratingLabel = "Fan Rating"; }
                }

                helper.debugLog('getProductRating succeeded');
                helper.debugLog('CustomerRating : ' + $scope.CustomerProductRating);
                helper.debugLog('AverageRating : ' + $scope.AverageProductRating);
                    $scope.omnitureReady[1] = true;
                $scope.callDone = true;
            },
                function (data) {
                    helper.debugLog('getProductRating failed');
                    $scope.omnitureReady[1] = true;
                    $scope.callDone = true;
                });
        };

        $scope.getReviews = function (pageNumber, pageSize) {
            var params = [];
            $scope.callDone = false;
            params.productID = $routeParams.productID;
            params.altCode = $scope.title.altCode;
            params.pageNumber = pageNumber;
            params.pageSize = pageSize;
            ratingReviewService.getProductReviews(params,
                function (data) {
	            	if(data.value.TotalReviews == 0){
	            		$scope.noReviews = true;
	            	}else{
	                    $scope.CustomerReview = data.value.CustomerHasReview;
	                    $scope.AverageReviewRating = data.value.AverageReviewRating;
	                    $scope.TotalReviews = data.value.TotalReviews;
	                    
	                    helper.isDefined($scope.Reviews) ? $.merge($scope.Reviews, data.value.Reviews) : $scope.Reviews = data.value.Reviews;
	                    $scope.CurrentReviews = data.value.Reviews;
	                    $scope.maxReviewPage = data.value.TotalReviews / 5;
	
	                    helper.debugLog('getProductRating succeeded');
	                    helper.debugLog('CustomerReview : ' + $scope.CustomerReview);
	                    helper.debugLog('AverageReview : ' + $scope.AverageReviewRating);
	                    helper.debugLog("REVIEWS DATA" + JSON.stringify(data));
	            	}
                    $scope.omnitureReady[2] = true;
                    $scope.callDone = true;
                },
                function (data) {
                    helper.debugLog('getProductRating failed');
                    $scope.omnitureReady[2] = true;
                    $scope.callDone = true;
                });
        };

        $scope.showRate = true;
        $scope.showReview = false;
        $scope.toggleReviewRating = function () {
            $scope.showReview = $scope.showRate;
            $scope.showRate = !$scope.showRate;
            //if($scope.showReview){$("#reviews").attr("tabindex",0);}
            //else{$("#reviews").removeAttr("tabindex")}
        };

        $scope.parseRating = function (rating) {
            var obj = titleDetailHelper.CalculateRatingFraction(rating);
            return obj;
        };

        $scope.getRatingType = function () {
            return $scope.CustomerProductRating != null ? "My Rating" : "Fan Rating";
        };

        $scope.saveRating = function () {
            if ($scope.ratval != 0) {
                if (checkLogin($location)) {
                    $scope.callDone = false;
                    var params = {
                        productID: $routeParams.productID,
                        altCode: $scope.title.altCode,
                        rating: $scope.ratval * 10,
                        productTitle: $scope.title.titleName,
                        productUrl: $scope.title.productUrl
                    }
                    ratingReviewService.RateProduct( params, function (data) {
                        if (data.value.ResultInfo.ResultCode == 0) {
                            helper.debugLog('rateProduct succeeded');

                            var alreadyRated = true;
                            $scope.getRating();
                                $scope.trackOmniture = "rating";
                                $scope.omnitureReady[0] = true;
                                $scope.showRatings = false;
                            //$scope.title.ratingMessage = "You have rated this title";
                        } else {
                            helper.debugLog('rateProduct failed');

                        }
                        $scope.callDone = true;
                    },
                    function (data) {
                        helper.debugLog("Save rating failed");
                        helper.debugLog(data);
                        $scope.callDone = true;
                    });
                }
                else
                {
                    platformStorage.setItem("isRating",true);
                    platformStorage.setItem("altCode",$scope.title.altCode);
                    platformStorage.setItem("rating",$scope.ratval);
                }
            }
        };

        $scope.getTitleRating = function () {
            if ($scope.isRatedByCustomer) {
                return $scope.CustomerProductRating;
            }
            else {
                return $scope.AverageProductRating;
            }
        };

        $scope.scrollReview = function (direction) {
    		//*** To Scroll through the reviews....
    		var totalPages = "";
    		if ($scope.reviewCount > 0 && $scope.TotalReviews != undefined) {
				if($scope.TotalReviews % 5 == 0){
					totalPages =  parseInt($scope.TotalReviews / 5);
				}else{
					totalPages = parseInt($scope.TotalReviews / 5)+1;
				}
    			
    		}
			if (direction==-1) {
				$scope.initPos -= $scope.scrollAmount;
    				$scope.initPos = $scope.initPos < 0 ? 0 : $scope.initPos;
    				eventHandler.startScrolling($scope.initPos);
					
			}
			else if (($scope.reviewCount) < totalPages) {
    		$scope.reviewCount = $scope.reviewCount + direction;
    		//if ($scope.reviewCount >= Math.round($scope.TotalReviews / 5)) $scope.reviewCount = Math.round($scope.TotalReviews / 5);
    		//if ($scope.TotalReviews <= 5) { $scope.reviewCount = 0; return; }
    		
    		  if ($scope.reviewCount <= totalPages && ($scope.Reviews.length < $scope.TotalReviews) && (direction == 1)) {
    		        $scope.getReviews(($scope.reviewCount), 5);
    		        $scope.reviewHeight += 305;
    		}
  		}
    		switch (direction) {
    			case 1:
    			  $scope.initPos += $scope.scrollAmount;
    			  //$scope.initPos = $scope.initPos > $scope.reviewHeight ? $scope.reviewHeight : $scope.initPos;
    			  if ((($("#allReviews")[0].scrollHeight - $("#allReviews")[0].scrollTop)==305)) {
    			      $scope.initPos = $("#allReviews")[0].scrollTop;
    			  }
    			  eventHandler.startScrolling($scope.initPos);
    				break;
    		}
//    		if ($scope.initPos >= 0 && $scope.initPos <= $scope.reviewHeight) {
//    			eventHandler.startScrolling($scope.initPos);
//    		}
    	}

        $scope.UserHasPurchasePermission = function () {
            var blockUser = helper.GetRestrictPurchase();
            if (blockUser == undefined) {
                return false;
            }
            return !blockUser;
        }



        $scope.playTitle = function () {

            //Omniture
            $scope.trackOmniture = "watchnow";
            $scope.omnitureReady[0] = true;
            //Omniture

            var productID = $scope.title.productId;
            var purchaseOptionID = $scope.title.watchNowPurchaseOptionId;
            // ZOE 24445 - Pass the HD / SD information to the player
            rbiCommonService.setSharedItem("HD_ASSET", $scope.isHD);
            rbiCommonService.setSharedItem(RATING, $scope.titleDetail.getRating());
            $location.path('/player/' + productID + '/' + purchaseOptionID); // need

        };

        $scope.checkAccountPassword = function (successCallBack, isKioskCheckout) {
            customerService.checkAccountPassword($scope.userPassword,
                function (checkPassword) {
                    helper.debugLog('pass good');
                    $scope.uiPWPopup = false;
                    successCallBack();
                },
                function (data) {
                    helper.debugLog('pass bad');
                    pwPopupHelper.showPWError($scope);
                    if (isKioskCheckout) {
                        $scope.CurrentLevelIndex = $scope.LEVEL_AT_PWPOPUP_KIOSK;
                    }
                    else {
                        $scope.CurrentLevelIndex = $scope.LEVEL_AT_PWPOPUP;
                    }

                });
        };

        function proceedToKioskCheckout() {
            //Omniture
            $scope.trackOmniture="kioskLocationFirst"
            $scope.omnitureReady[0]=true;
            //Omniture
            $scope.setKioskSharedData();
            helper.debugLog($location.path);
            $location.path("/kioskCheckout");
        }



        function showRentBuy(currentIndex) {
            //Omniture
            if (currentIndex == 0 || currentIndex == 1) {
                $scope.trackOmniture = "rent"
            }
            if (currentIndex == 2 || currentIndex == 3) {
                $scope.trackOmniture = "buy"
            }
            $scope.omnitureReady[0] = true;
            //Omniture
            platformStorage.setItem("titleRentBuyIndex", currentIndex);
            rbiCommonService.setSharedItem(CURRENT_INDEX, currentIndex);
            $scope.setSharedData();
            helper.debugLog($location.path)
            $location.path("/titleCheckout");

        }
		
	//to check if title is coming soon or not
    	$scope.isComingSoon = function (title, buttnName) {
    		var isComingSoon = title.titleDetail.isComingSoon();
    		if (isComingSoon) {
    			if (buttnName.toLowerCase().indexOf("box") >= 0 || buttnName.toLowerCase().indexOf("dvd") >= 0 || buttnName.toLowerCase().indexOf("blu-ray") >= 0) {
    				$scope.isATKioskListVisible = false;
    				$scope.onlyFindDVDPresent = false;
    				$scope.onlyFindBlueRayPresent = false;
    				$scope.kioskOptionBadgeLabel = "";
    				return false;
    			} else {
    				return true;
    			}
    		}
    		return true;

    	};
        // ZOE 21351 - check subscription status by making a GetCustomer call
        $scope.checkSubscriptionStatus = function (callbackFunc) {
            if (helper.isUserLoggedIn()) {
                helper.debugLog("checkSubscriptionStatus - user logged in");
                var emptyRequest = new RBI.GetCustomerSimpleRequest();
                var customerService = new RBI.CustomerService();
                customerService.init(new RBI.CustomerServiceConfig());

                customerService.getCustomer(emptyRequest,
                    function (customer) {
                        helper.debugLog("checkSubscriptionStatus - subscribed flag: " + customer.value.subscribed + "SubscriptionCancelled flag: " + customer.value.SubscriptionCancelled);
                        var anniversaryDate = customer.value.SubscriptionAnniversaryDate;
                        var subscriptionCancelled = ((customer.value.SubscriptionCancelled != null) && (customer.value.SubscriptionCancelled == true));
                        var isSubscriptionValid = customer.value.subscribed && !subscriptionCancelled;
                        if(anniversaryDate != null){
                          isSubscriptionValid = anniversaryDate >= new Date() ? true : false;
                        }
                        helper.debugLog("checkSubscriptionStatus - is subscribed: " + isSubscriptionValid);
                        callbackFunc(isSubscriptionValid);
                    },
                    function (data) {
                        helper.debugLog("checkSubscriptionStatus - getCustomer call failed");
                        callbackFunc(false);
                    });
            }
            else {
                helper.debugLog("checkSubscriptionStatus - user logged out");
                callbackFunc(false);
            }
        };

        // ZOE-32257 Display Blu-Ray logo trademark
        $scope.isBluRay = function(item) {
            return (item.toUpperCase()==BLU_RAY)?true:false;
        };


        $scope.isTitleOutOfStock = function (title, purchaseOption) {
           var outOfStock = false;
    	   if (isDefined(title.kioskId) && isDefined(purchaseOption.InStock) && (purchaseOption.InStock.toUpperCase() == 'FALSE')) {
               outOfStock = true;
    	   }
    	   return outOfStock;
        };

        //$scope.getTitleDetail();
        $scope.callOmniture = function () {
            if ($scope.omnitureReady.length > 0 && $scope.omnitureReady.indexOf(false) <= -1) {
                Omniture.Clear();
                if (internetConnected) {
                    switch ($scope.trackOmniture) {
                        case "load":
                        {
                            helper.debugLog("on load: Omniture page name: " + Omniture.pageName);
                            var deliveryTypes = $scope.titleDetail.getDeliveryTypes();
                            var genres = $scope.titleDetail.getGenres().join(",");
                            var omnitureDeliveryTypes = (isDefined(deliveryTypes) && deliveryTypes.length > 0) ? Omniture.getDeliveryTypes(deliveryTypes.map(function (e) {
                                return e.TypeValue
                            }).join(",")) : "";
                            helper.debugLog("omnitureDeliveryTypes: " + omnitureDeliveryTypes);

                            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|" + $scope.titleDetail.getProductType() + "s";
                            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|" + $scope.titleDetail.getProductType() + "s|" + omnitureDeliveryTypes;
                            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|" + $scope.titleDetail.getProductType() + "s|" + omnitureDeliveryTypes + "|" + genres;
                            Omniture.Variables.prop7 = $scope.titleDetail.getTitle();
                            Omniture.Variables.prop8 = genres;
                            Omniture.Variables.prop23 = Omniture.previousPageName;
                            Omniture.Variables.products = $scope.titleDetail.getProductID();
                            if (helper.isUserLoggedIn()) {
                                var rating = $scope.getTitleRating();
                                Omniture.Variables.eVar29 = (rating == 0) ? "zero" : rating;
                                Omniture.Variables.eVar30 = ($scope.noReviews) ? "zero" : $scope.TotalReviews;
                            }
                            else {
                                Omniture.Variables.eVar29 = "none";
                                Omniture.Variables.eVar30 = "none";
                            }
                            Omniture.Variables.eVar54 = "+1";
                            Omniture.Variables.eVar55 = "+1";
                            Omniture.Variables.events = ["prodview", "event3", "event33"];

                            helper.debugLog(JSON.stringify(Omniture.Variables));
                            Omniture.InvokeOmniture(Omniture.InvokeType.load);
                            break;
                        }
                        case "more":
                        {
                            Omniture.Variables.eVar3 = Omniture.pageName + "|" + $scope.clickedRecommendedProduct.title + "|more like this";
                            Omniture.Variables.prop12 = Omniture.pageName + "|more like this";
                            Omniture.Variables.products = $scope.clickedRecommendedProduct.productID;
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|more like this|" + $scope.clickedRecommendedProduct.title
                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }
                        case "bookmark":
                        {
                            if ($scope.title.isBookmarked == false) {
                                Omniture.Variables.prop9 = $scope.titleDetail.getTitle();
                                Omniture.Variables.products = $scope.titleDetail.getProductID();
                                Omniture.Variables.prop26 = $scope.titleDetail.getTitle() + "|bookmarked";
                                Omniture.Variables.events = ["event53"];
                                Omniture.Variables.eVar51 = Omniture.pageName + "|content|bookmark";
                                helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                                Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            }
                            break;
                        }
                        case "preview":
                        {
                            Omniture.Variables.prop13 = $scope.titleDetail.getTitle();
                            Omniture.Variables.products = $scope.titleDetail.getProductID();
                            Omniture.Variables.prop26 = $scope.titleDetail.getTitle() + "|preview";
                            Omniture.Variables.events = ["event59"];
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|watch preview";
                            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }
                        case "rating":
                        {
                            Omniture.Variables.events = ["event41"];
                            Omniture.Variables.prop26 = $scope.titleDetail.getTitle() + "|" + $scope.ratval;
                            Omniture.InvokeOmniture(Omniture.InvokeType.click)
                        }
                        case "review":
                        {
                            //Note:this feature available on web
                            break;
                        }
                        case "rent":
                        {
                            if (helper.isUserLoggedIn()) {
                                if (!isDefined(platformStorage.getItem("firstPurchase"))) {
                                    platformStorage.setItem("firstRent", true);
                                    Omniture.Variables.events.push("scopen")
                                }
                                Omniture.Variables.events.push("scadd", "event54");
                                Omniture.Variables.products = $scope.titleDetail.getProductID();
                                //Note: Not tracking following variable
                                //Omniture.Variables.eVar31=Omniture.pageName;
                                //Omniture.Variables.eVar59=$scope.titleDetail.getTitle();
                                Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + $scope.buttonName;
                                helper.debugLog("events: " + helper.convertArrayToString(Omniture.Variables.events));
                                helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                                Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            }
                            break;
                        }
                        case "buy":
                        {
                            if (helper.isUserLoggedIn()) {
                                if (!isDefined(platformStorage.getItem("firstPurchase"))) {
                                    platformStorage.setItem("firstRent", true);
                                    Omniture.Variables.events.push("scopen")
                                }
                                Omniture.Variables.events.push("scadd", "event60");
                                Omniture.Variables.products = $scope.titleDetail.getProductID();
                                //Note: Not tracking following variable
                                //Omniture.Variables.eVar31=Omniture.pageName;
                                //Omniture.Variables.eVar60=$scope.titleDetail.getTitle();
                                Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + $scope.buttonName;
                                helper.debugLog("events: " + helper.convertArrayToString(Omniture.Variables.events));
                                helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                                Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            }
                            break;
                        }
                        case "watchnow":
                        {
                            Omniture.Variables.eVar44 = "+1";
                            Omniture.Variables.eVar47 = $scope.titleDetail.getTitle();
                            Omniture.Variables.events = ["event51", "purchase"];
                            Omniture.Variables.products = $scope.titleDetail.getProductID();
                            Omniture.Variables.prop26 = $scope.titleDetail.getTitle() + "|watch now";
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|watch now";
                            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }
                        case "kioskTitleFirst":
                        {
                            Omniture.Variables.events = ["event19"];
                            Omniture.Variables.prop26 = $scope.titleDetail.getTitle() + "|find disc";
                            Omniture.Variables.products = $scope.titleDetail.getProductID();
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + $scope.buttonName;
                            helper.debugLog("events: " + helper.convertArrayToString(Omniture.Variables.events));
                            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }
                        case "kioskLocationFirst":
                        {
                            //Omniture.Variables.eVar31=Omniture.pageName;
                            if ($scope.titleDetail.getProductType().toLocaleLowerCase() == "movie") {
                                Omniture.Variables.eVar40 = "+1";
                                if (!isDefined(platformStorage.getItem("firstPurchase"))) {
                                    platformStorage.setItem("firstRent", true);
                                    Omniture.Variables.events.push("scopen")
                                }
                                Omniture.Variables.events.push("scadd", "event69");
                                Omniture.Variables.products = $scope.titleDetail.getProductID();
                                Omniture.Variables.prop26 = $scope.titleDetail.getTitle() + "|reserve";
                            }
                            else {
                                Omniture.Variables.eVar31 = Omniture.pageName;
                                if (!isDefined(platformStorage.getItem("firstPurchase"))) {
                                    platformStorage.setItem("firstRent", true);
                                    Omniture.Variables.events.push("scopen")
                                }
                                Omniture.Variables.events.push("scadd", "event69");
                                if (!isDefined(platformStorage.getItem("firstPurchase"))) {
                                    platformStorage.setItem("firstRent", true);
                                    Omniture.Variables.events.push("scopen")
                                }
                                Omniture.Variables.events.push("scadd", "event69");
                                Omniture.Variables.products = $scope.titleDetail.getProductID();
                            }
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + $scope.buttonName;
                            helper.debugLog("events: " + helper.convertArrayToString(Omniture.Variables.events));
                            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);

                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }

                        case "subscribe":
                        {
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|subscribe now";
                            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }

                        //TODO: Verify if we need to track this
                        case "atTheBox":
                        {
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|at the box";
                            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                            Omniture.InvokeOmniture(Omniture.InvokeType.click);
                            break;
                        }
                    }
                }
                $scope.omnitureReady[0] = false;
            }
        }
        var unbindOmniture=$scope.$watch("omnitureReady", function () {
            $scope.callOmniture()
        }, true);

        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
        if (isDefined(platformStorage.getItem("addBookmark"))) {
        	platformStorage.removeItem("addBookmark");
        	if (helper.isUserLoggedIn()) //ZOE-36027
            $scope.addBookmark();
        }
        if (isDefined(platformStorage.getItem("isRating"))) {
            $scope.title.altCode=platformStorage.getItem("altCode");
            $scope.ratval=platformStorage.getItem("rating");
            platformStorage.removeItem("isRating");
            platformStorage.removeItem("altCode");
            platformStorage.removeItem("rating");
            if (helper.isUserLoggedIn()) //ZOE-36027
             $scope.saveRating();
        }
        // LG - ZOE-34244
        if (RBI.PlatformConfig.deviceType == "LG"){
            if(lgBackTitleDetail){
                lgBackTitleDetail = false;
                $location.path('/login'+$location.path());
            }
        }
    }
)

