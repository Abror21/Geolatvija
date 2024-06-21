import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Button, Icon, Label, Popover, Spinner, Tag, Tree, Tooltip } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';
import {
  CustomStyledChildrenLinkWrapper,
  CustomStyledLink,
  DecisionAndMaterialListWrapper,
  ExplanationWrapper,
  PopoverWrapper,
  Section,
  StyledActions,
  StyledCard,
  StyledFileVersionWrapper,
  StyledHref,
  StyledPopover,
  StyledTreeItemsWrapper,
  TooltipWrapper,
  TreeWrapper,
} from './styles';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { listStatuses } from '../../../../config/config';
import type { TreeProps } from 'antd/es/tree';
import { ProposalSubmitContext } from '../../../../contexts/ProposalSubmitContext';
import PlannedDocumentLayerSettings from '../../../../components/Map/LayerSettings/PlannedDocumentLayerSettings';
import { useOpenedTypeDispatch } from '../../../../contexts/OpenedTypeContext';
import LayerGroup from 'ol/layer/Group';
import { highlightFeaturesGeoJson } from 'utils/mapUtils';
import MapContext from 'contexts/MapContext';
import { useNavigate } from 'react-router-dom';
import { usePlannedDocumentProposal } from '../../../../contexts/PlannedDocumentProposalContext';
import UnauthenticatedModal from '../../../../components/Modals/UnauthenticatedModal';
import useJwt from '../../../../utils/useJwt';
import { useUserState } from '../../../../contexts/UserContext';
import { convertBytesToMegabytes } from '../../../../utils/convertBytesToMegabytes';
import { DirectoryTree } from '../../../../ui/directoryTree';
import toastMessage from '../../../../utils/toastMessage';

interface DetailedPlannedDocumentProps {
  id: number;
  isHovered?: boolean;
  documentTitle: (documentTitle: string) => void;
  documentMunicipality: (documentMunicipality: string) => void;
  isZoomToPlannedDocument?: boolean;
}

interface DecisionsReportsType {
  SectionName: string;
  DecisionAttachements: {
    TapisId: number;
    FileUrl: string;
    OriginalDocumentId: number;
    FileAcceptance: string;
    FileSize: number;
    FileName: string;
    OriginalDocumentVersion: number;
    DecisionAdditionalAttachements: {
      FileUrl: string;
      OriginalDocumentId: number;
      FileAcceptance: string;
      FileSize: number;
      FileName: string;
      OriginalDocumentVersion: number;
    }[];
  };
}

interface SectionAttachmentsType {
  FileContentType: string;
  FileExtension: string;
  FileName: string;
  FileNumber: number;
  FileSize: number;
  FileUrl: string;
  OriginalDocumentId: number;
  TapisId: number;
}

interface AttachmentListType {
  [key: string]: {
    SectionName: string;
    SectionPosition: number;
    SectionAttachments: SectionAttachmentsType[];
  };
}

export const DetailedPlannedDocument = ({
  id,
  isHovered,
  documentTitle,
  documentMunicipality,
  isZoomToPlannedDocument,
}: DetailedPlannedDocumentProps) => {
  const [isOpenDecision, setIsOpenDecision] = useState<boolean>(false);
  const [decisionVisibility, setDecisionsVisibility] = useState<number>(4);
  const [attachmentList, setAttachmentList] = useState<TreeProps['treeData']>();
  const [publicDiscussionList, setPublicDiscussionsList] = useState<TreeProps['treeData']>();
  const [versionList, setVersionList] = useState<any>([]);
  const [showUnauthenticated, setShowUnauthenticated] = useState<boolean>(false);
  const intl = useIntl();
  const { toggleHandler } = useContext(ProposalSubmitContext);
  const dispatch = useOpenedTypeDispatch();
  const map = useContext(MapContext);
  const navigate = useNavigate();
  const { setSessionValue: setSessionProposalValue } = usePlannedDocumentProposal();
  const { isTokenActive } = useJwt();
  const [selectedVersion, setSelectedVersion] = useState<string>();
  const user = useUserState();

  const visibilityHandler = (arrLength: number, count: number) => {
    setIsOpenDecision((prev) => !prev);

    if (!isOpenDecision) {
      setDecisionsVisibility(arrLength);
    } else {
      setDecisionsVisibility(count);
    }
  };

  const proposalSubmit = () => {
    if (!isTokenActive()) {
      setShowUnauthenticated(true);
      return;
    }

    toggleHandler(data.Label, '24.12.2024 - 25.12.2024', data.PublicDiscussionList[0]['TapisId']);
  };

  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const userCanAccess = activeRole?.code === 'authenticated';

  const { data, refetch, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/planned-documents/${id}`,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      if (isHovered) {
        return;
      }
      setVersionList(response?.TAPDPreviousVersions || []);
      setSelectedVersion(response.TAPDVersion);
      setPublicDiscussionsList(parsedPublicListForTree(response.PublicDiscussionList || []));
      setAttachmentList(parseAttachmentList(response.TAPDAttachmentList));
      dispatch({
        type: 'SELECT_TAPIS_DOCUMENT',
        payload: {
          selectedTapisDocument: {
            ...response,
            dok_id: id,
            layerGroup: new LayerGroup({
              properties: {
                id: 'tapis_indiv_layers',
                title: 'Plānošanas dokumenta slāņi',
              },
            }),
          },
        },
      });
    },
  });

  const { data: mapFeature, refetch: refetchMapFeature } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/geoserver/document_layers/wfs?service=WFS&request=GetFeature&version=2.0.0&typename=planojuma_robeza&outputFormat=application/json&VIEWPARAMS=dok_id:${id}&count=1`,
      disableOnMount: true,
    },
  });

  useEffect(() => {
    documentTitle(data.Label);
    documentMunicipality(data.TAPDOrganisation);
  }, [data]);

  useEffect(() => {
    refetch();
    refetchMapFeature();
    setIsOpenDecision(false);
    setDecisionsVisibility(4);
  }, [id]);

  const parseAttachmentList = (data: AttachmentListType) => {
    if (data) {
      const sections = Object.values(data);
      sections.sort((a, b) => parseInt(String(a.SectionPosition), 10) - parseInt(String(b.SectionPosition), 10));

      return sections.map((entry: AttachmentListType[keyof AttachmentListType], index) => {
        const children = entry.SectionAttachments.map((event: SectionAttachmentsType) => {
          return {
            key: event.TapisId,
            selectable: false,
            title: (
              <Popover
                trigger="hover"
                content={
                  <PopoverWrapper>
                    <Icon faBase="far" icon="file" />
                    {` (${(event.FileSize / 1024 / 1024).toFixed(1)} MB)`}
                    <br />
                    {event?.FileName}
                  </PopoverWrapper>
                }
              >
                <CustomStyledChildrenLinkWrapper>
                  <a className="styled-link" download href={event.FileUrl}>
                    {event.FileName}
                  </a>
                </CustomStyledChildrenLinkWrapper>
              </Popover>
            ),
          };
        });

        if (children.length > 1) {
          return {
            key: index,
            selectable: false,
            title: entry.SectionName,
            children: children,
          };
        } else {
          return {
            key: index,
            selectable: false,
            title: (
              <Popover
                trigger="hover"
                content={
                  <PopoverWrapper>
                    <Icon faBase="far" icon="file" />
                    {` (${convertBytesToMegabytes(entry.SectionAttachments[0].FileSize)} MB)`}
                    <br />
                    {entry?.SectionAttachments[0].FileName}
                  </PopoverWrapper>
                }
              >
                <CustomStyledLink download target="_blank" href={entry.SectionAttachments[0].FileUrl}>
                  {entry.SectionName}
                </CustomStyledLink>
              </Popover>
            ),
            children: [],
          };
        }
      });
    }
  };

  const fileLinks = (files: any[]) => {
    const fileLinks = files?.map((file) => (
      <a className="file-link" key={file.FileName} href={file.FileUrl} download={file.FileName}>
        {file.FileName}
      </a>
    ));

    const joinedLinks = fileLinks?.map((link, index) => (
      <>
        {index > 0 && ', '} {link}
      </>
    ));

    return <div>{joinedLinks}</div>;
  };

  const parsedPublicListForTree = (list: any) => {
    const events: TreeProps['treeData'] = [];

    const informationDropdown = {
      key: 2,
      selectable: false,
      title: <div className="more-info-title-text">{intl.formatMessage({ id: 'planned_documents.more_info' })}</div>,
      children: [] as Array<{ key: string; selectable: boolean; title: JSX.Element }>,
    };

    list.forEach((entry: any) => {
      entry.PublicDiscussionEvents.map((event: any, index: number) => {
        events.push({
          key: `${list.OriginalDocumentId}_${index}_${Math.random()}`,
          selectable: false,
          title: (
            <div className="title-text">
              {event.PublicEventType} ({dayjs(event.PublicEventDateTime).format('DD.MM.YYYY. HH:mm')})
            </div>
          ),
          children: [
            {
              key: `event_${event.PublicEventDateTime}_${Math.random()}`,
              selectable: false,
              title: (
                <div className="event-content-wrapper">
                  <div className="small-text-wrapper">
                    <div className="small-text-wrapper-title">
                      {intl.formatMessage({ id: 'planned_documents.public_event.place' })}:
                    </div>
                    {event.PublicEventPlace}
                  </div>
                  <div className="small-text-wrapper">
                    <div className="small-text-wrapper-title">
                      {intl.formatMessage({ id: 'planned_documents.public_event.time' })}:
                    </div>
                    {dayjs(event.PublicEventDateTime).format(`DD.MM.YYYY. `)}
                    {intl.formatMessage(
                      {
                        id: 'planned_documents.public_discussion_time_prefix',
                      },
                      { value: dayjs(event.PublicEventDateTime).format(`HH:mm`) }
                    )}
                  </div>
                  <div className="small-text-wrapper">
                    <div className="small-text-wrapper-title">
                      {intl.formatMessage({ id: 'planned_documents.public_event.contact_info' })}:
                    </div>
                    {event.PublicEventContactInfo}
                  </div>
                  {!!event.PublicEventMaterialsFiles && event.PublicEventMaterialsFiles?.length > 0 && (
                    <div className="small-text-wrapper">
                      <div className="small-text-wrapper-title">
                        {intl.formatMessage({ id: 'planned_documents.meeting_protocol' })}:
                      </div>
                      {fileLinks(event.PublicEventMaterialsFiles)}
                    </div>
                  )}
                </div>
              ),
            },
          ],
        });
      });

      if (
        !!entry.PublicDiscussionReception ||
        !!entry.PublicDiscussionMaterials ||
        !!entry.PublicDiscussionContacts ||
        (!!entry.PublicDiscussionMaterialsFiles && entry.PublicDiscussionMaterialsFiles?.length > 0)
      ) {
        informationDropdown.children.push({
          key: 'more_info_button',
          selectable: false,
          title: (
            <div className="event-content-wrapper">
              <div className="small-text-wrapper">
                <div className="small-text-wrapper-title">
                  {intl.formatMessage({ id: 'planned_documents.public_discussion_reception' })}:
                </div>
                {!!entry.PublicDiscussionReception ? (
                  <div className="reception-wrapper">{entry.PublicDiscussionReception}</div>
                ) : (
                  '-'
                )}
              </div>
              <div className="small-text-wrapper">
                <div className="small-text-wrapper-title">
                  {intl.formatMessage({ id: 'planned_documents.public_discussion_materials' })}:
                </div>
                {!!entry.PublicDiscussionMaterials ? entry.PublicDiscussionMaterials : '-'}
              </div>
              <div className="small-text-wrapper">
                <div className="small-text-wrapper-title">
                  {intl.formatMessage({ id: 'planned_documents.public_discussion_contacts' })}:
                </div>
                {!!entry.PublicDiscussionContacts ? entry.PublicDiscussionContacts : '-'}
              </div>
              <div className="small-text-wrapper">
                <div className="small-text-wrapper-title">
                  {intl.formatMessage({ id: 'planned_documents.other_info_materials' })}:
                </div>
                {!!entry.PublicDiscussionMaterialsFiles && entry.PublicDiscussionMaterialsFiles?.length > 0
                  ? fileLinks(entry.PublicDiscussionMaterialsFiles)
                  : '-'}
              </div>
            </div>
          ),
        });
      }
    });

    if (informationDropdown.children.length > 0) {
      return [...events, informationDropdown];
    } else {
      return events;
    }
  };

  const openInMap = () => {
    if (map && mapFeature) {
      highlightFeaturesGeoJson(map, mapFeature);
    }
  };

  const copySite = async () => {
    try {
      await navigator.clipboard.writeText(`${window?.runConfig?.frontendUrl}/geo/tapis?#document_${id}`);
      toastMessage.success(intl.formatMessage({ id: 'planned_documents.copied_successfully' }));
    } catch (e) {
      toastMessage.error(intl.formatMessage({ id: 'planned_documents.copied_error' }));
      console.error('Failed to copy Document URL:', e);
    }
  };

  const getDiscussionText = (discussion: any) => {
    const from = dayjs(discussion.PublicDiscussionDateFrom);
    const to = dayjs(discussion.PublicDiscussionDateTo);
    const today = dayjs().endOf('day');

    // Calculate difference including today
    const diff = to.endOf('day').diff(today, 'day') + 1;

    return (
      from.format('DD.MM.YYYY.') +
      ' - ' +
      to.format('DD.MM.YYYY.') +
      ' ' +
      (diff > 0 ? '(atlikušas ' + diff + ' dienas)' : '')
    );
  };

  const computedStatus = data?.TAPDStatuss
    ? listStatuses.find((entry) => entry.treeJsonTitle === data?.TAPDStatuss)
    : undefined;

  const onUnauthenticated = () => {
    setSessionProposalValue({
      id,
      open: true,
    });
  };

  const replaceUrlWithTag = (text?: string, isImportant = false): ReactNode => {
    const urlRegex = /(https?:\/\/[^\s)]+(?:\([^)]*\))*)/g;
    return text?.split(urlRegex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <StyledHref isImportant={isImportant} key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </StyledHref>
        );
      }
      return part;
    });
  };

  return (
    <>
      <Spinner spinning={isLoading}>
        <Section>
          <StyledActions>
            <div>
              <Tag label={computedStatus?.title || ''} color={computedStatus?.color || ''} />
              {versionList.length > 0 ? (
                <Popover
                  placement="bottom"
                  content={
                    <StyledPopover>
                      {versionList.map((e: any) => (
                        <div
                          className="entry"
                          onClick={() => {
                            navigate(`/geo/tapis#document_${e.DocumentId}#nozoom`);
                            setSelectedVersion(e.Version);
                          }}
                        >
                          <FormattedMessage id="planned_documents.editorial" values={{ version: e.Version }} />
                        </div>
                      ))}
                    </StyledPopover>
                  }
                  trigger="hover"
                >
                  <b>{selectedVersion}</b>
                  {versionList.length > 0 && <Icon className="ml-1" faBase="fal" icon="caret-down" />}
                </Popover>
              ) : (
                <b>{selectedVersion}</b>
              )}
            </div>
            <div className="icons">
              <Tooltip hack title={intl.formatMessage({ id: 'tooltip.open_in_map' })}>
                <Icon faBase="fal" icon="lightbulb" onClick={openInMap} />
              </Tooltip>
              <Tooltip hack title={intl.formatMessage({ id: 'tooltip.copy' })}>
                <Icon faBase="fal" icon="share" onClick={copySite} />
              </Tooltip>
            </div>
          </StyledActions>
          <div>
            <ExplanationWrapper style={data?.ExplanationIsImportant ? { color: '#b2291f' } : undefined}>
              {replaceUrlWithTag(data?.ExplanationNote, data?.ExplanationIsImportant)}
            </ExplanationWrapper>
          </div>
          {!!data.DisputeDate && dayjs(data.DisputeDate).endOf('day').diff(dayjs().endOf('day'), 'days') + 1 > 0 && (
            <div className="small-text-wrapper-title my-4">
              {intl.formatMessage({ id: 'planned_documents.appeal_deadline' }) +
                ' ' +
                dayjs(data.DisputeDate).format('DD.MM.YYYY') +
                intl.formatMessage(
                  { id: 'planned_documents.appeal_rest' },
                  { days: dayjs(data.DisputeDate).endOf('day').diff(dayjs().endOf('day'), 'days') + 1 }
                )}
            </div>
          )}

          {data?.PublicDiscussionList?.map((entry: any) => (
            <StyledCard key={`event_${entry.OriginalDocumentId}_list`}>
              <StyledTreeItemsWrapper>
                {publicDiscussionList && (
                  <>
                    <h3>{intl.formatMessage({ id: 'planned_documents.public_participation' })}</h3>
                    <div>
                      {computedStatus?.searchStatus === 'pending_approval'
                        ? intl.formatMessage({ id: 'planned_documents.public_consultation_period' })
                        : intl.formatMessage({ id: 'planned_documents.public_consultation_took_place' })}
                    </div>
                    <div>{getDiscussionText(entry)}</div>
                    <div className="tree-wrapper">
                      <DirectoryTree selectable={false} showIcon={false} treeData={publicDiscussionList} />
                    </div>
                  </>
                )}
              </StyledTreeItemsWrapper>
            </StyledCard>
          ))}
          {!!data?.PublicDiscussionList?.length &&
            computedStatus?.searchStatus === 'pending_approval' &&
            (!userCanAccess && isTokenActive() ? (
              <TooltipWrapper>
                <Tooltip title={intl.formatMessage({ id: 'planned_documents.submit_proposal_not_allowed' })}>
                  <span>
                    <Button
                      disabled={!userCanAccess && isTokenActive()}
                      type="primary"
                      className="full"
                      onClick={proposalSubmit}
                      label={intl.formatMessage({ id: 'planned_documents.submit_proposal' })}
                    />
                  </span>
                </Tooltip>
              </TooltipWrapper>
            ) : (
              <span>
                {!activeRole?.emailVerified && isTokenActive() ? (
                  <TooltipWrapper>
                    <span>
                      <Button
                        disabled={!userCanAccess}
                        type="primary"
                        className="full"
                        onClick={proposalSubmit}
                        label={intl.formatMessage({ id: 'planned_documents.submit_proposal' })}
                      />
                    </span>
                  </TooltipWrapper>
                ) : (
                  <Button
                    type="primary"
                    className="full"
                    onClick={proposalSubmit}
                    label={intl.formatMessage({ id: 'planned_documents.submit_proposal' })}
                  />
                )}
              </span>
            ))}
          <UnauthenticatedModal
            additionalOnOkExecution={onUnauthenticated}
            setShowModal={setShowUnauthenticated}
            showModal={showUnauthenticated}
          />
        </Section>
        {attachmentList && (
          <Section>
            <Label subTitle extraBold label={intl.formatMessage({ id: 'planned_documents.sections' })} />
            <TreeWrapper>
              <DirectoryTree treeData={attachmentList} selectable={false} showIcon={false} />
            </TreeWrapper>
          </Section>
        )}

        <Section>
          <Label subTitle extraBold label={intl.formatMessage({ id: 'planned_documents.decisions_reports' })} />

          <DecisionAndMaterialListWrapper>
            {data?.TAPDDecisionAndMaterialList &&
              Object.values(data?.TAPDDecisionAndMaterialList as DecisionsReportsType[])
                .sort((a, b) => {
                  if (a.DecisionAttachements?.FileAcceptance === null) {
                    return 1;
                  }
                  if (b.DecisionAttachements?.FileAcceptance === null) {
                    return 1;
                  }

                  const dateA = dayjs(a.DecisionAttachements?.FileAcceptance);
                  const dateB = dayjs(b.DecisionAttachements?.FileAcceptance);

                  return dateA.isBefore(dateB) ? 1 : -1;
                })
                .slice(0, decisionVisibility)
                .map((value: DecisionsReportsType) => (
                  <div className="plannedDocuments__decision" key={value.DecisionAttachements?.TapisId}>
                    <div>
                      <div className="plannedDocuments__decision--time">
                        {dayjs(value.DecisionAttachements?.FileAcceptance).format('DD.MM.YYYY.') !== 'Invalid Date'
                          ? dayjs(value.DecisionAttachements?.FileAcceptance).format('DD.MM.YYYY.')
                          : ''}
                      </div>
                      <Popover
                        content={
                          <PopoverWrapper>
                            {value.DecisionAttachements?.FileSize ? (
                              <>
                                {value.DecisionAttachements?.FileName}
                                <br />
                                <StyledFileVersionWrapper>
                                  <Icon faBase="far" icon="file" />
                                  <FormattedMessage
                                    id="planned_documents.tooltip"
                                    values={{
                                      version: value.DecisionAttachements?.OriginalDocumentVersion,
                                      fileSize: convertBytesToMegabytes(value.DecisionAttachements?.FileSize),
                                    }}
                                  />
                                </StyledFileVersionWrapper>
                              </>
                            ) : (
                              <>
                                <Icon faBase="fas" icon="link" />
                                {` ${value.DecisionAttachements?.FileUrl}`}
                              </>
                            )}
                          </PopoverWrapper>
                        }
                        trigger="hover"
                      >
                        <>
                          <CustomStyledLink target="_blank" href={value.DecisionAttachements?.FileUrl} download>
                            {value.DecisionAttachements?.FileName}
                          </CustomStyledLink>
                        </>
                      </Popover>
                    </div>
                    {value.DecisionAttachements?.DecisionAdditionalAttachements &&
                      value.DecisionAttachements?.DecisionAdditionalAttachements?.map((additionalDocumentValue) => (
                        <div className="additional_documents" key={additionalDocumentValue?.OriginalDocumentId}>
                          <Popover
                            content={
                              <PopoverWrapper>
                                {additionalDocumentValue?.FileSize ? (
                                  <>
                                    {additionalDocumentValue?.FileName}
                                    <br />
                                    <StyledFileVersionWrapper>
                                      <Icon faBase="far" icon="file" />
                                      <FormattedMessage
                                        id="planned_documents.tooltip"
                                        values={{
                                          version: value.DecisionAttachements?.OriginalDocumentVersion,
                                          fileSize: convertBytesToMegabytes(value.DecisionAttachements?.FileSize),
                                        }}
                                      />
                                    </StyledFileVersionWrapper>
                                  </>
                                ) : (
                                  <>
                                    <Icon faBase="fas" icon="link" />
                                    {` ${additionalDocumentValue?.FileUrl}`}
                                  </>
                                )}
                              </PopoverWrapper>
                            }
                            trigger="hover"
                          >
                            <>
                              <CustomStyledLink target="_blank" href={additionalDocumentValue?.FileUrl} download>
                                {additionalDocumentValue?.FileName}
                              </CustomStyledLink>
                            </>
                          </Popover>
                        </div>
                      ))}
                  </div>
                ))}
            {data?.TAPDDecisionAndMaterialList && Object.values(data?.TAPDDecisionAndMaterialList).length >= 5 && (
              <Button
                type="text"
                icon={isOpenDecision ? 'caret-down' : 'caret-right'}
                onClick={() => visibilityHandler(Object.values(data?.TAPDDecisionAndMaterialList).length, 4)}
                label={
                  <div className={'ml-1'}>
                    {intl.formatMessage({
                      id: !isOpenDecision ? 'planned_documents.show_more' : 'planned_documents.show_less',
                    })}
                  </div>
                }
              />
            )}
          </DecisionAndMaterialListWrapper>
        </Section>

        <div>
          <Label subTitle extraBold label={intl.formatMessage({ id: 'planned_documents.layers' })} />
          <PlannedDocumentLayerSettings zoom={isZoomToPlannedDocument} />
        </div>
      </Spinner>
    </>
  );
};
