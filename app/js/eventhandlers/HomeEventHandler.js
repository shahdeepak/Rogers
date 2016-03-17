'use strict';
/**
 * HomeEventHandler - This class should handle event like keyEvent etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */

function HomeEventHandler($scope, $location, rbiCommonService, customerService) {
    this.handleKeyDownEvent = handleKeyDownEvent;
	this.onPromotionPosterClicked=onPromotionPosterClicked;
	this.ProcessPosterClick=ProcessPosterClick;
	this.onPromotionPosterHover=onPromotionPosterHover;
    var nextFocusId;

    function handleKeyDownEvent(event) {

        var currentIndex = $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedElementId = $scope.currentLevelIndex + "_" + currentIndex;
        var currentPageNumber = $scope.currentPageNumber;
        var promoLength = $scope.levelMap[$scope.level_PROMO].maxElements;

        //If any error pop up is visible the key handling logic will be added here.
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if ($scope.currentLevelIndex != 0 && event.keyCode != KEY_CODES.CIRCLE) {
            if (handleMainMenu($scope, event.keyCode, $location)) {
                return;
            }
        }
        switch (event.keyCode) {
             
            case KEY_CODES.CIRCLE:
            {
                // show exit confirmation popup
                //helper.debugLog('Exit application?');
                //vod.exit();
                break;
            }
            case KEY_CODES.X:
            {
                ProcessPosterClick(currentFocusedElementId);
                break;
			}
            case KEY_CODES.DPAD_RIGHT:
            case KEY_CODES.R1:
            {
                // Right Arrow
                if ($scope.currentLevelIndex == $scope.level_PROMO)
                // when the highlight is on the promotions
                {
                    if (isDefined($scope.intervalID) && $scope.canScrollInPromotions == true) {
                        window.clearInterval($scope.intervalID);
                    }
                    $scope.canScrollInPromotions = false;
                }
                levelLastId = $scope.levelMap[$scope.currentLevelIndex ].maxElements;
                scrolled = false;
                if ($scope.currentLevelIndex == $scope.level_PROMO) {
                    var startIndex = currentPageNumber * 2 - 1;
                    if (currentIndex > 0 && currentIndex != startIndex) {
                        // i.e. its not left nav bar and not first poster,
                        // then next focus shall be right nav bar as current is
                        // second poster
                        if (currentPageNumber != Math.ceil(promoLength / 2))
                            currentIndex = currentIndex + 1; // levelLastId - 1;
                        $scope.canScroll = true;
                        scrolled = $scope.changePage(false, false);
                    } else if (currentIndex == startIndex) {
                        // i.e. its a first poster of that page
                        currentIndex++;
                        scrolled = true;
                    } else if (currentIndex == 0) {
                        // i.e. its a left nav bar set focus to first poster element
                        currentIndex = startIndex;
                        scrolled = true;
                    }
                } else {
                    // is a menu bar level
                    currentIndex++;
                    scrolled = true;
                }
                if (scrolled) {
                    if (currentIndex <= levelLastId) {
                        //helper.RemoveFocus(currentFocusedElementId);
						$('#'+currentFocusedElementId).removeClass("promo-item-ctn-highlight");
                        nextFocusId = $scope.currentLevelIndex + "_" + currentIndex;
                        //helper.SetFocus(nextFocusId);
                        $('#' + nextFocusId).addClass('promo-item-ctn-highlight');
                        $scope.levelMap[$scope.currentLevelIndex].currentIndex = currentIndex;
                    } 
					else if(currentIndex > levelLastId){
						currentIndex--;
						$('#'+currentFocusedElementId).removeClass("promo-item-ctn-highlight");
						nextFocusId = $scope.currentLevelIndex + "_" + currentIndex;
						$('#' + nextFocusId).addClass('promo-item-ctn-highlight');
                        $scope.levelMap[$scope.currentLevelIndex].currentIndex = currentIndex;
					}
					else {
                        if ($scope.currentLevelIndex == $scope.level_MENU) {
                            helper.RemoveFocus(currentFocusedElementId);
                            $scope.levelMap[$scope.currentLevelIndex].currentIndex = 0;
                            var focusId = $scope.currentLevelIndex + "_"
                                + $scope.levelMap[$scope.currentLevelIndex].currentIndex;
                           helper.SetFocus(focusId);                            
                        }
                    }
                }
                break;
            }
            case KEY_CODES.DPAD_LEFT:
            case KEY_CODES.L1:
            {
                // Left Arrow
                // when the highlight is on the promotions
                if ($scope.currentLevelIndex == 0) {
                    if (isDefined($scope.intervalID) && $scope.canScrollInPromotions == true) {
                        window.clearInterval($scope.intervalID);
                    }
                    $scope.canScrollInPromotions = false;
                }
                var levelLastId = $scope.levelMap[$scope.currentLevelIndex].maxElements;
                var scrolled = false;
                if ($scope.currentLevelIndex == $scope.level_PROMO) {
                    startIndex = currentPageNumber * 2 - 1;
                    if (currentIndex == startIndex) {
                        // i.e. its a first poster of that page, so it will shift to
                        // left nav bar
                        if (startIndex != 1) {
                            // levelLastId - 1;
                            currentIndex = currentIndex - 1;
                            $scope.canScroll = true;
                            scrolled = $scope.changePage(true, false);
                        }
                    } else if (currentIndex == startIndex + 1) {
                        // i.e. its a right nav bar so set focus to second poster
                        // element
                        currentIndex = startIndex;
                        scrolled = true;
                    } else if (currentIndex == levelLastId - 1) {
                        // i.e. its right nav bar , so focus shall move to second
                        // poster
                        currentIndex = startIndex + 1;
                        scrolled = true;
                    }
                } else if (currentIndex > 0) {
                    currentIndex--;
                    scrolled = true;
                }
                if (scrolled) {
                    if (currentIndex >= 0) {
                        //helper.RemoveFocus(currentFocusedElementId);
						$('#'+currentFocusedElementId).removeClass("promo-item-ctn-highlight");
                        nextFocusId = $scope.currentLevelIndex + "_" + currentIndex;
                        //helper.SetFocus(nextFocusId);
                        $('#' + nextFocusId).addClass('promo-item-ctn-highlight');
                        $scope.levelMap[$scope.currentLevelIndex].currentIndex = currentIndex;
                    }
                } else if ($scope.currentLevelIndex == $scope.level_MENU) {
                    helper.RemoveFocus(currentFocusedElementId);
                    currentIndex = $scope.levelMap[$scope.currentLevelIndex].maxElements;
                    $scope.levelMap[$scope.currentLevelIndex].currentIndex = currentIndex;
                    nextFocusId = $scope.currentLevelIndex + "_" + currentIndex;
                    helper.SetFocus(nextFocusId);
                }
                break;
            }
            case KEY_CODES.DPAD_UP:
            {
                // Up Arrow
                if ($scope.levelMap[$scope.currentLevelIndex].canHandleDnKey == false) {
                    if ($scope.currentLevelIndex > 0) {
                        $scope.defaultScrollEnable = false;
                        helper.RemoveFocus($scope.currentLevelIndex + "_" + currentIndex);
						$('#'+$scope.currentLevelIndex + "_" + currentIndex).removeClass("promo-item-ctn-highlight");
                        $scope.currentLevelIndex = 0;
                        mainMenuMap.on = 0;
                        var firstFocusedElement = $scope.levelMap[$scope.currentLevelIndex].firstElement;
                        nextFocusId = $scope.currentLevelIndex + "_" + firstFocusedElement;
                        //helper.SetFocus(nextFocusId);
                        $('#'+nextFocusId).addClass('promo-item-ctn-highlight');
                        $scope.levelMap[$scope.currentLevelIndex].currentIndex = firstFocusedElement;
                    }
                }
                break;
            }
            case KEY_CODES.DPAD_DOWN:
            {
                // Down Arrow
                $scope.clearFocusForAllPromotions();
                if ($scope.levelMap[$scope.currentLevelIndex].canHandleDnKey == false) {
                    var tempLen = $scope.levelMap.length - 1;
                    if ($scope.currentLevelIndex < tempLen) {
                        //helper.RemoveFocus(currentFocusedElementId);
                        $('#'+currentFocusedElementId).removeClass("promo-item-ctn-highlight");
                        mainMenuMap.on = 1;
                        $scope.currentLevelIndex = LEVEL_MENU;
                        var firstFocusElement = mainMenuMap.curr;
                        nextFocusId = LEVEL_MENU + "_" + firstFocusElement;
                        helper.SetFocus(nextFocusId);
                    }
                    else
                        helper.SetFocus(currentFocusedElementId);
                }
                break;
            }
        }
    }


    // Process poster click (either a collection, movie or a free trial
    function ProcessPosterClick(id) {
        var currentFocusedElementId = id;
        if ($scope.currentLevelIndex == $scope.level_PROMO) {

            var pid = angular.element(document.getElementById(currentFocusedElementId)).attr("pid");
            var pTitle = angular.element(document.getElementById(currentFocusedElementId)).attr("pTitle");

            $scope.trackOmniture[0] = OMNITURE_HOME.THUMBNAIL_CLICK;
            $scope.pid = pid;
            $scope.pTitle = pTitle;
            $scope.slideNumber = currentFocusedElementId.split("_")[1];
            $scope.omnitureReady[0] = true;
            console.log("PID: " + pid + " PTITLE" + pTitle);
            if (pTitle.trim().toUpperCase() == "FREE_TRIAL" || pid.toUpperCase() == "FREE_TRIAL") {
                // Free trial
                if (!helper.isUserLoggedIn()) {
                    // redirect user to the login page
                    rbiCommonService.setSharedItem(FREE_TRIAL_ENTRY, true);
                    $location.path("/login");
                }
                else {
                    // Redirect user to the free trial page
                    helper.processFreeTrial($scope, $location, customerService, rbiCommonService, true);
                }
            }
            else if (pid.length < 8) {  //?? Not sure if we should check the length here.
                // since the data is being passed as html attributes
                // If the Products array comes as empty, then the pid and pTitle are empty
                // checking for empty condition and showing an error prompt to the user..
                // If we do not show an error prompt then the user would just hit X and nothing
                // would happen, we need something to show to the user that there is no product Id available..
                // ZOE-32957
                if(pid != '')
                    $location.path('/titleCollection/' + pid);
                else
                    helper.ShowPopupBox('Error_Title_Collection_Not_Available', $scope);
            }
            else {
                // movie poster
                // same as above - ZOE-32957
                if(pid != '')
                    $location.path('/titledetail/' + pid);
                else
                    helper.ShowPopupBox('Error_Title_Not_Available', $scope);
            }
            $scope.$apply();

        }
    }

    //magic remote start

    function onPromotionPosterClicked(event) {
        var currentFocusedElementId = event.currentTarget.id;
        ProcessPosterClick(currentFocusedElementId);
    }


    function onPromotionPosterHover(event) {
        var currentIndex = $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        var currentFocusedElementId = $scope.currentLevelIndex + "_" + currentIndex;
        helper.RemoveFocus(currentFocusedElementId);
        helper.RemoveFocus(LEVEL_MENU + "_" + mainMenuMap.curr);
        var id = event.currentTarget.id;
        $scope.currentLevelIndex = id.split("_")[0];
        $scope.CurrentLevelIndex = id.split("_")[0];
        $scope.levelMap[$scope.CurrentLevelIndex].currentIndex = parseInt(id.split("_")[1]);
        $('#' + currentFocusedElementId).removeClass("promo-item-ctn-highlight");

        $('#' + id).addClass('promo-item-ctn-highlight');

    }

    //magic remote end
}