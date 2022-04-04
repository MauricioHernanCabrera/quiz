const transactionStatus = (
  w3,
  hash,
  { maxAttempts = 120, secondsPerAttempts = 5 } = {}
) => {
  return new Promise((resolve, reject) => {
    let attempts = maxAttempts;

    const interval = setInterval(async () => {
      try {
        if (attempts <= 0) {
          clearInterval(interval);
          return resolve("rejected");
        }

        const data = await w3.eth.getTransactionReceipt(hash);

        console.log({ data });

        if (data.status == 1) {
          clearInterval(interval);
          return resolve("accepted");
        } else {
          return resolve("rejected");
        }
      } catch (error) {
        console.log(error);
      }
      attempts--;
    }, 1000 * secondsPerAttempts);
  });
};

export default transactionStatus;
