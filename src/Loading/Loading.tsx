import React from 'react';
import loading from '../Assets/loading.png';
import './Loading.css'


function Loading({visible}: { visible: boolean }) {
    return <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    }}>
        <img style={{
            animation: 'spin 0.5s linear infinite',
            margin: 'auto',
            width: 80,
            height: 80,
            userSelect: 'none',
            pointerEvents: 'none',
        }} src={loading} alt='Loading'/>
    </div>
}

export default Loading;