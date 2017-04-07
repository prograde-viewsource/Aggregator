four51.app.factory('PromotionsService', ['$http', function($http) {

    var _getPromotions = function(success, error) {
         $http.get('https://aggregator.prowebservicehost.com/api/AggregatorPromotions').then(function(data){
            success(data);
         }, function(data){
            error(data);
         });
    }

	return {
        getPromotions: _getPromotions
    }

}]);
