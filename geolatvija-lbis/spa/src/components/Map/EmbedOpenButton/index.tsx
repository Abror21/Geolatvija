import { Button } from '../../../ui';
import { StyledEmbedOpenButton } from './styles';

interface EmbedOpenButtonProps {
  uuid: string;
}

export const EmbedOpenButton = ({ uuid }: EmbedOpenButtonProps) => {
  const url = `${window.location.protocol}//${window.location.host}${
    window.location.port ? ':' + window.location.port : ''
  }/main?embed_uuid=${uuid}`;

  console.log(url);

  const openGeoLatvija = () => window.open(url);

  return (
    <StyledEmbedOpenButton className="ol-unselectable ol-control">
      <Button icon="house" faBase="fa-regular" title="Atvērt karti geolatvija.lv" onClick={openGeoLatvija} />
    </StyledEmbedOpenButton>
  );
};

export default EmbedOpenButton;
