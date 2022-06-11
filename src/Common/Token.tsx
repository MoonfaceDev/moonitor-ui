function getTokenExpirationDelta() {
    const user = localStorage.user;
    const token = JSON.parse(user).access_token;
    const exp = JSON.parse(atob(token.split('.')[1])).exp;
    return exp * 1000 - Date.now();
}

export {getTokenExpirationDelta};