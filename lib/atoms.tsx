import React from 'react';
import styled from 'styled-components';

import { font, colors } from './theme';

export type BaseProps = {
    p?: string;
    pt?: string;
    pl?: string;
    pr?: string;
    pb?: string;
    m?: string;
    mt?: string;
    mr?: string;
    mb?: string;
    ml?: string;
    w?: string;
    h?: string;
    mw?: string;
    mh?: string;
};

// const $Base = ({ children, className, ...props }) => (
//     <div className={className}>{children}</div>
// );

export const Base = styled.div<BaseProps>`
    padding: ${props => props.p};
    padding-top: ${props => props.pt};
    padding-right: ${props => props.pr};
    padding-left: ${props => props.pl};
    padding-bottom: ${props => props.pb};
    margin: ${props => props.m};
    margin-top: ${props => props.mt};
    margin-right: ${props => props.mr};
    margin-left: ${props => props.ml};
    margin-bottom: ${props => props.mb};
    width: ${props => props.w};
    height: ${props => props.h};
    max-width: ${props => props.mw};
    max-height: ${props => props.mh};

    box-sizing: border-box;
`;

export const Container = ({ children, ...props }: React.PropsWithChildren<BaseProps>) => {
    return (
        <Base w="100%" mw="1080px" m="0 auto" p="0 20px" {...props} style={{ minWidth: 780 }}>
            {children}
        </Base>
    );
};

export const Text = styled(Base) <{ align?: string, size?: string, weight?: string, color?: string, line?: string, family?: string }>`
    font-family: ${props => props.family ?? font.family};
    font-size: ${props => props.size || '18px'};
    font-weight: ${props => props.weight || 400};
    color: ${props => props.color || colors.text};
    line-height: ${props => props.line || '1.4'};
    text-align: ${props => props.align};
`;

export const Flex = styled(Base)<{
    dir?: 'row' | 'column';
    align?: 'center' | 'flex-start' | 'flex-end';
    justify?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
    isWrap?: boolean;
    gap?: string;
}>`
    display: flex;
    flex-direction: ${props => props.dir || 'row'};
    align-items: ${props => props.align || 'center'};
    justify-content: ${props => props.justify || 'center'};
    flex-wrap: ${props => props.isWrap ? 'wrap' : 'nowrap'};
    gap: ${props => props.gap || '0'};
`;

export const Card = styled(Base)<{ background?: string, border?: string, radius?: string, hideOverflow?: boolean, block?: boolean, shadow?: string }>`
    display: ${props => props.block ? 'block' : 'inline-block'};
    background: ${props => props.background || 'none'};
    border: ${props => props.border || 'none'};
    border-radius: ${props => props.radius || '0px'};
    overflow: ${props => props.hideOverflow ? 'hidden' : 'visible'};
    box-shadow: ${props => props.shadow || 'none'};
`;

export const Clickable = styled(Card)`
    cursor: pointer;
    user-select: none;

    &:active {
        transform: translateY(1px);
    }
`;

export const Disabled = styled(Base)<{ disabled?: boolean }>`
    opacity: ${props => props.disabled ? .5 : 1};
    pointer-events: ${props => props.disabled ? 'none' : 'all'};
`;

export const Relative = styled(Base)`
    position: relative;
`;

export const Absolute = styled(Base)<any>`
    position: absolute;
    top: ${props => props.top};
    left: ${props => props.left};
    right: ${props => props.right};
    bottom: ${props => props.bottom};
`;

export const Image = styled.img<BaseProps & { border?: string, radius?: string, hideOverflow?: boolean, shadow?: string}>`
    padding: ${props => props.p};
    padding-top: ${props => props.pt};
    padding-right: ${props => props.pr};
    padding-left: ${props => props.pl};
    padding-bottom: ${props => props.pb};
    margin: ${props => props.m};
    margin-top: ${props => props.mt};
    margin-right: ${props => props.mr};
    margin-left: ${props => props.ml};
    margin-bottom: ${props => props.mb};
    width: ${props => props.w};
    height: ${props => props.h};
    max-width: ${props => props.mw};
    max-height: ${props => props.mh};

    box-sizing: border-box;

    border: ${props => props.border || 'none'};
    border-radius: ${props => props.radius || '0px'};
    overflow: ${props => props.hideOverflow ? 'hidden' : 'visible'};
    box-shadow: ${props => props.shadow || 'none'};
`;
