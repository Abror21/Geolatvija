import React, { useRef, useEffect } from 'react';
import { StyledProjectModal } from './style';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Typography } from 'antd';
import { Button } from 'ui';
import { Link, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useParticipationBudgetState } from '../../../../../contexts/ParticipationBudgetContext';
import { getMapModalPosition } from 'utils/getMapModalPosition';

const { Title } = Typography;

interface ProjectModalType {
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  isOpenMunicipalityModal?: boolean;
  municipality?: string | null;
  setIsOpenMunicipalityModal: Function;
  coordinatesWindowPosition: any;
}

const MunicipalityModal = ({
  municipality,
  isOpenMunicipalityModal,
  setIsOpenMunicipalityModal,
  coordinatesWindowPosition,
}: ProjectModalType) => {
  const intl = useIntl();
  const modalRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { budgets } = useParticipationBudgetState();
  const budget = budgets.find((e: any) => e.atvk_id === municipality);

  useEffect(() => {
    const checkModal = (event: Event): void => {
      if (
        (event.target as Node).nodeName !== 'CANVAS' &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenMunicipalityModal(false);
      }
    };
    window.addEventListener('click', checkModal);

    return () => {
      window.removeEventListener('click', checkModal);
    };
  }, []);

  const handleOpenMunicipalProjects = () => {
    setIsOpenMunicipalityModal(false);
    navigate(`/main?municipal-project=open&atvk_id=${municipality}`);
  };

  //todo get from municipality data
  const pictures: any = [];
  const modalRefWidth = modalRef.current?.clientWidth ? modalRef.current.clientWidth : 0;
  const modalRefHeight = modalRef.current?.clientHeight ? modalRef.current.clientHeight : 0;

  const { left, top } = coordinatesWindowPosition ? getMapModalPosition(
    coordinatesWindowPosition.x, coordinatesWindowPosition.y, coordinatesWindowPosition.mapWidth, coordinatesWindowPosition.mapHeight, modalRefWidth, modalRefHeight
  ) : {left: 0, top: 0};

  return (
    <StyledProjectModal>
      <div
        ref={modalRef}
        className={`modal ${isOpenMunicipalityModal ? 'open' : ''}`}
        style={{
          top: `${top}px`,
          left: `${left}px`,
        }}
      >
        <Swiper
          cssMode={true}
          navigation={true}
          pagination={true}
          mousewheel={true}
          loop={true}
          modules={[Navigation, Pagination, Mousewheel]}
          className="project-item__swiper"
        >
          {pictures?.map((image: string, idx: number) => (
            <SwiperSlide key={idx}>
              <img src={image} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="project-item__content-wrapper">
          <Title className="title_project_modal" level={5}>
            {budget?.name}
          </Title>
          <Button
            label={intl.formatMessage({ id: 'project_modal_button' })}
            onClick={() => handleOpenMunicipalProjects()}
          />
          <Link to="htpps://www.marupe.lv">
            <i className="fa-regular fa-globe"></i> <span>htpps://www.marupe.lv</span>
          </Link>
        </div>
      </div>
    </StyledProjectModal>
  );
};

export default MunicipalityModal;
