const ezCalendar = function () {
  let _this = this, 
    root,
    lastMonthBtn,
    nextMonthBtn,
    monthTitle,
    days,
    months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    offsetMonth = 0,
    offsetYear = 0

  root = document.createElement('div')
  root.className = 'ezCalendar'
  root.innerHTML = `
    <div class="monthNav">
      <span class="lastMonth"> < </span>
      <span class="monthTitle"></span>
      <span class="nextMonth"> > </span>
      <div class="dateClock"></div>
    </div>
    <div class="dates">
      <div class="week"></div>
      <div class="days"></div>
    </div>
  `

  lastMonthBtn = root.children[0].children[0]
  monthTitle = root.children[0].children[1]
  nextMonthBtn = root.children[0].children[2]
  week = root.children[1].children[0]
  days = root.children[1].children[1]
  
  this.jumpToToday = function(){
    let d = new Date()

    _this.setCalender(d.getFullYear(), d.getMonth());
    offsetMonth = 0
    offsetYear = 0
  }

  this.setCalender = function (year, month) {
    let lastDay,
      monthIdx,
      dailyDays = [],
      dailyDaysReverse = [],
      offsetpreyear = Math.floor((month - 1 ) / 12),
      offsetnextyear = Math.floor((month + 1) / 12),
      endDayInLastWeek,
      startDayInFirstWeek

      // Get the day of week of the first day in current month
      startDayInFirstWeek =  getDay(year, month, 1)
      // Get the day of week of the last day in current month
      endDayInLastWeek = getDay(year, month+1, 0)   
      // total days of the current month             
      lastDay = getLastDay(year, month)                           

      offsetYear = Math.floor((month)/12)
      // if the first day is not Monday, fill up the lacking dates
      if(startDayInFirstWeek >0 ){
        let last = -(startDayInFirstWeek-1)
        for(let i=1; i <= startDayInFirstWeek; i++){
          dailyDays.push({"day": getdate(year, month, last), "month": convertMonth(month-1), "year": year+offsetpreyear})
          last++;
        }
      }

      for(let s=1; s <= lastDay; s++){
        dailyDays.push({"day":s, "month": convertMonth(month), "year": year+offsetYear})
      }

      // if the last day is not Sunday, fill up the remaining dates
      if(endDayInLastWeek < 6){
        let more = 6 - endDayInLastWeek
        for(let i=1; i<=more; i++){
          dailyDays.push({"day": getdate(year, month+1, i), "month": convertMonth(month+1), "year": year+offsetnextyear})
        }
      }

      // Fill up the dates if the total dates in calender less than 42
      if(dailyDays.length<42){
        //Fill up the beginning dates
        if(startDayInFirstWeek == 0){
          for(let i=0;i<7;i++){
            dailyDays.splice(0,0,{"day": getdate(year, month, -(i)), "month": convertMonth(month-1), "year": year+offsetpreyear})
          }
        }
        //Fill up the end of dates
        if(endDayInLastWeek == 6){
            for(let i=1; i<=7; i++){
              dailyDays.push({"day": i, "month": convertMonth(month+1), "year": year+offsetnextyear})
            }
          }
        //頭尾都補過, 補尾
         if((startDayInFirstWeek != 0) && (endDayInLastWeek != 6)){
          for(let i=1; i<=7; i++){
            dailyDays.push({"day": dailyDays[dailyDays.length-1].day+1, "month": convertMonth(month+1), "year": year+offsetnextyear})
          }
        }
      }
      
      for(let i=0; i<7; i++){
        for(let j=i; j<dailyDays.length; j += 7){
          dailyDaysReverse.push(dailyDays[j])
        }
      }

      monthIdx = convertMonth(month)
      monthTitle.innerHTML = (year+offsetYear) + '年/' + (months[monthIdx])
      renderDates(dailyDaysReverse, monthIdx)
    }

  this.lastMonth = function () {
    let d = new Date()

    offsetMonth = offsetMonth - 1;
    _this.setCalender(d.getFullYear(), d.getMonth()+offsetMonth);
  }

  this.nextMonth = function () {
    let d = new Date()

    offsetMonth = offsetMonth + 1 
    _this.setCalender(d.getFullYear(), d.getMonth()+offsetMonth)
  }

  this.render = function (ele){
    renderWeek()
    _this.jumpToToday()
    ele.appendChild(root)
  }

  this.destroy = function () {
    if(root.parentElement) root.parentElement.removeChild(root)
  }

  
  try {
    lastMonthBtn.addEventListener('click', this.lastMonth)
    nextMonthBtn.addEventListener('click', this.nextMonth)
  } catch (error) {
    lastMonthBtn.attachEvent('onclick', this.lastMonth)
    nextMonthBtn.attachEvent('onclick', this.nextMonth)
  }

  function getLastDay (year, month){
    let d = new Date()
    d.setFullYear(year, month+1, 0)
    return d.getDate()
  }

  function getDay (year, month, day){
    // Returns the day of the week[from 0~6]
    let d = new Date()
    d.setFullYear(year, month, day)
    return d.getDay()
  }

  function getdate(year, month, day){
    // Returns the date[from 1~31]
    let d = new Date()
    d.setFullYear(year, month, day)
    return d.getDate();
  }

  function convertMonth (m){
    //Convert the month greater than 12 or less than 0 to 0~11  
    m = m%12
    if(m < 0){
      m = m+12
    }
    return m
  }

  function renderWeek() {
    let div,
      w = ['日','一','二','三','四','五','六']
      
    while(week.children[0]) week.removeChild(week.children[0])
    w.forEach(function(day) {
      div = document.createElement('div')
      if(/'六'|'日'/.test(day)) div.className = 'txRed'
      div.innerHTML = day
      week.appendChild(div)
    });
  }

  function renderDates(dates, monthIdx) {
    let d = new Date(),
      today = d.getDate(),
      thisMonth = d.getMonth(),
      thisYear = d.getFullYear()

    while(days.children[0]) days.removeChild(days.children[0])
    dates.forEach(function(obj, index) {
      let div

      div = document.createElement('div')
      div.className = 'day'
      div.innerHTML = `
        <div class="text">${obj.day}</div>
      `
      if(obj.month != monthIdx) div.className += ' opacity5'
      if(index <6 || index > 35) div.className += ' holiday'
      if(thisYear == obj.year && thisMonth == obj.month && today == obj.day) div.className += ' today'
      if(obj.selected) div.className += ' selected'

      try {
        div.addEventListener('click', selectedDay)
      } catch (error) {
        div.attachEvent('onclick', selectedDay)
      }

      days.appendChild(div)
    })
  }
  
  function selectedDay() {
    
  }
}