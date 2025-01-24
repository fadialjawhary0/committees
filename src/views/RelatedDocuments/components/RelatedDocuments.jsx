import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './RelatedDocuments.module.scss';
import apiService from '../../../services/axiosApi.service';
import { DeleteModalConstants, MIME_TYPE } from '../../../constants';
import DeleteModal from '../../../components/DeleteModal';
import { useToast } from '../../../context';
import { ExtractDateFromDateTime } from '../../../helpers';
import AddFilesModal from './AddFilesModal';

const RelatedDocuments = () => {
  const { showToast } = useToast();

  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState({ deleteFile: false, addFile: false });
  const [selectedFileID, setSelectedFileID] = useState(null);

  const rowsPerPage = 9;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredDocuments = documents?.filter(document =>
    document?.DocumentName?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  const currentRows = filteredDocuments?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredDocuments?.length / rowsPerPage) || 0;

  const fetchDocuments = async () => {
    try {
      const response = await apiService.getById(
        'GetAllRelatedAttachmentByCommitteeID',
        localStorage.getItem('selectedCommitteeID'),
      );
      setDocuments((response || []).reverse());
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
          <div className={styles.stats}></div>
        </div>
        <label className={styles.button} onClick={() => setIsModalOpen({ ...isModalOpen, addFile: true })}>
          <FaPlus className={styles.addIcon} />
          <p>اضافة ملف</p>
        </label>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم الملف</th>
              <th>تاريخ الإضافة</th>
              <th>نوع الملف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentRows?.map(document => (
              <tr key={document?.ID}>
                <td style={{ maxWidth: '10rem' }}>{document?.DocumentName}</td>
                <td>{ExtractDateFromDateTime(document?.CreatedAt)}</td>
                <td>{document?.AttachmentArabicName}</td>
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

      <AddFilesModal
        isOpen={isModalOpen.addFile}
        onClose={() => setIsModalOpen({ ...isModalOpen, addFile: false })}
        fetchDocuments={fetchDocuments}
      />

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
