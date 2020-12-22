import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface NotFoundProps extends RouteComponentProps {}

export default function Notfound(props: NotFoundProps) {
  const { location } = props;
  return (
    <div>
      <strong>Whooops</strong> it seems there is no page for route:
      <code>{location.pathname}</code>
    </div>
  );
}
