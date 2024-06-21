import { Languages } from 'constants/enums';

export type VersionListModel = {
  [key in Languages]: string;
};
