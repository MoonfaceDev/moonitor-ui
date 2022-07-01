import React, {CSSProperties, ReactNode} from "react";

function PanelContainer({children, style}: { children: ReactNode, style?: CSSProperties | undefined }) {
    return (
        <div style={{
            position: 'relative',
            flex: '1 0',
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#27293D',
            color: '#D3D1D8',
            borderRadius: 16,
            margin: 12,
            ...style
        }}>
            {children}
        </div>
    )
}

export default PanelContainer;