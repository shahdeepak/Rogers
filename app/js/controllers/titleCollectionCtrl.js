/**
 * Collection Page Controller
 * This controller is responsible for displaying the Collections page.
 */

'use strict';

rbi.controller('titleCollectionCtrl',
    function ($scope, $dialog, $routeParams, $location, promotionService, collectionService, productService) {

        //Omniture
        Omniture.pageName = "";
        $scope.omnitureReady[0] = false;
        //Omniture

        /////////////////////////////////////////////////////////////////
        // event handling
        var eventHandler = new titleCollectionEventHandler($scope, $location);
        $scope.eventHandler = eventHandler;
        sharedScopeWithMenu($scope, $location);
        hideMainMenu();
	    $scope.currentItemId = '0_0';  // make first title the default selection
        $scope.currentIndex = 0;
        $scope.showMainMenu = false;
        $scope.backgroundStyle= "";

		addToBackPaths('/titleCollection/' + $routeParams.productId);

        /////////////////////////////////////////////////////////////////

        var allProductData = [];
		var pIdArray = [];
        $scope.allTitlesInCollection = [];  // array holding all items in the collection
        $scope.collectionTitle = '';  // holds title string of collection

        promotionService.GetPromotions(RBI.PlatformConfig.promotionsDeviceType, "Homepage-Subscription,Homepage-EST,Homepage-DVD,Homepage-Trial",
            function (allPromotions) {
                //success
                var productIds = [];  // array of product Ids for this collection
                var promotion = {};   // holds one promotion object
                var allPromotions = allPromotions.promotions;  // extract the array of promotions

                for (var i = 0; i < allPromotions.length; i++) {
					// look through all the promotions to find the one we want
					// this is a workaround for a missing api which should return same info when given a Promotion ID
                    promotion = allPromotions[i];
                    //promotion.value.PromotionId == $routeParams.productId
                    if (promotion.getPromotionId() == $routeParams.productId) {
                        // this promotion is the collection we want
                        // ZOE-30098: if background image URL is not supplied use back background; promotion title should use 'contextText; field
                        $scope.bgImageUrl = promotion.getBackgroundImageUrl(); //value.Image.BackgroundImageUrl;
                        $scope.backgroundStyle = (isDefined($scope.bgImageUrl) && $scope.bgImageUrl != '' && $scope.bgImageUrl != 'NULL')? 'url('+ $scope.bgImageUrl +')':'black';
                        $scope.collectionTitle = promotion.getContentText();
                        productIds = collectionService.getProductIds(promotion);  // extract the product ids from the promotion object

                        for (var i = 0; i < productIds.length; i++) {
                            pIdArray.push({key:productIds[i]});
                            getOneProductDetails(productIds[i], i==productIds.length-1);
                        }
												
                        break;  // we've processed the collection we want, so we don't need to look at the rest
                    }
                }
            },
            function (data) {
                //failure
            }
        );

        function getSorted(arr, sortArr) {
            var result = [];
            for(var i=0; i<arr.length; i++) {
                for(var j=0; j<sortArr.length; j++) {
                    if(arr[i].key == sortArr[j].value.ProductID)
                        result[i] = sortArr[j];
                }
            }
            return result;
        }

        //////////////////////////////////////////////////////////////////
				// get the product details from the C3 api for one individual product (title)
        function getOneProductDetails(pid, isLastItem) {
            var params = [];
            params.productId = pid;

            productService.GetProductDetailByProductID(params,
                function (data) {
                    // success
                    allProductData.push(data);
                    $scope.allTitlesInCollection = getSorted(pIdArray, allProductData);
                    if (isLastItem) {
                        $scope.omnitureReady[0] = true;
                    }
                    $scope.$$phase || $scope.$apply();  // update the $scope variables if they are not already in the process of being updated
                },
                function (data) {
                    // failure
                });
        }
        //////////////////////////////////////////////////////////////////
				// Badging
				//
        $scope.isKiosk = function (title) {
            return (title.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK) >= 0) ; //Kiosk
        }

        $scope.isVOD = function (title) {
            return (title.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND) >= 0);    //bookmark
        }

        $scope.isSubscription = function (title) {
            return (title.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION) >= 0) ;      //play
        }

//        $scope.isDVD = function (title) {
//            return (title.getMediaFormatBadges().indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD) >= 0);       //dvd
//        }
//
//        $scope.isBluRay = function (title) {
//            return (title.getMediaFormatBadges().indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY) >= 0);      //blu-ray
//        }
//
//        $scope.isRentBuy=function(title){
//            return ($scope.selectedFilterItem == $scope.ESTID)
//        }

        function getNumBadges(title) {
            var numBadges = 0;
            if ($scope.isKiosk(title)) { numBadges++; }
            if ($scope.isSubscription(title)) { numBadges++; }
            if ($scope.isVOD(title)) { numBadges++; }
            return numBadges;
        }

        $scope.titleWidth = function (title) {
            var numBadges = getNumBadges(title);
            var width = (numBadges > 0)? helper.getTitleWidth(IMAGE_POSTER_WIDTH, numBadges, MEDIA_FORMAT_BADGE_WIDTH) : IMAGE_POSTER_WIDTH;
            return width + "px";
        }

        // Determine if the title needs to scroll
        // The title needs to be selected and overflow the available space
        $scope.scrollTitle = function(isSelected, item) {
            var scroll = false;
            if (isSelected) {
                var numBadges = getNumBadges(item);
                if (helper.needsScroll(item.getTitle(), numBadges, false)) {
                    scroll = true;
                }
            }
            return scroll;
        }

        $scope.isSelected = function(item) {
           if (item == $scope.currentItemId)  {
               return true;
           }
            else {
               return false;
           }
        }
				//
				// end of Badging
        //////////////////////////////////////////////////////////////////

        // Omniture ///
        function omnitureOnLoad() {
            Omniture.Clear();
            if (internetConnected) {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|promo|" + $scope.collectionTitle;
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies";
                Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|promo";
                Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|product|movies|promo";
                Omniture.Variables.prop23 = Omniture.previousPageName;
                Omniture.Variables.eVar54 = "+1";
                var prevPage = backPaths[backPaths.length - 2];
                if (!(isDefined(prevPage) && ((prevPage.indexOf('titleDetail') != -1) || (prevPage.indexOf('browse') != -1)))) {
                    // The following tags do not fire if previous page was title details or browse page
                    Omniture.Variables.events.push("event33");
                    Omniture.Variables.products = $routeParams.productId;
                }
                Omniture.InvokeOmniture(Omniture.InvokeType.load);
            }
            $scope.omnitureReady[0] = false;
        }


        $scope.omnitureOnClick = function (index, productID) {
            Omniture.Clear();
            if (internetConnected) {
                var title = $scope.allTitlesInCollection[index].getTitle();
                Omniture.Variables.eVar3 = Omniture.pageName + "|" + title + "|stunt pages";
                Omniture.Variables.prop12 = Omniture.pageName + "|stunt pages";
                Omniture.Variables.products = productID;
                Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + title;
                Omniture.InvokeOmniture(Omniture.InvokeType.click);
            }
        };

        var unbindOmniture = $scope.$watch("omnitureReady", function () {
            if ($scope.omnitureReady.length > 0 && $scope.omnitureReady.indexOf(false) <= -1) {
               omnitureOnLoad();
            }
        }, true);

        if (!RBI.PlatformConfig.OmnitureEnabled) {
            unbindOmniture();
        }
    });
