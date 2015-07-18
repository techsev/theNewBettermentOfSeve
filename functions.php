<?php
/* functions.php */
if (class_exists(Timber)){
Timber::$dirname = 'twigs';
}



function my_scripts() {
	
	wp_enqueue_script('angularjs',get_stylesheet_directory_uri() . '/bower_components/angular/angular.min.js');
	wp_enqueue_script('angularjs-route',get_stylesheet_directory_uri() . '/bower_components/angular-route/angular-route.min.js');
	wp_enqueue_script('ui-bootstrap-tps',get_stylesheet_directory_uri() . '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js');
	wp_enqueue_script('angular-smooth-scroll',get_stylesheet_directory_uri() . '/bower_components/ngSmoothScroll/angular-smooth-scroll.min.js');
	wp_enqueue_script('jquery','https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js');
	wp_enqueue_script('bootstrap',get_stylesheet_directory_uri() . '/js/vendor/bootstrap.min.js');


	wp_enqueue_script('filters',get_stylesheet_directory_uri() . '/js/filters.js');
	wp_enqueue_script('plugins',get_stylesheet_directory_uri() . '/js/plugins.js');
	wp_enqueue_script('app',get_stylesheet_directory_uri() . '/js/app.js');
	wp_enqueue_script('main',get_stylesheet_directory_uri() . '/js/main.js');
	

	//wp_enqueue_script('app',get_stylesheet_directory_uri() . '/js/app.min.js');


	wp_enqueue_style('googlefonts', 'http://fonts.googleapis.com/css?family=Bitter:400,700,400italic|Open+Sans:400,300,700');
	//wp_enqueue_style('animate', get_stylesheet_directory_uri() . '/bower_components/animate.less/animate.min.css');
	wp_enqueue_style('main', get_stylesheet_directory_uri() . '/style.css');
	

	wp_localize_script(
		'main',
		'myLocalized',
		array(
			'views' => trailingslashit( get_template_directory_uri() ) . 'views/',
			'directives' => trailingslashit( get_template_directory_uri() ) . 'directives/'
			)
	);
}

add_action( 'wp_enqueue_scripts', 'my_scripts' );

function get_post_data($post_id = null, $args = array()){

	$defaults = array(
	'type' => 'post',
	'before' => "<p>",
	'after' => "</p> \n",
	"posts_per_page" => 1,
);
	$args['paged'] = (get_query_var('paged')) ? get_query_var('paged') : 1;

	if($post_id !== null){
		if(!is_array($post_id)){
			$post_id = array($post_id);
		}

		$args['post__in'] = $post_id;
	}

	$args = wp_parse_args( $args,$defaults);
	//$query = get_posts($args);
	$query = new WP_Query($args);
	for ($i=0; $i < count($query->posts); $i++) { 
		$query->posts[$i]->acf = get_fields($query->posts[$i]->ID);

	}


	
	return $query;
}