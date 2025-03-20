import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/dashboard/CodeSync/editor/${roomId}`, {
            state: {
                username,
                roomId
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden">
    <div className="flex flex-col justify-center items-center">
        <h4 className="text-white mb-4">Paste invitation ROOM ID</h4>
        <div className="flex flex-col space-y-4">
            <input
                type="text"
                className="inputBox px-4 py-2 rounded-md border border-gray-300"
                placeholder="ROOM ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
            />
            <input
                type="text"
                className="inputBox px-4 py-2 rounded-md border border-gray-300"
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyUp={handleInputEnter}
            />
            <button
                className="text-white bg-blue-500 py-2 px-6 rounded-md hover:bg-blue-600"
                onClick={()=>{
                    joinRoom();
                }}
            >
                Join
            </button>
            <span className="text-white">
                If you don't have an invite then create &nbsp;
                <a
                    onClick={createNewRoom}
                    href=""
                    className="createNewBtn text-blue-400 hover:text-blue-500"
                >
                    New Room
                </a>
            </span>
        </div>
    </div>
</div>

    );
};

export default Home;