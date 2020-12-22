import React, { FunctionComponent } from "react";

interface IFramePropBase {
  link: string;
  width?: number;
  height?: number;
}

export type IFrameProps = IFramePropBase;

function generateIFrame(
  src: string,
  attrs: ObjectMap<string | number>
): string {
  const newAttributes = {
    ...attrs,
    src,
  };

  const attrString = Object.entries(newAttributes)
    .map(([key, value]) => {
      let valueString = value;
      if (typeof value !== "string") {
        valueString = `"${value}"`;
      }
      return `${key}=${valueString}`;
    })
    .join(" ");

  return `<iframe ${attrString}><iframe>`;
}

const iFrame: FunctionComponent<IFrameProps> = (props) => {
  const { link, width, height } = props;

  if (!width || !height) {
    return null;
  }

  const iFrameHTML = generateIFrame(link, {
    width,
    height,
  });

  const iframe = () => ({
    __html: iFrameHTML,
  });

  return <div dangerouslySetInnerHTML={iframe()} />; // eslint-disable-line react/no-danger
};

export default iFrame;
