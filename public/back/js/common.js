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