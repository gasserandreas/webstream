import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";

const Notfound: FunctionComponent<RouteComponentProps> = (props) => {
  const { location } = props;
  return (
    <div>
      <strong>Whooops</strong> it seems there is no page for route:
      <code>{location.pathname}</code>
    </div>
  );
};

export default Notfound;
