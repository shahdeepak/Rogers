rogers.controller('viewCtrl', function($scope) {
    $scope.pushData = function(user) {
        var x = {
            "name": user.name,
            "hobby": user.hobby,
            "mobile": user.number,
            "email": user.email,
            "charge": user.charge,
            "time": user.time,
            "photo": user.photo
        }
        data.items.push(x);
    };
});