import React from 'react';
import documents from '../../../assets/assignedDocuments.png';

const Documents = () => {
  return (
    <div className='Documents' style={{ width: '100%' }}>
      <div className='Documents__header'>
        <h1>المستندات</h1>
      </div>
      <div className='Documents__Documents'>
        <img src={documents} alt='assigned Documents' style={{ width: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

export default Documents;
