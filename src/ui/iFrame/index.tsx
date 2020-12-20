import React from 'react';

interface iFramePropBase {
  link: string;
  width?: number;
  height?: number;
}

export type iFrameProps = iFramePropBase;

function generateIFrame(src: string, attrs: ObjectMap<string | number>): string {
  const newAttributes = {
    ...attrs,
    src,
  };

  const attrString = Object.entries(newAttributes)
    .map(([key, value]) => {
      let valueString = value;
      if (typeof value !== 'string') {
        valueString = `"${value}"`;
      }
      return `${key}=${valueString}`;
    })
    .join(' ');
  
  return `<iframe ${attrString}><iframe>`;
}

export default function iFrame(props: iFrameProps) {
  const { link, width, height } = props;

  if (!width || !height) {
    return null;
  }

  const iFrameHTML = generateIFrame(
    link,
    {
      width,
      height,
    }
  );

  const iframe = () => {
    return {
      __html: iFrameHTML,
    };
  }

  return (
    <div dangerouslySetInnerHTML={iframe()} />
  );
}