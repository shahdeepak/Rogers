/**
 * Created by Deepak shah on 21-03-2016.
 */
/*jslint plusplus: true */
(function(window) {
    "use strict";

    function Product(pro) {
        this.id = pro.id;
        this.age = pro.age;
        this.imageUrl = pro.imageUrl;
        this.name = pro.name;
        this.snippet = pro.snippet;
    }
    /**
     * @constructor
     */
    function ProductList() {
        // utility methods for recommendation list
        this.product = [];
        this.key = 'PRODUCTS';
        this.cachable = true;
        this.cacheExpireTime = 600000;
        this.startTime = new Date().getTime();
        this.isDirty = false;
    }
    ProductList.prototype = Object.create(Array.prototype);
    /**
     * Set list of all recommendations into recommendationList object
     * @param data
     */
    ProductList.prototype.setProducts = function(data) {
        var i;
        for (i = 0; i < data.length; i++) {
            var jsonData;
            try {
                jsonData = new APP.Models.Product(data[i]);
            } catch (e) {
                
            }
            this.product.push(jsonData);
        }
    };
    ProductList.prototype.getProduct = function() {
        return this.product;
    };
    window.APP || (window.APP = {});
    window.APP.Models || (window.APP.Models = {});
    window.APP.Models.Product = Product;
    window.APP.Models.ProductList = ProductList;
}(window));