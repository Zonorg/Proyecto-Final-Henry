import "./cart.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../redux/actions/actions";
import { Link } from "react-router-dom";
import axios from "axios";
import DiscountCodeInput from "./DiscountCodeInput/DiscountCodeInput";
import { FiShoppingCart } from "react-icons/fi";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token } = JSON.parse(localStorage.getItem("userData")) ?? {};

  const API_URL = "cart/";

  const cartProducts = useSelector((state) => state.cartProducts.sort((a, b) => a.id - b.id));
  const { totalPrice, discountPrice } = useSelector((state) => state.cartDetail);

  const [hasDiscount, setHasDiscount] = useState(false);

  const handleCart = () => {
    dispatch(getCart(id));
    setHasDiscount(true);
    localStorage.setItem("hasDiscount", true);
  };

  useEffect(() => {
    dispatch(getCart(id));
    setHasDiscount(false);
    localStorage.removeItem("hasDiscount");
  }, []);

  if (!token) {
    useEffect(() => {
      navigate("/home");
    }, []);
  }

  const handleProduct = async (productId, url) => {
    try {
      const response = await axios.post(API_URL + url, {
        productId,
        userId: id,
      });

      if (response.status === 200) {
        setHasDiscount(false);
        dispatch(getCart(id));
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleEmptyCart = async () => {
    try {
      await axios.post(API_URL + `empty/${id}`);

      dispatch(getCart(id));
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="cartProduct">
      {cartProducts?.length > 0 ? (
        <div className="cart-products">
          {cartProducts?.map((product) => (
            <section className="cart-product" key={product.id}>
              <button className="cart-delete-button" onClick={() => handleProduct(product.id, "del")}>
                Eliminar
              </button>
              <img className="cart-product-image" src={product.image} alt={product.name} />
              <Link to={`/detail/${product.id}`} className="cart-product-name">
                {product.name}
              </Link>
              <div className="cart-product-quantity">
                <button onClick={() => handleProduct(product.id, "sub")}>-</button>
                <h4>{product.ShoppingCart_Products.quantity}</h4>
                <button onClick={() => handleProduct(product.id, "add")}>+</button>
              </div>
              <h3 className="cart-product-price">
                $ {(product.ShoppingCart_Products.quantity * product.price).toLocaleString()}
              </h3>
            </section>
          ))}
          <section className="section-totalPrice">
            <DiscountCodeInput userId={id} handleCart={handleCart} />
            <p className="labelPrice">Precio total: </p>
            {hasDiscount ? (
              <div className="divDiscount">
                <p className="pPriceWithDiscount">$ {totalPrice.toLocaleString()}</p>
                <div>
                  <p className="pPrice">$ {discountPrice.toLocaleString()}</p>
                  <p className="pDiscount">{Math.round(((totalPrice - discountPrice) / totalPrice) * 100)}% OFF</p>
                </div>
              </div>
            ) : (
              <p className="pPrice">$ {totalPrice?.toLocaleString()}</p>
            )}
          </section>
          <section className="section-totalPrice section-totalPrice-buttons">
            <button onClick={handleEmptyCart} className="empty-cart">
              Vaciar carrito
            </button>

            <Link to="/shipping" className="buyButton">
              Continuar comprando
            </Link>
          </section>
        </div>
      ) : (
        <div className="cart-products-empty">
          <p className="cart-empty">El carrito de compras está vacío</p>
          <FiShoppingCart size={100} className="cart-icon" />
          <Link to={"/home"}>Ir a la tienda</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
