import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import RouteApp from "./routes/routeApp";
import "@/assets/scss/main.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./app/store";
import { ToastContainer } from "react-toastify";
function App() {
    return (_jsx(Provider, { store: store, children: _jsxs(PersistGate, { loading: false, persistor: persistor, children: [_jsx(ToastContainer, {}), _jsx(RouteApp, {})] }) }));
}
export default App;
