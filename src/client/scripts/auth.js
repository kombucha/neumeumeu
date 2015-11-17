export default function (store) {
    return (nextState, replaceState) => {
        const isAuthenticated = store.getState().user.authenticated;

        if (!isAuthenticated) {
            replaceState({nextPathname: nextState.location.pathname}, '/register')
        }
    }
}
