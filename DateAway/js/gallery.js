

$(document).ready(function () {
    $("#female").click(function(){
        $(".characterInfo img").attr("src", "../image/female_happy.png");
        $("#Cinfo h2").text("Samantha Jones");
        $("#li-1").text("She loves being outside in nature and grealty values a person who seeks out adventure");
        $("#li-2").text("Highly educated, likes books and such");
    });

    $("#male").click(function(){
        $(".characterInfo img").attr("src", "../image/male_happy.png");
        $("#Cinfo h2").text("Bob Smith");
        $("#li-1").text("I prefer silence and keep it at home. I occasionally visit art galleries. I enjoy making drawings.");
        $("#li-2").text("Highly educated, likes books and such");
    });

    $("#character").click(function(){
        $(".character").css("display", "block");
        // $(".character").attr("z-index", "999");
        $(".location").css("display", "none");
        // $(".location").attr("z-index", "0");
        $(".favourites").css("display", "none");
        // $(".favourites").attr("z-index", "0");

    });

    $("#location").click(function(){
        $(".character").css("display", "none");
        // $(".character").attr("z-index", "0");
        $(".location").css("display", "block");
        // $(".location").attr("z-index", "999");
        $(".favourites").css("display", "none");
        // $(".favourites").attr("z-index", "0");

    });

    $("#favourites").click(function(){
        $(".character").css("display", "none");
        $(".location").css("display", "none");
        $(".favourites").css("display", "block");
        // $(".favourites").css("z-index", "999");

    });

    $("#park_name p").text(localStorage.getItem("park_name"));
    $("#park_address p").text(localStorage.getItem("park_location"));

    $("#art_name p").text(localStorage.getItem("art_name"));
    $("#art_author p").text(localStorage.getItem("art_author"));
    $("#art_location p").text(localStorage.getItem("art_address"));

    $("#event_name p").text(localStorage.getItem("event_title"));
    $("#event_location p").text(localStorage.getItem("event_location"));
    $("#event_start p").text(localStorage.getItem("event_start_date"));
    $("#event_end p").text(localStorage.getItem("event_end_date"));
    let image = document.getElementById('event_img_gallery');
    image.style.backgroundImage = "url(" + localStorage.getItem("event_img") + ")";
    image.style.backgroundSize = "contain";
    // image.style.backgroundRepeat = "no-repeat";
});
