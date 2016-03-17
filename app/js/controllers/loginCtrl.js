'use strict';

rbi.controller('loginCtrl', function ($scope, $location, $routeParams, $dialog, rbiCommonService, loginService, customerService) {

    //Omniture  start
    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|sign in";
    $scope.PlayStationType=RBI.PlatformConfig.deviceType;
    $scope.omnitureReady=[false];
    //Omniture end

    if (typeof $routeParams.returnURL1 != 'undefined') {
        $scope.returnUrl = $routeParams.returnURL1;
    }
    else {
        $scope.returnUrl = '';
    }
    if (typeof $routeParams.returnURL2 != 'undefined') {
    	$scope.returnUrl += '/' + $routeParams.returnURL2;
    }
    if (typeof $routeParams.returnURL3 != 'undefined') {
    	$scope.returnUrl += '/' + $routeParams.returnURL3;
    }    
    
    $scope.user = { 'emailAddress': '', 'password': '' };
    $scope.loginUnderProgress = false;
  //  $('#main-menu-return').hide();
    $scope.mainMenuReturn = {display:false};
    $scope.isVerizonPolicyOpen = false;
    $scope.isRedboxPolicyOpen = false;
    $scope.Offset = 150;
	$scope.focusIndex = 0;
    $scope.redboxstartpos = 0;
    $scope.verizonstartpos = 0;
    $scope.loginTimeout = null;
    $scope.updateRequiredPopupVisible = false;

    //**** Added to show the last page after BACK on LOGIN, Initially it was not added therefore the last page would POP
    //**** Title details page was popping
    //**** Adding this back means that it will also have to be removed after LOGIN which is handled in the loginCtrl after
    //**** success callback.
    //**** Since we do not want the users to see the login screen on BACK after LOGIN.
    addToBackPaths($location.path());
    hideMainMenu();
    $("#menu-button-wrapper").hide();

    /*** Why do we need the below? It is already using a directive - autofocus **/
    //$('#emailAddress').focus();
    //angular.element('#emailAddress').focus();


    $scope.eventHandler = new LoginEventHandler($scope, $location, $routeParams);
    sharedScopeWithMenu($scope, $location);
    $scope.loginUser = function () {
        var user = $scope.user;

        if (typeof user.emailAddress !== 'undefined' && typeof user.password !== 'undefined') {
            disableHttpSpinner = true;
            $scope.loginUnderProgress = true;

            helper.showSpinner (config.SPINNER_FADEOUT_MS, config.spinnerPosition);

            loginService.Login(user.emailAddress, user.password, false, function (data) {
            	$scope.loginUnderProgress = false;
                disableHttpSpinner = false;
                helper.hideSpinner();
                if ($scope.loginTimeout != null) {
                    clearTimeout($scope.loginTimeout);
                }
                helper.removePageFromBackPaths('/login');
                LoginSuccessCallback();

                // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
                /*if (loginService.UpdateProfileNeeded(data)) {
                    platformStorage.setItem(UPDATE_NEEDED, "true");
                    // if the data is missing, redirect user to create account page to enter missing info
                    $location.path("/createAccount/true");
                    $scope.$apply();
                }  */
                //else {
               //     helper.debugLog("User profile OK");
               //     $scope.LoginSuccessCallback();
               // }


            }, function (data) {
            	$scope.loginUnderProgress = false;
                helper.hideSpinner();
                if ($scope.loginTimeout != null) {
                    clearTimeout($scope.loginTimeout);
                }

                if (data == RBI.Config.PIIAcceptanceRequired) {
                    helper.debugLog("PII acceptance required");
                    helper.removePageFromBackPaths('/login');
                    rbiCommonService.setSharedItem("USER_CRED", user);
                    var redirectUrl = "/impNotice";
                    if ($scope.returnUrl != '') {
                        redirectUrl += '/' + $scope.returnUrl;
                    }
                    $location.path(redirectUrl);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
                else {
                    disableHttpSpinner = false;
                    helper.showErrorMessage(data, $scope);
                }
            });

             // login timeout
            $scope.loginTimeout = setTimeout(function () {
                helper.hideSpinner();
                if (helper.isUserLoggedIn()) {
                    LoginSuccessCallback();
                }
                else {
                    helper.ShowPopupBox('Error_PopUp', $scope);
                }
            }, LOGIN_TIMEOUT);
        }
        else {
            // ZOE  28007 - We should not be validating username and password here. We need to pass whatever user enters
            // to the server to get a proper error message
            //helper.ShowPopupBox('Popup_LOGIN_FAIL', $scope);
            var errorObj = {
                ResultInfo: { ResultCode: 'RBXAPI-CUST-000' }
            };
            helper.showErrorMessage(errorObj, $scope);
            helper.debugLog("Login failed");
        }
    };

    function LoginSuccessCallback () {
        if (helper.isUserLoggedIn()) {
            $scope.trackOmniture = "signin";
            $scope.omnitureReady = [true];
            helper.debugLog('login successful');
            platformStorage.setItem("is_Helpoverlayeopen", "true");
            if (isDefined(platformStorage.getItem("checkouttype"))) {
                platformStorage.removeItem("checkouttype");
                platformStorage.removeItem("checkoutdata");
            }


            if (RBI.PlatformConfig.activateDevice) {
                loginService.ProcessDeviceActivation();
            }

            if (helper.isFreeTrialEntry(rbiCommonService)) {
                // Free trial entry
                helper.debugLog('processing free trial');
                helper.processFreeTrial($scope, $location, customerService, rbiCommonService, true);
            }
            else {
                customerService.getCustomer(function(customerData) {
                    helper.processCustomerData(customerData, customerService, rbiCommonService, $scope, $location);
                }, function (data) {
                    // If getCustomer fails show an error message and redirect user from login page
                    helper.debugLog("Get Customer error");
                    helper.showErrorMessage(data, $scope);
                    helper.redirectFromLoginPage($scope, $location);
                });
            }
        }
    };


    $scope.$on('$locationChangeStart', function () {
        $("#menu-button-wrapper").show();
    });

    $scope.newAccount = function() {
        $location.path('/createAccount');
    };

    //ZOE-32368: This is added for handling User with expired credit card poup not now button click
    $scope.checkPopup = function(){
        window.location.hash == "#/login/account" ? $location.path('/account') : $location.path(backPaths[backPaths.length - 1]);
    };

    //Omniture
    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false)<=-1){
            Omniture.Clear();
            if (internetConnected) {
                if ($scope.trackOmniture === "pageload") {
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|sign in";
                    Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|sign in";
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.Variables.events = ["event21"];
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                }
                else if ($scope.trackOmniture === "signin") {
                    Omniture.Variables.eVar8 = helper.getStorageData("PCN");
                    Omniture.Variables.eVar26 = helper.getStorageData(USER_START_DATE);
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                }
            }
            $scope.omnitureReady[0]=false;
        }
    });

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
    $scope.trackOmniture="pageload";
    $scope.omnitureReady=[true];
    //Omniture
});