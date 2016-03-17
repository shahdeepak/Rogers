'use strict';

rbi.service('productService', function ($http, $q) {

    //RBI.Config.proxyBase = "http://dev.redboxinstant.net";

    // Initialize product service
    var RBIProductService = new RBI.ProductService();
    RBIProductService.init(new RBI.ProductServiceConfig(), new RBI.AngularTransport());

    // Set http transport for Angular
    RBIProductService.setAngularHttp($http);

    // Initialize customer service for add/remove bookmarks
    var RBICustomerService = new RBI.CustomerService();
    RBICustomerService.init(new RBI.CustomerServiceConfig(), new RBI.AngularTransport());

    // Set http transport for Angular
    RBICustomerService.setAngularHttp($http);

    var params = {
        ProductType: productType,
        Availability: undefined,
        Format: undefined,
        Platform: undefined,
        Genre: undefined,
        ContentRating: undefined,
        UserRating: undefined,
        SpecialFilter: undefined,
        PageSize: 24,
        PageNumber: 1,
        SortOrder: 'desc',
        SortField: 'ReleaseDate',
        KioskId: undefined,
        SearchQuery: undefined,
        ViewType: 'All'
    };
    var categories = [];
    var availabilities = [];
    var gameavailabilities = [];
    var formats = [];
    var contentRatings = [];
    var genre = [];
    var userRatings = [];
    var specialFilters = [];

    var productInfo = {
        title: undefined,
        poster: undefined,
        rating: undefined,
        runningTime: undefined,
        mediaFormats: [],
        genres: [],
        actors: [],
        directors: [],
        releaseYear: undefined,
        shortDescription: undefined
    };
    var sorts = [
		{
		    name: "Fan Rating",
		    sortField: "UserRating",
		    sortOrder: "desc"
		
		},
        {
            name: "Relevance",
            sortField: "defaultSort",
            sortOrder: ""
        },
        {
            name: "Release Date",
            sortField: "ReleaseDate",
            sortOrder: "desc"
        },
        
        {
            name: "A - Z",
            sortField: "Title",
            sortOrder: "asc"
        }
    ];
    var productType;
    var titles = [];
    var searchResults = [];

    return {
        LoadFilters: function (clientType, productType, successCallback, errorCallback) {

            categories = [];
            availabilities = [];
            gameavailabilities = [];
            formats = [];
            contentRatings = [];
            var filterRequest = new RBI.FilterRequest(clientType);
            if (productType == undefined || productType == null)
                productType = 'Movie';
            RBIProductService.getFilters(filterRequest,
            //success call back
                function (result) {
                    var filters = (productType == 'Movie' ? result[1] : result[0]);

                    if (filters.getSpecialFilters().length > 0) {
                        for (var i = 0; i < filters.getSpecialFilters().length; i++) {

                            if (filters.getSpecialFilters()[i].IsNavigation == 'true') {

                                categories.push({
                                    id: filters.getSpecialFilters()[i].FilterID,
                                    name: filters.getSpecialFilters()[i].FilterName,
                                    type: productType,
                                    filter: 'specialfilter'
                                });
                            }
                        }
                    }

                    //Adding the All before other genres
                    if (filters.getGenre().length > 0) {
                        for (var i = 0; i < filters.getGenre().length; i++) {

                            if (filters.getGenre()[i].IsNavigation == 'true' && filters.getGenre()[i].FilterName.toLowerCase() === 'all') {

                                categories.push({
                                    id: filters.getGenre()[i].FilterID,
                                    name: filters.getGenre()[i].FilterName,
                                    type: productType,
                                    filter: 'genre'
                                });
                                break;
                            }
                        }
                    }

                    if (filters.getGenre().length > 0) {
                        for (var i = 0; i < filters.getGenre().length; i++) {

                            if (filters.getGenre()[i].IsNavigation == 'true' && filters.getGenre()[i].FilterName.toLowerCase() !== 'all') {

                                categories.push({
                                    id: filters.getGenre()[i].FilterID,
                                    name: filters.getGenre()[i].FilterName,
                                    type: productType,
                                    filter: 'genre'
                                });
                            }
                        }
                    }

                    if (filters.getAvailability().length > 0) {
                        for (var i = 0; i < filters.getAvailability().length; i++) {
                            availabilities.push({
                                id: filters.getAvailability()[i].FilterID,
                                name: filters.getAvailability()[i].FilterName,
                                isSelected: filters.getAvailability()[i].IsHome
                            });
                        }
                    }
                    var gamefilters = (productType == 'Game' ? result[1] : result[0]);
                    if (gamefilters.getAvailability().length > 0) {
                        for (var i = 0; i < gamefilters.getAvailability().length; i++) {
                            gameavailabilities.push({
                                id: gamefilters.getAvailability()[i].FilterID,
                                name: gamefilters.getAvailability()[i].FilterName,
                                isSelected: gamefilters.getAvailability()[i].IsHome
                            });
                        }
                    }

                    if (filters.getContentRating().length > 0) {
                        for (var i = 0; i < filters.getContentRating().length; i++) {
                            if(filters.getContentRating()[i].FilterName !== "NC-17")
                            {
                                contentRatings.push({
                                    id: filters.getContentRating()[i].FilterID,
                                    name: filters.getContentRating()[i].FilterName,
                                    isSelected: filters.getContentRating()[i].IsHome
                                });
                            }
                        }
                    }

                    if (filters.getFormat().length > 0) {
                        for (var i = 0; i < filters.getFormat().length; i++) {

                                formats.push({
                                    id: filters.getFormat()[i].FilterID,
                                    name: filters.getFormat()[i].FilterName,
                                    isSelected: filters.getFormat()[i].IsHome
                                });

                        }
                    }

                    successCallback();
                },
            //error call back
                function (result) {
                    errorCallback();
                });
        },
        Categories: function () {
            return categories;
        },
        Availabilities: function () {
            return availabilities;
        },
        Gameavailabilities: function () {
            return gameavailabilities;
        },
        Formats: function () {
            return formats;
        },
        ContentRatings: function () {
            return contentRatings;
        },
        Sorts: function () {
            return sorts;
        },
        productSearch: function (search_term, filter, pageNum, successCallback, errorCallback) {
            var sr = new RBI.SearchRequest();
            sr.setSearchTerm(search_term);
            sr.setProductType(null);
            sr.setSpecialFilter(null);
            sr.setPageSize(24);
            sr.setPageNumber(pageNum);
            sr.setSortField("relevance");
            sr.setSortOrder('desc');
            sr.setAvailability(filter);
            sr.setGenre(null);
            sr.setContentRating(null);
            sr.setFormat("");
            sr.setIncludeComingSoon("false");//added for resolving Issue ZOE-24330
			sr.addParam("_", new Date().getTime());//ZOE-34659


            RBIProductService.productSearch(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },
        productSearchWithLimitedTitle: function (search_term, filter, pageNum, pageSize, productType, successCallback, errorCallback) {
            var sr = new RBI.SearchRequest();
            //sr.setSearchTerm(search_term);
            sr.setProductType(productType);
            sr.setSpecialFilter(null);
            sr.setPageSize(pageSize);
            sr.setPageNumber(pageNum);
            sr.setSortField("relevance");
            sr.setSortOrder('desc');
            sr.setAvailability(filter);
            sr.setGenre(null);
            sr.setContentRating(null);
            sr.setFormat("");



            RBIProductService.productSearch(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },
        
        getTopInTitles: function (params, $scope, successCallback, errorCallback) {

            var sr = new RBI.RecommendedProductsBySearchCriteriaRequest();
			sr.params.KioskID = undefined;
			sr.params.SpecialFilter = undefined;

            // For Search with no results from products search...
            sr.setSearchQuery("");
            //Page Number
            sr.setPageNumber(params.PageNumber);
            //Number of titles
            sr.setNumberOfResults(config.numberOfPostersInTopInGenres);

            //SortOrder
            if (isDefined($scope.currentSortOrder)) {
                sr.setSortOrder($scope.currentSortOrder)
            }
            //Sort Field
            if (isDefined($scope.sortField)) {
                sr.setSortField($scope.sortField)
            }
            //Genre
            if (isDefined($scope.currentGenreID)) {
                sr.setGenre($scope.currentGenreID)
            }
            //Special Filter
            if (isDefined($scope.currentSpecialID)) {
                sr.setSpecialFilter($scope.currentSpecialID)
            }
            //Availability
            if (isDefined($scope.currentAvailabilityID)) {
                sr.setAvailability($scope.currentAvailabilityID)
            }
            //KioskID
            if (isDefined($scope.KioskId)) {                
                sr.setKioskID($scope.KioskId);
            }
            //ContentRating
            if (isDefined($scope.currentContentRatingID)) {
                sr.setContentRating($scope.currentContentRatingID)
            }
            //Format
            if (isDefined($scope.currentFormatID)) {
                sr.setFormat($scope.currentFormatID);
            }

            if(!helper.isUserLoggedIn())
            {
                RBIProductService.getRecommendedProductsBySearchCriteria(sr, function (data) {
                    successCallback(data);
                }, function (data) {
                    errorCallback(data);
                });
            }
            else
            {
                RBIProductService.getRecommendedProductsBySearchCriteriaForCustomer(sr, function (data) {
                    successCallback(data);
                }, function (data) {
                    errorCallback(data);
                });
            }
        },

        GetTitles: function (params, $scope, successCallback, errorCallback) {

            var sr = new RBI.SearchRequest();
            sr.setPageSize(params.PageSize);
            sr.setPageNumber(params.PageNumber);
            sr.setSearchTerm(params.SearchQuery);
            sr.setProductType(params.ProductType);
            sr.setIncludeComingSoon("false");//added for resolving Issue ZOE-24330
            if (isDefined($scope.KioskId)) {
                sr.setKioskID($scope.KioskId);
            }
            //Sort Field
            if (isDefined($scope.sortField)) {
                sr.setSortField($scope.sortField)
            }
            //Availability
            if (isDefined($scope.currentAvailabilityID)) {
                sr.setAvailability($scope.currentAvailabilityID)
            }

            //Genre
            if (isDefined($scope.currentGenreID)) {
                sr.setGenre($scope.currentGenreID)
            }
            //Special Filter
            if (isDefined($scope.currentSpecialID)) {
                sr.setSpecialFilter($scope.currentSpecialID)
            }
            //ContentRating
            if (isDefined($scope.currentContentRatingID)) {
                sr.setContentRating($scope.currentContentRatingID)
            }
            //SortOrder
            if (isDefined($scope.currentSortOrder)) {
                sr.setSortOrder($scope.currentSortOrder)
            }
            if (params.ProductType == "Movie") { // request object for the movies
                //Format
                if (isDefined($scope.currentFormatID)) {
                    sr.setFormat($scope.currentFormatID)
                }
                //UserRating
                if (isDefined($scope.currentUserRatingID)) {
                    sr.setUserRating($scope.currentUserRatingID)
                }
            }
            else { // request object for the games

                //Platform
                if (isDefined($scope.currentFormatID)) {
                    sr.setPlatform($scope.currentFormatID);
                }
                sr.setFormat("");
            }

            if (!helper.isUserLoggedIn()) {
                RBIProductService.productSearch(sr, function (data) {
                    successCallback(data);
                }, function (data) {
                    errorCallback(data);
                });
            } else {
                RBIProductService.productSearchSecure(sr, function (data) {
                    successCallback(data);
                }, function (data) {
                    errorCallback(data);
                });
            }
        },
		GetTitlesForSpecialFilters: function (params, $scope, successCallback, errorCallback) {

			var sr = new RBI.SearchRequest();
			sr.setPageSize(params.PageSize);
			sr.setPageNumber(params.PageNumber);
			sr.setSearchTerm(params.SearchQuery);
			sr.setProductType(params.ProductType);
			sr.setIncludeComingSoon("false"); //added for resolving Issue ZOE-24330
            sr.setUseDigitalSmith(true);
            sr.setTotalSuggestions(config.numberOfSuggestions);


            if (isDefined($scope.KioskId)) {
				sr.setKioskID($scope.KioskId);
			}
			//Sort Field
			if (isDefined($scope.sortField)) {
				sr.setSortField($scope.sortField)
			}
			//SortOrder
			if (isDefined($scope.currentSortOrder)) {
				sr.setSortOrder($scope.currentSortOrder)
			}
			//Availability
			if (isDefined($scope.currentAvailabilityID)) {
				sr.setAvailability($scope.currentAvailabilityID)
			}

			//Genre
			if (isDefined($scope.currentGenreID)) {
				sr.setGenre($scope.currentGenreID)
			}
			//Special Filter
			if (isDefined($scope.currentSpecialID)) {
				sr.setSpecialFilter($scope.currentSpecialID);
			}
			//ContentRating
			if (isDefined($scope.currentContentRatingID)) {
				sr.setContentRating($scope.currentContentRatingID)
			}

			if (params.ProductType == "Movie") { // request object for the movies
				//Format
				if (isDefined($scope.currentFormatID)) {
					sr.setFormat($scope.currentFormatID)
				}
				//UserRating
				if (isDefined($scope.currentUserRatingID)) {
					sr.setUserRating($scope.currentUserRatingID)
				}
			}
			else { // request object for the games

				//Platform
				if (isDefined($scope.currentFormatID)) {
					sr.setPlatform($scope.currentFormatID);
				}
				sr.setFormat("");
			}
			if (!helper.isUserLoggedIn()) {
				RBIProductService.productSearch(sr, function (data) {
					successCallback(data);
				}, function (data) {
					errorCallback(data);
				});
			} else { 
				RBIProductService.productSearchSecure(sr, function (data) {
					successCallback(data);
				}, function (data) {
					errorCallback(data);
				});
			}
		},
              GetRecommendedProductsBySearchCriteria: function (params, $scope, successCallback, errorCallback) {

              	var sr = new RBI.RecommendedProductsBySearchCriteriaRequest();
				sr.params.Genre = undefined;
				sr.params.KioskID = undefined;
              	//Number of titles
              	sr.setNumberOfResults(params.PageSize);
              	sr.setPageNumber(params.PageNumber);
              	//Genre
              	if (isDefined($scope.currentGenreID)) {
              		sr.setGenre($scope.currentGenreID)
              	}
              	//Special Filter
              	if (isDefined($scope.currentSpecialID) && $scope.currentSpecialID != "") {
              		sr.setSpecialFilter($scope.currentSpecialID)
              	}
                else sr.setSpecialFilter("");
              	//Availability
              	if (isDefined($scope.currentAvailabilityID)) {
              		sr.setAvailability($scope.currentAvailabilityID)
              	}
              	//KioskID
              	if (isDefined($scope.KioskId)) {
              		sr.setKioskID($scope.KioskId);
              	}
              	//ContentRating
              	if (isDefined($scope.currentContentRatingID)) {
              		sr.setContentRating($scope.currentContentRatingID)
              	}
              	//Format
              	if (isDefined($scope.currentFormatID)) {
              		sr.setFormat($scope.currentFormatID);
              	}

              	RBIProductService.getRecommendedProductsBySearchCriteria(sr, function (data) {
              		successCallback(data);
              	}, function (data) {
              		errorCallback(data);
              	});

              },
        GetTitlesByPageNumber: function (params, $scope, successCallback, errorCallback) {

            var sr = new RBI.SearchRequest();
            sr.setPageSize(params.PageSize);
            sr.setPageNumber(params.PageNumber);
            sr.setSearchTerm(params.SearchQuery);
            sr.setProductType(params.ProductType);
            sr.setIncludeComingSoon("false");//added for resolving Issue ZOE-24330

            if (isDefined($scope.KioskId)) {               
                sr.setKioskID($scope.KioskId);
            }
            //Availability
            if (isDefined($scope.currentAvailabilityID)) {
                sr.setAvailability($scope.currentAvailabilityID)
            }
            //Sort Field
            if (isDefined($scope.sortField)) {
                sr.setSortField($scope.sortField)
            }
            //Genre
            if (isDefined($scope.currentGenreID)) {
                sr.setGenre($scope.currentGenreID)
            }
            //Special Filter
            if (isDefined($scope.currentSpecialID)) {
                sr.setSpecialFilter($scope.currentSpecialID);
                sr.setUseDigitalSmith(true);
                sr.setTotalSuggestions(config.numberOfSuggestions);
            }
            //ContentRating
            if (isDefined($scope.currentContentRatingID)) {
                sr.setContentRating($scope.currentContentRatingID)
            }
            //SortOrder
            if (isDefined($scope.currentSortOrder)) {
                sr.setSortOrder($scope.currentSortOrder)
            }
            if (params.ProductType == "Movie") { // request object for the movies
                //Format
                if (isDefined($scope.currentFormatID)) {
                    sr.setFormat($scope.currentFormatID)
                }
                //UserRating
                if (isDefined($scope.currentUserRatingID)) {
                    sr.setUserRating($scope.currentUserRatingID)
                }
            }
            else { // request object for the games

                //Platform
                if (isDefined($scope.currentFormatID)) {
                    sr.setPlatform($scope.currentFormatID)
                }
                sr.setFormat("");
            }


            if (helper.isUserLoggedIn().toString() == "false") {
                RBIProductService.productSearch(sr, function (data) {
                    successCallback(data);
                }, function (data) {
                    errorCallback(data);
                });
            } else {
                RBIProductService.productSearchSecure(sr, function (data) {
                    successCallback(data);
                }, function (data) {
                    errorCallback(data);
                });
            }
        },

        GetProductDetailByProductID: function (params, successCallback, errorCallback) {

            var sr = new RBI.ProductDetailsRequest();
            sr.setProductID(params.productId);
            //This is to send kioskId to server to get InStock flag in response for media formats.
            if(isDefined(params.kioskId)){
                 sr.setKioskID(params.kioskId);
            }
            //This is to send QueryID as request parameter if this api called from recommendations.
			if(isDefined(params.queryId)){
                 sr.setQueryID(params.queryId);
            }
            //sr.addParam("_", (new Date()).getTime());
            /**
             * set image type is null because of the poster type get only poster 
             * images so thst's why in kiosk confirm checkout images not get 
             * In this case all image come but when we set poster type so in that case Thumb nail images not coming
             */
            sr.setImageTypes("");
            sr.setSecure(helper.isUserLoggedIn());  // set secure flag

            RBIProductService.getProductDetails(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },

        getRecommendedProducts: function (params, successCallback, errorCallback) {
            var sr = new RBI.RecommendedProductRequest();
            sr.setProductID(params.productId);
            if (params.kioskId != '') {
                sr.setKioskID(params.kioskId) ;
            }
            else{
                sr.setKioskID("");  // resetting the KioskId ZOE-36617
            }
            sr.setSecure(helper.isUserLoggedIn());

            RBIProductService.getRecommendedProducts(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },

        AddBookmark: function (productID, successCallback, errorCallback) {
            var request = new RBI.AddBookmarkRequest();
            request.setProductID(productID);
            RBICustomerService.addBookmark(request, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },

        RemoveBookmark: function (productID, successCallback, errorCallback) {
            var request = new RBI.RemoveBookmarkRequest();
            request.setProductID(productID);
            RBICustomerService.removeBookmark(request, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        }
    }

});

