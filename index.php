<?php get_header(); ?>
<div id="content" class="site-content">
	<div class="dark">
  <div class="container site-title-wrapper">
  <div class="row">
    <site-title></site-title>
  </div>
</div>

<div id="frontpage-post-top" class="container" ng-view></div>
</div> 
<div class="light"> 
<div class="container">
  <div class="row">
   
</div>
<front-page-projects>
 <?php 
  $query = get_post_data();
  ?>
  <?php foreach ($query->posts as $key => $data): ?>
  <div class="row post-<?php echo $data->ID; ?>">
    <section class="front-page-blog-post post post-single">
    <div class="col-xs-8 col-xs-offset-2 col-sm-3 col-sm-offset-0">
   <div class="font-page-blog-photo" style="background-image:url('<?php echo $data->acf['post_image']['sizes']['medium']; ?>')"></div>        
    </div>
     <div class="col-xs-12 col-sm-9">
      <h2 class="post-title"><?php echo $data->post_title; ?></h2>
      <h3 class="post-date"><?php echo date("m.d.y",strtotime($data->post_date)); ?></h3>
      <div class="content-wrapper" ng-class="{'full-post' : expandedPost == <?php echo $data->ID; ?>}">
       <?php 
       echo wpautop($data->post_content);
       ?>
      </div>
      <button class="show-more" ng-click="showFullPost(<?php echo $data->ID; ?>)">Show <span ng-hide="expandedPost == <?php echo $data->ID; ?>">More</span><span ng-hide="expandedPost != <?php echo $data->ID; ?>">Less</span></button>
    </div>
  </section>
  
  </div>
  <?php endforeach; ?>
  <nav class="post-navigation"> 
  <ul class="pager">
  <?php 

  $page = max( 1, get_query_var('paged'));
  $max_num_pages = $query->max_num_pages;

  if($page != 1){
      echo '<li class="previous"><a href="/page/'.($page-1).'">Newer</a></li>';
  }
  if($page != $max_num_pages)
      {
        echo '<li class="next"><a href="/page/'.($page+1).'">Older</a></li>';
      }

  ?>
  
</front-page-projects>

</div>
</div> <!-- end light row -->
</div>
  <script type="text/ng-template" id="views/front-page.onload"> 
  <?php 
	$query = get_post_data();
  ?>
  <?php foreach ($query->posts as $key => $data): ?>
  <div class="row post-<?php echo $data->ID; ?>">
    <section class="front-page-blog-post post post-single">
    <div class="col-xs-8 col-xs-offset-2 col-sm-3 col-sm-offset-0">
   <div class="font-page-blog-photo" style="background-image:url('<?php echo $data->acf['post_image']['sizes']['medium']; ?>')"></div>        
    </div>
     <div class="col-xs-12 col-sm-9">
      <h2 class="post-title"><?php echo $data->post_title; ?></h2>
      <h3 class="post-date"><?php echo date("m.d.y",strtotime($data->post_date)); ?></h3>
      <div class="content-wrapper" ng-class="{'full-post' : expandedPost == <?php echo $data->ID; ?>}">
       <?php 
       echo wpautop($data->post_content);
       ?>
      </div>
      <button class="show-more" ng-click="showFullPost(<?php echo $data->ID; ?>)">Show <span ng-hide="expandedPost == <?php echo $data->ID; ?>">More</span><span ng-hide="expandedPost != <?php echo $data->ID; ?>">Less</span></button>
    </div>
  </section>
  
  </div>
  <?php endforeach; ?>
  <nav class="post-navigation">	
  <ul class="pager">
  <?php 

  $page = max( 1, get_query_var('paged'));
  $max_num_pages = $query->max_num_pages;

  if($page != 1){
  		echo '<li class="previous"><a href="/page/'.($page-1).'">Newer</a></li>';
  }
  if($page != $max_num_pages)
  		{
  			echo '<li class="next"><a href="/page/'.($page+1).'">Older</a></li>';
  		}

  ?>
  
    
    
  </ul>
</nav>
  </script>
<?php get_footer(); ?>