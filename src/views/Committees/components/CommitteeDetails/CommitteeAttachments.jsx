import React, { useState } from 'react';
import { FaDownload, FaFileAlt, FaPlus } from 'react-icons/fa';

import { TruncateFileName } from '../../../../helpers';
import { useFileUpload } from '../../../../hooks/useFileUpload';

import styles from '../CommitteeDetails.module.scss';
import { MIME_TYPE } from '../../../../constants';

const CommitteeAttachments = ({ attachments }) => {
  const { handleFileChange } = useFileUpload();

  const [showMoreFiles, setShowMoreFiles] = useState(false);

  const MAX_VISIBLE_ITEMS = 3;

  return (
    <div className={styles.dashboardWidget}>
      <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
        <h5>المرفقات</h5>
        <label className={styles.button}>
          <FaPlus className={styles.addIcon} />
          <p>رفع</p>
          <input
            type='file'
            multiple
            accept='.pdf,.jpg,.jpeg,.png,.docx,.txt'
            style={{ display: 'none' }}
            onChange={e => handleFileChange(e, 'AddRelatedAttachment', +localStorage.getItem('selectedCommitteeID'), null)}
          />
        </label>
      </div>

      <div className={styles.widgetContent}>
        <FaFileAlt className={styles.widgetIcon} />
        <span>{attachments?.length || 0}</span>
      </div>

      <div className={styles.widgetDetails}>
        {attachments?.slice(0, showMoreFiles ? attachments?.length : MAX_VISIBLE_ITEMS)?.map(file => (
          <div key={file.ID} className={`${styles.widgetItem} ${styles.fileItem}`}>
            <span className={styles.fileName}>{TruncateFileName(file?.DocumentName)}</span>
            <a
              href={`data:${MIME_TYPE};base64,${file?.DocumentContent}`}
              download={file?.DocumentName}
              className={styles.downloadButton}>
              <FaDownload />
            </a>
          </div>
        ))}

        {attachments?.length > MAX_VISIBLE_ITEMS && (
          <button onClick={() => setShowMoreFiles(!showMoreFiles)} className={styles.viewMoreButton}>
            {showMoreFiles ? 'عرض أقل' : 'عرض المزيد'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommitteeAttachments;
