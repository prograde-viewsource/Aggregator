four51.app.controller('ApprovalsCtrl', ['$scope', '$location', 'OrderSearchCriteria', 'OrderSearch', 'Order',
function ($scope,  $location, OrderSearchCriteria, OrderSearch, Order) {
	$scope.settings = {
		currentPage: 1,
		pageSize: 10
	};
    $scope.rowSelection = {};

	OrderSearchCriteria.query(function(data) {
		$scope.OrderSearchCriteria = data;
        angular.forEach($scope.OrderSearchCriteria, function(c){
            if (c.Type === "Standard" && c.Status === "AwaitingApproval") {
                Query(c);
            }
        });
		$scope.hasStandardTypes = _hasType(data, 'Standard');
		$scope.hasReplenishmentTypes = _hasType(data, 'Replenishment');
		$scope.hasPriceRequestTypes = _hasType(data, 'PriceRequest');
	});

	$scope.$watch('settings.currentPage', function() {
		Query($scope.currentCriteria);
	});

	$scope.OrderSearch = function($event, criteria) {
		$event.preventDefault();
		$scope.currentCriteria = criteria;
		Query(criteria);
	};

    function _hasType(data, type) {
        var hasType = false;
        angular.forEach(data, function(o) {
            if (hasType || o.Type == type && o.Count > 0)
                hasType = true;
        });
        return hasType;
    }

	function Query(criteria) {
		if (!criteria) return;
		$scope.showNoResults = false;
		$scope.pagedIndicator = true;
		OrderSearch.search(criteria, function (list, count) {
			$scope.orders = list;
			$scope.settings.listCount = count;
			$scope.showNoResults = list.length == 0;
			$scope.pagedIndicator = false;
		}, $scope.settings.currentPage, $scope.settings.pageSize);
		$scope.orderSearchStat = criteria;
	}
    
    $scope.approveSelected = function() {
        $scope.approvalIndicator = true;
        $scope.toBeApproved = [];
        angular.forEach($scope.orders, function(o) {
            if ($scope.rowSelection[o.ExternalID]) {
                $scope.toBeApproved.push(o);
            }
        });
        angular.forEach($scope.toBeApproved, function(o, i) {
            if ($scope.rowSelection[o.ExternalID]) {
                Order.approve(o, function(o, $scope){
                    if (i == $scope.toBeApproved.length - 1) {
                        angular.forEach($scope.OrderSearchCriteria, function(c){
                            if (c.Type === "Standard" && c.Status === "AwaitingApproval") {
                                Query(c);
                                $scope.approvalIndicator = false;
                            }
                        });
                    }
                }, null, $scope);
            }
        });
    }

    $scope.selectAllChange = function() {
        angular.forEach($scope.orders, function(o,i){
            $scope.selectAll ? $scope.rowSelection[o.ExternalID] = true : $scope.rowSelection[o.ExternalID] = false;
        });
    }
}]);