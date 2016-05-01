var selectType = true;
var shift = false;
var thisNum;
var lastNum;
var lowerNum;
var higherNum;
var checkboxBeyondButtons;
var containsProtected = false;
var containsHidden = false;
var containsUnprotected = false;
var containsUnHidden = false;
$( document ).keydown(function(event) {
  if (event.which == 16) {
    shift = true;
  }  
});

$( document ).keyup(function(event) {
  if (event.which == 16) {
    shift = false;
  }  
});

$('#checkList').scroll(function() {     
    var scroll = $('.checkList').scrollTop();
    if (scroll > 0) {
        $(".topMenu").addClass("active");
    }
    else {
        $(".topMenu").removeClass("active");
    }
    /*
    var checkList = document.getElementById('checkList');
    if (checkList.scrollHeight - checkList.scrollTop === checkList.clientHeight) {
    }
    */
});

function recalcCheckListHeight() {
  var buttonGroupTop = document.getElementById('lastButtonBlock').getBoundingClientRect().top;
  if ($( ".sheetCheckWrapper:last" )[0].getBoundingClientRect().bottom > buttonGroupTop) {
    $('#lastButtonBlock').addClass('coveringButtonGroup');
    checkboxBeyondButtons = true;
    $('.checkList').css('height', buttonGroupTop - document.getElementById('fixedTopMenu').getBoundingClientRect().bottom);
    
  }
  else {
    $('#lastButtonBlock').removeClass('coveringButtonGroup');
    checkboxBeyondButtons = false;
    $('.checkList').css('height', 'auto');
  }
}

//function groupSelector() {
//
//  $( ".sheetCheckbox" ).each(function(){
//    $(this).prop('checked', selectType);
//  });
//  $( ".sheetCheckbox" ).parent().addClass('selected');
//  $(".sheetCheckbox:not(:checked)").parent().removeClass('selected');
//  selectType = !selectType;
//  if (selectType == false) {
//    document.getElementById('selectAllText').innerHTML = 'Deselect All';
//  }
//  else {
//    document.getElementById('selectAllText').innerHTML = 'Select All';
//  }
//}

function onGetNamesFailure(error) {
 $('.loader').remove();
 insertErrorText('Names could not be retrieved. Please close this sidebar and try again.")
}
 
//$( ".SelectAllCheckWrapper" ).click(function() {
//  configureButtons();
//  $('.errorText').remove();
//  recalcCheckListHeight();
//  var checkBox = $(this).find(">:first-child");
//  checkBox.prop('checked', !checkBox.prop('checked'));
//  $( ".sheetCheckbox:checked" ).parent().addClass('selected');
//  $(".sheetCheckbox:not(:checked)").parent().removeClass('selected');
//});
// 
//$( ".SelectAllCheckbox" ).click(function( event ) {
//  event.stopPropagation();
//  configureButtons();
//  $('.errorText').remove();
//  recalcCheckListHeight();
//  $( ".sheetCheckbox:checked" ).parent().addClass('selected');
//  $(".sheetCheckbox:not(:checked)").parent().removeClass('selected');   
//});

function addSelected($elementToAddClassTo) {
  $( ".sheetCheckbox:checked" ).parent().addClass('selected');
  $(".sheetCheckbox:not(:checked)").parent().removeClass('selected');
  $(".lastClicked").removeClass('lastClicked');
  $elementToAddClassTo.addClass('lastClicked');
}
 
function onGetNamesSuccess(names) {
  //$('.SelectAllCheckbox').prop('checked', false);
  selectType = true;
  //document.getElementById('selectAllText').innerHTML = 'Select All';
  //$( ".sheetCheckWrapper" ).remove();
  if (names !== null) {
    for (var i = 0; i < names.length; i++) {
      $('.checkList').append('<div id="' + i + '" class="sheetCheckWrapper"><input class="sheetCheckbox" type="checkbox" data-nameObject="' + JSON.stringify(names[i]) + '">' + names[i].firstName + names[i].lastName + '</div>');    
    }
  }
  $( ".sheetCheckbox" ).click(function( event ) {
    event.stopPropagation();
    $('.errorText').remove();
    recalcCheckListHeight();
    if (shift == true) {
      thisNum = +$(this).parent().prop('id');
      lastNum = +$('.lastClicked').prop('id');
      lowerNum = Math.min(thisNum, lastNum) + 1;
      higherNum = Math.max(thisNum, lastNum);
        for (var i = lowerNum; i < higherNum; i++) {
          var checkBox = $('#' + i.toString()).find(">:first-child");
          checkBox.prop('checked', !checkBox.prop('checked'));
        }    
    }
    addSelected($(this).parent()); 
    configureButtons();
  });
  
  $( ".sheetCheckWrapper" ).click(function() {
    $('.errorText').remove();
    recalcCheckListHeight()
    if (shift == true) {
      thisNum = +$(this).prop('id');
      lastNum = +$('.lastClicked').prop('id');
      lowerNum = Math.min(thisNum, lastNum) + 1;
      higherNum = Math.max(thisNum, lastNum);
      for (var i = lowerNum; i < higherNum; i++) {
        var checkBox = $('#' + i.toString()).find(">:first-child");
        checkBox.prop('checked', !checkBox.prop('checked'));
      }   
    }  
    var checkBox = $(this).find(">:first-child");
    checkBox.prop('checked', !checkBox.prop('checked'));
    addSelected($(this));  
    configureButtons();
  });
  
  $('.loader').remove();
  $('button').attr("disabled", false);
 recalcCheckListHeight();

} // end onGetSheetsSuccess

function refresh() {
  $('.errorText').remove();
  $( ".sheetCheckWrapper" ).remove();
  $('.checkList').append('<span class="blue loader"><span class="blueInner loader-inner"></span></span>');
  google.script.run.withSuccessHandler(onGetNamesSuccess).withFailureHandler(onGetNamesFailure).gsGetNames();
}

refresh();

$( window ).resize(function() {
  recalcCheckListHeight();
});

function insertErrorText (error) {
  if (checkboxBeyondButtons == false) {
    $('.checkList').append('<p class="errorText" id="selectError">' + error + '</p>');
  }
  else {
      $('#lastButtonBlock').prepend('<p class="aboveButtons errorText" id="firstError">' + error + '</p>');
      recalcCheckListHeight();
  }
}

function onSubmitSuccess() {
google.script.host.close();
}

function onSubmitFailure(error) {
  $('.loader').remove();
  $('button').attr("disabled", false);
  $('#lastButtonBlock').before('<p class="errorText" id="firstError">Attendance could not be submitted. Please try again.</p>');
}

$( "#submit" ).click(function() {
  $('button').attr("disabled", true);
  $('.errorText').remove();
  recalcCheckListHeight();
  var selected = [];
  $('.checkList input:checked').each(function() {
    selected.push($(this).data('nameObject'));
  });

  $('#lastButtonBlock').after('<span class="loader"><span class="loader-inner"></span></span>');
  google.script.run.withSuccessHandler(onSubmitSuccess).withFailureHandler(onSubmitFailure).gsSumbitAttendance(selected);
});