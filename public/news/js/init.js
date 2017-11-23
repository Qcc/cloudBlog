$(document).ready(function(){
  // 开始写 jQuery 代码...   
  var carouselImg =$('#carousel-img').children('li');
  const MAXIMG = carouselImg.length;//轮播图片数量
  var initRun = true; //首次轮播跳过第一张
  var currentNum = 0;
  var carousel = function(){
    this.interval;
  }
  carousel.prototype.start = function(index){
    this.interval = setInterval(function(index){
      if(index) currentNum = ++index;
      if(initRun){
        currentNum++;
        initRun = false;
      }
      if(currentNum < MAXIMG){
        $('.menu-focus').removeClass('menu-focus');
        $('#carousel-menu').children('li').eq(currentNum).addClass('menu-focus');
        $("#carousel-img li").filter(":visible").fadeOut(300).parent().children().eq(currentNum).fadeIn(300);
        currentNum++;
      }else{
        currentNum = 0;
      }
    },4000);
  };
  carousel.prototype.stop = function(){
    clearInterval(this.interval);
  }
  var carouseler = new carousel();
  carouseler.start();
  
  $('#carousel-menu').children('li').each(function(index){
    $(this).mouseenter(function(){
      $('.menu-focus').removeClass('menu-focus');
      $(this).addClass('menu-focus');
      carouselImg.each(function(indexImg){
        if(index == indexImg){
          carouseler.stop();
          $("#carousel-img li").filter(":visible").fadeOut(300).parent().children().eq(indexImg).fadeIn(300);
          carouseler.start(index);; //运行轮播
        }
      });
    });
  });

//固定导航 分享模块
var nav=$(".nav-style"); //得到导航对象
var sub=$(".subtype-box"); //得到子菜单

var win=$(window); //得到窗口对象
var sc=$(document);//得到document文档对象。
win.scroll(function(){
  if(sc.scrollTop()>=100){
    nav.addClass("fixed"); 
    sub.addClass("sub-fixed");     
  //  $(".nav-style").fadeIn(100); 
  }else{
    // $(".fixed").fadeOut(100);
   nav.removeClass("fixed");
   sub.removeClass("sub-fixed");   
  }
})



});


