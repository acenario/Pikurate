function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

function generateFormDict(form) {
  d = {};
  $(form).children().each(function() {
    if (!$(this).is("button") && ($(this).prop('id')) && $(this).prop('id').toLowerCase().indexOf('honey') == -1) {
      var key = $(this).prop('id');
      var val = escapeHtml($(this).val());
      d[key] = val;
    } else if ($(this).prop('name') == 'csrfmiddlewaretoken') {
      d['csrfmiddlewaretoken'] = escapeHtml($(this).val());
    }
  });

  return d;
}

function sendAjaxRequest(form, tableName, success, failFunc, errorFunc, extraData) {
  extraData = extraData || null;
  d = generateFormDict(form);
  var $submitform = $(form);
  var airtable_write_endpoint = "https://api.airtable.com/v0/appxJdoN7vM9OuKvg/" + tableName + "?api_key=keyk6YBQrq3cLKhkb";
  var final_dict = {};
  if (extraData !== null) {
    for (var key in extraData) {
      d[key] = extraData[key];
    }
  }
  final_dict["fields"] = d;
  $.ajax({
    url: airtable_write_endpoint,
    type: "POST",
    data: final_dict,
    success: function(data) {
      console.log(data)
      if (data != null) {
        success(data);
      } else {
        failFunc(form);
      }
    },
    error: function(xhr, status, error) {
      errorFunc(form);
    },
    dataType: "json"
  }).done(function(data) {});
}

$(document).ready(function(){

  var sentEmail = "";

  var classname = document.getElementsByClassName("inviteForm");
  
  function processInviteForm(element) {
      var form = $(element);
  }

  for (var i = 0; i < classname.length; i++) {
      var element = classname[i];
      if (element.addEventListener) {
        element.addEventListener("submit", function(evt) {
            evt.preventDefault();
            processInviteForm(element);
        }, true);
    } else {
          element.attachEvent('onsubmit', function(evt){
              evt.preventDefault();
              processInviteForm(element);
          });
      }
  }

  $(window).scroll(function(){
    if ($(this).scrollTop() > 10) {
     $('header').addClass('scrolling');
    } else {
     $('header').removeClass('scrolling');
    }
  });

  $('.scroll_to').click(function(e){
  	var jump = $(this).attr('href');
  	var new_position = $(jump).offset();
  	$('html, body').stop().animate({ scrollTop: new_position.top }, 700);
  	e.preventDefault();
  });

  function processInput(name, button) {
    var form = $(button).closest('form');
    var inputValue = $(form).find("[name="+name+"]").val()
    if (inputValue.length > 0) {
      if (name == "email" && validateEmail(inputValue)) {
        sentEmail = inputValue;
        $('.overlay').toggleClass('open');
        $('.complete').toggleClass('open');
        $('body').toggleClass('overflow-hidden');

        //SEND AJAX Request
        sendAjaxRequest(form, "Invites", function(data){
          console.log("email submitted!");
          console.log(data);
        }, function(f){
          console.log("failed");
        }, function(f){
          console.log("error");
        })
      }
      else if (name == "question") {
        //SEND AJAX request with email

        if (sentEmail.length > 0) {
          sendAjaxRequest(form, "Submission", function(data){
            $(form).fadeOut(300, function() {
              $(form).remove();
              $('span#thanks').html("<h1>Thank you!</h1>");
              // $('div#share').html("<a id='fb-share' type='icon_link' onClick='window.open('https://www.facebook.com/sharer/sharer.php?u=https://pikurate.com','sharer','toolbar=0,status=0,width=580,height=325');' href='javascript: void(0)'><form class='shareForm'><input type='submit' class='button-share' value='Share'></form></a>");
            });
          }, function(f){}, function(f){}, {"Email": sentEmail});
        }
      }
    }
  }

  $('.button-question').click(function(){
    processInput("question", $(this));
  });

  $('.button-test').click(function(){
    processInput("email", $(this));
  });

  $('.overlay, .close').click(function(){
    $('.overlay').toggleClass('open');
    $('.complete').toggleClass('open');
    $('body').toggleClass('overflow-hidden');
  });

});
