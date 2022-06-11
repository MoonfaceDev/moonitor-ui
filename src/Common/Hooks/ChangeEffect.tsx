import {DependencyList, EffectCallback, useEffect, useRef} from "react";

const useChangeEffect = (func: EffectCallback, deps: DependencyList) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) return func();
        didMount.current = true;
    }, deps);
}

export default useChangeEffect;