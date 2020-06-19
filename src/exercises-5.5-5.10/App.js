import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "../services/blogs";
import login from "../services/login";
import Toggable from "./components/togglable";
import BlogForm from "./components/blog-form";
import Notification from "./components/notification";
import Success from "./components/success";
import sortDesc from "./utils/helpers";
import "./App.css";

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = React.createRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("blogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await login({ username, password });
      localStorage.setItem("blogUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
      setConfirmation(`${user.name} successfully log in.`);
      setTimeout(() => {
        setConfirmation(null);
      }, 4000);
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem("blogUser");
    blogService.setToken(null);
    setUser(null);
  };

  const handleAddNewBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setConfirmation(
        `A new blog ${returnedBlog.title} by ${user.name} was added successfully.`
      );
      setTimeout(() => {
        setConfirmation(null);
      }, 4000);
    } catch (error) {
      setErrorMessage(`Error! saving ${newBlog.title}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username:
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const blogForm = () => (
    <Toggable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={handleAddNewBlog} />
    </Toggable>
  );

  //#region user info
  /*
  const userInfo = () => (
    <div>
      <span>
        <p>Welcome {user.name}</p>
        <button onClick={handleLogout}>Logout</button>
      </span>
      <div>{blogForm()}</div>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
  */
  //#endregion

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={errorMessage} />
      <Success message={confirmation} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <span>
            Welcome {user.name}
            <button onClick={handleLogout}>Logout</button>
          </span>
          <div>{blogForm()}</div>
          {console.log(blogs)}
          <ul>
            {blogs
              .sort((a, b) => sortDesc(a, b))
              .map(({ id, title, url, likes, author }) => (
                <Blog
                  key={id}
                  title={title}
                  url={url}
                  likes={likes}
                  author={author}
                />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default App;
