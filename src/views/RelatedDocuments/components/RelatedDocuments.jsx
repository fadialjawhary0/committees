import React, { useState } from 'react';
import { FaSearch, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';
import styles from './RelatedDocuments.module.scss';

const initialDocumentsData = [
  {
    id: 1,
    title: 'تقرير الأداء',
    uploadedBy: 'أحمد علي',
    uploadDate: '2024-06-01',
    type: 'تقرير',
  },
  {
    id: 2,
    title: 'محضر اجتماع',
    uploadedBy: 'سارة أحمد',
    uploadDate: '2024-06-05',
    type: 'محضر',
  },
  {
    id: 3,
    title: 'عقد جديد',
    uploadedBy: 'محمد صالح',
    uploadDate: '2024-06-10',
    type: 'عقد',
  },
  {
    id: 4,
    title: 'تقرير الأداء',
    uploadedBy: 'أحمد علي',
    uploadDate: '2024-06-01',
    type: 'تقرير',
  },
  {
    id: 5,
    title: 'محضر اجتماع',
    uploadedBy: 'سارة أحمد',
    uploadDate: '2024-06-05',
    type: 'محضر',
  },
  {
    id: 6,
    title: 'عقد جديد',
    uploadedBy: 'محمد صالح',
    uploadDate: '2024-06-10',
    type: 'عقد',
  },
];

const RelatedDocuments = () => {
  const [documents, setDocuments] = useState(initialDocumentsData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(document => document.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = id => {
    setDocuments(documents.filter(document => document.id !== id));
  };

  const handleSearch = e => setSearchTerm(e.target.value);

  return (
    <div className={styles.relatedDocumentsPage}>
      <div className={styles.header}>
        <div className={styles.statsSearchContainer}>
          <div className={styles.search}>
            <input type='text' placeholder='ابحث عن مستند' value={searchTerm} onChange={handleSearch} />
            <FaSearch className={styles.searchIcon} />
          </div>
          <div className={styles.stats}>
            <p>إجمالي المستندات: {documents.length}</p>
            <p>تقارير: {documents.filter(doc => doc.type === 'تقرير').length}</p>
            <p>محاضر: {documents.filter(doc => doc.type === 'محضر').length}</p>
            <p>عقود: {documents.filter(doc => doc.type === 'عقد').length}</p>
          </div>
        </div>
        <button className={styles.uploadButton}>
          <FaUpload /> رفع مستند
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>عنوان المستند</th>
              <th>الرافع</th>
              <th>تاريخ الرفع</th>
              <th>النوع</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments?.map(document => (
              <tr key={document.id}>
                <td>{document?.title}</td>
                <td>{document?.uploadedBy}</td>
                <td>{document?.uploadDate}</td>
                <td>{document?.type}</td>
                <td>
                  <button className={styles.tableDownloadButton}>
                    <FaDownload />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(document.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatedDocuments;
