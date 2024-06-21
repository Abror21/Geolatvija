import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { Button, Checkbox, Input, Label, RadioGroup, TextArea, Tooltip, ImageUploader, CheckboxGroup, Spinner } from 'ui';
import { StyledSubmitProjectForm } from './style';
import { projectViewFile } from 'Assets';
import UploadFiles from './DocumentUploader';
import { Form, message } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOpenedTypeDispatch } from 'contexts/OpenedTypeContext';
import { useUserState } from 'contexts/UserContext';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useParticipationBudgetState } from 'contexts/ParticipationBudgetContext';

const SubmitProjectForm = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const openedTypeDispatch = useOpenedTypeDispatch();
  const user = useUserState();
  const [isSubmitterOrganisation, setIsSubmitterOrganisation] = useState(false);
  const [partialImplementation, setPartialImplementation] = useState(false);
  const [imageList, setImageList] = useState<any[]>([]);
  const [files, setFiles] = useState<[any] | []>([]);
  const [submittedProject, setSubmittedProject] = useState<any | {}>({});
  const { budgets: municipalityList } = useParticipationBudgetState();

  const isThereProjectId = searchParams.get('project-id') && !!searchParams.get('project-id');
  const projectId = isThereProjectId ? searchParams.get('project-id') : undefined;
  const coords = searchParams.get('coords') || 'POINT (26.8 56.2)';
  const atvk_id = searchParams.get('atvk') || '0039000';
  const onMunicipalityLand = searchParams.get('ml') === 't';
  
  const submissionPeriodTo = municipalityList?.find((municipality: any) => {
    return municipality.atvk_id === (projectId ? submittedProject.atvk_id : atvk_id)
  })?.submission_period_to;
  
  useEffect(() => {
    if (Object.keys(submittedProject).length > 0 && submittedProject.id) {
      setPartialImplementation(submittedProject.versions[0]?.partial_implementation_flag);
      setIsSubmitterOrganisation(submittedProject.versions[0]?.submitter_is_organisation);
      form.setFieldsValue({
        confirmation: ['confirm'],
        name: submittedProject.name,
        tags: 'ieskaite',
        concept_description: submittedProject.versions[0]?.concept_description,
        indicative_costs: submittedProject.versions[0]?.indicative_costs,
        notes: submittedProject.versions[0]?.notes_for_specialist,
        submitter_name: submittedProject.submitter_name,
        submitter_last_name: submittedProject.submitter_last_name,
        submitter_email: submittedProject.versions[0]?.submitter_email,
        submitter_phone: submittedProject.versions[0]?.submitter_phone,
        organisation_name: submittedProject.versions[0]?.organisation_name,
        organisation_registration_number: submittedProject.versions[0]?.organisation_registration_number,
      });
      setFiles(submittedProject.versions[0]?.required_attachments);
      setImageList(submittedProject.versions[0]?.pictures);
    }
    return () => {
      setPartialImplementation(false);
      setIsSubmitterOrganisation(false);
      setImageList([]);
      setFiles([]);
    };
  }, [submittedProject]);

  useEffect(() => {
    let userFizikPersonEmail;
    user?.roles.forEach((element) => {
      if (element.code === 'authenticated') {
        userFizikPersonEmail = element.email;
      }
    });
    if (!isThereProjectId) {
      form.setFieldsValue({
        submitter_name: user?.name,
        submitter_last_name: user?.surname,
        submitter_email: userFizikPersonEmail,
      });
    }
  }, [user]);

  const { appendData, isLoading: submitLoading } = useQueryApiClient({
    request: {
      url: projectId ? `api/v1/tapis/create-projects/${projectId}` : 'api/v1/tapis/create-projects',
      method: projectId ? 'PATCH' : 'POST',
    },
    onSuccess() {
      form.resetFields();
      handleSubmit();
    },
  });
  const { isLoading: isSubmittedProjectLoading } = useQueryApiClient({
    request: {
      url: `${'api/v1/tapis/projects/' + projectId}`,
      disableOnMount: !projectId,
    },
    onSuccess(data) {
      setSubmittedProject(data);
    },
  });

  const onFinish = (values: any) => {
    const filteredImageList = imageList.filter(img => !img._destroy);
    const isEstimateAvailable = files.some(file => (!file._destroy && file.section_name === 'Tāme'));
    const isSkiceAvailable = files.some(file => (!file._destroy && file.section_name === 'Skice'));
    const isApprovalAvailable = files.some(file => (!file._destroy && file.section_name === 'Aptiprinajums'));
    
    if (!filteredImageList.length || !isEstimateAvailable || !isSkiceAvailable || (!onMunicipalityLand && !isApprovalAvailable)) {
      if(!onMunicipalityLand && !isApprovalAvailable){
        message.error(intl.formatMessage({ id: 'validation.confirmation_is_required' }));
      }
      if(!filteredImageList.length){
        message.error(intl.formatMessage({ id: 'validation.image_field_reqired' }));
      }
      if(!isEstimateAvailable){
        message.error(intl.formatMessage({ id: 'validation.estimate_is_required' }));
      }
      if(!isSkiceAvailable){
        message.error(intl.formatMessage({ id: 'validation.skice_is_required' }));
      }
      return;
    }

    const {
      name,
      submitter_name,
      submitter_last_name,
      indicative_costs,
      concept_description,
      submitter_phone,
      submitter_email,
      organisation_name,
      organisation_registration_number,
    } = values;

    const data = {
      project: {
        id: submittedProject.id ? submittedProject.id : null,
        name,
        state: submittedProject.state ? submittedProject.state : null,
        atvk_id: submittedProject.atvk_id ? submittedProject.atvk_id : atvk_id,
        year: submittedProject.year ? submittedProject.year : new Date().getFullYear(),
        submitter_name,
        submitter_last_name,
        versions_attributes: [
          {
            id: submittedProject.id ? submittedProject.id : null,
            state: submittedProject.state ? submittedProject.state : null,
            version_number: submittedProject.versions?.[0].version_number
              ? submittedProject.versions[0].version_number
              : null,
            indicative_costs: Number(indicative_costs),
            concept_description,
            partial_implementation_flag: partialImplementation,
            notes_for_specialist: values.notes,
            submitter_phone,
            submitter_is_organisation: isSubmitterOrganisation,
            submitter_email,
            organisation_name: isSubmitterOrganisation ? organisation_name : '',
            organisation_registration_number: isSubmitterOrganisation ? organisation_registration_number : '',
            the_geom: submittedProject.the_geom ? submittedProject.the_geom : coords,
            required_attachments_attributes: files.map((file, idx) => {
              if (file.blob) {
                return file;
              } else {
                return {
                  position: idx,
                  section_name: file.section_name,
                  attachment: {
                    filename: file.filename,
                    data: file.data,
                  },
                };
              }
            }),
            pictures_attributes: imageList.map((image, index) => {
              if (image.blob) {
                return image;
              } else {
                return {
                  position: index,
                  attachment: {
                    filename: image.filename,
                    data: image.data,
                  },
                };
              }
            }),
          },
        ],
      },
    };
    appendData(data);
  };

  const handleSubmit = () => {
    if (isThereProjectId) {
      navigate('/main?my-participation=open&tab=submitted_projects_tab');
    } else {
      navigate('/main');
      openedTypeDispatch({ type: 'OPEN_SUBMIT_PROJECT_LAST_STEP' });
    }
  };
  const handleCancel = () => {
    if (isThereProjectId) {
      navigate(-1);
    } else {
      navigate('/main?participation-budget=open');
    }
  };

  return (
    <StyledSubmitProjectForm>
      <Spinner spinning={isSubmittedProjectLoading}>
        {!isSubmittedProjectLoading ? (
          <Form form={form} onFinish={onFinish} layout="vertical">
            <div className="documents_sec">
              <Label
                subTitle={true}
                bold={true}
                label={intl.formatMessage({ id: 'participation_budget.regulations_other_documents' })}
              />
              <ol className="document_list">
                <li>
                  <a target="_blank" href={projectViewFile}>
                    2023. gada nolikums
                  </a>
                </li>
                <li>
                  <a target="_blank" href={projectViewFile}>
                    Tāmes nolikums
                  </a>
                </li>
              </ol>
              <CheckboxGroup name="confirmation" direction="vertical" validations="required">
                <Checkbox
                  className='confirmation-checkbox'
                  value={'confirm'}
                  label={intl.formatMessage({ id: 'participation_budget.confiorm_regulations_documents' })}
                />
              </CheckboxGroup>
            </div>
            <div className="submit_documents_sec">
              <Label
                subTitle={true}
                bold={true}
                label={intl.formatMessage({ id: 'participation_budget.documents_tobe_submitted' })}
              />
              <UploadFiles files={files} setFiles={setFiles} />
            </div>

            <div className="basic_info_sec">
              <Label
                subTitle={true}
                bold={true}
                label={intl.formatMessage({ id: 'participation_budget.basic_info' })}
              />
              <Input
                size="middle"
                name="name"
                placeholder={intl.formatMessage({ id: 'classifier.title' })}
                label={
                  <div className="form_label">
                    <span className="label_text">
                      {intl.formatMessage({ id: 'participation_budget.project_name' })}
                    </span>
                    <Tooltip placement="topLeft" title={'Some text'}>
                      <i className="far fa-info-circle"></i>
                    </Tooltip>
                  </div>
                }
                validations="required"
              />
              <Input
                size="middle"
                name="tags"
                placeholder={intl.formatMessage({ id: 'participation_budget.key_words_and_tags' })}
                label={
                  <div className="form_label">
                    <span className="label_text">
                      {intl.formatMessage({ id: 'participation_budget.project_keywords' })}
                    </span>
                    <Tooltip placement="topLeft" title={'Some text'}>
                      <i className="far fa-info-circle"></i>
                    </Tooltip>
                  </div>
                }
              />
            </div>
            <ImageUploader tooltipLabel="Some text" imageList={imageList} setImageList={setImageList} />

            <div className="idea_desc submition_textarea">
              <TextArea
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'validation.field_required' }) },
                  { max: 3000, message: intl.formatMessage({ id: 'general.max_number_symbols' }, { limit: 3000 }) },
                ]}
                rows={4}
                name="concept_description"
                maxLength={10}
                label={intl.formatMessage({ id: 'participation_budget.project_description' })}
              />
              <span className="max-length">
                {intl.formatMessage({ id: 'general.max_number_symbols' }, { limit: 3000 })}
              </span>
            </div>

            <div className="project_amount">
              <Input
                size="middle"
                name="indicative_costs"
                placeholder={intl.formatMessage({ id: 'participation_budget.amount' })}
                validations="required"
                type="number"
                label={
                  <div className="form_label">
                    <span className="label_text">
                      {intl.formatMessage({ id: 'participation_budget.indicative_amount_project' })}
                    </span>
                    <Tooltip placement="topLeft" title={'Some text'}>
                      <i className="far fa-info-circle"></i>
                    </Tooltip>
                  </div>
                }
              />
            </div>

            <div className="checkbox_project">
              <Checkbox
                checked={partialImplementation}
                onChange={(e) => setPartialImplementation(e.target.checked)}
                label={
                  <div className="form_label">
                    <span className="label_text">
                      {intl.formatMessage({ id: 'participation_budget.agree_project_implemented' })}
                    </span>
                    <Tooltip placement="topLeft" title={'Some text'}>
                      <i className="far fa-info-circle"></i>
                    </Tooltip>
                  </div>
                }
              />
            </div>

            <div className="submition_textarea">
              <TextArea
                rows={4}
                name="notes"
                maxLength={3000}
                rules={[
                  { max: 3000, message: intl.formatMessage({ id: 'general.max_number_symbols' }, { limit: 3000 }) },
                ]}
                label={intl.formatMessage({ id: 'participation_budget.notes_for_municipal_specialist' })}
              />
              <span className="max-length">
                {intl.formatMessage({ id: 'general.max_number_symbols' }, { limit: 3000 })}
              </span>
            </div>

            <div className="info_submitter_sec">
              <Label
                subTitle={true}
                bold={true}
                label={intl.formatMessage({ id: 'participation_budget.info_about_submitter' })}
              />
              <div className="inputs_box">
                <Input
                  validations="required"
                  size="middle"
                  label={intl.formatMessage({ id: 'user_management.name' })}
                  name="submitter_name"
                  disabled
                />
                <Input
                  validations="required"
                  size="middle"
                  label={intl.formatMessage({ id: 'user_management.surname' })}
                  name="submitter_last_name"
                  disabled
                />
              </div>
              <div className="inputs_box">
                <Input
                  validations={['required', 'email']}
                  name="submitter_email"
                  size="middle"
                  label={intl.formatMessage({ id: 'geoproducts.email' })}
                />
                <Input
                  validations={['required', 'phoneNumber']}
                  name="submitter_phone"
                  size="middle"
                  label={intl.formatMessage({ id: 'geo_product_order.phone' })}
                />
              </div>

              <Label
                subTitle={true}
                bold={true}
                label={intl.formatMessage({ id: 'participation_budget.applaction_assocation_or_fundation' })}
              />

              <RadioGroup
                onChange={(e: RadioChangeEvent) => setIsSubmitterOrganisation(e.target.value)}
                className="radio_group"
                initialValue={false}
                value={isSubmitterOrganisation}
                options={[
                  { label: intl.formatMessage({ id: 'general.yes' }), value: true },
                  { label: intl.formatMessage({ id: 'general.no' }), value: false },
                ]}
              />
              {isSubmitterOrganisation && (
                <div className="inputs_box">
                  <Input
                    validations="required"
                    size="middle"
                    label={intl.formatMessage({ id: 'user.notifications_name' })}
                    name="organisation_name"
                  />
                  <Input
                    validations={['required', 'regNr']}
                    size="middle"
                    name="organisation_registration_number"
                    label={intl.formatMessage({ id: 'classifier.reg_nr' })}
                  />
                </div>
              )}
            </div>

            <div className="submit_project_btn">
              <Button
                onClick={handleCancel}
                label={intl.formatMessage({ id: projectId ? 'general.cancel_changes' : 'general.cancel' })}
              />
              <Tooltip
                placement="topLeft"
                title={intl.formatMessage(
                  { id: 'participation_budget.after_submiting_project_can_still_corrected_until_end' },
                  { period:  dayjs(submissionPeriodTo).format('DD.MM.YYYY') }
                )}
              >
                <Button
                  loading={submitLoading}
                  type="primary"
                  htmlType="submit"
                  label={intl.formatMessage({
                    id: `participation_budget.${projectId ? 'save_project' : 'submit_projects'}`,
                  })}
                />
              </Tooltip>
            </div>
          </Form>
        ) : null}
      </Spinner>
    </StyledSubmitProjectForm>
  );
};

export default SubmitProjectForm;
