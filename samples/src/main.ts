// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

import 'reflect-metadata';

import { bootstrapModule } from 'hubot-framework';
import { AppModule } from './app/app.module';

// Required only for the root module
export = bootstrapModule(AppModule);
