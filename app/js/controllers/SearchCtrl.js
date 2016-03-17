/**
 * Search controller
 * Populates list of movie titles and calls title details
 */
'use strict';

rbi.controller('searchCtrl', function ($scope, $location, $routeParams, productService, rbiCommonService) {

    //Omniture
    Omniture.pageName = "";
    $scope.omnitureReady = [false];
    $scope.trackOmniture = [];
    //Omniture
    //helper.ReleaseMemory();
    var LEVEL_TEXTBOX = 1;
    var LEVEL_LIST = 3;
    $scope.filterIndex = 3;
    $scope.titles = [];
    $scope.gridtitles = [];
    $scope.search_term = '';
    $scope.filter = '';
    $scope.levelIndex = '';
    $scope.pageIndex = '';
    $scope.currentpageNum = '';
    $scope.currentpageIndex = 0;
    $scope.keyPress = '';
    $scope.row = 1;
    $scope.currentIndex = 0;
    $scope.searchString = '';
    $scope.dataLoaded = false;
    $scope.startTime = new Date().getMilliseconds();
    //$("#loading-bar").hide();
	//This flag is to show no results error message after data loaded.
	$scope.showNoResultMessage = false;
    addToBackPaths($location.path());
    hideMainMenu();

	//this is to reset the QueryID when we come back to search.
	rbiCommonService.removeSharedItem('QueryID');

    $scope.top_margin_offset = 110 * 3;

    $scope.top_margin_con_offset = 290;

    $scope.first_page_margin_offset = 30;

    $scope.saveTitleListMargin = 0;

    $scope.selectedFilterItem = $scope.SubscriptionID;

    var eventHandler = new searchEventHandler($scope, $location, $routeParams);
    sharedScopeWithMenu($scope, $location);
    $scope.CurrentLevelIndex = 1;
    $scope.maxelements = '';

    $scope.eventHandler = eventHandler;
    $scope.levelMap = [];

    $scope.levelMap[LEVEL_TEXTBOX] = {
        CurrentIndex: 0,
        MaxElements: 1,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };

    $scope.levelMap[LEVEL_LIST] = {
        CurrentIndex: 0,
        MaxElements: 3,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };

    helper.SetFocus('searchBox');
    helper.SetFocus('1_0');
    

    var popUpKey = 'Error_PopUp';

    // Message for recommended titles...
    var MSG1 = "Sorry, we couldn't find any titles matching you request.";
    var MSG2 = "Sorry, we couldn't find any titles matching your request. Would you like to try one of our suggested titles?";
    $scope.RecommendedErrorMsg = "";
    $scope.recommendedTitles = false;

    productService.LoadFilters(RBI.PlatformConfig.deviceType, "Movie",
        function () {

            //success
            $scope.availabilities = productService.Availabilities();
           

            for (var i = 0; i < $scope.availabilities.length; i++) {

                switch ($scope.availabilities[i].name) {
                    case 'Subscription':
                        {
                            $scope.SubscriptionID = $scope.availabilities[i].id;
                            break;
                        }

                    case 'Kiosk':
                        {
                            $scope.KioskID = $scope.availabilities[i].id;
                            break;
                        }
                    case 'EST':
                        {
                            $scope.ESTID = $scope.availabilities[i].id;
                            break;
                        }
                    case 'VOD':
                        {
                            $scope.VODID = $scope.availabilities[i].id;
                            break;
                        }
                    case 'All':
                        {
                            $scope.AllID = $scope.availabilities[i].id;
                            break;
                        }
                }
            }
            if(RBI.PlatformConfig.showGames){
            $scope.gameavailabilities = productService.Gameavailabilities();
            for (var i = 0; i < $scope.gameavailabilities .length; i++) {

                switch ($scope.gameavailabilities[i].name) {
                   
                    case 'Kiosk':
                        {
                            $scope.GameKioskID = $scope.gameavailabilities[i].id;
                            break;
                        }
                   
                    case 'All':
                        {
                            $scope.GameAllID = $scope.gameavailabilities[i].id;
                            break;
                        }
                }
            }
            }
            if (isDefined(searchFilterData)) {
                $scope.searchString = searchFilterData.searchTerm;
                $scope.filterIndex = searchFilterData.filterIndex;
                if ($scope.filterIndex == 1){
                	if(RBI.PlatformConfig.showGames)
                        $scope.filterTerm = $scope.KioskID+ ',' + $scope.GameKioskID;
                    	else
                    		$scope.filterTerm = $scope.KioskID;
                }
                else if ($scope.filterIndex == 2)
                    $scope.filterTerm = $scope.ESTID + ',' + $scope.VODID;
                else {
                	
                    $scope.filterIndex = 3;
                    if(RBI.PlatformConfig.showGames)
                        $scope.filterTerm = $scope.AllID+ ',' + $scope.GameAllID;
                        else
                        	$scope.filterTerm = $scope.AllID;
                }

                $scope.searchTitles($scope.searchString, $scope.filterTerm, 1);
                if(!$scope.$$phase)$scope.$apply();
                $('#2_' + $scope.filterIndex).addClass("menu-itemHighlight");

            }
        },
        function () {
            // request failure
            helper.showErrorMessage(search, $scope);
            helper.debugLog("Error Occured");
        });


	$scope.$watch('searchString', function (value, oldSearchText) {
        if(oldSearchText != $scope.searchString){
            $scope.searchString = value;
            $scope.showNoResultMessage = false;
            eventHandler.hideRecommendationMessage();
            $scope.doSearch();
        }

    });



    $scope.searchTitles = function (searchString, filter, pageNum) {
        if ($scope.searchString != '' && isDefined($scope.searchString) && 0 != $scope.searchString.length) {
            $scope.gridtitles = [];
            $scope.titles = [];
            productService.productSearch(searchString, filter, pageNum, function (data) {

                var filters =
                {
                    "searchTerm": $scope.searchString,
                    "filterTerm": filter,
                    "filterIndex": $scope.filterIndex
                };
                helper.SaveCurrentSearchFilters(filters, "searchFilters");
                $scope.search_term = searchString;
                $scope.titles = data.getProducts();
                $scope.title_list_margin = 0;
                $scope.row = 1;
                var LEVEL_TEXTBOX = 1;
                var LEVEL_LIST = 3;
                //$("#loading-bar").hide();
                $scope.pageNum = pageNum;


                $scope.top_margin_offset = 110 * 3;

                $scope.top_margin_con_offset = 309;

                $scope.first_page_margin_offset = 30;

                //Hide the recommendations message...
                eventHandler.hideRecommendationMessage();
                $scope.recommendedTitles = false;

                if ($scope.titles.length > 0) {
                    searchDataPopulation(data, pageNum);
                    $scope.trackOmniture.push("loadWithSearchParams");
                    $scope.omnitureReady = [true];

                }
                else {
                    $scope.trackOmniture.push("loadWithSearchParamsWithNull");
                    $scope.omnitureReady = [true];
                    $scope.doProductSearchForNosearchSenario(pageNum);
                }
            }, function (data) {
                helper.showErrorMessage(data, $scope);
                // in the case of error response show 'no results found' in Omniture
                $scope.trackOmniture.push("loadWithSearchParamsWithNull");
                $scope.omnitureReady = [true];
                helper.SetFocus('searchBox');
                helper.SetFocus('1_0');
                $('#1_0').addClass("textbox-highlight");
                $scope.dataLoaded = true;
				$scope.showNoResultMessage = true;
            });
        }
    };

    $scope.isKiosk = function (title) {
        return ((title.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK) >= 0) && ($scope.filterIndex == 0 || $scope.filterIndex == 3)); //Kiosk
    };

    $scope.isVOD = function (title) {
        return ((title.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND) >= 0) &&
            ($scope.filterIndex == 3));    //bookmark
    };

    $scope.isSubscription = function (title) {
        return ((title.getDeliveryTypeBadges().indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION) >= 0) && ($scope.filterIndex == 3));      //play
    };

    $scope.isDVD = function (title) {
        return ((title.getMediaFormatBadges().indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD) >= 0) && ($scope.filterIndex == 1));       //dvd
    };

    $scope.isBluRay = function (title) {
        return ((title.getMediaFormatBadges().indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY) >= 0) && ($scope.filterIndex == 1));      //blu-ray
    };

    $scope.isRentBuy = function (title) {
        return ($scope.filterIndex == 2)
    };

    function getNumBadges(title) {
        var numBadges = 0;
        if ($scope.isKiosk(title)) { numBadges++; }
        if ($scope.isSubscription(title)) { numBadges++; }
        if ($scope.isVOD(title)) { numBadges++; }
        if ($scope.isDVD(title)) { numBadges++; }
        if ($scope.isBluRay(title)) { numBadges++; }
        return numBadges;
    }

    // Determine max title width based on number of badges
    $scope.titleWidth = function (title) {
        var numBadges = getNumBadges(title);
        var badgeWidth = ($scope.filterIndex == 1) ? KIOSK_BADGE_WIDTH : MEDIA_FORMAT_BADGE_WIDTH;
        var width = (numBadges > 0) ? helper.getTitleWidth(IMAGE_POSTER_WIDTH, numBadges, badgeWidth) : IMAGE_POSTER_WIDTH;
        return width + "px";
    };
    // Preloading the titles for the user to know that there are more titles...
    $scope.preloadRecommendedTitles = function (searchString, filter, newpage) {
        var count = $scope.currentPage * 24;
        if ($scope.maxelements >= count || $scope.row <= $scope.totRows) {
            var params = [];
            params.PageNumber = newpage;

            $scope.dataLoaded = false;
            $scope.gridtitles = [];

            productService.getTopInTitles(params, $scope, function (data) {
                $scope.gridtitles = data.getRecommendedProducts();
                $scope.dataLoaded = true;

            }, function (data) {
                helper.showErrorMessage(data, $scope);
                $scope.dataLoaded = true;
            });
        }
    };
    // Preloading the titles for the user to know that there are more titles...
    $scope.preloadTitles = function (searchString, filter, newpage) {
        var count = $scope.currentPage * 24;
        if ($scope.maxelements >= count || $scope.row <= $scope.totRows) {
            $scope.dataLoaded = false;

            $scope.gridtitles = [];
            productService.productSearch(searchString, filter, newpage, function (data) {
                    //$scope.currentPage = newpage;
                    $scope.gridtitles = data.products;

                $scope.dataLoaded = true;
            }
        , function (data) {
            helper.showErrorMessage(data, $scope);
            $scope.dataLoaded = true;

        });
        }
    };

    $scope.displayelements = function (searchString, filter, newpage) {
        var count = $scope.currentPage * 24;
        if ($scope.maxelements >= count || $scope.row <= $scope.totRows) {
            $scope.dataLoaded = false;

            $scope.titles = [];
            productService.productSearch(searchString, filter, newpage, function (data) {
                $scope.currentPage = newpage;
                //$scope.titles.push.apply($scope.titles, data.products);
                $scope.titles = data.products;
                if($scope.titles.length < 4)  $scope.currentIndex = 0;
                $scope.dataLoaded = true;
            }
        , function (data) {
            helper.showErrorMessage(data, $scope);
            $scope.dataLoaded = true;

        });
        }
    };

    $scope.displayRecommendedElements = function (searchString, filter, newpage) {
        var count = $scope.currentPage * 24;
        if ($scope.maxelements >= count || $scope.row <= $scope.totRows) {
            $scope.dataLoaded = false;
            var params = [];
            params.PageNumber = newpage;
            $scope.titles = [];
            productService.getTopInTitles(params, $scope, function (data) {
                    $scope.currentPage = newpage;
                    $scope.titles = data.getRecommendedProducts();
                    if($scope.titles.length < 4)  $scope.currentIndex = 0;
                    $scope.dataLoaded = true;
                }
                , function (data) {
                    helper.showErrorMessage(data, $scope);
                    $scope.dataLoaded = true;

                });
        }
    };

    $scope.doSearch = function () {
        $("#loading-bar").show();
        helper.debugLog("search string: " + $scope.searchString);
        if ($scope.searchString != '' && isDefined($scope.searchString)) {
            setTimeout(function(){
                var searchFilterData = helper.getStoredSearchFilters("searchFilters");
                if (isDefined(searchFilterData))
                    $scope.filter = searchFilterData.filterTerm;
                else{
                	if(RBI.PlatformConfig.showGames)
                        $scope.filter = $scope.AllID+ ',' + $scope.GameAllID;
                        else
                        	$scope.filter = $scope.AllID;
                }

                $scope.searchTitles($scope.searchString, $scope.filter, 1);
                if(!$scope.$$phase)$scope.$apply();
                $('#2_' + $scope.filterIndex).addClass("menu-itemHighlight");
                //$("#grid-item-longwrapper").stop().animate({ marginTop: 0 }, 500);
                $("#grid-item-longwrapper").css({marginTop: 0});
            	
           },700);
            
        } else {
            helper.RemoveFocus('1_0');
            helper.RemoveFocus('searchBox');
            $('#1_0').removeClass("textbox-highlight");
            helper.SetFocus('searchBox');
            helper.SetFocus('1_0');
            $('#1_0').addClass("textbox-highlight");
            
                $scope.titles = [];
                $scope.gridtitles = [];
                $scope.search_term = '';
            

        }
    };


    var searchFilterData = helper.getStoredSearchFilters("searchFilters");


    // Determine if the title needs to scroll
    // The title needs to be selected and overflow the available space
    $scope.scrollTitle = function (isSelected, item) {
        var scroll = false;
        if (isSelected) {
            var numBadges = getNumBadges(item);
            if (helper.needsScroll(item.getTitle(), numBadges, $scope.filterIndex == 1)) {
                scroll = true;
            }
        }
        return scroll;
    };

    ////for Badge information of coming soon
    $scope.isComingSoon = function (title) {
        return (title.getAvailabilityBadges().indexOf(RBI.Product.Defines.BADGE_AVAILABILITY_COMING_SOON) >= 0);
    };

    ////for Badge information of New Release
    $scope.isNewRelease = function (title) {
        return (title.getAvailabilityBadges().indexOf(RBI.Product.Defines.BADGE_AVAILABILITY_NEW_RELEASE) >= 0);
    };



    //API call for No search senario
    $scope.doProductSearchForNosearchSenario = function (pageNum) {
        $scope.currentGenreID = ""; // genre id
        $scope.currentAvailabilityID = ""; // view
        $scope.currentContentRatingID = ""; // rating
        $scope.currentFormatID = ""; //format
        $scope.currentSpecialID = "";
        $scope.KioskId = "";
        var params = [];
        params.PageNumber = pageNum;
        productService.getTopInTitles(params, $scope, function (data) {

            $scope.titles = [];
            $scope.titles = data.getRecommendedProducts();
            rbiCommonService.setSharedItem('QueryID',data.getQueryID());
            $scope.title_list_margin = 0;
            var LEVEL_TEXTBOX = 1;
            var LEVEL_LIST = 3;
            $scope.pageNum = pageNum;

            $scope.top_margin_offset = 110 * 3;

            $scope.top_margin_con_offset = 309;

            $scope.first_page_margin_offset = 30;

            $scope.dataLoaded = true;

            if ($scope.titles.length > 0) {
                $scope.recommendedTitles = true;
                eventHandler.showRecommendationMessage(MSG2);
                searchDataPopulation(data, pageNum);
            }
            else {
				$scope.showNoResultMessage = true;
//                $scope.trackOmniture.push("loadWithSearchParamsWithNull");
//                $scope.omnitureReady = [true];
            }

        }, function (data) {
            helper.showErrorMessage(data, $scope);
            helper.SetFocus('searchBox');
            helper.SetFocus('1_0');
            $('#1_0').addClass("textbox-highlight");
            $scope.dataLoaded = false;
			$scope.showNoResultMessage = true;
        });
    };

    //populates search data
    function searchDataPopulation(data, pageNum) {
        var eventHandler = new searchEventHandler($scope, $location, $routeParams);
        $scope.CurrentLevelIndex = 3;
        $scope.maxelements = data.getPageInfo().getCount();
        $scope.totRows = Math.ceil($scope.maxelements / 4);
        $scope.numPages = Math.ceil(($scope.maxelements/ 24), 1);
        $scope.currentPage = pageNum;

        $scope.eventHandler = eventHandler;
        $scope.IsMenubarVisible = true;
        $scope.levelMap = [];

        $scope.levelMap[LEVEL_TEXTBOX] = {
            CurrentIndex: 0,
            MaxElements: 1,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 1
        };
        $scope.levelMap[LEVEL_LIST] = {
            CurrentIndex: 0,
            MaxElements: $scope.titles.length,
            CanHandleRightKey: false,
            CanHandleLefttKey: false,
            FirstElement: 4
        };

        helper.RemoveFocus('searchBox');
        helper.RemoveFocus('1_0');
       
        helper.SetFocus('divid_0');
        //$('#divid_0').addClass("list-item-img-highlight");
        angular.element(document.getElementById("divid_0")).addClass("list-item-img-highlight");
        $scope.dataLoaded = true;
        //$("#loading-bar").hide();
    }

    //Omniture
    $scope.OmnitureAvailabilityType = {
        0: "instant",
        1: "ondisc",
        2: "ondemand",
        3: "all"
    };

    function omnitureTracking() {
        Omniture.Clear();

        if(helper.isDefined($scope.trackOmniture) && $scope.trackOmniture.length > 0 && internetConnected)
        {
            for(var i=0;i<$scope.trackOmniture.length;i++)
            {
                if ($scope.trackOmniture[i] == "loadWithOutSearchParams") {
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|search|enter keyword";
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|search|";
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|search|enter keyword";
                    Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|search|enter keyword";
                    Omniture.Variables.prop23 = Omniture.previousPageName;
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    Omniture.previousPageName = Omniture.pageName;  // remember the previous page name since it changes when user changes categrory or delivery type
                }
                else if ($scope.trackOmniture[i] === "loadWithSearchParams") {
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|search results|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|search results";
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|search results|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|search results|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.prop4 = $scope.searchString;
                    Omniture.Variables.prop14 = ($scope.maxelements == 0)? "zero":$scope.maxelements.toString();
                    Omniture.Variables.prop23 = Omniture.previousPageName;
                    Omniture.Variables.eVar1 = $scope.searchString;
                    Omniture.Variables.eVar33 = "+1";
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.Variables.events = ["event1", "event33"];
                    helper.debugLog("on load: Omniture page name: " + Omniture.pageName);
                    helper.debugLog(JSON.stringify(Omniture.Variables));
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    Omniture.previousPageName = Omniture.pageName;  // remember the previous page name since it changes when user changes categrory or delivery type
                }
                else if ($scope.trackOmniture[i] === "loadWithSearchParamsWithNull") {
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|search results null|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|search results null";
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|search results null|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|search results null|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.prop4 = $scope.searchString;
                    Omniture.Variables.prop14 = "zero";
                    Omniture.Variables.prop23 = Omniture.previousPageName;
                    Omniture.Variables.eVar1 =  $scope.searchString;
                    Omniture.Variables.eVar33 = "+1";
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.Variables.events = ["event1", "event2", "event33"];
                    helper.debugLog("on load: Omniture page name: " + Omniture.pageName);
                    helper.debugLog(JSON.stringify(Omniture.Variables));
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    Omniture.previousPageName = Omniture.pageName;  // remember the previous page name since it changes when user changes categrory or delivery type
                }
                else if ($scope.trackOmniture[i] === "deliverychange") {
                    Omniture.Variables.eVar51 = Omniture.pageName + "|header|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.InvokeOmniture(Omniture.InvokeType.click);
                }
                else if ($scope.trackOmniture[i] === "thumbnailClicked") {
                    var titleNo = $scope.currentIndex + 1;
                    var thumbnailPos = helper.getThumbnailPosition(titleNo, 4);
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|search result|" + $scope.OmnitureAvailabilityType[$scope.filterIndex];
                    Omniture.Variables.eVar3 = Omniture.pageName + "|" + $scope.movieName + "|internal search";
                    Omniture.Variables.prop12 = Omniture.pageName + "|internal search";
                    Omniture.Variables.products = $scope.productID;
                    Omniture.Variables.eVar51 = Omniture.pageName + "|" + thumbnailPos + "|" + $scope.movieName;
                    helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                    Omniture.InvokeOmniture(Omniture.InvokeType.click);
                }
            }
            $scope.trackOmniture = [];

        }

    }

    var unbindOmniture = $scope.$watch("omnitureReady", function () {
        omnitureTracking()
    });
    if (!RBI.PlatformConfig.OmnitureEnabled) {
        unbindOmniture();
    }
    if (!isDefined(helper.getStoredSearchFilters("searchFilters"))) {
        $scope.trackOmniture.push("loadWithOutSearchParams");
        $scope.omnitureReady = [true];
    }

});