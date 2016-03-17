rbi.directive('pwpopup', function () {
    return {
        restrict: 'A',
        templateUrl: 'views/pwpopup.html'
    }
 });
rbi.directive('focusMe', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
    elem.focus();
        }
    }
 });