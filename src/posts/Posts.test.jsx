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
  const renderComponent = (reducerConfig) => {
    const store = configureStore(reducerConfig);
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );
    return {
      store,
      user: userEvent.setup(),
      loadingElement: () => screen.getByTestId("loading"),
      postElements: async () => await screen.findAllByTestId("post"),
      errorElement: async () => await screen.findByTestId("error"),
      errorButton: screen.getByTestId("client-error"),
    };
  };

  it("should render initial state with loading indicator", () => {
    const { loadingElement } = renderComponent({ reducer: reducers });
    expect(loadingElement()).toBeInTheDocument();
  });

  it("should succesfully render posts", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({
      data: [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ],
    });
    const { postElements, loadingElement } = renderComponent({
      reducer: reducers,
    });

    await waitForElementToBeRemoved(loadingElement(), {
      timeout: 3001,
    });
    expect(await postElements()).toHaveLength(2);
  });

  it("should  render posts with error", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({
      data: [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ],
    });

    const { errorElement, loadingElement } = renderComponent({
      reducer: reducers,
      preloadedState: {
        posts: {
          isLoading: false,
          error: "Error",
          data: [],
        },
      },
    });

    await waitForElementToBeRemoved(loadingElement(), {
      timeout: 3001,
    });

    // expect(errorElement()).toBeInTheDocument();
    // expect(errorElement()).toHaveTextContent("Error");
  });

  it("triger client error", async () => {
    const { user, errorButton, store } = renderComponent({
      reducer: reducers,
    });

    vi.spyOn(store, "dispatch");

    await user.click(errorButton);

    expect(store.dispatch).toHaveBeenCalled();
    // expect(store.dispatch).toHaveBeenCalledWith({
    //   type: "posts/setError",
    //   payload: "Client error",
    // });
  });
});
