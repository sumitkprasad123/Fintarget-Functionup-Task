import {useState} from 'react'
import "./navbar.css"
import { IoMdArrowDropdown } from "react-icons/io";

const Navbar = ({liveData,sortInstrument,sortTime}) => {
   const [open1,setOpen1] = useState(false)
   const [open2,setOpen2] = useState(false)

 
  return (
    <div className='navbar'>
        <div className="container">
             <div className="option">
                <span className='title'>Filter :-</span>
                <div className='instrument'
                    onClick={() =>{ 
                        setOpen1(!open1)
                        setOpen2(false)
                    }}
                 >
                    <span>Instrument <IoMdArrowDropdown className='icon' /></span>
                    {open1 && (
                    <div className="leftMenu">
                        <span onClick={() => sortInstrument({"instrument":"Nifty"})}>Nifty</span>
                        <span onClick={() => sortInstrument({"instrument":"Banknifty"})}>Banknifty</span>
                        <span onClick={() => sortInstrument({"instrument":"Finnifty"})}>Finnifty</span>
                    </div>
                  )}
                </div>
                <div className='time'
                   onClick={() =>{ 
                    setOpen2(!open2)
                    setOpen1(false)
                  }}
                   >
                    <span>Time <IoMdArrowDropdown className='icon' /></span>
                    {open2 && (
                    <div className="leftMenu">
                        <span onClick={() => sortTime({"time":60000})}>1 min</span>
                        <span onClick={() => sortTime({"time":180000})}>3 min</span>
                        <span onClick={() => sortTime({"time":300000})}>5 min</span>
                    </div>
                  )}
                </div>
             </div>
              <div className="result">
                 <div>Nifty:<span> {liveData.Nifty}</span></div>
                 <div>Banknifty: <span> {liveData.Banknifty}</span></div>
                 <div>Finnifty:<span> {liveData.Finnifty}</span></div>
              </div> 
        </div>
    </div>
  )
}

export default Navbar