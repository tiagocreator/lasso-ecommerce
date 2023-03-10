import { useState } from 'react';

import styles from './ProductsPagination.module.scss';

const ProductsPagination = ({
  productsPerPage,
  currentProductPage,
  setCurrentProductPage,
  totalNumberOfProducts,
}) => {
  const productsPagesNumbers = [];
  const totalNumberOfPages = totalNumberOfProducts / productsPerPage;
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  const selectPage = (productsPagesNumbers) => {
    setCurrentProductPage(productsPagesNumbers);
  };

  const goToNextPage = () => {
    setCurrentProductPage(currentProductPage + 1);
    if (currentProductPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const goToPreviousPage = () => {
    setCurrentProductPage(currentProductPage - 1);
    if ((currentProductPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  for (let i = 1; i <= Math.ceil(totalNumberOfProducts / productsPerPage); i++) {
    productsPagesNumbers.push(i);
  }

  return (
    <ul className={styles.container}>
      <li
        className={currentProductPage === productsPagesNumbers[0] ? `${styles.hidden}` : null}
        onClick={goToPreviousPage}>
        Anterior
      </li>
      {productsPagesNumbers.map((pageNumber) => {
        if (pageNumber < maxPageNumberLimit + 1 && pageNumber > minPageNumberLimit) {
          return (
            <li
              className={currentProductPage === pageNumber ? `${styles.active}` : null}
              key={pageNumber}
              onClick={() => selectPage(pageNumber)}>
              {pageNumber}
            </li>
          );
        }
      })}
      <li
        className={currentProductPage === productsPagesNumbers.length ? `${styles.hidden}` : null}
        onClick={goToNextPage}>
        Pr??xima
      </li>
      <p>
        <strong className={styles.page}>{`P??gina ${currentProductPage}`}</strong>
        <span>{` de `}</span>
        <strong className={styles.page}>{`${Math.ceil(totalNumberOfPages)}`}</strong>
      </p>
    </ul>
  );
};

export default ProductsPagination;
