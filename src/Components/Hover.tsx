import React, {CSSProperties, ReactNode, useState} from "react";

function Hover({children, style, disabled}: { children: ReactNode, style?: CSSProperties | undefined, disabled?: boolean }) {
    const [buttonHover, setButtonHover] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    function getBackground() {
        if (disabled) {
            return '';
        }
        if (buttonActive) {
            return 'rgba(255, 255 ,255, 0.2)';
        }
        if (buttonHover) {
            return 'rgba(255, 255 ,255, 0.1)';
        }
        return '';
    }

    return (
        <div onMouseEnter={() => setButtonHover(true)}
             onMouseLeave={() => setButtonHover(false)}
             onMouseDown={() => {
                 function handleMouseUp() {
                     setButtonActive(false);
                     document.removeEventListener('mouseup', handleMouseUp);
                 }

                 setButtonActive(true);
                 document.addEventListener('mouseup', handleMouseUp);
             }}
             style={{
                 ...style,
                 background: getBackground(),
                 transition: 'background 0.1s linear'
             }}>{children}</div>
    );
}

export default Hover;