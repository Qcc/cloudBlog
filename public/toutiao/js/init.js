$(document).ready(function(){
  // 开始写 jQuery 代码...   
  const num = 6;//轮播图片数量
  var carouselImg =$('#carousel-img').children('li');
  $('#carousel-menu').children('li').each(function(index){
    $(this).mouseenter(function(){
      $('.menu-focus').removeClass('menu-focus');
      $(this).addClass('menu-focus');
      carouselImg.each(function(indexImg){
        if(index == indexImg){
          $("#carousel-img li").filter(":visible").fadeOut(300).parent().children().eq(indexImg).fadeIn(300);
        }
      });
    });
  });
  function carousel(){
    $('#carousel-menu').children('li').each(function(index){
      $('.menu-focus').removeClass('menu-focus');
      $(this).addClass('menu-focus');
      carouselImg.each(function(indexImg){
        if(index == indexImg){
          $("#carousel-img li").filter(":visible").fadeOut(300).parent().children().eq(indexImg).fadeIn(300);
        }
      });
    });
  }
  setInterval(carousel,3000);
});


