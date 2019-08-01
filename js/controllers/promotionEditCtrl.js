four51.app.controller('PromotionEditCtrl', ['$scope', '$http', '$location', 'PromotionsService', 'Product', 'Category', '$q', '$routeParams', function ($scope, $http, $location, PromotionsService, Product, Category, $q, $routeParams) {
    var foundit = false;
    angular.forEach($scope.user.Groups, function (g) {
        if (g.Name == 'PROGRADE-ADMIN-PERM')
            foundit = true;
    });
    if (!foundit) $location.path('catalog');

    $scope.exists = $routeParams.id && $routeParams.id !== 'new';

    if ($scope.exists) {
        $scope.promoLoadingIndicator = true;
        PromotionsService.get($routeParams.id, function (p) {
            $scope.promo = p.data;
            $scope.promoLoadingIndicator = false;
        }, function (e) {
            console.log(e);
            $scope.promoLoadingIndicator = false;
            $scope.promo = {
                "BuyerID": $scope.user.Company.Name,
                "NumberOfOrders": null,
                "ProductInterop": null,
                "StartDate": null,
                "FinalDate": null,
                "Coordinator": null,
                "IsActive": true,
                "TotalOrdered": null,
                "PriceMatrix": [
                ],
                "CurrentPrice": null
            };
            $scope.exists = false;
            $scope.errors = ["That promotion doesn't exist."]
        });
    }
    else {
        $scope.promo = {
            "BuyerID": $scope.user.Company.Name,
            "NumberOfOrders": null,
            "ProductInterop": null,
            "StartDate": null,
            "FinalDate": null,
            "Coordinator": null,
            "IsActive": true,
            "TotalOrdered": null,
            "PriceMatrix": [
            ],
            "CurrentPrice": null
        };
    }

    $scope.newPrice = {};

    $scope.movePriceUp = function (index) {
        arrayMove($scope.promo.PriceMatrix, index, index - 1);
        updateOrder();
    };

    $scope.movePriceDown = function (index) {
        arrayMove($scope.promo.PriceMatrix, index, index + 1);
        updateOrder();
    };

    $scope.deletePrice = function (index) {
        if ($scope.exists) {
            if (confirm('Are you sure you want to delete the ' + $scope.promo.PriceMatrix[index].Quantity + ' quantity with $' + $scope.promo.PriceMatrix[index].Price + ' price' )) {
                PromotionsService.deletePrice($scope.promo.PriceMatrix[index]);
            }
        }
        $scope.promo.PriceMatrix.splice(index, 1);
    };

    $scope.addPrice = function () {
        if ($scope.newPrice.Quantity && $scope.newPrice.Price) {
            $scope.promo.PriceMatrix.push($scope.newPrice);
            $scope.newPrice = {};
        }
    };

    function arrayMove(arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            var k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    }

    $scope.settings = {
        currentPage: 1,
        pageSize: 100
    };

    // Retrieve all products

    $scope.cancelProductLoad = function(){
        $scope.productLoadingIndicator = false;
    };

    $scope.retrieveAllItems = function () {
        $scope.productLoadingIndicator = true;
        var getAll = [];
        $scope.products = [];
        $scope.productListAsObject = {};
        Category.tree(function (data) {
            $scope.catInterops = [];
            angular.forEach(data, function (cat) {
                $scope.catInterops.push(cat.InteropID);
                if (cat.SubCategories.length > 0) {
                    addSubCategories(cat);
                }
            });
            catSearch(0);
        });
    }

    function addSubCategories(c) {
        angular.forEach(c.SubCategories, function (s) {
            $scope.catInterops.push(s.InteropID);
            if (s.SubCategories.length > 0) {
                addSubCategories(s);
            }
        });
    }

    function catSearch(i) {
        Product.search($scope.catInterops[i], null, null, function (products, count) {
            angular.forEach(products, function (p) {
                if (!$scope.productListAsObject[p.ExternalID]) {
                    $scope.products.push(p);
                    $scope.productListAsObject[p.ExternalID] = p;
                }
            });
            if ($scope.catInterops[i + 1]) {
                catSearch(i + 1);
            }
            else {
                $scope.variantErrors = [];
                $scope.allProductCount = $scope.products.length;
                $scope.productLoadingIndicator = false;
            }
        }, $scope.settings.currentPage, $scope.settings.pageSize);
    }

    $scope.retrieveAllItems();

    // End retrieve all products

    $scope.submit = function () {
        $scope.errors = [];
        $scope.messages = [];
        $scope.promoLoadingIndicator = true;
        if ($scope.exists) {
            PromotionsService.update($scope.promo.PromotionID, $scope.promo, function (d) {
                $scope.promo = d.data;
                $scope.promoLoadingIndicator = false;
                $scope.messages = ["Changes saved."];
            }, function (e) {
                $scope.errors.push(e);
                $scope.promoLoadingIndicator = false;
            });
        }
        else {
            PromotionsService.create($scope.promo, function (d) {
                //$scope.promo = d.data;
                //$location.path('promotion/' + d.data.PromotionID);
                $location.path('promotions'); // Creation doesn't return an ID, so we can't stay on this page and reload, or else they may create a duplicate.
            }, function (e) {
                $scope.errors.push(e);
                $scope.promoLoadingIndicator = false;
            });
        }
    };
}]);