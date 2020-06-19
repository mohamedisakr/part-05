const sortDesc = (a, b) => {
  if (a.likes > b.likes) {
    return -1;
  } else if (b.likes > a.likes) {
    return 1;
  } else {
    return 0;
  }
};

export default sortDesc;
