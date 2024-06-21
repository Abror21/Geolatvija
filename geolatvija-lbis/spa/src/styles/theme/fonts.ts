import { FONTS } from 'styles/globals';

const addValue = (value: string, multiplyBy: number, type = 'rem') => {
  let number = parseFloat(value);
  return number * multiplyBy + number + type;
};

export type FontType = typeof fontSize1;

export const fontSize1 = {
  h1Size: addValue(FONTS.h1Size, 0),
  h2Size: addValue(FONTS.h2Size, 0),
  h3Size: addValue(FONTS.h3Size, 0),
  h4Size: addValue(FONTS.h4Size, 0),
  p1Size: addValue(FONTS.p1Size, 0),
  p2Size: addValue(FONTS.p2Size, 0),
  p3Size: addValue(FONTS.p3Size, 0),
  p4Size: addValue(FONTS.p4Size, 0),

  iconSize1: addValue(FONTS.iconSize1, 0),
  iconSize2: addValue(FONTS.iconSize2, 0),
  iconSize3: addValue(FONTS.iconSize3, 0),
  iconSize4: addValue(FONTS.iconSize4, 0),

  chevronIconMarginTop: addValue(FONTS.chevronIconMarginTop, 0, 'px'),
  paginationEllipsisPositionTop: '40%',
  radioGroupInnerSize: '1.25rem',
  selectHeight: '44px',
  checkmarkMarginLeft: '0px',
  checkmarkHeight: addValue(FONTS.iconSize4, 0.4),
  checkmarkWidth: addValue(FONTS.iconSize4, 0.0),

  intermediateCheckmarkSize: addValue(FONTS.iconSize5, 0.4),
  intermediateCheckmarkMarginLeft: '0.5px',

  fontWeightBolder: FONTS.fontWeightBolder,
  fontWeightBold: FONTS.fontWeightBold,
  fontWeightRegular: FONTS.fontWeightRegular,
  fontWeightLight: FONTS.fontWeightLight,
  fontWeightExtraLight: FONTS.fontWeightExtraLight,

  lineHeight1: addValue(FONTS.lineHeight1, 0),
  lineHeight2: addValue(FONTS.lineHeight2, 0),
  lineHeight3: addValue(FONTS.lineHeight3, 0),
  lineHeight4: addValue(FONTS.lineHeight4, 0),
  lineHeight5: addValue(FONTS.lineHeight5, 0),
  lineHeight6: addValue(FONTS.lineHeight6, 0),
  lineHeight7: addValue(FONTS.lineHeight7, 0),
  lineHeight8: addValue(FONTS.lineHeight8, 0),
  lineHeight9: addValue(FONTS.lineHeight9, 0),
  lineHeight10: addValue(FONTS.lineHeight10, 0),
  lineHeight11: addValue(FONTS.lineHeight11, 0),
  projectModalWith: addValue(FONTS.projectModalWith, 0, 'px'),
  checkboxSize: addValue(FONTS.checkboxSize, 0, 'rem'),
  textVisible: 'inline',
};

export const fontSize2 = {
  h1Size: addValue(FONTS.h1Size, 0.5),
  h2Size: addValue(FONTS.h2Size, 0.5),
  h3Size: addValue(FONTS.h3Size, 0.5),
  h4Size: addValue(FONTS.h4Size, 0.5),
  p1Size: addValue(FONTS.p1Size, 0.5),
  p2Size: addValue(FONTS.p2Size, 0.5),
  p3Size: addValue(FONTS.p3Size, 0.5),
  p4Size: addValue(FONTS.p4Size, 0.5),

  iconSize1: addValue(FONTS.iconSize1, 0.5),
  iconSize2: addValue(FONTS.iconSize2, 0.5),
  iconSize3: addValue(FONTS.iconSize3, 0.5),
  iconSize4: addValue(FONTS.iconSize4, 0.5),

  chevronIconMarginTop: addValue(FONTS.chevronIconMarginTop, 4, 'px'),
  paginationEllipsisPositionTop: '45%',
  radioGroupInnerSize: '1.7rem',
  selectHeight: '56px',
  checkmarkMarginLeft: '1px',
  checkmarkHeight: addValue(FONTS.iconSize4, 0.8),
  checkmarkWidth: addValue(FONTS.iconSize4, 0.35),

  intermediateCheckmarkSize: addValue(FONTS.iconSize5, 0.9),
  intermediateCheckmarkMarginLeft: '0px',

  fontWeightBolder: FONTS.fontWeightBolder,
  fontWeightBold: FONTS.fontWeightBold,
  fontWeightRegular: FONTS.fontWeightRegular,
  fontWeightLight: FONTS.fontWeightLight,
  fontWeightExtraLight: FONTS.fontWeightExtraLight,

  lineHeight1: addValue(FONTS.lineHeight1, 0.5),
  lineHeight2: addValue(FONTS.lineHeight2, 0.5),
  lineHeight3: addValue(FONTS.lineHeight3, 0.5),
  lineHeight4: addValue(FONTS.lineHeight4, 0.5),
  lineHeight5: addValue(FONTS.lineHeight5, 0.5),
  lineHeight6: addValue(FONTS.lineHeight6, 0.5),
  lineHeight7: addValue(FONTS.lineHeight7, 0.5),
  lineHeight8: addValue(FONTS.lineHeight8, 0.5),
  lineHeight9: addValue(FONTS.lineHeight9, 0.5),
  lineHeight10: addValue(FONTS.lineHeight10, 0.5),
  lineHeight11: addValue(FONTS.lineHeight11, 0.5),
  projectModalWith: addValue('390px', 0, 'px'),
  checkboxSize: addValue(FONTS.checkboxSize, 0.2, 'rem'),
  textVisible: 'inline',
};

export const fontSize3 = {
  h1Size: addValue(FONTS.h1Size, 1),
  h2Size: addValue(FONTS.h2Size, 1),
  h3Size: addValue(FONTS.h3Size, 1),
  h4Size: addValue(FONTS.h4Size, 1),
  p1Size: addValue(FONTS.p1Size, 1),
  p2Size: addValue(FONTS.p2Size, 1),
  p3Size: addValue(FONTS.p3Size, 1),
  p4Size: addValue(FONTS.p4Size, 1),

  iconSize1: addValue(FONTS.iconSize1, 1),
  iconSize2: addValue(FONTS.iconSize2, 1),
  iconSize3: addValue(FONTS.iconSize3, 1),
  iconSize4: addValue(FONTS.iconSize4, 1),

  chevronIconMarginTop: addValue(FONTS.chevronIconMarginTop, 5, 'px'),
  paginationEllipsisPositionTop: '50%',
  radioGroupInnerSize: '2.2rem',
  selectHeight: '70px',
  checkmarkMarginLeft: '1.3px',
  checkmarkHeight: addValue(FONTS.iconSize4, 1.5),
  checkmarkWidth: addValue(FONTS.iconSize4, 0.7),

  intermediateCheckmarkSize: addValue(FONTS.iconSize5, 1.7),
  intermediateCheckmarkMarginLeft: '0px',

  fontWeightBolder: FONTS.fontWeightBolder,
  fontWeightBold: FONTS.fontWeightBold,
  fontWeightRegular: FONTS.fontWeightRegular,
  fontWeightLight: FONTS.fontWeightLight,
  fontWeightExtraLight: FONTS.fontWeightExtraLight,

  lineHeight1: addValue(FONTS.lineHeight1, 1),
  lineHeight2: addValue(FONTS.lineHeight2, 1),
  lineHeight3: addValue(FONTS.lineHeight3, 1),
  lineHeight4: addValue(FONTS.lineHeight4, 1),
  lineHeight5: addValue(FONTS.lineHeight5, 1),
  lineHeight6: addValue(FONTS.lineHeight6, 1),
  lineHeight7: addValue(FONTS.lineHeight7, 1),
  lineHeight8: addValue(FONTS.lineHeight8, 1),
  lineHeight9: addValue(FONTS.lineHeight9, 1),
  lineHeight10: addValue(FONTS.lineHeight10, 1),
  lineHeight11: addValue(FONTS.lineHeight11, 1.6),
  projectModalWith: addValue('410px', 0, 'px'),
  checkboxSize: addValue(FONTS.checkboxSize, 0.5, 'rem'),
  textVisible: 'none',
};
