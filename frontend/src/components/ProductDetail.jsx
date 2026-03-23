export default function ProductDetail({ product, loading, error, onClose }) {
  return (
    <div className="card detail-card">
      <div className="detail-header">
        <h2>Chi tiết sản phẩm</h2>
        <button className="secondary" onClick={onClose}>Đóng</button>
      </div>

      {loading && <p>Đang tải chi tiết...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && product && (
        <div className="detail-content">
          <img src={product.image} alt={product.name} className="detail-image" />
          <div>
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Tên:</strong> {product.name}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Giá:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
          </div>
        </div>
      )}
    </div>
  );
}
