var appX = angular.module("mainApp", ["ngRoute"]);

/*************************************routes*********************************************/

appX.config(function($routeProvider) {
  $routeProvider

  .when("/featured", {
    templateUrl: "templates/featured.html",
    controller: "featuredCtrl"
  })

  .when("/wishlist", {
    templateUrl: "templates/wishlist.html",
    controller: "wishlistCtrl"
  })

  .when("/search", {
    templateUrl: "templates/search.html",
    controller: "searchCtrl"
  });

});

/****************************************end routes*********************************************/


/******************************************run**************************************************/

appX.run(function($rootScope) {
  $rootScope.rootMessage = "message from rootScope";
});

/*******************************************end run***********************************************/


/*******************************************mainCtrl**********************************************/

appX.controller("mainCtrl", function($scope, $rootScope, $window, $location, $http) {

  $scope.enterKey=function() {

    if(event.which==13) {
      $scope.search();

    }
  };
  $scope.forURL=[];
  $rootScope.wishlist = [];
  $rootScope.wishlistIds = [];
  $scope.search=function() {

    if (!$scope.searchTerm) {return;}
    $rootScope.errorText = "";
    forURL=$scope.searchTerm.split(' ').join('+');
    console.log(forURL);
    $scope.searchTerm="";
    $rootScope.results=[];

    $http.get("https://api.themoviedb.org/3/search/movie?api_key=ca4186d8ecdd6d8b44f1f839924680fc&query="+forURL)

      .then(function(response) {

        var totalResults= response.data.results.length;
        console.log(totalResults);
        $rootScope.results=[];
        for(i=0; i<totalResults; i++) {
          var temp = {

            "title": response.data.results[i].title,
            "overview": response.data.results[i].overview,
            "poster": "https://image.tmdb.org/t/p/w150" + response.data.results[i].poster_path

          };
          $rootScope.results.push(temp);
        }

        $rootScope.addToWishlist=function(x) {
          $rootScope.errorText = "";
            if($rootScope.wishlistIds.indexOf(response.data.results[x].id) == -1) {
            $rootScope.wishlist.push(response.data.results[x].title);
            console.log($rootScope.wishlist);
            $rootScope.wishlistIds.push(response.data.results[x].id);
            console.log($rootScope.wishlistIds);
          } else {
            $rootScope.errorText = "Already in Watchlist"
          }
        }

      });

    $window.location.href = "#/search";
  };

});

/*************************************end mainCtrl**********************************************/


/***************************************searchCtrl******************************************/

appX.controller("searchCtrl", function($scope, $rootScope, $http) {

  $rootScope.errorText = "";

});

/**************************************end searchCtrl**************************************/


/************************************featuredCtrl******************************************/

appX.controller("featuredCtrl", function($scope, $rootScope, $http) {

  $rootScope.errorText = "";
  $scope.backdrops = [];
  $scope.featuredItems = [];
  $http.get("https://api.themoviedb.org/3/movie/popular?api_key=ca4186d8ecdd6d8b44f1f839924680fc&language=en-US")
  .then(function(response) {
    console.log(response);
    for(i=0; i<5; i++) {
      var temp = {
        poster: "https://image.tmdb.org/t/p/w1920" + response.data.results[i].backdrop_path
      };
      $scope.backdrops.push(temp);
      console.log($scope.backdrops[i]);
    }

    for(i=0; i<15; i++) {
      var temp = {
        poster: "https://image.tmdb.org/t/p/w150" + response.data.results[i].poster_path,
        overview: response.data.results[i].overview,
        title: response.data.results[i].title
      };
      $scope.featuredItems.push(temp);
    }
  })

});

/************************************end featuredCtrl*****************************************/


/************************************wishlistCtrl******************************************/

appX.controller("wishlistCtrl", function($scope, $rootScope, $http) {

  $scope.wishlist=[];
  var wishlistLength = $rootScope.wishlist.length;

  for(i=0; i<wishlistLength; i++) {
    $http.get("https://api.themoviedb.org/3/movie/" + $rootScope.wishlistIds[i] + "?api_key=ca4186d8ecdd6d8b44f1f839924680fc")
    .then(function(response) {
      var temp = {
        "title": response.data.title,
        "overview": response.data.overview,
        "poster": "https://image.tmdb.org/t/p/w150" + response.data.poster_path
      };
      $scope.wishlist.push(temp);
    })
  }
  $scope.removeItem=function(x) {
    $rootScope.errorText = "";
    $rootScope.wishlist.splice(x, 1);
    $scope.wishlist.splice(x, 1);

  }
});

/************************************end wishlistCtrl*****************************************/

/************************************historyCtrl********************************************/
appX.controller("historyCtrl", function($scope, $rootScope, $http) {

});
/************************************end historyCtrl******************************************/
