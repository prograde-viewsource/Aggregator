four51.app.factory('PromotionsService', ['$http', function ($http) {

    var _getBuyerPromotions = function (buyerID, success, error) {
        $http.get('https://aggregator.prowebservicehost.com/api/GetBuyerPromotions/' + buyerID).then(function (data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function (data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });
    }

    var _getBuyerPromotion = function (promotionID, success, error) {
        $http.get('https://aggregator.prowebservicehost.com/api/FullPromotion/' + promotionID).then(function (data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function (data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });
    }

    var _putBuyerPromotion = function (id, data, success, error) {
        $http.put('https://aggregator.prowebservicehost.com/api/FullPromotion/' + id, data).then(function (data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function (data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });
    }

    var _postBuyerPromotion = function (data, success, error) {
        $http.post('https://aggregator.prowebservicehost.com/api/FullPromotion/', data).then(function (data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function (data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });
    }

    var _deleteBuyerPromotion = function (promo, success, error) {
        /*$http.delete('https://aggregator.prowebservicehost.com/api/FullPromotion/', promo).then(function (data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function (data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });*/
        $http({
            method: 'DELETE',
            url: 'https://aggregator.prowebservicehost.com/api/FullPromotion/',
            data: promo,
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        })
        .then(function(data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function(data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });
    }

    var _deletePrice = function (price, success, error) {
        /*$http.delete('https://aggregator.prowebservicehost.com/api/FullPromotion/', promo).then(function (data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function (data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });*/
        $http({
            method: 'DELETE',
            url: 'https://aggregator.prowebservicehost.com/api/AggregatorPriceMatrices/' + price.PriceMatrixID,
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        })
        .then(function(data) {
            if (angular.isFunction(success)) {
                success(data);
            }
        }, function(data) {
            if (angular.isFunction(error)) {
                error(data);
            }
        });
    }

    return {
        list: _getBuyerPromotions,
        get: _getBuyerPromotion,
        update: _putBuyerPromotion,
        create: _postBuyerPromotion,
        delete: _deleteBuyerPromotion,
        deletePrice: _deletePrice
    }

}]);
