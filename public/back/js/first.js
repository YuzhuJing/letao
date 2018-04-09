/**
 * Created by hy on 2018/4/8.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5 ;

  render();
  function render(){

    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);

        $(".table tbody").html(template("tmp",info));


        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }

        })
      }

    })


  }


  //显示模态框
  $("#addcatg").on("click",function(){
    $("#addc").modal("show");
  })

  //通过检验插件添加校验功能
  $("#form").bootstrapValidator({

    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },


    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"请输入一级分类"
          }
        }
      }
    }
  });

  //校验完成
  $("#form").on("success.form.bv",function(){

    //通过form可以不要阻止默认事件,直接ajax提交
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$(this).serialize(),
      success:function(info){
        console.log(info);
        if(info.success){
          $("#addc").modal("hide");
          //添加内容后让页面在第一页渲染
          currentPage = 1;
          render();
          //重置表单
          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }

    })


  })
})