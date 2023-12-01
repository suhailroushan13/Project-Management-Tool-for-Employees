function timeAgo(pastDate) {
  if (!pastDate) {
    return "Never logged in";
  }

  const differenceInSeconds = Math.floor(
    (new Date() - new Date(pastDate)) / 1000
  );
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (differenceInSeconds < minute) {
    return `${differenceInSeconds} seconds ago`;
  } else if (differenceInSeconds < hour) {
    return `${Math.floor(differenceInSeconds / minute)} minutes ago`;
  } else if (differenceInSeconds < day) {
    return `${Math.floor(differenceInSeconds / hour)} hours ago`;
  } else if (differenceInSeconds < week) {
    return `${Math.floor(differenceInSeconds / day)} days ago`;
  } else {
    return `${Math.floor(differenceInSeconds / week)} weeks ago`;
  }
}

export default timeAgo;
