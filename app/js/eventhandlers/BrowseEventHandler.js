'use strict';
/**
 * Browse Event Handler
 * This controller is responsible for key events happening on the browse.html view
 * and displaying the data on the UI.
 */
function BrowseEventHandler($scope, $location, $routeParams, productService ,rbiCommonService) {

    //handle key down event
    this.handleKeyDownEvent = handleKeyDownEvent;
    //handle grid key arrow down event
    this.handleGridKeyArrowDown = handleGridKeyArrowDown;
    this.clearScroll = clearScroll;
    this.setScrollPosition = setScrollPosition;
    this.handleEnterButtonClick = handleEnterButtonClick;
    this.restoreTopInGenres = restoreTopInGenres;
    this.processBottomButtonClick = processBottomButtonClick;
    this.onGridMouseOverEvent = onGridMouseOverEvent;
    this.resetGridMargin = resetGridMargin;
    this.onGridClickEvent = onGridClickEvent;
    this.onGrid2ClickEvent = onGrid2ClickEvent;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
    this.processViewClick = processViewClick;
    this.onBottomButtonHover = onBottomButtonHover;
    this.onPopUpMouseOverEvent = onPopUpMouseOverEvent;
    this.onPopUpMouseClickEvent = onPopUpMouseClickEvent;
    this.onPopUpMouseOutEvent = onPopUpMouseOutEvent;
    this.onTabMouseOverEvent = onTabMouseOverEvent;
    this.handleMouseWheel = handleMouseWheel;
    this.showBrowseDiv=showBrowseDiv;
    this.hangonMouseOver=hangonMouseOver;

    this.ViewClick = ViewClick;
    this.updateFilterTwoIndex = updateFilterTwoIndex;
    this.onTabClick = onTabClick;
    this.showRecommendationMessage = showRecommendationMessage;
    this.hideRecommendationMessage = hideRecommendationMessage;
    this.isTopInVisible = isTopInVisible;
    this.loadMoreTitles = loadMoreTitles;
    //This function is used for the navigation in the browse page for appropriate key press
    function handleKeyDownEvent(event) {
        helper.LGMemoryInfo();
        var currentIndex = (undefined == $scope.levelMap[$scope.currentLevelIndex]) ? 0 : $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedElemId = $scope.currentLevelIndex + "_" + currentIndex;
        var newElement;


        if (document.readyState != "complete") {
            helper.debugLog("skipped keyNav On: " + document.readyState);
            return false;
        }

        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if (event.keyCode != KEY_CODES.CIRCLE || mainMenuMap.on) {
            if (!$scope.uiFilterPopupOpen) {      //** This is not to show the Main Menu when there is any filter POP on top.

                //ZOE-22934
                if (mainMenuMap.on && mainMenuMap.curr == 1 && event.keyCode == KEY_CODES.X) {
                	var cart = new RBI.Cart().getItems();
                    if (isDefined($routeParams.kioskId && cart.length == 0)) {
                        helper.clearLocalStorage("browseFilterForKiosk");
                        $location.path("/browse/Movie");
                        return;
                    }
                }
                if (event.keyCode == KEY_CODES.CIRCLE){
                	rbiCommonService.removeSharedItem(IS_CARD);
                }
                if (handleMainMenu($scope, event.keyCode, $location))return;
            }
        }
        //Key Codes for the various events of the Controller and the keyboard

        switch (event.keyCode) {
            //For the top bar navigation on the L1 and the R1 keys 
            case KEY_CODES.L1:
            {
            	
                if ($scope.uiFilterPopupOpen == false && !isDefined($routeParams.kioskId)) {
                    currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex;
                    $scope.levelMap[$scope.level_VIEW].previousIndex = currentIndex;

                    if ($routeParams.productType == 'Movie' && currentIndex>0)
                        processViewClick(currentIndex, event.keyCode);
                    else
                    {
                        if ($routeParams.productType == 'Game' && currentIndex>$scope.levelMap[$scope.level_VIEW].maxElements-4)
                            processViewClick(currentIndex, event.keyCode);
                    }
                }
                      if ($scope.currentLevelIndex == $scope.level_GRID && $scope.genresApplicable) {
                    //make it to the top in genres
                    $scope.currentIndexForMovies = 0;
                    helper.RemoveFocus($scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex);
                    // setting the current level index to TOP Grid when we load the new tab view
                    // We need to set the current level index to TOP grid on tab change otherwise the main grid
                    // will be focused instead of the TOP grid.
                    $scope.currentLevelIndex = $scope.level_TOP_GRID;
                    currentIndex = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                    $scope.currentIndexForTop = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                    $("#topgrid").show(); //*** Show the Top Grid.
                }
                break;
            }

            //For the top bar navigation on the L1 and R1 keys
            case KEY_CODES.R1:
            {
               if ($scope.uiFilterPopupOpen == false && !isDefined($routeParams.kioskId)) {
                    currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex;
                    $scope.levelMap[$scope.level_VIEW].previousIndex = currentIndex;

                   if ($routeParams.productType == 'Movie' && currentIndex+1<$scope.levelMap[$scope.level_VIEW].maxElements-4)
                        processViewClick(currentIndex, event.keyCode);
                    else
                    {
                        if ($routeParams.productType == 'Game' && currentIndex<$scope.levelMap[$scope.level_VIEW].maxElements)
                            processViewClick(currentIndex, event.keyCode);
                    }

                }
                if ($scope.currentLevelIndex == $scope.level_GRID && $scope.genresApplicable) {//adding gener specific condition because following code is only applicable for genre

                    //make it to the top in genres
                    $scope.currentIndexForMovies = 0;
                    helper.RemoveFocus($scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex);
                    // setting the current level index to TOP Grid when we load the new tab view
                    // We need to set the current level index to TOP grid on tab change otherwise the main grid
                    // will be focused instead of the TOP grid.
                    $scope.currentLevelIndex = $scope.level_TOP_GRID;
                    currentIndex = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                    $scope.currentIndexForTop = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                    $("#topgrid").show(); //*** Show the Top Grid.
                }
                break;
            }
            // For the right key event handling

            case KEY_CODES.DPAD_RIGHT:
            {
                // to handle if the pop up for the category and the filter is open
                if ($scope.uiFilterPopupOpen == true) {
                    if ($scope.viewFilterOpen) {
                        if ($scope.viewFormatOpen) {
                            $scope.viewFormatOpen = false;
                            $scope.viewRatingOpen = true;
                        } else if ($scope.viewRatingOpen) {
                            $scope.viewRatingOpen = false;
                            $scope.viewSortByOpen = true;
                        }
                    }
                }
                else {
                    $scope.IsSecondRowSelected = false;
                    //to handle it at the grid level
                    if ($scope.currentLevelIndex == $scope.level_GRID && !$scope.showHangOnthere) {
                        var lastIndex = $scope.levelMap[$scope.level_GRID].currentIndex + ($scope.pageNumber - 1) * 12;
                        lastIndex = lastIndex + 1;
                        if ($scope.levelMap[$scope.level_GRID].currentIndex >= 6 && $scope.levelMap[$scope.level_GRID].currentIndex < 12 && ($scope.pageCount - lastIndex) < 1) {
                            $scope.IsSecondRowSelected = true;
                            break;
                        }
                        if ($scope.levelMap[$scope.level_GRID].currentIndex >= 0 && $scope.levelMap[$scope.level_GRID].currentIndex < 6 && ($scope.pageCount - $scope.levelMap[$scope.level_GRID].currentIndex) < 1) {
                            $scope.IsSecondRowSelected = false;
                            break;
                        }
                        currId = $scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex;
                        currentElement = document.getElementById(currentFocusedElemId);
                        newElementId = null;
                        if ($scope.genreSelectedOrChanged) {
                            //changing it to the second row of all in genres
                            if (currentIndex == 5) {
                                $scope.genreSelectedOrChanged = false;
                            }
                        }
                        if (currentElement != null) {
                            currentIndex = $scope.levelMap[$scope.level_GRID].currentIndex;
                            currentIndex = currentIndex + 1;
                            if (document.getElementById($scope.level_GRID + "_" + currentIndex) == null && currentIndex != "12")
                                return;
                            helper.RemoveFocus(currentFocusedElemId);
                            $scope.levelMap[$scope.level_GRID].currentIndex = $scope.levelMap[$scope.level_GRID].currentIndex + 1;
                            //Pre-loading the titles from the first row last element on RIGHT
                            if (currId == '2_5') {
                                loadMoreTitles('Down_Arrow', $scope.pageNumber);
                            }
                            //if the control has reached on the last index of movie or game
                            if (currId == '2_11') {
                                $scope.IsSecondRowSelected = false;
                                handleGridKeyArrowDown('Down_Arrow', $scope.pageNumber);
                                $scope.levelMap[$scope.level_GRID].currentIndex = 0;
                                scrollGrid();
                            }
                            newElementId = $scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex;
                            newElement = document.getElementById(newElementId);
                            helper.SetFocus(newElementId);
                            $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                            if (currentIndex >= 6 && currentIndex < 12) {
                                $scope.IsSecondRowSelected = true;
                            }
                            if (currentIndex == 6) {
                                scrollGrid();
                            }
                        }
                    }
                    else if ($scope.currentLevelIndex == $scope.level_TOP_GRID) {
                        //for the navigation in the top in genres
                        currId = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                        lastIndex = $scope.levelMap[$scope.level_TOP_GRID].maxElements;
                        currentIndex = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                        currentElement = document.getElementById(currId);
                        newElementId = null;
                        if (currentElement != null) {
                            if (currentIndex + 1 < lastIndex) {
                                helper.RemoveFocus(currId);
                                $scope.levelMap[$scope.level_TOP_GRID].currentIndex = $scope.levelMap[$scope.level_TOP_GRID].currentIndex + 1;
                                newElementId = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                                newElement = document.getElementById(newElementId);
                                helper.SetFocus(newElementId);
                                $scope.currentIndexForTop = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                                scrollRight();

                            }
                        }
                    }
                    //Checking Condition for Games
                    else if ($scope.currentLevelIndex == $scope.level_TAB && $scope.levelMap[$scope.level_TAB].currentIndex == 0 && RBI.PlatformConfig.showGames == true) {
                        //for the navigation in the view bar
                        $scope.currentIndexOfTopBar = 1;
                        $scope.levelMap[$scope.level_TAB].currentIndex = 1;
                        $("#" + $scope.level_TAB + "_" + 0).removeClass('tab-1High');
                        $("#" + $scope.level_TAB + "_" + 0).removeClass('tab-1Highlight');
                        $("#" + $scope.level_TAB + "_" + 1).addClass('tab-1Highlight');
                    }
                    //End of Condition
                }
                break;
            }
            // for the left key press

            case KEY_CODES.DPAD_LEFT:
            {
                // to handle if the pop up for the category and the filter is open
                if ($scope.genresApplicable && $scope.levelMap[$scope.level_GRID].currentIndex == 5) {
                    $scope.currentLevelIndex = $scope.level_GRID;
                }
                if ($scope.uiFilterPopupOpen == true) {
                    if ($scope.viewFilterOpen) {
                        if ($scope.viewRatingOpen) {
                            $scope.viewRatingOpen = false;
                            $scope.viewFormatOpen = true;
                        } else if ($scope.viewSortByOpen) {
                            $scope.viewSortByOpen = false;
                            $scope.viewRatingOpen = true;
                        }
                    }
                }
                // for the navigation in the top in genres
                else if ($scope.currentLevelIndex == $scope.level_TOP_GRID) {
                    currId = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                    lastIndex = $scope.levelMap[$scope.level_TOP_GRID].maxElements;
                    currentIndex = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                    currentElement = document.getElementById(currId);
                    newElementId = null;
                    if (currentElement != null) {
                        if (currentIndex > 0) {
                            helper.RemoveFocus(currId);
                            $scope.levelMap[$scope.level_TOP_GRID].currentIndex = $scope.levelMap[$scope.level_TOP_GRID].currentIndex - 1;
                            newElementId = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                            newElement = document.getElementById(newElementId);
                            helper.SetFocus(newElementId);
                            $scope.currentIndexForTop = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                            scrollLeft();
                        }
                    }
                }
                else {
                    $scope.IsSecondRowSelected = false;
                    if ($scope.currentLevelIndex == $scope.level_GRID && !$scope.showHangOnthere) {
                        // for the navigation in the games and movie
                        var currId = $scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex;
                        currentIndex = $scope.levelMap[$scope.level_GRID].currentIndex - 1;
                        var currentElement = document.getElementById(currentFocusedElemId);
                        var newElementId = null;

                        if (currentElement != null) {
                            //left from the first element in first row
                            if (currId == '2_0' && $scope.pageNumber > 1) {
                                handleGridKeyArrowDown('Down_Up', $scope.pageNumber);
                                $scope.levelMap[$scope.level_GRID].currentIndex = 11;
                                $scope.IsSecondRowSelected = true;
                                scrollGrid();
                            }
                            else {
                                newElementId = $scope.level_GRID + "_" + currentIndex;
                                newElement = document.getElementById(newElementId);
                                if (newElement != null) {
                                    $scope.levelMap[$scope.level_GRID].currentIndex = currentIndex;
                                    helper.RemoveFocus(currentFocusedElemId);
                                    helper.SetFocus(newElementId);
                                }
                            }
                            //checking for the boundary conditions.
                            if ($scope.levelMap[$scope.level_GRID].currentIndex >= 0) {
                                $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                            }
                            if (currentIndex >= 6 && currentIndex < 12) {
                                $scope.IsSecondRowSelected = true;
                            }
                            if (currentIndex == 5) {
                                scrollGrid();
                            }
                        }
                    }
                    //Checking the Condition for Game Data
                    else if ($scope.currentLevelIndex == $scope.level_TAB && $scope.levelMap[$scope.level_TAB].currentIndex == 1 && RBI.PlatformConfig.showGames == true) {
                        $scope.currentIndexOfTopBar = 0;
                        $scope.levelMap[$scope.level_TAB].currentIndex = 0;
                        $("#" + $scope.level_TAB + "_" + 1).removeClass('tab-1High');
                        $("#" + $scope.level_TAB + "_" + 1).removeClass('tab-1Highlight');
                        $("#" + $scope.level_TAB + "_" + 0).addClass('tab-1Highlight');
                    }
                    //End of Condition for Game Data
                }
                break;
            }

            case KEY_CODES.DPAD_UP:
            {
                try {
					if(typeof RBI.PlatformConfig.handlePipelineEvent == 'undefined' || RBI.PlatformConfig.handlePipelineEvent == true){
						if (new Date().getMilliseconds() - $scope.startTime < 100) {
							$scope.startTime = 0;
							event.stopPropagation();
							throw "flushing event pipeline";
						}
					}
					 HandleKeyUp();
                }
                catch (object) {
                }
                break;
            }

            case KEY_CODES.DPAD_DOWN:
            {
					 HandleKeyDown();
                break;

            }
            //to handle the enter key

            case KEY_CODES.X:
            {
                if ($scope.showHangOnthere == true) {
                    $scope.showHangOnthere = false;
                    var productId = platformStorage.getItem("lastVisitTitle");
                    platformStorage.setItem("openKioskCheckoutOnNavigation", true);
                    $location.path('/kioskCheckout');
                    break;
                }

                if ($scope.uiFilterPopupOpen) {
                    $scope.filterUpdated = true;
                    // setting the page number to 1 since there might be an existing page from the GRID which the filter
                    // will take and move to that page, therefore resetting it to 1..
                    $scope.pageNumber = 1;
                    handleEnterButtonClick();
                    $scope.IsSecondRowSelected = false;
                    scrollGrid();
                }
                else {
                    if ($scope.currentLevelIndex == $scope.level_GRID || $scope.currentLevelIndex == $scope.level_TOP_GRID) {
                        //This is to disable the click event for out of stock titles.
						if($("#" + currentFocusedElemId).hasClass('grid-item-disabled')) return false;
                        var Pid = $("#" + currentFocusedElemId).attr("pid");
                        $scope.productID = Pid;
                        $scope.movieName = $("#" + currentFocusedElemId).attr("pname");
                        if ($scope.genresApplicable == true && $scope.currentIndexForMovies == -1) {
                            $scope.trackOmniture[0] = OMNITURE_BROWSE.GENRE_CLICK;
                        }
                        else {
                            $scope.trackOmniture[0] = OMNITURE_BROWSE.THUMBNAIL_CLICK;
                        }
                        $scope.omnitureReady[0] = true;
                        if (helper.isDefined(Pid)) {
                            if (isDefined($scope.QID)) {
           						rbiCommonService.setSharedItem('QueryID', $scope.QID);
           					}else {
								rbiCommonService.setSharedItem('QueryID', null);
							}
							$scope.setBrowseGridState();
                            if (helper.isDefined($scope.KioskId)) {
                                $location.path('titledetail/' + Pid + '/' + $scope.KioskId);
                            } else {
                                $location.path('titledetail/' + Pid);
                            }
                        }
                    }
                    else if ($scope.currentLevelIndex == $scope.level_TAB) {
                        // Checking condition for the Game data
                        if (RBI.PlatformConfig.showGames == true) {
                            currentFocusedElemId = $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex;

                            onTabClick(currentFocusedElemId);
                        }
                        //End of the Data


                    }
                }
                break;
            }
            case KEY_CODES.TRIANGLE:
            {
                processBottomButtonClick("Filter");
				if (!$scope.isGame()){
					$( "div" ).removeClass( "game-layout" );
				}
                break;
            }
            case KEY_CODES.SQUARE:
            {
                processBottomButtonClick("Category");
                break;
            }

            case KEY_CODES.CIRCLE:
            {
                processBottomButtonClick("53_0");
                break;
            }
        }
    }

    function restoreTopInGenres() {
        $scope.genresApplicable = true;
        $scope.genreSelectedOrChanged = true;
        // Restoring the current Index for Movies from storage... initially was -1
        $scope.currentIndexForMovies = $scope.currentIndexForMovies;
        var params = [];
        params.ProductType = $routeParams.productType;
        $scope.KioskId = $routeParams.kioskId;
        $scope.allTitles = [];
        return productService.getTopInTitles(params, $scope,
            function (data) {
                //success
                $scope.allTitles = data;
                if (data.length > 0) {
                    $scope.genresLoaded = true;
                }
                if (data != null && data.length > 0) {
                    $scope.currentLevelIndex = $scope.level_TOP_GRID;
                    $scope.levelMap[$scope.level_TOP_GRID].maxElements = data.length;

                }
            },
            function (data) {
                // failure
                helper.showErrorMessage(data, $scope);

            });
    }

    function handleEnterButtonClick() {

        $scope.levelMap[$scope.level_GRID].currentIndex = 0;
        if ($scope.categoryPopupOpen) {
            // $scope.filter2[$scope.selectedCategoryFilterIndex];
            if($scope.resetCategory)
            {
                $scope.categoryClicked = false;
                $scope.resetCategory = false;
            }
            else $scope.categoryClicked=true;
        }

        updateTitlesByFilters();
        $scope.currentIndexForMovies = 0;
    }

    //Updating the view as per the filters selected and calling the api to get the data sorted
    function updateTitlesByFilters() {
        updateFilters();
        if(!$scope.categoryClicked){$scope.filterClicked=true;}
        $scope.getTitlesByFilter();
        $scope.closeUIFilter();
    }

    //for setting all the scope level filters based upon the user selection for filtering the data
    function updateFilters() {
        $scope.genresLoaded = false;
        $scope.currentIndexForMovies = $scope.currentIndexForMovies; // restoring current index for movies from storage, was 0
        $scope.pageNumber = $scope.pageNumber;// restoring page number from storage, was 1
        $scope.levelMap[$scope.level_GRID].currentIndex = $scope.levelMap[$scope.level_GRID].currentIndex; // restoring index back from storage, was 0
        if ($routeParams.productType == "Movie") {
            if ($scope.levelMap[$scope.level_VIEW].currentIndex >= 4) {
                $scope.levelMap[$scope.level_VIEW].currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex - 4;
            }
            $scope.currentAvailabilityID = $("#" + $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex).attr("attributeID");
        }
        else {
            if (!$scope.isGame()) {
                $scope.currentAvailabilityID = $("#" + $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex).attr("attributeID");
                $scope.levelMap[$scope.level_VIEW].currentIndex = 1;
            }

        }
        if ($scope.categoryPopupOpen) {
            $scope.currentGenreID = "";
            $scope.currentSpecialID = "";
            $scope.currentCategory = $scope.filter2[$scope.selectedCategoryFilterIndex].name;
            if ($scope.filter2[$scope.selectedCategoryFilterIndex].name == "All") {

                // Update Filter Sorting ZOE-36132
                updateFilterSorting($scope.filter2[$scope.selectedCategoryFilterIndex].name);

                $scope.genreSelectedOrChanged = false;
                $scope.currentLevelIndex = $scope.level_GRID;
                if ($routeParams.productType == "Movie") {
                    $scope.currentGenreID = "1323166865";
                }
                else {
                    $scope.currentGenreID = "388063183";
                   }
                   $scope.genresApplicable = false;
            }
            else {
                if ($scope.filter2[$scope.selectedCategoryFilterIndex].filter == "genre") {
                    $scope.currentGenreID = $scope.filter2[$scope.selectedCategoryFilterIndex].id;
                    $scope.Genre = $scope.filter2[$scope.selectedCategoryFilterIndex].name;
                    $scope.genreSelectedOrChanged = true;
                    // Update Filter Sorting ZOE-36132
                    updateFilterSorting($scope.filter2[$scope.selectedCategoryFilterIndex].filter);

                    if ($routeParams.productType == "Movie") 
                    	$scope.genresApplicable = true;
                    else
                    	$scope.genresApplicable = false;
                    //$scope.getTopInGenres();
                    $scope.currentIndexForMovies = -1;
                }
                else {
                    $scope.genreSelectedOrChanged = false;
                    $scope.genresApplicable = false;

                    $scope.currentLevelIndex = $scope.level_GRID;
                    $scope.currentSpecialID = $scope.filter2[$scope.selectedCategoryFilterIndex].id;

                    // Update Filter Sorting ZOE-36132
                    updateFilterSorting("Special Filter");
                }
            }
        } else if ($scope.viewPopupOpen) {
            $scope.currentView = $scope.filter2[$scope.selectedViewFilterIndex];
        } else if ($scope.viewFilterOpen) {
            $scope.currentFormat = $scope.filter1[$scope.selectedFormatFilterIndex];
            if ($scope.filter1[$scope.selectedFormatFilterIndex] != undefined && $scope.filter1[$scope.selectedFormatFilterIndex].id != undefined) {
                $scope.currentFormatID = $scope.filter1[$scope.selectedFormatFilterIndex].id;
                $scope.currentFormatName = $scope.filter1[$scope.selectedFormatFilterIndex].name;
            }
            $scope.currentRating = $scope.filter2[$scope.selectedRatingFilterIndex];
            $scope.currentContentRatingID = $scope.filter2[$scope.selectedRatingFilterIndex].id;
            $scope.sortField = $scope.filter3[$scope.selectedSortFilterIndex].sortField;
            $scope.currentSortOrder = $scope.filter3[$scope.selectedSortFilterIndex].sortOrder;

            if ($scope.selectedRatingFilterIndex !== 0 ||
                $scope.selectedFormatFilterIndex !== 0 ||
                $scope.selectedSortFilterIndex !== 0) {
                $scope.currentFilter = true;
            }else{
                $scope.currentFilter = false;
            }
            $scope.currentLevelIndex = $scope.level_GRID;
        }
    }


    // Update the Filter Sort Array, sort filter index, sort field and the current sort order...ZOE-36132
    function updateFilterSorting(getFilter){
        if(productService.Sorts()[0].name == "Relevance" && getFilter != "Special Filter"){
            helper.debugLog("Update Sort Special Filters");
            if($scope.selectedSortFilterIndex > 0){
                $scope.selectedSortFilterIndex = $scope.selectedSortFilterIndex - 1;
            }

            productService.Sorts().shift();

            $scope.sortField = productService.Sorts()[$scope.selectedSortFilterIndex].sortField;
            $scope.currentSortOrder = productService.Sorts()[$scope.selectedSortFilterIndex].sortOrder;
        }
        else if(productService.Sorts()[0].name == "Release Date" && getFilter != "genre" && getFilter != "All" && getFilter != "Game"){
            helper.debugLog("Update Sort Genres/All");
            if($scope.selectedSortFilterIndex > 0){
                $scope.selectedSortFilterIndex = $scope.selectedSortFilterIndex + 1;
            }
            var addRelevance = {name: "Relevance",sortField: "defaultSort",sortOrder: ""};
            productService.Sorts().unshift(addRelevance);
            $scope.sortField = productService.Sorts()[$scope.selectedSortFilterIndex].sortField;
            $scope.currentSortOrder = productService.Sorts()[$scope.selectedSortFilterIndex].sortOrder;
        }
        helper.debugLog("Sorts Array "+JSON.stringify(productService.Sorts()));
        helper.debugLog("Filter Index "+$scope.selectedSortFilterIndex);
        helper.debugLog("Sort Field "+$scope.sortField);
        helper.debugLog("Current Sort Order "+$scope.currentSortOrder);
    }

    // Load more titles for the second grid to display after the first 12 titles...
    function loadMoreTitles(id, pageNumber){
        if (id == 'Down_Arrow' && $scope.dataLoaded) {
            //check if the API has responded.
            var count = pageNumber * 12;
            pageNumber = $scope.pageNumber;
            pageNumber = pageNumber + 1;

            $scope.gridTitles = [];
            if (count < $scope.pageCount) {
                $scope.preloadTitles(pageNumber);
            }

        }
        if (id == 'Down_Up' && $scope.dataLoaded) {
            pageNumber = $scope.pageNumber;
            if (pageNumber > 0) {
               $scope.preloadTitles(pageNumber);
            }
        }
    }
    //handle key down event is used to navigate and bring new records from the api
    //based upon the current page number
    function handleGridKeyArrowDown(id, pageNumber) {
        if (id == 'Down_Arrow' && $scope.dataLoaded) {
            //check if the API has responded.
            var count = pageNumber * 12;
            pageNumber = $scope.pageNumber;
            pageNumber = pageNumber + 1;
            $scope.pageNumber = pageNumber;

            $scope.titles = [];
            if (count < $scope.pageCount) {
                $scope.titles =  helper.copyArray($scope.gridTitles);
                $scope.gridTitles = [];
            } else {
                $scope.canScrollDown = false;
            }


        }
        if (id == 'Down_Up' && $scope.dataLoaded) {
            pageNumber = $scope.pageNumber - 1;
            if (pageNumber > 0) {
                $scope.gridTitles = [];
                $scope.gridTitles = helper.copyArray($scope.titles);
                $scope.titles = [];
                //$('#grid-container-all-parent').css('visibility','hidden');
                $('#grid-container-all-parent').hide();
                $scope.handleGridKeyArrowDown(pageNumber);
                $scope.pageNumber = pageNumber;
                $scope.canScrollDown = true;
            }
        }
    }

    //For setting the scroll position in the pop uo opened
    function setScrollPosition() {
        if ($scope.categoryPopupOpen) {
            scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedCategoryFilterIndex);
            updateFilterTwoIndex($scope.selectedCategoryFilterIndex);
        } else if ($scope.viewPopupOpen) {
            scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedViewFilterIndex);
        } else if ($scope.viewFilterOpen) {
            scrollPopDown("PopupColumn1Items", "50_" + $scope.selectedFormatFilterIndex);
            scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedRatingFilterIndex);
            updateFilterTwoIndex($scope.selectedRatingFilterIndex);
            scrollPopDown("PopupColumn3Items", "52_" + $scope.selectedSortFilterIndex);
        }
    }

    //setting the default value for the pop up of category and filter opened
    function clearScroll() {
        scrollPopDown("PopupColumn1Items", "50_0");
        scrollPopDown("PopupColumn2Items", "51_0");
        scrollPopDown("PopupColumn3Items", "52_0");
    }

    // function to handle scrolling in the pop up navigation for the category and the filters
    function scrollPopDown(columnId, scrollTo) {
        var rowNum = scrollTo.split("_")[1];
        var newTop = POPUP_OFFSET - ((POPUP_OFFSET * (rowNum)) + -10) + "px";
        if (document.getElementById(columnId) != null) {
            //   document.getElementById(columnId).style.top = newTop + "px";
            $("#" + columnId).css('top', newTop);

        }
    }

    //function to handle scrolling in the top in genre section
    function scrollLeft() {
        var currentIndex = $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedEleId = $scope.currentLevelIndex + "_" + currentIndex;
        var selectedOffset = $("#" + currentFocusedEleId).offset();
        helper.debugLog(selectedOffset.left);
        if (selectedOffset.left < 439 && (currentIndex - 1) > 0) {

            var currentMarginTop = $("#grid-container-top").css('margin-left').split("px");
            var newMarginTop = parseInt(currentMarginTop[0]) + 191;
            $scope.newMarginTop = newMarginTop + "px"; // storing the margin top so that it can bind to the view...
            $("#grid-container-top").css('margin-left', newMarginTop + "px");
        }
    }

    //function to handle scrolling in the top in genre section
    function scrollRight() {
        var currentIndex = $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedEleId = $scope.currentLevelIndex + "_" + currentIndex;
        var selectedOffset = $("#" + currentFocusedEleId).offset();
        if (selectedOffset.left > 600 && currentIndex + 4 <= $scope.levelMap[$scope.currentLevelIndex].maxElements) {
            var currentMarginTop = $("#grid-container-top").css('margin-left').split("px");
            var newMarginTop = parseInt(currentMarginTop[0]) - 191;
            $scope.newMarginTop = newMarginTop + "px"; // storing the margin top so that it can bind to the view...
            $("#grid-container-top").css('margin-left', newMarginTop + "px");
        }
    }

    //For the grid scrolling up and down
    function scrollGrid() {
        var count = ($scope.pageNumber - 1) * 12;
        if ($scope.canScrollDown) {
            if ($scope.IsSecondRowSelected) {
                $('#scollgrid').removeClass("scroll-up-browse-item");
                $('#scollgrid').addClass("scroll-down-browse-item");
            }
            else {

                $('#scollgrid').removeClass("scroll-down-browse-item");
                $('#scollgrid').addClass("scroll-up-browse-item");
            }
        } else {
            HandleKeyUp();
        }
    }

    //Reset the GRID on Filter View.
    function resetGrid() {
        //Resetting the GRID indexes as well as the margin top on tab view change...
        $scope.newMarginTop =  0;
        $scope.currentIndexForTop = 0;
        $scope.levelMap[$scope.level_TOP_GRID].currentIndex = 0;
        $scope.levelMap[$scope.level_GRID].currentIndex = 0;
        $scope.currentIndexForMovies = 0; // resetting this to zero since the current index is set to zero from above..
        $scope.pageNumber = 1;
        $scope.IsSecondRowSelected = false;
        scrollGrid();
    }

    //magic remote implementation started
    function processBottomButtonClick(id) {
    	 if ($scope.showHangOnthere == true && id=="Checkout") {
             $scope.showHangOnthere = false;
             var productId = platformStorage.getItem("lastVisitTitle");
             platformStorage.setItem("openKioskCheckoutOnNavigation", true);
             //To hide main menu when navigating to kioskCheckout page
			 hideMainMenu();
             $location.path('/kioskCheckout');
           return;
         }
        if (id == "Filter") {
			if (!$scope.isGame()){
				$( "div" ).removeClass( "game-layout" );
			}
			$( ".popup-body" ).removeClass( "game-layout-filter" );
            if ($scope.uiFilterPopupOpen == false) {
                $scope.openUIFilter('FILTER');
                if ($routeParams.productType == "Movie") {
                    $scope.popUpTitle = "Filter Movies";
                }
                else {
                    $scope.popUpTitle = "Filter Games";
                }
            }
        } else if (id == "Category") {
			$( ".popup-body" ).addClass( "game-layout-filter" );
            if ($scope.uiFilterPopupOpen) {
            	updateFilterTwoIndex(0);
                if (isDefined($scope.selectedRatingFilterIndex) == false) {
                	updateFilterTwoIndex($scope.selectedRatingFilterIndex);

                }
                // the reset button on the category pop up
                if ($scope.categoryPopupOpen) {
                    $scope.resetCategory = true;
                    $scope.selectedCategoryFilterIndex = $scope.defaultvaluefortheCategoryIndex;
                    /*if ($routeParams.productType == "Movie") {
                     $scope.selectedCategoryFilterIndex = 0;
                     }
                     else {
                     $scope.selectedCategoryFilterIndex = 2;
                     }  */
                    scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedCategoryFilterIndex);
                    updateFilterTwoIndex($scope.selectedCategoryFilterIndex);
                }
                //reset button on the filter pop up
                else if ($scope.viewRatingOpen || $scope.viewFormatOpen || $scope.viewSortByOpen) {


                    $scope.selectedRatingFilterIndex = 0;
                    $scope.selectedFormatFilterIndex = 0;
                    $scope.selectedSortFilterIndex = 0;
                    scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedRatingFilterIndex);
                    scrollPopDown("PopupColumn1Items", "50_" + $scope.selectedFormatFilterIndex);
                    scrollPopDown("PopupColumn3Items", "52_" + $scope.selectedSortFilterIndex);
                    updateFilterTwoIndex($scope.selectedRatingFilterIndex);
                    $scope.currentFilter = false;
                }
            }
            else {
                $scope.openUIFilter('CATEGORY');
                $scope.popUpTitle = "Select Category";
                if ($scope.levelMap[$scope.level_VIEW].currentIndex < 3) {
                    $scope.popUpTitle = "Select Category";
                }
                   updateFilterTwoIndex($scope.selectedCategoryFilterIndex);
            }
        } else if (id == '53_0') {

            if ($scope.showHangOnthere == true) {
            	 rbiCommonService.removeSharedItem(IS_CARD);
            	 $scope.parentobj.cart.clear();
                //handles ngclick for ok button on showHangOnthere
				if(handleMainMenu($scope, KEY_CODES.CIRCLE, $location)) return;
            }
            else if ($scope.uiFilterPopupOpen) {
                $scope.closeUIFilterClearScroll();
                return;
            }
            else {
                try {
                    var cart = new RBI.Cart().getItems();
                    if (cart.length > 0) {
                        $scope.showHangOnthere = true;
                        return;
                    }
                }
                catch (object) {
                }
            }
                if (isDefined($routeParams.kioskId)) {
                    sessionStorage.setItem("_backPathToLocation", $routeParams.productType);
                    // $location.url('/locations/')
                }
                /* else {
                 goToPreviousPath($scope, event.keyCode, $location);
                 }  */
                $scope.setBrowseGridState();
                goToPreviousPath($scope, event.keyCode, $location);
        } else if (id == '53_1') {
            if ($scope.uiFilterPopupOpen) {
                processBottomButtonClick("Category");
            } else {
                processBottomButtonClick("Filter");
            }
        } else if (id == '53_2') {
            $scope.filterUpdated = true;
            handleEnterButtonClick();
            $scope.IsSecondRowSelected = false;
            scrollGrid();
        }
    };

    //grid mouse over event handler
    function onGridMouseOverEvent(level, index) {
    	if(level==2 && index > 5 && !$scope.IsSecondRowSelected){
    		return;
		}else if($scope.currentLevelIndex !=level || $scope.levelMap[$scope.currentLevelIndex].currentIndex!=index || $scope.IsSecondRowSelected){
		
	        removeBottomButtonFocus();
	        helper.RemoveFocus($scope.currentLevelIndex + "_" + $scope.levelMap[$scope.currentLevelIndex].currentIndex);
	        $scope.currentLevelIndex = level;
	        if (level == 3) {
	        	 $scope.currentIndexForMovies=-1;
	            $scope.currentIndexForTop = index;
	        } else {
	        	 $scope.currentIndexForTop = -1;
	            $scope.currentIndexForMovies = index;
	        }
	        $scope.levelMap[$scope.currentLevelIndex].currentIndex = index;
	
	        var currentFocusedElemId = $scope.currentLevelIndex + "_" + index;
	        helper.SetFocus(currentFocusedElemId);
			$("#"+currentFocusedElemId).addClass("menu-item-ctn-highlight");
    	}
		else{
			removeBottomButtonFocus();
			var currentFocusedElemId = $scope.currentLevelIndex + "_" + index;
	        helper.SetFocus(currentFocusedElemId);
			$("#"+currentFocusedElemId).addClass("menu-item-ctn-highlight");
		}
    };

    //Resets the grid margin
    function resetGridMargin(){
        $('#grid-container-top').css('margin-left',0);
    };

    //grid click event handler
    function onGridClickEvent(level, index) {

        $scope.currentLevelIndex = level;
        var currentFocusedElemId = $scope.currentLevelIndex + "_" + index;
        //This is to disable the click event for out of stock titles.
		if($("#" + currentFocusedElemId).hasClass('grid-item-disabled')) return false;
        var Pid = $("#" + currentFocusedElemId).attr("pid");

        $scope.productID = Pid;
        $scope.movieName = $("#" + currentFocusedElemId).attr("pname");
        if ($scope.genresApplicable == true && $scope.currentIndexForMovies == -1) {
            $scope.trackOmniture[0] = OMNITURE_BROWSE.GENRE_CLICK;
        }
        else {
            $scope.currentIndexForMovies = index;  // ZOE-32928: to get the thumbnail position
            $scope.trackOmniture[0] = OMNITURE_BROWSE.THUMBNAIL_CLICK;
        }
        // This is to set the Grid Current Index so that when the user comes back from titles details page
        // the index position to move up/down/right/left is maintained..
        $scope.levelMap[$scope.currentLevelIndex].currentIndex = index;
        $scope.omnitureReady[0] = true;

        if (helper.isDefined(Pid)) {
			if (isDefined($scope.QID)) {
        		rbiCommonService.setSharedItem('QueryID', $scope.QID);
        	} else {
        		rbiCommonService.setSharedItem('QueryID', null);
			}
        	$scope.setBrowseGridState();
            if (helper.isDefined($scope.KioskId)) {
                $location.path('titledetail/' + Pid + '/' + $scope.KioskId);
            } else {
                $location.path('titledetail/' + Pid);
            }
        }

    };
    function onGrid2ClickEvent(level, index) {
        helper.debugLog("Click Event for Second Grid");
        HandleKeyDown();
        setTimeout(function(){
            onGridClickEvent(level,index);
            if(!$scope.$$phase) $scope.$apply();
        },100);
    };

    //mouse over for bottom buttons
    function onBottomButtonHover(id) {
        removeBottomButtonFocus();
        helper.SetFocus(id);
    };

    //to remove remote color buuton focus
    function removeBottomButtonFocus() {
        helper.RemoveFocus('Category');
        helper.RemoveFocus('Filter');
        helper.RemoveFocus('back-button-wrapper');
        helper.RemoveFocus('menu-button-wrapper');
        helper.RemoveFocus('53_0');
        helper.RemoveFocus('53_1');
        helper.RemoveFocus('53_2');
        $("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).removeClass('tab-1Highlight');
        $("#" + $scope.level_TAB + "_" + $scope.currentIndexOfTopBar).addClass('tab-1High');
        helper.RemoveFocus($scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex);
        helper.RemoveFocus($scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex);
        helper.RemoveFocus($scope.currentLevelIndex + "_" + $scope.levelMap[$scope.currentLevelIndex].currentIndex);
        helper.RemoveFocus($scope.selectedHoverLevel + "_" + $scope.selectedHoverIndex);
    };

    //calls when user clicks on views
    function processViewClick(id, keyCode) {
    	if(!$scope.IsBrowseKiosk()){
        if (new Date().getMilliseconds() - $scope.startTime < 100) {
            $scope.startTime = 0;
            event.stopPropagation();
            // Below exception breaks the code flow and the current level index is not set to TOP grid,
            // processViewClick is processed before the current level index is set on L1/R1 event, therefore we see
            // the bottom grid scrolling even if the current index grid is TOP - ZOE-32365
            //throw "flushing event pipeline";
        }
        if (keyCode == 0) {
            $("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).removeClass('tab-1Highlight');
            currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex;
            $("#" + $scope.level_VIEW + "_" + currentIndex).removeClass('menu-itemHighlight');
            currentIndex = $scope.level_VIEW + "_" + id;
            $("#" + currentIndex).addClass('menu-itemHighlight');
            $scope.currentFormatID = ($("#" + currentIndex).attr("attributeID"));
            $scope.getTitlesByFilter();
            $scope.levelMap[$scope.level_VIEW].currentIndex = id;
            return;

        }
        var currentIndex = id;
        if (!$scope.isGame()) {
            if ($scope.IsGameOrBrowseKiosk()) {
                $scope.levelMap[$scope.level_VIEW].currentIndex = 2;
            }
               $("#" + $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex).removeClass('menu-itemHighlight');
            if (keyCode == KEY_CODES.L1) {
                if (currentIndex > 0) {
                    $("#" + $scope.level_VIEW + "_" + currentIndex).removeClass('menu-itemHighlight');
                    $scope.levelMap[$scope.level_VIEW].currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex - 1;
                    currentIndex = $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex;
                  
                }
            }
            if (keyCode == KEY_CODES.R1) {
                if (currentIndex + 1 < $scope.levelMap[$scope.level_VIEW].maxElements - 4) {
                   
                    $scope.levelMap[$scope.level_VIEW].currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex + 1;
                    currentIndex = $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex;
                  
                }
                  }
                  if (id.length > 1) {
                  	$scope.levelMap[$scope.level_VIEW].currentIndex = parseInt(id.split("_")[1]);
					}
                  $("#" + currentIndex).addClass('menu-itemHighlight');
                  $scope.currentAvailabilityID = $("#" + currentIndex).attr("attributeID");
            switch (currentIndex) {
                case '1_0':
                {
                    ViewClick($scope.subscriptionID, $scope.Availability.Subscription);
                    resetGrid();
                    break;
                }
                case '1_1':
                {
                    ViewClick($scope.KioskID, $scope.Availability.atBox);
                    resetGrid();
                    break;
                }
                case '1_2':
                {
                    ViewClick($scope.rentBuyID, $scope.Availability.RentBuy);
                    resetGrid();
                    break;
                }
                case '1_3':
                {
					ViewClick($scope.allID, $scope.Availability.All);
                    resetGrid();
                    break;
                }
            }
        }
        else {

            if (keyCode == KEY_CODES.L1) {
                $("#" + $scope.level_VIEW + "_" + currentIndex).removeClass('menu-itemHighlight');
                if (currentIndex >= 5) {
                    $scope.levelMap[$scope.level_VIEW].currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex - 1;
                    currentIndex = $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex;

                }
                $("#" + currentIndex).addClass('menu-itemHighlight');
                $scope.currentFormatID = ($("#" + currentIndex).attr("attributeID"));
                $scope.getTitlesByFilter();
            }
            else if (keyCode == KEY_CODES.R1) {
                if (currentIndex >= 4 && currentIndex + 1 < $scope.levelMap[$scope.level_VIEW].maxElements) {
                    $("#" + $scope.level_VIEW + "_" + currentIndex).removeClass('menu-itemHighlight');
                    $scope.levelMap[$scope.level_VIEW].currentIndex = $scope.levelMap[$scope.level_VIEW].currentIndex + 1;
                    currentIndex = $scope.level_VIEW + "_" + $scope.levelMap[$scope.level_VIEW].currentIndex;
                    $("#" + currentIndex).addClass('menu-itemHighlight');
                    $scope.currentFormatID = ($("#" + currentIndex).attr("attributeID"));
                    $scope.getTitlesByFilter();
                }
            }
        }
    	}
    };

    //mouse over event for pop up filters
    function onPopUpMouseOverEvent(level, index) {
        removeBottomButtonFocus();
        $scope.selectedHoverIndex = index;
        $scope.selectedHoverLevel = level;
        $scope.HoverTimeInterval = setInterval(function () {
            HandlePopUpScrolling();
            clearInterval($scope.HoverTimeInterval);
        }, 1000);

        var currentFocusedElemId = level + "_" + index;
        helper.SetFocus(currentFocusedElemId);
       };

       //to handle mouse over event of tab
       function onTabMouseOverEvent(id) {
       	removeBottomButtonFocus();
       	var index = parseInt(id.split("_")[1]);
       	$("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).removeClass('tab-1Highlight');
       	$scope.levelMap[$scope.level_TAB].currentIndex = index;
       	//$scope.currentLevelIndex = $scope.level_TAB;
       	$("#" + id).addClass('tab-1Highlight');
       }

    //mouse over autoscrolling for pop up filters
    function HandlePopUpScrolling() {

        setSelectedIndexOnCurrentLevel();
        if ($scope.uiFilterPopupOpen == true) {
            if ($scope.categoryPopupOpen && $scope.selectedCategoryFilterIndex < ($scope.filter2.length )) {
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedCategoryFilterIndex);
                updateFilterTwoIndex($scope.selectedCategoryFilterIndex);
            } else if ($scope.viewPopupOpen && $scope.selectedViewFilterIndex < ($scope.filter2.length )) {
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedViewFilterIndex);
            } else if ($scope.viewRatingOpen && $scope.selectedRatingFilterIndex < ($scope.filter2.length )) {
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedRatingFilterIndex);
                updateFilterTwoIndex($scope.selectedRatingFilterIndex);
            } else if ($scope.viewFormatOpen && $scope.selectedFormatFilterIndex < ($scope.filter1.length)) {
                scrollPopDown("PopupColumn1Items", "50_" + $scope.selectedFormatFilterIndex);
            } else if ($scope.viewSortByOpen && $scope.selectedSortFilterIndex < ($scope.filter3.length )) {
                scrollPopDown("PopupColumn3Items", "52_" + $scope.selectedSortFilterIndex);
            }
        }
        $scope.$apply();
        removeBottomButtonFocus();
    };

    //mouse click event for pop up filters
    function onPopUpMouseClickEvent(level, index) {
        $scope.selectedHoverLevel = level;
        $scope.selectedHoverIndex = index;
        setSelectedIndexOnCurrentLevel();
        processBottomButtonClick("53_2");
    }

    function setSelectedIndexOnCurrentLevel() {
        $scope.viewFormatOpen = false;
        $scope.viewRatingOpen = false;
        $scope.viewSortByOpen = false;
        if ($scope.categoryPopupOpen && $scope.selectedHoverLevel == "51") {
            $scope.selectedCategoryFilterIndex = $scope.selectedHoverIndex;
        } else if ($scope.selectedHoverLevel == "50") {
            $scope.viewFormatOpen = true;
            $scope.selectedFormatFilterIndex = $scope.selectedHoverIndex;
        } else if ($scope.selectedHoverLevel == "51") {
            $scope.viewRatingOpen = true;
            $scope.selectedRatingFilterIndex = $scope.selectedHoverIndex;
        } else if ($scope.selectedHoverLevel == "52") {
            $scope.viewSortByOpen = true;
            $scope.selectedSortFilterIndex = $scope.selectedHoverIndex;
        }

    };

    //mouse out event for pop up filters
    function onPopUpMouseOutEvent() {
        removeBottomButtonFocus();
        clearInterval($scope.HoverTimeInterval);
    }

//to handle remote remote mouse wheel 
    function handleMouseWheel(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta == 1) {
            HandleKeyUp();
        } else {
            HandleKeyDown();
        }
        $scope.$apply();
    }

//to handle browse mouse wheel down scrolling along with remote down key
    function HandleKeyDown() {
    	if (!$scope.showHangOnthere && $scope.dataLoaded) {
        var currentIndex = (undefined == $scope.levelMap[$scope.currentLevelIndex]) ? 0 : $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedElemId = $scope.currentLevelIndex + "_" + currentIndex;

        //for the navigation in the pop ups
        if ($scope.uiFilterPopupOpen == true) {
            if ($scope.categoryPopupOpen && $scope.selectedCategoryFilterIndex < ($scope.filter2.length - 1)) {
                $scope.selectedCategoryFilterIndex++;
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedCategoryFilterIndex);
                updateFilterTwoIndex($scope.selectedCategoryFilterIndex);
            } else if ($scope.viewPopupOpen && $scope.selectedViewFilterIndex < ($scope.filter2.length - 1)) {
                $scope.selectedViewFilterIndex++;
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedViewFilterIndex);
            } else if ($scope.viewRatingOpen && $scope.selectedRatingFilterIndex < ($scope.filter2.length - 1)) {
                $scope.selectedRatingFilterIndex++;
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedRatingFilterIndex);
                updateFilterTwoIndex($scope.selectedRatingFilterIndex);
            } else if ($scope.viewFormatOpen && $scope.selectedFormatFilterIndex < ($scope.filter1.length - 1)) {
                $scope.selectedFormatFilterIndex++;
                scrollPopDown("PopupColumn1Items", "50_" + $scope.selectedFormatFilterIndex);
            } else if ($scope.viewSortByOpen && $scope.selectedSortFilterIndex < ($scope.filter3.length - 1)) {
                $scope.selectedSortFilterIndex++;
                scrollPopDown("PopupColumn3Items", "52_" + $scope.selectedSortFilterIndex);
            }
        }
        else {
            $scope.IsSecondRowSelected = false;
            if ($scope.uiFilterPopupOpen == false) {
                var currIndex = $scope.levelMap[$scope.level_GRID].currentIndex;
                if ($scope.currentLevelIndex == $scope.level_GRID) {
                    var lastIndex = $scope.levelMap[$scope.level_GRID].currentIndex + ($scope.pageNumber - 1) * 12 + 6;
                    var lastElementID = 0;

					if ($scope.levelMap[$scope.level_GRID].currentIndex >= 6 && $scope.levelMap[$scope.level_GRID].currentIndex < 12 && ($scope.pageCount - lastIndex) < 1) {
                            $scope.IsSecondRowSelected = true;
                            return;
                    }
					
                    if ($scope.pageCount - lastIndex < 1) {
                        //is there any thing less than 6 elements here
                        lastElementID = ($scope.pageCount) % 12;

                        if (lastElementID >= 6) {
                            $scope.IsSecondRowSelected = false;
                            if ($scope.levelMap[$scope.level_GRID].currentIndex >= 6 && $scope.levelMap[$scope.level_GRID].currentIndex < 12) {
                                $scope.IsSecondRowSelected = true;
                            }

                        }
                    }
                    if ($scope.canScrollDown == true || $scope.filterUpdated == true) {


                        if (currIndex >= 0 && currIndex < 6) //first row
                        {

                            if (document.getElementById($scope.level_GRID + "_" + ( 6 + currIndex)) != null) {
                                $scope.levelMap[$scope.level_GRID].currentIndex = 6 + currIndex;
                                $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                                $scope.IsSecondRowSelected = true;
                                scrollGrid();
                                // Pre-loading the titles on DOWN from the 1st row
                                loadMoreTitles('Down_Arrow', $scope.pageNumber);
                            }
                        }
                        else {

                            handleGridKeyArrowDown('Down_Arrow', $scope.pageNumber);
                            if ($scope.pageCount - lastIndex < 1 && lastElementID != 0) {
                                $scope.levelMap[$scope.level_GRID].currentIndex = lastElementID - 1;
                            }
                            else {
                                $scope.levelMap[$scope.level_GRID].currentIndex = currIndex - 6;
                            }

                            $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;

                            scrollGrid();
                        }
                    }
                }
                if ($scope.currentLevelIndex == $scope.level_TOP_GRID) {

                    $("#topgrid").hide(); // *** Hide the Top Grid
                    //*** Removing the focus here does not add the focus back on UP from GRID to TOP Grid
                    helper.RemoveFocus($scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex);
                    $scope.currentIndexForTop =-1;
                    $scope.currentLevelIndex = $scope.level_GRID;
                    $scope.levelMap[$scope.level_GRID].currentIndex = 0;
                    $scope.currentIndexForMovies = 0;
                    currentIndex = $scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex;
                    helper.SetFocus(currentIndex);
           
                }
                //Checking the Condition for Game Data
                if (RBI.PlatformConfig.showGames == true) {
                    if ($scope.currentLevelIndex == $scope.level_TAB) {
                        if ($scope.genresApplicable == false) {
                            currentIndex = $scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex;
                            helper.SetFocus(currentIndex);
                            $scope.currentLevelIndex = $scope.level_GRID;

                            $("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).removeClass('tab-1Highlight');
                            $("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).addClass('tab-1High');

                            $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                            $("#" + currentIndex).addClass('grid-item-wrapper-hightlight menu-item-ctn-highlight');
                        }
                        else {
                            currentIndex = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                            //helper.SetFocus(currentIndex);
                            $scope.currentIndexForTop = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                            $scope.currentLevelIndex = $scope.level_TOP_GRID;
                            $("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).removeClass('tab-1Highlight');
                            $("#" + $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex).addClass('tab-1High');

                            $("#" + currentIndex).addClass('grid-item-wrapper-hightlight menu-item-ctn-highlight');
                        }
                        if ($routeParams.productType.toLowerCase() == "movie") {
                            $scope.currentIndexOfTopBar = 0;
                        }
                        else {
                            $scope.currentIndexOfTopBar = 1;
                        }
                    }
                }
                //End of the Condition for Game Data
            }
                       }
		}
    }

    //to handle browse mouse wheel up scrolling along with remote up key
    function HandleKeyUp() {
    if (!$scope.showHangOnthere && $scope.dataLoaded) {
        var currentIndex = (undefined == $scope.levelMap[$scope.currentLevelIndex]) ? 0 : $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedElemId = $scope.currentLevelIndex + "_" + currentIndex;

        //for the navigation in the pop ups
        if ($scope.uiFilterPopupOpen == true) {
            if ($scope.categoryPopupOpen && $scope.selectedCategoryFilterIndex > 0) {
                $scope.selectedCategoryFilterIndex--;
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedCategoryFilterIndex);
                updateFilterTwoIndex($scope.selectedCategoryFilterIndex);
            }
            else if ($scope.viewPopupOpen && $scope.selectedViewFilterIndex > 0) {
                $scope.selectedViewFilterIndex--;
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedViewFilterIndex);
            }
            else if ($scope.viewRatingOpen && $scope.selectedRatingFilterIndex > 0) {
                $scope.selectedRatingFilterIndex--;
                scrollPopDown("PopupColumn2Items", "51_" + $scope.selectedRatingFilterIndex);
                updateFilterTwoIndex($scope.selectedRatingFilterIndex);
            } else if ($scope.viewFormatOpen && $scope.selectedFormatFilterIndex > 0) {
                $scope.selectedFormatFilterIndex--;
                scrollPopDown("PopupColumn1Items", "50_" + $scope.selectedFormatFilterIndex);
            } else if ($scope.viewSortByOpen && $scope.selectedSortFilterIndex > 0) {
                $scope.selectedSortFilterIndex--;
                scrollPopDown("PopupColumn3Items", "52_" + $scope.selectedSortFilterIndex);
            }
        }
        else {
            if ($scope.uiFilterPopupOpen == false) {
                if ($scope.currentLevelIndex == $scope.level_TOP_GRID) {
                    //make it to the top in genres
                    //Checking the Condition for Game Data
                    if (RBI.PlatformConfig.showGames == true) {
                        $scope.currentIndexForMovies = -1;
                        helper.RemoveFocus($scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex);
                        //$scope.levelMap[$scope.level_TAB].currentIndex = 0;
                        $scope.currentLevelIndex = $scope.level_TAB;
                        if ($routeParams.productType.toLowerCase() == "movie") {
                            $scope.levelMap[$scope.level_TAB].currentIndex = 0;
                        }
                        else {
                            $scope.levelMap[$scope.level_TAB].currentIndex = 1;
                        }
                        currentIndex = $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex;
                        $("#" + currentIndex).addClass('tab-1Highlight');
                    }
                    //End of the Condition for Game Data
                }
                if ($scope.pageNumber - 1 == 0) {

                    if ($scope.genresApplicable) {
                        if ($scope.levelMap[$scope.level_GRID].currentIndex >= 6 && $scope.levelMap[$scope.level_GRID].currentIndex < 12) {

                            //restore the top and all in genres
                            $scope.changeLevel = true;
                            var index = $scope.levelMap[$scope.level_GRID].currentIndex;
                            var nextIndex = $scope.levelMap[$scope.level_GRID].currentIndex - 6;
                            handleEnterButtonClick();
                            $scope.changeLevel = true;
                            $scope.genreSelectedOrChanged = true;
                            //$scope.genresLoaded = true;

                            $scope.levelMap[$scope.level_GRID].currentIndex = nextIndex;
                            $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                            $scope.IsSecondRowSelected = false;
                            scrollGrid();

                            return;
                        }
                    }
                }
                // first row
                if (currentIndex >= 0 && currentIndex < 6) {
                    if (($scope.currentLevelIndex == $scope.level_GRID || $scope.currentLevelIndex == $scope.level_TOP_GRID)) {

                        if ($scope.pageNumber > 1) {

                            $scope.IsSecondRowSelected = true;
                            handleGridKeyArrowDown('Down_Up', $scope.pageNumber);
                            $scope.levelMap[$scope.level_GRID].currentIndex = 6 + $scope.levelMap[$scope.level_GRID].currentIndex;
                            $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                            scrollGrid();
                        }
                        else if ($scope.pageNumber == 1) {
                            if ($scope.genresApplicable == false) {
                                //Checking the Condition for Game Data
                                if (RBI.PlatformConfig.showGames == true) {
                                    helper.RemoveFocus($scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex);
                                    helper.RemoveFocus($scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex);

                                    if ($routeParams.productType.toLowerCase() == "movie") {
                                        $scope.levelMap[$scope.level_TAB].currentIndex = 0;
                                    }
                                    else {
                                        $scope.levelMap[$scope.level_TAB].currentIndex = 1;
                                    }
                                    currentIndex = $scope.level_TAB + "_" + $scope.levelMap[$scope.level_TAB].currentIndex;
                                    $scope.currentLevelIndex = $scope.level_TAB;
                                    //currentIndex = "0_0";
                                    $("#" + currentIndex).addClass('tab-1Highlight');
                                }
                                //End of Condition
                            }
                            else {
                                if ($scope.currentLevelIndex == $scope.level_GRID) {

                                    //make it to the top in genres
                                    $scope.currentIndexForMovies = -1;
                                    helper.RemoveFocus($scope.level_GRID + "_" + $scope.levelMap[$scope.level_GRID].currentIndex);
                                    $scope.currentLevelIndex = $scope.level_TOP_GRID;
                                    currentIndex = $scope.level_TOP_GRID + "_" + $scope.levelMap[$scope.level_TOP_GRID].currentIndex;
                                    $scope.currentIndexForTop = $scope.levelMap[$scope.level_TOP_GRID].currentIndex;

                                    $("#topgrid").show(); //*** Show the Top Grid.


                                }
                            }
                        }
                    }
                }
                // second row
                else if (currentIndex >= 6 && currentIndex < 12) {
                    if (currentIndex - 6 >= 0) {
                        $scope.IsSecondRowSelected = false;
                        $scope.levelMap[$scope.level_GRID].currentIndex = currentIndex - 6;
                        $scope.currentIndexForMovies = $scope.levelMap[$scope.level_GRID].currentIndex;
                        scrollGrid();

                    }
                }
            }
            }
        }
    }
	//following four methods moved from scope to this event handler (updateFilterTwoIndex, ViewClick, getApplicableFormats, onTabClick)

    function updateFilterTwoIndex (index) {
    	$scope.filterTwoIndex = index;
    	if ($scope.genresApplicable) {
    		$scope.viewClicked = true;
    	}
    };
    function ViewClick (id, availabilityType) {
    	$scope.selectedFilterItem = availabilityType;
    	if ($scope.dataLoaded == true) {
    		var filterIndex = 0;
    		if ($scope.levelMap[$scope.level_VIEW].currentIndex == 3) {
    			$scope.filter1 = $scope.formats;
    		}
    		else {
    			$scope.filter1 = getApplicableFormats();
    		}
    		if ($scope.filter1.length != $scope.formats.length) {
    			for (var count = 0; count < $scope.filter1.length; count++) {
    				if ($scope.currentFormatName.toLowerCase() == $scope.filter1[count].name.toLowerCase()) {
    					filterIndex = count;
    					break;
    				}
    			}
    			$scope.selectedFormatFilterIndex = filterIndex;
    		}
    		$scope.currentFormatID = $scope.filter1[$scope.selectedFormatFilterIndex].id;
            $scope.pageNumber = 1; // resetting the page number to 1 so that when we load the tab view it should start from the first page..
            if ($scope.currentLevelIndex == $scope.level_TAB) { 
				$scope.currentIndexForMovies = 0;
				$scope.currentLevelIndex = $scope.level_GRID;
				removeBottomButtonFocus();
			}
			if ($scope.genresApplicable) {
				$scope.viewClicked = true;
			}
            if(undefined != $scope.responseTime)clearTimeout($scope.responseTime);
            $scope.responseTime = setTimeout(function(){
                $scope.getTitlesByFilter();
                if(!$scope.$$phase) $scope.$apply();
            },900);
    	}
    };
    function getApplicableFormats() {

    	var filterIndex = 0;
    	var applicableFormats = [];
    	if ($scope.levelMap[$scope.level_VIEW].currentIndex == 0 || $scope.levelMap[$scope.level_VIEW].currentIndex == 2) {

    		for (var i = 0; i < $scope.formats.length; i++) {
    			if ($scope.formats[i].name.toLowerCase() != "blu-ray" && $scope.formats[i].name.toLowerCase() != "dvd") {
    				applicableFormats.push($scope.formats[i]);
    			}
    		}
    	}
    	if ($scope.levelMap[$scope.level_VIEW].currentIndex == 1) {
    		var applicableFormats = [];
    		for (var i = 0; i < $scope.formats.length; i++) {
    			if ($scope.formats[i].name.toLowerCase() != "hd" && $scope.formats[i].name.toLowerCase() != "sd") {
    				applicableFormats.push($scope.formats[i]);
    			}
    		}
    	}
    	return applicableFormats;
    }
    //for the tab click of the movies and games
	 function onTabClick(id) {
    	$scope.filtersLoaded = false;
    	$scope.pageloaded = false;
    	$scope.tabsChanged = true;
    	//clear the filters for the browse page on tab clicks
    	helper.clearLocalStorage("browseFilter");
    	helper.clearLocalStorage("browseFilterForKiosk");
    	if (backPaths != null && backPaths.length > 0)
    		backPaths.pop();
    	if (id == '0_0') {
            // Reset Sort filter on switching from Games to Movies
            updateFilterSorting("Movie");
    		if (isDefined($routeParams.kioskId)) {
    			$location.path("/browse/Movie/" + $routeParams.kioskId);
    			$scope.currentIndexOfTopBar = 0;
    		}
    		else {
    			$location.path("/browse/Movie");
    		}
    	}
    	else {
            // Reset Sort filter on switching from Movies to Games
            updateFilterSorting("Game");
    		$scope.currentIndexOfTopBar = 1;
    		if (isDefined($routeParams.kioskId)) {
    			$location.path("/browse/Game/" + $routeParams.kioskId);
    		}
    		else {
    			$location.path("/browse/Game");
    		}
    	}
    };

    
    //to get visibility of top in grid
     function isTopInVisible() {
     if ($("#topgrid").css('display') == "block") {
         // This is to avoid focusing both the Top Grid as well as the All in Grid and for the focus to
         // to be on the All in grid when the user navigates from All in to title details and back..
         if($scope.currentIndexForTop == -1)
              $scope.currentIndexForMovies = $scope.currentIndexForMovies;
         else $scope.currentIndexForMovies = -1;
      removeBottomButtonFocus();
            return true;
        } else {
            return false;
        }

    }
   
    function hangonMouseOver(id) {
        id == 'yes-btn' ?  helper.RemoveFocus('no-btn'):helper.RemoveFocus('yes-btn');
        helper.SetFocus(id);
    }
	
    function showBrowseDiv(){
    	//$('#grid-container-all-parent').css('visibility','visible');
        $('#grid-container-all-parent').show();
    }
    
	 function showRecommendationMessage(msg) {
		$(".error-msgs").css('display', 'block');
		$scope.RecommendedErrorMsg = msg;
		//$scope.$apply();
	}
	function hideRecommendationMessage() {
		$(".error-msgs").css('display', 'none');
		$scope.RecommendedErrorMsg = "";
		//$scope.$apply();
	}
}

