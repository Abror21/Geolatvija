import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { useIntl } from 'react-intl';
import { StyledImageUploader } from './style';
import { Tooltip } from '../tooltip';
import ImgCrop from 'antd-img-crop';

const { Dragger } = Upload;

interface Props {
  imageList: any[];
  setImageList: React.Dispatch<React.SetStateAction<any[]>>;
  tooltipLabel?: string;
  aspect?: number;
}

export const ImageUploader = ({ imageList, setImageList, tooltipLabel, aspect = 4 / 3 }: Props) => {
  const intl = useIntl();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  const handleRemove = (file: any) => {
    if(file.blob){
        setImageList((prev: {[key: string]: any}[]) => prev.map(img => {
            if(img.id === file.id){return {...img, _destroy: true}}
            else{return img}
          }));
    }else{
      setImageList([...imageList.filter(img => img.id != file.id)]);
    }
  };

  const handleChange = async (file: any) => {
    const { type, name } = file;
    const imageExtension = name.substring(name.lastIndexOf('.') + 1).toLowerCase();

    if (imageExtension !== 'png' && imageExtension !== 'jpg' && imageExtension !== 'jpeg') {
      message.error(intl.formatMessage({ id: 'validation.image_png_jgp_valid' }));
      return;
    }

    if (!type.match(/image\/(jpeg|jpg|png)/)) {
      message.error(intl.formatMessage({ id: 'validation.image_png_jgp_valid' }));
      return;
    }

    const isImageAvailable = imageList.find((image: any) => image.filename === file?.name);
    if (isImageAvailable) {
      message.warning(intl.formatMessage({ id: 'submit_project.such_image_uploaded' }));
      return;
    }

    const res = await getBase64(file);
    setImageList([...imageList, { data: res, filename: file?.name, id: `check-id${Date.now()}` }]);
  };

  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setIsGrabbing(true);
  };

  const handleDragOver = (index: number) => {
    const draggedOverItem = imageList[index];

    if (draggedOverItem === imageList[draggedIndex!]) {
      return;
    }

    const items = [...imageList];
    const draggedItem = items[draggedIndex!];
    items.splice(draggedIndex!, 1);
    items.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setImageList(items);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsGrabbing(false);
  };

  return (
    <StyledImageUploader>
      <label>
        <div className="form_label">
          <span className="label_text">{intl.formatMessage({ id: 'participation_budget.pictures' })}</span>
          {tooltipLabel && (
            <Tooltip placement="topLeft" title={tooltipLabel}>
              <i className="far fa-info-circle"></i>
            </Tooltip>
          )}
        </div>
      </label>
      <ImgCrop aspect={aspect} onModalOk={handleChange}>
        <Dragger
          fileList={[]}
          onRemove={handleRemove}
          multiple={false}
          accept="image/*"
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
        >
          <p
            className="ant-upload-text"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({ id: 'participation_budget.drag_or_select_image' }),
            }}
          ></p>
          <p className="ant-upload-hint">
            {intl.formatMessage({ id: 'general.format' }, { format: 'PNG, JPG, JPEG' })}
          </p>
        </Dragger>
      </ImgCrop>
      {imageList.length ? (
        <div className="image_list">
          {imageList.map((image, index) => (
            <div
              key={image.id}
              className={`image_item ${isGrabbing && index === draggedIndex ? 'grabbing' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => {
                e.preventDefault();
                handleDragOver(index);
              }}
              onDragEnd={handleDragEnd}
            >
              <img src={image.data} alt={image.filename} />
              <div className="index">{index + 1}</div>
              <div className="delete_icon" onClick={() => handleRemove(image)}>
                <i className="fa-solid fa-xmark remove_btn"></i>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </StyledImageUploader>
  );
};
