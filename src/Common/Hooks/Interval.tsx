import {DependencyList, useEffect} from "react";

function useInterval(func: () => void, timeInterval: number, deps?: DependencyList | undefined) {
    useEffect(() => {
        func();
        const intervalID = window.setInterval(func, timeInterval);
        return () => window.clearInterval(intervalID);
    }, deps);
}

export default useInterval;