import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledPage = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.gray01};
  color: ${({ theme }) => theme.textColor02};
  height: ${VARIABLES.footerHeight};
  max-height: ${VARIABLES.footerHeight};

  display: flex;
  align-items: center;
  padding-right: 16px;

  flex-grow: 1;
  justify-content: end;

  @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
    flex-direction: column;
    height: auto;
    max-height: none;
    justify-content: center;
    padding: 32px 0 32px 0;
    gap: 24px;
  }

  .end {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    margin-right: 30px;

    @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
      margin-right: 0;
    }

    .contacts-entry {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      .portal-icon {
        background: ${({ theme }) => theme.brand02Light2};
        width: 36px;
        height: 36px;
        border-radius: 50%;

        &:before {
          width: 36px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .copyright {
    padding: 0 25px;
    //margin: 32px 0;

    border-right: 1px solid ${({ theme }) => theme.border};

    @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
      border-right: none;
      padding: 0;
    }
  }

  .footer-sites {
    font-weight: ${({ theme }) => theme.fontWeightBold};
    font-size: ${({ theme }) => theme.p2Size};
    margin-left: 25px;

    display: flex;
    gap: 25px;

    @media (max-width: ${VARIABLES.mobileWidthThreshold}) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 0;
    }

    a {
      color: ${({ theme }) => theme.textColor01};
    }
  }
`;

export const StyledHrefComponent = styled.a`
  color: ${({ theme }) => theme.textColor01};

  &:hover {
    color: ${({ theme }) => theme.brand02};
  }
`;
