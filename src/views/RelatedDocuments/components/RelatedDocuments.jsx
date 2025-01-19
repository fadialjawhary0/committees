import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaTrash, FaUpload, FaPlus } from 'react-icons/fa';
import styles from './RelatedDocuments.module.scss';
import apiService from '../../../services/axiosApi.service';
import { DeleteModalConstants, MIME_TYPE } from '../../../constants';
import DeleteModal from '../../../components/DeleteModal';
import { useToast } from '../../../context';
import { useFileUpload } from '../../../hooks/useFileUpload';

const RelatedDocuments = () => {
  const { showToast } = useToast();
  const { handleFileChange } = useFileUpload();

  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState({ deleteFile: false });
  const [selectedFileID, setSelectedFileID] = useState(null);

  const rowsPerPage = 9;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredDocuments = documents?.filter(document =>
    document?.DocumentName?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  const currentRows = filteredDocuments?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredDocuments?.length / rowsPerPage);

  const fetchDocuments = async () => {
    try {
      const response = await apiService.getById(
        'GetAllRelatedAttachmentByCommitteeID',
        localStorage.getItem('selectedCommitteeID'),
      );
      setDocuments(response || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleDeleteFile = async fileID => {
    try {
      await apiService.delete('DeleteRelatedAttachment', fileID);
      setIsModalOpen({ ...isModalOpen, deleteFile: false });
      setDocuments(prev => prev.filter(document => document.ID !== fileID));
      showToast('تم حذف المستند بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      showToast('حدث خطأ أثناء حذف المستند', 'error');
    }
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.relatedDocumentsPage}>
      <div className={styles.header}>
        <div className={styles.statsSearchContainer}>
          <div className={styles.searchFilterContainer}>
            <input type='text' placeholder='ابحث عن مستند' value={searchTerm} onChange={handleSearch} />
            <FaSearch />
          </div>
          <div className={styles.stats}>
            {/* <p>إجمالي المستندات: {documents.length}</p>
            <p>تقارير: {documents.filter(doc => doc.type === 'تقرير').length}</p>
            <p>محاضر: {documents.filter(doc => doc.type === 'محضر').length}</p>
            <p>عقود: {documents.filter(doc => doc.type === 'عقد').length}</p> */}
          </div>
        </div>
        <label className={styles.button}>
          <FaPlus className={styles.addIcon} />
          <p>اضافة ملف</p>
          <input
            type='file'
            multiple
            accept='.pdf,.jpg,.jpeg,.png,.docx,.txt'
            style={{ display: 'none' }}
            onChange={e =>
              handleFileChange(e, 'AddRelatedAttachment', +localStorage.getItem('selectedCommitteeID'), null, fetchDocuments)
            }
          />
        </label>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم الملف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentRows?.map(document => (
              <tr key={document?.ID}>
                <td>{document?.DocumentName}</td>
                <td>
                  <a
                    href={`data:${MIME_TYPE};base64,${document?.DocumentContent}`}
                    download={document?.DocumentName}
                    className={styles.downloadButton}>
                    <FaDownload />
                  </a>

                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      setSelectedFileID(document?.ID);
                      setIsModalOpen({ ...isModalOpen, deleteFile: true });
                    }}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        {[...Array(totalPages)]?.map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ''}>
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen.deleteFile && (
        <DeleteModal
          isOpen={isModalOpen.deleteFile}
          onClose={() => {
            setIsModalOpen({ ...isModalOpen, deleteFile: false });
            setSelectedFileID(null);
          }}
          title={DeleteModalConstants?.DOCUMENT_TITLE}
          description={DeleteModalConstants?.DOCUMENT_DESCRIPTION}
          onDelete={() => handleDeleteFile(selectedFileID)}
        />
      )}
    </div>
  );
};

export default RelatedDocuments;
