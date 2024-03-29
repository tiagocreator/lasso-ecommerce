import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
  decreaseCartProductQuantity,
  removeProductFromCart,
  clearAllCartItems,
  calculateProductsSubtotal,
  calculateProductsTotalQuantity,
  saveUrl,
} from '../../redux/slices/cartSlice';
import { selectIsLoggedIn } from '../../redux/slices/authSlice';

import { Card } from '../../components/index';

import { HiOutlineArrowLeft } from 'react-icons/hi';
import { FaTrashAlt } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';

import styles from './Cart.module.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const decreaseProductQuantity = (cart) => {
    dispatch(decreaseCartProductQuantity(cart));
  };

  const increaseProductQuantity = (cart) => {
    dispatch(addToCart(cart));
  };

  const removeSelectedProduct = (cart) => {
    dispatch(removeProductFromCart(cart));
  };

  const clearCart = () => {
    dispatch(clearAllCartItems());
  };

  useEffect(() => {
    dispatch(calculateProductsSubtotal());
    dispatch(calculateProductsTotalQuantity());
    dispatch(saveUrl(''));
  }, [dispatch, cartItems]);

  const currentUrl = window.location.href;
  const checkout = () => {
    if (isLoggedIn) {
      navigate('/checkout-details');
    } else {
      dispatch(saveUrl(currentUrl));
      navigate('/login');
    }
  };

  return (
    <section>
      <div className={`container ${styles.container}`}>
        <h2>Carrinho de Compras</h2>
        {cartItems.length === 0 ? (
          <>
            <p>Carrinho de compras vazio.</p>
            <br />
            <div>
              <Link to='/#products'>
                <HiOutlineArrowLeft /> Ir As Compras
              </Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th>Opções</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart, index) => {
                  const { id, name, price, imgUrl, cartTotalQuantity } = cart;

                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <strong>{name}</strong>
                        </p>
                        <img src={imgUrl} alt={name} style={{ width: '100px' }} />
                      </td>
                      <td>{`R$:${price.toFixed(2)}`}</td>
                      <td>
                        <div className={styles.count}>
                          <button className='--btn' onClick={() => decreaseProductQuantity(cart)}>
                            -
                          </button>
                          <p>
                            <strong>{cartTotalQuantity}</strong>
                          </p>
                          <button className='--btn' onClick={() => increaseProductQuantity(cart)}>
                            +
                          </button>
                        </div>
                      </td>
                      <td>{`R$:${(price * cartTotalQuantity).toFixed(2)}`}</td>
                      <td className={styles.icons}>
                        <FaTrashAlt
                          size={18}
                          color='var(--color-danger)'
                          onClick={() => removeSelectedProduct(cart)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.summary}>
              <button className='--btn --btn-danger' onClick={clearCart}>
                Limpar Carrinho
              </button>
              <div className={styles.checkout}>
                <div>
                  <Link to='/#product'>
                    <BsArrowLeft size={12} /> Continuar comprando
                  </Link>
                </div>
                <br />
                <Card cardClass={styles.card}>
                  <p>
                    <strong>{`Produto(s) no carrinho: ${cartTotalQuantity}`}</strong>
                  </p>
                  <div className={styles.text}>
                    <h4>Subtotal:</h4>
                    <h3>{`R$:${cartTotalAmount.toFixed(2)}`}</h3>
                  </div>
                  <p>Juros e frete calculados no próximo passo.</p>
                  <button className='--btn --btn-block --btn-primary' onClick={checkout}>
                    Continuar
                  </button>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
