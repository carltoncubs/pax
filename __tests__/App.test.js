import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import fetch from "jest-fetch-mock";
import { Enzyme, shallow, render, mount } from "enzyme";
import sinon from "sinon";

import App from "../src/App";
import SignInForm from "../src/SignInForm";
import SignOutForm from "../src/SignOutForm";
import Settings from "../src/Settings";
import {
  AutoCompleteTextBox,
  SignaturePadWrapper
} from "../src/CommonComponents";

global.fetch = fetch;

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("redirects the user to / for sign in if they are not authenticated", () => {
  expect(false).toEqual(true);
});

it("redirects the user to /sign-in from / if they are authenticated", () => {
  expect(false).toEqual(true);
});

it("displays a banner if the user is authenticated by google but not invited", () => {
  expect(false).toEqual(true);
});

it(
  "opens a drop down menu displaying logged in user's name, email and" +
    " logout button when pressing auth circle",
  () => {
    expect(false).toEqual(true);
  }
);

describe("side menu", () => {
  it("opens on the LHS when the hamburger button is pressed", () => {
    expect(false).toEqual(true);
  });

  it("contains links to all the different pages", () => {
    expect(false).toEqual(true);
  });

  it("highlights the current page", () => {
    expect(false).toEqual(true);
  });
});

describe("sign in page", () => {
  it("has a textbox for the name, two signature pads and a submit button", () => {
    expect(false).toEqual(true);
  });

  it("does not allow the form to be sumbitted unless all the fields are filled in", () => {
    expect(false).toEqual(true);
  });

  it("submits data to the /sign-in endpoint", () => {
    expect(false).toEqual(true);
  });

  it("submits the data in the expect format", () => {
    expect(false).toEqual(true);
  });

  it("submits the cub's name, cub's signature and parent's signature", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if the sign in is successful", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if the sign in is unsuccessful", () => {
    expect(false).toEqual(true);
  });

  it(
    "provides autocomplete for the cub name text box if" +
      " names are returned by the /names endpoint",
    () => {
      expect(false).toEqual(true);
    }
  );
});

describe("sign out page", () => {
  it(
    "has a text box for the cub's name, a signature pad for the parent's signature" +
      " and a submit button",
    () => {
      const wrapper = mount(<SignOutForm />);
      expect(wrapper.find("SignaturePadWrapper").length).toEqual(1);
      expect(wrapper.find(AutoCompleteTextBox).length).toEqual(1);
      expect(wrapper.find(Button).length).toEqual(1);
    }
  );

  it("does not allow the form to be submitted unless all the fields are filled in", () => {
    const submitterMock = jest.fn();
    const validatorMock = jest.fn(_ => false);
    const wrapper = mount(
      <SignOutForm validator={validatorMock} submitter={submitterMock} />
    );
    const submitButton = wrapper.find(Button);
    console.log(submitButton.simulate("click"));
    expect(validatorMock.mock.calls.length).toBe(1);
    expect(submitterMock.mock.calls.length).toBe(0);
  });

  it("submits data to the /sign-out endpoint", () => {
    expect(false).toEqual(true);
  });

  it("submits the data in the expect format", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if the sign out is successful", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if the sign out is unsuccessful", () => {
    expect(false).toEqual(true);
  });

  it(
    "provides autocomplete for the cub name text box if" +
      " names are returned by the /names endpoint",
    () => {
      expect(false).toEqual(true);
    }
  );
});

describe("settings page", () => {
  it(
    "has three textboxes, one for speadsheet ID, attendance sheet and" +
      " autocomplete sheet each and a submit button",
    () => {
      expect(false).toEqual(true);
    }
  );

  it("tries to get the previously saved settings", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if it failed to get the previously saved settings", () => {
    expect(false).toEqual(true);
  });

  it("prefills the settings boxes if the settings are found", () => {
    expect(false).toEqual(true);
  });

  it("submits the data to the /settings endpoint", () => {
    expect(false).toEqual(true);
  });

  it("submits the data in the expect format", () => {
    expect(false).toEqual(true);
  });

  it("does not allow the form to be submitted without a spreadsheet ID and attendance sheet", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if it fails to submit the form", () => {
    expect(false).toEqual(true);
  });

  it("notifies the user if it successfully submits the form", () => {
    expect(false).toEqual(true);
  });
});
