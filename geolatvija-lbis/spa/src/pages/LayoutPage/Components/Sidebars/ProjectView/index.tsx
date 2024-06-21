import React, { useEffect, useState } from 'react';
import { StyledProjectView } from './style';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Card, Label, Tooltip } from 'ui';
import { Spin, message } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useJwt from 'utils/useJwt';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Helmet } from 'react-helmet';
import InVotingState from './components/in-voting';
import NotSupportedState from './components/not-supported';
import BeingImplementedState from './components/being-implemented';
import SubmittedState from './components/submitted';
import { useParticipationBudgetState } from '../../../../../contexts/ParticipationBudgetContext';

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

export const ProjectView = ({ setSubmittedProjectTitle }: { setSubmittedProjectTitle?: Function }) => {
  const intl = useIntl();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVoted, setIsVoted] = useState<boolean | null>(null);
  let [searchParams] = useSearchParams();
  const { isTokenActive } = useJwt();
  const navigate = useNavigate();

  const projectId = searchParams.get('geoProjectId');

  const { data: submittedProject, isLoading: isSubmittedProjectLoading } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/projects/${projectId}`,
    },
  });

  const { budgets } = useParticipationBudgetState();
  const budget = budgets.find((e: any) => e.atvk_id === submittedProject?.atvk_id);

  useEffect(() => {
    if (setSubmittedProjectTitle) {
      setSubmittedProjectTitle(submittedProject?.name);
    }
    setIsVoted(submittedProject?.has_voted);
  }, [submittedProject]);

  const { appendData: appendVote, isLoading: isLoadingVotion } = useQueryApiClient({
    request: {
      url: 'api/v1/tapis/vote-for-project',
      method: 'POST',
    },
    onSuccess() {
      setIsVoted((prev) => !prev);
    },
  });

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success(intl.formatMessage({ id: 'participation_budget.link_copied_to_clipboard' }));
  };

  const handleClickVoteBtn = () => {
    if (!isTokenActive()) {
      setShowAuthModal(true);
      return;
    }
    appendVote({
      vote: {
        project_id: submittedProject.id,
        is_active: !isVoted,
      },
    });
  };

  return (
    <Spin spinning={isSubmittedProjectLoading}>
      {!Array.isArray(submittedProject) && submittedProject.id ? (
        <StyledProjectView>
          {/* TODO: After uploading to server test HELMET*/}
          <Helmet>
            <title>{submittedProject.name}</title>
            <meta property="og:type" content="article" />
            <meta property="og:title" content={submittedProject.name} />
            <meta property="og:description" content={submittedProject.versions[0]?.concept_description} />
            <meta property="og:image" content={submittedProject.versions[0]?.pictures[0]?.blob.url} />
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={submittedProject.name} />
            <meta name="twitter:description" content={submittedProject.versions[0]?.concept_description} />
            <meta name="twitter:image" content={submittedProject.versions[0]?.pictures[0]?.blob.url} />
          </Helmet>
          <div className="title_info">
            <div
              className="info_item green"
              onClick={() => navigate(`/main?municipal-project=open&atvk_id=${submittedProject.atvk_id}`)}
            >
              {budget?.name}
            </div>
            <div className="info_item gray">Zaļā zona</div>
            <div className="info_item gray">Rekreācija un atpūta</div>
          </div>
          <div className="pictures">
            <Swiper
              cssMode={true}
              navigation={true}
              pagination={true}
              loop={true}
              modules={[Navigation, Pagination, Mousewheel]}
              className="project-view_swipper"
            >
              {submittedProject?.versions[0]?.pictures?.map((image: any) => (
                <SwiperSlide>
                  <img src={image.url} alt={image.blob.filename} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="description">
            <Label
              label={intl.formatMessage({ id: 'participation_budget.description' })}
              subTitle={true}
              bold={true}
              className="section_title"
            />
            <p>{submittedProject?.versions[0]?.concept_description}</p>

            <div className="price_side">
              <Label
                subTitle={true}
                regular={true}
                label={intl.formatMessage({ id: 'participation_budget.indicative_costs' })}
              />
              <Label
                subTitle={true}
                bold={true}
                label={`${new Intl.NumberFormat('ru-RU').format(submittedProject?.versions[0]?.indicative_costs)} EUR`}
                className="price"
              />
            </div>
          </div>
          <div className="files">
            <Label
              label={intl.formatMessage({ id: 'participation_budget.files' })}
              subTitle={true}
              bold={true}
              className="section_title"
            />
            <div className="data_list">
              {(submittedProject && !Array.isArray(submittedProject) && !submittedProject.error) && submittedProject.versions[0]?.required_attachments?.map((file: BackFileProp) => {
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
          {submittedProject.state === 'in_voting' && (
            <InVotingState
              isVoted={isVoted}
              isLoadingVotion={isLoadingVotion}
              handleClickVoteBtn={handleClickVoteBtn}
            />
          )}
          {submittedProject.state === 'unsupported' && <NotSupportedState />}
          {submittedProject.state === 'being_implemented' && <BeingImplementedState />}
          {submittedProject.state === 'submitted' && <SubmittedState projectId={submittedProject.id} />}
          <div className="project_view_footer">
            <p>{intl.formatMessage({ id: 'participation_budget.share_the_project' })}:</p>
            <Tooltip placement="topLeft" title={intl.formatMessage({ id: 'participation_budget.share_the_project' })}>
              <i onClick={handleShareClick} className="fa-thin fa-share"></i>
            </Tooltip>
          </div>

          <UnauthenticatedModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
        </StyledProjectView>
      ) : null}
    </Spin>
  );
};
