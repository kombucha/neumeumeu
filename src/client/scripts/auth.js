export default function (store) {
    return (nextState, replaceState) => {
        const isAuthenticated = !!store.getState().authentication.token;

        if (!isAuthenticated) {
            replaceState({nextPathname: nextState.location.pathname}, '/register');
        }
    };
}
