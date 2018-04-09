/**
 * Created by hy on 2018/4/8.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5;

  render();
  function render(){

    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);

        $("tbody").html(template("tmp",info));


        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        })
      }
    })

  }


  //点击添加模态框
  $("#addcatg").click(function(){
    $("#secadd").modal("show");


    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);

        $(".dropdown-menu").html(template("tmp1",info));
        $(".dropdown-menu").on("click","a",function(){
          var txt = $(this).text();
          var id = $(this).data("id");
          $("#shuru").text(txt);
          $("[name='categoryId']").val(id);

          //重置
          $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
        })
      }
    })
  })


  //选择图片
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){
      //console.log(data);
      var picAddr = data.result.picAddr;
      $("#imgBox img").attr("src",picAddr);
      $("[name='brandLogo']").val(picAddr);

      $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");

    }
  })


  //校验表单
  $("#form").bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded:[],

    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields:{
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类名称"
          }
        }
      },
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
  });

  $("#form").on("success.form.bv",function(){

    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$("#form").serialize(),
      success:function(info){
        console.log(info);
        $("#secadd").modal("hide");
        //重置表单的内容和校验状态
        $("#form").data("bootstrapValidator").resetForm(true);

        currentPage = 1;
        render();

        // 找到下拉菜单文本重置
        $('#dropdownText').text("请选择1级分类")

        // 找到图片重置
        $('#imgBox img').attr("src", "images/none.png")
      }
    })
  })
})