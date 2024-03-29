import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase/config';

import { selectProducts } from '../../../redux/slices/productSlice';

import { toast } from 'react-toastify';

import Card from '../../card/Card';

import styles from './AdminAddProduct.module.scss';

const categories = [
  {
    id: 0,
    name: 'Espacial',
  },
  {
    id: 1,
    name: 'Celular',
  },
  {
    id: 2,
    name: 'Roupa Masculina',
  },
  {
    id: 3,
    name: 'Roupa Feminina',
  },
  {
    id: 4,
    name: 'Calçado',
  },
];

const emptyProductState = {
  name: '',
  imgUrl: '',
  price: 0,
  category: '',
  brand: '',
  desc: '',
};

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const identifyFormType = (id, optionOne, optionTwo) => {
    if (id === 'new') {
      return optionOne;
    }
    return optionTwo;
  };

  const products = useSelector(selectProducts);
  const productModify = products.find((foundProduct) => foundProduct.id === id);

  const [product, setProduct] = useState(() => {
    const customState = identifyFormType(
      id,
      {
        ...emptyProductState,
      },
      productModify,
    );
    return customState;
  });
  const [imgUploadProgress, setImgUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImgChange = (e) => {
    const imgFile = e.target.files[0];
    const storageRef = ref(storage, `images/${Date.now()}${imgFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imgFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(progress);
      },
      (e) => {
        toast.error('Falha ao adicionar imagem, tente novamente mais tarde.');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({
            ...product,
            imgUrl: downloadURL,
          });
          toast.success('Imagem adicionada com sucesso.');
        });
      },
    );
  };

  const addProduct = (e) => {
    e.preventDefault();

    try {
      addDoc(collection(db, 'products'), {
        name: product.name,
        imgUrl: product.imgUrl,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        uploadTime: Timestamp.now().toDate(),
      });
      setImgUploadProgress(0);
      setProduct({ name: '', imgUrl: '', price: 0, category: '', brand: '', desc: '' });
      toast.success('Produto adicionado!');
      navigate('/admin/view-all-products');
    } catch (e) {
      toast.error('Erro. Não foi possível adicionar o produto.');
    }
  };

  const modifyProduct = (e) => {
    e.preventDefault();

    if (product.imgUrl !== productModify.imgUrl) {
      const imageRef = ref(storage, productModify.imgUrl);
      deleteObject(imageRef);
    }

    try {
      setDoc(doc(db, 'products', id), {
        name: product.name,
        imgUrl: product.imgUrl,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        uploadTime: productModify.uploadTime,
        modifiedTime: Timestamp.now().toDate(),
      });
      toast.success('Produto modificado com sucesso!');
      navigate('/admin/view-all-products');
    } catch (e) {
      toast.error('Erro. Não foi possível modificar o produto.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>{identifyFormType(id, 'Adicionar um produto', 'Modificar produto')}</h2>
      <Card cardClass={styles.card}>
        <form onSubmit={identifyFormType(id, addProduct, modifyProduct)}>
          <label>Nome do produto:</label>
          <input
            type='text'
            placeholder='Nome do produto'
            name='name'
            value={product.name}
            required
            onChange={(e) => handleInputChange(e)}
          />
          <label>Imagem:</label>
          <Card cardClass={styles.group}>
            {imgUploadProgress === 0 ? null : (
              <div className={styles.progress}>
                <div className={styles['progress-bar']} style={{ width: `${imgUploadProgress}%` }}>
                  {imgUploadProgress < 100
                    ? `Enviando... ${imgUploadProgress.toFixed(0)}`
                    : `Enviado! ${imgUploadProgress}`}
                  %
                </div>
              </div>
            )}
            <input
              type='file'
              name='image'
              accept='image/*'
              placeholder='Imagem'
              onChange={(e) => handleImgChange(e)}
            />
            {product.imgUrl === '' ? null : (
              <input
                type='text'
                name='imgUrl'
                value={product.imgUrl}
                disabled
                placeholder='Link da imagem...'
              />
            )}
          </Card>
          <label>Preço:</label>
          <input
            type='number'
            placeholder='Preço do produto'
            name='price'
            value={product.price}
            required
            onChange={(e) => handleInputChange(e)}
          />
          <label>Categoria:</label>
          <select
            name='category'
            value={product.category}
            required
            onChange={(e) => handleInputChange(e)}>
            <option value='' disabled>
              Escolha uma categoria
            </option>
            {categories.map((e) => {
              return (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              );
            })}
          </select>
          <label>Marca ou empresa:</label>
          <input
            type='text'
            placeholder='Marca do produto'
            name='brand'
            value={product.brand}
            required
            onChange={(e) => handleInputChange(e)}
          />
          <label>Detalhes do produto:</label>
          <textarea
            name='desc'
            value={product.desc}
            cols='30'
            rows='10'
            required
            onChange={(e) => handleInputChange(e)}></textarea>
          <button className='--btn --btn-primary'>
            {identifyFormType(id, 'Adicionar produto', 'Atualizar produto')}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminAddProduct;
