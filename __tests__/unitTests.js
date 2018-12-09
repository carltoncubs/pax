import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import fetch from "jest-fetch-mock";
import { Enzyme, shallow, render, mount } from "enzyme";
import sinon from "sinon";
import { when } from "jest-when";
import { MemoryRouter } from "react-router";
import { fn as momentProto } from "moment";
import TextField from "@material-ui/core/TextField";

import App from "../src/App";
import SignInForm from "../src/SignInForm";
import SignOutForm from "../src/SignOutForm";
import Settings from "../src/Settings";
import {
  AutoCompleteTextBox,
  SignaturePadWrapper
} from "../src/CommonComponents";
import config from "../src/config.json";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("sign in page", () => {
  it("has a textbox for the name, two signature pads and a submit button", () => {
    const wrapper = mount(
      <SignInForm
        validator={_ => {}}
        submitter={() => {}}
        autocompletion={() => {}}
        token="token"
      />
    );
    expect(wrapper.find("SignaturePadWrapper").length).toEqual(2);
    expect(wrapper.find(AutoCompleteTextBox).length).toEqual(1);
    expect(wrapper.find(Button).length).toEqual(1);
  });

  it("does not allow the form to be sumbitted unless all the fields are filled in", () => {
    const submitterMock = jest.fn();
    const validatorMock = _ => () => false;
    const wrapper = mount(
      <SignInForm
        validator={validatorMock}
        submitter={submitterMock}
        autocompletion={() => {}}
        token="token"
      />
    );
    const submitButton = wrapper.find(Button);
    submitButton.simulate("submit");
    expect(submitterMock.mock.calls.length).toBe(0);
  });

  it("allows the form to be sumbmitted if all fields a filled in", () => {
    const submitterMock = jest.fn();
    const validatorMock = _ => () => true;
    const wrapper = mount(
      <SignInForm
        validator={validatorMock}
        submitter={submitterMock}
        autocompletion={() => {}}
        token="token"
      />
    );
    const submitButton = wrapper.find(Button);
    wrapper.setState({
      cubName: "cubName",
      cubSignature: "cubSig",
      parentSignature: "parentSig"
    });
    submitButton.simulate("submit");
    expect(submitterMock).toBeCalled();
  });

  it("adds a timestamp and date to the submitted data", () => {
    const app = shallow(<App token="token" />);
    const submitter = app.instance()["submitter"];
    sinon.useFakeTimers(new Date(2018, 1, 1).getTime());

    global.fetch = fetch;

    submitter("baseURL")("token")({
      props: {
        enqueueSnackbar: jest.fn()
      }
    })("endpoint")({
      cubName: "cubName",
      cubSignature: "cubSig",
      parentSignature: "parentSig"
    })("successMsg")("errorMsg");

    expect(global.fetch).toBeCalledWith(expect.any(String), {
      method: expect.any(String),
      body: JSON.stringify({
        cubName: "cubName",
        cubSignature: "cubSig",
        parentSignature: "parentSig",
        timestamp: "00:02:00",
        date: "2018-02-01"
      }),
      headers: {
        Authorization: expect.any(String)
      },
      mode: expect.any(String),
      cache: expect.any(String)
    });
  });
});

describe("sign out page", () => {
  it(
    "has a text box for the cub's name, a signature pad for the parent's signature" +
      " and a submit button",
    () => {
      const wrapper = mount(
        <SignOutForm
          validator={_ => {}}
          submitter={() => {}}
          autocompletion={() => {}}
        />
      );
      expect(wrapper.find("SignaturePadWrapper").length).toEqual(1);
      expect(wrapper.find(AutoCompleteTextBox).length).toEqual(1);
      expect(wrapper.find(Button).length).toEqual(1);
    }
  );

  it("does not allow the form to be submitted unless all the fields are filled in", () => {
    const validator = shallow(<App />).instance()["signOutValidator"];

    const submitterMock = jest.fn();
    const validatorSpy = sinon.spy(validator);
    const wrapper = mount(
      <SignOutForm
        validator={validatorSpy}
        submitter={submitterMock}
        autocompletion={() => {}}
        settingsGetter={_ => () => {}}
        enqueueSnackbar={jest.fn()}
      />
    );
    const submitButton = wrapper.find(Button);
    submitButton.simulate("submit");
    expect(validatorSpy.callCount).toBe(1);
    expect(submitterMock.mock.calls.length).toBe(0);
  });

  it("allows the form to be submitted with all the fields are filled in", () => {
    const submitterMock = jest.fn();
    const wrapper = mount(
      <SignOutForm
        validator={_ => () => true}
        submitter={submitterMock}
        autocompletion={() => {}}
        enqueueSnackbar={jest.fn()}
      />
    );

    wrapper.setState({
      cubName: "cubName",
      parentSignature: "parentSig"
    });

    const submitButton = wrapper.find(Button);
    submitButton.simulate("submit");
    expect(submitterMock.mock.calls.length).toBe(1);
  });
});

describe("settings page", () => {
  it(
    "has three textboxes, one for speadsheet ID, attendance sheet and" +
      " autocomplete sheet each and a submit button",
    () => {
      const wrapper = mount(
        <Settings
          validator={_ => {}}
          submitter={() => {}}
          settingsGetter={_ => __ => {}}
        />
      );

      expect(wrapper.find(TextField).length).toBe(3);
    }
  );

  it("tries to get the previously saved settings", () => {
    const settingsGetterMockInner = jest.fn();
    const settingsGetterMock = jest.fn(_ => settingsGetterMockInner);
    const wrapper = mount(
      <Settings
        validator={_ => {}}
        submitter={() => {}}
        settingsGetter={settingsGetterMock}
      />
    );

    expect(settingsGetterMock).toBeCalled();
    expect(settingsGetterMockInner).toBeCalled();
  });

  it("prefills the settings boxes if the settings are found", () => {
    const wrapper = mount(
      <Settings
        validator={_ => {}}
        submitter={() => {}}
        settingsGetter={ctx => () => {
          ctx.setState({
            spreadsheetId: "spreadsheetID",
            attendanceSheet: "attendanceSheet",
            autocompleteSheet: "autocompleteSheet"
          });
        }}
      />
    );

    expect(wrapper.find("TextField#spreadsheetId").props().value).toBe(
      "spreadsheetID"
    );
    expect(wrapper.find("TextField#attendanceSheet").props().value).toBe(
      "attendanceSheet"
    );
    expect(wrapper.find("TextField#autocompleteSheet").props().value).toBe(
      "autocompleteSheet"
    );
  });

  it("does not allow the form to be submitted without a spreadsheet ID and attendance sheet", () => {
    const settingsValidator = shallow(<App />).instance()["settingsValidator"];

    const submitterMock = jest.fn();
    const validatorSpy = sinon.spy(settingsValidator);
    const wrapper = mount(
      <Settings
        validator={validatorSpy}
        submitter={submitterMock}
        autocompletion={() => {}}
        settingsGetter={_ => () => {}}
        enqueueSnackbar={jest.fn()}
      />
    );
    const submitButton = wrapper.find(Button);
    submitButton.simulate("submit");
    expect(validatorSpy.callCount).toBe(1);
    expect(submitterMock.mock.calls.length).toBe(0);
  });

  it("does allows the form to be submitted with spreadsheet ID and attendance sheet", () => {
    const settingsValidator = shallow(<App />).instance()["settingsValidator"];

    const submitterMock = jest.fn();
    const validatorSpy = sinon.spy(settingsValidator);
    const wrapper = mount(
      <Settings
        validator={validatorSpy}
        submitter={submitterMock}
        autocompletion={() => {}}
        settingsGetter={_ => () => {}}
        enqueueSnackbar={jest.fn()}
      />
    );

    wrapper.setState({
      spreadsheetId: "spreadsheetId",
      attendanceSheet: "attendanceSheet"
    });
    const submitButton = wrapper.find(Button);
    submitButton.simulate("submit");
    expect(validatorSpy.callCount).toBe(1);
    expect(submitterMock.mock.calls.length).toBe(1);
  });
});
