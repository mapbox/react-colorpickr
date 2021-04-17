import React from "react";
import { render } from "@testing-library/react";
import { SLAlphaInput } from "./sl-alpha-input";

describe("SLAlphaInput", () => {
  test("renders", () => {
    const props = {
      id: "s",
      value: 92,
      theme: {},
      onChange: jest.fn(),
    };

    const { baseElement } = render(<SLAlphaInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
