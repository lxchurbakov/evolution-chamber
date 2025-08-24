import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route } from "react-router-dom";

import * as theme from 'lib/theme';
import { ChamberPage } from './chamber/page';

export default () => {
    return (
        <>
            <Helmet>
                {theme.helmet}
                <title>Evolution Chamber</title>
                <style>{'body { margin: 0; background: #ffffff; padding: 0 }'}</style>
            </Helmet>
       
            <Routes>
                {/* <Route path='/' element={<Readme />} />

                <Route path='/examples/s3' element={<S3Page />} />
                <Route path='/examples/postgres' element={<PostgresPage />} />
                <Route path='/examples/redis' element={<RedisPage />} /> */}
                
                <Route path='*' element={<ChamberPage />} />
            </Routes>
        </>
    );
};