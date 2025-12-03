import RouteApp from "./routes/routeApp";
import "@/assets/scss/main.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./app/store";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={false} persistor={persistor}>
                <ToastContainer />
                <RouteApp />
            </PersistGate>
        </Provider>
    );
}

export default App;
