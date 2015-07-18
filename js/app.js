//Globals
var $_global = {
    initialLoad: true,
    loadRouteExtension: function(page) {
        'use strict';
        if (this.initialLoad) {

            return 'views/' + page + ".onload";
        } else {
            return myLocalized.views + page + ".html";
        }
    }
};

angular.module('theNewBetterment', ['ngRoute', 'ui.bootstrap', 'wordpressFilters', 'smoothScroll'], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    })
    .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: function() {
                    return $_global.loadRouteExtension('front-page');
                },
                controller: 'Main',
                resolve: {
                    postData: ['$q', '$route', '$http', function($q, $routeParams, $http) {
                        var deferred = $q.defer();
                        if (!$_global.initialLoad) {
                            $http.get("/wp-json/posts?filter[posts_per_page]=2")
                                .success(function(result, status, headers, config) {
                                    var data = {
                                        currentPage: $routeParams.current.params.page,
                                        numPages: headers('X-WP-TotalPages'),
                                        posts: result
                                    };
                                    deferred.resolve(data);
                                });

                        } else {
                            deferred.resolve("Initial Page load, using server render");
                        }
                        return deferred.promise;
                    }]
                }
            })
            .when('/page/:page', {
                templateUrl: function() {
                    return $_global.loadRouteExtension('front-page');

                },
                controller: 'Main',
                resolve: {
                    postData: ['$q', '$route', '$http', function($q, $routeParams, $http) {
                        var deferred = $q.defer();
                        if (!$_global.initialLoad) {
                            $http.get('/wp-json/posts?filter[posts_per_page]=1&page=' + $routeParams.current.params.page)
                                .success(function(result, status, headers, config) {
                                    var data = {
                                        currentPage: $routeParams.current.params.page,
                                        numPages: headers('X-WP-TotalPages'),
                                        posts: result
                                    };

                                    deferred.resolve(data);
                                });

                        } else {
                            deferred.resolve("Initial Page load, using server render");
                        }
                        return deferred.promise;
                    }]
                }
            })
            .when('/blog/:id', {
                templateUrl: myLocalized.views + 'products2.html',
                controller: 'Blog'
            });

    }])
    .controller('Main', ["$scope", "$location", "$log", 'postData', 'smoothScroll', function($scope, $location, $log, postData, smoothScroll) {
        var element = document.getElementById('frontpage-post-top');
        var options = {
            duration: 200,
            easing: 'easeInQuad',
            offset: 50
        };

        $_global.initialLoad = false;
        $scope.posts = postData.posts;
        $scope.currentPage = postData.currentPage;
        $scope.numPages = postData.numPages;

        $scope.isViewLoading = false;
        $scope.$on('$routeChangeStart', function() {
            $scope.isViewLoading = true;
            smoothScroll(element, options);
        });
        $scope.$on('$routeChangeSuccess', function() {
            $scope.isViewLoading = false;
            ga('send', 'pageview', {
                'page': $location.path()
            });
        });
        $scope.$on('$routeChangeError', function() {
            $scope.isViewLoading = false;
        });

        $scope.showFullPost = function(postId) {
            if ($scope.expandedPost != postId) {
                $scope.expandedPost = postId;
            } else {
                $scope.expandedPost = null;
            }
        };

    }])
    .controller('Projects', ['$scope', '$modal', '$log', '$http', function($scope, $modal, $log, $http) {
        $http.get('/wp-json/posts?type[]=project')
            .success(function(result) {
                $scope.projects = result;
            })
            .error(function(data, status) {
                console.log(data);
            });
        $scope.projectId = null;

        $scope.open = function(project) {
            if (project.acf.status == 'live') {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projectModal.html',
                    controller: 'projectModal',
                    size: 'lg',
                    resolve: {
                        project: function() {
                            return project;
                        },

                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {

                });



            }
        };
    }])
    .controller('projectModal', ['$scope', '$modalInstance', '$log', '$sce', 'project', function($scope, $modalInstance, $log, $sce, project) {
        $scope.projectId = project.ID;
        $scope.projectColor = project.acf.project_color;
        $scope.currentProject = project;
        $scope.projectContent = $sce.trustAsHtml(project.content);

        ga('send', 'pageview', {
            'page': '/virtual/modal/' + project.slug
        });

        $scope.ok = function() {
            $modalInstance.close();
        };



    }])
    .directive('frontPageProjects', [function(element) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: myLocalized.directives + 'frontpage-projects.html',
            link: function(scope, element, attrs) {

            }

        };
    }])
    .directive('siteTitle', [function(element) {
        return {
            restrict: "E",
            replace: true,
            template: '<div class="title-wrapper"><h1 class="site-name">The NEW Betterment of Seve</h1> <h2 class="tag-line">The continued chronicles of my self-improvement.</h2></div>',
            link: function(scope, element, attrs) {
                jQuery(document).ready(function($) {
                    $(element).find("h1.site-name").lettering('words').children('span').lettering();
                    $(element).find("h1.site-name").fitText(1.05, {
                        //minFontSize: '30px'
                    });
                    $(element).find("h2.tag-line").fitText(4.5, {
                        //minFontSize: '12px'
                    });
                });

            }

        };
    }]);
