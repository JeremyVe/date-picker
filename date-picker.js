'use strict';

function Calendar(el) {

  var datePicker, monthContainer, dayContainer, tableEl, monthTitle, dayName, dayNumber, prev, next;

  var today = new Date();
  var day = today.getDate(),
      month = today.getMonth(),
      year = today.getFullYear();

  var DAYS = ['Sunday', 'Monday', 'Thuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTH_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June',
               'July', 'August', 'September', 'October', 'November', 'December'];

  var selectedDate = {
    day: day,
    month: month,
    year: year,
    el: null
  }


  //Create a Full Calendar Element
  var createCalendar = function() {
    // left panel
    dayContainer = document.createElement('div');
    dayContainer.className = 'day-container';
    dayName = document.createElement('div');
    dayName.className = 'day';
    dayName.innerHTML = 'Monday';
    dayContainer.appendChild(dayName);
    dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.innerHTML = '24';
    dayContainer.appendChild(dayNumber);
    datePicker.appendChild(dayContainer);

    // right panel
    monthContainer = document.createElement('div');
    monthContainer.className = 'month-container';

    // month header
    var monthSelector = document.createElement('div');
    monthSelector.className = 'month-header';

    prev = document.createElement('span');
    prev.setAttribute('id', 'prev');
    prev.innerHTML = '&#8592;';
    monthSelector.appendChild(prev);


    monthTitle = document.createElement('span');
    monthTitle.setAttribute('id', 'month');
    monthTitle.innerHTML = 'November 2016';
    monthSelector.appendChild(monthTitle);

    next = document.createElement('span');
    next.setAttribute('id', 'next');
    next.innerHTML = '&#8594;';
    monthSelector.appendChild(next);

    monthContainer.appendChild(monthSelector);


    var calendarEl = document.createElement('div');
    // table header
    var tableWeek = document.createElement('table');
    tableWeek.className = 'table-week';
    var tr = document.createElement('tr');
    var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    days.forEach(function(day) {
      var th = document.createElement('th');
      th.appendChild(document.createTextNode(day));
      tr.appendChild(th);
    })
    tableWeek.appendChild(tr);
    calendarEl.appendChild(tableWeek);

    //calendar body
    tableEl = document.createElement('table');
    tableEl.setAttribute('id', 'calendar');
    for (var i = 0; i < 6; i++) {
      var tr = document.createElement('tr');

      for (var j = 0; j < 7; j++) {
        var td = document.createElement('td')
        tr.appendChild(td)
      }
      tableEl.appendChild(tr);
    }
    calendarEl.appendChild(tableEl);
    monthContainer.appendChild(calendarEl);
    datePicker.appendChild(monthContainer);
  }



  var refreshCalendar = function() {
    var firstDay = new Date(year, month).getDay();
    var maxDays = new Date(year, month + 1, -1).getDate(); // get last day of current month
    cleanCalendar();
    updateCalendar(firstDay, maxDays);
    updateMonthHeader();
  }


  var selectDateElement = function() {
    selectedDate['el'] = document.querySelector('[data-day="'+ day + '"]');
    selectedDate['el'].classList.add('selected');
    return selectedDate
  }

  var unselectDateElement = function() {
    selectedDate['el'] = document.querySelector('[data-day="'+ day + '"]');
    selectedDate['el'].classList.remove('selected');
    return selectedDate
  }

  var cleanCalendar = function() {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        var cell = tableEl.children[i].children[j];
        cell.removeAttribute('data-day');
        cell.innerHTML = '';
      }
    }
  }


  var updateCalendar = function(day, maxDays) {
    var row = 0;
    // loop through calendar and set day attribute and html to the current day
    for (var i = day; i <= maxDays + day; i++) {
      if (i !== 0 && i%7 == 0) { row++ }
      var cell = tableEl.children[row].children[i-7*(row)];
      cell.setAttribute('data-day', i-day+1);
      cell.innerHTML = i - day+1;
    }
  }


  var updateMonthHeader = function() {
    monthTitle.innerHTML = MONTH_ARRAY[month] + ', ' + year
  }


  var animDayChange = function() {
    dayContainer.classList.add('anim-pop');
    setTimeout(function() {
      dayContainer.classList.remove('anim-pop');
    }, 100)
  }


  var setCurrentDay = function() {
    dayName.innerHTML = DAYS[today.getDay()];
    dayNumber.innerHTML = today.getDate();

    animDayChange();
  }


  var selectDate = function(event) {
    if (!event.target.attributes['data-day']) { return false} // click on a day ?
    var cell = event.target;

    selectedDate['el'].classList.remove('selected');

    day = parseInt(cell.attributes['data-day'].value);
    today = new Date(year, month, day);
    selectedDate = {
      day: day,
      month: month,
      year: year,
      ['el']: cell,
    }
    cell.classList.add('selected');

    setCurrentDay();
  }


  var showSelectedDay = function() {
    return (month === selectedDate.month && year === selectedDate.year)? true : false;
  }


  var animCalendar = function(direction) {
    monthContainer.classList.add('anim-' + direction);
    setTimeout(function() {
      monthContainer.classList.remove('anim-' + direction);
    }, 100)
  }


  var getPrevMonth = function(event) {
    if (event.type == 'keypress' && event.keyCode !== 97) { return false } // key A

    animCalendar('prev');
    month = month - 1;
    if (month == -1) {
      month = 11;
      year--;
    }
    handleSelectedDate();
  }


  var getNextMonth = function(event) {
    if (event.type == 'keypress' && event.keyCode !== 100) { return false } // key D

    animCalendar('next');
    month = month + 1;
    if (month == 12) {
      month = 0;
      year++;
    }
    handleSelectedDate();
  }

  var handleSelectedDate = function() {
    if (!showSelectedDay()) {
      unselectDateElement();
    }
    refreshCalendar();
    if (showSelectedDay()) {
      selectDateElement();
    }
  }


  var initializeCalendar = function() {
    createCalendar();
    refreshCalendar();
  }


  var setFirstSelection = function() {
    selectedDate = selectDateElement();
    setCurrentDay();
  }

  var initializeListener = function() {
    prev.addEventListener('click', getPrevMonth.bind(this));
    document.addEventListener('keypress', getPrevMonth.bind(this));
    next.addEventListener('click', getNextMonth.bind(this));
    document.addEventListener('keypress', getNextMonth.bind(this));
    tableEl.addEventListener('click', selectDate.bind(this));
  }


  var init = function() {
    datePicker = document.getElementById(el)
    initializeCalendar();
    setFirstSelection();
    initializeListener();
  }
  init()
}

var calendar = new Calendar('date-picker');
