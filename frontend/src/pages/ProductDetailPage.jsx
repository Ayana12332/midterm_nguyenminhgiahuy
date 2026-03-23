import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProduct, getProductById } from '../api';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(productId);
        if (!cancelled) setProduct(data);
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

  const handleDelete = async () => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');
    if (!confirmed) return;
    try {
      await deleteProduct(productId);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="detail-page-header">
          <div>
            <h1>Chi tiết sản phẩm</h1>
            <p>
              <Link to="/">← Quay về danh sách</Link>
            </p>
          </div>
          <div className="detail-page-actions">
            <button className="secondary" onClick={() => navigate(`/products/${productId}/edit`)}>
              Sửa
            </button>
            <button className="danger" onClick={handleDelete}>
              Xóa
            </button>
          </div>
        </div>
      </header>

      {error && <p className="error-text global-error">{error}</p>}

      {loading && <div className="card">Đang tải chi tiết...</div>}

      {!loading && !error && product && (
        <div className="card detail-card">
          <div className="detail-content">
            <img src={product.image} alt={product.name} className="detail-image" />
            <div>
              <p>
                <strong>ID:</strong> {product.id}
              </p>
              <p>
                <strong>Tên:</strong> {product.name}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Giá:</strong> ${product.price}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
