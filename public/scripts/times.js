// define variables
var nativeTimePicker = document.querySelector('.nativeTimePicker');
var fallbackTimePicker = document.querySelector('.fallbackTimePicker');
var fallbackTimeLabel = document.querySelector('.fallbackTimeLabel');

var hourSelect = document.querySelector('#hour');
var minuteSelect = document.querySelector('#minute');

// hide fallback initially
fallbackTimePicker.style.display = 'none';
fallbackTimeLabel.style.display = 'none';

// test whether a new date input falls back to a text input or not
var testTime = document.createElement('input');
testTime.type = 'time';
// if it does, run the code inside the if() {} block
if(testTime.type === 'text') {
  // hide the native picker and show the fallback
  nativeTimePicker.style.display = 'none';
  fallbackTimePicker.style.display = 'block';
  fallbackTimeLabel.style.display = 'block';

  // populate the hours and minutes dynamically
  populateHours();
  populateMinutes();
}

function populateHours() {
  // populate the hours <select> with the 6 open hours of the day
  for(var i = 0; i <= 23; i++) {
    var option = document.createElement('option');
    option.textContent = i;
    option.value = i;
    hourSelect.appendChild(option);
  }
}

function populateMinutes() {
  // populate the minutes <select> with the 60 hours of each minute
  for(var i = 0; i <= 59; i++) {
    var option = document.createElement('option');
    option.textContent = (i < 10) ? ("0" + i) : i;
    option.value = (i < 10) ? ("0" + i) : i;
    minuteSelect.appendChild(option);
  }
}