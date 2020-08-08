import React from 'react';

const Message = props => {
    const { header, color = 'dark' } = props;
    
    return (
        <article className={`message is-${color}`} >
            {
                header &&
                <div className="message-header">
                    <p>{header}</p>
                    <button className="delete" ariaLabel="delete"></button>
                </div>
            }
            <div className="message-body">
                {props.content}
            </div>
        </article>
    )
};

export default Message;