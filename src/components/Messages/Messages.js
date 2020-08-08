import React from 'react';
import Message from './Message';
import styles from './Messages.module.css';

const Messages = props => {
    const { items } = props;

    const messages = items.map(item => {
        return <Message key={item.id} {...item} />
    });

    return (
        <div className={styles.messages}>
            {messages}
        </div>
    )
};

export default Messages;