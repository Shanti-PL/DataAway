const textElement = document.getElementById('text_content');
const optionButtonsElement = document.getElementById('buttons');
let park_name = 'park';
let art_name = 'art';
let heart_break = 0;

// show the character image
var NPC = localStorage.getItem("NPC");
if (NPC == "female"){
    $("#person img").attr("src", "../image/female_normal.png");
    $("#name h3").text("Samantha");
}else{
    $("#person img").attr("src", "../image/male_normal.png");
    $("#name h3").text("Bob");
}

// show the park map
var id = 0;

function getRandomNumber() {
    id = Math.random();
    id = id * 100;
    id = Math.floor(id);
    console.log(id);
}


function getRandomParkName(results) {
    var park_name = null;
    $.each(results.result.records, function (recordID, recordValue) {
        if (recordID == id) {
            park_name = recordValue["PARK_NAME"];
            park_address = recordValue["HOUSE_NUMBER"] + " " + recordValue["STREET_ADDRESS"] + ", " + recordValue["SUBURB"] + " " + recordValue["POST_CODE"];
        }
    });
    return park_name;
}

function getRandomArtName(results) {
    var art_name = null;
    $.each(results.result.records, function (recordID, recordValue) {
        if (recordID == id) {
            art_name = recordValue["Item_title"];
            art_address = recordValue["The_Location"];
        }
    });
    return art_name;
}

function showRandomParkInfo(results) {

    // show the park pin on the screen
    var myMap = L.map("map").setView([-27, 153], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    $.each(results.result.records, function (recordID, recordValue) {
        if(recordID == id) {
            var recordLatitude = recordValue["LAT"];
            var recordLongtitude = recordValue["LONG"]
            var marker = L.marker([recordLatitude, recordLongtitude]).addTo(myMap);
            // Associate a popup with the record's information
            popupText = "<strong>Park Name: " + recordValue["PARK_NAME"] + "</strong><br>"
                + "Address: " + recordValue["HOUSE_NUMBER"] + " " + recordValue["STREET_ADDRESS"] + ", " + recordValue["SUBURB"] + " " + recordValue["POST_CODE"] + "<br>"
            ;
            marker.bindPopup(popupText).openPopup();
            localStorage.setItem("park_location", recordValue["HOUSE_NUMBER"] + " " + recordValue["STREET_ADDRESS"] + ", " + recordValue["SUBURB"] + " " + recordValue["POST_CODE"]);
        }

    });

}

function showRandomArtInfo(results) {
    // show the park pin on the screen
    var myMap = L.map("map").setView([-27, 153], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    $.each(results.result.records, function (recordID, recordValue) {
        if(recordID == id) {
            var recordLatitude = recordValue["Latitude"];
            var recordLongtitude = recordValue["Longitude"];
            var marker = L.marker([recordLatitude, recordLongtitude]).addTo(myMap);
            // Associate a popup with the record's information
            popupText = "<strong>Art_collection Name: " + recordValue["Item_title"] + "</strong><br>"
                + "Artist: " + recordValue["Artist"] + "<br>"
                + "Address: " + recordValue["The_Location"] + "<br>";
            marker.bindPopup(popupText).openPopup();
            localStorage.setItem("art_author", recordValue["Artist"]);
            localStorage.setItem("art_address", recordValue["The_Location"]);
        }

    });
}

// show the map
function showMap() {
    $(".map-info").css("visibility", "visible");
}

// hide the map
function hideMap() {
    $(".map-info").css("visibility", "hidden");
}

// fetch data id definition
// fetch park data
const data_park = {
    resource_id: "2c8d124c-81c6-409d-bffb-5761d10299fe",
    // limit: 100
};

const data_art = {
    resource_id: "3c972b8e-9340-4b6d-8c7b-2ed988aa3343",
}

let state = {}

function startGame() {
    state = {}
    if(NPC == "female") {
        showTextNode(1);
    } else {
        showTextNode(46);
    }
}

function showTextNode(textNodeIndex) {
    console.log("This is node: " + textNodeIndex);
    if(textNodeIndex == -1) {
        gameWin();
    } else if(textNodeIndex == -2) {
        gameOverInProcess();
    }
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
    textElement.innerText = textNode.text
    if(NPC == "female") {
        if(textNode.check == "angry") {
            $("#name h3").text("Samantha");
            getWrongAnswer();
            $("#person img").attr("src", "../image/female_angry.png");
            $("#person img").css("display", "block");
            draw_heart();
            gameOver();
        } else if(textNode.check == "happy") {
            $("#name h3").text("Samantha");
            $("#person img").attr("src", "../image/female_happy.png");
            $("#person img").css("display", "block");
        } else if(textNode.check == "normal") {
            $("#name h3").text("Samantha");
            $("#person img").attr("src", "../image/female_normal.png");
            $("#person img").css("display", "block");
        } else if (textNode.check == "none") {
            $("#person img").css("display", "none");
            $("#name h3").text("Narrator");
        }
    } else if(NPC == "male") {
        if(textNode.check == "angry") {
            $("#name h3").text("Bob");
            getWrongAnswer();
            $("#person img").attr("src", "../image/male_angry.png");
            $("#person img").css("display", "block");
            draw_heart();
            gameOver();
        } else if(textNode.check == "happy") {
            $("#name h3").text("Bob");
            $("#person img").attr("src", "../image/male_happy.png");
            $("#person img").css("display", "block");
        } else if(textNode.check == "normal") {
            $("#name h3").text("Bob");
            $("#person img").attr("src", "../image/male_normal.png");
            $("#person img").css("display", "block");
        } else if (textNode.check == "none") {
            $("#person img").css("display", "none");
            $("#name h3").text("Narrator");
        }
    }

    // get name for park and art_collection
    if(textNode.pre_load_name == true) {
        $.ajax({
            url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
            data: data_park,
            dataType: "jsonp",
            cache: true,
            success: function (results) {
                getRandomNumber();
                // localStorage.removeItem("id");
                // localStorage.setItem("id", id.toString());
                // console.log("id is: " + localStorage.getItem("id"));
                park_name = getRandomParkName(results);
                console.log(park_name);
                // load the park name in park&art collection
                let textNode_name = textNodes.find(textNode => textNode.id === 4)
                textNode_name.text = 'How about we head to ' + park_name +". It\'s very beautiful there and with this clear weather it\'s sure to be relaxing.";
                textNode_name.options.forEach(option => {
                    if(option.text == "park") {
                        option.text = park_name;
                    }
                })
                // show the park name when choose the park on the left
                let textNode_female_park = textNodes.find(textNode => textNode.id === 5)
                textNode_female_park.text = 'Let\'s go to ' + park_name + ". I've heard when the weather is nice its absolutely lovely. I'll bring along some food for us. Does a picnic sound fun?";
                // show the park name when the picnic start
                let textNode_female_picnic_start = textNodes.find(textNode => textNode.id === 15)
                textNode_female_picnic_start.text = "So this is " + park_name + ". Let's setup our picnic blanket over here. I made some brownies last nice just in case you wanted to have a picnic.";
                // store the park_name in the localstorage
                localStorage.setItem("park_name", park_name);
            }
        });

        $.ajax({
            url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
            data: data_art,
            dataType: "jsonp",
            cache: true,
            success: function (results) {
                art_name = getRandomArtName(results);
                console.log("art_collection: " + art_name);
                let textNode_name = textNodes.find(textNode => textNode.id === 4)
                textNode_name.options.forEach(option => {
                    if(option.text == "art") {
                        option.text = art_name;
                    }
                })
                // show the art collection information when the user choose art_collection
                let textNode_female_art = textNodes.find(textNode => textNode.id == 6)
                $.each(results.result.records, function (recordID, recordValue) {
                    if (recordID == id) {
                        // art_name = recordValue["Item_title"];
                        art_address = recordValue["The_Location"];
                        art_description = recordValue["Description"];
                    }
                });
                textNode_female_art.text = "Actually I think we should go to the " + art_name + " at " + art_address + ". " + art_description;
                // show the art collection inforamation when the user arrive the art_collection
                let textNode_female_art_start = textNodes.find(textNode => textNode.id == 37)
                $.each(results.result.records, function (recordID, recordValue) {
                    if (recordID == id) {
                        // art_name = recordValue["Item_title"];
                        art_author = recordValue["Artist"];
                        art_time = recordValue["Installed"];
                    }
                });
                textNode_female_art_start.text = "You said to Samantha: So this piece of art was created in " + art_time + " by " + art_author + ".";
                // implement the question in art_collection
                let textNode_female_art_ask = textNodes.find(textNode => textNode.id == 38)
                $.each(results.result.records, function (recordID, recordValue) {
                    if (recordID == id) {
                        // art_name = recordValue["Item_title"];
                        art_material = recordValue["Material"];
                    }
                });
                textNode_female_art_ask.text = "That's so cool. Is it made of " + art_material + "? It must have taken him a while to construct such a piece.",
                // Store the art_name in the localstorage
                localStorage.setItem("art_name", art_name);
            }
        });
    }

    // show the map for park
    if(textNode.show_map == true && textNode.location == "park") {
        $.ajax({
            url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
            data: data_park,
            dataType: "jsonp",
            cache: true,
            success: function (results) {
                showRandomParkInfo(results);
                $(".map-info h2").text("Park");
            }
        });
        showMap();
    }

    // show the map for art_collection
    else if(textNode.show_map == true && textNode.location == "art") {
        $.ajax({
            url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
            data: data_art,
            dataType: "jsonp",
            cache: true,
            success: function (results) {
                showRandomArtInfo(results);
                $(".map-info h2").text("Art Collection");
            }
        });
        showMap();
    }

    // show the info of event
    if(textNode.show_info == true && textNode.location == "event") {
        //$.getJSON('http://api.allorigins.win/get?url=http%3A//www.trumba.com/calendars/brisbane-city-council.json&callback=?',
            // function (results) {
            //     console.log(results);
            //     var obj = getJSONObj(results);
            //     console.log(typeof obj[id].eventImage.url);
            //     let image = document.getElementById('event-img');
            //     image.style.backgroundImage = "url(" + obj[id].eventImage.url + ")";
            //     $("#event-title p").text(obj[id].title);
            //     $("#event-location p").text(obj[id].location);
            //     $("#event-start-date p").text(obj[id].startDateTime);
            //     $("#event-end-date p").text(obj[id].endDateTime);
            //     $(".event-info").css("visibility", "visible");
            //     localStorage.setItem("event_img", obj[id].eventImage.url);
            //     localStorage.setItem("event_title", obj[id].title);
            //     localStorage.setItem("event_location", obj[id].location);
            //     localStorage.setItem("event_start_date", obj[id].startDateTime);
            //     localStorage.setItem("event_end_date", obj[id].endDateTime);
            // });

        let eventid = Math.floor(id / 20);
        // console.log(eventid);
        // console.log(events_list[eventid]);
        let image = document.getElementById('event-img');
        image.style.backgroundImage = "url(" + events_list[eventid].img + ")";
        $("#event-title p").text(events_list[eventid].title);
        $("#event-location p").text(events_list[eventid].location);
        $("#event-start-date p").text(events_list[eventid].start);
        $("#event-end-date p").text(events_list[eventid].end);
        $(".event-info").css("visibility", "visible");
        localStorage.setItem("event_img", events_list[eventid].img);
        localStorage.setItem("event_title", events_list[eventid].title);
        localStorage.setItem("event_location", events_list[eventid].location);
        localStorage.setItem("event_start_date", events_list[eventid].start);
        localStorage.setItem("event_end_date", events_list[eventid].end);

        // implement the node 53 with event address
        let textNode_male_event53 = textNodes.find(textNode => textNode.id == 53);
        textNode_male_event53.text = "Okay so the address is " + events_list[eventid].location + " and you have to meet at " + events_list[eventid].start + ".";

        // implement the node 61 with event description
        let textNode_male_event61 = textNodes.find(textNode => textNode.id == 61);
        textNode_male_event61.text = events_list[eventid].des;
    }

    // hide the map
    if(textNode.show_map == false) {
        hideMap();
    }

    // hide the event info
    if(textNode.show_info == false) {
        $(".event-info").css("visibility", "hidden");
    }

    // angry for none check
    if(textNode.angry == true) {
        getWrongAnswer();
        draw_heart();
        gameOver();
    }

    // change the background based on the park and art_collection choice.
    if(textNode.location == 'park') {
        $('body').css("background-image", "url(../image/park.jpg)");
        $('body').css("background-size", "cover");
    }

    if(textNode.location == 'art') {
        $('body').css("background-image", "url(../image/art_collection.jpg)");
        // $('body').css("background-size", "cover");
    }
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild( optionButtonsElement.firstChild )
    }

    textNode.options.forEach(option => {
        if( showOption(option) ) {
            const button = document.createElement('btn');
            button.innerText = option.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectOption(option))
            optionButtonsElement.appendChild(button)
        }

    })


}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
    const nextTextNodeId = option.nextText;
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId);
}

function getJSONObj(results) {
    return jQuery.parseJSON(results.contents)
}

// game logic
function getWrongAnswer() {
    heart_break++;
}

function draw_heart() {
    if(heart_break == 1) {
        $("#heart3").attr("src", "../image/broken-heart.png");
    } else if(heart_break == 2) {
        $("#heart3").attr("src", "../image/broken-heart.png");
        $("#heart2").attr("src", "../image/broken-heart.png");
    } else if(heart_break == 3) {
        gameOver()
    }
}

function gameOver() {
    if(heart_break == 3) {
        window.location.href = 'gameOver.html';
    }
}

// judge game over when the heart is not all gone.
function  gameOverInProcess() {
    window.location.href = 'gameOver.html';
}

function gameWin() {
    window.location.href = 'gameWin.html';
}

// game content
const textNodes = [
    {
        id: 1,
        check: "normal",
        text: 'Heyyy! Over here! I\'m Samantha your date of course hehe. Thanks for organising this, I don\'t really get out much so it\'s nice to finally be out of the house. How are you?',
        options: [
            {
                text: 'Yes. I\'m great. How are you?',
                nextText: 2
            },
            {
                text: 'Ah not so good actually. Been feeling the pressure of uni and life.',
                nextText: 3
            }
        ]

    },
    {
        id: 2,
        check: "happy",
        pre_load_name: true,
        text: 'That\'s lovely to hear, yea I\'m doing really good. Uni finals are coming up though and I could not be more unprepared. I just wanna get away from it right now.',
        options: [
            {
                text: 'Next',
                nextText: 4
            }
        ]
    },
    {
        id: 3,
        check: "normal",
        pre_load_name: true,
        text: 'Oh dear that\'s not good. Well maybe a nice relaxing day out with help. I promise I\'ll put a smile on your face :)',
        options: [
            {
                text: 'Next',
                nextText: 4
            }
        ]
    },
    {
        id: 4,
        check: "normal",
        text: null,
        options: [
            {
                text: park_name,
                load_data: "park",
                nextText: 5
            },
            {
                text: art_name,
                load_data: "art",
                nextText: 6
            }
        ]
    },
    {
        id: 5,
        check: "happy",
        text: null,
        show_map: true,
        location: "park",
        options: [
            {
                text: 'Next',
                nextText: 7
            }
        ]
    },
    {
        id: 6,
        check: "angry",
        text: null,
        show_map: true,
        location: "art",
        options: [
            {
                text: "Next",
                nextText: 8,
            }
        ]
    },
    // 7 原先是显示event的页面
    {
        id: 7,
        check: "normal",
        show_map: false,
        // show_info: true,
        // location: "event",
        text: "I'm always down for a picnic. It's not too sunny outside but let's bring some sunscreen just in case. ",
        options: [
            {
                text: "Let's take public transport instead! Fuel is expensive now a days.",
                nextText: 9,
            },
            {
                text: "I can drive us there. I hope you don't mind listen to some jazz. ",
                nextText: 10,
            }
        ]
    },
    // 8 是原先隐藏event信息的node
    // 8 得指向另外一条支线
    {
        id: 8,
        check: "normal",
        show_map: false,
        // show_info: false,
        text: "Actually, that does sound really cool. I don't know much about aboriginal culture so it would be super interesting to visit. Let's go there now! How should we get there? it's about 30mins by car from Brisbane city right?",
        options: [
            {
                text: "Let's take public transport instead! Fuel is expensive now a days.",
                nextText: 31,
            },
            {
                text: "I can drive us there. I hope you don't mind listen to some jazz.",
                nextText: 32,
            }
        ]
    },
    {
        id: 9,
        check: "angry",
        // show_info: false,
        text: "Oh okay, yes I guess that's fine.",
        options: [
            {
                text: "Next",
                nextText: 11,
            }
        ]
    },
    {
        id: 10,
        check: "happy",
        // show_info: false,
        text: "Hahah that's okay, I was actually in Jazz band at school so I don't mind a bit of Jazz.",
        options: [
            {
                text: "Next",
                nextText: 12,
            }
        ]
    },
    {
        id: 11,
        check: "none",
        // show_info: false,
        text: "You both walk to the nearest train station where you tap on and head to the first carriage",
        options: [
            {
                text: "Ask her about herself",
                nextText: 13,
            },
            {
                text: "Talk about yourself for the whole ride",
                nextText: 14,
            }
        ]
    },
    {
        id: 12,
        check: "none",
        text: "Samandatha jumps into your car as you get into the drivers seat. Setting the GPS to your destination.",
        options: [
            {
                text: "Ask her about herself",
                nextText: 13,
            },
            {
                text: "Talk about yourself for the whole ride",
                nextText: 14,
            }
        ]
    },
    {
        id: 13,
        check: "none",
        text: "Once you arrived Samantha grabs you by the hand and let's you leads to a nice shady spot under the trees.",
        options: [
            {
                text: "Next",
                nextText: 15,
            }
        ]
    },
    {
        id: 14,
        check: "none",
        angry: true,
        text: "You eventually reach your destination with Samantha looking a little be frustrated. Maybe it was just the long ride. You walk over to a shady spot under the trees.",
        options: [
            {
                text: "Next",
                nextText: 15,
            }
        ]
    },
    {
        id: 15,
        check: "happy",
        text: null,
        options: [
            {
                text: "Next",
                nextText: 16,
            }
        ]
    },
    {
        id: 16,
        check: "none",
        text: "Samantha looks away shyly. Hoping you didn't notice the rising blush in her cheeks.",
        options: [
            {
                text: "Next",
                nextText: 17,
            }
        ]
    },
    {
        id: 17,
        check: "normal",
        text: "She takes out her freshly made brownies and places them on the picnic blanket. They look absolutely delicious and you gobble one up straight away.",
        options: [
            {
                text: "OMG these are so good!",
                nextText: 18,
            },
            {
                text: "This is the most disgusting thing I have ever eaten in my whole life.",
                nextText: 19,
            }
        ]
    },
    {
        id: 18,
        check: "happy",
        text: "(Samantha looks at you with a big smile on her face) I'm so happy that you like them. I made them especially last night thinking of you.",
        options: [
            {
                text: "Next",
                nextText: 20,
            }
        ]
    },
    {
        id: 19,
        check: "angry",
        text: "(Samantha looks up at you in complete shock. And her eyes begin to tear up) But I made them especially and..and..everyone has always complimented me on my cooking.",
        options: [
            {
                text: "Next",
                nextText: 21,
            }
        ]
    },
    {
        id: 20,
        check: "none",
        text: "This is going well, okay time to wipe out your classic 'fill the silence trick'",
        options: [
            {
                text: "How about a game of eye spy",
                nextText: 23,
            },
            {
                text: "Magic trick",
                nextText: 24,
            }
        ]
    },
    {
        id: 21,
        check: "none",
        text: "Samantha wipes her tears and sadly stuffs brownies into her mouth refusing to look at you.",
        options: [
            {
                text: "Next",
                nextText: 22,
            }
        ]
    },
    {
        id: 22,
        check: "none",
        text: "How are you going to fix this?",
        options:[
            {
                text: "How about a game of eye spy",
                nextText: 23,
            },
            {
                text: "Magic trick",
                nextText: 24,
            }
        ]
    },
    {
        id: 23,
        check: "none",
        text: "Easy. Eye spy is a great game to fill the silence. Good choice.",
        options: [
            {
                text: "I'll go first. Eye spy with my little eye something beginning with...a",
                nextText: 25,
            }
        ]
    },
    {
        id: 24,
        check: "none",
        angry: true,
        text: "Turns out you're not very good at magic. You fumble with the cards that you grabbed out of your backpack.",
        options: [
            {
                text: "Next",
                nextText: 26,
            }
        ]
    },
    {
        id: 25,
        check: "normal",
        text: "ahhh, animal? no no wait ummmmmmm ANT!",
        options: [
            {
                text: "Next",
                nextText: 27,
            }
        ]
    },
    {
        id: 26,
        check: "normal",
        text: "I need to go to the bathroom really quick.",
        options: [
            {
                text: "Next",
                nextText: 28,
            }
        ]
    },
    {
        id: 27,
        check: "none",
        text: "Goodness, she's pretty good at this game. You both end up playing eyespy until you could play no longer",
        options: [
            {
                text: "Next",
                nextText: 29,
            }
        ]
    },
    {
        id: 28,
        check: "none",
        text: "Samantha never returns from that bathroom...",
        options: [
            {
                text: "Next",
                nextText: 30,
            }
        ]
    },
    {
        id: 29,
        check: "none",
        text: "You said you're farewell to Samantha before jumping with glee all the way home.",
        options: [
            {
                text: "Next",
                nextText: -1,
            }
        ]
    },
    {
        id: 30,
        check: "none",
        text: "...................",
        options: [
            {
                text: "Next",
                nextText: -2,
            }
        ]
    },
    // female park line end here.
    // female art line start here.
    {
        id: 31,
        check: "angry",
        // show_info: false,
        text: "Oh okay, yes I guess that's fine.",
        options: [
            {
                text: "Next",
                nextText: 33,
            }
        ]
    },
    {
        id: 32,
        check: "happy",
        // show_info: false,
        text: "Hahah that's okay, I was actually in Jazz band at school so I don't mind a bit of Jazz.",
        options: [
            {
                text: "Next",
                nextText: 34,
            }
        ]
    },
    {
        id: 33,
        check: "none",
        // show_info: false,
        text: "You both walk to the nearest train station where you tap on and head to the first carriage",
        options: [
            {
                text: "Ask her about herself",
                nextText: 35,
            },
            {
                text: "Talk about yourself for the whole ride",
                nextText: 36,
            }
        ]
    },
    {
        id: 34,
        check: "none",
        text: "Samandatha jumps into your car as you get into the drivers seat. Setting the GPS to your destination.",
        options: [
            {
                text: "Ask her about herself",
                nextText: 35,
            },
            {
                text: "Talk about yourself for the whole ride",
                nextText: 36,
            }
        ]
    },
    {
        id: 35,
        check: "none",
        text: "Once you arrived Samantha grabs you by the hand and let's you lead the way to the public art.",
        options: [
            {
                text: "Next",
                nextText: 37,
            }
        ]
    },
    {
        id: 36,
        check: "none",
        angry: true,
        text: "You eventually reach your destination with Samantha looking a little be frustrated. Maybe it was just the long ride. You walk over to the public art.",
        options: [
            {
                text: "Next",
                nextText: 37,
            }
        ]
    },
    {
        id: 37,
        check: "none",
        text: null,
        options: [
            {
                text: "Next",
                nextText: 38,
            }
        ]
    },
    {
        id: 38,
        check: "normal",
        text: null,
        options: [
            {
                text: "Yes it is! Actually there are some hiking trails I want to go with you.",
                nextText: 39,
            }
        ]
    },
    {
        id: 39,
        check: "normal",
        text: "I didn't really dress for hiking sorry, maybe an easy walking path would be better.",
        options:[
            {
                text: "Choose the hiking path",
                nextText: 40,
            },
            {
                text: "Choose the walking path",
                nextText: 41,
            }
        ]
    },
    {
        id: 40,
        check: "none",
        angry: true,
        text: "Samantha looks at you absolutely shocked but follows you off into the bushes anyway. As you head down the path you hear Samantha slip over behind you.",
        options:[
            {
                text: "Oh god, are you ok?",
                nextText: 42,
            }
        ]
    },
    {
        id: 41,
        check: "none",
        text: "Samantha takes your hand and you go down a wide path that branches out into a open plain. It's very nice, especially since the Australian heat has decided to not burn you to death.",
        options:[
            {
                text: "Next",
                nextText: 43,
            }
        ]
    },
    {
        id: 42,
        check: "normal",
        text: "ow ow ow, when I put weight to my foot it really hurts. How are we going to get back to the car??",
        options: [
            {
                text: "Don't worry, I can carry.",
                nextText: 44,
            }
        ]
    },
    {
        id: 43,
        check: "none",
        text: "You walk around a bit before heading back to the car. You drive Samantha all the way home as you speak about an abundance of things.",
        options:[
            {
                text: "Next",
                nextText: -1,
            }
        ]
    },
    {
        id: 44,
        check: "normal",
        text: "Are you sure?? I'm not going to be too heavy am I?",
        options:[
            {
                text: "Nope, you're fine. Let's go back to our car.",
                nextText: 45,
            }
        ]
    },
    {
        id: 45,
        check: "none",
        text: "You bridal carry Samantha back to the car, as she gives you 'oh my hero' eyes. You reach the car and put her in the passenger seat before driving carefully back to her house.",
        options:[
            {
                text: "Driving",
                nextText: -1,
            }
        ]
    },
    // female art line end here.
    // male story start here
    {
        id: 46,
        check: "normal",
        text: "Why hello there! I'm Bob, your date. Now I know what you're thinking, this guy is handsome as heck, And yes, yes I am. But anyway how are you?",
        options:[
            {
                text: "Yes. I'm great. How are you?",
                nextText: 47,
            },
            {
                text: "Ah not so good actually. Been feeling the pressure of uni and life.",
                nextText: 48,
            }
        ]
    },
    {
        id: 47,
        check: "normal",
        text: "An fantastic. Being happy is rather attractive so I'm glad you're well hee. I've been making myself busy, going to the gym, going in a jog, climbing a mountain. The usual.",
        options: [
            {
                text: "Next",
                nextText: 49,
            }
        ]
    },
    {
        id: 48,
        check: "normal",
        text: "What? That's not good, you must reset and keep your energy up. Maybe I can cheer you up hey? Come on, how about some ice cream?",
        options:[
            {
                text: "Next",
                nextText: 50,
            }
        ]
    },
    {
        id: 49,
        check: "none",
        text: "Bob gives you a cheeky wink before turning around and pretending nothing happened. This guy sure is a little strange.",
        options:[
            {
                text: "Next",
                nextText: 50,
            }
        ]
    },
    {
        id: 50,
        check: "normal",
        show_info: true,
        location: "event",
        text: "How about this event?",
        options: [
            {
                text: "Let's go.",
                nextText: 51,
            }
        ]
    },
    {
        id: 51,
        check: "happy",
        show_info: false,
        text: "That does sound great! How much will it cost to go?",
        options: [
            {
                text: "It's actually free.",
                nextText: 52,
            },
            {
                text: "It only costs a little.",
                nextText: 52,
            }
        ]
    },
    {
        id: 52,
        check: "normal",
        show_info: false,
        text: "No problem. Yea let's head over now.",
        options: [
            {
                text: "Next",
                nextText: 53,
            }
        ]
    },
    {
        id: 53,
        check: "normal",
        show_info: false,
        text: null,
        options:[
            {
                text: "Next",
                nextText: 54,
            }
        ]
    },
    {
        id: 54,
        check: "normal",
        show_info: false,
        text: "Alright well let's going then. Do you want to drive there?",
        options:[
            {
                text: "Let's take public transport instead! Fuel is expensive now a days.",
                nextText: 55,
            },
            {
                text: "I can drive us there. I hope you don't mind listen to some jazz.",
                nextText: 56,
            }
        ]
    },
    {
        id: 55,
        check: "none",
        angry: true,
        text: "Oh okay, yes I guess that's fine.",
        options: [
            {
                text: "Next",
                nextText: 57,
            }
        ]
    },
    {
        id: 56,
        check: "normal",
        text: "Hahah that's okay, I was actually in Jazz band at school so I don't mind a bit of Jazz.",
        options:[
            {
                text: "Next",
                nextText: 58,
            }
        ]
    },
    {
        id: 57,
        check: "none",
        text: "You both walk to the nearest train station where you tap on and head to the first carriage",
        options:[
            {
                text: "Ask him about himself",
                nextText: 59,
            },
            {
                text: "Talk about yourself for the whole ride",
                nextText: 60,
            }
        ]
    },
    {
        id: 58,
        check: "none",
        text: "Bob jumps into your car as you get into the drivers seat. Setting the GPS to your destination.",
        options:[
            {
                text: "Ask him about himself",
                nextText: 59,
            },
            {
                text: "Talk about yourself for the whole ride",
                nextText: 60,
            }
        ]
    },
    {
        id: 59,
        check: "none",
        text: "Once you arrived Bob grabs you by the hand and let's you lead the way to the meeting area.",
        options:[
            {
                text: "Next",
                nextText: 61,
            }
        ]
    },
    {
        id: 60,
        check: "none",
        angry: true,
        text: "You eventually reach your destination with Bob looking a little be frustrated. Maybe it was just the long ride. You walk over to the starting location.",
        options: [
            {
                text: "Next",
                nextText: 61,
            }
        ]
    },
    {
        id: 61,
        check: "none",
        show_info: true,
        location: "event",
        text: null,
        options:[
            {
                text: "Do you like the event?",
                nextText: 62,
            },
            {
                text: "What a bad event.",
                nextText: 63,
            }
        ]
    },
    {
        id: 62,
        check: "none",
        show_info: false,
        text: "Soon into the event you realise that you're actually a lot better than your date and start helping them.",
        options:[
            {
                text: "Next",
                nextText: 64,
            }
        ]
    },
    {
        id: 63,
        check: "none",
        angry: true,
        show_info: false,
        text: "It doesn't take long for Bob to realise that you're extremely bad at this. Not just bad but really bad.",
        options:[
            {
                text: "Next",
                nextText: 65,
            }
        ]
    },
    {
        id: 64,
        check: "none",
        show_info: false,
        text: "Bob seems to really appreciate the effort you put in to help them.",
        options: [
            {
                text: "Next",
                nextText: 66,
            }
        ]
    },
    {
        id: 65,
        check: "none",
        show_info: false,
        text: "Your date tries to avoid you in hopes that they won't have to bear the embarrassment.",
        options: [
            {
                text: "Next",
                nextText: 66,
            }
        ]
    },
    {
        id: 66,
        check: "normal",
        text: "So did you have a fun time? I actually really enjoyed it.",
        options:[
            {
                text: "It was actually really fun",
                nextText: 67,
            },
            {
                text: "Nope",
                nextText: 68,
            }
        ]
    },
    {
        id: 67,
        check: "happy",
        text: "Aw I'm glad. We should hangout again sometime. I'll call you.",
        options:[
            {
                text: "Next",
                nextText: 69,
            }
        ]
    },
    {
        id: 68,
        check: "angry",
        text: "Alright fine! Look I'm leaving. You've been so mean and rude and I hate you. GOODBYE!",
        options:[
            {
                text: "Next",
                nextText: 70,
            }
        ]
    },
    {
        id: 69,
        check: "none",
        text: "Bob skips happily away and before turning a corner. They turn to you and give a happy wave.",
        options: [
            {
                text: "Next",
                nextText: -1,
            }
        ]
    },
    {
        id: 70,
        check: "none",
        text: "Bob storms away in disgust and ulter anger.",
        options: [
            {
                text: "Next",
                nextText: -2,
            }
        ]
    }
]


class Event {
    constructor(img, title, location, start, end, des) {
        this.img = img;
        this.title = title;
        this.location = location;
        this.start = start;
        this.end = end;
        this.des = des;
    }
}

let events_list = [Event];

var event1 = new Event("https://www.trumba.com/i/DgCnWSTX3IF8JdYCJUEEH0eN.jpeg", "Brisbane Portrait Prize", "Brisbane Powerhouse, New Farm", "2022-09-29T00:00:00", "2022-10-31T00:00:00", "The Brisbane Portrait Prize Finalists exhibition is running at the Brisbane Powerhouse from September 29 to October 30.The exhibition will showcase the 60 artists who were selected as Finalists including 56 entrants from the main competition and 4 from the Next Gen Competition. We'd love for you to join us for this celebration of art, Brisbane artists and the characters who make our city what it is.");
events_list[0] = event1;
var event2 = new Event("https://www.trumba.com/i/DgA3Z7bIqfYiIxtputnm3FgO.jpeg","2022 Fringe Brisbane Festival", "Various. Check website for details.", "2022-10-14T00:00:00", "2022-11-07T00:00:00", "From the team who brought you Anywhere Festival, it's now time to experience a reimagined fringe festival for all of Brisbane from Stafford to Moorooka, Mt Coot-tha to Seven Hills, Fortitude Valley to Yerongpilly, South Brisbane to Woolloongabba, make a night of it with over 400 performances in 22 different action packed Brisbane venues every Thursday to Sunday from from 14 October to 6 November 2022 Image: Fringe Brisbane Festival &amp; Evoke Dance &amp; Theatre Company present Pink Martini Cabaret. Photograph supplied by artist.");
events_list[1] = event2;
var event3 = new Event("https://www.trumba.com/i/DgAK95EEXIcb9yz553D%2AQ2U6.jpg", "Pilates", "Arthur Davis Park, Sandgate", "2022-10-14T06:00:00", "2022-10-14T07:00:00", "Bookings essential. Come and try kitesurfing. All equipment is provided, no experience necessary. This is a chill out event suitable for young people 10-17 years.");
events_list[2] = event3;
var event4 = new Event("https://www.trumba.com/i/DgA-NiDPaQ%2A-8uzTPfnsl3np.jpg", "Brisbane City Hall Tour", "Museum of Brisbane, Brisbane City", "2022-10-15T10:30:00", "2022-10-15T11:15:00", "Discover the secrets of Brisbane's heritage-listed City Hall building with a guided tour. With its impressive neo-classical fade, mosaic tiles, stained-glass windows and soaring ceilings, Brisbane's heritage-listed City Hall is at the heart of our city. Discover the secrets of this magnificent building which has been the setting for many cultural, social and civic events in our city&#8217;s history. Known as the Peopl's Place, City Hall was built between 1920 and 1930 at a cost of almost one million pounds. At the time it was the second largest construction project in Australia, second only to the Sydney Harbour Bridge. A highlight is the stunning auditorium, inspired by Rome&#8217;s Pantheon, which has hosted rock stars and royalty and is home to the Father Henry Willis &amp; Sons Pipe Organ, made up of nearly 4,400 pipes. This instrument is one of only two of its kind in the world, and the auditorium continues to be integral to events that reflect our creative and connected city. City Hall is a working civic building and some areas may be unavailable at certain times. Tour begins in the King George Square foyer on the ground floor of City Hall. Duration of tour: 45mins Capacity: 20 people Difficulty: This tour is suitable for all fitness levels and abilities. Please note this tour will include staircases.\"");
events_list[3] = event4;
var event5 = new Event("https://www.trumba.com/i/DgDSvQo9OJ85pzzXmb7VvEOh.jpeg", "Destination: Universe", "Sir Thomas Brisbane Planetarium, Mt Coot-tha", "2022-10-23T15:00:00", "2022-10-23T15:50:00", "Join us for a mission of discovery as the Planetarium's astronomers take you on an exciting virtual spaceflight. Shall we chart a course through the Solar System or venture past the most distant space probes, and out of the Milky Way galaxy? Every show is a new and different adventure! Approximately 50 minutes.");
events_list[4] = event5;
var event6 = new Event("\"https://www.trumba.com/i/DgDP-7BldaFeDCsngj3A515H.jpg", "Stretchband pilates", "Ray Lynch Park, Holland Park", "2022-10-24T09:00:00", "2022-10-24T10:00:00", "A beginner to immediate pilates based workout using a stretchband specially designed to improve posture, reduce stress and tone your body. This workout is suitable for adults of all ages.");
events_list[5] = event6;

$(document).ready(function () {
    startGame()

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

    $(".setting img").click(function(){
        $(".setting").css("display", "none");
    });

    $("#setting img").click(function(){
        $(".setting").css("display", "block");
    });

    $("#quit_game").click(function(){
        $(".quit_game").css("display", "block");
    });

    $("#close_quit_window").click(function(){
        $(".quit_game").css("display", "none");
    });
});
