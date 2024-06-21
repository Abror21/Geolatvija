import stringConverter from 'utils/stringConverter';
import { useIntl } from 'react-intl';
import toastMessage from './toastMessage';

interface ErrorProps {
  [key: string]: string[] | string;
}

function useHandleError() {
  const intl = useIntl();
  const { toSnake } = stringConverter();

  const handleError = (
    error: ErrorProps,
    key?: string,
    specialMessage?: string,
    specialAttribute?: string,
    dontShowMessages?: boolean
  ) => {
    if (!dontShowMessages) {
      if (error.attributes && error.error && typeof error.error === 'string') {
        toastMessage.error(intl.formatMessage({ id: error.error }, error.attributes as any));
        return;
      }

      if (specialMessage) {
        toastMessage.error(intl.formatMessage({ id: specialMessage }, { attribute: specialAttribute }));
      } else if (error.hasOwnProperty('error') && typeof error.error === 'string') {
        if (error.error.length <= 45) {
          toastMessage.error(intl.formatMessage({ id: error.error }));
        } else {
          toastMessage.error(intl.formatMessage({ id: 'error.data_load' }));
        }
      } else if (!!key) {
        Object.entries(error).forEach((entry) => {
          const convertedString = toSnake(entry[0]);
          const attribute = intl.formatMessage({ id: key + '.' + convertedString });

          toastMessage.error(intl.formatMessage({ id: entry[1][0] }, { attribute: attribute }));
        });
      } else {
        toastMessage.error(intl.formatMessage({ id: 'error.data_load' }));
      }
    }

    document.body.scrollTop = document.documentElement.scrollTop = 0; //pure js scroll to top, supported in all browsers
    console.error(error);
  };

  return [handleError];
}

export default useHandleError;
