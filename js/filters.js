angular.module('wordpressFilters', []).filter('to_raw', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]).filter('to_text', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(String(text).replace(/<[^>]+>/gm, ''));
    };
}]).filter('to_text_excerpt', ['$sce', function($sce) {
    return function(text, length) {
        var temp_string = String(text).replace(/<[^>]+>/gm, '').substr(0, length);
        if (temp_string.length == length) {
            temp_string += "&hellip;";
        }
        return $sce.trustAsHtml(temp_string);
    };
}]);
