import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  Link,
  Modal,
  Typography,
} from "@mui/material";

import styles from "./styles.module.scss";
import { useSelectHasMetamask } from "../../store/contract";

const ModalMetamaskRequired = (props) => {
  const hasMetamask = useSelector(useSelectHasMetamask);

  return (
    <Modal open={!hasMetamask} className={styles.modal_metamask_required}>
      <Card className={styles.modal_metamask_required__container}>
        <CardHeader
          title={`Metamask requerido`}
          sx={{ mb: 2, pb: 0 }}
          className={styles.modal_metamask_required__title}
        />

        <CardContent
          sx={{ mt: 0, pt: 0 }}
          className={styles.modal_metamask_required__content}
        >
          <Typography className={styles.modal_metamask_required__description}>
            Antes de completar los formularios es de suma importancia que poseas
            una billetera de metamask, puede descargarlo desde{" "}
            <Link href="https://metamask.io/download/">aqui</Link>
          </Typography>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ModalMetamaskRequired;
