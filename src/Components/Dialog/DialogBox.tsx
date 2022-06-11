import React, {ReactNode, useState} from "react";
import useMobile from "../../Common/Hooks/Mobile";
import useChangeEffect from "../../Common/Hooks/ChangeEffect";

function DialogBox({children, visible}: { children: ReactNode, visible: boolean }) {
    const isMobile = useMobile();
    const [zIndex, setZIndex] = useState(-1);
    useChangeEffect(() => {
        if (visible) {
            setZIndex(1);
        } else {
            setTimeout(() => {
                setZIndex(-1);
            }, 150);
        }
    }, [visible]);
    return (
        <div style={{
            opacity: visible ? 1 : 0,
            zIndex: zIndex,
            display: 'flex',
            transition: 'opacity 0.15s linear',
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: 'rgba(255,255,255,0.5)',
            padding: 16
        }}>
            <div style={{
                transition: 'transform 0.3s ease-out',
                transform: visible ? 'none' : 'translate(0, -50px)',
                display: "flex",
                flexDirection: "column",
                background: '#27293D',
                width: isMobile ? 360 : 500,
                borderRadius: 16,
                color: "white",
                maxHeight: '100%',
            }}>
                {children}
            </div>
        </div>
    );
}

export default DialogBox;