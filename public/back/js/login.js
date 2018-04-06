/**
 * Created by hy on 2018/4/6.
 */
$(function(){

//1.进行表单校验
  $("#form").bootstrapValidator({

    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },


    //对字段进行校验
    fields:{
      username:{
        //校验规则
        validators:{
          //不能为空
          notEmpty:{
            message:"用户名不能为空"
          },
          stringLength:{
            min:2,
            max:6,
            message:"用户名长度为2-6位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:"密码不能为空"
          },
          //长度校验
          stringLength:{
            min:6,
            max:12,
            message:"密码长度必须为6-12位",
          },
          callback:{
            message:"密码错误",
          }
        }
      }
    }
  })


  //2.进行登陆请求
  //校验成功，继续提交，需要阻止表单的自动提交，通过AJAX进行提交
  //如果失败，阻止默认的提交
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();//阻止默认事件

    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$("#form").serialize(),
      datatype:"json",
      success:function(info){
        //console.log(info);
        if(info.success){
          //alert("登陆成功");
          location.href = "index.html";
        }
        if(info.error === 1000){
          //alert("用户名错误");
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
        if(info.error === 1001){
          //alert("密码错误");
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })
  })


  //3.重置功能的实现
  $("[type='reset']").on("click",function(){
    //console.log("ff");
    $("#form").data('bootstrapValidator').resetForm();
  })

});