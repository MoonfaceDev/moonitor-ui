import React, {ChangeEventHandler, CSSProperties, HTMLInputTypeAttribute, useState} from "react";
import {Hover} from "../Dashboard/Components";
import {useMobile} from "../Utils";

function ErrorLabel({children, visible}: { children: string, visible: boolean }) {
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        color: '#f44336',
        fontSize: 24,
        height: 24,
        visibility: visible ? "visible" : "hidden",
        margin: '0 10px 20px 10px',
    }}>
        <span>{"  " + children}</span>
    </div>
}

function BackButton({outerStyle, innerStyle, onClick, children}: { outerStyle?: CSSProperties, innerStyle?: CSSProperties, onClick: () => void, children: React.ReactNode }) {
    return <div style={{
        background: '#27293D',
        userSelect: 'none',
        borderRadius: '50%',
        ...outerStyle,
    }} onClick={onClick}>
        <Hover style={{borderRadius: '50%'}}>
            <span className={"material-symbols-outlined"} style={{
                fontSize: 40,
                padding: 12,
                color: 'white',
                borderRadius: '50%',
                background: 'transparent',
                ...innerStyle
            }}>
                {children}
            </span>
        </Hover>
    </div>
}

function SpecialButton({onClick, children}: { onClick: () => void, children: React.ReactNode }) {
    const [hover, setHover] = useState(false);
    return <div style={{
        border: "double 4px transparent",
        borderRadius: 18,
        backgroundImage: "linear-gradient(#1E1E26, #1E1E26), var(--button-background)",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        backgroundSize: "200% auto",
        transition: "0.3s",
        margin: 60,
        backgroundPosition: hover ? 'right center' : ''
    }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}>
        <div style={{
            borderRadius: 10,
            padding: '20px 40px',
            fontSize: 20,
            color: "white",
            letterSpacing: 3,
            background: "var(--button-background)",
            margin: 5,
            userSelect: "none",
            backgroundSize: "200% auto",
            transition: "0.3s",
            textAlign: "center",
            backgroundPosition: hover ? 'right center' : ''
        }}>
            <b>{children}</b>
        </div>
    </div>
}

function InputField({label, onChange, type, autoComplete, minLength, maxLength, required}: {
    label: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    type?: HTMLInputTypeAttribute | undefined,
    autoComplete?: string | undefined,
    minLength?: number | undefined,
    maxLength?: number | undefined,
    required?: boolean | undefined,
}) {
    const isMobile = useMobile();
    return (
        <>
            <span style={{
                fontSize: 24,
                color: '#BFBFBF',
                margin: '20px 10px 0 10px',
            }}>{label}</span>
            <input style={{
                width: isMobile ? 300 : 400,
                background: '#27293D',
                fontSize: 24,
                borderRadius: 8,
                padding: 16,
                color: 'white',
                border: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
            }} minLength={minLength} maxLength={maxLength} type={type} autoComplete={autoComplete}
                   onChange={onChange} required={required}/>
        </>
    );
}

export {ErrorLabel, BackButton, SpecialButton, InputField};