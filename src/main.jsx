import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './immersive.css';
class Boundary extends React.Component{state={error:false};static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<main style={{padding:40,color:'#fff',background:'#102c30',minHeight:'100vh'}}><h1>A little pause in the magic.</h1><p>Please reload the page. Your last saved progress is kept in this browser.</p><button onClick={()=>location.reload()}>Reload</button></main>:this.props.children}}
createRoot(document.getElementById('root')).render(<Boundary><App/></Boundary>);
