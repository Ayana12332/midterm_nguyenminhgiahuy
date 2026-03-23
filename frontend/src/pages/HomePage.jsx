import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { deleteProduct, getProducts } from '../api';

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts({ search, category: categoryFilter });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    return ['All', ...uniqueCategories];
  }, [products]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="detail-page-header">
          <div>
            <h1>Product Management App</h1>
          </div>
          <div className="detail-page-actions">
            <button onClick={() => navigate('/products/new')}>Thêm sản phẩm</button>
          </div>
        </div>
      </header>

      <div className="card toolbar">
        <div className="list-header">
          <h2>Tìm kiếm & lọc</h2>
          <button className="secondary" onClick={fetchProducts}>
            Tải lại
          </button>
        </div>
        <div className="toolbar-controls horizontal">
          <input
            placeholder="Search sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="list-header">
        <h2>Danh sách sản phẩm</h2>
      </div>

      {loading && <div className="card">Đang tải dữ liệu...</div>}
      {error && <p className="error-text global-error">{error}</p>}
      {!loading && !error && (
        <ProductList
          products={products}
          onDelete={handleDelete}
          onViewDetail={(id) => navigate(`/products/${id}`)}
          onEdit={(product) => navigate(`/products/${product.id}/edit`)}
        />
      )}
    </div>
  );
}
