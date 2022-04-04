import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { get } from "lodash";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  CardContent,
  Card,
  CardMedia,
  Button,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { Box } from "@mui/system";
import { green, grey } from "@mui/material/colors";
import Head from "next/head";

import DefaultLayout from "../../layouts/Default";

import { remake, useSelectResume } from "../../store/quiz";
import {
  loadBalance,
  useSelectAccountAddress,
  useSelectContracts,
} from "../../store/contract";
import transactionStatus from "../../utility/transactionStatus";

export default function Resume() {
  const dispatch = useDispatch();
  const router = useRouter();

  const accountAddress = useSelector(useSelectAccountAddress);
  const contracts = useSelector(useSelectContracts);

  const resume = useSelector(useSelectResume);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const submitForm = async () => {
    try {
      setIsLoading(true);
      const answerIds = resume.map(({ optionIndex }) => optionIndex);

      const transaction = {
        from: accountAddress,
        to: contracts.quiz._address,
        data: contracts.quiz.methods.submit(1, answerIds).encodeABI(),
      };

      const hash = await window.ethereum.request({
        jsonrpc: "2.0",
        method: "eth_sendTransaction",
        params: [transaction],
      });

      const status = await transactionStatus(web3, hash);

      if (status === "accepted") {
        setMessage({
          title: "Encuesta exitosa",
          description: `Hemos recibido tu encuesta exitosamente.`,
        });
        setStatus("success");
        dispatch(loadBalance());
        return;
      }

      setMessage({
        title: "Encuesta erronea",
        description: `Aun no ha pasado el tiempo suficiente para poder enviar encuestas. Vuelve a intentarlo más tarde`,
      });
      setStatus("error");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const markOptionSelected = (optionSelectedIndex, optionIndex) => {
    if (optionSelectedIndex !== optionIndex) {
      return {};
    }

    return { sx: { color: green[500] } };
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Quiz App | Resumen</title>
      </Head>

      {status === null ? (
        <>
          <Card
            sx={{
              mt: 5,
              display: "flex",
              width: "100%",
              maxWidth: 640,
              mx: "auto",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <CardContent
                sx={{ flex: "1 0 auto", textAlign: "center", py: 3 }}
              >
                <Typography variant="h4">Estas a un paso!</Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                  }}
                >
                  Envia la encuenta para recibir las recompensas
                </Typography>

                <Button
                  sx={{ mx: 1 }}
                  onClick={() => {
                    dispatch(remake());
                    router.push("/quiz");
                  }}
                >
                  Rehacer
                </Button>

                <LoadingButton
                  variant="contained"
                  sx={{ mx: 1 }}
                  onClick={submitForm}
                  loading={isLoading}
                >
                  Enviar
                </LoadingButton>
              </CardContent>
            </Box>
          </Card>

          <Box sx={{ mt: 0.5, width: "100%", maxWidth: 640, mx: "auto" }}>
            {resume.map((item, itemIndex) => (
              <Accordion disableGutters expanded key={item.questionIndex}>
                <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
                  <Typography sx={{ width: "90%", flexShrink: 0 }}>
                    {item.question.text}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ backgroundColor: grey[900] }}>
                  <List>
                    {item.question.options.map((optionItem, optionIndex) => (
                      <ListItem key={optionIndex}>
                        <Typography
                          {...markOptionSelected(item.optionIndex, optionIndex)}
                        >
                          <b>{String.fromCharCode(65 + optionIndex) + ". "}</b>
                          {optionItem.text}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </>
      ) : (
        <Card
          sx={{
            mt: 5,
            width: "100%",
            maxWidth: 640,
            mx: "auto",
          }}
        >
          <CardHeader title={message.title} sx={{ mb: 2, pb: 0 }} />

          <CardContent sx={{ mt: 0, pt: 0 }}>
            <Typography sx={{ mb: 2 }}>{message.description}</Typography>

            <Button
              variant="contained"
              sx={{ my: 1 }}
              onClick={() => router.push("/")}
            >
              Volver a la home
            </Button>
          </CardContent>
        </Card>
      )}
    </DefaultLayout>
  );
}
