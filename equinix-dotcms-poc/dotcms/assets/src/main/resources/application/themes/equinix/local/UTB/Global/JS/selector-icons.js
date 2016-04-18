(function() {
  $(function() {
    $(".selector-icons .icon-selectors div a").click(function(e) {
      var img;
      e.preventDefault();
      img = $(this).attr("data-icon");
      console.log(img);
      $(this).parent('li').siblings().children('a').removeClass("active");
      $(this).addClass("active");
      $(".selector-icons div.info").removeClass("active");
      $(".selector-icons div[data-icon=" + img + "]").addClass("active");
    });
  });

}).call(this);
