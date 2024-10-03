import { useEffect } from "react";
import { fetchPosts, setError } from "../store/reducers/postSlice";
import useReducerHook from "../store/reducers/useReducerHook";
const Posts = () => {
  const { dispatch, error, posts, isLoading } = useReducerHook();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  return (
    <>
      <h1>Posts Page</h1>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {posts.map((post) => (
        <div key={post.id} data-testid="post">
          {post.title}
        </div>
      ))}
      <button
        data-testid="client-error"
        onClick={() => dispatch(setError("Client error"))}
      >
        Trigger client error
      </button>
    </>
  );
};

export default Posts;
