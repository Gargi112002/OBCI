import './palette.css';
import "./responsive.css";
import {useEffect, useRef, useState} from 'react';

import axios from 'axios';
// import {EditControl} from "react-leaflet-draw"
// import {FeatureGroup} from "react-leaflet"
// import Cursor from '../Cursor/Cursor';


const DrawingCanvas = () => {
    const colors = [
        "#000000",
        "#464646",
        "#787878",
        "#980031",
        "#ed1d25",
        "#ff7d01",
        "#ffc30e",
        "#a7e71d",
        "#23b14c",
        "#03b8ef",
        "#4c6cf3",
        "#303699",
        "#6e3198",
        "#ffffff",
        "#dcdcdc",
        "#9c593c",
        "#ffa3b1",
        "#e5aa7a",
        "#f5e59c",
        "#fff9be",
        "#d3f9bc",
        "#9cbb60",
        "#99d9eb",
        "#6f99d2",
        "#d6c7bd",
        "#b8a68c"
      ];
      //const [background,setBackground] = useState("#0714115");
      const [selected, setSelected] = useState("#000000");

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isInitiating, setIsInitiating] = useState(true)

    const [option, setOption] = useState("")
    const [lastPoint,setlastPoint] = useState({})
    const[type,setType] = useState("");
    const canvasOffSetX = useRef(null);
    const canvasOffSetY = useRef(null);
    const startX = useRef(null);
    const startY = useRef(null);
  


    useEffect(() => {
        console.log("in use effect")
        console.log(selected)
        const canvas = canvasRef.current;
        if (!canvas) return ;
        // canvas.width = 1350;
        // canvas.height = 500;
        if (isInitiating) {
            let parentElement = canvas.parentElement;
            if (parentElement) {

                canvas.width = 1350;
                canvas.height = 500 ;
            }
            canvas.style.border = "solid black 1px";
            canvas.style.background = "white" ;
        }
        
        const context = canvas.getContext("2d");
        if (context == null) return ;

        context.lineCap = "round";
        context.strokeStyle = selected;
        context.lineWidth = 5;
        contextRef.current = context;

        const canvasOffSet = canvas.getBoundingClientRect();
        canvasOffSetX.current = canvasOffSet.top;
        canvasOffSetY.current = canvasOffSet.left;
        console.log(canvasOffSetX, canvasOffSetY)
        //if (!contextRef.current) alert("erreur useEffect" )

        setIsInitiating(false) ;
    }, [selected]);

    const startDrawing = (nativeEvent) => {
        console.log(nativeEvent)
        const {offsetX, offsetY} = nativeEvent;
        if (!contextRef.current) console.log("erreur startDrawing")
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
       nativeEvent.preventDefault();
    };

    const draw = (nativeEvent) => {
        if(!isDrawing) 
            return;
        console.log("drawing")
        const {offsetX, offsetY} = nativeEvent;
        console.log({offsetX, offsetY});
        
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
       nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        if (!contextRef.current) console.log("erreur finishDrawing")
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const setToDraw = () => {
        contextRef.current.globalCompositeOperation = 'source-over';
        
    };

    const setToErase = () => {
        contextRef.current.globalCompositeOperation = 'destination-out';
    };
    

    const startDrawingRectangle = (nativeEvent) => {
        // const {canvasOffSetX,canvasOffSetY } = nativeEvent;
        if (!contextRef.current) console.log("erreur startDrawing Rect")
  
            console.log("canvasOffset",canvasOffSetX)
            console.log("StartX",startX)
         contextRef.current.beginPath();
         startX.current = nativeEvent.clientX - canvasOffSetX.current;
         startY.current = nativeEvent.clientY - canvasOffSetY.current;
         setIsDrawing(true);
         nativeEvent.preventDefault();
         nativeEvent.stopPropagation();
     };
 
     const drawRectangle = (nativeEvent) => {
         if(!isDrawing) 
         return;
     console.log("drawing rect")
         console.log(contextRef)
        //  nativeEvent.preventDefault();
        //  nativeEvent.stopPropagation();
 
         const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
         const newMouseY = nativeEvent.clientY - canvasOffSetY.current;
 
         const rectWidht = newMouseX - startX.current;
         const rectHeight = newMouseY - startY.current;
 
         contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
 
         contextRef.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
     };
 
     const stopDrawingRectangle = () => {
        if (!contextRef.current) console.log("erreur finishDrawing")
        contextRef.current.closePath();
         setIsDrawing(false);
     };
// // const _created = e => console.log(e);
    const startDrawingTriangle =(nativeEvent) => {
 
        console.log(nativeEvent)
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();
         const {canvasOffSetX,canvasOffSetY } = nativeEvent;
        // startX.current = nativeEvent.clientX - canvasOffSetX.current;
        // startY.current = nativeEvent.clientY - canvasOffSetY.current;
        
       setIsDrawing(true);

        // if(lastPoint = { x: nativeEvent.canvasOffSetX, y: nativeEvent.OffSetY })
        // console.log("lpt",lastPoint)
        // {
        //      drawTriangle
        //}
       var lastPoint = { x: nativeEvent.offsetX, y: nativeEvent.offsetY};
       console.log(lastPoint)
       setlastPoint(lastPoint)
       var startPoint = lastPoint;  
    }
    
  
    const drawTriangle = (nativeEvent) => {
        if (!isDrawing) {
            return;
        }
        // startX.current = nativeEvent.clientX - canvasOffSetX.current;
        // startY.current = nativeEvent.clientY - canvasOffSetY.current;
        var mx = nativeEvent.offsetX;
        var my = nativeEvent.offsetY;
        console.log(mx, my)
        contextRef.current.clearRect(0,0,contextRef.current.canvas.width , contextRef.current.canvas.width);
        var twidth = Math.abs(mx - lastPoint.x) ;
       var theight = Math.abs(my - lastPoint.y) ;

        contextRef.current.beginPath()
        // contextRef.current.moveTo(75, 25
        // contextRef.current.lineTo(100, 75)
        // contextRef.current.lineTo(100, 25)
        // contextRef.current.lineTo(75, 25)
        // contextRef.current.stroke()
        // contextRef.current.closePath()

        // contextRef.current.moveTo(mx, my );
        // contextRef.current.lineTo(mx, my);
        // contextRef.current.moveTo(mx-(2*twidth), my );
        // contextRef.current.lineTo(mx, my);
        // contextRef.current.moveTo(mx, my );
        // contextRef.current.lineTo(mx-(2*twidth), my );
       
        // contextRef.current.beginPath();
        // contextRef.lineWidth = 3;
        // contextRef.lineJoin = contextRef.lineCap = 'round';
         contextRef.current.setLineDash([0, 0]);
         contextRef.current.globalAlpha = 1.0;


        // // if ( mx >= startPoint.x ) {
        //     contextRef.current.moveTo(lastPoint.x, lastPoint.y );
        //     contextRef.current.lineTo(mx, my);
        //     contextRef.current.moveTo(mx-(2*twidth), my );
        //     contextRef.current.lineTo(mx, my);
        //     contextRef.current.moveTo(lastPoint.x, lastPoint.y );
        //     contextRef.current.lineTo(mx-(2*twidth), my );
        //  } else {
        //     contextRef.moveTo(startPoint.x, startPoint.y );
        //     contextRef.lineTo(mx, my);
        //     contextRef.moveTo(mx+(2*twidth), my );
        //     contextRef.lineTo(mx, my);
        //     contextRef.moveTo(startPoint.x, startPoint.y );
        //     contextRef.lineTo(mx+(2*twidth), my );
        //  }


        if ( mx >= lastPoint.x ) {
            contextRef.current.moveTo(lastPoint.x, lastPoint.y );
            contextRef.current.lineTo(mx, my);
            contextRef.current.moveTo(mx-(2*twidth), my );
            contextRef.current.lineTo(mx, my);
            contextRef.current.moveTo(lastPoint.x, lastPoint.y );
            contextRef.current.lineTo(mx-(2*twidth), my );
         } else {
            contextRef.current.moveTo(lastPoint.x, lastPoint.y );
            contextRef.current.lineTo(mx, my);
            contextRef.current.moveTo(mx+(2*twidth), my );
            contextRef.current.lineTo(mx, my);
            contextRef.current.moveTo(lastPoint.x, lastPoint.y );
            contextRef.current.lineTo(mx+(2*twidth), my );
         }
      
        // contextRef.current.closePath();
         //contextRef.current.strokeStyle ;
         contextRef.current.stroke();
    // contextRef.current.moveTo(startX + (canvasOffSetX - startX) / 2, startY);
    // contextRef.current.lineTo(startX, canvasOffSetY);
    // contextRef.current.lineTo(canvasOffSetX, canvasOffSetY);
    // contextRef.current.lineTo(startX + (canvasOffSetX - startX) / 2,startY);
   
    // contextRef.current.stroke();
    // contextRef.current.closePath();
   
         
    //contextRef.current.fill();


        // nativeEvent.preventDefault();
        // nativeEvent.stopPropagation();

        // const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        //  const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

        //  const trione = newMouseX - startX.current;
        //  const tritwo = newMouseX - startY.current;
        //  const trithree =newMouseY - startY.current;
        //  contextRef.current.clearRect(0, 0, canvasRef.current.trione, canvasRef.current.tritwo,canvasRef.current.trithree);
 
        //  contextRef.current.strokeTri(startX.current, startY.current,trione,tritwo,trithree);
        //  contextRef.current.strokeRect(newMouseX.current,newMouseY.current,trione,tritwo,trithree)
    }
    const stopDrawingTriangle =() => {
        setIsDrawing(false);
    }
    const startDrawingCircle =(nativeEvent) => {
        
        console.log(nativeEvent)
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();
        // const {canvasOffSetX,canvasOffSetY } = nativeEvent;
        startX.current = nativeEvent.clientX - canvasOffSetX.current;
        startY.current = nativeEvent.clientY - canvasOffSetY.current;
        
        setIsDrawing(true);

    }
    const drawCircle = (nativeEvent) => {
        if (!isDrawing) {
            return;
        }
        
        console.log(canvasOffSetX)
        console.log(canvasOffSetY)
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();
        // const {canvasOffSetX,canvasOffSetY } = nativeEvent;
        const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        // const newMouseY = nativeEvent.clientY - canvasOffSetY.current;
        //  console.log(newMouseX)
        //  console.log(newMouseY)
        //  console.log(canvasRef.current)
        //  console.log(nativeEvent.clientY)
        //  console.log(nativeEvent.offsetY)
        const r = newMouseX/7;
        contextRef.current.beginPath();
         contextRef.current.clearRect(0, 0, startX.current*20, startY.current*20);
         
        // contextRef.current.clearCir(0, 0, 0,2 * Math.PI );
        
         contextRef.current.arc(startX.current,startY.current, r, 0, 2 * Math.PI, true);
         contextRef.current.closePath();
         contextRef.current.stroke();

        //  //now, erase the arc by clearing a rectangle that's slightly larger than the arc
        // contextRef.current.beginPath();
        // contextRef.current.clearRect(nativeEvent.clientX - r + 1, nativeEvent.clientY - r + 1, r * 2 + 2, r * 2 + 2);
        // contextRef.current.closePath();
         
        
        //  contextRef.current.strokeTri(startX.current,startY.current,trione,tritwo,trithree)
    }
    const stopDrawingCircle =() => {
        setIsDrawing(false);
    }

const handleMouseDown=({nativeEvent})=>{
    if(option === "rect"){
        startDrawingRectangle(nativeEvent)
    }
    else if (option === "cir"){
        startDrawingCircle(nativeEvent)
        
    }
    else if (option === "tri"){
        //setlastPoint(true)
        startDrawingTriangle(nativeEvent)
       
        
    }
    else{
        startDrawing(nativeEvent)
    }
}

function handleMouseMove({nativeEvent}){
    if(option === "rect"){
        drawRectangle(nativeEvent);
    }
    else if (option === "cir"){
        drawCircle(nativeEvent)
        
    }
    else if (option === "tri"){
        drawTriangle(nativeEvent)
        
    }
    else{
        draw(nativeEvent)
    }
}
function handleMouseUp({nativeEvent}){
    if(option === "rect"){
        stopDrawingRectangle(nativeEvent);
    }
    else if (option === "cir"){
        stopDrawingCircle(nativeEvent)
        
    }
    else if (option === "tri"){
        stopDrawingTriangle(nativeEvent)
        
    }
    else{
        stopDrawing(nativeEvent)
    }
}
function handleMouseLeave({nativeEvent}){
    if(option === "rect"){
        stopDrawingRectangle(nativeEvent);
    }
    else if (option === "cir"){
        stopDrawingCircle()
        
    }
    else if (option === "tri"){
        stopDrawingTriangle(nativeEvent)
        
    }
    else{
        stopDrawing(nativeEvent)
    }
}

function handle(type, nativeEvent){
    if(type === "brush"){
        alert("OK")
        setToDraw(nativeEvent);
    }
    else if (type === "eraser"){
        alert("OK")
        setToErase(nativeEvent)
    }
}
// function combine(){
//     setToDraw();
//     setType();
// }

    async function handleOnClick (){
        console.log(selected)
        console.log(option)
        console.log(type)
        const data = {
            color:selected,
            brush:type,
            eraser:type,
            shapes:option,
            username:"harsh"
        }
        console.log(data);
        try{
            const response = await axios.post("http://192.168.137.84:8000/canvas", data, {
                headers:{
                    "Content-Type" : "application/json"
                }
            });
            console.log(response.data)
        }catch(e){
            console.log(e)
        }
        

    }
    return (
        <div  className="Palette" style={{ width: "70%" , position:"relative" , alignItems:"center"}}>
             
            <canvas id="draw" className="canvas-container draw"
                ref={canvasRef}
                
                onMouseDown=
                    
                    //  option === "rect" ?startDrawingRectangle : startDrawing}
                    // option === "tri" ?startDrawingTriangle : startDrawing
                    {handleMouseDown}
                
                onMouseMove={
                    // option === "rect"? drawRectangle :draw
                    handleMouseMove
                }
                onMouseUp={
                    // option === "rect"? stopDrawingRectangle:  stopDrawing
                   handleMouseUp
                }
                onMouseLeave={
                    // option === "rect"? stopDrawingRectangle : stopDrawing
                    handleMouseLeave
                }
                //  style={{cursor: Cursor)}}
              
                // style={{cursor: 'url(C:\Users\DELL\Desktop\paint\CDAC-Final-main\src\Components\homecomponents\bb1.jpeg)'}}
                
                
                >
            </canvas>
            {/* <Cursor /> */}
            <div className='style' style={{width: "50px", height: "50px", backgroundColor: selected}}></div>
            <div className='contain'>
          
            {colors.map((color, index)=>(
                <div key={index} className="card">
                     
                    <div style={{
                        background:color,
                        filter: "brightness(85%)"
                    }}
                    
                    className="box" onClick={()=>setSelected(color)}/>
                    
            </div>
            
            ))}
          
            <div className='tools'>
                <button name="brush" className='hi' onClick={(e)=>{setType("brush"); handle("brush",e); setOption("")}}>
                <img  src="brush.webp" width="45" height="35" alt="" />
                </button>
                <button  name="eraser" className='hi' onClick={(e)=>{setType("eraser"); handle("eraser",e); setOption("")}}>
                <img  src="erase-512.webp" width="35" height="35" alt="" />
                </button>
                <button name="rectangle" className='hi' onClick={()=>setOption('rect')}>
                <img  src="rectangle.webp" width="35" height="35" alt="" />
                </button>
                <button name="triangle"  className='hi'onClick={()=>setOption('tri')}>
                <img  src="Triangle.jpg" width="35" height="35" alt="" />
                </button>
                <button name="circle" className='hi' onClick={()=>setOption('cir')}>
                <img  src="circle.png" width="35" height="35" alt="" />
                </button>

                <button type="button" onClick={handleOnClick} >Save</button>
                {/* <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>Download Image</a> */}
            </div>
          
            </div>
         {/* <FeatureGroup>
            <EditControl position="topright"/>
            </FeatureGroup>    */}
        </div>
        
    )
}

export default DrawingCanvas;