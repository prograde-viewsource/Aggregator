four51.app.controller('CategoryCtrl', ['$routeParams', '$sce', '$scope', '$451', 'Category', 'Product', 'Nav', 'Order', 'ProductDisplayService', 'User', '$location',
function ($routeParams, $sce, $scope, $451, Category, Product, Nav, Order, ProductDisplayService, User, $location) {
	$scope.productLoadingIndicator = true;
    $scope.LineItem = {};
	$scope.addToOrderText = "Add To Cart";
	$scope.settings = {
		currentPage: 1,
		pageSize: 40
	};
	$scope.trusted = function(d){
		if(d) return $sce.trustAsHtml(d);
	}

	function setDefaultQty(lineitem) {
		if (lineitem.PriceSchedule && lineitem.PriceSchedule.DefaultQuantity != 0)
			$scope.LineItem.Quantity = lineitem.PriceSchedule.DefaultQuantity;
	}

	function _search() {
		$scope.searchLoading = true;
		ProductDisplayService.getProductAndVariant($scope.Promotion.ProductInterop, null, function (data) {
			$scope.LineItem.Product = data.product;
			$scope.LineItem.Variant = data.variant;
			ProductDisplayService.setNewLineItemScope($scope);
			ProductDisplayService.setProductViewScope($scope);
			setDefaultQty($scope.LineItem);
			$scope.searchLoading = false;
			$scope.productLoadingIndicator = false;
			$scope.setAddToOrderErrors();
		}, $scope.settings.currentPage, $scope.settings.pageSize, null);
	}

	$scope.addToOrder = function(){
		if($scope.lineItemErrors && $scope.lineItemErrors.length){
			$scope.showAddToCartErrors = true;
			return;
		}
		if(!$scope.currentOrder){
			$scope.currentOrder = { };
			$scope.currentOrder.LineItems = [];
		}
		else if ($scope.currentOrder.LineItems.length > 0){
			var hasOtherItems = false;
			angular.forEach($scope.currentOrder.LineItems, function(i){
				if (i.Product.InteropID != $scope.Promotion.ProductInterop) {
					hasOtherItems = true;
				}
			});
		}
		if (hasOtherItems) {
			if (confirm("You currently have an item in your cart that is not a part of this promotion. Would you like to clear your cart to proceed?")) {
				Order.delete($scope.currentOrder,
					function(){
						$scope.currentOrder = { };
						$scope.currentOrder.LineItems = [];
						finishAddToOrder();
					},
					function(ex) {
						$scope.actionMessage = 'An error occurred: ' + ex.Message;
						$scope.displayLoadingIndicator = false;
					}
				);
			}
			else {
				return;
			}
		}
		else {
			finishAddToOrder();
		}
	};

	function finishAddToOrder() {
		if($scope.allowAddFromVariantList){
			angular.forEach($scope.variantLineItems, function(item){
				if(item.Quantity > 0){
					$scope.currentOrder.LineItems.push(item);
					$scope.currentOrder.Type = item.PriceSchedule.OrderType;
				}
			});
		}else{
			$scope.currentOrder.LineItems.push($scope.LineItem);
			$scope.currentOrder.Type = $scope.LineItem.PriceSchedule.OrderType;
		}
		$scope.addToOrderIndicator = true;
		//$scope.currentOrder.Type = (!$scope.LineItem.Product.IsVariantLevelInventory && $scope.variantLineItems) ? $scope.variantLineItems[$scope.LineItem.Product.Variants[0].InteropID].PriceSchedule.OrderType : $scope.LineItem.PriceSchedule.OrderType;
		// shipper rates are not recalcuated when a line item is added. clearing out the shipper to force new selection, like 1.0
		Order.clearshipping($scope.currentOrder).
			save($scope.currentOrder,
				function(o){
					$scope.user.CurrentOrderID = o.ID;
					User.save($scope.user, function(){
						$scope.addToOrderIndicator = true;
						$location.path('/cart');
					});
				},
				function(ex) {
					$scope.addToOrderIndicator = false;
					$scope.lineItemErrors.push(ex.Detail);
					$scope.showAddToCartErrors = true;
					//$route.reload();
				}
		);
	}

	$scope.$watch('Promotion', function(n, o) {
		if (n != o || (n == 1 && o == 1))
			_search();
	});

    // panel-nav
    $scope.navStatus = Nav.status;
    $scope.toggleNav = Nav.toggle;
	$scope.$watch('sort', function(s) {
		if (!s) return;
		(s.indexOf('Price') > -1) ?
			$scope.sorter = 'StandardPriceSchedule.PriceBreaks[0].Price' :
			$scope.sorter = s.replace(' DESC', "");
		$scope.direction = s.indexOf('DESC') > -1;
	});
}]);