import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import "./reset.css";
import {BrowserRouter} from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle.ts";
import {Provider} from "react-redux";
import store from "./store/index.ts";
import {PersistGate} from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import "./i18n";

export const persistor = persistStore(store);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
