import styled from 'styled-components/macro';
import { Label } from 'ui/label/Label';
import { VARIABLES } from '../../../../styles/globals';

export const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.p3Size};

  .icons {
    display: flex;
    & > * {
      padding: 0 8px;
      border-right: 1px solid ${({ theme }) => theme.border};
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => theme.brand02};
      }

      &:last-child {
        border-right: none;
        padding-right: 0;
      }
    }
  }
`;

export const StyledCard = styled.div`
  padding: 14px 20px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${VARIABLES.mapButtonBorderRadius};
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  .card-btn {
    width: fit-content;
  }
`;

export const Section = styled.div`
  padding-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 15px;
`;

export const DecisionAndMaterialListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .plannedDocuments__decision {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .plannedDocuments__decision--time {
    color: ${({ theme }) => theme.gray06};
    font-size: ${({ theme }) => theme.p2Size};
    line-height: ${({ theme }) => theme.lineHeight9};
  }

  .additional_documents {
    margin-left: 12px;
  }
`;

export const StyledFileVersionWrapper = styled.div`
  color: ${({ theme }) => theme.placeholder};

  i {
    color: ${({ theme }) => theme.placeholder};
  }
`;

export const StyledApplyTextWrapper = styled.p`
  font-size: ${({ theme }) => theme.p3Size};
  margin: 0;
`;

export const StyledNotificationStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .img-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;

    img {
      max-width: 70%;
      height: auto;
      object-fit: contain;
    }
  }
`;

export const StyledApplicationNameWrapper = styled.div`
  .ant-form-item-label {
    padding-bottom: 8px !important;

    label {
      line-height: ${({ theme }) => theme.lineHeight8} !important;
      font-size: ${({ theme }) => theme.p2Size} !important;
      font-weight: 600 !important;
      color: ${({ theme }) => theme.gray07} !important;
    }
  }
`;

export const StyledOther = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.p3Size};
`;

export const StyledSearchContainer = styled.div`
  .hide-container {
    display: none;
  }

  .ant-select-selection-overflow-item .ant-select-selection-item .ant-select-selection-item-content {
    max-width: 250px;
  }
`;

export const StyledPopover = styled.div`
  padding: 8px 16px;

  .entry {
    cursor: pointer;
  }
`;

export const StyledTreeItemsWrapper = styled.div`
  .tree-wrapper {
    margin-top: 12px;
  }

  .ant-tree-node-content-wrapper-normal {
    padding-left: 10px;
  }

  .ant-tree-indent {
    display: none;
  }

  .ant-tree-node-content-wrapper {
    padding-left: 0px;
  }

  font-size: ${({ theme }) => theme.p3Size};

  .ant-tree-treenode {
    overflow: hidden;
  }

  .ant-tree-switcher-noop {
    display: none;
  }

  .ant-tree-title {
    font-size: ${({ theme }) => theme.p3Size} !important;
  }

  .ant-tree-switcher {
    width: auto !important;
  }

  .ant-tree-indent-unit {
    width: 16px !important;
  }

  .small-text-wrapper-title {
    font-weight: bold;
    font-size: ${({ theme }) => theme.p3Size};
    max-width: 230px;
  }

  .reception-wrapper {
    white-space: pre-line;
  }

  .small-text-wrapper {
    font-weight: normal;
    font-size: ${({ theme }) => theme.p3Size};
    line-height: ${({ theme }) => theme.lineHeight8};

    border-bottom: 1px solid ${({ theme }) => theme.gray03};
    padding-bottom: 6px;

    &:last-child {
      padding-bottom: 0px;
      border: none;
    }
  }
  .subtitle-text {
    font-weight: bold;
  }

  .title-text {
    font-size: ${({ theme }) => theme.p3Size};
    line-height: ${({ theme }) => theme.lineHeight8};
    padding-left: 10px !important;
  }

  .more-info-title-text {
    padding-left: 10px !important;
  }

  .file-link {
    color: ${({ theme }) => theme.brand02};
    &:hover {
      color: ${({ theme }) => theme.brand02};
    }
  }

  .event-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

export const StyledListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

export const StyledImage = styled.img`
  object-fit: contain;
  width: 330px;
`;

export const TreeWrapper = styled.div`
  color: ${({ theme }) => theme.brand02};
  font-weight: ${({ theme }) => theme.fontWeightBold};
  font-size: ${({ theme }) => theme.p2Size};

  .ant-tree-node-content-wrapper {
    color: ${({ theme }) => theme.brand02};
    line-height: 16px !important;
    padding-top: 4px !important;
    font-size: 0.8rem !important;
  }

  .ant-tree-indent {
    display: none;
  }
`;

export const TooltipWrapper = styled.div`
  .ant-tooltip {
    max-width: 300px;
  }
`;

export const ParsedLabel = styled(Label)`
  display: flex;
  flex-direction: column;

  & > * {
    margin: 0;
  }
`;

export const PopoverWrapper = styled.div`
  padding: 8px;
  font-weight: normal;
  font-size: ${({ theme }) => theme.p3Size};
  max-width: 250px;
  color: ${({ theme }) => theme.textColor01};
`;

export const StyledTooltipWrapper = styled.div`
  .tooltip-inner-div {
    width: 100%;

    .button {
      width: 100%;
    }
  }
`;

export const StyledATag = styled.a`
  color: ${({ theme }) => theme.black};

  &:hover {
    color: ${({ theme }) => theme.black};
  }
`;

export const StyledDescriptionWrapper = styled.div`
  padding-bottom: 16px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;

  .ant-tooltip-inner {
    max-width: 250px;
    text-align: center;
  }
`;

export const ExplanationWrapper = styled.span`
  color: ${({ theme }) => theme.gray06};
`;

export const StyledHref = styled.a<{
  isImportant: boolean;
}>`
  text-decoration: underline;
  color: ${({ theme, isImportant }) => (isImportant ? '#b2291f' : theme.textColor01)};

  &:hover {
    color: ${({ theme, isImportant }) => (isImportant ? '#b2291f' : theme.textColor01)};
  }
`;

export const CustomStyledLink = styled.a`
  color: ${({ theme }) => theme.brand02};
  font-weight: ${({ theme }) => theme.fontWeightBold};
  font-size: ${({ theme }) => theme.p3Size};

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;

  &:hover {
    color: ${({ theme }) => theme.brand02};
  }
`;

export const CustomStyledChildrenLinkWrapper = styled.div`
  margin-left: 12px;

  .styled-link {
    color: ${({ theme }) => theme.brand02};
    font-weight: ${({ theme }) => theme.fontWeightBold};
    line-height: ${({ theme }) => theme.lineHeight11};

    &:hover {
      color: ${({ theme }) => theme.brand02};
    }
  }
`;

export const SearchInspireWrapper = styled.div`
  max-width: 250px;

  .ant-form-item-row {
    align-items: center;
  }
`;

export const ApplyForNotificationSideBarWrapper = styled.div`
  .content {
    padding-top: 12px;

    label {
      line-height: ${({ theme }) => theme.lineHeight8};
    }
  }

  .sidebar-title {
    padding-bottom: 12px;
  }
  .mt-3{
    font-size: ${({ theme }) => theme.p2Size};
  }
`;
