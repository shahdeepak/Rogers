'use strict';
rbi.service("ratingReviewService", function ($http, $q) {

    var RBIReviewRatingService = new RBI.ReviewRatingService();
    RBIReviewRatingService.init(new RBI.ReviewRatingServiceConfig(), new RBI.AngularTransport());
    RBIReviewRatingService.setAngularHttp($http);

    return {
        RateProduct: function (params, successCallback, errorCallback) {
            var request = new RBI.RateProductRequest();
            request.setRating(params.rating);
            request.setAltCode(params.altCode);
            request.setProductID(params.productID);
            request.setProductTitle(params.productTitle);
            request.setProductUrl(params.productUrl);
            RBIReviewRatingService.rateProduct(request, successCallback, errorCallback);
        },

        GetProductRating: function (params, successCallback, errorCallback) {

            var sr = new RBI.GetProductRatingsRequest();
            sr.setAltCode(params.altCode);
            sr.setProductID(params.productID);
            delete sr.params._;
            if(helper.isUserLoggedIn() == false)
            {
                sr.addParam("_", (new Date()).getTime());
            }
            RBIReviewRatingService.getProductRatings(sr, function (data) {
             // success callback
                    successCallback(data);
                },
                function (data) {
                    // error callback
                    errorCallback(data);
            }, helper.isUserLoggedIn());
        } ,
        getProductReviews: function (params, successCallback, errorCallback) {
            var sr = new RBI.GetProductReviewsRequest();
            sr.setAltcode(params.altCode);
            sr.setProductID(params.productID);
            sr.setPageNumber(params.pageNumber);
            sr.setPageSize(params.pageSize);
            delete sr.params._;
            if(helper.isUserLoggedIn() == false)
            {
                sr.addParam("_", (new Date()).getTime());
            }
            RBIReviewRatingService.getProductReviews(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            }, helper.isUserLoggedIn());

        }
    };
});

