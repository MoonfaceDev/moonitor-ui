import {DependencyList, useEffect} from "react";

function useTimeout(func: () => void, time: number, deps?: DependencyList | undefined) {
    useEffect(() => {
        const intervalID = window.setTimeout(func, time);
        return () => window.clearTimeout(intervalID);
    }, deps);
}

export default useTimeout;