import * as React from 'react';



export const ActionLink = ({ onClick, ...rest }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {

        e.preventDefault();

        e.currentTarget.blur();

        if (onClick) {
            onClick(e);
        }
    }, [onClick]);

    return <a href="#" {...rest} onClick={handleClick} />;
}