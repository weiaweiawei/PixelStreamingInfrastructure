// Copyright Epic Games, Inc. All Rights Reserved.

import React, { useRef, useState } from 'react';
import { PixelStreamingWrapper } from './PixelStreamingWrapper';

export const App = () => {
    const [message, setMessage] = useState('');
    const pixelStreamingRef = useRef(null);

    const sendMessageToUE = () => {
        // if (pixelStreamingRef.current && message) {
        //     // Access the emitUIInteraction method from the pixel streaming instance
        //     pixelStreamingRef.current.emitUIInteraction({
        //         action: 'CustomMessage',
        //         payload: message
        //     });
        //     console.log('Message sent to UE:', message);
        //     setMessage(''); // Clear input after sending
        // }
        
        pixelStreamingRef.current.emitUIInteraction({
            action: 'CustomMessage',
            payload: message
        });
        console.log('Message sent to UE:', message);
        setMessage(''); // Clear input after sending
    };

    return (
        <div
            style={{
                height: '100%',
                width: '100%'
            }}
        >
            <PixelStreamingWrapper
                ref={pixelStreamingRef}
                initialSettings={{
                    AutoPlayVideo: true,
                    AutoConnect: true,
                    ss: 'ws://localhost:80',
                    StartVideoMuted: true,
                    HoveringMouse: true,
                    WaitForStreamer: true
                }}
            />
            <div style={{ position:'fixed',top: '10px',left: '0px', padding: '10px', backgroundColor: '#f0f0f0', borderTop: '1px solid #ccc' }}>
                <p>测试向UE发送消息</p>
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <input 
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="输入消息内容"
                        style={{ flex: 1, padding: '8px', marginRight: '10px' }}
                    />
                    <button 
                        onClick={sendMessageToUE}
                        style={{  padding: '8px 16px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        发送消息
                    </button>
                </div>
            </div>
        </div>
    );
};
