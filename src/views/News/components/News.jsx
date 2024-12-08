import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import styles from './News.module.scss';
import { useNavigate } from 'react-router-dom';

const initialNewsData = [
  {
    id: 1,
    title: 'اجتماع الجمعية العمومية',
    content: 'سيعقد اجتماع الجمعية العمومية يوم الثلاثاء المقبل.',
    date: '2024-09-01',
    link: 'https://example.com/news/1',
    sentBy: 'Ahmed Ali',
  },
  {
    id: 2,
    title: 'إطلاق منصة جديدة',
    content: 'يسرنا أن نعلن عن إطلاق منصة جديدة لإدارة المشاريع.',
    date: '2024-09-05',
    link: 'https://example.com/news/2',
    sentBy: 'Fatima Hassan',
  },
  {
    id: 3,
    title: 'ورشة عمل تدريبية',
    content: 'سيتم تنظيم ورشة عمل تدريبية في نهاية الشهر الحالي.',
    date: '2024-09-10',
    link: 'https://example.com/news/3',
    sentBy: 'Sara Ahmad',
  },
  {
    id: 4,
    title: 'إعلان جديد للوظائف',
    content: 'تم فتح باب التقديم لوظائف جديدة في مختلف الأقسام.',
    date: '2024-09-12',
    link: 'https://example.com/news/4',
    sentBy: 'Mohammed Saleh',
  },
  {
    id: 5,
    title: 'إطلاق برنامج تدريبي',
    content: 'سنقوم بإطلاق برنامج تدريبي شامل للموظفين الجدد.',
    date: '2024-09-15',
    link: 'https://example.com/news/5',
    sentBy: 'Khaled Youssef',
  },
  {
    id: 6,
    title: 'إطلاق مشروع بيئي جديد',
    content: 'سيتم إطلاق مشروع بيئي جديد لتعزيز الاستدامة.',
    date: '2024-09-18',
    link: 'https://example.com/news/6',
    sentBy: 'Ahmed Ali',
  },
  {
    id: 7,
    title: 'إصدار تقرير الأداء السنوي',
    content: 'تم إصدار تقرير الأداء السنوي ويمكن الاطلاع عليه من خلال الرابط.',
    date: '2024-09-20',
    link: 'https://example.com/news/7',
    sentBy: 'Fatima Hassan',
  },
  {
    id: 8,
    title: 'إطلاق منصة التواصل الداخلي',
    content: 'يسرنا أن نعلن عن إطلاق منصة جديدة لتسهيل التواصل الداخلي.',
    date: '2024-09-22',
    link: 'https://example.com/news/8',
    sentBy: 'Sara Ahmad',
  },
  {
    id: 9,
    title: 'افتتاح فرع جديد',
    content: 'نعلن عن افتتاح فرع جديد في المدينة الصناعية.',
    date: '2024-09-25',
    link: 'https://example.com/news/9',
    sentBy: 'Mohammed Saleh',
  },
  {
    id: 10,
    title: 'إطلاق حملة ترويجية جديدة',
    content: 'تم إطلاق حملة ترويجية جديدة للمنتجات الصيفية.',
    date: '2024-09-28',
    link: 'https://example.com/news/10',
    sentBy: 'Khaled Youssef',
  },
];

const News = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);

  useEffect(() => {
    setNews(initialNewsData);
  }, []);

  const handleAddNews = () => {
    navigate('/news/create-new');
  };

  return (
    <div className={styles.newsPage}>
      <div className={styles.newsFilters}>
        <div className={styles.searchDropdownFilters}>
          <div className={styles.newsFiltersSearch}>
            <input className={styles.newsFiltersSearchField} placeholder='ابحث عن خبر' value='' dir='rtl' />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>
        <div className={styles.actionButton} onClick={handleAddNews}>
          <FaPlus />
          <span>إنشاء خبر جديد</span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>الرابط</th>
              <th>تاريخ الخبر</th>
              <th>تم الارسال بواسطة</th>
              <th>نص الخبر</th>
              <th>الخبر</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id}>
                <td>
                  <a className={styles.link} href={item.link} target='_blank' rel='noopener noreferrer'>
                    {item.link}
                  </a>
                </td>
                <td>{item.date}</td>
                <td>{item.sentBy}</td>
                <td>{item.content}</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default News;
