// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

// This is required for using decorators.
// read more on injection-js docs.
import 'reflect-metadata';

import { bootstrapModule } from 'hubot-framework';
import { AppModule } from './app/app.module';

// Required only for the root module
export = bootstrapModule(AppModule);
