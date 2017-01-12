import '../css/app.scss';
import $ from "jquery";
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import 'waypoints';
import 'scrollTo';


//MY JS
var url = "https://www.youtube.com/embed/42H3WkALFzs?autoplay=1", chimeUrl="https://www.youtube.com/embed/8ob8LZFmILQ?autoplay=1";

var work = true, running, paused = false; //Booleans

var taskCount=0, taskElapsed=1, currentTask = "Work", taskMemory=0; //TASK related variables

var intervalId, initWorkTime = 25*60, initBreakTime = 5*60, totalSeconds, currentTimeLeft=25*60; //Main time display variables


window.convertTime = function (seconds) {
  var secs = seconds % 60;
  var minutes = Math.floor(seconds/60);
  return minutes +"<span class=\"minSecFormat\"> mins </span>" + secs + "<span class=\"minSecFormat\"> secs</span>";
}

function updateHtml(initial){
  intervalId = setTimeout(function () {
      updateHtml(initial);
    }, 100); 
    currentTimeLeft=totalSeconds-count(initial);
    if(work){
      taskElapsed=count(initial)+taskMemory;
      document.getElementById("task"+taskCount).innerHTML = convertTime(taskElapsed);
    }
    if (currentTimeLeft<=0 && work){
      window.switchDisplay();
      document.getElementById("video").src = url;
      document.getElementById("video").width = 250;
      document.getElementById("video").height = 200;
      document.getElementById("workOrBreak").innerHTML = "Take A Break";
      work=false; 
    }
    else if (currentTimeLeft<=0 && !work){
      window.switchDisplay()
      document.getElementById("video").src = chimeUrl;
      document.getElementById("video").width = 0;
      document.getElementById("video").height = 0;
      document.getElementById("workOrBreak").innerHTML = currentTask;
      work=true;
    } else {
      document.getElementById("timeLeft").innerHTML = convertTime(currentTimeLeft);
      document.getElementsByClassName("showTime")[0].innerHTML = convertTime(currentTimeLeft);
    }
} 

function count(initial){
    var currentTime = new Date().getTime();
    var elapsed = Math.floor((currentTime-initial)/1000)
    return elapsed
}

window.startTimer = function () {
  if(running){return}
  var initialTime = new Date().getTime();  //this grabs the current computer clock time and passes it to the count function
  running=true;
  if(!paused){
    if(taskCount==0 && work) {
      submitTask(currentTask);
      totalSeconds=0;
    }
  }
    if(work & !paused){
      totalSeconds=currentTimeLeft;
    } else if(work & paused) {
      totalSeconds=currentTimeLeft;
    }
    else {
      totalSeconds=initBreakTime;
    }
  updateHtml(initialTime);
} 

window.stopTimer = function () {
  clearTimeout(intervalId);
  taskMemory=taskElapsed;
  console.log(taskElapsed)
  running=false;
  paused=true;
}

window.resetTimer = function (){
  stopTimer();
  paused=false;
  document.getElementById("video").width = 0;
  document.getElementById("video").height = 0;
  document.getElementById("video").src ="";
  if(work){
    document.getElementById("timeLeft").innerHTML = convertTime(initWorkTime);
    currentTimeLeft=initWorkTime;
  } else {
    document.getElementById("timeLeft").innerHTML = convertTime(initBreakTime);
    currentTimeLeft=initBreakTime;
  }
}

window.switchDisplay = function (){
  stopTimer();
  if(!work) {
    currentTimeLeft=initWorkTime;
    document.getElementById("timeLeft").innerHTML = convertTime(currentTimeLeft);
    document.getElementById("workOrBreak").innerHTML = "Work";
    work=true;
  } else {
    totalSeconds=initBreakTime;
    document.getElementById("timeLeft").innerHTML = convertTime(totalSeconds);
    document.getElementById("workOrBreak").innerHTML = "Take A Break";
    work=false;
  }
} 

window.addTime = function (){
  
  if(running){
    totalSeconds+=60;    
  } else if (paused & !running) {
    currentTimeLeft+=60;
    document.getElementById("timeLeft").innerHTML = convertTime(currentTimeLeft);
  } else if(!running & !paused) {
    if(work) {
      initWorkTime+=60;
      document.getElementById("timeLeft").innerHTML = convertTime(initWorkTime);
    } else {
      initBreakTime+=60;
      document.getElementById("timeLeft").innerHTML = convertTime(initBreakTime);
    }
  }
}

window.removeTime = function(){
    if(running & totalSeconds>=60){
    totalSeconds-=60;    
  } else if (paused & !running & currentTimeLeft>=60) {
    currentTimeLeft-=60;
    document.getElementById("timeLeft").innerHTML = convertTime(currentTimeLeft);
  } else if(!running & !paused) {
    if(work & initWorkTime>=120) {
      initWorkTime-=60;
      document.getElementById("timeLeft").innerHTML = convertTime(initWorkTime);
    } else if(!work & initBreakTime >= 120) {
      initBreakTime-=60;
      document.getElementById("timeLeft").innerHTML = convertTime(initBreakTime);
    }
  }
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

window.submitTask = function (task){
  document.getElementById("taskForm").value = "";
  currentTask=task;
  taskMemory=0
  taskCount++;
  document.getElementById("workOrBreak").innerHTML = currentTask
  document.getElementById("taskList").innerHTML += "<div class=\"col-xs-6 currentTask\">" + taskCount+". " + currentTask + " </div><div class=\"col-xs-6 currentTask\">Time on Task: <span id=\"task" + taskCount + "\"></span></div>";
};


/**
 * EXAMPLE JS STARTS
 */
$(function() {
    $('[id^=scrollTo]').click(function() {
        var id = $(this).attr('id').slice(9);
        $(window).scrollTo($('#' + id), 1000, { offset: { top: -51, left: 0 } });
    });
});
/**
 * EXAMPLE JS ENDS
 */