import React,{useState,useRef,useEffect} from 'react';
import {Typography,Button,Paper,Container,Box} from '@mui/material';
import {root,labelStyle,decrementButton,IncrementButton,startStopButton,resetButton,timeLeftStyle} from './styles.js'


//use a react hook to control the count down of the clock
/*this custom react hook is posted and copy from Dan Abramov's personal blog, the link is
https://overreacted.io/making-setinterval-declarative-with-react-hooks/
*/

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const Clock = ()=>{

  //set the default value of the break length,session length.
const [breakLength,setBreakLength]=useState(300);
const [sessionLength,setSessionLength]=useState(1500);
let [timeLeft,setTimeLeft]=useState(sessionLength);
const [started,setStarted]=useState(false);

//use the label variable to show if the clock is in "break" or "session" status
const [label,setLabel]=useState('Session');
const [audio] = useState(new Audio('https://bigsoundbank.com/UPLOAD/mp3/1111.mp3'));

useInterval(()=>{
  if(timeLeft>0&&started){
  setTimeLeft(timeLeft-1);
}else if(timeLeft==0&&label=='Session'){
  setLabel('Break');
  setTimeLeft(breakLength);

}else if(timeLeft==0&&label=='Break'){
  setLabel('Session');
  setTimeLeft(sessionLength);
}
},1000)

let isFirst = true;

const sessionBreakSwitch=()=>{
  if(label=='Session'){
    setLabel('Break');
    setTimeLeft('Break')
  }else{
    setLabel('Session');
    setTimeLeft(sessionLength);
  }
}

  var myAudio=document.getElementById('beep');

  if(timeLeft===0){
    console.log('start the play the sound')
    myAudio.play();
  }

const reset=()=>{
  setTimeLeft(25*60);
  setBreakLength(5*60);
  setSessionLength(25*60);
  setStarted(false);
  setLabel('Session');
  myAudio.pause();
  myAudio.currentTime=0;
}

//switch whether the clock is running
const startStopSwitch=()=>{

  setStarted(!started);
  if(started){
    console.log('timer should be running now');
  }else{
    console.log('timer should not be running now ')
  }
}

const breakDecrement=()=>{
 if(breakLength>60&&breakLength<3660){
   setBreakLength(breakLength-60);
   if(started==false&&label=='Break'){
       setTimeLeft(breakLength-60);
   }
 }else{
   setBreakLength(60);
   if(started==false&&label=='Break'){
       setTimeLeft(breakLength);
   }
 }
}

const breakIncrement=()=>{
  if(started==false&&label=='Break'&&breakLength<3600){
  setTimeLeft(breakLength+60);
};
(breakLength<3600)?setBreakLength(breakLength+60):setBreakLength(3600);
}

const sessionDecrement=()=>{
  if(started==false&&label=='Session'&&sessionLength>60){
  setTimeLeft(sessionLength-60);
  }
  (sessionLength>60)?setSessionLength(sessionLength-60):setSessionLength(60);
}

const sessionIncrement=()=>{
  if(started==false&&label=='Session'&&sessionLength<3600){
  setTimeLeft(sessionLength+60);
  }
  (sessionLength<3600)?setSessionLength(sessionLength+60):setSessionLength(3600);
}

return (
  <Container>
  <Typography variant="h2" style={{fontWeight:'600',color:'darkGrey',textAlign:'center',marginTop:"25vh"}}>🍅 Pomodoro Clock 🍅</Typography>

  <div id='root' style={root}>
    <div style={{display:'flex',boxSizing: 'border-box',padding:"15px 0",marginTop:"15px"}}>
     <div style={{textAlign:'center',width:'50%',align:'left'}}>
      <Typography id= 'break-label' variant='h5' >Break Length</Typography>
      <Typography id='break-length' variant='h5' style={{backgroundColor:'whitesmoke',margin:'10px 135px'}}>{breakLength/60}</Typography>

      <Button id ='break-decrement' disabled={started} variant="contained" style={decrementButton} onClick={()=>{breakDecrement()}}
      >
       ⬇
       </Button>
      <Button id ='break-increment' disabled={started} variant="contained"
          style={IncrementButton}
          onClick={()=>{breakIncrement()}}
      >⬆</Button>
     </div>

      <div style={{textAlign:'center',width:'50%',align:'right'}}>
       <Typography id= 'session-label' variant='h5'>Session Length</Typography>
       <Typography id='session-length' variant='h5' style={{backgroundColor:'whitesmoke',margin:'10px 135px'}}>{sessionLength/60}</Typography>
       <Button variant='contained' style={decrementButton}
           id ='session-decrement' disabled={started}
          onClick={()=>{sessionDecrement()}}
        >
        ⬇
       </Button>
       <Button id ='session-increment' disabled={started} variant='contained' style={IncrementButton}
          onClick={()=>{sessionIncrement()}}
       >
        ⬆
      </Button>
      </div>
    </div>

     <div style={{textAlign:'center',boxSizing: 'border-box',marginBottom:"20px"}}>
      <Typography id="timer-label" variant='h5' style={labelStyle}>{label}</Typography>
      {/*
        If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).
       */}
      <Typography id="time-left" variant="h2" style={timeLeftStyle}>{Math.floor(timeLeft/600)}{Math.floor(timeLeft%600/60)}:{Math.floor(timeLeft%60/10)}{timeLeft%60%10}</Typography>

      <Button id="start_stop" variant='contained' style={startStopButton} onClick={startStopSwitch}>{started?'Pause':'Start'}</Button>
      <Button id="reset" variant="contained" style={resetButton} onClick={reset}>reset
      <audio id="beep" src='https://bigsoundbank.com/UPLOAD/mp3/1111.mp3' />
      </Button>
     </div>
     <Typography style={{textAlign:'center',marginTop:'40vh'}}>© 2022 Pomodoro Clock by <a href="https://github.com/TongW5/Pomodoro-Clock">Tong Wu</a></Typography>
  </div>
  </Container>
)
}
