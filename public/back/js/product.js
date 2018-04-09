/**
 * Created by hy on 2018/4/9.
 */
$(function(){

  var currentPage = 1 ;
  var pageSize = 2;
  var picArr = [];

  render();
  function render(){

    $.ajax({
      url: "/product/queryProductDetailList",
      type:"get",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);

        $("tbody").html(template("tmp",info));

        //分页
        $("#paginator").bootstrapPaginator({
          //版本号
          bootstrapMajorVersion: 3,
          currentPage:info.page,
          totalPages : Math.ceil(info.total/info.size),
          //注册页码的点击事件
          onPageClicked : function(a,b,c,page){
            currentPage = page;
            render();
          },
          //配置按钮的大小
          size:"normal",
          //配置每个按键的文字
          itemTexts :function(type, page, current){
            switch( type ) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          //配置提示框
          tooltipTitles: function( type, page, current) {
            switch( type ) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return "前往第" + page + "页";
            }
          },
          // 使用 bootstrap 样式的提示框组件
          useBootstrapTooltip: true
        })
      }
    })

  }


  //点击添加按钮显示模态框
  $("#addBtn").click(function(){
    $("#addModal").modal("show");

    $.ajax({
      url:"/category/querySecondCategoryPaging",
      type:"get",
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        $(".dropdown-menu").html(template("tmp1",info));
      }
    })
  })


  //给下拉菜单中的a注册委托事件
  $(".dropdown-menu").on("click","a",function(){
    //console.log("ss");
    var txt = $(this).text();
    var id = $(this).data("id");

    $("#dropdownText").text(txt);

    //设置隐藏域
    $("[name='brandId']").val(id);



  })


  //配置图片上传的回调函数
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){
      //console.log(data);
      //获取图片地址对象
      var picObj = data.result;
      //获取图片地址
      var picAddr = picObj.picAddr;

      //新的图片应该在数组的最前面,并且添加到盒子的最前面
      picArr.unshift(picObj);
      $("#imgBox").prepend('<img src="'+ picAddr +'" width="100">');

      //如果上传的图片大于3张，需要将最旧的删除
      if(picArr.length > 3){
        //删除最后一项
        picArr.pop();
        //删除页面中渲染的最后一张图片
        $("#imgBox img:last-of-type").remove();



        //校验
        if(picArr.length === 3){
          $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
        }
      }


    }
  });


  //配置表单校验
  $("#form").bootstrapValidator({
    excluded:[], // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //配置校验字段
    fields:{
      // 二级分类id, 归属品牌
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },

      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },

      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },

      //商品库存
      //必须是非零数字开头
      // 数字 \d
      //+表示一个或多个
      //*表示零个或多个
      //？表示零个或1个
      //{n}表示出现n次
      num:{
        validators:{
          notEmpty:{
            message:"请输入商品库存"
          },
          //正则校验
          regexp:{
            regexp:/^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },

      //尺码校验  规则必须是 32-40, 两个数字-两个数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },

      // 商品价格
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },

      //标记图片是否上传满3张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }

    }

  })


  //注册校验成功事件
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();

    var params = $("#form").serialize();
    //console.log(params);
    params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    //console.log(params);

    $.ajax({
      url:"/product/addProduct",
      type:"post",
      data:params,
      success:function(info){
        console.log(info);
        if(info.success){
          $("#addModal").modal("hide");
          $("#form").data("bootstrapValidator").resetForm(true);
          currentPage = 1;
          render();


          // 手动重置, 下拉菜单
          $('#dropdownText').text("请选择二级分类")

          // 删除结构中的所有图片
          $('#imgBox img').remove();
          // 重置数组 picArr
          picArr = [];
        }
      }
    })
  })

})