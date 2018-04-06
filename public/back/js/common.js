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
  })


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