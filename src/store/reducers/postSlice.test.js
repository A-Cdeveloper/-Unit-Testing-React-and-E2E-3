import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import postReducer, { fetchPosts, initialState, setError } from "./postSlice";

describe("postSlice reducer", () => {
  it("should have initial state", () => {
    const newState = postReducer(initialState, { type: "unknown" });
    expect(newState).toEqual({
      isLoading: false,
      error: null,
      data: [],
    });
  });

  it("should handle fetchPosts.pending", () => {
    const newState = postReducer(initialState, fetchPosts.pending());
    expect(newState).toEqual({
      isLoading: true,
      error: null,
      data: [],
    });
  });

  it("should handle fetchPosts.fulfilled", () => {
    const posts = [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ];
    const newState = postReducer(initialState, fetchPosts.fulfilled(posts));
    expect(newState).toEqual({
      isLoading: false,
      error: null,
      data: posts,
    });
  });

  it("should handle setError", () => {
    const error = "Client Error";
    const newState = postReducer(initialState, setError(error));
    expect(newState).toEqual({
      isLoading: false,
      error,
      data: [],
    });
  });
});
