$(document).ready(function() {

    var $front = $(".front");
    var $back = $(".back");
    var windowWidth = $(window).width();
    if (windowWidth < 610) {
      $(".flip-container, .front, .back, .image").css("width", windowWidth * .9);
      $(".flip-container, .front, .back, .image").css("height", (windowWidth * .9) * 1.5);
      $back.css("fontSize", windowWidth * .025 + "px")
    } else {
      $(".flip-container, .front, .back, .image").css("width", 400);
      $(".flip-container, .front, .back, .image").css("height", 600);
      $back.css("fontSize", .7 + "em")
    }
  
    $("body").click(function() {
      $front.toggleClass("front-flip");
      $back.toggleClass("back-flip");
    });
  
    $(window).resize(function() {
      windowWidth = $(window).width();
      if (windowWidth < 610) {
        $(".flip-container, .front, .back, .image").css("width", windowWidth * .9);
        $(".flip-container, .front, .back, .image").css("height", (windowWidth * .9) * 1.5);
        $back.css("fontSize", windowWidth * .025 + "px")
      } else {
        $(".flip-container, .front, .back, .image").css("width", 400);
        $(".flip-container, .front, .back, .image").css("height", 600);
        $back.css("fontSize", .7 + "em")
      }
    });
  
    ////////////////////////////////////////////////////////////////////////////////////////////
  
    //canvas init
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
  
    //canvas dimensions
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

  });