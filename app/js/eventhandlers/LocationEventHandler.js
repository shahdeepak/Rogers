'use strict';
/**
 * LocationEventHandler - This class should handle event like keyevent etc.
 * There should not be any business logic present in it. Bussinesss logic call should be in
 * service and called from controller using $scope.
 * @author Surya
 */
function LocationEventHandler($scope, $location, $routeParams) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.onClickEvent = onClickEvent;
    this.onMouseOverEvent = onMouseOverEvent;
    this.removeBottomButtonFocus = removeBottomButtonFocus;
    this.handleMouseWheel = handleMouseWheel;
    this.manageSearchFocus = manageSearchFocus;
    var level_textbox = 1;
    var level_list = 3;
    //var currentIndex = 0;

    function handleKeyDownEvent(event) {

        //   helper.debugLog($scope.searchData);
       
        var levelMap = $scope.levelMap;
        $scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;

        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            // adding the class before the setFocus since it was not focusing the search box.. ZOE-34734
            $('#1_0').addClass("textbox-highlight");
            helper.SetFocus('1_0');
            return false;
        }
        if (handleMainMenu($scope, event.keyCode, $location)) {
            return; // global menuing handled, so bail on logic below, or alter here.
        }


        switch (event.keyCode) {
            case KEY_CODES.DPAD_LEFT:
            {

                if ($scope.CurrentLevelIndex == level_list) {
                    helper.RemoveFocus(currentFocusedEleId);

                    $scope.CurrentLevelIndex = 1;
                    var newElementId = $scope.CurrentLevelIndex + "_" + levelMap[$scope.CurrentLevelIndex].CurrentIndex;
                    helper.SetFocus(newElementId);


                }

                break;
            }
            case KEY_CODES.DPAD_RIGHT:
            {
                if ($scope.CurrentLevelIndex == level_textbox && isDefined($scope.kiosks)) {
                    helper.RemoveFocus(currentFocusedEleId);

                    $scope.CurrentLevelIndex = level_list;
                    var newElementId = $scope.CurrentLevelIndex + "_"
                        + levelMap[$scope.CurrentLevelIndex].CurrentIndex;
                    $scope.currentIndex = (undefined == levelMap[$scope.CurrentLevelIndex]) ? 0 : levelMap[$scope.CurrentLevelIndex].CurrentIndex;
                    helper.SetFocus(newElementId);


                }

                break;
            }
            case KEY_CODES.DPAD_UP:
            {
            	handleArrowUp();
                break;
            }
           case KEY_CODES.DPAD_DOWN:
           	{
           		handleArrowDown();
           		break;
           	}

           case KEY_CODES.X:
           	{
           		/*if ($scope.CurrentLevelIndex == level_textbox) {
           		$scope.searchKiosks($scope.searchString);
           		$("#list-item-longwrapper").stop().animate({ marginTop: 0 }, 500);
           		}
           		*/
           		if ($scope.CurrentLevelIndex == level_list) {
           			onClickEvent(level_list,$scope.currentIndex);
           		}
                else{
                    // added this check since on error pop POP_ALERT_BOX_VISIBLE was handled in keyboard checkInputFocusOSK
                    // and therefore we were not able to see the keyboard show up since there was no focus..
                    // ZOE-34734
                    // $('#1_0').addClass("textbox-highlight");
                     helper.SetFocus('1_0');
                }

           		break;
           	}
            case KEY_CODES.CIRCLE:
            {
                goToPreviousPath($scope, event.keyCode, $location);
                break;
            }

        }

    }

    function ScrollUp() {
    	if ($scope.kiosk_list_margin < 0){
    	$scope.kiosk_list_margin = $scope.kiosk_list_margin + $scope.top_margin_offset;
    	$(".list-item-longwrapper").css('margin-top', $scope.kiosk_list_margin);
		}
    }

    //function to handle scrolling of more like this section
    function ScrollDown() {
        $scope.kiosk_list_margin = $scope.kiosk_list_margin - $scope.top_margin_offset;
        $(".list-item-longwrapper").css('margin-top', $scope.kiosk_list_margin);
    }

	//to hanlde mouse over using magic remote
    function onMouseOverEvent(level, index) {
    	removeBottomButtonFocus();
    	helper.RemoveFocus("0_" + $scope.currentIndex);
    	var currentIndex = index;
    	$scope.CurrentLevelIndex = level;
    	$scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
    	var newElementId = [$scope.CurrentLevelIndex] + "_" + currentIndex;
    	if (level == 1) {
    		helper.SetFocus(newElementId);
    		$('#' + newElementId).addClass("textbox-highlight");
		} else {
    		addFocus(currentIndex, newElementId);
    	}


    };

    //to handle click event of active elements like button 
    function onClickEvent(level, index) {
    	var currentIndex = index;
    	$scope.CurrentLevelIndex = level;
    	if ($scope.CurrentLevelIndex == 3) {
    		if ($('#status_' + currentIndex).val() == 'Online') {

    			var kiosk_info =
                        {
                        	"KioskID": $("#kioskid_" + currentIndex).val(),
                        	"Displayname": $("#kiosk_name_" + currentIndex).val(),
                        	"Location": $("#location_" + currentIndex).val(),
                        	"Address1": $("#address1_" + currentIndex).val(),
                        	"City": $("#city_" + currentIndex).val(),
                        	"State": $("#state_" + currentIndex).val(),
                        	"ZipCode": $("#zipcode_" + currentIndex).val()
                        };

    			helper.SaveCurrentKiosk(kiosk_info, "CurrentKiosk");

                // Omniture start
                $scope.omnitureCollectOnBrowseKiosk(kiosk_info.Displayname);
                // Omniture end

    			if ($scope.statusButton == "RESERVE") {
    				platformStorage.setItem("openKioskCheckoutOnNavigation", true);
    				if (!helper.isUserLoggedIn()) {
    					$location.path("/login/titledetail/" + $scope.productId + "/" + $("#kioskid_" + currentIndex).val() + "/" + $scope.purchaseOptionId);
    				}
    				else {
    					//$location.path('/titledetail/' + $scope.productId + "/" + $("#kioskid_" + currentIndex).val());
    					$location.path('/kioskCheckout/' + $scope.productId + "/" + $("#kioskid_" + currentIndex).val() + "/" + $scope.purchaseOptionId);
    				}
    			}
    			else {
    				var kiosk_info =
                            {
                            	"KioskID": $("#kioskid_" + currentIndex).val(),
                            	"Displayname": $("#kiosk_name_" + currentIndex).val(),
                            	"Location": $("#location_" + currentIndex).val(),
                            	"Address1": $("#address1_" + currentIndex).val(),
                            	"City": $("#city_" + currentIndex).val(),
                            	"State": $("#state_" + currentIndex).val(),
                            	"ZipCode": $("#zipcode_" + currentIndex).val()
                            };

    				var getkioskID = platformStorage.getItem("kiosk_ids");
    				if (getkioskID == null) {
    					var kiosk_id = $("#kioskid_" + currentIndex).val();

    				}
    				else {
    					var kiosk_id = getkioskID

    					kiosk_id += ',';
    					kiosk_id += $("#kioskid_" + currentIndex).val();
    					var str_split = kiosk_id.split(",");
    					for (var i = 0; i < str_split.length; ++i) {
    						for (var j = i + 1; j < str_split.length; ++j) {
    							if (str_split[i] == str_split[j])
    								str_split.splice(j--, 1);
    						}
    					}
    					if (str_split.length > 3)
    						str_split.shift();

    					var kiosk_id = str_split.toString();

    				}
    				if (helper.isUserLoggedIn()) {

    					platformStorage.setItem("kiosk_ids", kiosk_id);
    					var login_username = platformStorage.getItem("CURRENT_LOGGEDIN_USER");
    					platformStorage.setItem("kioskIds_" + login_username, kiosk_id);
    				}

    				helper.SaveCurrentKiosk(kiosk_info, "CurrentKiosk");

    				//helper.clearLocalStorage("browseFilter");
    				$location.path('/browse/' + $scope.backPathToBrowse + '/' + $("#kioskid_" + currentIndex).val());
    			}
    		}
    	}
    	

    };

    //to add on UI element
    function addFocus(currentIndex, newElementId) {

    	if ($('#status_' + currentIndex).val() == 'Online')
    		helper.SetFocus(newElementId);
    	else
    		helper.SetFocus(newElementId + '_offline');

    	var data = (newElementId).split("_");

    	if ($('#status_' + currentIndex).val() == 'Online') {
    		$('#imgid_' + data[1]).addClass("list-item-img-highlight");
    		//$('#3_' + currentIndex).addClass("button-divHighlight");
    	}
    	else {
    		$('#imgid_' + data[1] + '_offline').addClass("list-item-img-highlight");
    		//$('#3_' + currentIndex + '_offline').addClass("button-divOfflineHighlight");
    	}

    	$('#titleid_' + data[1]).addClass("title-div-highlight");
	}

	//to remove bottom button focus
    function removeBottomButtonFocus() {
    	helper.RemoveFocus('back-button-wrapper');
    	helper.RemoveFocus('menu-button-wrapper');
    	$('#1_0').removeClass("textbox-highlight");
    	var newElementId = [$scope.CurrentLevelIndex] + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
    	var data = (newElementId).split("_");
    	if ($('#status_' + data[1]).val() == 'Online') {
    		$('#imgid_' + data[1]).removeClass("list-item-img-highlight");
    		//$('#3_' + data[1]).removeClass("button-divHighlight");
    	}
    	else {
    		$('#imgid_' + data[1] + '_offline').removeClass("list-item-img-highlight");
    		//$('#3_' + data[1] + '_offline').removeClass("button-divOfflineHighlight");
    	}

    	$('#titleid_' + data[1]).removeClass("title-div-highlight");
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

    //to handle up scrolling using magic remote and up key using normal remote
    function handleArrowUp() {
    	var levelMap = $scope.levelMap;
    	$scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
    	var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;
    	if ($scope.CurrentLevelIndex == level_list) {
    		if ($scope.currentIndex > 0 && $scope.currentIndex != undefined) {


                if ($scope.currentIndex > 0 && $scope.currentIndex % 2 == 0) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;

                    ScrollUp();
                } else if ($scope.currentIndex == $scope.TempCurrentIndex) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;

                }

                $scope.currentIndex = parseInt($scope.currentIndex - 1);


    			levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
    			var newElementId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;

    			if ($('#status_' + $scope.currentIndex).val() == 'Online')
    				helper.SetFocus(newElementId);





    		}

    	}
    }

    //to handle down scrolling using magic remote and down key using normal remote
    function handleArrowDown() {
    	var levelMap = $scope.levelMap;
    	$scope.currentIndex = levelMap[$scope.CurrentLevelIndex].CurrentIndex;
    	var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.currentIndex;
    	if ($scope.CurrentLevelIndex == level_list) {

    		if ($scope.currentIndex < ($scope.kiosks.length + $scope.recentKiosks.length) - 1) {

    			$scope.currentIndex = parseInt($scope.currentIndex + 1);

                if ($scope.currentIndex > 0 && $scope.currentIndex % 2 == 0) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;
                    ScrollDown();
                } else if ($scope.currentIndex == $scope.TempCurrentIndex) {
                    $scope.top_margin_offset = $scope.top_margin_con_offset;

                }

    			levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.currentIndex;
    			var newElementId = [$scope.CurrentLevelIndex] + "_" + $scope.currentIndex;


    			if ($('#status_' + $scope.currentIndex).val() == 'Online')
    				helper.SetFocus(newElementId);

    		}

    	}
    }

    //to manage focus of whole search page
    function manageSearchFocus(level) {
    	if (level == "searchBox") {
    		helper.SetFocus('searchBox');
    		helper.SetFocus('1_0');
    		$('#1_0').addClass("textbox-highlight");
    	} else if (level == 3) {
    		helper.RemoveFocus('searchBox');
    		helper.RemoveFocus('1_0');
    		helper.SetFocus('3_0');
    		$('#1_0').removeClass("textbox-highlight");
    	} else if (level = "remove") {
    		helper.RemoveFocus('searchBox');
    		helper.RemoveFocus('1_0');
    		$('#1_0').removeClass("textbox-highlight");
		}
    }
}