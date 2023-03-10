import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config';

import { selectPreviousUrl } from '../../redux/slices/cartSlice';

import Card from '../../components/card/Card';
import Spinner from '../../components/spinner/Spinner';
import { toast } from 'react-toastify';
import { FaGoogle } from 'react-icons/fa';

import LoginImg from '../../assets/img/login.jpg';

import styles from './Auth.module.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const previousUrl = useSelector(selectPreviousUrl);

  const redirectUser = () => {
    if (previousUrl.includes('cart')) {
      return navigate('/cart');
    } else {
      navigate('/');
    }
  };

  // Email login
  const loginUser = (e) => {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        toast.success('Login efetuado com sucesso!');
        redirectUser();
      })
      .catch((e) => {
        if (e.code === 'auth/invalid-email') {
          toast.error('Digite um endereço de email válido.');
        }
        if (
          e.code === 'auth/wrong-password' ||
          e.code === 'auth/user-not-found' ||
          e.code === 'auth/internal-error'
        ) {
          toast.error('Endereço de email ou senha incorretos');
        }

        if (e.code === 'auth/weak-password') {
          toast.warning('A senha de login precisa conter no minimo 6 caracteres.');
        }
        setLoading(false);
      });
  };

  // Gmail login
  const provider = new GoogleAuthProvider();
  const gmailLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success('Login efetuado com sucesso!');
        redirectUser();
      })
      .catch((e) => {
        toast.error('Não foi possível conactar a sua conta Google.');
      });
  };

  return (
    <section className={`container ${styles.auth}`}>
      {loading && <Spinner />}
      <Card>
        <div className={styles.form}>
          <h2>Login</h2>
          <form action='' onSubmit={loginUser}>
            <input
              type='text'
              placeholder='Endereço de Email'
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type='password'
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' className='--btn --btn-primary --btn-block'>
              Login
            </button>
            <div className={styles.links}>
              <Link to='/reset-password'>Esqueceu a senha?</Link>
            </div>
            <p>-- ou --</p>
          </form>
          <button className='--btn --btn-danger --btn-block' onClick={gmailLogin}>
            <FaGoogle className={styles.icon} size={15} />
            Entrar com o Gmail
          </button>
          <span className={styles.register}>
            <p>Não tem uma conta?</p>
            <Link className={styles['account-link']} to='/register'>
              Criar conta
            </Link>
          </span>
        </div>
      </Card>
      <div className={styles.img}>
        <img src={LoginImg} alt='' width='400' height='auto' />
      </div>
    </section>
  );
};

export default Login;
