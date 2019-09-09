var suggest_kcal = 2800;

var total_kcal = 0;
var breakfast_kcal = 0;
var lunch_kcal = 0;
var dinner_kcal = 0;

var current_active_meal = "";

set_suggest_kcal();
set_consume_kcal();

function set_suggest_kcal()
{
    $(".suggest-consume").html(suggest_kcal)
}

function set_consume_kcal()
{
    $(".total-consume").html(total_kcal)
}

function close_overlay()
{
    $(".popup-food-content").html("2500");
    current_active_meal = ""
    window.location.href = "#";
}

function choosen_food(dbno)
{
    $(".food-selection").removeClass("selected");
    $("." + dbno).addClass("selected");

}

function get_search_query()
{
    var search = $(".food-search").val()

    var result_count = 0;

    $(".popup-food-content").html("");
    
    if (search.length != 0)
    {
        $.getJSON("./json/nutrients.json", function(data){
            $.each(data, function(i, field){
                if (field["Food Name"].toLowerCase().includes(search.toLowerCase()))
                {
                    var selection = '<div class="mdl-button mdl-js-button mdl-js-ripple-effect food-selection ' + 
                                    field["Database Number"] + '"' +
                                    'kcal="' + field["Calories"] + '"' +
                                    'onclick="choosen_food(' + field["Database Number"] + ')"' +
                                    'food_name="' + field["Food Name"] + '"' +
                                    'style="text-align: left !important">' + field["Food Name"] + '</div></br>'

                    result_count++;

                    $(".popup-food-content").append(selection);
                }
            });

            if (result_count == 0)
                $(".popup-food-content").append('<h4 style="text-align: center">No matched result</h4>')
        });
    }
    else
        $(".popup-food-content").append('<h4 style="text-align: center">No matched result</h4>')   
}

function add_food()
{
    var food_name = $(".selected").attr("food_name");
    var food_kcal = parseInt($(".selected").attr("kcal"), 10);
    var food_gram = parseInt($(".portion").val(),10);

    if (food_name != null)
    {
        var actual_kcal = (food_kcal * (food_gram / 100)).toFixed(0);
        var total_meal_kcal;

        if(current_active_meal == "breakfast")
        {
            breakfast_kcal += parseInt(actual_kcal, 10);
            total_meal_kcal = breakfast_kcal;
        }
        else if(current_active_meal == "lunch")
        {
            lunch_kcal += parseInt(actual_kcal, 10);
            total_meal_kcal = lunch_kcal;
        }
        else
        {
            dinner_kcal += parseInt(actual_kcal, 10);
            total_meal_kcal = dinner_kcal;
        }

        var table = '<tr>' +
                    '<td>' + food_name + '</td>' +
                    '<td>' + actual_kcal + '</td>' +
                    '</tr>';

        $("." + current_active_meal).append(table);
        $("." + current_active_meal + "-kcal").html("Total calories: " + total_meal_kcal + " kcal");
        calculate_total_kcal();
    }
}

function calculate_total_kcal()
{
    total_kcal = parseInt(breakfast_kcal, 10) + parseInt(lunch_kcal, 10) + parseInt(dinner_kcal, 10);
    set_consume_kcal()
}

function set_active_meal(meal)
{
    current_active_meal = meal;
}

function doit() {
    var difference;
    var max_experience = 50;

    difference = Math.abs(total_kcal - suggest_kcal)

    var exp = max_experience - parseInt(Math.ceil(difference / (suggest_kcal / max_experience)))
    var value = document.getElementById("xp-bar-fill").style.width;
    if (value != "") {
        value = parseInt(value, 10);
        //value=value.substring((0, value.length-2))
    }
    value = value + exp;
    $("#xp-increase-fx").css("display", "inline-block");
    $("#xp-bar-fill").css("box-shadow", "-5px 0px 10px #fff inset");
    setTimeout(function () {
        $("#xp-bar-fill").css("-webkit-transition", "all 1s ease");
        $("#xp-bar-fill").css("width", value);
    }, 100);
    setTimeout(function () {
        $("#xp-increase-fx").fadeOut(500);
        $("#xp-bar-fill").css({ "-webkit-transition": "all 0.5s ease", "box-shadow": "" });
    }, 1000);

    localStorage.setItem("rem_cal", suggest_kcal - total_kcal);
    localStorage.setItem("tot_cal", suggest_kcal);


    $(".breakfast").html("<tr><th>Food</th><th>Kcal</th></tr>");
    $(".breakfast-kcal").html("Total calories: ");

    $(".lunch").html("<tr><th>Food</th><th>Kcal</th></tr>");
    $(".lunch-kcal").html("Total calories: ");

    $(".dinner").html("<tr><th>Food</th><th>Kcal</th></tr>");
    $(".dinner-kcal").html("Total calories: ");

    $(".total-consume").html(0);

    total_kcal = 0;
    breakfast_kcal = 0;
    lunch_kcal = 0;
    dinner_kcal = 0;

    window.location.href = "#top-page"
}

