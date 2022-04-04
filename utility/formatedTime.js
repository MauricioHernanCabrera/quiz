const formatedTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return (
    Math.floor(minutes).toString().padStart(2, "0") +
    ":" +
    Math.floor(seconds).toString().padStart(2, "0")
  );
};

export default formatedTime;
