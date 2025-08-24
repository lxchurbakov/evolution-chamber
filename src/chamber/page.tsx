import React from 'react';
import { Container, Text } from 'lib/atoms';
import { Canvas } from './canvas';

import { Entry } from './plugins/entry';

const entry = new Entry();

export const ChamberPage = () => {
    const render = React.useCallback((context: CanvasRenderingContext2D, width, height) => {
        context.beginPath();
        context.rect(0, 0, width, height);
        context.fillStyle = '#2d2c2e';
        context.fill();

        entry.render(context, width, height);

        // context.beginPath();
        // context.rect(10, 10, 100, 100);
        // context.fillStyle = '#ffffff';
        // context.fill();
    }, []);

    return (
        // <Container pt="128px">
        //     <Text size="32px" weight="800" mb="24px">Chamber Page</Text>

            <Canvas render={render} h="100vh" w="100vw" />
        // </Container>
    );
};
