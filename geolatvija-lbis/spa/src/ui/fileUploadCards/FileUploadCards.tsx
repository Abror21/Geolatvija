import React, { MouseEventHandler } from 'react';
import { Card } from 'ui';
import { StyledFileUploadCard } from './style';

export const FileUploadCards = ({ fileList, handleRemove }: { fileList: any[]; handleRemove: MouseEventHandler }) => {  
  return (
    <StyledFileUploadCard>
      {fileList.length > 0 ? (
        <div className="uploaded_files_container">
          {fileList.map(file => {
            if(file._destroy) return;
            return(
              <Card key={file.name} className="uploaded_file">
                <p>
                  {file.blob ? file.blob.filename : file.filename}
                  <span>
                    {((file.blob ? file.blob.byte_size : file.data.split(',')[1].length) / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </p>
                <i className="fa-solid fa-xmark remove_btn" onClick={() => handleRemove(file)}></i>
              </Card>
            )
          })}
        </div>
      ) : null}
    </StyledFileUploadCard>
  );
};
