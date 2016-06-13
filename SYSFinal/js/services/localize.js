angular.module('localization', [])
    // localization service responsible for retrieving resource files from the server and
    // managing the translation dictionary
    .factory('localize', ['$http', '$rootScope', 'backendFactory', '$filter', function($http, $rootScope, backendFactory, $filter) {
        'use strict';
        var localize = {
            language: '',
            // array to hold the localized resource string entries
            dictionary: [],
            // location of the resource file
            url: undefined,
            // flag to indicate if the service hs loaded the resource file
            resourceFileLoaded: false,
            // success handler for all server communication
            successCallback: function(data) {
                // store the returned array in the dictionary
                localize.dictionary = data;
                // set the flag that the resource are loaded
                localize.resourceFileLoaded = true;
                // broadcast that the file has been loaded
                $rootScope.$broadcast('localizeResourcesUpdated');
            },
            // allows setting of language on the fly
            setLanguage: function(value) {
                localize.language = value;
                localize.initLocalizedResources(value);
            },
            // loads the language resource file from the server
            initLocalizedResources: function(lang) {
                var urlRoot = FR_JSON_PATH;
                if (lang === 'en') {
                    urlRoot = EN_JSON_PATH;
                }
                var promise = backendFactory.getHttpCall(urlRoot).then(function(obj) {
                    localize.successCallback(obj.data);
                }, function(obj) {})
            },
            // checks the dictionary for a localized resource string
            getLocalizedString: function(value) {
                // default the result to an empty string
                var result = '';
                // make sure the dictionary has valid data
                if ((localize.dictionary !== []) && (localize.dictionary.length > 0)) {
                    // use the filter service to only return those entries which match the value
                    // and only take the first result
                    var entry = $filter('filter')(localize.dictionary, function(element) {
                        return element.key === value;
                    })[0];
                    // set the result
                    result = (entry !== undefined) ? entry.value : value;
                }
                // return the value to the call
                return result;
            }
        };
        // force the load of the resource file
        localize.initLocalizedResources(LANG_ENG);
        // return the local instance when called
        return localize;
    }])
    // simple translation filter
        .filter('translate', ['localize', function(localize) {
        var filter = function(input) {
            return localize.getLocalizedString(input);
        };
        filter.$stateful = true;
        return filter;
    }]);