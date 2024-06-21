import styled from 'styled-components/macro';
import { VARIABLES } from '../../../styles/globals';

export const ButtonRow = styled.div`
  Button {
    flex: auto;
  }

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 3rem;

  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    gap: 12px;
    Button {
      width: 100%;
    }
  }
`;

export const InformationText = styled.div`
  margin: 0rem 7rem 0.4rem 0.4rem;

  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    margin: 0;
  }
`;

export const AgreeText = styled.div`
  margin-bottom: 1rem;
  font-weight: bold;
`;

export const AccessibilityOptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #e6e7ee;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const MainBlock = styled.div`
  .title {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .modal-header {
    padding: 3px 3px !important;
  }
`;

export const PrivacyButton = styled.a`
  color: ${({ theme }) => theme.brand02};

  &:hover {
    color: ${({ theme }) => theme.brand02};
  }
`;

export const DetailedInformation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #f7f7f7;
  font-weight: bold;
  padding: 0.8rem;
  cursor: pointer;
`;

export const DetailedInformationTableContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;
