import React from 'react';
import { render, fireEvent, screen, wait } from '@testing-library/react';
import GroceryService from './services/grocery.service'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
//Setup a mock of the grocery service file
jest.mock('./services/grocery.service');
describe("Grocery List App", () => {
  //If there were multiple test sections below then jest would run the code in the beforeEach section before each test.
  beforeEach(() => {
    //Mock the getGroceries function from the grocery service and simulate that it returned some data from the database.
    GroceryService.getGroceries.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            _id: 1,
            name: 'Pancakes',
            quantity: 1,
            bought: false
          },
          {
            _id: 2,
            name: 'Syrup',
            quantity: 2,
            bought: true
          }
        ]
      })
    );
  })

  test("Grocery List App", async () => {
    //Render the App component
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>);
    await wait(() => expect(GroceryService.getGroceries).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/Add Grocery/i)).toBeInTheDocument()
    expect(screen.getByText(/Grocery List/i)).toBeInTheDocument()
    expect(screen.getByText(/Pancakes/i)).toBeInTheDocument()
    expect(screen.queryByText(/Syrup/i)).not.toBeInTheDocument()
    const name = screen.getByLabelText('Grocery Name')
    const quantity = screen.getByLabelText('Quantity')
    expect(name.value).toBe('')
    expect(quantity.value).toBe('')
    fireEvent.change(name, { target: { value: 'Eggs' } })
    fireEvent.change(quantity, { target: { value: '1' } })
    expect(name.value).toBe('Eggs')
    expect(quantity.value).toBe('1')
    GroceryService.addGrocery.mockImplementationOnce(() =>
      Promise.resolve({
        data: 'Submit Successful'
      })
    );
    GroceryService.getGroceries.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            _id: 1,
            name: 'Pancakes',
            quantity: 1,
            bought: false
          },
          {
            _id: 2,
            name: 'Syrup',
            quantity: 2,
            bought: true
          },
          {
            _id: 2,
            name: 'Eggs',
            quantity: 1,
            bought: false
          }
        ]
      })
    );
    fireEvent.click(screen.queryByText('Submit'))
    await wait(() => expect(GroceryService.addGrocery).toHaveBeenCalledTimes(1));
    await wait(() => expect(GroceryService.getGroceries).toHaveBeenCalledTimes(2));
    expect(screen.getByText(/Added Eggs/i)).toBeInTheDocument()
    expect(screen.getByText("Eggs")).toBeInTheDocument()
    GroceryService.updateGrocery.mockImplementationOnce(() =>
      Promise.resolve({
        data: 'Update Successful'
      })
    );
    GroceryService.getGroceries.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            _id: 1,
            name: 'Pancakes',
            quantity: 1,
            bought: false
          },
          {
            _id: 2,
            name: 'Syrup',
            quantity: 2,
            bought: true
          },
          {
            _id: 3,
            name: 'Eggs',
            quantity: 1,
            bought: true
          }
        ]
      })
    );
    fireEvent.click(screen.getByTestId('got3'))
    await wait(() => expect(GroceryService.updateGrocery).toHaveBeenCalledTimes(1));
    await wait(() => expect(GroceryService.getGroceries).toHaveBeenCalledTimes(3));
    expect(screen.getByText("Got Eggs")).toBeInTheDocument()
    expect(screen.queryByText("Eggs")).not.toBeInTheDocument()
    GroceryService.deleteGrocery.mockImplementationOnce(() =>
      Promise.resolve({
        data: 'Delete Successful'
      })
    );
    GroceryService.getGroceries.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            _id: 2,
            name: 'Syrup',
            quantity: 2,
            bought: true
          },
          {
            _id: 3,
            name: 'Eggs',
            quantity: 1,
            bought: true
          }
        ]
      })
    );
    fireEvent.click(screen.getByTestId('delete1'))
    await wait(() => expect(GroceryService.deleteGrocery).toHaveBeenCalledTimes(1));
    await wait(() => expect(GroceryService.getGroceries).toHaveBeenCalledTimes(4));
    expect(screen.getByText("Removed Pancakes")).toBeInTheDocument()
    expect(screen.queryByText("Pancakes")).not.toBeInTheDocument()
  });
});


