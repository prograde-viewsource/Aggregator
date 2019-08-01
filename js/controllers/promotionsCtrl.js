four51.app.controller('PromotionsCtrl', ['$scope', '$location', 'PromotionsService', '$modal', function ($scope, $location, PromotionsService, $modal) {
    var foundit = false;
    angular.forEach($scope.user.Groups, function (g) {
        if (g.Name == 'PROGRADE-ADMIN-PERM')
            foundit = true;
    });
    if (!foundit) $location.path('catalog');

    PromotionsService.list($scope.user.Company.Name, function (p) {
        $scope.promotions = p.data;
    }, function (e) {
        console.log(e);
    });

    $scope.viewPromo = function (promo) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'viewPromo.html',
            controller: 'ViewPromoCtrl',
            resolve: {
                Promo: function () {
                    return promo;
                }
            }
        }).result.then(function (result) {
            angular.noop();
        });
    };

    $scope.deletePromo = function (promo) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deletePromo.html',
            controller: 'ViewPromoCtrl',
            resolve: {
                Promo: function () {
                    return promo;
                }
            }
        }).result.then(function (result) {
            PromotionsService.delete(promo, function () {
                $location.refresh();
            });
        });
    };

    $scope.renderDate = function (dateString) {
        var date = new Date(dateString);
        return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    };
}]);

four51.app.controller('ViewPromoCtrl', ['$scope', 'Promo', '$modalInstance',
    function ($scope, Promo, $modalInstance) {
        $scope.promo = Promo;

        $scope.close = function () {
            $modalInstance.close();
        };
        $scope.dismiss = function () {
            $modalInstance.dismiss();
        };
    }]);