/********************************************************************************
 * Copyright (C) 2020 yewei All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { PluginPage, AbstractFrontend } from '@cloudide/core/lib/browser/plugin-api';
import { LogLevel } from '@cloudide/core/lib/common/plugin-common';
import { exposable, expose } from '@cloudide/messaging';

@exposable
class MyDynamicWebviewPageAPI extends AbstractFrontend {

    /**
     * function call to the frontend will wait until init() to be resolved
     */
    async init(): Promise<void> {

    }

    run(): void {
        document.getElementById('call-myApi-exposed-on-plugin-mian-page')?.addEventListener('click', evt => {
            //call function exposed on plugin main page
            this.plugin.call('my-plugin-main-page::myplugin.page.myApi', 'param of call from dynamic webvew');
        });
    }

    stop(): void {

    }

    @expose('myplugin.dynamic.page.print')
    public print(message: string) {
        const messageDom = document.createElement('div');
        messageDom.append(document.createTextNode(`print called, param: ${message}`));
        document.body.appendChild(messageDom);
    }

}

document.addEventListener('DOMContentLoaded', async function() {
    PluginPage.create([MyDynamicWebviewPageAPI]);
});
