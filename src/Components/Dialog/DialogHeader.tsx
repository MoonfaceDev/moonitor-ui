import React from "react";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

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
                    <IconButton sx={{margin: 1, zIndex: 1}} size="small" onClick={onCancel}>
                        <CloseIcon sx={{fontSize: 32}}/>
                    </IconButton>
            }
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {
                    onConfirm === undefined ? null :
                        <IconButton sx={{margin: 1, zIndex: 1}} size="small" onClick={onConfirm}>
                            <DoneIcon sx={{fontSize: 32}}/>
                        </IconButton>
                }
            </div>
        </div>
    );
}

export default DialogHeader;