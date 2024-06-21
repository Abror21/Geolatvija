import React, { useEffect, useState } from 'react';
import { Button, Card, FileUploadCards, Upload } from 'ui';
import { useIntl } from 'react-intl';
import { message } from 'antd';
import FileUploadPart from './components/FileUploadPart';
import { getBase64 } from 'utils/globalFunctions';
import { useSearchParams } from 'react-router-dom';

interface FileProp {
  id: number;
  name: string;
  size: number;
  uid: string;
}

const UploadFiles = ({ files, setFiles }: { files: any[] | []; setFiles: Function }) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const isMlNull = searchParams.get('ml') == null;
  const onMunicipalityLand = searchParams.get('ml') === 't';
  const isThereProjectId = searchParams.get('project-id') && !!searchParams.get('project-id');
  const projectId = isThereProjectId ? searchParams.get('project-id') : undefined;
  const [confirmationFiles, setConfirmationFiles] = useState<any[]>([]);
  const [estimateFiles, setEstimateFiles] = useState<any[]>([]);
  const [sketchFiles, setSketchFiles] = useState<any[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<any[]>([]);
  const isMunicipalLand = files.some((file: any) => file.section_name == 'Aptiprinajums');

  useEffect(() => {
    setEstimateFiles([...files.filter((file) => file.section_name === 'Tāme')]);
    setSketchFiles([...files.filter((file) => file.section_name === 'Skice')]);
    setAdditionalFiles([...files.filter((file) => file.section_name === 'Papildus')]);
    setConfirmationFiles([...files.filter((file) => file.section_name === 'Aptiprinajums')]);
  }, [files]);

  const addFile = async (fileList: FileProp[], newFile: any, section_name: string) => {
    const isFileAvailable = fileList.find((file: any) => file.name === newFile.file.name);
    if (isFileAvailable) {
      message.warning(intl.formatMessage({ id: 'submit_project.such_file_uploaded' }));
      return;
    }
    const id = Date.now();
    const res = await getBase64(newFile.file.originFileObj as any);
    setFiles([...files, { data: res, filename: newFile.file?.name, id, section_name }]);
  };

  const removeFile = (removingFile: any) => {
    if(removingFile.blob){
      setFiles((prev: {[key: string]: any}[]) => prev.map(file => {
        if(file.id === removingFile.id){return {...file, _destroy: true}}
        else{return file}
      }));
    }else{
      setFiles([...files.filter((file) => file.id != removingFile.id)]);
    }
  };

  return (
    <>
      <ol>
        {
          ((projectId && isMunicipalLand) || (!isMlNull && !onMunicipalityLand)) &&
          <li>
            <FileUploadPart
              title={intl.formatMessage({ id: `participation_budget.coniform_landowner_project_his_hand` })}
              onChange={(info: any) => addFile(confirmationFiles, info, 'Aptiprinajums')}
            />
            <FileUploadCards
              fileList={confirmationFiles}
              handleRemove={(file :any)=> removeFile(file)}
            />
          </li>
        }
        <li>
          <FileUploadPart
            title={intl.formatMessage({ id: `participation_budget.estimate` })}
            onChange={(info: any) => addFile(estimateFiles, info, 'Tāme')}
          />
          <FileUploadCards
            fileList={estimateFiles}
            handleRemove={(file :any)=> removeFile(file)}
          />
        </li>
        <li>
          <FileUploadPart
            title={intl.formatMessage({ id: `participation_budget.sketches` })}
            onChange={(info: any) => addFile(sketchFiles, info, 'Skice')}
          />
          <FileUploadCards
            fileList={sketchFiles}
            handleRemove={(file :any)=> removeFile(file)}
          />
        </li>
      </ol>
      <Upload
        geoClassifer={true}
        fileList={[]}
        showUploadList={false}
        onChange={(info) => addFile(additionalFiles, info, 'Papildus')}
      >
        <Button htmlType="button" label={intl.formatMessage({ id: 'participation_budget.upload_additional_file' })} />
      </Upload>
      {additionalFiles.length > 0
        ? additionalFiles.map(file => {
            if(file._destroy) return;
            return(
              <Card key={file.name} className="uploaded_file">
                <p>
                  {file.blob ? file.blob.filename : file.filename}
                  <span>
                    {((file.blob ? file.blob.byte_size : file.data.split(',')[1].length) / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </p>
                <i
                  className="fa-solid fa-xmark remove_btn"
                  onClick={() => removeFile(file)}
                ></i>
              </Card>
            )
          })
        : null}
    </>
  );
};

export default UploadFiles;
