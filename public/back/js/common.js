/**
 * Created by hy on 2018/4/6.
 */
$(function(){

  //进度条完成
$(document).ajaxStart(function(){
  NProgress.start();
});
  $(document).ajaxStart(function(){
    NProgress.done();
  });



  //登陆拦截功能
  //先判断登陆地址中是否含有login ，如果没有再进行ajax判断
  if( location.href.indexOf("login") === -1){
    $.ajax({
      type:"get",
      url:"/employee/checkRootLogin",
      dataType:"json",
      success:function(info){
        //console.log(info);
        if( info.success ){
          console.log("登陆了");
        }
        if( info.error === 400){
          location.href = "login.html";
        }
      }
    })
  }


});

$(function(){

//  二级分类
$(".category").click(function(){
  $(this).next().stop().slideToggle();
});

  //顶部菜单栏切换显示功能
$(".icon_menu").click(function(){
  $(".lt_aside").toggleClass("hidemenu");
  $(".lt_main").toggleClass("hidemenu");
  $(".lt_topbar").toggleClass("hidemenu");
  //console.log("hhh");
});


  //模态框
$(".icon_logout").click(function(){
  $('#logoutModal').modal('show')
});

  $("#logoutBtn").click(function(){
    //console.log("hhh");

    $.ajax({
      url:"/employee/employeeLogout",
      type:"get",
      dataType:'json',
      success:function(info){
        //console.log(info);
       if(info.success){
         location.href = "login.html";
       }
      }
    })
  });


})