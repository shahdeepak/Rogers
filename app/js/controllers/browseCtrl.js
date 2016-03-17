'use strict';

/**
 * Browse Controller
 * This controller is responsible for retrieving the bookmarks and
 * displaying the data on the UI.
 */
rbi.controller('browseCtrl', function ($scope, $location, $routeParams, productService, rbiCommonService) {
    //attaching the event handler to the controller
    //Omniture
    Omniture.pageName = "";
    //Omniture
    //helper.ReleaseMemory();

    $scope.trackOmniture = [];
    $scope.omnitureReady = [];
    //$scope.trackOmniture[0] = OMNITURE_BROWSE.PAGE_LOAD;
    $scope.omnitureReady=[false];
    var eventHandler = new BrowseEventHandler($scope, $location, $routeParams, productService ,rbiCommonService);
    sharedScopeWithMenu($scope, $location);
    //default values of the scope level variables
    $scope.canScrollDown = true;
    $scope.filter1 = [];
    $scope.eventHandler = eventHandler;
    $scope.filter2 = [];
    $scope.filter3 = [];
    $scope.defaultvaluefortheCategoryIndex = 0;
    $scope.startTime = new Date().getMilliseconds();

    $scope.column2Header = 'Category';
    $scope.column2Class = 'column2-single-title-highlight';
    $scope.currentView = {};
    $scope.currentFormat = {};
    $scope.currentRating = {};
    $scope.currentFilter = false;
    $scope.uiFilterPopupOpen = false;
    $scope.genreSelectedOrChanged = false;
    $scope.genresApplicable = false;

    $scope.currentIndexForMovies = 0;
    $scope.currentIndexForTop = 0;
    $scope.IsSecondRowSelected = false;
    $scope.pageCount = 0;
    $scope.currentIndexForMovieFormat = "";
    $scope.currentFormatName = "All";
    $scope.currentIndexForViewNavBar = 0;
    $scope.tabsChanged = false;
    $scope.newMarginTop =  0; // this is to set the top in category margin
    $scope.dataLoaded = true;
    $scope.showHangOnthere = false;

    $scope.filterClicked=false;
    $scope.categoryClicked=false;
    $scope.resetCategory = false;

    if (RBI.PlatformConfig.showGames == true)
        $scope.addstyle = true;
    else
        $scope.addstyle = false;

    addToBackPaths($location.path());
    if ($routeParams.productType == "Movie") {
        $scope.currentIndexOfTopBar = 0;
    }
    else {
        $scope.currentIndexOfTopBar = 1;
    }
    $scope.subscriptionID = "";
    $scope.atBox = "";
    $scope.rentBuyID = "";
    $scope.allID = "";

    $scope.gamePS3ID = '';
    $scope.gameWIIID = '';
    $scope.gameXBox360ID = '';
    $scope.gameAllID = '';

    $scope.selectedRatingFilterIndex = 0;
    $scope.selectedViewFilterIndex = 0;
    $scope.selectedFormatFilterIndex = 0;
    $scope.selectedSortFilterIndex = 0;
    $scope.filterTwoIndex = 0;

    $scope.pageloaded = false;
    $scope.selectedFilterItem = $scope.subscriptionID;
    $scope.filtersLoaded = false;
    var params = [];
    $scope.pageNumber = 1;
    $scope.level_TAB = 0;
    $scope.level_VIEW = 1;
    $scope.level_GRID = 2;
    $scope.level_TOP_GRID = 3;
    $scope.level_MENU = 100;
    $scope.tab1 = '0_0';
    $scope.tab2 = '0_1';
    $scope.levelMap = [];
    $scope.currentLevelIndex = $scope.level_GRID;

    $scope.gridTitles = [];
    //$scope.titles = []; // commenting out since this shows fro a split second on load...
    $scope.allTitles=[];
	
	//to check for view clicked 
	$scope.viewClicked = false;
	
	//used to check user is on game tab to manage back menu flow
	$scope.isLastGame = false;
	// making following scope varibale to normal varibales 
	var categories;
	var filterSorts;
	var filterContentRatings;
	$scope.QID = null;
	var MSG1 = "Sorry, we couldn't find any titles matching you request You can try different filter settings.";
	var MSG2 = "Sorry, we couldn't find any titles matching you request You can try different filter settings or choose one of our suggested titles";
	$scope.RecommendedErrorMsg = "";
    if ($routeParams.productType == "Movie") {
        // default value for the category for movies
        $scope.selectedCategoryFilterIndex = 0;
    }
    else {
        //default value for the category for games
        $scope.selectedCategoryFilterIndex = 1;
    }

    /** Level map for tab bar */
    $scope.levelMap[$scope.level_TAB] = {
        currentIndex: 0,
        maxElements: 2,
        canHandleDnKey: false,
        canHandleUpKey: false,
        firstElement: 0
    };
    /** Level map for view bar */
    $scope.levelMap[$scope.level_VIEW] = {
        currentIndex: 0,
        previousValue: 0,
        maxElements: 8,
        canHandleDnKey: true,
        canHandleUpKey: true,
        firstElement: 0
    };
    /** Level map for Grid */
    $scope.levelMap[$scope.level_GRID] = {
        currentIndex: 0,
        maxElements: 6,
        canHandleDnKey: true,
        canHandleUpKey: true,
        firstElement: 0,
        currentPage: 0,
        GridCurrentPage: 0
    };

    /** Level map for Top in genres grid */
    $scope.levelMap[$scope.level_TOP_GRID] = {
        currentIndex: 0,
        maxElements: 6
    };

    /** Level map for menu bar */
    $scope.levelMap[$scope.level_MENU] = {
        currentIndex: 0,
        maxElements: 6,
        canHandleDnKey: false,
        canHandleUpKey: false,
        firstElement: 0
    };

    $scope.Availability = {
        Subscription: 1,
        atBox: 2,
        RentBuy: 3,
        All: 4
    };
    if ($routeParams.productType == "Movie") {

        $scope.levelMap[$scope.level_VIEW].currentIndex = 0;
        if (isDefined($routeParams.kioskId)) {
            $scope.levelMap[$scope.level_VIEW].currentIndex = 1;
        }
        $scope.levelMap[$scope.level_TAB].currentIndex = 0;
    }
    else if ($routeParams.productType == "Game") {
        $scope.levelMap[$scope.level_VIEW].currentIndex = 4;
        $scope.levelMap[$scope.level_TAB].currentIndex = 1;
    }
    var browseFilterData;
    if (!isDefined($routeParams.kioskId)) {
        browseFilterData = helper.getStoredBrowseFilters("browseFilter");
    }
    else {
        browseFilterData = helper.getStoredBrowseFilters("browseFilterForKiosk");
    }
    // ZOE-36132
    $scope.currentSortOrder = "";
    $scope.sortField = "UserRating";

    $scope.currentGenreID = ""; // genre id
    $scope.currentAvailabilityID = ""; // view
    $scope.currentContentRatingID = ""; // rating
    $scope.currentFormatID = ""; //format
    $scope.currentUserRatingID = ""; // user rating
    $scope.currentSpecialID = "";

    if ($routeParams.productType == "Movie") {
        $scope.currentUserRatingID = "850387998"; // user rating
        $scope.currentGenreID = "";
    }
    else {
        $scope.currentUserRatingID = "1016543328"; // user rating
        $scope.currentSpecialID = "";
    }


    if (isDefined($routeParams.kioskId)) {
        $scope.currentIndexForViewNavBar = 1;
        $scope.selectedFilterItem = $scope.Availability.atBox;
    }
    else {

        $scope.currentIndexForViewNavBar = $scope.levelMap[$scope.level_VIEW].currentIndex;
        setCurrentViewIndex($scope.currentIndexForViewNavBar);
    }

    $scope.popUpTitle = "";

    // based upon the user selection
    if ($scope.filtersLoaded == false) {
        productService.LoadFilters(RBI.PlatformConfig.deviceType, $routeParams.productType,
            function () {
                //success call back
                $scope.availabilities = productService.Availabilities();
                if ($routeParams.productType == "Movie") {
                    $scope.formats = productService.Formats();
                }
                else if ($routeParams.productType == "Game") {
                    for (var i = 0; i < productService.Formats().length; i++) {
                        var formatObject = productService.Formats()[i];
                        switch (formatObject.name) {
                            case 'Playstation 3':
                            {
                                $scope.gamePS3ID = formatObject.id;
                                break;
                            }
                            case 'Wii':
                            {
                                $scope.gameWIIID = formatObject.id;
                                break;
                            }
                            case 'Xbox 360':
                            {
                                $scope.gameXBox360ID = formatObject.id;
                                break;
                            }
                            case 'All':
                            {
                                $scope.gameAllID = formatObject.id;
                                break;
                            }
                        }
                    }
                    $scope.formats = [];
                }
                filterContentRatings = productService.ContentRatings();
                categories = productService.Categories();
                if (isDefined($routeParams.kioskId)) {
                    var categoriesForKiosk = [];

                    for (var i = 0; i < productService.Categories().length; i++) {
                        var category = productService.Categories()[i];
                        if (category.filter.toLowerCase() !== "specialfilter") {
                            categoriesForKiosk.push(category);
                        }
                        if (category.name.toLowerCase() == "all") {
                            $scope.currentSpecialID = "";
                            $scope.currentGenreID = category.id;
                            $scope.currentCategory = 'All';
                        }
                    }
                    categories = categoriesForKiosk;
                    for (var i = 0; i < categoriesForKiosk.length; i++) {
                        if (categoriesForKiosk[i].name.toLowerCase() == "all") {
                            $scope.selectedCategoryFilterIndex = i;
                            break;
                        }
                    }

                }
                filterSorts = productService.Sorts();
                for (i = 0; i < $scope.availabilities.length; i++) {
                    switch ($scope.availabilities[i].name) {
                        case 'Subscription':
                        {
                            $scope.subscriptionID = $scope.availabilities[i].id;
                            break;
                        }
                        case 'Kiosk':
                        {
                            $scope.atBox = $scope.availabilities[i].id;
                            break;
                        }
                        case 'EST':
                        {
                            $scope.rentBuyID = $scope.availabilities[i].id;
                            break;
                        }
                        case 'All':
                        {
                            $scope.allID = $scope.availabilities[i].id;
                            break;
                        }
                    }
                }

                if ($routeParams.productType.toLowerCase() == "movie" && !isDefined($routeParams.kioskId)) {
                    //DEFAULT SPECIAL ID FOR MOVIES
                    for (var cnt = 0; cnt < productService.Categories().length; cnt++) {
                        var category = productService.Categories()[cnt];
                        if (cnt == 0) // first value as the default category value
                        {
                            $scope.currentCategory = category.name;
                            if (category.filter === "specialfilter") {
                                $scope.currentSpecialID = category.id;
                                $scope.currentGenreID = "";
                            }
                            else {
                                $scope.currentSpecialID = "";
                                $scope.currentGenreID = category.id;
                            }

                            $scope.selectedCategoryFilterIndex = cnt;
                            break;
                        }
                    }
                }
                else if ($routeParams.productType.toLowerCase() == "game") {
                    //DEFAULT GENRE ID FOR GAMES
                    for (var cnt = 0; cnt < productService.Categories().length; cnt++) {
                        var category = productService.Categories()[cnt];
                        $scope.currentCategory = category.name;
                        if (category.name.toLowerCase() == "all") {
                            $scope.currentGenreID = category.id;
                            $scope.selectedCategoryFilterIndex = cnt;
                            break;
                        }
                    }
                }
                $scope.defaultvaluefortheCategoryIndex = $scope.selectedCategoryFilterIndex;
                //  DEFAULT Availability ID
                if (isDefined($routeParams.kioskId) || $routeParams.productType == "Game") {
                    $scope.currentAvailabilityID = $scope.atBox; // AT THE BOX
                    //ZOE-33110
                   // $scope.levelMap[$scope.level_VIEW].currentIndex = 1;
                }
                else {
                    $scope.currentAvailabilityID = isDefined(rbiCommonService.getSharedItem(BROWSE_FILTER)) && rbiCommonService.getSharedItem(BROWSE_FILTER).toLowerCase() == "rent" ?
                        $scope.rentBuyID : $scope.subscriptionID;  //SUBSCRIPTION
                    $scope.levelMap[$scope.level_VIEW].currentIndex =isDefined(rbiCommonService.getSharedItem(BROWSE_FILTER)) && rbiCommonService.getSharedItem(BROWSE_FILTER).toLowerCase() == "rent" ? 2:0;
                    rbiCommonService.removeSharedItem(BROWSE_FILTER);
                }

                //DEFAULT CONTENT RATING
                for (var cnt = 0; cnt < productService.ContentRatings().length; cnt++) {
                    var category = productService.ContentRatings()[cnt];
                    if (category.name.toLowerCase() == "all") {
                        $scope.currentContentRatingID = category.id;
                        break;
                    }
                }
                //DEFAULT FORMAT ID
                for (var cnt = 0; cnt < productService.Formats().length; cnt++) {
                    var category = productService.Formats()[cnt];
                    if (category.name.toLowerCase() == "all") {
                        $scope.currentFormatID = category.id;
                        break;
                    }
                }
                if ($routeParams.productType == "Game") {
                    $scope.currentFormatID = $scope.gameAllID;
                }
                //CALL THE TITLES AFTER LOADING THE DEFAULT FILTER IDs
                if (isDefined(browseFilterData)) {
                    $scope.currentFilter = browseFilterData.filterIndexOn;
                    $scope.currentSortOrder = browseFilterData.currentSortOrder;
                    $scope.currentAvailabilityID = browseFilterData.currentAvailabilityID;
                    $scope.currentContentRatingID = browseFilterData.currentContentRatingID;
                    $scope.currentFormatID = browseFilterData.currentFormatID;
                    $scope.currentUserRatingID = browseFilterData.currentUserRatingID;
                    $scope.currentGenreID = browseFilterData.currentGenreID;
                    $scope.currentSpecialID = browseFilterData.currentSpecialID;
                    $scope.sortField = browseFilterData.sortField;
                    $scope.currentFormatID = browseFilterData.currentFormatID;
                    $scope.selectedRatingFilterIndex = browseFilterData.ratingFilterIndex;
                    $scope.selectedFormatFilterIndex = browseFilterData.formatFilterIndex;
                    $scope.selectedSortFilterIndex = browseFilterData.sortFilterIndex;
                    $scope.selectedCategoryFilterIndex = browseFilterData.categoryFilterIndex;
                    $scope.filterTwoIndex = browseFilterData.filterTwoIndex;
                    $scope.levelMap[$scope.level_VIEW].currentIndex = isDefined(browseFilterData.indexOfViewTab) ? browseFilterData.indexOfViewTab : 0;
                    $scope.currentCategory = browseFilterData.currentCategory;
                    //*** For storing the page and the index
                    $scope.pageNumber = browseFilterData.pageNumber;
                    $scope.currentIndexForMovies = browseFilterData.currentIndexForMovies;
                    $scope.currentLevelIndex = browseFilterData.currentLevelIndex;
                    $scope.levelMap[$scope.level_GRID].currentIndex = browseFilterData.levelMapGrid;
                    //For Top Grid
                    $scope.levelMap[$scope.level_TOP_GRID].maxElements = browseFilterData.lastIndex;
                    $scope.levelMap[$scope.level_TOP_GRID].currentIndex = browseFilterData.currentIndex;
                    $scope.currentIndexForTop = browseFilterData.currentIndexForTop,
                    $scope.level_TOP_GRID = browseFilterData.levelTOPGRID;
                    $scope.newMarginTop = browseFilterData.newMarginTop;


                    if (isDefined(browseFilterData.genresApplicable)) {
                        if (browseFilterData.genresApplicable.toLowerCase() == "yes") {
                            $scope.Genre = browseFilterData.genreName;
                            $scope.genresApplicable = true;
                            $scope.genreSelectedOrChanged = true;
                            browseFilterData.genresApplicable = "No";
                        }
                    }
                }
				if(!isDefined($routeParams.kioskId)){
					$scope.currentIndexForViewNavBar = $scope.levelMap[$scope.level_VIEW].currentIndex;
				}
                setCurrentViewIndex($scope.currentIndexForViewNavBar);
                $scope.getTitlesByFilter();
            },
            function (data) {
                // failure call back
                helper.showErrorMessage(data, $scope);
            });

        $scope.filtersLoaded = true;
        //$scope.omnitureReady[0] = true;
    }

    // handle the main menu in the browse page
    hideMainMenu();

    $scope.returnPreloadedTitles = function(params){
        $scope.gridTitles = [];
        return productService.GetTitlesByPageNumber(params, $scope,
            function (data) {
                //success
                $scope.gridTitles = loadGridTitles (data.getProducts());
                var pageCount = data.getPageInfo().getCount();
                if (pageCount > 0) {
                    $scope.pageCount = pageCount;
                }

                $scope.dataLoaded = true;
            },
            function (data) {
                // failure
                helper.showErrorMessage(data, $scope);
                $scope.dataLoaded = true;
            });
    };

    function loadGridTitles(products) {
        var productCount = products.length;
        var gridTitles = [];
        for (var i = 0; i < productCount; i++) {
            var title = products[i].getTitle();
            if (title.indexOf(' PS3') == (title.length - 4)) {
                title += RBI.PlatformConfig.brandTM;
            }
            gridTitles.push({
                title: title,
                productID: products[i].getProductID(),
                imageUrl: products[i].getBoxCoverImage(),
                badges: products[i].getDeliveryTypeBadges(),
                mediaFormatBadges: products[i].getMediaFormatBadges(),
                isComingSoon: products[i].isComingSoon(),
                isNewRelease: products[i].newRelease()
            });
        }

        return gridTitles;
    }

    // Pre-loading the next set of titles to show on the screen using a second grid.
    // This is just for displaying and does not affect functionally.
    $scope.preloadTitles = function (pageNumber) {
        //$scope.genreSelectedOrChanged = false;
        params = [];
        params.PageNumber = pageNumber;
        params.PageSize = 12;
        params.ProductType = $routeParams.productType;
        $scope.KioskId = $routeParams.kioskId;
        $scope.dataLoaded = false;
        // return preloaded titles
        if ($scope.genresApplicable || $scope.currentCategory == "All") {
			$scope.returnPreloadedTitles(params);
		} else {
			$scope.returnSpecialFilterTitlesByPageNumber(params);
		}



    };
    $scope.returnTitlesByPageNumber = function(params){
        $scope.titles = null;
        return productService.GetTitlesByPageNumber(params, $scope,
            function (data) {
                //success
                var pageCount = data.getPageInfo().getCount();
                $scope.titles = loadGridTitles(data.getProducts());
                if (pageCount > 0) {
                    $scope.pageCount = pageCount;
                }
                $scope.dataLoaded = true;
                eventHandler.showBrowseDiv();
            },
            function (data) {
                // failure
                helper.showErrorMessage(data, $scope);
                $scope.dataLoaded = true;
            });
    };
	
	//to get special filter title by page numbers
     $scope.returnSpecialFilterTitlesByPageNumber = function (params) {
         $scope.gridTitles = [];
           	return productService.GetTitlesForSpecialFilters(params, $scope,
            function (data) {
            	//success
                $scope.gridTitles = loadGridTitles(data.getProducts());
                var pageCount = data.getPageInfo().getCount();
                if (pageCount > 0) {
                    $scope.pageCount = pageCount;
                }

                $scope.dataLoaded = true;
            },
            function (data) {
            	// failure
            	helper.showErrorMessage(data, $scope);
            	$scope.dataLoaded = true;
            });
           };
    //for the key arrow down and up function in the grid view
    $scope.handleGridKeyArrowDown = function (pageNumber) {
        //$scope.genreSelectedOrChanged = false;
        params = [];
        params.PageNumber = pageNumber;
        params.PageSize = 12;
        params.ProductType = $routeParams.productType;
        $scope.KioskId = $routeParams.kioskId;
        $scope.dataLoaded = false;
        //return titles by page number
       if ($scope.genresApplicable || $scope.currentCategory == "All") {
			$scope.returnTitlesByPageNumber(params);
		} else {
			$scope.getTitlesBySpecialFilter(params);
		}
    };
    $scope.genresLoaded = false;
    //for the top in genres
    $scope.getTopInGenres = function () {

        var kioskID = $routeParams.kioskId;
        if (!isDefined(kioskID)) {
            params = [];
            params.PageNumber = 1;
            params.ProductType = $routeParams.productType;
            $scope.KioskId = $routeParams.kioskId;
            $scope.allTitles=[];
			$scope.dataLoaded = false;
            return productService.getTopInTitles(params, $scope,
                function (data) {
                    //success
					$scope.dataLoaded = true;
                   
					$scope.QID = null;
                    $scope.allTitles = loadGridTitles(data.recommendedProducts);
                	$scope.QID = data.getQueryID();
                    if (data.recommendedProducts.length > 0) {
                        $scope.genresLoaded = true;
                    }
                    if (data.recommendedProducts != null && data.recommendedProducts.length > 0) {
                        // Initially the current index was being set to 0, but since we are storing the current index
                        // we need to assign the new value..
                        $scope.levelMap[$scope.level_TOP_GRID].currentIndex = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                        // Checking for current Index for Top to be -1 which will set the current Level index to -1
                        // Initially changeLevel was always false and the currentLevelIndex always used to be the TOP Grid
                        // so from title details page when you came back to browse it would show the TOP GRID
                        // even if the user came from ALL in GRID, which is  the level GRID..
                        if ($scope.changeLevel || $scope.currentIndexForTop == -1) {
                          if ($scope.viewClicked)
                				$scope.currentLevelIndex = $scope.level_TOP_GRID;
                			else
                				$scope.currentLevelIndex = $scope.level_GRID;
                        }
                        else {
                            $scope.currentLevelIndex = $scope.level_TOP_GRID;
                        }
                      
                        $scope.levelMap[$scope.level_TOP_GRID].maxElements = data.recommendedProducts.length;
                        // We need to check the currentLevelIndex here since we dont want to load the TOP GRID
                        // by default even if the user was on GRID...
                       if (eventHandler.isTopInVisible() && $scope.currentLevelIndex == $scope.level_TOP_GRID) {
                			$scope.currentLevelIndex = $scope.level_TOP_GRID;
                			$scope.currentIndexForTop = 0;
                            eventHandler.resetGridMargin();
                            eventHandler.onGridMouseOverEvent($scope.currentLevelIndex, $scope.currentIndexForTop);
                		} else {
                			$scope.currentIndexForTop = -1;
                			$scope.currentIndexForMovies = 0;
                			$scope.currentLevelIndex = $scope.level_GRID;
                			$scope.levelMap[$scope.currentLevelIndex].currentIndex = 0;
                			helper.SetFocus($scope.currentLevelIndex + "_" + $scope.levelMap[$scope.currentLevelIndex].currentIndex);
                		}
                    }
                },
                function (data) {
				    $scope.dataLoaded = true;
                    // failure
                    helper.showErrorMessage(data, $scope);

                });
        } else {
            $scope.genresApplicable = true;//making false in getTitlesByFilter
        }
    };

    //get the titles as per the criteria selected in the filter pop ups
    $scope.getTitlesByFilter = function () {

        if ($scope.genresApplicable) {
            $scope.getTopInGenres();
            // Restoring the current Index for Top from the storage, initially it was 0..
            $scope.currentIndexForTop = $scope.currentIndexForTop;
            // Restoring the current Index for Movies from the storage, initially it was -1...
            $scope.currentIndexForMovies = $scope.currentIndexForMovies;
            // We dont need the below since when the user navigates from Top to All and comes back on TOP
            // the margin is set to 0, if the title is present in > 1 pages then the user will loose the
            // movie focus..
            //$("#grid-container-top").css('margin-left', "0px");
        }
        else {
            $scope.allTitles=[];
        }

        if(!$scope.filterClicked){
            //$scope.categoryClicked=false;
            $scope.trackOmniture[0] = OMNITURE_BROWSE.PAGE_LOAD;
            $scope.omnitureReady[0] = true;
        }
        else{
            $scope.trackOmniture[0] = OMNITURE_BROWSE.LINK_CLICK;
            //$scope.filterClicked=false;
            $scope.omnitureReady[0] = true;
        }


        $scope.titles = null;
        $scope.gridTitles = null; // need to store this in local storage .. to do..
        // Moving this at the bottom from the TOP since there is one more API fired
        // getTopInGenres which changes the params, so whatever params we set at the
        // top before the getTopInGenres API the original param values will be lost
        // therefore loading them after the getTopInGenres API. params is a global
        // array object and used everywhere...
        params = [];
        params.PageNumber = $scope.pageNumber;
        params.PageSize = 12;
        $scope.KioskId = $routeParams.kioskId;
        params.SearchQuery = undefined;
        params.ProductType = $routeParams.productType;
		eventHandler.hideRecommendationMessage();
		if ((backPaths.indexOf("/browse/Movie") > -1) && !$scope.genresApplicable && productService.Sorts()[0].name == "Release Date" && !$scope.IsBrowseKiosk()) {
		    var addRelevance = {
		        name: "Relevance",
		        sortField: "defaultSort",
		        sortOrder: ""
		    };
		    productService.Sorts().unshift(addRelevance);
		} else if (productService.Sorts()[0].name == "Relevance" && ($scope.IsBrowseKiosk() || backPaths.indexOf("/browse/Game") > -1 || $scope.genresApplicable)) {
		    productService.Sorts().shift();
		}
       if ($scope.genresApplicable || $scope.currentCategory == "All") {
			if (isDefined($scope.KioskId)) {
				$scope.genresApplicable = false;
			}
			$scope.processGetTitlesCall(params);
		} else {
			$scope.getTitlesBySpecialFilter(params);
		}
    };
	
	$scope.processGetTitlesCall = function (params) {
        productService.GetTitles(params, $scope,
            function (data) {
            	//success
                var products = data.getProducts();
                var pageCount = data.getPageInfo().getCount();

                $scope.titles = loadGridTitles(products);
                if (pageCount > 0) {
                    $scope.pageCount = pageCount;
                } else if (products.length == 0) {
                    $scope.currentIndexOfTopBar == 0 ? $scope.eventHandler.onTabMouseOverEvent('0_0') : $scope.eventHandler.onTabMouseOverEvent('0_1');
                }
				checkForNextRowData();
            },
            function (data) {
            	// failure
            	helper.showErrorMessage(data, $scope);
            });
	};
	
	
	//get recommendations with special filter
	$scope.getTitlesBySpecialFilter = function (params) {
        $scope.titles = null;
		productService.GetTitlesForSpecialFilters(params, $scope,
            function (data) {
				$scope.QID = null;
            	$scope.QID = data.getQueryID();
                if(data.getDataSource()== "DS_Suggestions")eventHandler.showRecommendationMessage(MSG2);
            	populateSpecialFilterData(data);
				checkForNextRowData();
            	$scope.dataLoaded = true;
            	eventHandler.showBrowseDiv();
            },
            function (data) {
                eventHandler.showRecommendationMessage(MSG1);
                helper.showErrorMessage(data, $scope);
            });
	};

     function populateSpecialFilterData(data) {
        var products = data.getProducts();
		var pageCount = data.getPageInfo().getCount();

		$scope.titles = loadGridTitles(products);
		if (pageCount > 0) {
			$scope.pageCount = pageCount;
		} else if (products.length == 0) {
			$scope.currentIndexOfTopBar == 0 ? $scope.eventHandler.onTabMouseOverEvent('0_0') : $scope.eventHandler.onTabMouseOverEvent('0_1');
		}

	}
	 //added this code to resolved issue ZOE-34873
	function checkForNextRowData() {
		var isFromTitleDetail = rbiCommonService.getSharedItem('isFromTitleDetail');
		if ($scope.levelMap[$scope.level_GRID].currentIndex > 5 && isFromTitleDetail) {
			eventHandler.loadMoreTitles('Down_Arrow', $scope.pageNumber);
		}
		rbiCommonService.setSharedItem('isFromTitleDetail', false);
	}
    //for opening up the pop ups
    $scope.openUIFilter = function (uiFilterType) {
        $scope.uiFilterPopupOpen = true;
        if (uiFilterType == 'CATEGORY') {
            $scope.categoryPopupOpen = true;
            $scope.filter1 = [];
            $scope.filter2 = categories;
            $scope.lengthOfColumn2 = categories.length;
            $scope.filter3 = [];
            $scope.column2Header = "Category";
            $scope.column2Class = 'column2-single-title-highlight';
        } else if (uiFilterType == 'VIEW') {
            $scope.viewPopupOpen = true;
            $scope.filter1 = [];
            $scope.filter2 = $scope.availabilities;
            $scope.filter3 = [];
        } else if (uiFilterType == 'FILTER') {
            $scope.viewFilterOpen = true;
            $scope.viewFormatOpen = true;
            $scope.viewRatingOpen = false;
            $scope.viewSortByOpen = false;
            $scope.filter1 = $scope.formats;
            $scope.lengthOfColumn2 = $scope.formats.length;
            $scope.column2Header = "Rating";
            $scope.column2Class = 'column2-title-highlight';

            if (!$scope.isGame()) {
                var filterIndex = 0;
                if ($scope.levelMap[$scope.level_VIEW].currentIndex == 0 || $scope.levelMap[$scope.level_VIEW].currentIndex == 2) {
                    var applicableFormats = [];
                    for (var i = 0; i < $scope.formats.length; i++) {
                        if ($scope.formats[i].name.toLowerCase() != "blu-ray" && $scope.formats[i].name.toLowerCase() != "dvd") {
                            applicableFormats.push($scope.formats[i]);
                        }
                    }
                    $scope.filter1 = [];
                    $scope.filter1 = applicableFormats;
                }
                if ($scope.levelMap[$scope.level_VIEW].currentIndex == 1) {
                    var applicableFormats = [];
                    for (var i = 0; i < $scope.formats.length; i++) {
                        if ($scope.formats[i].name.toLowerCase() != "hd" && $scope.formats[i].name.toLowerCase() != "sd") {
                            applicableFormats.push($scope.formats[i]);
                        }
                    }
                    $scope.filter1 = [];
                    $scope.filter1 = applicableFormats;
                }

                for (var count = 0; count < $scope.filter1.length; count++) {
                    if ($scope.currentFormatName.toLowerCase() == $scope.filter1[count].name.toLowerCase()) {
                        filterIndex = count;
                        break;
                    }
                }
                if ($scope.levelMap[$scope.level_VIEW].previousIndex != $scope.levelMap[$scope.level_VIEW].currentIndex) {
                    $scope.levelMap[$scope.level_VIEW].previousIndex = $scope.levelMap[$scope.level_VIEW].currentIndex;
                    if (isDefined(browseFilterData)) {
                        if (browseFilterData.formatFilterIndex != $scope.selectedFormatFilterIndex) {
                            $scope.selectedFormatFilterIndex = filterIndex;
                        }
                        else {
                            filterIndex = $scope.selectedFormatFilterIndex;
                        }
                    }
                    else {
                        $scope.selectedFormatFilterIndex = filterIndex;
                    }
                    
                }
				
            }
			else{
				$scope.viewFormatOpen = false;
				$scope.viewRatingOpen = true;
			}
            $scope.filter2 = filterContentRatings;
            $scope.filter3 = filterSorts;
			
        }
        $scope.eventHandler.setScrollPosition();
    };


    
    // for closing the filter pop up and the updating the scope variables
    $scope.closeUIFilter = function () {
        $scope.categoryPopupOpen = false;
        $scope.viewPopupOpen = false;
        $scope.viewFilterOpen = false;
        $scope.uiFilterPopupOpen = false;
    };

    $scope.closeUIFilterClearScroll = function () {
        $scope.closeUIFilter();
        $scope.eventHandler.clearScroll();
    };

    $scope.kioskName = "";
    $scope.kioskAddress = "";
    $scope.kioskStateAndZip = "";
    // to check whether the user has came from the browse kiosk
    $scope.IsBrowseKiosk = function () {
        var flag = !($routeParams.kioskId == undefined || $routeParams.kioskId == "");
        if (flag == true) {
            var CurrKiosk = helper.GetCurrentKiosk("CurrentKiosk");
            if (isDefined(CurrKiosk)) {
                $scope.kioskName = CurrKiosk.Displayname;

                $scope.kioskAddress = CurrKiosk.Address1;
                $scope.kioskStateAndZip = CurrKiosk.City + ", " + CurrKiosk.State;
            }
        }
        return flag;
    };

    //for Badge information  of Kiosk
    $scope.showKiosk = function (title) {
        var isKiosk = (title.badges.indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_KIOSK) >= 0)? true:false;
        return (isKiosk && ($scope.selectedFilterItem == $scope.Availability.All));
    };
    //for Badge information of VOD
    $scope.showVOD = function (title) {
        var isVOD = (title.badges.indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_ONDEMAND) >= 0)? true:false;
        return (isVOD && ($scope.selectedFilterItem == $scope.Availability.All));
    };
    //for Badge information of subscription
    $scope.showSubscription = function (title) {
        var isSubscription = (title.badges.indexOf(RBI.Product.Defines.BADGE_DELIVERY_TYPE_SUBSCRIPTION) >= 0)? true:false;
        return (isSubscription && ($scope.selectedFilterItem == $scope.Availability.All));
    };
    //for Badge information of DVD
    $scope.showDVD = function (title) {
        var isDVD = (title.mediaFormatBadges.indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_DVD) >= 0)? true:false;
        return (isDVD && ($scope.selectedFilterItem == $scope.Availability.atBox));
    };
    //for Badge information of Blu ray
    $scope.showBluRay = function (title) {
        var isBluRay = (title.mediaFormatBadges.indexOf(RBI.Product.Defines.BADGE_MEDIA_FORMAT_BLURAY) >= 0)? true:false;
        return (isBluRay && ($scope.selectedFilterItem == $scope.Availability.atBox));
    };
    //for Badge information of rent/buy
    $scope.showRentBuy = function () {
        return ($scope.selectedFilterItem == $scope.Availability.RentBuy)
    };

    function getNumBadges(title) {
        var numBadges = 0;
        if ($scope.showKiosk(title)) {
            numBadges++;
        }
        if ($scope.showSubscription(title)) {
            numBadges++;
        }
        if ($scope.showVOD(title)) {
            numBadges++;
        }
        if ($scope.showDVD(title)) {
            numBadges++;
        }
        if ($scope.showBluRay(title)) {
            numBadges++;
        }
        return numBadges;
    }

    // Get available width for the title
    $scope.titleWidth = function (title) {
        var numBadges = getNumBadges(title);
        var badgeWidth = ($scope.selectedFilterItem == $scope.Availability.atBox)? KIOSK_BADGE_WIDTH : MEDIA_FORMAT_BADGE_WIDTH;
        var width = (numBadges > 0) ? helper.getTitleWidth(IMAGE_POSTER_WIDTH, numBadges, badgeWidth) : IMAGE_POSTER_WIDTH;
        return width + "px";
    };

    $scope.isGame = function () {
        return ($routeParams.productType == "Game");
    };
    $scope.IsGameOrBrowseKiosk = function () {

        return (isDefined($routeParams.kioskId) || $routeParams.productType == "Game") ? true : false;

    };
    $scope.$on('$locationChangeStart', function () {

        //Create a Json Object and store the local storage values
        var currentGenre = "";
        if($scope.genresApplicable == true)
        {
            currentGenre = $scope.currentCategory;
        }

        var filters =
        {
            "currentSortOrder": $scope.currentSortOrder,
            "currentAvailabilityID": $scope.currentAvailabilityID,
            "currentContentRatingID": $scope.currentContentRatingID,
            "currentUserRatingID": $scope.currentUserRatingID,
            "currentGenreID": $scope.currentGenreID,
            "currentSpecialID": $scope.currentSpecialID,
            "currentFormatID": $scope.currentFormatID,
            "sortField": $scope.sortField,
            "ratingFilterIndex": $scope.selectedRatingFilterIndex,
            "formatFilterIndex": $scope.selectedFormatFilterIndex,
            "sortFilterIndex": $scope.selectedSortFilterIndex,
            "categoryFilterIndex": $scope.selectedCategoryFilterIndex,
            "filterTwoIndex": $scope.filterTwoIndex,
            "indexOfViewTab": $scope.levelMap[$scope.level_VIEW].currentIndex,
            "currentCategory": $scope.currentCategory,
            "filterIndexOn": $scope.currentFilter,
            "genresApplicable": $scope.genresApplicable ? "Yes" : "No",
            "genreName": currentGenre,
            "backPath": "/browse/" + $routeParams.productType,
            "fromKisokBrowse": isDefined($routeParams.kioskID) ? "Yes" : "No",
            "pageNumber": $scope.pageNumber,
            "currentIndexForMovies":$scope.currentIndexForMovies,
            "currentLevelIndex":$scope.currentLevelIndex,
            "levelMapGrid":$scope.levelMap[$scope.level_GRID].currentIndex,
            "currentIndex":$scope.levelMap[$scope.level_TOP_GRID].currentIndex,
            "lastIndex":$scope.levelMap[$scope.level_TOP_GRID].maxElements,
            "currentIndexForTop": $scope.currentIndexForTop,
            "levelTOPGRID":$scope.level_TOP_GRID,
            "newMarginTop":$scope.newMarginTop


        };

        // ZOE 31967 - the call below would add home page to back paths
        //addToBackPaths($location.path());
        if (!isDefined($routeParams.kioskId)) {
            helper.SaveCurrentBrowseFilters(filters, "browseFilter");
        }
        else {
            helper.SaveCurrentBrowseFilters(filters, "browseFilterForKiosk");
        }

        if ($scope.tabsChanged == true || $scope.isLastGame==true) {
            helper.clearLocalStorage("browseFilter");
            helper.clearLocalStorage("browseFilterForKiosk");
			
			if ($scope.isLastGame==true && backPaths != null && backPaths.length > 0)
    		backPaths.pop();
			
			$scope.isLastGame = false;
            $scope.tabsChanged = false;
        }
    });


    // Determine if the title needs to scroll
    // The title needs to be selected and overflow the available space
    $scope.scrollTitle = function (isSelected, item) {
        var scroll = false;
        if (isSelected) {
            var numBadges = getNumBadges(item);
            if (helper.needsScroll(item.title, numBadges, $scope.selectedFilterItem == $scope.Availability.atBox)) {
                scroll = true;
            }
        }
        return scroll;
    };


    //Tracking Omniture details for the browse page
    //Omniture
    $scope.OmnitureAvailabilityType={
        0:"instant",
        1:"ondisc",
        2:"ondemand",
        3:"all",
        4:"ALL",
        5:"PS3",
        6:"WII",
        7:"XBOX"
    }
    //Omniture
    var unbindOmniture=$scope.$watch("omnitureReady", function () {
        if ($scope.omnitureReady.length > 0 && $scope.omnitureReady.indexOf(false) <= -1) {
            Omniture.Clear();
            if (internetConnected) {
                var productType = "games";
                if($routeParams.productType.toLowerCase() == "movie")
                {
                    productType = "movies";
                }
                var currentTab = $scope.levelMap[$scope.level_VIEW].currentIndex;
                if ($scope.trackOmniture[0] == OMNITURE_BROWSE.PAGE_LOAD) {
                    //Following block will cater movies and games both

                    var currentTab = $scope.levelMap[$scope.level_VIEW].currentIndex;
                    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|"+ productType + "|" + $scope.OmnitureAvailabilityType[currentTab] + "|" + $scope.currentCategory;
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|"+ productType;
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|"+ productType + "|" + $scope.OmnitureAvailabilityType[currentTab];
                    Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|"+ productType + "|" + $scope.OmnitureAvailabilityType[currentTab] + "|" + $scope.currentCategory;
                    Omniture.Variables.prop21 =  $scope.currentCategory;
                    Omniture.Variables.prop23 = Omniture.previousPageName;
                    Omniture.Variables.eVar48 = $scope.currentCategory;
                    Omniture.Variables.eVar49="type:"+ productType
                        + "|genre:"+ $scope.currentCategory
                        + "|delivery type:" + $scope.OmnitureAvailabilityType[currentTab]
                        + "|format:"+$scope.currentFormatName
                        + "|rating:"+$scope.currentRating.name
                        + "|sortby:"+$scope.sortField + " " + $scope.currentSortOrder
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.Variables.events = ["event33"];
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    Omniture.previousPageName = Omniture.pageName;  // change the previous page name since it changes when user changes categrory or delivery type
                    $scope.omnitureReady[0] = false;
                }
                else if ($scope.trackOmniture[0] == OMNITURE_BROWSE.THUMBNAIL_CLICK)
                {
                    var thumbnailPos = helper.getThumbnailPosition($scope.currentIndexForMovies + 1, 6);
                    var pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|" + productType + "|" + $scope.OmnitureAvailabilityType[currentTab] + "|" + $scope.currentCategory;
                    var headerName = ($scope.genreSelectedOrChanged)?"sorted:":"";
                    var linkName = pageName + "|" + headerName + thumbnailPos + "|" + $scope.movieName;

                    //On Click Thumbnails:
                    Omniture.Variables.eVar3 = pageName + "|" + $scope.movieName + "|" + "browse";
                    Omniture.Variables.prop12 = pageName + "|" + "browse";
                    Omniture.Variables.products = $scope.productID;
                    Omniture.Variables.eVar51 = linkName;
                    helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                    Omniture.InvokeOmniture(Omniture.InvokeType.click);
                }
                else if($scope.trackOmniture[0] == OMNITURE_BROWSE.LINK_CLICK)
                {
                    var pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|" + productType + "|" + $scope.OmnitureAvailabilityType[currentTab] + "|" + $scope.currentCategory;
                    var eVar51LinkName = '';
                    if( $scope.genresApplicable)
                    {
                        eVar51LinkName = "Suggested in" + $scope.currentCategory;
                        pageName = pageName + "|" + eVar51LinkName;
                    }

                    Omniture.Variables.eVar51 = pageName
                        + "|format:" + $scope.currentFormatName.toLowerCase()
                        + "|rating:" + $scope.currentRating.name.toLowerCase()
                        + "|sortby:"+ $scope.sortField.toLowerCase() + " " + $scope.currentSortOrder.toLowerCase();


                    Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    $scope.omnitureReady[0] = false;
                }
                else if($scope.trackOmniture[0] == OMNITURE_BROWSE.GENRE_CLICK)
                {
                    var pageName = Omniture.pageName +"|" +  $scope.movieName + "|" + "browse-topin";
                    var linkName = Omniture.pageName +"|" + "top in:rw01|c0" + $scope.currentIndexForTop + "|p00" + $scope.currentIndexForTop + "|" + $scope.movieName;
                    Omniture.Variables.eVar3 = pageName;
                    Omniture.Variables.prop12 = Omniture.pageName + "|" + "browse-topin";
                    Omniture.Variables.products = $scope.productID;
                    Omniture.Variables.eVar51 = linkName;
                    Omniture.InvokeOmniture(Omniture.InvokeType.click);
                }
            }
        }
    }, true);

    function setCurrentViewIndex(currentIndex) {
        switch (currentIndex) {
            case 0:
                $scope.selectedFilterItem = $scope.Availability.Subscription;
                break;
            case 1:
                $scope.selectedFilterItem = $scope.Availability.atBox;
                break;
            case 2:
                $scope.selectedFilterItem = $scope.Availability.RentBuy;
                break;
            case 3:
                $scope.selectedFilterItem = $scope.Availability.All;
                break;
        }
     }

    //to resolved blank screen issue
    $scope.setBrowseGridState = function () {
    	rbiCommonService.setSharedItem('isFromTitleDetail', true);
    }
    // Determine if the title needs to scroll
    // The title needs to be selected and overflow the available space
    $scope.scrollCategoryTitle = function (filterName, index) {
        var isScrollNeededForcategory = false;
        if ($scope.filterTwoIndex == index) {
            if (isDefined(filterName)) {
                filterName.replace(/^\s+|\s+$/g, "")
                if (filterName > MAX_FILTER_LENGTH) {
                    isScrollNeededForcategory = true;
                }
            }
        }
        return isScrollNeededForcategory;
    }

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
});

