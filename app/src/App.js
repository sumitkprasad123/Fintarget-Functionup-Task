import './App.css';
import { useState, useEffect, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'
import Navbar from "./components/Navbar"
import * as dayjs from 'dayjs'


function App() {

  const [liveData, setLiveData] = useState({});
  const [oneMinData, setOneMinData] = useState([]);
  const [threeMinData, setThreeMinData] = useState([]);
  const [fiveMinData, setFiveMinData] = useState([]);
  const ref = useRef({"instrument":"Nifty","time":60000})


// option for ReactApexChart
  const options = {
    chart: {
      height: 1050,
      type: 'candlestick',
    },
    title: {
        text: `${ref.current.instrument} stock     ${ref.current.time/60000} min`,
        align: "left",
    },
    annotations: {
      xaxis: [
        {
          x: new Date(),
          borderColor: '#00E396',
          label: {
            borderColor: '#00E396',
            style: {
              fontSize: '12px',
              color: '#fff',
              background: '#00E396'
            },
            orientation: 'horizontal',
            offsetY: 7,
            text: 'Annotation Test'
          }
        }
      ]
    },
    xaxis: {
      type: 'category',
      labels: {
        formatter: function(val) {
          return dayjs(val).format('MMM DD HH:mm')
        }
      }
    },
    yaxis: {
        tooltip: {
            enabled: true,
        },
    },
};
// -------------------------------------------------------//
// getting data from socket.io
  useEffect(() => {
    const socket = new WebSocket('wss://functionup.fintarget.in/ws?id=fintarget-functionup');

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (typeof message === 'object') {
        //   Update WebSocket live data
          setLiveData(message);
        }
    });

    socket.addEventListener('error', (event) => {
         console.error('WebSocket error:', event);
    });

    return () => {
      // Cleanup WebSocket connection when component unmounts
       socket.close();
      };
    }, []);

   // --------------------------------------//
  //  main function 
   const timestamp = new Date().getTime();

   useEffect(()=> {
      let mainValue = []
      mainValue.push(liveData[ref.current.instrument])
     
      const id = setInterval(() => {
          mainFn(mainValue)
        },ref.current.instrument)

       
      return () => {
        clearInterval(id)
      }
    },[liveData])

   var mainFn = (mainValue) => {
    let max = -Infinity
    let min = Infinity

   for(let i=0;i<mainValue.length;i++){
       if(max<mainValue[i]){
         max=mainValue[i]
       }
       if(min>mainValue[i]){
         min=mainValue[i]
       }
   }
  //  console.log(max,min)
    let new_data = [mainValue[0],max,min,mainValue[mainValue.length-1]]
    let obj = {
        "x":new Date(timestamp).getSeconds(),
        "y":new_data
     }

     if(ref.current.time===300000){
        setFiveMinData([...fiveMinData,obj])
     }else if(ref.current.time===180000){
        setThreeMinData([...threeMinData,obj])
    }else{
        setOneMinData([...oneMinData,obj])
    }
    
    mainValue = []
   }

  //  sorting with instrument
   const sortInstrument = (value) => {
     ref.current.instrument = value.instrument
     console.log(ref)
   }
  //  sorting with time
   const sortTime = (value) => {
     ref.current.time = value.time
   }

   
  return (
    <div className="App">
         <Navbar
            liveData={liveData}
            sortInstrument={sortInstrument}
            sortTime={sortTime}
          />
          <h1 style={{textAlign:"center"}}>
             Algowiz Candlestick Chart
          </h1>
         <div style={{ width: "100vh", height: "100%", margin:"auto"}}>
              <ReactApexChart
                  options={options}
                  series={
                      [{
                          "data":ref.current.time === 60000?oneMinData:ref.current.time===180000?threeMinData:fiveMinData
                      }]
                  }
                  type="candlestick"
              />
         </div>
    </div>
  );
}

export default App;
