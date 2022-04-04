import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
  signInWithMetamask,
  useSelectAccountAddress,
} from "../../store/contract";

const ModalMetamaskRequired = (props) => {
  const hasMetamask = useSelector(useSelectHasMetamask);
  const accountAddress = useSelector(useSelectAccountAddress);
  const dispatch = useDispatch();

  return (
    <Modal
      open={hasMetamask && !accountAddress}
      className={styles.modal_metamask_required}
    >
      <Card className={styles.modal_metamask_required__container}>
        <CardHeader
          title={`Bienvenido a Quiz App`}
          sx={{ mb: 2, pb: 0 }}
          className={styles.modal_metamask_required__title}
        />

        <CardContent
          sx={{ mt: 0, pt: 0 }}
          className={styles.modal_metamask_required__content}
        >
          <Typography className={styles.modal_metamask_required__description}>
            Antes de completar los formularios es de suma importancia que se
            loguee con su cartera de metamask.
          </Typography>

          <Button
            variant="contained"
            sx={{ my: 1 }}
            onClick={() => dispatch(signInWithMetamask())}
          >
            Iniciar sesión
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ModalMetamaskRequired;
