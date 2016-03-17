/**
 * Kiosk controller
 * Populates list of kiosks and calls kiosk browse
 */
'use strict';

rbi.controller('kioskCtrl', function ($scope, $location, $routeParams, kioskService, customerService, rbiCommonService) {
    //Omniture
    Omniture.pageName = "";
    //Omniture
    var level_textbox = 1;
    var level_list = 3;
    $scope.pageLoaded = false;
     addToBackPaths($location.path());

    // Omniture start
    $scope.omnitureReady = [false];
    $scope.isInitialLoad = true;
    $scope.isProductSearch = false;
    $scope.currentIndex = 0;



    $scope.omnitureCollectOnKioskSearch = function(searchString) {
        Omniture.Clear();
        if (internetConnected) {
            if (searchString == '') {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find box|no suggestions";
            }
            else {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find box|" + searchString;
            }
            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk";
            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find box";
            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find box";
            Omniture.Variables.eVar54 = "+1";
            if (Omniture.previousPageName != "") {
                Omniture.Variables.prop23 = Omniture.previousPageName;
            }
            //TODO: Not part of Top 40 vars
//        if (searchString != '') {
//            Omniture.Variables.events.push("event14");
//            Omniture.Variables.prop5 = searchString;
//        }

            helper.debugLog("Kiosk search - omnitureOnLoad:");
            helper.debugLog("pageName: " + Omniture.pageName);
            helper.debugLog("prop1: " + Omniture.Variables.prop1);
            helper.debugLog("prop2: " + Omniture.Variables.prop2);
            helper.debugLog("prop3: " + Omniture.Variables.prop3);
            helper.debugLog("eVar54: " + Omniture.Variables.eVar54);
            helper.debugLog("prop23: " + Omniture.Variables.prop23);
            Omniture.InvokeOmniture(Omniture.InvokeType.load);
        }
    };

    $scope.omnitureCollectOnProductSearch = function(searchString) {
        Omniture.Clear();
        if (internetConnected) {
            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find title|" + $scope.image_title;
            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk";
            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find title";
            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find title|" + $scope.productGenre;
            //Omniture.Variables.prop17 = $scope.image_title;
            //Omniture.Variables.prop18 = $scope.numberOfResults;
            //Omniture.Variables.prop19 = searchString;
            Omniture.Variables.eVar54 = "+1";
            if (Omniture.previousPageName != "") {
                Omniture.Variables.prop23 = Omniture.previousPageName;
            }
//        if (searchString != '') {
//            Omniture.Variables.events.push("event14");       // Not part of Top 40 vars
//            Omniture.Variables.prop5 = searchString;         // Not part of Top 40 vars
//        }
            helper.debugLog("Kiosk search from product details - omnitureOnLoad:");
            helper.debugLog("pageName: " + Omniture.pageName);
            helper.debugLog("prop1: " + Omniture.Variables.prop1);
            helper.debugLog("prop2: " + Omniture.Variables.prop2);
            helper.debugLog("prop3: " + Omniture.Variables.prop3);
            helper.debugLog("eVar54: " + Omniture.Variables.eVar54);
            helper.debugLog("prop23: " + Omniture.Variables.prop23);
            Omniture.InvokeOmniture(Omniture.InvokeType.load);
        }
    };

    $scope.omnitureTracking = function(){
        if(RBI.PlatformConfig.OmnitureEnabled == true){
            if($scope.omnitureReady.indexOf(false) == -1){
                if ($scope.isProductSearch) {
                    $scope.omnitureCollectOnProductSearch($scope.searchString);
                }
                else {
                    $scope.omnitureCollectOnKioskSearch($scope.searchString);
                }

                $scope.omnitureReady = [false];   // reset for a new search
            }
        }
    };
    // Omniture end
    $scope.backPathToBrowse = "Movie";
    if(isDefined(sessionStorage.getItem("_backPathToLocation")))
    {
      $scope.backPathToBrowse =  sessionStorage.getItem("_backPathToLocation");
      sessionStorage.removeItem("_backPathToLocation");
    }
    $scope.user_address = '';
    $scope.flag = 0;
    $scope.statusButton = '';
    $scope.searchString = '';
    $scope.dataLoaded = false;
    $scope.TempCurrentIndex = 3;

    $scope.kiosk_list_margin = 0;

    $scope.top_margin_offset = 110 * 3;

    $scope.top_margin_con_offset = 260;

    $scope.first_page_margin_offset = 30;
    $scope.recentKiosks = [];

   // var addr = ''; // not needed - unused variable
    var address = sessionStorage.getItem("addr");

    // checks for undefined, null and 'null'
    if (!isDefined(address)) {
        address = '';
    }

    $scope.addr = address;
    $scope.searchString = address;
    if (helper.isUserLoggedIn()) {
        $scope.flag = 1;
    }

    /*
     * Updated requirement: DO NOT use billing ZIP code in kiosk search
     * ZOE-35062: Common HTML - Locations page uses Billing zip code
     * 
    if ((address == '')) {

        // ZOE-28457:
        // Use "Billing Zip Code" associated with the users credit card.
        // First priority: Card associated with the users subscription as the first priority
        // Second priority: Card marked as primary for rentals and purchases
        // Third priority: Card not assigned as subscription or primary

        // Since the above logic is already present in getSubscriptionCard, we can just use the card
        // returned by this function
        customerService.getCards(rbiCommonService,
            function (data) {

                var card = customerService.getSubscriptionCard(data);

                if (card != null) {
                    //address = card.value.AccountBillingAddress.ZipPostalCode;
                    address = '';
                }
                else {
                    // if user has no cards we return null
                    address = '';
                }

                $scope.addr = address;
                $scope.searchString = address;
            },
            function (data) {
                helper.debugLog("Error occureed with getCards.");
            });
    }
*/



    hideMainMenu();

    helper.SetFocus('searchBox');
    helper.SetFocus('1_0');

    var eventHandler = new LocationEventHandler($scope, $location, $routeParams);
    sharedScopeWithMenu($scope, $location);
    $scope.CurrentLevelIndex = 1;
    $scope.maxelements = 20;
    $scope.eventHandler = eventHandler;
    $scope.IsMenubarVisible = true;
    $scope.levelMap = [];
	$scope.isError = false;//to check if error occurs after searching kiosk
	
    $scope.levelMap[level_textbox] = {
        CurrentIndex: 0,
        MaxElements: 1,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };

    $scope.levelMap[level_list] = {
        CurrentIndex: 0,
        MaxElements: 3,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };
    //Condition when user comes from titleDetails page
    $scope.productId = $routeParams.productId;
    $scope.kiosks = [];
    $scope.purchaseOptionId = $routeParams.purchaseOptionId;

    if ($scope.productId != undefined) {
        $scope.image_url = sessionStorage.getItem("imageURL");
        $scope.image_title = sessionStorage.getItem("imageTitle");
        if($scope.image_url!=undefined)
            $scope.image_url = sessionStorage.getItem("imageURL");

        else
            $scope.image_url="images/default-img.png";

        // Omniture start
        $scope.productGenre = sessionStorage.getItem("productGenre");
        $scope.isProductSearch = true;
        // Omniture end

        if(address!='')
        {
        kioskService.GetKiosksByProductID($scope.purchaseOptionId, address, function (data) {
            $scope.kiosks = data;
            $scope.searchString = address;
            $scope.addr = address;
            if ($scope.flag == 1) {

                kioskService.GetRecentKiosks(function (data) {
                    $scope.recentKiosks = data;
                    var titleKiosks=new Array();
                    if ($scope.recentKiosks.length < 3) {
                        if ($scope.recentKiosks.length > 0) {
                            for (var x = 0; x < $scope.recentKiosks.length; x++) {
                                titleKiosks[x] = $scope.recentKiosks[x].getKioskID();
                            }
                        }
                    var getkioskID = platformStorage.getItem("kiosk_ids");
                    if (isDefined(getkioskID)) {
                        var str_split = getkioskID.split(",");
                        var index=0;
                        while(index <str_split.length)
                        {
                            if(titleKiosks.indexOf(str_split[index])==-1 && titleKiosks.length < 3)
                                titleKiosks.push(str_split[index]);

                            index++;
                        }
                        if(titleKiosks.length < 3)
                        {
                            var kioskArray=[];
                            for (var x = 0; x < $scope.kiosks.length; x++) {
                                if($scope.kiosks[x].getStatus()=="Online")
                                    kioskArray[x] = $scope.kiosks[x].getKioskID();
                            }
                            var index=0;
                            while(index <kioskArray.length)
                            {
                                if(titleKiosks.indexOf(kioskArray[index])==-1 && titleKiosks.length < 3)
                                    titleKiosks.push(kioskArray[index]);

                                index++;
                            }

                        }

                    }
                    else
                    {
                        var kioskArray=[];
                        for (var x = 0; x < $scope.kiosks.length; x++) {
                            if($scope.kiosks[x].getStatus()=="Online")
                                kioskArray[x] = $scope.kiosks[x].getKioskID();
                        }
                        var index=0;
                        while(index <kioskArray.length)
                        {
                            if(titleKiosks.indexOf(kioskArray[index])==-1 && titleKiosks.length < 3)
                                titleKiosks.push(kioskArray[index]);

                            index++;
                        }
                    }
                    var suggKiosks=[];
                    var index=0;
                    while(index < titleKiosks.length)
                    {
                        if(kioskArray.indexOf(titleKiosks[index])!=-1)
                            suggKiosks.push(titleKiosks[index]);

                        index++;
                    }

                    kioskService.GetKioskByKioskId(suggKiosks, function (data) {

                            $scope.recentKiosks = data;
                            $scope.$$phase || $scope.$apply();
                        },
                        function (data) {
                            helper.showErrorMessage(data, $scope);
                            $scope.dataLoaded = true;
                        });


                }
                if($scope.kiosks.length > 0)
                {
                    helper.RemoveFocus('searchBox');
                    helper.RemoveFocus('1_0');
                    helper.SetFocus('3_0');
                }

                sessionStorage.setItem("rec_kiosks", '3');
                $scope.dataLoaded = true;
                }, function (data) {
                    helper.showErrorMessage(data, $scope);
                    $scope.dataLoaded = true;
                    helper.RemoveFocus('searchBox');
                    helper.RemoveFocus('1_0');
                    $scope.addr = address;
                    sessionStorage.setItem("rec_kiosks", 0);
                    $scope.dataLoaded = true;

                });
            }

            $scope.eventHandler = new LocationEventHandler($scope, $location, $routeParams);
            $scope.CurrentLevelIndex = 3;
            $scope.maxelements = parseInt($scope.recentKiosks.length) + parseInt($scope.kiosks.length);
            $scope.statusButton = "RESERVE";
            $scope.IsMenubarVisible = true;
            $scope.levelMap = [];


            $scope.levelMap[level_textbox] = {
                CurrentIndex: 0,
                MaxElements: 1,
                CanHandleRightKey: false,
                CanHandleLefttKey: false,
                FirstElement: 1
            };

            $scope.levelMap[level_list] = {
                CurrentIndex: 0,
                MaxElements: 3,
                CanHandleRightKey: false,
                CanHandleLefttKey: false,
                FirstElement: 1
            };
            if ($scope.kiosks.length > 0) {
                helper.RemoveFocus('searchBox');
                helper.RemoveFocus('1_0');
                helper.SetFocus('3_0');
            }
            else
            {
                $scope.CurrentLevelIndex = 1;
                helper.SetFocus('1_0');
            }

            // Omniture  start
            $scope.omnitureReady = [true];
            $scope.omnitureTracking();
            $scope.numberOfResults = data.length;
            // Omniture end

        }, function (data) {
            helper.showErrorMessage(data, $scope);
            $scope.dataLoaded = true;
            helper.RemoveFocus('searchBox');
            helper.RemoveFocus('1_0');
            //$scope.searchString = address;

        });

        }
    }
    else {
        $scope.searchString = address;
        // Omniture  start
        if($scope.searchString == '' && $scope.isInitialLoad) {
            $scope.omnitureReady = [true];
            $scope.omnitureTracking();
            $scope.isInitialLoad = false;
        }
        $scope.numberOfResults = 0;
        // Omniture end
    }



    if (address != '' && address != undefined && $scope.productId == undefined) {
        //when user logged in
        if ($scope.flag == 1) {
            kioskLocations();
            kioskService.GetRecentKiosks(function (data) {
                $scope.flag=1;
                //$("#loading-bar").hide();
                //$scope.spinner = {display : false};
                $scope.recentKiosks = data;
                var titleKiosks=new Array();
                if ($scope.recentKiosks.length < 3) {
                    if ($scope.recentKiosks.length > 0) {
                        for (var x = 0; x < $scope.recentKiosks.length; x++) {
                            titleKiosks[x] = $scope.recentKiosks[x].getKioskID();
                        }
                    }
                    var login_username = platformStorage.getItem("CURRENT_LOGGEDIN_USER");
                    var getkioskID = platformStorage.getItem("kioskIds_"+login_username);
                    if (isDefined(getkioskID)) {
                        var str_split = getkioskID.split(",");
                        var index=0;
                        while(index <str_split.length)
                        {
                            if(titleKiosks.indexOf(str_split[index])==-1 && titleKiosks.length < 3)
                                titleKiosks.push(str_split[index]);

                            index++;
                        }
                        if(titleKiosks.length < 3)
                        {
                            var kioskArray=[];
                            for (var x = 0; x < $scope.kiosks.length; x++) {
                                if($scope.kiosks[x].getStatus()=="Online")
                                    kioskArray[x] = $scope.kiosks[x].getKioskID();
                            }
                            var index=0;
                            while(index <kioskArray.length)
                            {
                                if(titleKiosks.indexOf(kioskArray[index])==-1 && titleKiosks.length < 3)
                                    titleKiosks.push(kioskArray[index]);

                                index++;
                            }

                        }

                    }
                    else
                    {
                        var kioskArray=[];
                        for (var x = 0; x < $scope.kiosks.length; x++) {
                            if($scope.kiosks[x].getStatus()=="Online")
                                kioskArray[x] = $scope.kiosks[x].getKioskID();
                        }
                        var index=0;
                        while(index <kioskArray.length)
                        {
                            if(titleKiosks.indexOf(kioskArray[index])==-1 && titleKiosks.length < 3)
                                titleKiosks.push(kioskArray[index]);

                            index++;
                        }
                    }
                    kioskService.GetKioskByKioskId(titleKiosks, function (data) {

                            $scope.recentKiosks = data;
                            $scope.$$phase || $scope.$apply();
                        },
                        function (data) {
                            helper.showErrorMessage(data, $scope);
                            $scope.dataLoaded = true;
                            helper.RemoveFocus('searchBox');
                            helper.RemoveFocus('1_0');
                        });


                }
                if($scope.kiosks.length > 0)
                {
                    helper.RemoveFocus('searchBox');
                    helper.RemoveFocus('1_0');
                    helper.SetFocus('3_0');
                }
                else
                {
                    $scope.CurrentLevelIndex = 1;
                    helper.SetFocus('1_0');
                }

                sessionStorage.setItem("rec_kiosks", '3');

            }, function (data) {
                //helper.showErrorMessage(data, $scope);
                // $scope.recentKiosks = [];
                //$scope.addr = address;
                //sessionStorage.setItem("rec_kiosks", 0);
                //$scope.recentKiosks="test";

            });


        }
        else {
            kioskService.kioskSearch(address, 20, function (data) {
                //$("#loading-bar").hide();
                //$scope.spinner = {display : false};
                $scope.kiosks = [];
                $scope.kiosks = data;
                $scope.addr = address;
                $scope.statusButton = "BROWSE";

                var eventHandler = new LocationEventHandler($scope, $location, $routeParams);
                $scope.CurrentLevelIndex = 3;

                $scope.maxelements = $scope.kiosks.length;
                $scope.eventHandler = eventHandler;
                $scope.IsMenubarVisible = true;
                $scope.levelMap = [];


                $scope.levelMap[level_textbox] = {
                    CurrentIndex: 0,
                    MaxElements: 1,
                    CanHandleRightKey: false,
                    CanHandleLefttKey: false,
                    FirstElement: 1
                };

                $scope.levelMap[level_list] = {
                    CurrentIndex: 0,
                    MaxElements: 3,
                    CanHandleRightKey: false,
                    CanHandleLefttKey: false,
                    FirstElement: 1
                };
                if ($scope.kiosks.length > 0) {
                    helper.RemoveFocus('searchBox');
                    helper.RemoveFocus('1_0');
                    helper.SetFocus('3_0');
                }
                else
                {
                    $scope.CurrentLevelIndex = 1;
                    helper.SetFocus('1_0');
                }

                // Omniture  start
                $scope.omnitureReady = [true];
                $scope.omnitureTracking();
                $scope.numberOfResults = data.length;
                // Omniture end
            }, function (data) {
                helper.showErrorMessage(data, $scope);
                $scope.dataLoaded = true;
                helper.RemoveFocus('searchBox');
                helper.RemoveFocus('1_0');
                //$scope.kiosks = [];
                // $scope.error = data.ResultInfo.ResultCode;
            });
        }
    }

    $scope.searchKiosks = function (address) {
		//clearing data from the view before rendering new results
		$scope.recentKiosks = [];
		$scope.kiosks = [];
		$scope.isError = false;
        sessionStorage.setItem("addr", address);
        //$("#loading-bar").show();
        //$scope.spinner = {display : true};
        if ($scope.purchaseOptionId != undefined && $scope.purchaseOptionId != '') {
            kioskService.GetKiosksByProductID($scope.purchaseOptionId, address, function (data) {
                //$("#loading-bar").hide();
                //$scope.spinner = {display : false};
				$scope.isError = false;
                $scope.recentKiosks = [];
                $scope.kiosks = data;
                $scope.searchString = address;
                $scope.addr = address;
                $scope.eventHandler = new LocationEventHandler($scope, $location, $routeParams);
                $scope.CurrentLevelIndex = 3;
                $scope.maxelements = parseInt($scope.recentKiosks.length) + parseInt($scope.kiosks.length);
                $scope.statusButton = "RESERVE";
                $scope.IsMenubarVisible = true;
                $scope.levelMap = [];


                $scope.levelMap[level_textbox] = {
                    CurrentIndex: 0,
                    MaxElements: 1,
                    CanHandleRightKey: false,
                    CanHandleLefttKey: false,
                    FirstElement: 1
                };

                $scope.levelMap[level_list] = {
                    CurrentIndex: 0,
                    MaxElements: 3,
                    CanHandleRightKey: false,
                    CanHandleLefttKey: false,
                    FirstElement: 1
                };
                if ($scope.kiosks.length > 0) {
                    helper.RemoveFocus('searchBox');
                    helper.RemoveFocus('1_0');
                    helper.SetFocus('3_0');
                }
                else
                {
                    $scope.CurrentLevelIndex = 1;
                    helper.SetFocus('1_0');
                }
                $scope.dataLoaded = true;

                // Omniture  start
                $scope.omnitureReady = [true];
                $scope.omnitureTracking();
                $scope.numberOfResults = data.length;
                // Omniture end
            }, function (data) {
                helper.showErrorMessage(data, $scope);
                helper.RemoveFocus('searchBox');
                helper.RemoveFocus('1_0');
                $scope.dataLoaded = true;
				//checking availability of data
				if (!$scope.recentKiosks.length > 0 && !$scope.kiosks.length > 0)
				$scope.isError = true;
                //$scope.kiosks = [];
                //$scope.kiosks=data;
            });
        }
        else {
             if(address!='')
             {
             kioskService.kioskSearch(address, 20, function (data) {
                //$("#loading-bar").hide();
                //$scope.spinner = {display : false};
				$scope.isError = false;
                $scope.productId='';
                $scope.kiosks = [];
                $scope.flag = 0;
                $scope.recentKiosks = [];
                $scope.kiosks = data;
                $scope.addr = address;
                $scope.maxelements = $scope.kiosks.length;


                $scope.statusButton = "BROWSE";

                $scope.TempCurrentIndex = 3;

                $scope.kiosk_list_margin = 0;

                $scope.top_margin_offset = 110 * 3;


                $scope.top_margin_con_offset = 260;


                $scope.first_page_margin_offset = 30;


                var eventHandler = new LocationEventHandler($scope, $location, $routeParams);
                $scope.CurrentLevelIndex = 3;
                $scope.maxelements = $scope.kiosks.length;
                $scope.eventHandler = eventHandler;
                $scope.IsMenubarVisible = true;
                $scope.levelMap = [];

                $scope.levelMap[level_textbox] = {
                    CurrentIndex: 0,
                    MaxElements: 1,
                    CanHandleRightKey: false,
                    CanHandleLefttKey: false,
                    FirstElement: 1
                };

                $scope.levelMap[level_list] = {
                    CurrentIndex: 0,
                    MaxElements: 3,
                    CanHandleRightKey: false,
                    CanHandleLefttKey: false,
                    FirstElement: 1
                };

                if ($scope.kiosks.length > 0) {
                    helper.RemoveFocus('searchBox');
                    helper.RemoveFocus('1_0');
                    helper.SetFocus('3_0');
                }
                else
                {
                    $scope.CurrentLevelIndex = 1;
                    helper.SetFocus('1_0');
                }

                 // Omniture start
                 $scope.omnitureReady = [true];
                 $scope.omnitureTracking();
                 $scope.numberOfResults = data.length;
                 // Omniture end
            }, function (data) {
                helper.showErrorMessage(data, $scope);
                $scope.dataLoaded = true;
                 helper.RemoveFocus('searchBox');
                 helper.RemoveFocus('1_0');
				 //checking availability of data
				 if (!$scope.recentKiosks.length > 0 && !$scope.kiosks.length > 0)
				 $scope.isError = true;
                //$scope.kiosks = [];
                //$scope.addr = address;

            });
           }
        }
    }
    function kioskLocations() {
        kioskService.kioskSearch(address, 20, function (data) {
            //$("#loading-bar").hide();
            //$scope.spinner = {display : false};
            $scope.kiosks = [];
            $scope.kiosks = data;
            $scope.statusButton = "BROWSE";
            $scope.addr = address;

            var eventHandler = new LocationEventHandler($scope, $location, $routeParams);
            $scope.CurrentLevelIndex = 3;
            $scope.maxelements = parseInt($scope.recentKiosks.length) + parseInt($scope.kiosks.length);

            $scope.eventHandler = eventHandler;
            $scope.IsMenubarVisible = true;
            $scope.levelMap = [];


            $scope.levelMap[level_textbox] = {
                CurrentIndex: 0,
                MaxElements: 1,
                CanHandleRightKey: false,
                CanHandleLefttKey: false,
                FirstElement: 1
            };

            $scope.levelMap[level_list] = {
                CurrentIndex: 0,
                MaxElements: 3,
                CanHandleRightKey: false,
                CanHandleLefttKey: false,
                FirstElement: 1
            };

            helper.SetFocus('3_0');
            // Omniture start
            $scope.omnitureReady = [true];
            $scope.omnitureTracking();
            $scope.numberOfResults = data.length;
            // Omniture end

        }, function (data) {
            helper.showErrorMessage(data, $scope);
            $scope.dataLoaded = true;
            helper.RemoveFocus('searchBox');
            helper.RemoveFocus('1_0');
            //$scope.kiosks = [];
            // $scope.error = data.ResultInfo.ResultCode;

        });
    }
    $scope.doSearch=function(newValue){

            $scope.searchKiosks(newValue);
            console.log("search fired");
            $("#list-item-longwrapper").stop().animate({ marginTop: 0 }, 500);

    }

    /*   -- This call is redunant - results in multiple kiosk searches
    $scope.$watch('searchString', function(newValue, oldValue){
        if(isDefined(newValue) && newValue != oldValue)
        {
            $scope.searchString = newValue;
            // Omniture onClick
            $scope.omnitureOnClickSearchZip();

            $scope.doSearch(newValue);
        }
    }) */
    $scope.$watch('searchString', function(value){
        $scope.searchString = value;

        if($scope.searchString!='')  {

            // Invoke kiosk search
            $scope.doSearch(value);
            // Omniture onClick
            if($scope.pageLoaded == true)
            {
                $scope.omnitureOnClickSearchZip();
            }
        }
        $scope.pageLoaded = true;
    });
    $scope.$on('$locationChangeStart', function () {
        sessionStorage.removeItem("_backPathToLocation");
    });

    // Omniture start

    $scope.omnitureCollectOnBrowseKiosk = function (kioskName) {
        Omniture.Clear();
        if ($scope.isProductSearch) {
            //Omniture.Variables.eVar31 = Omniture.pageName;  // Not part of Top 40 vars
            Omniture.Variables.eVar40 = "+1"
            //Omniture.Variables.eVar57 = $scope.image_title;  // Not part of Top 40 vars
            if (!isDefined(platformStorage.getItem(OMNITURE_KIOSK_SEARCH_VISITED))) {
                Omniture.Variables.events.push("scopen");
                platformStorage.setItem(OMNITURE_KIOSK_SEARCH_VISITED, true);
            }
            Omniture.Variables.events.push("scadd");
            //Omniture.Variables.events.push("event69");   // Not part of Top 40 vars
            Omniture.Variables.products = $scope.productId;
            Omniture.Variables.prop26 = $scope.image_title + "|reserve";
            Omniture.Variables.eVar51 = Omniture.pageName + "|content|reserve";

            if (config.debug) {
                helper.debugLog("omnitureCollectOnBrowseKiosk:");
                helper.debugLog("eVar40: " + Omniture.Variables.eVar40);
                var events =  "events: ";
                for (var i=0; i<Omniture.Variables.events.length; i++) {
                    events += Omniture.Variables.events[i] + " ";
                }
                helper.debugLog(events);
                helper.debugLog("products: " + Omniture.Variables.products);
                helper.debugLog("prop26: " + Omniture.Variables.prop26);
                helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
            }
        }
        else {
            //Omniture.Variables.eVar56 = kioskName;   // Not part of Top 40 vars
            //Omniture.Variables.prop6 = kioskName;    // Not part of Top 40 vars
            //Omniture.Variables.events.push("event32");   // Not part of Top 40 vars
            Omniture.Variables.eVar51 = Omniture.pageName + "|content|browse button";
            helper.debugLog("omnitureCollectOnBrowseKiosk:");
            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
        }
        Omniture.InvokeOmniture(Omniture.InvokeType.click);
    };



    $scope.omnitureOnClickSearchZip = function () {
        Omniture.Clear();
        var linkName;
        if ($scope.isProductSearch) {
            linkName = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find title|" + $scope.image_title;
        }
        else {
            linkName = RBI.PlatformConfig.OmnitureTargetDevice + "|kiosk|find box|" + $scope.searchString;
        }
        Omniture.Variables.eVar51 = linkName + "|content|search zip";
        helper.debugLog("omnitureCollectOnClick:");
        helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
        Omniture.InvokeOmniture(Omniture.InvokeType.click);
    };
    // Omniture end
});

//This function is added to remove dual focus in locations page.
function dualFocusChk(){
    if($('#0_0 #titleid_0').hasClass('title-div-highlight')){
        helper.RemoveFocus('1_0');
    }
}