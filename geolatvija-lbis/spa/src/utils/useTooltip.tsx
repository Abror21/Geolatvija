import { useTooltipState } from '../contexts/TooltipContext';
import { useLocation } from 'react-router-dom';

function useTooltip(name: any) {
  const { tooltips } = useTooltipState();
  const location = useLocation();

  let convertedName = name;

  if (Array.isArray(name)) {
    convertedName = name[name.length - 1];
  }

  const tooltip = tooltips.find((e: any) => location.pathname.includes(e.url) && e.code === convertedName);

  return tooltip?.translation;
}

export default useTooltip;
