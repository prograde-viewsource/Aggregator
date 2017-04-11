four51.app.factory('PromotionsService', ['$http', function($http) {

    var _getBuyerPromotions = function(buyerID, success, error) {
         $http.get('https://aggregator.prowebservicehost.com/api/GetBuyerPromotions/' + buyerID).then(function(data){
            success(data);
         }, function(data){
            error(data);
         });
    }

	return {
        getBuyerPromotions: _getBuyerPromotions
    }

}]);
