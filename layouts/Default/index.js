import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import styles from "./styles.module.scss";
import ModalWrongChain from "../../components/ModalWrongChain";
import ModalMetamaskRequired from "../../components/ModalMetamaskRequired";
import ModalLogin from "../../components/ModalLogin";
import {
  loadBalance,
  loadDecimals,
  useSelectAccountAddress,
  useSelectBalance,
  useSelectChainId,
  useSelectDecimals,
  useSelectIsWrongChain,
} from "../../store/contract";

export default function DefaultLayout(props) {
  const accountAddress = useSelector(useSelectAccountAddress);
  const chainId = useSelector(useSelectChainId);
  const isWrongChain = useSelector(useSelectIsWrongChain);
  const decimals = useSelector(useSelectDecimals);
  const balance = useSelector(useSelectBalance);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!chainId || !accountAddress || isWrongChain) {
      return;
    }

    async function loadInitialValues() {
      dispatch(loadBalance());
      dispatch(loadDecimals());
    }

    loadInitialValues();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, accountAddress, isWrongChain]);

  return (
    <>
      <AppBar position="sticky" className={styles.app_bar}>
        <Toolbar sx={{ width: "100%" }} className={styles.app_bar__toolbar}>
          <Link href="/">
            <a className={styles.app_bar__link}>
              <Typography variant="h4" align="center">
                Quiz App
              </Typography>
            </a>
          </Link>

          {chainId && accountAddress && !isWrongChain && (
            <div className={styles.token}>
              <div className={styles.token__left}>
                <div className={styles.token__icon}>Q</div>
              </div>

              <div className={styles.token__right}>
                <div className={styles.token__value}>
                  {balance / 10 ** decimals} QUIZ
                </div>

                <div className={styles.token__address}>
                  {accountAddress.slice(0, 8)}...{accountAddress.slice(-8)}
                </div>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Container>{props.children}</Container>

      <ModalWrongChain />
      <ModalMetamaskRequired />
      <ModalLogin />
    </>
  );
}
