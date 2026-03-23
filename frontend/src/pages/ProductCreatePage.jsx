import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct } from '../api';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (payload) => {
    try {
      setSubmitError('');
      const created = await createProduct(payload);
      navigate(`/products/${created.id}`);
      return true;
    } catch (err) {
      setSubmitError(err.message);
      return false;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="detail-page-header">
          <div>
            <h1>Thêm sản phẩm</h1>
            <p>
              <Link to="/">← Quay về danh sách</Link>
            </p>
          </div>
        </div>
      </header>

      <ProductForm onSubmit={handleSubmit} editingProduct={null} onCancel={() => navigate('/')} />
      {submitError && <p className="error-text global-error">{submitError}</p>}
    </div>
  );
}

