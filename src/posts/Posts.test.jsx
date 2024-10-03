import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import Posts from "./Posts";
import { Provider } from "react-redux";
import reducers from "../store/reducers";
import { configureStore } from "@reduxjs/toolkit";
import { expect, it } from "vitest";

import axios from "axios";
import userEvent from "@testing-library/user-event";

describe("Posts Component", () => {
  it("should render initial state with loading indicator", () => {
    const store = configureStore({ reducer: reducers });
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );
    const loadingElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should succesfully render posts", async () => {
    const store = configureStore({ reducer: reducers });
    vi.spyOn(axios, "get").mockResolvedValue({
      data: [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ],
    });
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId("loading"), {
      timeout: 3001,
    });
    const postElements = await screen.findAllByTestId("post");
    expect(postElements).toHaveLength(2);
  });

  it("should  render posts with error", async () => {
    const store = configureStore({
      reducer: reducers,
      preloadedState: {
        posts: {
          isLoading: false,
          error: "Error",
          data: [],
        },
      },
    });
    vi.spyOn(axios, "get").mockResolvedValue({
      data: [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ],
    });
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId("loading"), {
      timeout: 3001,
    });
    const errorElement = await screen.findByTestId("error");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("Error");
  });

  it("triger client error", async () => {
    const store = configureStore({
      reducer: reducers,
    });

    vi.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );

    const user = userEvent.setup();
    const errorButton = screen.getByTestId("client-error");
    await user.click(errorButton);

    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "posts/setError",
      payload: "Client error",
    });
  });
});
