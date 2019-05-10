import React from 'react';
import { Router, Route, Switch } from 'dva/router';

import Header from './components/Header';
import Log from './routes/Log';
import Doc from './routes/Doc';
import Deploy from './routes/Deploy';
import Setting from './routes/Setting';
import Auth from './routes/Auth';

import styles from './index.css';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <div>
        <Header></Header>
        <div className={styles.mainContent}>
          <Switch>
            <Route path="/" exact component={Log} />
            <Route path="/log" component={Log} />
            <Route path="/docs" component={Doc} />
            <Route path="/deploy" component={Deploy} />
            <Route path="/settings" component={Setting} />
            <Route path="/login" component={Auth} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default RouterConfig;
