import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import apiService from '../../../services/axiosApi.service';
import styles from './SharedAdminTable.module.scss';

const SharedAdminTable = ({ columns, apiRoutes, title }) => {
  const [newRow, setNewRow] = useState({});
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data?.length / rowsPerPage);

  const handlePaginationChange = newPage => {
    setCurrentPage(newPage);
  };

  const fetchData = async () => {
    const response = await apiService.getAll(apiRoutes?.getAll);
    setData(response);
  };

  useEffect(() => {
    fetchData();
  }, [apiRoutes]);

  const handleInputChange = (key, value) => {
    setNewRow({ ...newRow, [key]: value });
  };

  const handleEditInputChange = (key, value) => {
    setEditRowData({ ...editRowData, [key]: value });
  };

  const handleSubmit = async () => {
    if (Object.values(newRow).some(value => value.trim() === '')) {
      return;
    }
    await apiService.create(apiRoutes.add, newRow);
    fetchData();
    setNewRow({});
  };

  const handleEdit = row => {
    setEditRowId(row.ID);
    setEditRowData(row);
  };

  const handleUpdate = async () => {
    await apiService.update(apiRoutes.update, editRowData);
    fetchData();
    setEditRowId(null);
    setEditRowData({});
  };

  const handleDelete = async id => {
    if (window.confirm('هل انت متأكد من حذف هذا العنصر؟')) {
      await apiService.delete(apiRoutes.delete, id);
      fetchData();
    }
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditRowData({});
  };

  return (
    <div className={styles.tableContainer}>
      <h5 className={`${styles.sectionHeaderTitle}`}>{title}</h5>
      <table>
        <thead>
          <tr>
            <th>الإجراءات</th>
            {columns?.map(col => (
              <th key={col.key}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            {columns?.map(col => (
              <td key={col.key}>
                <input
                  type={col.type}
                  placeholder={col.placeholder}
                  value={newRow[col.key] || ''}
                  onChange={e => handleInputChange(col.key, e.target.value)}
                />
              </td>
            ))}
          </tr>
          {currentRows?.map(row => (
            <tr key={row.ID}>
              <td>
                {editRowId === row.ID ? (
                  <div className={styles.adminActionsContainer}>
                    <FaCheck className={styles.adminCheckButton} onClick={handleUpdate} />
                    <FaTimes className={styles.adminCancelButton} onClick={handleCancelEdit} />
                  </div>
                ) : (
                  <div className={styles.adminActionsContainer}>
                    <FaEdit className={styles.adminEditButton} onClick={() => handleEdit(row)} />
                    <FaTrash className={styles.adminDeleteButton} onClick={() => handleDelete(row.ID)} />
                  </div>
                )}
              </td>
              {columns?.map(col => (
                <td key={col.key}>
                  {editRowId === row.ID ? (
                    <input
                      type={col.type}
                      value={editRowData[col.key] || ''}
                      onChange={e => handleEditInputChange(col.key, e.target.value)}
                    />
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={columns?.length + 1}>
              <button className={styles.addButton} onClick={handleSubmit}>
                إضافة
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.paginationContainer}>
        {[...Array(totalPages || 0)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePaginationChange(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ''}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SharedAdminTable;
