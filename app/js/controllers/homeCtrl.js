'use strict';
/**
 * Home Controller - This class should have the business logic and interacts with the view and
 * the event handler of the home to get the required promotion and user interaction
 */

rbi.controller('homeCtrl',
    function ($scope, $location, $routeParams, $timeout, promotionService, loginService, playerService, rbiCommonService, customerService) {

        //Omniture start
        Omniture.pageName = "";
        $scope.trackOmniture = [];
        $scope.omnitureReady = [];
        $scope.trackOmniture[0] = OMNITURE_HOME.PAGE_LOAD;
        $scope.omnitureReady[0] = false;
        Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|home";
        // Omniture end

        $scope.level_PROMO = 0;
        $scope.level_MENU = 100;
        $scope.levelMap = [];
        var isScrolling = false;
        $scope.canScroll = true;
        $scope.currentPageNumber = 0;
    	var promoLength = 0;
        $scope.currentLevelIndex = 0;
        $scope.defaultScrollEnable = true;
        var level_PROMO = $scope.level_PROMO;
        addToBackPaths($location.path());
        $scope.intervalID = 0;
        $scope.canScrollInPromotions = true;
        // handle key events
        $scope.eventHandler = new HomeEventHandler($scope, $location, rbiCommonService, customerService);
        //clear the filters for the browse page on tab clicks
        helper.clearLocalStorage("browseFilter");
        helper.clearLocalStorage("browseFilterForKiosk");
        sharedScopeWithMenu($scope, $location);
        $scope.levelMap[$scope.level_PROMO] = {
            // default current index for this level
            currentIndex: 1,
            // max elements at this level
            maxElements: 4,
            // can down / up key handled on this level , if
            // false they will go to next levels
            canHandleDnKey: false,
            canHandleUpKey: false,
            //this is the first element for this level
            firstElement: 1
        };
        $scope.levelMap[$scope.level_MENU] = {
            currentIndex: 0,
            maxElements: 5,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        showMainMenu('home');

        // Get Promotions
        getPromotions();

        // ZOE-30513: Disabled speed test - speedTestEnabled needs to be false
        // Perform speed test when the app is started during the first visit to the home page
        if (RBI.PlatformConfig.speedTestEnabled && !rbiCommonService.isSharedItemExist(SPEED_TEST_RESULT)) {
            playerService.SpeedTest(function (speedTestResult) {
                if (speedTestResult > 0) {
                    rbiCommonService.setSharedItem(SPEED_TEST_RESULT, speedTestResult);
                    helper.debugLog("Speed test result: " + speedTestResult);
                }
                else {
                    helper.debugLog("Speed test timed out");
                }
            });
        }


        function getPromotions() {
            var params = "";
            if (!helper.isUserLoggedIn()){
                params = "FreeTrail,Homepage-Trial,Homepage-Subscription,Homepage-EST,Homepage-DVD";
            }
            else if (helper.isUserLoggedIn() && !helper.isFreeTrialUsed()){
                params = "FreeTrail,Homepage-Trial,Homepage-Subscription,Homepage-EST,Homepage-DVD";
            }
            else {
                params = "Homepage-Subscription,Homepage-EST,Homepage-DVD";
            }

            try {
                $scope.promotions=[];
                //angular.element(document.getElementById("spinner")).css("visibility", "visible");
                promotionService.GetPromotions(RBI.PlatformConfig.promotionsDeviceType, params,
                    function (data) {
                        //success
                        //angular.element(document.getElementById("spinner")).css("visibility", "hidden");
                        $scope.promotions = data.promotions;
                        promoLength = data.promotions.length;
                        $scope.levelMap[$scope.level_PROMO].maxElements = promoLength;
                        $scope.omnitureReady[0] = true;
                        if (promoLength == 0) {
                            setNoDataView(true);
                        }
                        else {
                            setNoDataView(false);
							CheckForFreeTrial(0);
                            setPosterData(data);
                            if ($scope.levelMap[$scope.level_PROMO].maxElements > 0) {
                                // enable right navigation arrow if length of promos is greater than 2
                                if (promoLength > 2) {
                                    // Auto scroll every 5 seconds
                                    $scope.intervalID = setInterval(function () {
                                        $scope.changePage(false, true);
                                    }, HOME_AUTO_SCROLL_TIME);

                                }
                                //added to remove focus on any menu
                                helper.RemoveFocus("100_0");
                                helper.RemoveFocus("100_1");
                                helper.RemoveFocus("100_2");
                                helper.RemoveFocus("100_3");
                                helper.RemoveFocus("100_4");
                                helper.RemoveFocus("100_5");
                                $scope.currentLevelIndex = level_PROMO;
                                setCanScroll();
                                $('#0_1').addClass('promo-item-ctn-highlight');
                                //helper.SetFocus('0_1');
                            }
                        }
                    },
                    function (data) {
                        //angular.element(document.getElementById("spinner")).css("visibility", "hidden");
                        // failure
                        $scope.omnitureReady[0] = true;
                        helper.showErrorMessage(data, $scope);
                    });
            }
            catch (exceptionObject) {
                helper.showErrorMessage(exceptionObject, $scope);
            }
        }

        function setPosterData(promoData) {
            promoData = promoData.promotions;
            promoLength = promoData.length;

            var pageDiv;
            var pageItemCounter = 0;
            var counter = 0;
            $scope.levelMap[level_PROMO].maxElements = 0;
            if (promoLength != 0) {
                for (var index = 0; index < promoLength; index++) {
                        var promotionObject = promoData[index].value;
                        var promoUrl = promotionObject.Image.SmallImageUrl;
                        var promoId = "";
                        var pTitle = "";
                        // Adding DIT Promotion Type check also, since the string returned from
                        // getPromotions API STG and DIT is different, this should ideally be fixed from OL - ZOE-32957
                        if (promotionObject.PromotionType.toLowerCase() == "homepage-trial") {
                            promoId = "FREE_TRIAL";
                        } else {
                            if (promotionObject.Products.length > 1) {
                                // this is a collection
                                promoId = promotionObject.PromotionId;
                                pTitle = promotionObject.PromotionTitle;

                            } else {
                                // this is an individual title
                                // checking for undefined Products from the API response...Promotions are not
                                // displayed since the below results in an error.. OL should not send us blank data
                                // In DIT we get an empty products array, therefore checking for undefined...ZOE-32957
                                if(promotionObject.Products.length > 0)
                                {
                                  promoId = promotionObject.Products[0].ProductID;
                                  pTitle = promotionObject.PromotionTitle;
                                }
                            }
                        }
                        if (pageItemCounter == 0) {

                            if (pageDiv) {
                                var posterOuterDiv = document
                                    .getElementById("poster-outer-div");

                                if (posterOuterDiv) {
                                    if (pageDiv != null)
                                        posterOuterDiv.appendChild(pageDiv);
                                }
                            }
                            // Create new page if itemCounter is 0
                            pageDiv = document.createElement("div");
                            pageDiv.className = "poster-page";

                            // Also create page indicator
                            var pageControl = document.getElementById("page-notations");
                            var pageImage = document.createElement("div");
                            pageImage.className = "page-img";
                            if (pageImage != null)
                                pageControl.appendChild(pageImage);
                        }
                        // create new one append to page
                        var promoElement = document.createElement("div");
                        var id = level_PROMO + "_" + parseInt(counter + 1);
                        promoElement.id = id;
                        promoElement.setAttribute('pid', promoId);
                        promoElement.setAttribute('pTitle', pTitle);
                        promoElement.setAttribute('outerlinewidth', "5px");
                        promoElement.className = "poster";
                        var image = document.createElement("img");
                        image.setAttribute("src", promoUrl);
                        image.className = "poster-image";
                        if (image != null)
                            promoElement.appendChild(image);
                        if (promoElement != null)
                            pageDiv.appendChild(promoElement);
                        pageItemCounter++;
                        $(promoElement).click($scope.eventHandler.onPromotionPosterClicked);
    					$(promoElement).mouseover($scope.eventHandler.onPromotionPosterHover);
                        document.getElementById("poster-holder").style.display = "block";
                        // per page we have only 2 promotions .. reset counter here
                        if (pageItemCounter == 2)
                            pageItemCounter = 0;
                        // setting level promo max element count as per dynamic data
                        $scope.levelMap[level_PROMO].maxElements = parseInt($scope.levelMap[level_PROMO].maxElements) + 1;
                        counter++;
                }
                if (pageDiv) {
                    posterOuterDiv = document.getElementById("poster-outer-div");
                    if (posterOuterDiv) {
                        if (pageDiv != null)
                            posterOuterDiv.appendChild(pageDiv);
                    }
                }
                promoLength = $scope.levelMap[level_PROMO].maxElements;
                if (promoLength > 0) {
                    // Set current page number to first page
                    $scope.currentPageNumber = 1;
                    // Set style for current page in pagination
                    var pageGrid = document.getElementById("page-notations");
                    pageGrid.children[0].className = "page-img-selected";
                    var div = document.getElementById("poster-outer-div");
                    div.style.marginLeft = '0px';
                    // set right nav bar id according to data count
                    var rightNavBarID = level_PROMO + "_"
                        + parseInt($scope.levelMap[level_PROMO].maxElements + 1);
                    $('#right-nav-bar').attr("id", rightNavBarID);
                }
                else {
                    setNoDataView(true);
                }
            }

        }
		
		//to check if promotiion are on first position or not
    	function CheckForFreeTrial(trialPosition) {
    		if (promoLength != 0) {
    			var index = $scope.promotions.map(function (element) { return element.value.PromotionType.toLowerCase(); }).indexOf("homepage-trial");
    			if (index >= 0 && index != trialPosition) {
    				var extract = $scope.promotions.splice(index, 1);
    				$scope.promotions.splice(trialPosition, 0, extract[0]);
    			}
    		}
    	}
        function setNoDataView(show) {
            if (show) {
                $("#nodata").removeClass("hide-div-box");
                $("#nodata").addClass("show-div-box");
                $("#poster-holder").addClass("hide-div-box");
                $("#0_0").addClass("hide-div-box");
                $('.right-nav-arrow').addClass("hide-div-box");
                $("#poster-holder").removeClass("show-div-box");
                $("#0_0").removeClass("show-div-box");
                $('.right-nav-arrow').removeClass("show-div-box");
            } else {
                $("#nodata").addClass("hide-div-box");
                $("#poster-holder").addClass("show-div-box");
                $("#0_0").addClass("show-div-box");
                $('.right-nav-arrow').addClass("show-div-box");
                $("#poster-holder").removeClass("hide-div-box");
                $("#0_0").removeClass("hide-div-box");
                $('.right-nav-arrow').removeClass("hide-div-box");
            }
        }

        //timeout is in milliseconds; defaults to 30000
        $.idleTimer(HOME_IDLE_TIME_TO_START_CALL);
        $(document).bind("idle.idleTimer", function () {
            setCanScroll();
        });

        $(document).bind("active.idleTimer", function () {
            // function you want to fire when the user becomes active again
        	enableScroll();
        });

        function enableScroll() {
            setCanScroll();
            isScrolling = false;
        };
        function setCanScroll() {
            if ($.data(document, 'idleTimer') == 'active') {
                $scope.canScroll = false;
            }
            else {
                if ($.data(document, 'idleTimer') == 'idle' && $scope.canScrollInPromotions == true)
                    $scope.canScroll = true;
            }
            if ($scope.currentLevelIndex == level_PROMO && $scope.canScrollInPromotions == true && isScrolling == true) {
                //helper.SetFocus($scope.currentLevelIndex + '_' + $scope.levelMap[$scope.currentLevelIndex].firstElement);
                if($scope.levelMap[$scope.currentLevelIndex].firstElement > 1)
                    $('#' + $scope.currentLevelIndex + '_' + (($scope.levelMap[$scope.currentLevelIndex].firstElement)-2)).removeClass('promo-item-ctn-highlight');

                $('#' + $scope.currentLevelIndex + '_' + $scope.levelMap[$scope.currentLevelIndex].firstElement).addClass('promo-item-ctn-highlight');
            }
            if ($scope.currentLevelIndex == LEVEL_MENU) {
                $scope.clearFocusForAllPromotions();
            }
        };
        $scope.clearFocusForAllPromotions = function () {
            for (var i = 0; i < $scope.levelMap[$scope.currentLevelIndex].maxElements; i++) {
                //helper.RemoveFocus($scope.level_PROMO + "_" + i)
				$('#'+$scope.level_PROMO + "_" + i).removeClass("promo-item-ctn-highlight");
            }
        };
        $scope.changePage = function (isLeft, isAutoScroll) {
            if ($scope.canScroll || !isAutoScroll) {
                if (!isScrolling) {

                    var margin;
                    isScrolling = true;
                    $scope.canScroll = false;
                    //noinspection JSUnusedLocalSymbols
                    var posterOuterDiv = document.getElementById('poster-outer-div');
                    var pageGrid = document.getElementById("page-notations");
                    pageGrid.children[$scope.currentPageNumber - 1].className = "page-img";
                    var div = document.getElementById("poster-outer-div");
                    if (isLeft && $scope.currentPageNumber > 1) {

                        var replace = /px/gi;
                        //$(".right-nav-arrow").css("visibility", "visible");
                        $(".right-nav-arrow").show();
						if($scope.currentPageNumber == 2){
						   margin = 0;
						  }
						  else{
						   margin = parseInt(div.style.marginLeft.replace(replace, '')) + 1130;
						  }
                        $scope.currentPageNumber--;
                        if ($scope.currentPageNumber == 1)
                            //$(".left-nav-arrow").css("visibility", "hidden");
                            $(".left-nav-arrow").hide();

                    } else if (!isLeft && $scope.currentPageNumber < Math.ceil(promoLength / 2)) {
                        //$(".left-nav-arrow").css("visibility", "visible");
                        $(".left-nav-arrow").show();
                        replace = /px/gi;
                        margin = parseInt(div.style.marginLeft.replace(replace, '')) - 1130;
                        $scope.currentPageNumber++;
                        if ($scope.currentPageNumber == Math.ceil(promoLength / 2)) {
                            //$(".right-nav-arrow").css("visibility", "hidden");
                            $(".right-nav-arrow").hide();
                        } else if ($scope.currentPageNumber == 1) {
                            //$(".left-nav-arrow").css("visibility", "hidden");
                            $(".left-nav-arrow").hide();
                        }
                    } else if (!isLeft && $scope.currentPageNumber >= Math.ceil(promoLength / 2)
                        && isAutoScroll) {
                        // making auto scroll circular
                        //$(".right-nav-arrow").css("visibility", "visible");
                        $(".right-nav-arrow").show();
                        //$(".left-nav-arrow").css("visibility", "hidden");
                        $(".left-nav-arrow").hide();
                        margin = 0;
                        $scope.currentPageNumber = 1;
                    }

                    $('#poster-outer-div')
                        .animate(
                        {
                            marginLeft: margin
                        },
                        {
                            duration: HOME_AUTO_SCROLL_TIME,
                            easing: 'linear',
                            complete: function () {
                                var pageGrid = document
                                    .getElementById("page-notations");
                                pageGrid.children[$scope.currentPageNumber - 1].className = "page-img-selected";
                                if (!isAutoScroll)
                                    enableScroll();
                            }
                        });

                    $scope.levelMap[$scope.level_PROMO].firstElement = $scope.currentPageNumber * 2 - 1;
                    $scope.levelMap[$scope.level_PROMO].currentIndex = $scope.levelMap[$scope.level_PROMO].firstElement;

                    if (isAutoScroll) {
                        setTimeout(enableScroll, HOME_AUTO_SCROLL_TIME_DELAY);
                        if ($scope.currentLevelIndex == $scope.level_PROMO)
                            setCanScroll();
                    }

                    return true;
                } else return false;
            }

            else return false;
        };

        $scope.$on('$locationChangeStart', function () {
            //clear the window timer before leaving the page
            if (isDefined($scope.intervalID)) {
                window.clearInterval($scope.intervalID);
                $.idleTimer('destroy');
            }
        });
        var unbindOmniture=$scope.$watch("omnitureReady", function () {
            if ($scope.omnitureReady.length > 0 && $scope.omnitureReady.indexOf(false) <= -1) {
                Omniture.Clear();
                if (internetConnected) {
                    if ($scope.trackOmniture[0] == OMNITURE_HOME.PAGE_LOAD) {
                        if (!isDefined(rbiCommonService.getSharedItem(APP_LAUNCHED)))  // check for the entry page
                        {
                            // These variables are only fired on app launch
                            Omniture.Variables.eVar9 = RBI.PlatformConfig.OmnitureTargetDevice + "";

                            // Omniture.Variables.eVar12 this is not in the top 40 variables
                            if (!helper.isUserLoggedIn()) {
                                Omniture.Variables.eVar39 = "non-recognized";
                                Omniture.Variables.eVar10 = Omniture.getNewRepeat(365);
                            }
                            else {
                                // ZOE-316717: logged in user is always a repeat customer
                                Omniture.Variables.eVar10 = "repeat";
                                if (customerService.isInFreeTrial()) {
                                    Omniture.Variables.eVar39 = "trial";
                                }
                                else if (helper.isSubscribedCustomer()) {
                                    Omniture.Variables.eVar39 = "subscriber";
                                }
                                else {
                                    Omniture.Variables.eVar39 = "non-subscriber";
                                }
                            }
                        }

                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|home";
                        Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|home";
                        Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|home";

                        if (!isDefined(rbiCommonService.getSharedItem(APP_LAUNCHED))) {
                            rbiCommonService.setSharedItem(APP_LAUNCHED, true);
                        }
                        else {
                            Omniture.Variables.prop23 = Omniture.previousPageName;
                        }


                        Omniture.Variables.eVar54 = "+1";
                        //call the Omniture function
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                        $scope.omnitureReady[0] = false;
                    }
                    else if ($scope.trackOmniture[0] == OMNITURE_HOME.THUMBNAIL_CLICK) {
                        var linkName = Omniture.pageName + '|' + $scope.slideNumber + "|" + $scope.pTitle;
                        Omniture.Variables.eVar3 = Omniture.pageName + "|" + $scope.pTitle + "|hero image";
                        Omniture.Variables.prop12 = Omniture.pageName + "|hero image";
                        Omniture.Variables.products = $scope.pid;
                        Omniture.Variables.eVar51 = linkName;
                        //call the Omniture function
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                        $scope.omnitureReady[0] = false;
                    }
                }
            }
        }, true);

        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
        // LG - ZOE-34244
        if (RBI.PlatformConfig.deviceType == "LG"){
            if(lgBackHome){
                lgBackHome = false;
                $location.path('/login');
            }
        }
    });
