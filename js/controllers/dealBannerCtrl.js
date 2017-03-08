four51.app.controller('DealBannerCtrl', ['$scope', 'ConfigService',
function ($scope, ConfigService) {
    $scope.endDate = ConfigService.config.finalDate;
    $scope.coordinator = ConfigService.config.coordinator;
    $scope.dateDifference = {};

    setInterval(function() {
        var currentTime = new Date().getTime();

        var distance = $scope.endDate - currentTime;

        $scope.$apply(function() {
            $scope.dateDifference.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            $scope.dateDifference.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            $scope.dateDifference.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            $scope.dateDifference.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        });
    }, 1000);
}]);