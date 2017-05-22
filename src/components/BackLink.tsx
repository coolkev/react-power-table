import * as React from 'react';

/**
 * @internal
 */
export interface BackLinkProps {
    onClick: React.EventHandler<React.SyntheticEvent<HTMLAnchorElement>>;
}

/**
 * @internal
 */
export const BackLink = (props: BackLinkProps) => {
    return <div style={{ marginBottom: 10 }}><a href="#" onClick={props.onClick}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"/>Back</a></div>;
};
