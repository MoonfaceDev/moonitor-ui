import {useEffect} from "react";

function useEscape(callback: () => void, enabled: boolean) {
    return useEffect(() => {
        const close = (event: { keyCode: number; }) => {
            if (event.keyCode === 27) {
                callback();
            }
        }
        if (enabled) {
            window.addEventListener('keydown', close);
        } else {
            window.removeEventListener('keydown', close);
        }
        return () => window.removeEventListener('keydown', close);
    }, [enabled]);
}

export default useEscape;