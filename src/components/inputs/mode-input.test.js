import React from "react";
import { render, screen } from "@testing-library/react";
import { ModeInput } from "./mode-input";
import userEvent from "@testing-library/user-event";

describe("ModeInput", () => {
  let wrapper;
  const props = {
    id: "mode",
    checked: false,
    theme: {},
    name: "mode",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    wrapper = render(<ModeInput {...props} />);
  });

  test("renders", () => {
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("onChange", () => {
    const input = screen.getByRole("radio");
    userEvent.click(input);
    expect(props.onChange).toHaveBeenCalledWith("mode");
  });
});
