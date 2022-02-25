import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import store from './store/store'
import { Provider } from "react-redux";
import { AdaptivityProvider, AppRoot, ConfigProvider, usePlatform } from "@vkontakte/vkui";

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider appearance="light">
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </Provider>, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => { }); //runtime download
}
