/**
 * Single Page Web Applications with AngularJS - Assignment 3 
 * objective: shows menu options in a grid according to a user search choice
 * @author... Sergio Vicente
 * @date..... Nov.2021
 */


(function () {
'use strict';

const ALL="all";

angular.module('NarrowItDownApp', [])
 .controller('NarrowItDownController', NarrowItDownController_func)
 .service('MenuSearchService', MenuSearchService_func) 
 .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
 // .constant('ApiBasePath', "http://127.0.0.1/davids-restaurant")
 // .constant('ApiBasePath', "http://www.supersuporte.com/teste")
 .directive('foundItems', FoundItems);

function FoundItems() { 
  var ddo = {
	templateUrl: 'foundItems.html',
	scope: {
		search: '<myMenu'
	},
	controller: NarrowDirectiveController,
	controllerAs: 'search',
	bindToController: {
		removeItem: '&'
	},
	link: NarrowDirectiveLink
  };
  return ddo;
}

function NarrowDirectiveController(MenuSearchService) {
}	

function NarrowDirectiveLink(scope, element, attribs, controller) 
{
	scope.$watch("search.countItems()", function (newValue, oldValue) {
		console.log("Old value: ", oldValue, "New value", newValue);

		if (newValue > 0) 
			displayHeadList();
		else
			removeHeadList();
	});
	
	function displayHeadList() {
		// using Angular jqlite
		// https://stackoverflow.com/questions/23609171/how-to-get-element-by-classname-or-id/23609348
		var headElement = angular.element( document.getElementsByClassName("head-list") );
		headElement.css('visibility', 'visible');
	}

	function removeHeadList() {
		// using Angular jqlite
		var headElement = angular.element( document.getElementsByClassName("head-list") );
		headElement.css('visibility', 'hidden');
	}
}

// NarrowItDown Controller
NarrowItDownController_func.$inject = ['MenuSearchService', '$scope'];
function NarrowItDownController_func(MenuSearchService, $scope) {
  var search = this;
  var menu = MenuSearchService;
  const TABLE_TITLE = "Options according to your search: ";
  
  search.nameRemoved = null;

  $scope.search = function() {
	  var term = $scope.search_input.trim().toLowerCase();
	  var promise = menu.getMatchedMenuItems(term);

	  promise
		.then( function (response) {
			console.log("promise resolved: ", menu.foundItems);
			$scope.search.items = menu.foundItems;
			$scope.search.count = menu.foundItems.length;
			search.title = TABLE_TITLE + menu.foundItems.length + " items";
		})
		.catch(function (error) {
			console.log("Something wrong [cannot access menu_items url source]...");
		});
  };

  $scope.search.removeItem = function (itemIndex) {
	this.nameRemoved = "Last item removed was " + menu.foundItems[itemIndex].name;
	this.lastRemoved(menu.foundItems[itemIndex].name);
	menu.foundItems.splice(itemIndex, 1);
	search.title = TABLE_TITLE + " [" + menu.foundItems.length + " items ]";
  };
  
  $scope.search.lastRemoved = function (name) {
	  if (arguments.length > 0) {
		  this.nameRemoved = name;
		  return null;
	  }
	  else{
		  return (this.nameRemoved ? "[ last removed was: "+this.nameRemoved+" ]" : "");
	  }
  };
  
  $scope.search.myTitle = function() {
	  return search.title;
  };
  
  $scope.search.countItems = function() {
	  return $scope.search.count;
  }
}

MenuSearchService_func.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService_func($http, ApiBasePath) {
	var service = this;
	
	service.getMatchedMenuItems = function (needle) {
		var response = $http({
			method: "GET",
			url: (ApiBasePath+'/menu_items.json')
		  })
		  .then( function (result) {
			var arrItens = result.data.menu_items;
			if (needle===ALL) {
				// console.log("return all");
				service.foundItems = result.data.menu_items;
				// console.log("found in service: ", service.foundItems);
			}
			else if (needle=="")
				return null;
			else{
				var arrItens = result.data.menu_items;
				service.foundItems = [];
				for(var item in arrItens) {
					let curr_descr = arrItens[item].description.toLowerCase();

					if (curr_descr.indexOf(needle) >= 0) {
						service.foundItems.push(arrItens[item]);
					}
				}
			}
		  })
		  .catch(function (error) {
			console.log("Something wrong when retrieving from server...");
		  });
		return response;
	};
}	

})();

		