'use strict';
/**
 * Create Account Ctrl to faciliate account creation.
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */

rbi.controller("createAccountCtrl", function ($scope, $location, $routeParams, customerService, loginService, rbiCommonService, $dialog) {

    //Omniture
    Omniture.pageName = "";

    //Omniture
    $scope.eventHandler = new createAccountEventHandler($scope, $location, $routeParams, $dialog, loginService, rbiCommonService);
    $scope.omnitureReady=[false];   
	$scope.backBtn = true;
    sharedScopeWithMenu($scope, $location);
    $scope.isRedboxPolicyOpen = false;
    $scope.specificBack = true;
    $scope.isVerizonPolicyOpen = false;
    $scope.isErrorPopupOpen = false;
    addToBackPaths($location.path());
    var firstScreenAccountControl = ["account_email", "account_confirmemail", "account_firstname", "account_lastname", "create-account-next-screen1"];
    var secondScreenAccountControl = ["account_password", "account_confirmpassword", "account_zipcode", "account_terms_and_condition", "create-account-next-screen2"];
    var thirdScreenAccountControl = ["account_withSubscription", "account_withoutSubscription"];
    $scope.createAccountControl = [firstScreenAccountControl, secondScreenAccountControl, thirdScreenAccountControl];
    $scope.focusIndex = 0;
    $scope.customerData = {
        firstName: "",
        lastName: "",
        loginEmail: "",
        confirmEmail: "",
        cvv: "",
        zipCode: "",
        termsAndCondition: false,
        password: "",
        confirmPassword: "",
        token: "",
        pcn: ""
    };
    
    var messageTitle_sorry = "Sorry",
    	messageTitle_SomethingMissing = "Something's Missing";
    
    
    // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
    //$scope.isExistingCustomer = false;

    $scope.state = "ACCOUNT_CREATE_1"; //ACCOUNT_CREATE_1,ACCOUNT_CREATE_2,ACCOUNT-CREATING,ACCOUNT-CREATED;

    helper.SetFocus("account_email");

	hideMainMenu();

    $scope.mainMenuReturn = {display:false};
    $scope.account = {"email":"","confirmEmail":"","firstName":"","lastName":""};

    function init() {
        // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
        /*if (isDefined($routeParams.isExistingUser) && $routeParams.isExistingUser=="true") {
            //Omniture
            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile verify1";
            $scope.trackOmniture="existing customer1";
            $scope.omnitureReady=[true];
            //Omniture
            $scope.isExistingCustomer = true;
            $scope.customerData.termsAndCondition = true; // When existing customer gets to this screen PII has already been accepted
            customerService.getCustomer(function(data){
            			$scope.customerData.firstName = helper.isDefined(data.getFirstName()) ? data.getFirstName() : "";
            			$scope.customerData.lastName = helper.isDefined(data.getLastName()) ? data.getLastName() : "";
            			$scope.customerData.loginEmail = helper.isDefined(data.getEmailAddress()) ? data.getEmailAddress() : "";
            			$scope.customerData.confirmEmail = helper.isDefined(data.getEmailAddress()) ? data.getEmailAddress() : "";
            			$scope.customerData.zipCode = helper.isDefined(data.value.Addresses.HOME.zipCode) ? data.value.Addresses.HOME.zipCode : "";
            			$scope.customerData.pcn = helper.isDefined(data.getPartnerCustomerNumber()) ? data.getPartnerCustomerNumber() : "";
            			makeUneditable();
            },function(data){
            	helper.showErrorMessage(data, $scope);
            });
        }
        else { */
            //Omniture
            Omniture.pageName=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile1";
            $scope.trackOmniture="screen1";
            $scope.omnitureReady=[true];
            //Omniture
           // $scope.isExistingCustomer = false;
       // }
    }

    init();

    //Logic on next button click

    // LG Navigate Back
    $scope.navigateToPreviousPage = function (){
        // Added this function to check for Account/ My Redbox, Promotions, and Title Details to Login --> Create Account
        // On Back. LG was crashing from Create Account, added below checks... ZOE-34244
        backPaths.pop();
        if(backPaths[backPaths.length - 1].indexOf('/login/account') != -1){
            backPaths.pop();
            $location.path('/account');
        }
        else if(backPaths[backPaths.length - 1].indexOf('/login/myredbox/dashboard') != -1){
            backPaths.pop();
            $location.path('/myredbox/dashboard');
        }
        else if(backPaths[backPaths.length - 1].indexOf('/login/titledetail') != -1){
            backPaths.pop();
            lgBackTitleDetail = true;
            $location.path(backPaths[backPaths.length - 1]);
        }
        else if(backPaths[backPaths.length - 1].indexOf('/login') != -1){
            backPaths.pop();
            lgBackHome = true;
            $location.path(backPaths[backPaths.length - 1]);
        }
        else {
            $location.path('/home');
        }
        return;
    }
    //Navigates on free trial select
    $scope.selectFreeTrialOption = function () {
        switch ($scope.focusIndex) {
            case 0: {
                rbiCommonService.setSharedItem("SUBSCRIPTION_TYPE", FREE_TRIAL);
                break;
            }
            case 1: {
                rbiCommonService.setSharedItem("SUBSCRIPTION_TYPE", NO_SUBSCRIPTION);
                break;
            }
        }
        $location.path("/account/creditCards/cardDetails/add");
    };
  
  //Logic on next button click

    $scope.createAccountNext = function () {
        switch ($scope.state) {
            case "ACCOUNT_CREATE_1": {
                if (validateFirstScreen()) {
                    return;
                }
                //Logic to move to next screen
                $scope.state = "ACCOUNT_CREATE_2";
                //ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
                //Omniture
//                if (isDefined($routeParams.isExistingUser) && $routeParams.isExistingUser=="true") {
//                    Omniture.pageName=RBI.PlatformConfig.OmnitureTargetDevice + "create account|profile verify2"
//                    $scope.trackOmniture="existing customer2";
//                    $scope.omnitureReady=[true];
//                }else{
                    Omniture.pageName=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile2"
                    $scope.trackOmniture="screen2";
                    $scope.omnitureReady=[true];
               // }
                //Omniture
                    $scope.focusIndex = 0;
                    var elementId = ($scope.createAccountControl[1])[$scope.focusIndex];
                    $("#" + elementId).focus();

                break;
            }

            case "ACCOUNT_CREATE_2": {
                if (validateSecondScreen()) {
                    return;
                }
                $("#create-account-next-screen2").blur();
                //Check if existing user we calls update customer call, which does not require login call --> removed
                // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
//                if ($scope.isExistingCustomer) {
//                    processExistingCustomer();
//                }
//                else {
                processNewCustomer();
                //}
                break;
            }

            default: {
                break;
            }
        }
    };

// ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
//    function processExistingCustomer() {
//        customerService.updateCustomer($scope.customerData, function (data) {
//            // This call already returns a customer object so there
//            // is no need to call GetCustomer here
//            platformStorage.removeItem(UPDATE_NEEDED);
//            getCustomerSuccess(data);
//        }, function (data) {
//            helper.showErrorMessage(data, $scope);
//        });
//    }
    
    
    // Call to initialization
    init();    

    function processNewCustomer() {
        // Logic to add customer and move to free trial screen
        disableHttpSpinner = true;
        helper.showSpinner (config.SPINNER_FADEOUT_MS, config.spinnerPosition);
        customerService.createCustomerToken(function (data) {
            $scope.customerData.token = data.getToken();
            helper.debugLog("customer token: " + $scope.customerData.token);
            $scope.state = "ACCOUNT-CREATING";
			$scope.specificBack = false;
            //$("#back-button-wrapper").scope().backBtnWrapper = { display: false };
            customerService.createCustomer($scope.customerData, function (data) {
                helper.debugLog("Create customer successful");
                helper.debugLog("username: " + $scope.customerData.loginEmail);
                helper.debugLog("password: " + $scope.customerData.password);

                // ZOE-30402
                // When create customer succeeds show user that the account has been created
                $scope.state = "ACCOUNT-CREATED";
				$scope.specificBack = false;
                //$("#back-button-wrapper").scope().backBtnWrapper = { display: false };
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                //Omniture
                Omniture.pageName=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|created";
                $scope.trackOmniture="accCreated"
                $scope.omnitureReady=[true];
                //Omniture

                loginService.Login($scope.customerData.loginEmail, $scope.customerData.password, $scope.customerData.termsAndCondition, function (data) {
                    if ($scope.loginTimeout != null) {
                        clearTimeout($scope.loginTimeout);
                    }
                    helper.debugLog("login successful");
                    helper.hideSpinner();
                    disableHttpSpinner = false; // enable http spinner here for the GetCustomer call

                    customerService.getCustomer(function (data) {
                        rbiCommonService.setSharedItem(CURRENT_CUSTOMER_ACCOUNT_NO, data.getAccountNumber());
                        rbiCommonService.setSharedItem("isFirstCard", true);
                        helper.debugLog("Customer data: " + data);
                        popBackPath();
                        // remove the sign-up page from back paths since user is already logged in
                        // does nothing if login page is not in the back paths
                        helper.removePageFromBackPaths('/login');
                        // Can call the same function here
                        getCustomerSuccess(data);

                    }, function (data) {
                        helper.showErrorMessage(data, $scope);
                        // Go back to the account creation page
                        $scope.state = "ACCOUNT_CREATE_1";
                        //$scope.$apply();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });

                }, function (data) {
                    if ($scope.loginTimeout != null) {
                        clearTimeout($scope.loginTimeout);
                    }
                    signupError(data);
                });

                // login timeout
                $scope.loginTimeout = setTimeout(function () {
                    signupError(null);
                    helper.ShowPopupBox('Error_PopUp', $scope);
                }, LOGIN_TIMEOUT);

            }, function (data) {
                createAccountError(data);
            });
        }, function (data) {
            createAccountError(data);
        });
    }

    function getCustomerSuccess(data) {
        // PR - should we get the email from customer data instead?
        platformStorage.setItem("CURRENT_LOGGEDIN_USER", $scope.customerData.loginEmail);
        var checkout_Type = platformStorage.getItem("checkouttype");
        if (isDefined(checkout_Type)) {
            platformStorage.setItem(FROM_NEW_ACCT);
            $location.path("/account/creditCards/cardDetails/add");
        }
        else if (helper.isFreeTrialEntry(rbiCommonService)) {
            // Free trial entry
            helper.processFreeTrial($scope, $location, customerService, rbiCommonService, false); //$scope.isExistingCustomer);
        }
        else {
            $location.path("/freeTrial");
        }

        // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
       // else { //if (!$scope.isExistingCustomer ||
             //   ($scope.isExistingCustomer && rbiCommonService.isSharedItemExist(PLAYBACK_TITLE_URL))) {
            // for new users and existing users that navigated here using "Subscribe Now" button on Title Details page
            // $location.path("/freeTrial");
        // }
        /*else {
            // ZOE-30408
            // this is the case when user was just prompted to update his info after login w/o going through signup flow
            // ZOE 30155: Changes for kiosk signup - check the customer billing info and prompt user to update if necessary
            $scope.returnUrl = ""; // for redirect
            // removed getCustomer call b/c it is not needed since data already contains customer object
            helper.processCustomerData(data, customerService, rbiCommonService, $scope, $location);
        }  */
    }

    function createAccountError(data) {
        disableHttpSpinner = false;
		$scope.specificBack = true;
        helper.hideSpinner();
        if (data != null) {
            helper.showErrorMessage(data, $scope);
        }
        //$location.path('/createAccount/');
        // Go back to the account creation page
        $scope.state = "ACCOUNT_CREATE_1";
        helper.SetFocus("account_email");
        //$scope.$apply();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    // ZOE-30402
    // In this case user has already created an accout so he should be redirected to sign in / sign up page
    function signupError(data) {
        disableHttpSpinner = false;
		$scope.specificBack = true;
        helper.hideSpinner();
        if (data != null) {
            helper.showErrorMessage(data, $scope);
        }
        goToPreviousPath($scope, KEY_CODES.CIRCLE, $location);
    }    

    //validates the user details
    function validateFirstScreen() {
    	 if (($scope.customerData.firstName.trim() == "" || $scope.customerData.lastName.trim() == "" || $scope.customerData.loginEmail.trim() == "" || $scope.customerData.confirmEmail.trim() == "")) {
    	     var message ="";
    	     if ($scope.customerData.firstName.trim() == "")
    	         message = message+"First name is required.<br>";
    	     if ($scope.customerData.lastName.trim() == "")
    	         message = message+"Last name is required.<br>";
    	     if ($scope.customerData.loginEmail.trim() == "")
    	         message = message+"Email is required.<br>";
    	     if ($scope.customerData.confirmEmail.trim() == "")
    	         message = message+"You must confirm your email.<br>";
    	     showInvalidPopup(message,messageTitle_sorry);
    	     return true;
    	 }
    	 
    	 // RegEx for FirstName and LastName length
    	 // ZOE-33693
    	 // ZOE-35527
    	 var len = /^.{1,50}$/;
    	 
        if (!len.test($scope.customerData.firstName)) {
            var message = "First name must be between 1 and 50 characters long";
            if (!len.test($scope.customerData.lastName)){
            	message += "<br/>Last name must be between 1 and 50 characters long";
            }
            showInvalidPopup(message,messageTitle_SomethingMissing);
            return true;
        }
        if (!len.test($scope.customerData.lastName)) {
            var message = "Last name must be between 1 and 50 characters long";
            showInvalidPopup(message,messageTitle_SomethingMissing);
            return true;
        }
        
        //RegEx to Check only letters with min length of 1 and max of 50
        var letter = /^([A-Z a-z]){1,50}$/;
        
        //validate firstName and lastName against regular expression
        if (!letter.test($scope.customerData.firstName)) {
        	var message = "In the first name, use only letters.";
        	if (!letter.test($scope.customerData.lastName)){
        		message += "<br/>In the last name, use only letters.";
        	}
        	showErrorPopUp(message);
            return true;
        }
        
        if (!letter.test($scope.customerData.lastName)) {
        	var message = "In the last name, use only letters.";
        	showErrorPopUp(message);
            return true;
        }
        
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!(re.test($scope.customerData.loginEmail) && re.test($scope.customerData.confirmEmail))) {
            var message = "Invalid email";
            showInvalidPopup(message,messageTitle_sorry);
            return true;
        }

        if ($scope.customerData.loginEmail != $scope.customerData.confirmEmail) {
            var message = "Email ID and confirm Email does not match";
            showInvalidPopup(message,messageTitle_sorry);
            return true;
        }

    }
    
    // Show error message when using numbers in first name and Last name
    function showErrorPopUp(message){
    	var popUpKey = 'Popup_VALIDATION_FAIL';
        popupObj_Meta[popUpKey] = {};
        popupObj_Meta[popUpKey].title_text = "Now Hold On";
        popupObj_Meta[popUpKey].msg_text = message;
        popupObj_Meta[popUpKey].button_1_text = "";
        popupObj_Meta[popUpKey].button_2_text = "OK";
        popupObj_Meta[popUpKey].seperator = true;
        popupObj_Meta[popUpKey].button_1_click = function () {
        },
        popupObj_Meta[popUpKey].button_2_click = function () {
            helper.HidePopupBox();
        };
        PopupBox.Show(popUpKey, $scope);
        
    }
    
    //validates the user details
    function validateSecondScreen() {
        if ($scope.customerData.password.trim() == "" || $scope.customerData.confirmPassword.trim() == "" || $scope.customerData.zipCode.trim() == "") {
            var message ="";
   	     if ($scope.customerData.password.trim() == "")
   	         message = message+"Password is required.<br>";
   	     if ($scope.customerData.confirmPassword.trim() == "")
   	         message = message+"You must confirm your password.<br>";
   	     if ($scope.customerData.zipCode.trim() == "")
   	         message = message+"Zip code is required.<br>";
           showInvalidPopup(message,messageTitle_sorry);
            return true;
        }

        var re = /^\d+$/;
        if (!(re.test($scope.customerData.zipCode.trim()) && $scope.customerData.zipCode.trim().length==5)) {
            var message = hashObj['CUST-ZIP'].app_error_message;
            showInvalidPopup(message,messageTitle_sorry);
            return true;
        }

        if ($scope.customerData.password != $scope.customerData.confirmPassword) {
            var message = "Password and confirm password does not match";
            showInvalidPopup(message,messageTitle_sorry);
            return true;
        }

        if ($scope.customerData.termsAndCondition != true) {
            var message = "Please select terms and conditions";
            showInvalidPopup(message,messageTitle_sorry);
            return true;
        }
    }

    //Shows popup for error message
    function showInvalidPopup(message,title) {
        var popupKey = "Popup_CREATE_ACCOUNT_FAIL";
        
        popupObj_Meta[popupKey].title_text = title;
        popupObj_Meta[popupKey].msg_text = message;
        popupObj_Meta[popupKey].button_2_click = function () {
            $scope.isErrorPopupOpen = false;
            helper.HidePopupBox();
        };
        $scope.isErrorPopupOpen = true;
        helper.ShowPopupBox(popupKey, $scope);
		POP_ALERT_BOX_VISIBLE = false;
    }

    /**
     * Makes email address field readonly, if user is updating infomation 
     */
    function makeUneditable() {
        $('#account_email').attr('readonly', true);
        $('#account_confirmemail').attr('readonly', true);
        $scope.customerData.password = "******";
        $scope.customerData.confirmPassword = "******";
        $('#account_password').attr('readonly', true);
        $('#account_confirmpassword').attr('readonly', true);
    }


    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false)<=-1){
            Omniture.Clear();
            if (internetConnected) {
                Omniture.previousPageName = "";
                switch ($scope.trackOmniture) {
                    case "screen1":
                    {
                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                        Omniture.Variables.prop2 = Omniture.pageName;
                        Omniture.Variables.prop3 = Omniture.pageName;
                        Omniture.Variables.eVar54 = "+1";
                        //if(!helper.isUserLoggedIn()){
                        //    Omniture.Variables.events=["event13"];
                        //}
                        Omniture.InvokeOmniture(Omniture.InvokeType.load)
                        break;
                    }
                    case "screen2":
                    {
                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                        Omniture.Variables.prop2 = Omniture.pageName;
                        Omniture.Variables.prop3 = Omniture.pageName;
                        Omniture.Variables.eVar54 = "+1";
                        Omniture.Variables.events = ["event15"];
                        //if(!helper.isUserLoggedIn()){
                        //    Omniture.Variables.events.push("event13");
                        //}
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                        break;
                    }
                    case "accCreated":
                    {
                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                        Omniture.Variables.prop2 = Omniture.pageName;
                        Omniture.Variables.prop3 = Omniture.pageName;
                        Omniture.Variables.eVar54 = "+1";
                        Omniture.Variables.events = ["event17"];
                        //if(!helper.isUserLoggedIn()){
                        //    Omniture.Variables.events.push("event13");
                        //}
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                        break;
                    }
                    // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
//                case "existing customer1":{
//                    Omniture.Variables.prop1=RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
//                    Omniture.Variables.prop2=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile verify1";
//                    Omniture.Variables.prop3=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile verify1";
//                    Omniture.Variables.eVar54="+1";
//                    //if(!helper.isUserLoggedIn()){
//                    //    Omniture.Variables.events.push("event13");
//                    //}
//                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
//                    break;
//                }
//                case "existing customer2":{
//                    Omniture.Variables.prop1=RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
//                    Omniture.Variables.prop2=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile verify2";
//                    Omniture.Variables.prop3=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|profile verify2";
//                    Omniture.Variables.eVar54="+1";
//                    //if(!helper.isUserLoggedIn()){
//                    //    Omniture.Variables.events.push("event13");
//                    //}
//                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
//                    break;
//                }

                    default:
                        break;
                }
            }
            $scope.omnitureReady=[false];
        }
    },true);

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
});