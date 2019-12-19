import * as React from 'react';
import { ActionLink } from './ActionLink';

export interface BackLinkProps {
    onClick: () => void;
}

export const BackLink = (props: BackLinkProps) => {
    return <div className="back-link" style={{ marginBottom: 10 }}><ActionLink onClick={props.onClick}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />Back</ActionLink></div>;
};
