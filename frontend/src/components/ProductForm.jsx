import { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
};

export default function ProductForm({ onSubmit, editingProduct, onCancel }) {
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [imageValue, setImageValue] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
      });
      setImageValue(editingProduct.image || '');
      setFileInputKey((prev) => prev + 1);
    } else {
      setFormData(initialForm);
      setImageValue('');
      setFileInputKey((prev) => prev + 1);
    }
  }, [editingProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      setFormError('Vui lòng chọn đúng file ảnh.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageValue(String(reader.result || ''));
    };
    reader.onerror = () => {
      setFormError('Không đọc được file ảnh. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      image: imageValue,
      stock: Number(formData.stock),
    };

    if (!payload.name || !payload.category || !payload.image) {
      setFormError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (payload.price <= 0) {
      setFormError('Giá phải lớn hơn 0.');
      return;
    }

    if (payload.stock < 0) {
      setFormError('Stock phải lớn hơn hoặc bằng 0.');
      return;
    }

    const success = await onSubmit(payload);
    if (success && !editingProduct) {
      setFormData(initialForm);
      setImageValue('');
      setFileInputKey((prev) => prev + 1);
    }
  };

  return (
    <div className="card form-card">
      <h2>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input
          key={fileInputKey}
          type="file"
          accept="image/*"
          onChange={handlePickImage}
        />
        <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />

        {imageValue ? <img src={imageValue} alt="Preview" className="detail-image" /> : null}
        {formError && <p className="error-text">{formError}</p>}

        <div className="form-actions">
          <button type="submit">{editingProduct ? 'Lưu thay đổi' : 'Thêm mới'}</button>
          {editingProduct && (
            <button type="button" className="secondary" onClick={onCancel}>
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
