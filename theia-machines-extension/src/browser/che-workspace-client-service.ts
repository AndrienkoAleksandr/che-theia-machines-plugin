/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import {inject, injectable} from 'inversify';
import {IBaseEnvVariablesServer} from '../common/base-env-variables-protocol';
import WorkspaceClient, {IRemoteAPI, IBackend} from '@eclipse-che/workspace-client';

@injectable()
export class CheWorkspaceClientService {

    private cheApiPromise: Promise<string>;
    private _backend: IBackend;

    constructor(@inject(IBaseEnvVariablesServer) protected readonly baseEnvVariablesServer: IBaseEnvVariablesServer) {
        this.cheApiPromise = this.baseEnvVariablesServer.getEnvValueByKey('CHE_API_EXTERNAL');
        this._backend = WorkspaceClient.getRestBackend();
    }

    get restClient(): Promise<IRemoteAPI> {
        return new Promise<IRemoteAPI>((resolve, reject) => {
            this.cheApiPromise.then(cheApi => {
                const remoteApi = WorkspaceClient.getRestApi({
                    baseUrl: cheApi
                });
                resolve(remoteApi);
            }).catch(err => {
                reject("Unable to get CHE api endPoint.");
            });
        })
    }

    get backend(): IBackend {
        return this._backend;
    }
}
