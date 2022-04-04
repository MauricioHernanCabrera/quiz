import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import styles from "./styles.module.scss";
import AspectRatioBox from "../components/AspectRatioBox";
import { QUIZ } from "../consts";

import DefaultLayout from "./../layouts/Default";
import {
  useSelectContracts,
  useSelectChainId,
  useSelectAccountAddress,
  useSelectIsWrongChain,
} from "./../store/contract";
import Head from "next/head";

export default function Home() {
  const accountAddress = useSelector(useSelectAccountAddress);
  const chainId = useSelector(useSelectChainId);
  const contracts = useSelector(useSelectContracts);
  const isWrongChain = useSelector(useSelectIsWrongChain);

  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [canSubmitQuiz, setCanSubmitQuiz] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(null);

  useEffect(() => {
    async function loadInitialValues() {
      if (!chainId || !accountAddress || isWrongChain) {
        return;
      }

      setIsLoading(true);

      const [lastSubmittal, cooldownSeconds] = await Promise.all([
        contracts.quiz.methods.lastSubmittal(accountAddress).call(),
        contracts.quiz.methods.cooldownSeconds().call(),
      ]);

      const submitAvailableTime = new Date(
        (parseInt(lastSubmittal) + parseInt(cooldownSeconds)) * 1000
      ).getTime();

      const currentTime = new Date().getTime();
      const time = submitAvailableTime - currentTime;

      setCanSubmitQuiz(time <= 0);
      setCooldownTime(submitAvailableTime - currentTime);
      setIsLoading(false);
    }

    loadInitialValues();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, accountAddress, isWrongChain]);

  return (
    <DefaultLayout>
      <Head>
        <title>Quiz App | Home</title>
      </Head>

      {isLoading ? (
        <div className={styles.loader}>
          <CircularProgress size={64} />
        </div>
      ) : (
        <>
          <Card
            sx={{
              maxWidth: 640,
              mx: "auto",
              mt: 5,
            }}
          >
            <CardHeader
              title={`Bienvenido ${accountAddress.slice(
                0,
                5
              )}...${accountAddress.slice(-5)} a Quiz App`}
              sx={{ mb: 2, pb: 0 }}
            />

            <CardContent sx={{ mt: 0, pt: 0 }}>
              <Typography sx={{ mb: 0, pt: 0 }}>
                Para poder obtener jugosas recompensas debera de rellenar la
                encuenta del día
              </Typography>
            </CardContent>
          </Card>

          {canSubmitQuiz ? (
            <Card
              className={styles.quiz_card}
              sx={{
                maxWidth: 640,
                mx: "auto",
                mt: 1,
              }}
            >
              <CardHeader
                title={`${QUIZ.title}`}
                sx={{ mb: 2, pb: 0 }}
                action={
                  <Button
                    variant="contained"
                    sx={{ my: 1 }}
                    onClick={() => router.push("/quiz")}
                  >
                    Completar encuesta
                  </Button>
                }
              />

              <AspectRatioBox ratio={21 / 9}>
                <img
                  className={styles.quiz_card__image}
                  src={QUIZ.image}
                  alt={`Imagen de ${QUIZ.title}`}
                />
              </AspectRatioBox>
            </Card>
          ) : (
            <Card
              sx={{
                maxWidth: 640,
                mx: "auto",
                mt: 1,
              }}
            >
              <CardHeader
                title={`Debes de esperar un tiempo`}
                sx={{ mb: 2, pb: 0 }}
              />

              <CardContent sx={{ mt: 0, pt: 0 }}>
                <Typography>
                  Para poder seguir ganando más recompensas debes de esperar{" "}
                  {Math.floor(cooldownTime / 1000 / 60)} minutos
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </DefaultLayout>
  );
}
