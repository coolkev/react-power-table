import * as React from 'react';

/**
  * @internal
  */
export interface BackLinkProps {
    onClick: () => void;
}

/**
  * @internal
  */
export const BackLink = (props: BackLinkProps) => {
    return <div style={{ marginBottom: 10 }}><a href="#" onClick={e => {
        e.preventDefault();
        props.onClick()
    }}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Back</a>
    </div>;
}


