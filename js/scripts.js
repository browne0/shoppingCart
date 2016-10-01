// Define our angular app
var app = angular.module('shopApp', ['ngRoute']);

// Handle routes for SPA functionality
app.config(['$routeProvider', function($routeProvider) {

	$routeProvider

	.when('/', {
		templateUrl:'views/addItem.html',
		controller: 'ItemFormController'	
	})

	.when('/inventory', {
		templateUrl:'views/inventory.html',
		controller: 'InventoryListController'	
	})

	.when('/basket', {
		templateUrl:'views/basket.html',
		controller: 'ShoppingBasketController'	
	})

	.otherwise({redirectTo: '/'});
}]);

// Create static service to store all items in inventory in local storage

app.service('sharedItems', [function() {
	var itemArray = [];

	// Helper Methods
	this.addItemToArray = function(item) {
		itemArray.push(item);
		return [].concat(itemArray);
	};

	this.getItemArray = function() {
		return [].concat(itemArray);
	};

	this.clearItems = function() {
		itemArray = [];
		return [].concat(itemArray);
	};

	this.updateItemArray = function(array, index) {
		array[index].inventoryQuantity += array[index].basketQuantity;
		return [].concat(itemArray);
	}
}]);

// Create static service to store all items in the basket in local storage

app.service('shoppingBasket', [function() {
	var basketArray = [];

	// Helper Methods
	this.getBasketArray = function() {
		return [].concat(basketArray);
	};

	this.addItemToBasket = function(item) {
		basketArray.push(item);
		return [].concat(basketArray)
	};

	this.removeFromBasket = function(index, item) {
		basketArray.splice(index, 1);
		return [].concat(basketArray);
	}

}]);

// Start declaring controllers with separate scope level functions for each page

app.controller('ItemFormController', ['$scope', 'sharedItems', function($scope, sharedItems) {
	$scope.itemList = sharedItems.getItemArray();

	$scope.update = function(item) {
		if ($scope.itemForm.$valid) {
			sharedItems.addItemToArray(item)
			$scope.item = null;
		}
		
	};

	$scope.reset = function() {
		$scope.item = null;
	};
}]);

app.controller('InventoryListController', ['$scope', 'sharedItems', 'shoppingBasket', function($scope, sharedItems, shoppingBasket) {
	$scope.itemList = sharedItems.getItemArray();
	$scope.basketList = shoppingBasket.getBasketArray();
	$scope.enabled = true;

	$scope.addToBasket = function(item) {
		for (var i = 0; i < item.basketQuantity; i++) {
			item.inventoryQuantity -= 1;
		}
		shoppingBasket.addItemToBasket(item);
		item.basketQuantity.value = '';
		$scope.basketList = shoppingBasket.getBasketArray();
	};
}]);

app.controller('ShoppingBasketController',['$scope', 'sharedItems', 'shoppingBasket', function($scope, sharedItems,shoppingBasket) {
	$scope.basketList = shoppingBasket.getBasketArray();

	$scope.removeFromBasket = function(array, index, item) {
		sharedItems.updateItemArray(array, index);
		array[index].basketQuantity = 0;
		shoppingBasket.removeFromBasket(index, item);
		window.location.href='#/inventory';
	}
}]);