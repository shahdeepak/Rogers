/*Created by Kumar Ankur & Hemant Motwani on 14-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:homeCtrl
 * @requires $scope
 * @requires $location
 * @requires homeService
 * @description Controller for home landing screen.
 */
rogers.controller('homeCtrl', function($scope, $rootScope, $location, $http, homeService, displayService, registrationService, profileService, $translate, localize) {
    var regUser;
    $rootScope.totalCost = 0;
    $scope.flag = false;
    $scope.lang = "FRENCH";
    $scope.cardFlag = false;
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to get current location of the user.
     */
    $scope.getLocation = function(){
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(onPositionUpdate)
        function onPositionUpdate(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
    $http.get(url)
        .then(function(result) {
            var address = result.data.results[2].formatted_address;
            $scope.address = address;
        });
        }
    }
    $scope.getLocation();
    
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to show/hide login & logout button.
     */
    $scope.checkLoggedUser = function() {
        var loggedUser = sessionStorage.getItem('loggedInUser');
        if (loggedUser === null) {
            $rootScope.hideButton = false;
            $rootScope.isLoggedIn = false;
        } else {
            $rootScope.isLoggedIn = true;
            $rootScope.hideButton = true;
        }
    }
    $scope.checkLoggedUser();
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#submitAdd
     * @methodOf rogers.controllers:homeCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(newUser) details into MongoDB & local storage.
     */
    $scope.submitAdd = function(newUser) {
        regUser = newUser;
        homeService.getLoginDetails(newUser.email, function(result) {
            if (result) {
                sessionStorage.setItem('loggedInUser', newUser.email);
                homeService.saveAddDetails(newUser, success, error);
            } else {
                console.log('User does not exist!!!Please sign up');
            }
        }, function() {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#toggleLanguage
     * @methodOf rogers.controllers:homeCtrl
     * @description function to toggle language from English to French and vice-versa.
     */
    $scope.toggleLanguage = function() {
        if ($translate.use() === "en") {
            $scope.lang = "ENGLISH";
            $translate.use("fr");
            localize.setLanguage("fr");
        } else {
            $scope.lang = "FRENCH";
            $translate.use("en");
            localize.setLanguage("en");
        }
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#success
     * @methodOf rogers.controllers:homeCtrl
     * @description callback function:Success
     */
    function success() {
        sessionStorage.setItem('loggedInUser', regUser.email);
        $location.path('/home');
        return;
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#error
     * @methodOf rogers.controllers:homeCtrl
     * @description callback function:Error
     */
    function error() {};
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#emit
     * @methodOf rogers.controllers:homeCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description send message to other controller communication between controller This function is a sender function*/
    $scope.$emit("showHide", {
        "condition": false
    });
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#login
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to transfer control to login view
     */
    $scope.login = function() {
        $location.path('/login');
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#signup
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to transfer control to registration view
     */
    $scope.signup = function() {
        $location.path('/registration');
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#logout
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to logout user and remove email from session storage.Also redirect to home page.
     */
    $scope.logout = function() {
        sessionStorage.removeItem('loggedInUser');
        $scope.checkLoggedUser();
        $location.path('/home');
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#updateAddPage
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to redirect to updateHobby page.
     */
    $scope.updateAddPage = function() {
        $location.path('/updateHobby');
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#deleteHobby
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to delete hobby from website.
     */
    $scope.deleteHobby = function(hobby) {
        var data = {
            id: (sessionStorage.getItem("loggedInUser")) + hobby
        };
        profileService.removeUserDetails(data, function(result) {
            if (result) {} else {}
        }, function(result) {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#UserHobbyList
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to get user hobby list.
     */
    $scope.UserHobbyList = function() {
        var loggedEmail = sessionStorage.getItem('loggedInUser');
        homeService.getUserHobbyDetails(loggedEmail, function(result) {
            if (result.data && result.data.length > 0) {
                $rootScope.UserData = result.data;
                $location.path('/profile');
            } else {
                console.log("no data found");
                $rootScope.errorMessage = "Sorry you have submitted no add.";
            }
        }, function() {});
    };
    
     $scope.getChat = function() {
        var loggedEmail = sessionStorage.getItem('loggedInUser');
        homeService.getChat(loggedEmail, function(result) {
            var path='/chat/'+result.data[0].chat;
            $location.path(path);
         console.log("success");   
        }, function() {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#searchHobby
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to transfer control to display controller
     */
    $scope.searchHobby = function(hobbyName) {
        $rootScope.hobbyName = hobbyName;
        $location.path('/display');
        $rootScope.searchHobby();
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#searchHobby
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to search hobby from the list.
     */
    $rootScope.searchHobby = function() {
        $rootScope.searchData = [];
        $rootScope.message = [];
        homeService.gethobbyDetails($rootScope.hobbyName, function(result) {
            if (result.data && result.data.length > 0) {
                $rootScope.searchData = result.data;
            } else {
                $rootScope.message = "NO result found";
            }
        }, function() {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#searchHistory
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to get user History detail from database
     */
    $rootScope.searchHistory = function() {
        $rootScope.searchHistoryData = [];
        homeService.getHistoryDetails(sessionStorage.getItem("loggedInUser"), function(result) {
            if (result.data && result.data.length > 0) {
                $rootScope.searchHistoryData = result.data;
                $location.path('/history');
            } else {}
        }, function() {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#displayCart
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to display items in the cart
     */
    $rootScope.displayCart = function() {
        var email = sessionStorage.getItem("loggedInUser");
        displayService.getCartDetails(email, function(loginData) {
            if (loginData.data && loginData.data.length > 0) {
                $rootScope.cartData = loginData.data;
                $rootScope.amount = $scope.totalPay();
                $location.path('/displayCart');
            } else {
                $rootScope.message = "NO result found";
            }
        }, function() {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#totalPay
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to add items price in the cart.
     */
    $scope.totalPay = function() {
        var amount = 0;
        angular.forEach($rootScope.cartData, function(item) {
            amount += item.totalBuy.charge;
        });
        return amount;
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:registerCtrl#register
     * @methodOf rogers.controllers:registerCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(new user) details into data base.
     */
    $scope.register = function(newUser) {
        var email = sessionStorage.getItem('loggedInUser');
        registrationService.getLoginDetails(email, function(result) {
            if (result) {
                $scope.userDetails = result;
            } else {}
        }, function(result) {});
    };
    $scope.register();
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to add spinner during payment confirmation.
     */
    $scope.$on("spinner", function(event, arg) {
        $scope.flag = arg.flag;
    });
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl
     * @methodOf rogers.controllers:homeCtrl
     * @description Function of the card details.
     */
    $scope.$on("cardDetail", function(event, arg) {
        $scope.cardFlag = arg.flag;
    });
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#update
     * @methodOf rogers.controllers:homeCtrl
     * @description update data of user.
     */
    $scope.update = function(userDetails) {
        registrationService.setUserDetails(userDetails, function(result) {
            if (result) {
                $scope.userDetails = result;
                $scope.message = "Your data has been saved successfully!";
            } else {
                $scope.message = "Oops! Please try again later!";
            }
        }, function(result) {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#register
     * @methodOf rogers.controllers:homeCtrl
     * @description Function used to edit data of login user.
     */
    $scope.editable = function() {
        $scope.condition = false;
    };
    //Function to put category JSON in topic.
    $http.get('json/category.json').success(function(data) {
        $scope.topic = data;
    });
    //Function to put profile JSON in mainmenu.
    $http.get("json/profile.json").success(function(result) {
        $scope.mainmenu = result;
    });
    /**
     * @ngdoc method
     * @name rogers.controllers:homeCtrl#hoverIn
     * @methodOf rogers.controllers:homeCtrl
     * @description Function to show subItem in the profile list.
     */
    $scope.id;
    $scope.hoverIn = function(ind) {
        $scope.id = ind;
        $scope.subMenuItems = $scope.mainmenu[ind].subMenuItems;
    };
    });