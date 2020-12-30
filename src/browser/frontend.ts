/********************************************************************************
 * Copyright (C) 2020 yewei All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { LogLevel, WebviewOptions } from '@cloudide/core/lib/common/plugin-common';
import { PluginPage, AbstractFrontend } from '@cloudide/core/lib/browser/plugin-api';
import { exposable, expose } from '@cloudide/messaging';

/**
 * Adding your fronted api in this class
 * Using '@expose' to expose your function to backend
 */
@exposable
class Frontend extends AbstractFrontend {

    /**
     * function call to the frontend will wait until init() to be resolved
     */
    async init(): Promise<void> {

    }

    /**
     * Entry of your plugin frontend
     * In this function your can call function exposed by backend
     */
    run(): void {
        const myViewOptions: WebviewOptions = {
            viewType: 'my-webview',
            title: '%plugin.dynamicview.title%',
            targetArea: 'main',
            iconPath: 'resources/icons/plugin.svg',
            viewUrl: 'local:resources/page/dynamic-webview.ejs',
            preserveFocus: true,
            templateEngine: 'ejs'
        };
        this.plugin.createDynamicWebview(myViewOptions, true);

        document.getElementById('call-print-on-dynamic-webview')?.addEventListener('click', evt => {
            //call function exposed on dynamic webview
            this.plugin.call('my-webview::myplugin.dynamic.page.print', 'param of function call from plugin main page');
        });

        document.getElementById('call-createNewFile-on-backend')?.addEventListener('click', evt => {
            //call function exposed on backend
            this.plugin.call('backend::createNewFile', 'untitled.txt').then((filePath) => {
                this.plugin.call('cloudide.window.showInformationMessage', `${filePath} created.`);
            });
        });

    }

    stop(): void {

    }

    /**
     * this function can be called from plugin backend as below:
     * @example
     * ```
     * plugin.call('myplugin.page.myApi', 'this is a function call from backend').then(ret => {
     *     console.log(ret);
     * });
     * 
     * ```
     */
    @expose('myplugin.page.myApi')
    public myApi(message: string) {
        const messageDom = document.createElement('div');
        messageDom.append(document.createTextNode(`myApi called, param: ${message}`));
        document.body.appendChild(messageDom);
    }

}

document.addEventListener('DOMContentLoaded', function() {
    PluginPage.create([Frontend]);
});
