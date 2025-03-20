import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../utils/Actions'
import Client from './Client';
import Editor from './Editor';
import { initSocket } from './socket';
// import CTAButton from "../components/Common/";
import CTAButton from '../components/core/HomePage/Button';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
    
            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
    
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
    
            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        // console.log(`${username} joined`);
                    }
                    setClients(clients);
                    if (codeRef.current) {
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                }
            );
    
            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef?.current?.disconnect();
            socketRef?.current?.off(ACTIONS.JOINED);
            socketRef?.current?.off(ACTIONS.DISCONNECTED);
        };
    }, []);    

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        // <div className="flex w-100vw h-100vh">
        
        //     <div className="flex flex-col w-3/12 max-h-max items-space-between">
        //         <div >
        //             <h3 className='text-white'>Connected</h3>
        //             <div className="clientsList flex gap-3">
        //                 {clients.map((client) => (
        //                     <Client
        //                         key={client.socketId}
        //                         username={client.username}
        //                     />
        //                 ))}
        //             </div>
        //         </div>
        //         <div className='flex gap-2'>
        //             <button className="text-brown-5" onClick={copyRoomId}>
        //                 Copy ROOM ID
        //             </button>
        //             <br></br>
        //             <button className="text-brown-5" onClick={leaveRoom}>
        //                 Leave
        //             </button>
        //         </div>
        //     </div>
        //     <div className="w-11/12">
        //         <Editor
        //             socketRef={socketRef}
        //             roomId={roomId}
        //             onCodeChange={(code) => {
        //                 codeRef.current = code;
        //             }}
        //         />
        //     </div>
        // </div>
        <div className="flex w-full h-screen bg-gray-800">

  {/* Left Sidebar (Clients List and Buttons) */}
  <div className="flex flex-col w-3/12 max-h-full bg-gray-900 text-white p-4 space-y-6">
    <div>
      <h3 className="text-xl font-semibold">Connected</h3>
      <div className="clientsList flex flex-col gap-3">
        {clients.map((client) => (
          <Client
            key={client.socketId}
            username={client.username}
          />
        ))}
      </div>
    </div>

    {/* Buttons for Copying Room ID and Leaving */}
    <div className="flex flex-col gap-4 mt-auto">
        <CTAButton onClick={copyRoomId} active={true} >
            Copy ROOM ID
        </CTAButton>
        <CTAButton onClick={leaveRoom} active={true} >
            Leave
        </CTAButton>
    </div>
  </div>

  {/* Right Content (Editor) */}
  <div className="w-9/12 p-4 overflow-auto bg-gray-800">
    <Editor
      socketRef={socketRef}
      roomId={roomId}
      onCodeChange={(code) => {
        codeRef.current = code;
      }}
    />
  </div>
</div>

    );
};

export default EditorPage;