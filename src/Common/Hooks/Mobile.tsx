import {useMediaQuery} from "react-responsive";

function useMobile() {
    return useMediaQuery({query: `(max-width: 760px)`});
}

export default useMobile;