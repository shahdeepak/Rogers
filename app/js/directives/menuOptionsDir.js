/**
 * Created by Deepak.Shah on 17-03-2016.
 */
/**
 * @ngdoc directive
 * @name  rogersWeb.directive:menuOptions
 * @description Directive to display global menu options.
 * @restrict E
 */
rogersWeb.directive('menuOptions', function($location) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/menuOptions.html',
        link: function(scope, elem) {
            // Remove active menu class from menu if any
            $(".menu-item").removeClass("menu-item_active");
            scope.$watch(function() {
                return $location.path();
            }, function(newValue, old) {
                helper.debugLog(old);
                $(elem).find("li > span[id^='sub']").removeClass('sub-item_active');
                $(elem).find("li > span[id^='prev']").removeClass('sub-item_active');
                scope.prevUrl = newValue;
                scope.urlBuild(newValue);
            });
            var iScrollPos = 0;
            $(window).scroll(function() {
                var iCurScrollPos = $(this).scrollTop();
                var direction = (iCurScrollPos > iScrollPos) ? 'down' : 'up';
                iScrollPos = iCurScrollPos;
                if (direction === 'up' || iScrollPos === 0) {
                    $(".headerNav-outer").slideDown(100);
                    $(".channel_sub-menu-list").css({
                        'top': '60px'
                    });
                } else {
                    $(".headerNav-outer").slideUp(100);
                    $(".channel_sub-menu-list").css({
                        'top': '0px'
                    });
                }
            });
        },
        controller: 'menuOptionsCtrl'
    };
});