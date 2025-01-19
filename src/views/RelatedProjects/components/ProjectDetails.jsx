import React, { useState } from 'react';
import { FaCalendarAlt, FaUser, FaTasks, FaMoneyBillAlt, FaSearch } from 'react-icons/fa';
import ReactEcharts from 'echarts-for-react';
import styles from './ProjectDetails.module.scss';

const teamMembers = [
  'فاطمة حسن',
  'محمد صالح',
  'سارة أحمد',
  'يوسف القاسم',
  'أحمد علي',
  'نورا محمود',
  'خالد يوسف',
  'رنا زيد',
  'عمر حسين',
  'ليلى ناصر',
  'عمر حسين',
  'عمر حسين',
  'عمر حسين',
  'عمر حسين',
  'عمر حسين',
  'عمر حسين',
];

const projectData = {
  id: 1,
  name: 'المشروع الأول',
  manager: 'أحمد علي',
  status: 'نشط',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  description: 'هذا المشروع يهدف إلى تحسين البنية التحتية وزيادة الكفاءة.',
  budget: 500000,
  actualCost: 420000,
  teamMembers: teamMembers,
  milestones: [
    { name: 'بدء المشروع', date: '2024-01-05', status: 'مكتمل' },
    { name: 'التصميم', date: '2024-02-15', status: 'قيد التنفيذ' },
    { name: 'التنفيذ', date: '2024-05-01', status: 'مخطط' },
  ],
  tasksDistribution: {
    completed: 40,
    inProgress: 35,
    pending: 25,
  },
};

const ProjectDetails = () => {
  const {
    name,
    manager,
    status,
    startDate,
    endDate,
    description,
    budget,
    actualCost,
    teamMembers,
    milestones,
    tasksDistribution,
  } = projectData;

  const taskChartData = {
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: 'توزيع المهام',
        type: 'pie',
        radius: '50%',
        data: [
          { value: tasksDistribution.completed, name: 'مكتمل' },
          { value: tasksDistribution.inProgress, name: 'قيد التنفيذ' },
          { value: tasksDistribution.pending, name: 'معلق' },
        ],
      },
    ],
  };

  const budgetChartData = {
    xAxis: {
      type: 'category',
      data: ['الميزانية', 'التكلفة الفعلية'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [budget, actualCost],
        type: 'bar',
        itemStyle: {
          color: '#007ff5',
        },
      },
    ],
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  const filteredMembers = teamMembers.filter(member => member.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage) || 0;

  const handleSearch = e => setSearchTerm(e.target.value);

  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className={styles.projectDetailsPage}>
      <div className={styles.header}>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <FaUser /> <span>المدير: {manager}</span>
        </div>
        <div className={styles.infoItem}>
          <FaCalendarAlt /> <span>تاريخ البداية: {startDate}</span>
        </div>
        <div className={styles.infoItem}>
          <FaCalendarAlt /> <span>تاريخ النهاية: {endDate}</span>
        </div>
        <div className={styles.infoItem}>
          <FaTasks /> <span>الحالة: {status}</span>
        </div>
        <div className={styles.infoItem}>
          <FaMoneyBillAlt /> <span>الميزانية: {budget.toLocaleString()} ريال</span>
        </div>
        <div className={styles.infoItem}>
          <FaMoneyBillAlt /> <span>التكلفة الفعلية: {actualCost.toLocaleString()} ريال</span>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chart}>
          <h5>توزيع المهام</h5>
          <ReactEcharts option={taskChartData} />
        </div>
        <div className={styles.chart}>
          <h5>الميزانية مقابل التكلفة</h5>
          <ReactEcharts option={budgetChartData} />
        </div>
      </div>

      <div className={styles.team}>
        <div className={styles.teamControls}>
          <h5>أعضاء الفريق</h5>
          <div className={styles.search}>
            <input type='text' placeholder='ابحث عن عضو' value={searchTerm} onChange={handleSearch} />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>
        <table className={styles.teamTable}>
          <thead>
            <tr>
              <th>الاسم</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers?.map((member, index) => (
              <tr key={index}>
                <td>{member}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
              onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.milestones}>
        <h5>المعالم الرئيسية</h5>
        <table>
          <thead>
            <tr>
              <th>اسم المعلم</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {milestones?.map((milestone, index) => (
              <tr key={index}>
                <td>{milestone.name}</td>
                <td>{milestone.date}</td>
                <td>{milestone.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetails;
