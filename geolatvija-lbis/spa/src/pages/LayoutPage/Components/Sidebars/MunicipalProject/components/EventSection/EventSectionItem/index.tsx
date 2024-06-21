import React from 'react';
import { EventDataInterface } from '../../temporary-data';
import { Button, Card, Label } from 'ui';

interface Props {
  event: EventDataInterface;
  btnLabel?: string;
}
export const EventSectionItem = ({ event, btnLabel }: Props) => {
  const { image, title } = event;
  return (
    <Card className="event_item">
      <img src={image} alt="" />
      <div className="content_side">
        <Label title={true} bold={true} label={title} />
        <p>
          Lorem ipsum dolor sit amet consectetur. Cursus tellus fermentum egestas felis maecenas. Ut ipsum ut aenean
          faucibus pharetra est amet nibh. Libero duis a et auctor a malesuada adipiscing elementum. amet pellentesque
          nunc. Non phasellus pellentesque eget dui ac urna nisi orci.
        </p>
        <Button
          label={btnLabel}
          className="desc_btn"
          border={false}
        />
      </div>
    </Card>
  );
};
