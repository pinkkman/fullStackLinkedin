import "../styles/global.css";
import { Provider } from "react-redux";
import {store} from "next/dist/build/output/store.js";

export default function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}
