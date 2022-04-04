import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  LinearProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import {
  addAnswer,
  startCountDown,
  clearCountDown,
} from "././../../store/quiz";

import DefaultLayout from "./../../layouts/Default";
import AspectRatioBox from "./../../components/AspectRatioBox";

import { QUIZ, QUESTIONS_AMOUNT } from "./../../consts";
import formatedTime from "./../../utility/formatedTime";
import Head from "next/head";

export default function Quiz() {
  const currentAnswer = useSelector((state) => state.quiz.currentAnswer);
  const lifetimeSeconds = useSelector((state) => state.quiz.lifetimeSeconds);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(startCountDown());

    return () => {
      dispatch(clearCountDown());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      !(currentAnswer + 1 === QUESTIONS_AMOUNT && lifetimeSeconds === 999999)
    ) {
      return;
    }

    router.push("/resume");
  }, [currentAnswer, lifetimeSeconds, router]);

  return (
    <DefaultLayout>
      <Head>
        <title>Quiz App | Quiz</title>
      </Head>

      <Card
        sx={{
          maxWidth: 640,
          mx: "auto",
          mt: 5,
          ".MuiCardHeader-action": { m: 0, alignSelf: "center" },
        }}
      >
        <CardHeader
          title={`Question ${currentAnswer + 1} of ${QUESTIONS_AMOUNT}`}
          action={
            <Typography>
              {lifetimeSeconds !== 999999 ? formatedTime(lifetimeSeconds) : ""}
            </Typography>
          }
        />

        <Box>
          <LinearProgress
            variant="determinate"
            value={((currentAnswer + 1) * 100) / QUESTIONS_AMOUNT}
          />
        </Box>

        <AspectRatioBox ratio={16 / 9}>
          <CardMedia
            component="img"
            image={QUIZ.questions[currentAnswer].image}
          />
        </AspectRatioBox>

        <CardContent>
          <Typography variant="h6">
            {QUIZ.questions[currentAnswer].text}
          </Typography>

          <List>
            {QUIZ.questions[currentAnswer].options.map(
              (optionItem, optionIndex) => (
                <ListItemButton
                  disableRipple
                  key={optionIndex}
                  onClick={() => dispatch(addAnswer(optionIndex))}
                >
                  <div>
                    <b>{String.fromCharCode(65 + optionIndex) + " . "}</b>
                    {optionItem.text}
                  </div>
                </ListItemButton>
              )
            )}
          </List>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
