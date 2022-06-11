import {useState} from "react";

function useDateState(initialState: Date): [Date, (newState: Date) => void] {
    const [state, setState] = useState(initialState);
    const fixedSetState = (newState: Date) => {
        if (state.getTime() !== newState.getTime()) {
            setState(newState);
        }
    }
    return [state, fixedSetState];
}

export default useDateState;