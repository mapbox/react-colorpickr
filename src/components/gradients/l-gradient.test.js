import React from "react";
import { render } from "@testing-library/react";
import { LGradient } from "./l-gradient";

describe("LGradient", () => {
  test("renders inactive", () => {
    const props = {
      active: false,
      theme: {},
      opacityLow: 0.5,
      opacityHigh: 0.6,
    };

    const { baseElement } = render(<LGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test("renders active", () => {
    const props = {
      active: true,
      theme: {},
      opacityLow: 0,
      opacityHigh: 0,
    };

    const { baseElement } = render(<LGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
