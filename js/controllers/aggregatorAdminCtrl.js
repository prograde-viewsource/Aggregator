four51.app.controller('AggregatorAdminCtrl', ['$scope', '$http', '$location', 'PromotionsService', function ($scope, $http, $location, PromotionsService) {
    var foundit = false;
    angular.forEach($scope.user.Groups, function(g){
        if (g.Name == 'PROGRADE-ADMIN-PERM') 
            foundit = true;
    });
    if (!foundit) $location.path('catalog');

    PromotionsService.getPromotions(function(p){
        $scope.promotions = p;
    }, function(e){
        console.log(e);
    });
}]);