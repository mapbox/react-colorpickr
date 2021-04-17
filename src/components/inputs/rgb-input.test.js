import React from "react";
import { render } from "@testing-library/react";
import { RGBInput } from "./rgb-input";

describe("RGBInput", () => {
  test("renders", () => {
    const props = {
      id: "r",
      value: 200,
      theme: {},
      onChange: jest.fn(),
    };

    const { baseElement } = render(<RGBInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
