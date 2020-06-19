import React, { useState } from "react";
const Blog = ({ id, title, url, likes, author }) => {
  const [isOpened, setIsOpened] = useState(false);
  const toggle = () => setIsOpened(!isOpened);

  return (
    <div className="blog">
      <span>
        <span className={isOpened ? "collapse" : ""}>Title : {title}</span>
        <button onClick={toggle}>{isOpened ? "Hide" : "View"}</button>
      </span>
      <div className={"collapse" + (isOpened ? " in" : "")}>
        <p>Title : {title}</p>
        <p>URL : {url}</p>
        <p>Likes : {likes}</p>
        <p>Author: {author}</p>
      </div>
    </div>
  );
};

export default Blog;
