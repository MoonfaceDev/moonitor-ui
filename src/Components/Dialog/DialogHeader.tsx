import React from "react";
import Hover from "../Hover";

function DialogHeader({title, onCancel, onConfirm}: { title: string, onCancel?: () => void, onConfirm?: () => void }) {
    return (
        <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
        }}>
            <span style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 56px',
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                width: "100%",
            }}>
                        <b>{title}</b>
                    </span>
            {
                onCancel === undefined ? null :
                    <Hover style={{margin: 8, borderRadius: '50%', zIndex: 1}}>
                        <span className='material-symbols-outlined'
                              onClick={() => onCancel()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 32,
                                  padding: 4,
                              }}>close</span>
                    </Hover>
            }
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {
                    onConfirm === undefined ? null :
                        <Hover style={{margin: 8, borderRadius: '50%', zIndex: 1}}>
                        <span className='material-symbols-outlined'
                              onClick={() => onConfirm()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 32,
                                  padding: 4,
                              }}>done</span>
                        </Hover>
                }
            </div>
        </div>
    );
}

export default DialogHeader;