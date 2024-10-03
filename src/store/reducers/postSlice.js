import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  isLoading: false,
  error: null,
  data: [],
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
const url = import.meta.env.VITE_API_URL;

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return axios
    .get(`${url}/posts`)
    .then(await wait(3000))
    .then((response) => response.data)
    .catch((error) => {
      throw new Error("Unable to fetch posts from server" || error);
    });
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { setError } = postsSlice.actions;

export default postsSlice.reducer;
