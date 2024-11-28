import React, { useState } from 'react';
import { FaSave, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CreateNewStyles.scss';

const peopleOptions = [
  { id: 1, name: 'Ahmed Ali' },
  { id: 2, name: 'Fatima Hassan' },
  { id: 3, name: 'Sara Ahmad' },
  { id: 4, name: 'Mohammed Saleh' },
  { id: 5, name: 'Khaled Youssef' },
];

const CreateNew = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [recipients, setRecipients] = useState([{ person: '', role: '' }]);

  const handleSave = () => {
    console.log({
      title,
      content,
      date,
      link,
      recipients,
      sentBy: 'Ahmed Ali',
    });
    navigate('/news');
  };

  const handleRecipientChange = (index, key, value) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index][key] = value;
    setRecipients(updatedRecipients);
  };

  const addRecipient = () => {
    setRecipients([...recipients, { person: '' }]);
  };

  const removeRecipient = index => {
    const updatedRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(updatedRecipients);
  };

  return (
    <div className='create-news-page'>
      <div className='page-header'>
        <FaArrowLeft className='back-icon' onClick={() => navigate('/news')} />
        <h1>إنشاء خبر جديد</h1>
      </div>
      <form className='create-news-form'>
        <div className='form-group'>
          <label>الخبر</label>
          <input type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='أدخل عنوان الخبر' required />
        </div>
        <div className='form-group'>
          <label>نص الخبر</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder='أدخل نص الخبر' required />
        </div>
        <div className='form-group'>
          <label>تاريخ الخبر</label>
          <input type='date' value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className='form-group'>
          <label>الرابط</label>
          <input type='url' value={link} onChange={e => setLink(e.target.value)} placeholder='أدخل الرابط' required />
        </div>

        <div className='form-group invite-people-group'>
          <label>إرسال إلى</label>
          {recipients.map((recipient, index) => (
            <div key={index} className='invite-pair'>
              <select value={recipient.person} onChange={e => handleRecipientChange(index, 'person', e.target.value)} required>
                <option value=''>اختر شخص</option>
                {peopleOptions.map(option => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button type='button' onClick={() => removeRecipient(index)} className='remove-button'>
                إزالة
              </button>
            </div>
          ))}
          <button type='button' onClick={addRecipient} className='add-recipient-button'>
            <FaPlus /> إضافة مستلم آخر
          </button>
        </div>

        <button type='button' className='save-button' onClick={handleSave}>
          <FaSave /> حفظ
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
