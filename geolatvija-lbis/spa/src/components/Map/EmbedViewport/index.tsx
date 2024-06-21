import { StyledEmbedViewport } from './styles';
import { StyledLayerSwitcher } from '../LayerSwitcher/styles';
import { Button } from '../../../ui';
import { StyledEmbedOpenButton } from '../EmbedOpenButton/styles';

interface EmbedViewportProps {
  width: number;
  height: number;
}

export const EmbedViewport = ({ width, height }: EmbedViewportProps) => {
  return (
    <StyledEmbedViewport embedViewPort height={height} width={width}>
      <StyledLayerSwitcher embedViewPort className="ol-unselectable ol-control">
        <Button key="current_empty" label="Slāņi" icon="layer-group" faBase="far" />
      </StyledLayerSwitcher>
      <div className="ol-zoom ol-unselectable ol-control">
        <Button className="ol-zoom-in" label="+" />
        <Button className="ol-zoom-out" label="-" />
      </div>
      <StyledEmbedOpenButton embedViewPort className="ol-unselectable ol-control">
        <Button icon="house" faBase="fa-regular" />
      </StyledEmbedOpenButton>
    </StyledEmbedViewport>
  );
};

export default EmbedViewport;
