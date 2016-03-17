rbi.service('collectionService', function () {
    return {
        getProductIds: function getProductIds(promotion) {
            // extract the product ids and return as an array
            var productId;
            var productIds = [];

            for (var i = 0; i < promotion.products.length; i++) {
                productId = promotion.products[i].value.ProductID
                productIds[i] = productId;
            }

            return productIds;
        }
    }
});
