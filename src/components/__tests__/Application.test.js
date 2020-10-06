import React from 'react';
import axios from 'axios'

import { 
  render,
  cleanup, 
  waitForElement, 
  fireEvent,
  getByText,
  getAllByTestId, 
  getByAltText, 
  getByPlaceholderText, 
  waitForElementToBeRemoved, 
  queryByText 
} from '@testing-library/react';

import Application from 'components/Application';

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment")[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () =>{
    // 1. Render the Application.
  const { container } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Delete" button on the selected appointment.
  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(getByAltText(appointment, "Delete"));
  // 4. Check that the confirmation message is shown.
  expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
  // 5. Click the "Confirm" button on the confirmation.
  fireEvent.click(getByText(appointment,"Confirm"));
  // 6. Check that the element with the text "Deleting" is displayed.
  expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  // 7. Wait until the element with the "Add" button is displayed.
  await waitForElement(() => getByAltText(appointment, "Add"));
  // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
  const day = getAllByTestId(container, "day").find(day => 
    queryByText(day, "Monday")
  );

  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it ("loads data, edits an interview and keeps the spots remaining for Monday the same", async () =>{
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 3. Change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // 4. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 5. Wait for "Saving" element to be removed and check for new interviewer
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();
    // 6. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  it ("shows the save error when failing to save an appointment", async () =>{
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 3. Change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // 4. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 5. Wait for "Saving" element to be removed and check that an error was thrown
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();
  });
  it( "shows the delete error when failing to delete an existing appointment", async () =>{
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment,"Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait for "Saving" element to be removed and check that an error was thrown
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));
    expect(getByText(appointment, "Could not delete appointment")).toBeInTheDocument();
  });
});