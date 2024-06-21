import React, { useEffect } from 'react';
import { StyledIdeaView } from './style';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Card, Divider, Label } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import BeingImplementedState from './components/being-implemented';
import { ideasData } from '../MyParticipationTabs/components/temporary-data';
import { useSearchParams } from 'react-router-dom';

interface BackFileProp {
  id: number;
  position: number;
  section_name: string;
  url: string;
  blob: {
    byte_size: number;
    checksum: string;
    content_type: string;
    filename: string;
    id: number;
  };
}

export const IdeaView = ({ setSubmittedIdeaTitle }: { setSubmittedIdeaTitle?: Function }) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();

  const ideaId = searchParams.get('geoIdeaId');
  const ideaProject = ideasData.find((idea: any) => idea.id == ideaId);
  

  // TODO: for temporary request for files
  const { data: submittedIdea } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/projects/${81}`,
    },
  });

  useEffect(() => {
    if (setSubmittedIdeaTitle) {
      setSubmittedIdeaTitle('Something temporary');
    }
  }, []);

  return (
    <StyledIdeaView>
      <Divider />
      <div className="idea-pictures">
        <Swiper
          cssMode={true}
          navigation={true}
          pagination={true}
          loop={true}
          modules={[Navigation, Pagination, Mousewheel]}
          className="project-view_swipper"
        >
          {ideaProject.pictures?.map((image: any) => (
            <SwiperSlide>
              <img src={image} alt={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="idea-description">
        <Label
          label={intl.formatMessage({ id: 'participation_budget.description' })}
          subTitle={true}
          bold={true}
          className="section_title"
        />
          {/* TODO: as long as real data is not ready */}
          <p dangerouslySetInnerHTML={{ __html: 
            `
              Hardcode hardcode hardcode hardcode <a href="https://www.csolutions.lv/en">hardcode</a> hardcode hardcode hardcode hardcode hardcode hardcode hardcode
              hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode
              hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode
              hardcode
              <br />
              <br />
              hardcode hardcode hardcode hardcode hardcode hardcode hardcode <a href="https://www.csolutions.lv/en">hardcode</a> hardcode hardcode hardcode hardcode
              hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode
              hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode hardcode
            `
          }} />
      </div>
      <Divider />
      <div className="idea-files">
        <Label
          label={intl.formatMessage({ id: 'participation_budget.files' })}
          subTitle={true}
          bold={true}
          className="section_title"
        />
        <div className="data_list">
          {/* TODO: as long as real data is not ready, files are from other source */}
          {(submittedIdea && !Array.isArray(submittedIdea) && !(submittedIdea.error || submittedIdea.error_code)) &&
            submittedIdea.versions[0]?.required_attachments?.map((file: BackFileProp) => {
              const fileSize = file.blob.byte_size / (1024 * 1024);
              return (
                <Card className="file">
                  <a href={file.url} download>
                    <Label label={file.blob.filename} subTitle={true} extraBold={true} className="file_name" />
                  </a>
                  <Label label={fileSize.toFixed(2) + ' MB'} subTitle={true} regular={true} className="file_size" />
                </Card>
              );
            })}
        </div>
      </div>
      <Divider />
      <div className="idea-status">
        <Label
          label={intl.formatMessage({ id: 'user_management.status' })+':'}
          subTitle={true}
          bold={true}
          className="section_title"
        />
          {
          // TODO: as long as real data is not ready, hard code is being used
          (ideaId == '1' || ideaId == '2') && <span className='status'>{intl.formatMessage({ id: 'participation_budget.submitted' })}</span>
          }
          {
          // TODO: as long as real data is not ready, hard code is being used
            (ideaId == '3' || ideaId == '4') && <div>
              <span className='status'>{intl.formatMessage({ id: 'participation_budget.answered' })}</span>
              <BeingImplementedState />
            </div>
          }
          {
          // TODO: as long as real data is not ready, hard code is being used
            (ideaId == '5' || ideaId == '6') && <div>
              <span className='status'>{intl.formatMessage({ id: 'participation_budget.realized' })}</span>
              <BeingImplementedState />
            </div>
          }
      </div>
    </StyledIdeaView>
  );
};
