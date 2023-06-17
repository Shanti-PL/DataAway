
function startMusic(){

}

$(document).ready(function () {

    $("#setting").click(function(){

        $("section").css("display", "none");
        $(".setting").css("display", "block");
    });


    $(".setting img").click(function(){
        
        $("section").css("display", "flex");
        $(".setting").css("display", "none");
    });



    $("#instraction").click(function(){
        $("h1").css("display", "none");
        $("section").css("display", "none");
        $("#howToPlay").css("display", "block");
    });

    $("#howToPlay img").click(function(){
        $("h1").css("display", "block");
        $("section").css("display", "flex");
        $("#howToPlay").css("display", "none");
    });

    $("#yes").click(function(){
        document.getElementById("BGM").play();
        
    });

    $("#no").click(function(){
        document.getElementById("BGM").pause();
    });

    
    $("#volume").change(function(){
        let musicVolum = document.getElementById("volume").value;
        document.getElementById("BGM").volume = parseFloat(musicVolum)/100;

    });
    

});