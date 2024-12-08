import React, { useState } from 'react';
import { FaTrash, FaPen } from 'react-icons/fa';
import styles from './RelatedProjects.module.scss';
import { useNavigate } from 'react-router-dom';

const initialProjectsData = [
  {
    id: 1,
    name: 'المشروع الأول',
    manager: 'أحمد علي',
    status: 'نشط',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
  },
  {
    id: 2,
    name: 'المشروع الثاني',
    manager: 'فاطمة حسن',
    status: 'مكتمل',
    startDate: '2023-03-01',
    endDate: '2023-09-15',
  },
  {
    id: 3,
    name: 'المشروع الثالث',
    manager: 'محمد صالح',
    status: 'متأخر',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
  },
];

const RelatedProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(initialProjectsData);

  const handleDelete = id => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleEdit = id => {};

  const handleClick = id => {
    navigate(`/related-projects/${id}`);
  };

  return (
    <div className={styles.relatedProjectsPage}>
      <div className={styles.details}>
        <p>عدد المشاريع: {projects.length}</p>
        <p>المشاريع المكتملة: {projects.filter(project => project.status === 'مكتمل').length}</p>
        <p>المشاريع النشطة: {projects.filter(project => project.status === 'نشط').length}</p>
        <p>المشاريع المتأخرة: {projects.filter(project => project.status === 'متأخر').length}</p>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم المشروع</th>
              <th>المدير</th>
              <th>الحالة</th>
              <th>تاريخ البداية</th>
              <th>تاريخ النهاية</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} className={styles.trClickable} onClick={() => handleClick(project.id)}>
                <td>{project.name}</td>
                <td>{project.manager}</td>
                <td>{project.status}</td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>
                  <button className={styles.tableEditButton} onClick={() => handleEdit(project.id)}>
                    <FaPen />
                  </button>
                  <button className={styles.tableDeleteButton} onClick={() => handleDelete(project.id)}>
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

export default RelatedProjects;
