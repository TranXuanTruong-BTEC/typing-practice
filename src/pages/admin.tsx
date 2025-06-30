import { useState, useEffect, useMemo } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState({ title: '', text: '', category: '', language: '', difficulty: 'easy' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [typingTexts, setTypingTexts] = useState<TypingText[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch('/api/texts')
      .then(res => res.json())
      .then(data => setTypingTexts(data));
  }, [refresh]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(typingTexts.map(text => text.category)));
    return cats;
  }, [typingTexts]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (editingId) {
      // Sửa bài tập
      const res = await fetch('/api/update-text', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form })
      });
      setLoading(false);
      if (res.ok) {
        setMessage('Sửa thành công!');
        setEditingId(null);
        setForm({ title: '', text: '', category: '', language: '', difficulty: 'easy' });
        setRefresh(r => r + 1);
      } else {
        setMessage('Có lỗi xảy ra!');
      }
    } else {
      // Thêm mới
      const res = await fetch('/api/add-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setLoading(false);
      if (res.ok) {
        setMessage('Thêm thành công!');
        setForm({ title: '', text: '', category: '', language: '', difficulty: 'easy' });
        setRefresh(r => r + 1);
      } else {
        setMessage('Có lỗi xảy ra!');
      }
    }
  };

  const handleEdit = (text: { _id?: string; id?: string; title: string; text: string; category: string; language: string; difficulty: string }) => {
    setEditingId(text._id);
    setForm({
      title: text.title,
      text: text.text,
      category: text.category,
      language: text.language,
      difficulty: text.difficulty
    });
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài này?')) return;
    setLoading(true);
    const res = await fetch('/api/delete-text', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setLoading(false);
    if (res.ok) {
      setMessage('Đã xóa!');
      setRefresh(r => r + 1);
    } else {
      setMessage('Có lỗi khi xóa!');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">{editingId ? 'Sửa bài tập' : 'Thêm bài tập mới'}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required className="admin-input" data-cy="admin-title" />
        <textarea name="text" placeholder="Nội dung" value={form.text} onChange={handleChange} required rows={4} className="admin-input" data-cy="admin-text" />
        <select name="category" value={form.category} onChange={handleChange} required className="admin-input" data-cy="admin-category">
          <option value="">Chọn danh mục</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select name="language" value={form.language} onChange={handleChange} required className="admin-input" data-cy="admin-language">
          <option value="">Chọn ngôn ngữ</option>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
          <option value="jp">日本語</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="zh">中文</option>
          <option value="de">Deutsch</option>
          <option value="ru">Русский</option>
          <option value="it">Italiano</option>
          <option value="ko">한국어</option>
        </select>
        <select name="difficulty" onChange={handleChange} value={form.difficulty} required className="admin-input" data-cy="admin-difficulty">
          <option value="easy">Dễ</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Khó</option>
        </select>
        <div className="admin-btn-group">
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" data-cy="admin-submit">{loading ? (editingId ? 'Đang sửa...' : 'Đang thêm...') : (editingId ? 'Lưu thay đổi' : 'Thêm bài tập')}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', text: '', category: '', language: '', difficulty: 'easy' }); setMessage(''); }} className="admin-btn admin-btn-secondary">Hủy sửa</button>}
        </div>
      </form>
      <div className="admin-message" style={{ color: message === 'Thêm thành công!' || message === 'Sửa thành công!' || message === 'Đã xóa!' ? 'green' : 'red' }}>{message}</div>
      <hr className="admin-hr" />
      <h3 className="admin-list-title">Danh sách bài tập</h3>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Ngôn ngữ</th>
              <th>Độ khó</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {typingTexts.map(text => (
              <tr key={text._id || text.id}>
                <td>{text.title}</td>
                <td>{text.category}</td>
                <td>{text.language}</td>
                <td>{text.difficulty}</td>
                <td>
                  <button onClick={() => handleEdit(text)} className="admin-btn admin-btn-edit">Sửa</button>
                  <button onClick={() => text._id ? handleDelete(String(text._id)) : alert('Không tìm thấy _id để xóa!')} className="admin-btn admin-btn-delete" disabled={!text._id}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .admin-container {
          max-width: 700px;
          margin: 40px auto;
          padding: 24px;
          border: 1px solid #eee;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .admin-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .admin-input {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }
        .admin-btn-group {
          display: flex;
          gap: 10px;
        }
        .admin-btn {
          padding: 8px 18px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .admin-btn-primary {
          background: #2563eb;
          color: #fff;
        }
        .admin-btn-primary:hover {
          background: #1d4ed8;
        }
        .admin-btn-secondary {
          background: #e5e7eb;
          color: #222;
        }
        .admin-btn-secondary:hover {
          background: #d1d5db;
        }
        .admin-btn-edit {
          background: #fbbf24;
          color: #fff;
          margin-right: 6px;
        }
        .admin-btn-edit:hover {
          background: #f59e0b;
        }
        .admin-btn-delete {
          background: #ef4444;
          color: #fff;
        }
        .admin-btn-delete:hover {
          background: #dc2626;
        }
        .admin-message {
          margin-top: 16px;
          min-height: 24px;
          text-align: center;
          font-weight: 500;
        }
        .admin-hr {
          margin: 32px 0;
        }
        .admin-list-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .admin-table-wrapper {
          max-height: 400px;
          overflow-y: auto;
          margin-top: 16px;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: #fafafa;
        }
        .admin-table th, .admin-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }
        .admin-table th {
          background: #f3f4f6;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .admin-container { padding: 8px; }
          .admin-table th, .admin-table td { padding: 6px 4px; font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
} 