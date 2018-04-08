/**
 * Created by hy on 2018/4/7.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5;
  //在进入页面前要先渲染
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);

        $(".table tbody").html(template("tmp",info));

        //分页插件
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            //只要使用page就可以了
            currentPage = page;
            render();
          }
        })
      }
    })
  }


  //模态框
  $(".table tbody").on("click",".btn",function(){
    //console.log("ss");
    $("#userModal").modal("show");

    // 用户的id
    var id = $(this).parent().data("id");

    //是否启用
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;

    //console.log(isDelete);
    //console.log(id);
    //off()解绑，阻止多次触发
    $("#userConfirm").off().on("click",function(){
      //console.log("hh");
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function(info){
          console.log(info);
          if(info.success){
            $("#userModal").modal("hide");
            render();
          }
        }
      })
    })
  })
})