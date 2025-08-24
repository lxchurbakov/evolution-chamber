import { Base } from 'lib/atoms';
import React from 'react';

export const Canvas = ({ render, ...props }) => {
    const canvasRef = React.useRef(null as HTMLCanvasElement | null);

    React.useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            throw new Error('cannot retrieve canvas element');
        }

        const { width, height } = canvas.getBoundingClientRect();
        const pixelDensity = window.devicePixelRatio || 1.0;

        canvas.width = width * pixelDensity;
        canvas.height = height * pixelDensity;;

        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('cannot retrieve context');
        }

        context.scale(pixelDensity, pixelDensity);

        let handler = null as number | null;

        const r = () => {
            context.clearRect(0, 0, width, height);
            render(context, { width, height });

            handler = requestAnimationFrame(r);
        };

        handler = requestAnimationFrame(r);

        return () => {
            if (handler) {
                cancelAnimationFrame(handler);
            }
        };        
    }, []); 

    return (
        <Base w="100%" {...props}>
            <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />
        </Base>
    ); 
};
