/*
***************************************
Momentum code
Coding by Dave Guzda
Make Swanky Code!
April 2019
*******************************************
*/

$(document).ready(function() { 


messagelink = document.querySelector("#message");
setuplink = document.querySelector("#mosetup");
timecommentlink = document.querySelector("#timecomment");
timelink = document.querySelector("#showtime");
// nextlink.addEventListener("click", nextava);
getnamelink = document.querySelector("#getname");
getfocuslink = document.querySelector("#focus");
infolink = document.querySelector("#info");
infoboxlink = document.querySelector("#infobox");
  
infolink.innerHTML="<i id='info' class='fas fa-info-circle'></i>";

var picdesc, piccity, piccountry;
  

var focuslist = [];
var todolist = [];
var todoliststatus = []; 
var focusstatus = []; // ok done 
focusstatus[0]="NEW";
  

$('#focus').hide();
$('#showtime').hide();
$('#timecomment').hide();
$('#infobox').hide(); 
  
infoboxlink.innerHTML="<i class='far fa-smile-beam'></i>About this App:<i class='fas fa-info-circle'></i><p>This app was created by Dave Allan Guzda. It is based on the Google Chrome extention 'Momentum'. It was a project for my WDDM 122 class at Humber college. April 2019.</p>";
  
  
/*
**********************************************************
the js variables 
**********************************************************
wcounter - weather counter for time to update weather since i don't want to update it every second 
wmax - time in seconds that the weather will be updated  3600 is each hour
wicon - weather icon
wtemp - weather temperature in C
long - longitude of current location (based on IP so not exact of course...)
lat - latitude of current location
city - close to where you are
myquote - a randoom quote from https://quotes.rest/#!/quote/get_quote_random
authour - author of aforementioned quote
*/
let username, myfocus, x="teststring", long, lat,city,wicon,wtemp,wcounter=0,wmax=3600,myquote,author;

//
// mine as well grab the location and set the weather
//
getLocation();

//
getWeather();
//  set first
getRandomBackground();  
// set first  
getQuote(); 
// initialize todo list
$('#todo').empty().append("<i id='mytodo' class='fas fa-th-list'></i>");
// testing   
$('#todolist').append("This is the todo list");
  
/*
************************************************
got Storage
************************************************
*/
if (localStorage.username)
    {
       console.log("101. Hide setup.");
      $('#mosetup').hide();
      console.log("100. Username loaded from localstorage!");
      // load defaults
      username=localStorage.getItem('username');
      myfocus=localStorage.getItem('myfocus');
      // ONLY DO IF THERE 
      if (localStorage.todolist)
      {
        todolist = JSON.parse(localStorage.getItem("todolist"));
        maketodo();
      }
      focuslist[0]=myfocus;
      focusstatus[0]="OK";
       makemefocus();
    }
    else
      {
        /*
        ************************************************
         get USERNAME
        ************************************************
        */
      console.log("Username NOT found in localstorage. Prompt!");
        
      $( "#getname" ).keypress(function( event ) {
      if ( event.which == 13 ) {
              event.preventDefault();
              username=document.getElementById("getname").value;
              console.log("Username"+username);
              // set username 
              localStorage.setItem("username", username);
              $('#mosetup').hide();
              $('#focus').show();
      }
      });  
      }
        
        
        
/*
************************************************
get FOCUS
************************************************
*/
if ((localStorage.focus != "") && (username != ""))
{
 
      $('#getfocus').focus();
      $( "#getfocus" ).keypress(function( event ) {
      if ( event.which == 13 ) {
              event.preventDefault();
              myfocus=document.getElementById("getfocus").value;
              console.log("Focus: "+myfocus);
              // set username 
              localStorage.setItem("myfocus", myfocus);
              // fruits.push("Kiwi");
              focuslist[0]=myfocus;
              focusstatus[0]="OK";
              $('#mosetup').hide();
              $('#focus').show();
              makemefocus();
      }
      });  
}
 
/*
*********************************************************************************************
TOGGLE TODO LIST BUTTON
**********************************************************************************************
*/  
$("#mytodo" ).click(function() {
  console.log("** show/hide todo");
  // toggle
  // if( $('#test').is(':visible') ) { ... }
$("#todolist").toggle();

});
  
/*
*********************************************************************************************
TODO ITEMS LIST - DISPLAY
**********************************************************************************************
*/   
function maketodo()
 {
  $("#todolist").append("TODO list");
  let todomax=todolist.length-1;
   let i, temp;
    $('#todolist').empty().append("TODO LIST");
  for (i=0; i<=todomax; i++)
    {
      temp=todolist[i];
      if (todoliststatus[i]=="DONE")
      {
        $('#todolist').append("<br><i id='tododone' class='has-text-white far fa-square'></i><span class='mystrike' id='todoitem'> " +temp+ " </span><i id='tododel' class='has-text-white fas fa-times-circle'></i>");  
      }    
      else
      {
       $('#todolist').append("<br><i id='tododone' class='has-text-white far fa-square'></i><span id='todoitem'> " +temp+ " </span><i id='tododel' class='has-text-white fas fa-times-circle'></i>");  
      }    
      
      

    }
   // input form
   $('#todolist').append("<br><input autofocus type='text' id='gettodo' class='myform is-size-5 has-text-white' placeholder='What is your TODO?'><input type='submit' style='display:none'/>");
 }
  
 /*
*********************************************************************************************
TODOLIST ITEM DELETE 
**********************************************************************************************
*/


$("#todolist").on("click", "#tododel", function () {
           var i = $("#todolist").index(this);        
           console.log("Delete selected todo item");
            // remove from array
          
          console.log("Index is:"+i);
          todolist.splice(i,1);
          // remove from localStorage otherwise it is a zombie
          // localStorage.removeItem('myfocus');
          // reset the status
          //todoliststatus[i]="NEW";
          // clear variable too
          localStorage.setItem("todolist", JSON.stringify(todolist));
          maketodo();
        
}); 
  
 /*
*********************************************************************************************
TODOLIST ITEM DONE 
**********************************************************************************************
*/
  
$("#todolist").on("click", "#tododone", function () {
           var i = $("#todolist").index(this);        
           console.log("TODO ITEM TOGGLE");
  //
  // got striken?
  //
  // not children()/closest()/siblings/next
     if ( !$(this).next().hasClass('mystrike') ) {
        $(this).next().addClass('mystrike');
    } else {
        $(this).next().removeClass('mystrike');
    }
  
  // this.parent().hasClass...
  
});

  
 /*
*********************************************************************************************
TODOLIST Submitted on Return
**********************************************************************************************
*/
  
    $("#todolist").on("keypress", "#gettodo", function() {
              let temp,x;
              if ( event.which == 13 ) {
              event.preventDefault();
              temp=document.getElementById("gettodo").value;
              // TODO ************* store array
              // localStorage.setItem("myfocus", myfocus);
              // fruits.push("Kiwi");  
              todolist.push(""+temp);
              todoliststatus.push("OK");
              x=todolist.length-1;
              console.log("x is:"+x+" NEW TODO Task is: "+todolist[x]);  
              // store this!
              localStorage.setItem("todolist", JSON.stringify(todolist));
              maketodo();
  }
      });
  


 /*
*********************************************************************************************
INFO BOX TOGGLE
**********************************************************************************************
*/
 
 $("#info" ).click(function() {
   console.log("Toggling info box.");
      $("#infobox").toggle();
});


/*
*********************************************************************************************
FOCUS ITEM DONE
**********************************************************************************************
*/
  
$("#displayfocus").on("click", "#done", function () {
     i=0;
     console.log("Toggling status of focus item");
  // children/ closest / siblings / prevuntil
       if ( !$('#displayfocus').hasClass('mystrike') ) {
        $('#displayfocus').addClass('mystrike');
    } else {
        $('#displayfocus').removeClass('mystrike');
    }
  
});
  
/*
*********************************************************************************************
FOCUS ITEm DELETE
**********************************************************************************************
*/

  
  
$("#displayfocus").on("click", "#del", function () {
          console.log("Deleting focus item."+focuslist[0]);
          i=0;
          // remove from array
          focuslist.splice(i,1);
          // remove from localStorage otherwise it is a zombie
          localStorage.removeItem('myfocus');
          // reset the status
          focusstatus[i]="NEW";
          // clear variable too
          myfocus = undefined;
          $('#focus').show();
          $('#getfocus').focus();
          $('#showtime').hide();
          $('#showtimecomment').hide();
          $('#displayfocus').hide();
  
  
  
  
          //
          // get new focus
          //
            $("#getfocus").keypress(function( event ) {
              if ( event.which == 13 ) {
              event.preventDefault();
              myfocus=document.getElementById("getfocus").value;
              console.log("RESET OF Focus: "+myfocus);
              // set username 
              localStorage.setItem("myfocus", myfocus);
              // fruits.push("Kiwi");
              focuslist[0]=myfocus;
              focusstatus[0]="OK";
              $('#displayfocus').show();
          
      }
      });          
  
  
          
});  
   

  
  
 /*
************************************************
create the focus items
************************************************
*/
function makemefocus()
{
  var max=focuslist.length, i, done, del;
  // console.log("*makemefocus");
  // id="displayfocus"
  // $("#theRound").empty().append("Round: " + currentRound + " of "+maxround);
  $("#displayfocus").empty().append("TODAY'S FOCUS:");
  // add the content
  // console.log("focus array 0: "+focuslist[0]);
  for (i=0; i<=0; i++)
    {

      temp = focuslist[i];
      // so this just fires once
          $('#displayfocus').append("<br><i id='done' class='has-text-white far fa-square'></i> " +temp+ " <i id='del' class='has-text-white fas fa-times-circle'></i>");
          focusstatus[i]=="OK";
    }
}



/*
************************************************
create date object
************************************************
*/
function maketime()
{
  // console.log("*makingtime");
  var h,m,s,c;
  var timeis= new Date();
  h=addZero(timeis.getHours());	
  // set comment before we clean it up
  if (h < 4 || h > 18)
    {
      c="Good evening, "+ username;
    }
  else if (h >=5 && h<=12)
  {
    c="Good morning, "+ username;
  }
  else
    {
      c="Good afternoon, "+ username;
    }
  
 
  timecommentlink.innerHTML =c;
  if (h>12)
    {
      h=h-12;
    }
  m=addZero(timeis.getMinutes());	
  // s=addZero(timeis.getSeconds());	
  timeis = h + ":" + m;
  return timeis;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

/*
************************************************
every second update time
************************************************
*/
setInterval(function(){ 
    var temp;
    //
    // are things setup? if so show clock. show focuslist
    // console.log("* username is: "+username+" and myfocus is:"+myfocus);
    
    if ((username != undefined) && (myfocus != undefined))
    {
        $('#focus').hide();
        $('#mosetup').hide();
        temp=maketime();
        timelink.innerHTML =temp;
        $('#showtime').show();
        $('#timecomment').show();
        makemefocus();
        wcounter++;
        // console.log("wcounter is:"+wcounter);
    }
    
    // 3600 seconds in an hour - update all relevant API
      if (wcounter>=wmax)
      {
        updateWeather();
      }
  
  
    }, 1000);


/*
************************************************
get Random background from unsplash
************************************************
*/

  function getRandomBackground()
  {
     console.log("** GETTING BACKGROUND IMAGE!");
    //
    // source code: https://gist.github.com/0asa/3b7ffdd04e35b161e038cc2a71be4b7f > really just W3 example
    //
    var app_id = 'fba66b053360b9beaf303f316ad8fa7d7dc5fa90d114ff42b89a9adca3538be2'
    var url = 'https://api.unsplash.com/photos/random?client_id=' + app_id;    
    $.ajax({
    url: url,
    dataType: 'json',
    success: function(json) {
    var src = json.urls.regular;
    console.log("The background image city is:"+piccity);  
    piccountry = json.user.location;
    console.log("The country is "+piccountry);
    // set photo location  
    $('#picloc').append("Photo location:<br>"+piccountry);  
    // other  
    $('#selector').css('background-image','url('+src+')').css('background-size','cover');
      }
    });
  }

  
  
  
/*
************************************************
get current long & lat from ipgeolocation.io
************************************************
*/  
  
function getLocation()
{
  console.log("** GETTING LOCATION!");
  let data;
  $.ajax({
  type: 'GET',
  url: 'https://api.ipgeolocation.io/ipgeo?apiKey=3e330fcaf50d4fcb95021e547ddbd1b0',
  data: data,
  async: false,
  beforeSend: function (xhr) {
    if (xhr && xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json;charset=utf-8');
    }
  },
  dataType: 'json',
  success: function (data) {
    // console.log(data);
    long = data.longitude;
    lat = data.latitude;
     city = data.city;
    console.log("The city is: "+city+" found at long is:"+long+" and lat is"+lat);
  }
});
}

  
/*
************************************************
the apps to update when wcounter ticks over
************************************************
*/  
  
function updateWeather()
  {
     wcounter=0;
     getWeather();
     getRandomBackground();
     getQuote();
  }
  
/*
**************************************************************
get weather from openweathermap.org based on long and lat
*****************************************************************
*/    
function getWeather()
{
  console.log("** GETTING WEATHER REPORT!");
  // http://api.openweathermap.org/data/2.5/weather?lat=43.8828&lon=-79.4403&APPID=2d5e1ba217d5e059868832f1a326fc44
  let data,temp;
  temp= "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="+long+"&units=metric&APPID=2d5e1ba217d5e059868832f1a326fc44";
  $.ajax({
  type: 'GET',
  url: ''+temp,
  data: data,
  async: false,
  beforeSend: function (xhr) {
    if (xhr && xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json;charset=utf-8');
    }
  },
  dataType: 'json',
  success: function (data) {
    // console.log(data);
    wtemp = data.main.temp;
    // remove decimal
    wtemp = Math.round(wtemp);
 
    // icon is in weather array - so the array needs to be fleshed out first
    wicon = data.weather[0].icon;
   console.log("wicon:"+wicon+" and wtemp is"+wtemp);
  }
});
   // display the weather!!
   $('#weather').empty().append(""+city+"<br><img src='http://openweathermap.org/img/w/"+wicon+".png'>"+wtemp+"&deg;C"); 
         
}  

/*
*****************************************************************************************
get a quote from quotesondesign.com - the other has a paywall and errors. F that.
*********************************************************************************************
*/ 
function getQuote()
{
  let data;
  console.log("** GETTING QUOTE!");
  temp= "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
  $.ajax({
  type: 'GET',
  url: ''+temp,
  data: data,
  async: false,
  beforeSend: function (xhr) {
    if (xhr && xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json;charset=utf-8');
    }
  },
  dataType: 'json',
  success: function (data) {
    myquote = data[0].content;
    author = data[0].title;
  }
});
   // display the weather!!
   $('#quote').empty().append(""+myquote+" -"+author); 
         
}    
  

/*
end ready
*/
});

