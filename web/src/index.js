import dva from 'dva';

import router from './router';

import log from './models/log';
import deploy from './models/deploy';
import doc from './models/doc';
import auth from './models/auth';
import user from './models/user';
import project from './models/project';

import './index.css';
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
app.model(log);
app.model(deploy);
app.model(doc);
app.model(auth);
app.model(user);
app.model(project);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
