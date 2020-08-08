import React, { useState } from 'react';
import MessagesContext from './context';
import Messages from './Messages';

const withMessagesProvider = Component => {
    return props => {
        const [messages, setMessages] = useState([]);

        const pushMessage = message => {
            message = {
                ...message,
                id: `f${(~~(Math.random()*1e8)).toString(16)}`
            }
            setMessages([...messages, message]);
        };
        const delMessage = id => {
            const newMessages = messages.filter(item => item.id !== id);
            setMessages(newMessages);
        }


        return (
            <MessagesContext.Provider value={{ pushMessage, delMessage }}>
                <Messages items={messages} />
                <Component  {...props} />
            </MessagesContext.Provider>
        );
    }
};

export default withMessagesProvider;