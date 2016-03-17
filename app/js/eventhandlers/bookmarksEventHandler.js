'use strict';
/**
 * HomeEventHandler - This class should handle event like key event etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */
function bookmarksEventHandler($scope, $location) {

    this.handleKeyDownEvent = handleKeyDownEvent;
    this.onMouseOverEvent = onMouseOverEvent;
    this.onClickEvent = onClickEvent;
    this.handleMouseWheel = handleMouseWheel;
    var LEVEL_LIST = 2;

    function handleKeyDownEvent(event) {
        
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        if (event.keyCode != KEY_CODES.CIRCLE ) {
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
            {
                if ($scope.helpOverLay != 'visible') {  //toggle main menu
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
            }

            case KEY_CODES.DPAD_LEFT:
            {
                if ($scope.helpOverLay != 'visible') {
                    if ($scope.CurrentLevelIndex == LEVEL_LIST) {

                        if ($scope.focusIndex < $scope.maxelements && $scope.focusIndex > 0) {
                            // ZOE-31518 - we need to change the row as well on LEFT, this will
                            // maintain the navigation flow with UP/DOWN
                            $scope.row = $scope.row - 1;
                           if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                                $scope.top_margin_offset = $scope.top_margin_const_offset;
                                ScrollUp();
                            }
                           $scope.focusIndex = parseInt($scope.focusIndex - 1);
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
            }
            case KEY_CODES.DPAD_RIGHT:
                if ($scope.helpOverLay != 'visible') {
                    if ($scope.CurrentLevelIndex == LEVEL_LIST) {

                        if ($scope.focusIndex < $scope.maxelements - 1) {
                            // ZOE-31518 - we need to change the row as well on RIGHT, this will
                            // maintain the navigation flow with UP/DOWN
                            $scope.row = $scope.row + 1;
                            $scope.focusIndex = parseInt($scope.focusIndex + 1);
                            if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                                $scope.top_margin_offset = $scope.top_margin_const_offset;
                                ScrollDown();
                            } else if ($scope.focusIndex == $scope.TempCurrentIndex) {
                                $scope.top_margin_offset = $scope.top_margin_const_offset;
                            }
                            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex;
                            $scope.focusIndex = $scope.focusIndex;    // set the current focused element index
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
                if ($scope.helpOverLay != 'visible') {
                    handleArrowUp();
                }
                break;
            
            case KEY_CODES.DPAD_DOWN:
				if($scope.bookmarks.length > 0 && $scope.helpOverLay != 'visible'){
						handleArrowDown();
				}
                break;
            

            case KEY_CODES.X:
                if ($scope.helpOverLay != 'visible') {
                    if ($scope.CurrentLevelIndex == 1) {
                        onClickEvent(1, $scope.menuCurrentIndex);
                    }
                    else {
                        //addToBackPaths($location.path());
                        // Omniture start
                        $scope.omnitureOnItemClick($scope.focusIndex);
                        // Omniture end

                        var pid = $("#productId_" + $scope.focusIndex).val();
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
                if ($scope.helpOverLay == "visible") {
                    $scope.helpOverLay = "hidden";
                    break;
                }
                switch ($scope.menuCurrentIndex) {
                    case 2:
                        goToPreviousPath($scope, event.keyCode, $location);
                        // $location.path($scope.previousPath);
                        break;
                }
                break;

        }

    }

    function ScrollUp() {
        if ($scope.title_list_margin < 0) {
            $scope.title_list_margin = $scope.title_list_margin + $scope.top_margin_offset;
        }
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
            $scope.levelMap[1].CurrentIndex=index;
        } else if (level == 2){
        	$scope.PreviousLevelIndex=null;
        	$scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = index; 
            $scope.focusIndex = index;    // set the current focused element index
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
                case 3:
                    $location.path('/myredbox/purchases');
                    break;
            }
          } else if (level == 'help' && $scope.helpOverLay == "hidden") {
                $scope.helpOverLay = 'visible';
              platformStorage.setItem("is_HelpOverLayOpen", false);
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

    //to handle magic remote up scrolling and up key of remote
    function handleArrowUp() {
        if ($scope.CurrentLevelIndex == LEVEL_LIST) {
            if ($scope.focusIndex > 5 && $scope.focusIndex != undefined) {
                $scope.row = $scope.row - 1;
               if ($scope.focusIndex > 0 && $scope.focusIndex % 6 == 0) {
                    $scope.top_margin_offset = $scope.top_margin_const_offset;
                    ScrollUp();
                }
                else if ($scope.focusIndex % 6 != 0) {
                    $scope.top_margin_offset = $scope.top_margin_const_offset;
                    ScrollUp();
                }
               $scope.focusIndex = parseInt($scope.focusIndex - 6);
               $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex;
            }
            else {
            	$scope.levelMap[1].CurrentIndex = 2;
                $scope.row--;             
                $scope.CurrentLevelIndex = 1;
                $scope.focusIndex = -1;
            }

        }
    }

    //to handle magic remote Down scrolling and down key of remote
    function handleArrowDown() {
        
        if ($scope.CurrentLevelIndex == LEVEL_LIST) {
            if ($scope.focusIndex >= 0 && $scope.focusIndex != undefined) {
                if ($scope.focusIndex < $scope.maxelements - 6) {
                    $scope.row = $scope.row + 1;                 
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
                else {
                    if ($scope.row < $scope.totRows) {
                        $scope.row++;
                        $scope.focusIndex = $scope.maxelements - 1;
                        $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = $scope.focusIndex; ScrollDown();
                    }
                }
            }
        }
        else {
           $scope.CurrentLevelIndex++;           
           $scope.focusIndex = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            $scope.row = 1;
        }
    }

}