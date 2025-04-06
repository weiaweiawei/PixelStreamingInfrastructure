// Copyright Epic Games, Inc. All Rights Reserved.

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
    Config,
    AllSettings,
    PixelStreaming
} from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.4';

export interface PixelStreamingWrapperProps {
    initialSettings?: Partial<AllSettings>;
}

// 为组件定义可以通过ref访问的方法接口
export interface PixelStreamingWrapperRef {
    emitUIInteraction: (data: any) => void;
    getPixelStreaming: () => PixelStreaming | undefined;
}

export const PixelStreamingWrapper = forwardRef<PixelStreamingWrapperRef, PixelStreamingWrapperProps>(({
    initialSettings
}, ref) => {
    // A reference to parent div element that the Pixel Streaming library attaches into:
    const videoParent = useRef<HTMLDivElement>(null);

    // Pixel streaming library instance is stored into this state variable after initialization:
    const [pixelStreaming, setPixelStreaming] = useState<PixelStreaming>();
    
    // A boolean state variable that determines if the Click to play overlay is shown:
    const [clickToPlayVisible, setClickToPlayVisible] = useState(false);

    // 将组件内部的方法暴露给ref
    useImperativeHandle(ref, () => ({
        emitUIInteraction: (data) => {
            if (pixelStreaming) {
                console.log('向UE发送消息', data);
                console.log('pixelStreaming', pixelStreaming.emitUIInteraction);
                pixelStreaming.emitUIInteraction(data);
            }
        },
        getPixelStreaming: () => pixelStreaming
    }), [pixelStreaming]);

    // Run on component mount:
    useEffect(() => {
        if (videoParent.current) {
            // Attach Pixel Streaming library to videoParent element:
            const config = new Config({ initialSettings });
            const streaming = new PixelStreaming(config, {
                videoElementParent: videoParent.current
            });
            
            // register a playStreamRejected handler to show Click to play overlay if needed:
            streaming.addEventListener('playStreamRejected', () => {
                setClickToPlayVisible(true);
            });

            // Save the library instance into component state so that it can be accessed later:
            setPixelStreaming(streaming);

            // Clean up on component unmount:
            return () => {
                try {
                    streaming.disconnect();
                } catch {}
            };
        }
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%'
                }}
                ref={videoParent}
            />
            {clickToPlayVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        pixelStreaming?.play();
                        setClickToPlayVisible(false);
                    }}
                >
                    <div>Click to play</div>
                </div>
            )}
        </div>
    );
});