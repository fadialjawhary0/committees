import React from 'react';
import agreements from '../../../assets/agreements.png';

const Agreements = () => {
  return (
    <div className='Agreements' style={{ width: '100%' }}>
      <div className='Agreements__header'>
        <h1>المهام</h1>
        <p style={{ fontSize: '1.4rem', padding: '2rem 0' }}>
          هذه الصفحة تحتوي على المهام الموكلة إليك. يمكنك من خلالها متابعة المهام الموكلة إليك والتأكد من إنجازها.
        </p>
      </div>
      <div className='Agreements__Agreements'>
        <img src={agreements} alt='assigned Agreements' style={{ width: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

export default Agreements;
