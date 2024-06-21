import React from 'react';
import { FormattedMessage } from 'react-intl';

interface CustomToolbarProps {
  enableImages?: boolean;
  enableLinks?: boolean;
  enableSubscript?: boolean;
  enableStrikethrough?: boolean;
  enableTextAlign?: boolean;
  enableTextColor?: boolean;
  enableBulletList?: boolean;
  enableNumberList?: boolean;
  enableHeadingSize?: boolean;
  toolbarKey?: string;
}

export const CustomToolbar = ({
  enableImages,
  enableLinks,
  enableSubscript,
  enableStrikethrough,
  enableTextAlign,
  enableTextColor,
  enableBulletList,
  enableNumberList,
  enableHeadingSize,
  toolbarKey,
}: CustomToolbarProps) => {
  return (
    <div id={`toolbar_${toolbarKey}`} key={toolbarKey}>
      <span className="ql-formats">
        {enableHeadingSize && (
          <div data-tip="Heading" data-for="header">
            <select className="ql-header">
              <option value="1">
                <FormattedMessage id="quill.toolbar.title" />
              </option>
              <option value="2">
                <FormattedMessage id="quill.toolbar.title2" />
              </option>
              <option value="3">
                <FormattedMessage id="quill.toolbar.title3" />
              </option>
              <option value="4">
                <FormattedMessage id="quill.toolbar.title4" />
              </option>
              <option value="5">
                <FormattedMessage id="quill.toolbar.title5" />
              </option>
              <option value="6">
                <FormattedMessage id="quill.toolbar.title6" />
              </option>
              <option selected />
            </select>
          </div>
        )}
        <button className="ql-bold" data-tip="Bold" data-for="bold" />
        <button className="ql-italic" data-tip="Italic" data-for="italic" />
        <button className="ql-underline" data-tip="Underline" data-for="underline" />
        {enableStrikethrough && <button className="ql-strike" />}
        {enableLinks && <button className="ql-link" data-tip="Link" data-for="link" />}
        {enableSubscript && <button className="ql-script" value="super" data-tip="Subscript" data-for="super" />}
        {enableImages && <button className="ql-image" data-tip="Image" data-for="image" />}
        {enableTextAlign && <select className="ql-align" data-tip="Align" data-for="align" />}
        {enableTextColor && <select className="ql-color" data-tip="Font Color" data-for="color" />}
        {enableBulletList && <button className="ql-list" value="bullet" data-tip="Bullets" data-for="bullet" />}
        {enableNumberList && <button className="ql-list" value="ordered" data-tip="Numbering" data-for="ordered" />}
      </span>
      {/*<span className="ql-formats">*/}
      {/*  <button className="ql-link" data-tip="Link" data-for="link" />*/}
      {/*  {enableImages && <button className="ql-image" data-tip="Image" data-for="image" />}*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <select className="ql-align" data-tip="Align" data-for="align" />*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <button className="ql-indent" value="-1" data-tip="Indent" data-for="indent" />*/}
      {/*  <button className="ql-indent" value="+1" data-tip="Outdent" data-for="ordered" />*/}
      {/*  <button className="ql-list" value="ordered" data-tip="Numbering" data-for="ordered" />*/}
      {/*  <button className="ql-list" value="bullet" data-tip="Bullets" data-for="bullet" />*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <button className="ql-script" value="super" data-tip="Subscript" data-for="super" />*/}
      {/*  <button className="ql-script" value="sub" data-tip="Superscript" data-for="sub" />*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <div data-tip="Heading" data-for="header">*/}
      {/*    <select className="ql-header">*/}
      {/*      <option value="1">Heading</option>*/}
      {/*      <option value="2">Heading 2</option>*/}
      {/*      <option value="3">Heading 3</option>*/}
      {/*      <option value="4">Heading 4</option>*/}
      {/*      <option value="5">Heading 5</option>*/}
      {/*      <option value="6">Heading 6</option>*/}
      {/*      <option selected />*/}
      {/*    </select>*/}
      {/*  </div>*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <select className="ql-color" data-tip="Font Color" data-for="color" />*/}
      {/*  <select className="ql-background" data-tip="Text highlight color" data-for="background" />*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <div data-tip="Font" data-for="font">*/}
      {/*    <select className="ql-font" defaultValue="sans-serif">*/}
      {/*      <option value="sans-serif">Sans Serif</option>*/}
      {/*      <option value="serif">Serif</option>*/}
      {/*      <option value="monospace">Monospace</option>*/}
      {/*    </select>*/}
      {/*  </div>*/}
      {/*</span>*/}
      {/*<span className="ql-formats">*/}
      {/*  <button className="ql-clean" />*/}
      {/*</span>*/}
    </div>
  );
};
