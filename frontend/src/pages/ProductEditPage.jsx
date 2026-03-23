import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { getProductById, updateProduct } from '../api';

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(productId);
        if (!cancelled) setEditingProduct(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleSubmit = async (payload) => {
    try {
      setSubmitError('');
      await updateProduct(productId, payload);
      navigate(`/products/${productId}`);
      return true;
    } catch (err) {
      setSubmitError(err.message);
      return false;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Cập nhật sản phẩm</h1>
        <p>
          <Link to={`/products/${productId}`}>← Quay về chi tiết</Link>
        </p>
      </header>

      {loading && <div className="card">Đang tải dữ liệu...</div>}
      {error && <p className="error-text global-error">{error}</p>}

      {!loading && !error && (
        <>
          <ProductForm
            onSubmit={handleSubmit}
            editingProduct={editingProduct}
            onCancel={() => navigate(`/products/${productId}`)}
          />
          {submitError && <p className="error-text global-error">{submitError}</p>}
        </>
      )}
    </div>
  );
}
