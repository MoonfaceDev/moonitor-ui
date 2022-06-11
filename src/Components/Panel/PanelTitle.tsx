import React, {CSSProperties, ReactNode} from "react";
import useMobile from "../../Common/Hooks/Mobile";

function PanelTitle({children, style}: { children: ReactNode, style?: CSSProperties | undefined }) {
    const isMobile = useMobile();
    return (
        <span style={{
            fontSize: isMobile ? 20 : 24,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 0 0 32px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            ...style
        }}>{children}</span>
    );
}

export default PanelTitle;