
$(document).ready(function(){
    $("#button2").mouseenter(function(){
        $(".button2-before").css("display", "block");
        $(".button2-after").css("display", "block");
    });

    $("#button2").mouseleave(function(){
        $(".button2-before").css("display", "none");
        $(".button2-after").css("display", "none");
    });
    
    $("#button1").mouseenter(function(){
        $(".button1-before").css("display", "block");
        $(".button1-after").css("display", "block");
    });

    $("#button1").mouseleave(function(){
        $(".button1-before").css("display", "none");
        $(".button1-after").css("display", "none");
    });
    
    $("#button1").click(function(){
        localStorage.removeItem("NPC");
        localStorage.setItem("NPC", "female");
        console.log(localStorage.getItem("NPC"));
    });

    $("#button2").click(function(){
        localStorage.removeItem("NPC");
        localStorage.setItem("NPC", "male");
        console.log(localStorage.getItem("NPC"));
    });

  });



