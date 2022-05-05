import {Navigate} from "react-router-dom"
import React, {useEffect, useState} from "react";
import {fetchCheckToken} from "../APIRequests";

function RequireToken({children}: { children: any }) {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    useEffect(() => {
        fetchCheckToken()
            .then(result => {
                setIsValid(result);
            });
    }, []);
    if (isValid === null) {
        return null;
    }
    const navigate = <Navigate to='/login'/>;
    try {
        const user = JSON.parse(localStorage.getItem('user') as string);
        if (!(user && user.access_token && isValid)) {
            return navigate;
        }
        return children;
    } catch (e) {
        return navigate;
    }
}

export default RequireToken;