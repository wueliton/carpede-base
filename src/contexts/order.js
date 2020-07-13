import React, { createContext, useContext, useState } from 'react';
import AuthContext from './auth';

import { STORE_ID } from '../constants/api';
import { apiMain } from '../services/api';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { customer } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  const addProduct = (item) => setProducts([...products, item]);

  const editProduct = (item) => {
    const index = products.findIndex(
      (obj) => obj.product.idSelect === item.product.idSelect
    );
    products[index].quantity = item.quantity;
    products[index].notice = item.notice;
    setProducts([...products]);
  };

  const removeProduct = (item) => {
    const index = products.findIndex(
      (obj) => obj.product.idSelect === item.product.idSelect
    );
    products.splice(index, 1);
    setProducts([...products]);
  };

  const calculateTotalValue = (fees = 0) => {
    const calculate = products.reduce(
      (total, each) => total + each.product.price * each.quantity,
      0
    );
    return calculate + fees;
  };

  const confirmOrder = async (
    fees,
    delivery,
    paymentMethod,
    amount,
    change,
    method
  ) => {
    const { name, whatsapp, address, complement, number } = customer;

    let payment;

    if (paymentMethod === 'card') {
      payment = {
        card: {
          method,
        },
      };
    } else {
      payment = {
        money: {
          amount,
        },
      };
    }

    const model = {
      store_id: STORE_ID,
      customer: {
        name,
        whatsapp: whatsapp.raw,
        address,
        complement,
        number,
      },
      fees: {
        payment: fees,
        delivery,
      },
      value: calculateTotalValue(fees + delivery),
      change,
      paymentMethod: payment,
      products,
      latitude: customer.latitude,
      longitude: customer.longitude,
    };

    const { data } = await apiMain.post('orders/new', model);

    if (data) setProducts([]);
  };

  return (
    <OrderContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        removeProduct,
        calculateTotalValue,
        confirmOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;