import React, { useEffect } from "react";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider, useDispatch } from "react-redux";

import createEmotionCache from "../utility/createEmotionCache";

import store from "./../store";
import { metamaskListener } from "../store/contract";

import theme from "../styles/theme/darkTheme";
import "../styles/globals.scss";

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  return (
    <Provider store={store}>
      <Wrapper {...props} />
    </Provider>
  );
};

const Wrapper = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const dispatch = useDispatch(store);

  useEffect(() => {
    dispatch(metamaskListener());
  }, [dispatch]);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
