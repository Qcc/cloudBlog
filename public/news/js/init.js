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
});
// 添加代码风格选择框
$('pre').css('position','relative');
$("<div class='code-style'><span class='active' title='light'></span><span title='dark'></span></div>").appendTo('pre');
$('.code-style span').on('click', function(eventObj) {
  setCodeStyle(eventObj.target.title)
});
var cookie = getCookie('codeStyle');
if(cookie === 'light'){
  setCodeStyle('light');
}
if(cookie === 'dark'){
  setCodeStyle('dark');
}
});

function setCodeStyle(style){
  $('.code-style span').each(function(index,ele){
    if(ele.title === style && style === 'light'){
      ele.className = 'active'
      $('#code-themes')[0].href = "/news/css/codeThemes/coy.css"
      setCookie('codeStyle','light',999);
    }else{
      ele.className = ''        
    }
    if(ele.title === style && style === 'dark'){
      ele.className = 'active'
      $('#code-themes')[0].href = "/news/css/codeThemes/Okaidia.css"
      setCookie('codeStyle','dark',999);        
    }else{
      ele.className = ''        
    }
  });
}

function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
}
 
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
