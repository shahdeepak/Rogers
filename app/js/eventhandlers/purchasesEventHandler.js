'use strict';
/**
 * Purchases EventHandler - This class should handle event like key event etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */
function purchasesEventHandler($scope, $location) {

    this.handleKeyDownEvent = handleKeyDownEvent;
	this.onClickEvent = onClickEvent;
    this.onMouseOverEvent = onMouseOverEvent;
    this.handleMouseWheel = handleMouseWheel;
    var LEVEL_LIST = 2;
    function handleKeyDownEvent(event) {
    	
        var currentIndex = 0;
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if (event.keyCode != KEY_CODES.CIRCLE) {
            if (handleMainMenu($scope, event.keyCode, $location)) {
                return; // global menu handled, so bail on logic below, or alter here.
            }
        }
        if($scope.PreviousLevelIndex!==null){
        	$scope.CurrentLevelIndex = $scope.PreviousLevelIndex;
        	$scope.PreviousLevelIndex=null;
        }
       
        switch (event.keyCode) {
            case KEY_CODES.SELECT:
                if ($scope.helpOverLay == "hidden") {  //toggle main menu
                    if ($scope.showMainMenu == false) {
                        showMainMenu();
                        $scope.showMainMenu = true;
                    }
                    else {
                        hideMainMenu();
                        $scope.showMainMenu = false;
                    }
                }
                break;

            case KEY_CODES.DPAD_LEFT:
                if ($scope.helpOverLay == "hidden") {
                    if ($scope.CurrentLevelIndex == LEVEL_LIST) {
                        if ($scope.focusIndex < $scope.maxelements && $scope.focusIndex > 0) {
                            if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                                $scope.top_margin_offset = $scope.top_margin_const_offset;
                                ScrollUp();
                            }
                            $scope.focusIndex = parseInt( $scope.focusIndex - 1);
                            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex;
                        }
                    } else {
                        if ($scope.menuCurrentIndex > 0) {
                        	$scope.menuCurrentIndex = $scope.menuCurrentIndex - 1;
                        }
                        $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.menuCurrentIndex;
                    }
                }
                break;
          
            case KEY_CODES.DPAD_RIGHT:
                if ($scope.helpOverLay == "hidden") {
                    if ($scope.CurrentLevelIndex == LEVEL_LIST) {

                        if ($scope.focusIndex < $scope.maxelements - 1) {
                        	$scope.focusIndex = parseInt($scope.focusIndex + 1);
                            if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                                $scope.top_margin_offset = $scope.top_margin_const_offset;
                                ScrollDown();
                            } else if ($scope.focusIndex == $scope.TempCurrentIndex) {
                                $scope.top_margin_offset = $scope.top_margin_const_offset;
                            }
                            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex;
                        }
                    }
                    else {
                        if ($scope.menuCurrentIndex < 3) {
                        	$scope.menuCurrentIndex = $scope.menuCurrentIndex + 1;
                        }
                        $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.menuCurrentIndex;
                    }
                }
                break;
            
            case KEY_CODES.DPAD_UP:
                if ($scope.helpOverLay == "hidden") {
                	handleArrowUp();
                }
                break;
            
           case KEY_CODES.DPAD_DOWN:
				if($scope.purchases.length > 0 && $scope.helpOverLay == "hidden"){
						handleArrowDown();
				}
           		break;

           case KEY_CODES.X:
           		if ($scope.helpOverLay == "hidden") {
           			if ($scope.CurrentLevelIndex == 1) {

                        // Omniture start
                        $scope.omnitureOnTabClick($scope.menuCurrentIndex);
                        // Omniture end

           				switch ($scope.menuCurrentIndex) {
           					case 0:
           						popMyredboxBackEntry();
           						$location.path('/myredbox/dashboard');
           						break;
           					case 1:
           						popMyredboxBackEntry();
           						$location.path('/myredbox/watchhistory');
           						break;
           					case 2:
           						popMyredboxBackEntry();
           						$location.path('/myredbox/bookmarks');
           						break;
           				}
           			}
           			else {
           				//addToBackPaths($location.path());
           				var pid = $("#productId_" + $scope.focusIndex).val();

                        // Omniture start
                        $scope.omnitureOnItemClick($scope.focusIndex);
                        // Omniture end

           				if (pid != undefined && pid != null) {
           					popMyredboxBackEntry();
                            addToBackPaths($location.path());
           					$location.path("/titledetail/" + pid);
           				}
           			}
           		}

           		break;

            case KEY_CODES.SQUARE:
           		onClickEvent('help', 'help');
           		break;

            case KEY_CODES.CIRCLE:
                if($scope.helpOverLay == "visible"){
                    $scope.helpOverLay = "hidden";
                }
                if ($scope.menuCurrentIndex == 3) {
                        goToPreviousPath($scope, event.keyCode, $location);
                }
                break;
        }

    }

    function ScrollUp() {
        $scope.title_list_margin = $scope.title_list_margin + $scope.top_margin_offset;
    }

    //function to handle scrolling of more like this section
    function ScrollDown() {
        $scope.title_list_margin = $scope.title_list_margin - $scope.top_margin_offset;
    }
    function onMouseOverEvent(level, index) {
		 if(($scope.CurrentLevelIndex == 1 ||  $scope.CurrentLevelIndex == LEVEL_LIST)){
	 		$scope.PreviousLevelIndex = $scope.CurrentLevelIndex;
	 	}
		 $scope.CurrentLevelIndex = level;
       	if (level == 1) {
       		$scope.PreviousLevelIndex=null;
            $scope.menuCurrentIndex=index;
       		$scope.levelMap[1].CurrentIndex = index;
       	}  else if(level == LEVEL_LIST) {
       		$scope.PreviousLevelIndex=null;
       		$scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = parseInt(index);
       		$scope.focusIndex = index;
       	}
       };
       function onClickEvent(level, index) {
       	if (level == 1) {
            // Omniture start
            $scope.omnitureOnTabClick(index);
            // Omniture end
       		switch (index) {
       			case 0:
       				$location.path('/myredbox/dashboard');
       				break;

       			case 1:
       				$location.path('/myredbox/watchhistory');
       				break;

       			case 2:
       				$location.path('/myredbox/bookmarks');
       				break;

       		}

       	} else if (level == 'help' && $scope.helpOverLay == "hidden") {
       			$scope.helpOverLay = 'visible';
       		platformStorage.setItem("is_HelpOverlayOpen", false);
       	} else if (level == 'dismiss' || $scope.helpOverLay == "visible") {
       			$scope.helpOverLay = 'hidden';
       	} else {
       		$scope.CurrentLevelIndex = level;
            // Omniture start
            $scope.omnitureOnItemClick(index);
            // Omniture end
			addToBackPaths($location.path());
       		$location.path("/titledetail/" + $("#productId_" + index).val());

       	}
       };

       //to handle remote remote mouse wheel 
       function handleMouseWheel(e) {
       	if ($scope.helpOverLay == "hidden") {
       		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
       		if (delta == 1) {
       			handleArrowUp();
       		} else {
       			handleArrowDown();
       		}
       		$scope.$apply();
       	}
       }

	//to handle up key and magic remote up scrolling
       function handleArrowUp() {

       	if ($scope.CurrentLevelIndex == LEVEL_LIST) {
       		if ($scope.focusIndex > 5 && $scope.focusIndex != undefined) {

                if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                    $scope.top_margin_offset = $scope.top_margin_const_offset;
                    ScrollUp();
                } else if ($scope.focusIndex % 6 != 0) {
                    $scope.top_margin_offset = $scope.top_margin_const_offset;
                    ScrollUp();
                }
                $scope.focusIndex = parseInt($scope.focusIndex - 6);
                $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex;
       		}
       		else {
       			$scope.levelMap[1].CurrentIndex = 3;
       			$scope.menuCurrentIndex =3;
       			$scope.CurrentLevelIndex = 1;
       		}
       	}
       }

       //to handle down key and magic remote down scrolling
       function handleArrowDown() {

       	if ($scope.CurrentLevelIndex == LEVEL_LIST) {
       		if ($scope.focusIndex >= 0 && $scope.focusIndex != undefined) {

       			if ($scope.focusIndex < $scope.maxelements - 6) {
       				$scope.focusIndex = parseInt($scope.focusIndex + 6);
                    if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                        $scope.top_margin_offset = $scope.top_margin_const_offset;
                        ScrollDown();
                    } else if ($scope.focusIndex % 6 != 0) {
                        $scope.top_margin_offset = $scope.top_margin_const_offset;
                        ScrollDown();
                    }
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex;
       			}
       		}
       	} else {
       		$scope.CurrentLevelIndex++;
       	}
       }
}