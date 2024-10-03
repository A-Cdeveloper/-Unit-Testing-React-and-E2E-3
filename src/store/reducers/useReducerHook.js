import { useDispatch, useSelector } from "react-redux";

export const useReducerHook = () => {
  const dispatch = useDispatch();
  const { error, data, isLoading } = useSelector((posts) => posts.posts);

  return {
    dispatch,
    error,
    posts: data,
    isLoading,
  };
};

export default useReducerHook;
