var disableHttpSpinner = false;
var httpRequestInProgress = false;

angular.module('sharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
        	httpRequestInProgress = true;
        	if(disableHttpSpinner == false){
                showSplashOnTop = showSplashOnTop == true ? helper.hideSpinner(): helper.showSpinner (config.SPINNER_FADEOUT_MS, config.spinnerPosition);
            }
        	return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $injector, $window, $location) {
        var $http, error;
        return function (promise) {
            //helper.showSpinner();
            return promise.then(function (response) {
                $http = $http || $injector.get('$http');

                if ($http.pendingRequests.length < 1) {
                    if (disableHttpSpinner == false) {
                        helper.hideSpinner();
                    }
                    httpRequestInProgress = false;
                }
            	return response;

            }, function (response,scope) {
                $http = $http || $injector.get('$http');
                if ($http.pendingRequests.length < 1) {
                    if (disableHttpSpinner == false) {
                        helper.hideSpinner();
                    }
                    httpRequestInProgress = false;
                }

                // Response status 0 indicates timeout
                if (response.status == 0) {
                    // disable the spinner here
                    helper.hideSpinner();
                    internetConnected = false;
                    httpRequestInProgress = false;
                    helper.debugLog("Shared service ajax call timeout.");
                    var errorObj = {
                        ResultInfo: { ResultCode: '101' }
                    };
                    helper.showErrorMessage(errorObj);
                }
                return $q.reject(response);
            });
        };
    });
