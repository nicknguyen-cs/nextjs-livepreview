/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../styles/third-party.css";
import "../styles/style.css";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import "@contentstack/live-preview-utils/dist/main.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

ContentstackLivePreview.init({enable: true,ssr: true, debug: true, stackDetails: {
  apiKey: 'blt19354e73f1681431'
}});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
