import React from 'react';
import BackgroundImage from './BackgroundImage';

const withBackgroundImage = (WrappedComponent) => {
    return props => (
        <BackgroundImage ><WrappedComponent {...props} /></BackgroundImage>
    )
};

export default withBackgroundImage;