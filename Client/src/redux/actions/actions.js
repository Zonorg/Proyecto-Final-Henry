import axios from "axios";
import { GET_USER, GET_ALL_PRODUCTS, GET_PRODUCT_DETAIL, GET_CART, ALL_FILTERS } from "./actions-types";
import qs from "query-string";

export const loginUser = (user, url) => {
  return async (dispatch) => {
    try {
      let response = await axios.post(`user/login/${url}`, user);
      localStorage.setItem("userData", JSON.stringify(response.data));
      return dispatch({
        type: GET_USER,
        payload: response.data,
      });
    } catch (error) {
      console.error("Error en la petición:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.error(errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error(error.message);
        throw new Error("Error en la petición");
      }
    }
  };
};

export const createUser = async (user) => {
  try {
    const response = await axios.post("user", user);
    if (response.data.success) {
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
};

export const getCart = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`cart/user/${userId}`);
    // console.log(response.data)
    dispatch({ type: GET_CART, payload: response.data });
  } catch (error) {
    console.error("Error al obtener el carrito del usuario:", error);
  }
};

export const getAllProducts = () => {
  return async (dispatch) => {
    try {
      let response = await axios.get("products");
      return dispatch({
        type: GET_ALL_PRODUCTS,
        payload: response.data,
      });
    } catch (error) {
      console.error("Error while fetching all products:", error);
    }
  };
};

export function getProductDetail(id) {
  return async function (dispatch) {
    try {
      let productId = await axios.get(`products/${id}`);
      return dispatch({
        type: GET_PRODUCT_DETAIL,
        payload: productId.data,
      });
    } catch (error) {
      console.error("Error while fetching product detail:", error);
    }
  };
}

export function allFilters(payload) {
  const params = {
    brand: payload.brand || null,
    category: payload.category || null,
    search: payload.search || null,
  };

  // construir la URL de consulta usando query-string
  const query = `products?${qs.stringify(params)}`;

  return async (dispatch) => {
    try {
      const response = await axios.get(query);
      return dispatch({
        type: ALL_FILTERS,
        payload: {
          response: response.data,
          condition: payload,
        },
      });
    } catch (error) {
      console.error("Error while applying filters:", error);
    }
  };
}

export const getAllUsers = () => {
  return async (dispatch) => {
    try {
      let response = await axios("user");
      return dispatch({
        type: GET_USER,
        payload: response.data,
      });
    } catch (error) {
      console.error("Error while fetching all users:", error);
    }
  };
};
