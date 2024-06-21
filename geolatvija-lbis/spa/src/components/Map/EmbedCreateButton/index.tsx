import { Button } from '../../../ui';
import { StyledEmbedCreateButton } from './styles';
import { type Dispatch, type SetStateAction } from 'react';
import useJwt from '../../../utils/useJwt';

interface EmbedCreateButtonProps {
  setIsOpenedEmbedded: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const EmbedCreateButton = ({ setIsOpenedEmbedded, setShowModal }: EmbedCreateButtonProps) => {
  const { isTokenActive } = useJwt();

  return (
    <StyledEmbedCreateButton className="ol-unselectable ol-control">
      <Button
        className="embed-create-button"
        icon="share-from-square"
        faBase="fa-regular"
        title="Veidot iegulto karti"
        onClick={() => {
          if (isTokenActive()) {
            setIsOpenedEmbedded(true);
          } else {
            setShowModal(true);
          }
        }}
      />
    </StyledEmbedCreateButton>
  );
};

export default EmbedCreateButton;
