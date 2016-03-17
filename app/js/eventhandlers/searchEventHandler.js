/**
 * SearchEventHandler - This class should handle event like keyevent etc.
 * This page handles all the key events related to search page.
 * @author surya
 */
'use strict';
function searchEventHandler($scope, $location) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.onMouseOverEvent = onMouseOverEvent;
    this.onGridClickEvent = onGridClickEvent;
    this.onGrid2ClickEvent = onGrid2ClickEvent;
    this.onViewClick = onViewClick;
    this.handleMouseWheel = handleMouseWheel;
    this.showRecommendationMessage = showRecommendationMessage;
    this.hideRecommendationMessage = hideRecommendationMessage;
	
    function handleKeyDownEvent(event) {

        if (document.readyState != "complete") {
            return false;
        }
        var LEVEL_TEXTBOX = 1;
        var LEVEL_LIST = 3;
        var levelMap = $scope.levelMap;
        if ($scope.CurrentLevelIndex != "100")
            $scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;

        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if ($scope.dataLoaded == false && event.keyCode == 40 && $scope.CurrentLevelIndex == 3) {
            return;
        }
        if (handleMainMenu($scope, event.keyCode, $location)) {
            return; // global menuing handled, so bail on logic below, or alter here.
        }

        switch (event.keyCode) {

            case KEY_CODES.DPAD_LEFT:
            {

                if ($scope.CurrentLevelIndex == 3) {

                    if ($scope.currentIndex < $scope.maxelements - 1) {
                        if ($scope.currentIndex % 4 != 0) {
                         //   helper.RemoveFocus(currentFocusedEleId);
                           // var data = (currentFocusedEleId).split("_");
                         //   $('#divid_' + data[1]).removeClass("list-item-img-highlight");
                            $scope.currentIndex = parseInt($scope.currentIndex - 1);
                            levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
                          //  var newElementId = [$scope.CurrentLevelIndex] + "_" + $scope.currentIndex;
                           // helper.SetFocus(newElementId);
                          //  var data = (newElementId).split("_");

                           // $('#divid_' + data[1]).addClass("list-item-img-highlight");
                        }
                        else {
                            $scope.levelIndex = $scope.currentIndex;
                         //   helper.RemoveFocus(currentFocusedEleId);
                          //  var data = (currentFocusedEleId).split("_");
                          //  $('#divid_' + data[1]).removeClass("list-item-img-highlight");
                            $scope.CurrentLevelIndex = 1;
							$('#1_0').focus();
							$scope.currentIndex = -1;
                          //  helper.SetFocus('searchBox');
                          //  helper.SetFocus('1_0');
                         //   $('#1_0').addClass("textbox-highlight");

                        }

                    }
                    else {
                        if ($scope.currentIndex % 4 == 0) {
                            $scope.levelIndex = $scope.currentIndex;
                         //   helper.RemoveFocus(currentFocusedEleId);
                         //   var data = (currentFocusedEleId).split("_");
                          //  $('#divid_' + data[1]).removeClass("list-item-img-highlight");
                            $scope.CurrentLevelIndex = 1;
							$('#' + $scope.CurrentLevelIndex +'_'+$scope.currentIndex).focus();
							$('#divid_' + $scope.currentIndex).blur();
                         //   helper.SetFocus('searchBox');
                         //   helper.SetFocus('1_0');
                           // $('#1_0').addClass("textbox-highlight");
                        }
                        else {
                           // helper.RemoveFocus(currentFocusedEleId);
                           // var data = (currentFocusedEleId).split("_");
                           // $('#divid_' + data[1]).removeClass("list-item-img-highlight");
                            $scope.currentIndex = parseInt($scope.currentIndex - 1);
                            levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
                          //  var newElementId = [$scope.CurrentLevelIndex] + "_" + $scope.currentIndex;
                          //  helper.SetFocus(newElementId);
                          //  var data = (newElementId).split("_");

                          //  $('#divid_' + data[1]).addClass("list-item-img-highlight");
                        }
                    }


                }

                break;
            }
            case KEY_CODES.DPAD_RIGHT:
            {
                if ($scope.CurrentLevelIndex == 3) {
                    if ($scope.currentIndex < ($scope.titles.length - 1) && $scope.dataLoaded == true) {
                        if ($scope.currentIndex == ($scope.titles.length - 5)) {
                            // preload titles from the second last row on RIGHT
								if($scope.recommendedTitles)
									$scope.preloadRecommendedTitles("", $scope.filter, $scope.currentPage + 1);
								else
									$scope.preloadTitles($scope.searchString, $scope.filter, $scope.currentPage + 1);
                        }
							$scope.currentIndex = parseInt($scope.currentIndex + 1);
                        if ($scope.currentIndex > 0 && $scope.currentIndex % 4 == 0) {
                            $scope.top_margin_offset = $scope.top_margin_con_offset;
                            /*+ $scope.first_page_margin_offset;*/
                            ScrollDown();
                        }
                        if ($scope.currentIndex % 4 == 0)
                            $scope.row = $scope.row + 1;
							levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
                    }
                    else if($scope.currentIndex >=0 && $scope.row < $scope.totRows){
						$scope.titles = $scope.gridtitles;
						$scope.currentIndex = 0;
						$scope.currentPage = $scope.currentPage + 1;
						levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
						$scope.saveTitleListMargin = $scope.title_list_margin;
						$scope.title_list_margin = 0;
						$scope.row = $scope.row + 1;
                    }
                }
                else if (isDefined($scope.titles)){
					$scope.currentIndex = $scope.levelIndex;
					$scope.CurrentLevelIndex = 3;
					$('#' + $scope.CurrentLevelIndex +'_'+$scope.currentIndex).focus();
					$('#1_0').blur();
					$('#divid_' + $scope.currentIndex).blur();
                }
                break;
            }
            case KEY_CODES.DPAD_UP:
                handleArrowUp();
                break;
				
            case KEY_CODES.DPAD_DOWN:
                handleArrowDown();
                break;

            // case KEY_CODES.DPAD_RIGHT:
            case KEY_CODES.R1:
            { // Right Arrow
                try {
                    if (new Date().getMilliseconds() - $scope.startTime < 200) {
                        $scope.startTime = 0;
                        event.stopPropagation();
                        throw "flushing event pipeline";
                    }
                    if (isDefined($scope.searchString) == true && $scope.filterIndex < 3) {//added condition to prevent focus lost and circular shift
                        $("#loading-bar").show();
                        $('#2_' + $scope.filterIndex).removeClass("menu-itemHighlight");
                        $scope.filterIndex = $scope.filterIndex + 1;
                        onViewClick($scope.filterIndex);
                    }
                }
                catch (object) {
                    return false;
                }
                break;
            }
           // case KEY_CODES.DPAD_LEFT:
            case KEY_CODES.L1:
            { // Left Arrow
                try {
                    if (new Date().getMilliseconds() - $scope.startTime < 200) {

                        $scope.startTime = 0;
                        event.stopPropagation();
                        throw "flushing event pipeline";
                    }
                    if (isDefined($scope.searchString) == true && $scope.filterIndex > 0) //added condition to prevent focus lost and circular shift
                    {
                        $("#loading-bar").show();
                        $('#2_' + $scope.filterIndex).removeClass("menu-itemHighlight");
                        $scope.filterIndex = $scope.filterIndex - 1;
                        onViewClick($scope.filterIndex);
                    }
                } catch (object) {
                    return false;
                }
                break;
            }

            case KEY_CODES.X:
            {
                if ($scope.CurrentLevelIndex == 3 && helper.isDefined($("#search_productid_" + $scope.currentIndex).val())) {
                    $scope.productID = $("#search_productid_" + $scope.currentIndex).val();
                    $scope.movieName = $("#search_productid_" + $scope.currentIndex).attr("pname");

                    $scope.trackOmniture.push("thumbnailClicked");
                    $scope.omnitureReady=[true];

                    $location.path("/titledetail/" + $("#search_productid_" + $scope.currentIndex).val());
                } else {
                    helper.RemoveFocus('1_0');
                    helper.RemoveFocus('searchBox');
                   // $('#1_0').removeClass("textbox-highlight");
                    helper.SetFocus('searchBox');
                    helper.SetFocus('1_0');
                    //$('#1_0').addClass("textbox-highlight");

                }
                break;
            }

            case KEY_CODES.CIRCLE:
            {
                goToPreviousPath($scope, event.keyCode, $location);
                break;
            }

        }
        // Code added to fix issue ZOE-28145 
        if ($scope.searchString == "") {
            $scope.titles = [];
            $scope.search_term = '';
        }
    }

    function ScrollUp() {
		if ($scope.title_list_margin < 0) { //added because view is coming down 
        $scope.title_list_margin = $scope.title_list_margin + $scope.top_margin_offset;
        //$("#grid-item-longwrapper").stop().animate({ marginTop: $scope.title_list_margin }, 200);
            $("#grid-item-longwrapper").css({ marginTop:$scope.title_list_margin});

		}
    }

    //function to handle scrolling of more like this section
    function ScrollDown() {
        $scope.title_list_margin = $scope.title_list_margin - $scope.top_margin_offset;
        //$("#grid-item-longwrapper").stop().animate({ marginTop: $scope.title_list_margin }, 300);
        $("#grid-item-longwrapper").css({ marginTop:$scope.title_list_margin});

    }

    function onMouseOverEvent(level, index) {
        $scope.currentIndex = parseInt(index);
        $scope.CurrentLevelIndex = level;
        $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
        if(level == 1){
			$('#1_0').focus();
		}
		else{
			$('#1_0').blur();
		}
    };

    function onGridClickEvent(level, index) {
        $scope.productID = $("#search_productid_" + index).val();
        $scope.movieName = $("#search_productid_" + index).attr("pname");
        $scope.trackOmniture.push("thumbnailClicked");
        $scope.omnitureReady=[true];
        $scope.currentIndex = index;
        $location.path("/titledetail/" + $("#search_productid_" + $scope.currentIndex).val());
    };

    function onGrid2ClickEvent(level, index) {
        helper.debugLog("Handle Grid 2");
        handleArrowDown();
        setTimeout(function(){
            onGridClickEvent(level,index);
            if(!$scope.$$phase) $scope.$apply();
        },100);
    };

    //to handle view click using magic remote and remote key
    function onViewClick(index) {
        if (isDefined($scope.searchString) == true) {
			$scope.row =1;
            $scope.trackOmniture.push("deliverychange");
            $scope.omnitureReady=[true];
            $("#loading-bar").show();
            $('#2_' + $scope.filterIndex).removeClass("menu-itemHighlight");
            $scope.filterIndex = parseInt(index);
            if ($scope.filterIndex == 0){
                $scope.filter = $scope.SubscriptionID;
            }
            else if ($scope.filterIndex == 1){
            	if(RBI.PlatformConfig.showGames)
                $scope.filter = $scope.KioskID+ ',' + $scope.GameKioskID;
            	else
            		$scope.filter = $scope.KioskID;
            }
            else if ($scope.filterIndex == 2){
                $scope.filter = $scope.ESTID + ',' + $scope.VODID;
            }
            else {
                $scope.filterIndex = 3;
                if(RBI.PlatformConfig.showGames)
                $scope.filter = $scope.AllID+ ',' + $scope.GameAllID;
                else
                	$scope.filter = $scope.AllID;
            }
            if ($scope.search_term != '') {

                if(undefined != $scope.responseTime)clearTimeout($scope.responseTime);
                $scope.responseTime = setTimeout(function(){
                    $scope.searchTitles($scope.searchString, $scope.filter, 1);
                    if(!$scope.$$phase) $scope.$apply();
                },900);

                //$("#grid-item-longwrapper").stop().animate({ marginTop: 0 }, 500);
                $("#grid-item-longwrapper").css({ marginTop:0});

                $('#2_' + $scope.filterIndex).addClass("menu-itemHighlight");
            }
        }
    }
    //to handle remote remote mouse wheel
    function handleMouseWheel(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta == 1) {
            handleArrowUp();
        } else {
            handleArrowDown();
        }
        $scope.$apply();
    }

//to handle up key and scrolling
    function handleArrowUp() {
	if($scope.dataLoaded){
	if($scope.row<=1) return false;
        var levelMap = $scope.levelMap;
        if ($scope.CurrentLevelIndex != "100")
            $scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;
        if ($scope.CurrentLevelIndex == 3) {
            if ($scope.currentIndex - 4 == 0 || $scope.currentIndex - 4 > 0) {
                $scope.row = $scope.row - 1;
                if ($scope.currentIndex > 0 && $scope.currentIndex % 4 != 0) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    /*+ $scope.first_page_margin_offset;*/
                    ScrollUp();
                }
                else {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    /*+ $scope.first_page_margin_offset;*/
                    ScrollUp();
                }
                $scope.currentIndex = parseInt($scope.currentIndex - 4);
				levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
            }
            else{
                // assign previous titles to second grid and load previous page titles...
                $scope.gridtitles = $scope.titles;
                if($scope.recommendedTitles)
                    $scope.displayRecommendedElements($scope.searchString, $scope.filter, $scope.currentPage - 1);
                else
                $scope.displayelements($scope.searchString, $scope.filter, $scope.currentPage - 1);
                $scope.title_list_margin = $scope.saveTitleListMargin;
                $("#grid-item-longwrapper").css({ marginTop:$scope.title_list_margin});
                $scope.row = $scope.row - 1;
				/*	
					Related to ZOE-37075				
					For No Search Scenario (Default Search) : Total titles per page = 20 i.e. $scope.currentIndex is from 0 to 19 
					For Search Scenario : Total titles per page = 24 i.e. $scope.currentIndex is from 0 to 23 
					Hence, the condition for "no search scenario" is checked whether the element is null if currentIndex >19 
					after incrementing it by 20.
					If yes, decrement currentIndex by 4 to have the range from 0 to 19.
					Else, keep incremented currentIndex for Search scenario.
				*/
				if($scope.currentIndex <= 3){                              
						$scope.currentIndex = $scope.currentIndex + 20;
						if(document.getElementById("divid_"+$scope.currentIndex) == null){
							$scope.currentIndex = $scope.currentIndex - 4;
						}						
				}
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
            }
        }
		}
    }

    //to handle down key and scrolling
    function handleArrowDown() {
	 if($scope.dataLoaded){
	if($scope.row > $scope.totRows) return false;
        var levelMap = $scope.levelMap;
        if ($scope.CurrentLevelIndex != "100")
            $scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;
        if ($scope.CurrentLevelIndex == 3) {
            if ($scope.currentIndex + 4 <= ($scope.titles.length - 1) && $scope.dataLoaded == true) {
                if ($scope.currentIndex >= ($scope.titles.length - 8)) {
                    // preloading the titles for second grid
                    if($scope.recommendedTitles)
                        $scope.preloadRecommendedTitles("", $scope.filter, $scope.currentPage + 1);
                    else
                    $scope.preloadTitles($scope.searchString, $scope.filter, $scope.currentPage + 1);
                }
				if($scope.row == $scope.totRows ||$scope.currentIndex + 4 >$scope.titles.length) return false;
                $scope.row = $scope.row + 1;
                $scope.currentIndex = parseInt($scope.currentIndex + 4);
                if ($scope.currentIndex > 0 && $scope.currentIndex % 4 == 0) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    /*+ $scope.first_page_margin_offset;*/
                    ScrollDown();
                } else {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    ScrollDown();
                }
                levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
            }
            else {
                // last row get titles from preloaded grid..
                if ($scope.currentIndex >=0 && $scope.row < $scope.totRows) {
                    $scope.titles = $scope.gridtitles;
                    $scope.currentPage = $scope.currentPage + 1;
					/*
						Related to ZOE-37075
						For No Search Scenario (Default Search) : Total titles per page = 20 i.e. $scope.currentIndex is from 0 to 19 
						For Search Scenario : Total titles per page = 24 i.e. $scope.currentIndex is from 0 to 23 
						Hence for "Search Scenario", decrement currentIndex by 20
						and for "no Search Scenario", decrement currentIndex by 16.
					*/
					if($scope.currentIndex >= 20){                              
						$scope.currentIndex = $scope.currentIndex - 20;
					}else{
						$scope.currentIndex = $scope.currentIndex - 16;
					}
                    
					if($scope.titles.length < 4)  $scope.currentIndex = 0;
                    levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
                    $scope.saveTitleListMargin = $scope.title_list_margin;
                    $scope.title_list_margin = 0;
                    $("#grid-item-longwrapper").css({ marginTop:$scope.title_list_margin});
                    $scope.row = $scope.row + 1;
                }
            }
        }
		}
    }

    //Recommended Messaging...
    function showRecommendationMessage(msg) {
        $(".error-msgs").css('display', 'block');
        $(".search-container .search-grid-container").css({'margin-top':'15px','height': '430px'});
        $scope.RecommendedErrorMsg = msg;
    }
    function hideRecommendationMessage() {
        $(".error-msgs").css('display', 'none');
        $(".search-container .search-grid-container").css({'margin-top':'-5px','height': '445px'});
        $scope.RecommendedErrorMsg = "";
    }
}