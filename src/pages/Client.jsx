import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    return (
        <div>
            <span className="text-white">{username}</span>
        </div>
    );
};

export default Client;