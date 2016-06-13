/* @ngdoc directive
 * @name  rogersWeb.directive:menuOptions
 * @description Directive to display global menu options.
 * @restrict E
 * @name  rogersWeb.directive:IsNumber
 * @description Directive
 * Allow number only.
 * Invoke while user press the key
 * Here using "keypress" event
 */
rogersWeb.directive('isNumber', function() {
    return {
        restrict: 'A',
        link: function(scope, ele) {
            ele.on('keypress', function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            });
        }
    };
});
rogersWeb.directive('onlyAlphabets', function() {
    return {
        restrict: 'A',
        link: function(scope, ele) {
            ele.on('keypress', function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode === 32))
                    return true;
                else
                    return false;
            });
        }
    };
}); /*Add blank spaces in a string after 4 digits..*/
rogersWeb.directive('addSpace', function() {
    return {
        restrict: 'A',
        link: function(scope, ele) {
            ele.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
        }
    };
});
/*End*/
rogersWeb.directive('accordian', function() {
    var controller = function() {
        var vm = this;

        function init() {
            vm.items = angular.copy(vm.data);
        }
        init();
    };
    var template = '<div class = "panel-group" id = "accordion">' +
        '<div class = "panel panel-default" ng-repeat="x in vm.items">' +
        '<div class = "panel-heading">' +
        '<h4 class = "panel-title">' +
        '<a data-toggle = "collapse" data-parent = "#accordion" href = "/#/#collapseOne{{$index}}">' +
        "{{x.header}}" +
        '</a>' +
        '</h4>' +
        '</div>' +
        '<div id = "collapseOne{{$index}}" class = "panel-collapse collapse">' +
        '<div class = "panel-body">' +
        '{{x.Description}}' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return { //Default for 1.3+
        restrict: 'EA',
        scope: {
            data: '='
        },
        controller: controller,
        controllerAs: 'vm',
        bindToController: true, //required in 1.3+ with controllerAs
        template: template
    };
});