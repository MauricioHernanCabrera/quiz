import React from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Typography,
} from "@mui/material";

import styles from "./styles.module.scss";

import {
  useSelectHasMetamask,
  useSelectIsWrongChain,
} from "./../../store/contract";
import config from "../../config";

const ModalWrongChain = (props) => {
  const isWrongChain = useSelector(useSelectIsWrongChain);
  const hasMetamask = useSelector(useSelectHasMetamask);

  const changeChain = async () => {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${config.chainId}` }],
    });
  };

  return (
    <Modal
      open={hasMetamask && isWrongChain}
      className={styles.modal_wrong_chain}
    >
      <Card className={styles.modal_wrong_chain__container}>
        <CardHeader
          title={`Red incorrecta`}
          sx={{ mb: 2, pb: 0 }}
          className={styles.modal_wrong_chain__title}
        />

        <CardContent
          sx={{ mt: 0, pt: 0 }}
          className={styles.modal_wrong_chain__content}
        >
          <Typography className={styles.modal_wrong_chain__description}>
            Antes de completar los formularios es de suma importancia que se
            encuentre en la red correcta. Para poder lograr esto debe de
            presionar este boton
          </Typography>

          <Button
            variant="contained"
            sx={{ my: 1 }}
            className={styles.modal_wrong_chain__button}
            onClick={changeChain}
          >
            Cambiar de red
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ModalWrongChain;
