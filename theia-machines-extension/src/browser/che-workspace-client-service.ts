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
import WorkspaceClient, {IRemoteAPI, IBackend} from '@eclipse-che/workspace-client';
import { EnvVariablesServer, EnvVariable } from '@theia/core/lib/common/env-variables';
import { Deferred } from '@theia/core/lib/common/promise-util';

@injectable()
export class CheWorkspaceClientService {

    private waitCheApi = new Deferred<string>();
    private _backend: IBackend;

    constructor(@inject(EnvVariablesServer) protected readonly baseEnvVariablesServer: EnvVariablesServer) {
        this.baseEnvVariablesServer.getValue('CHE_API_EXTERNAL').then((cheApiEnv: EnvVariable | undefined) => {
            if (cheApiEnv && cheApiEnv.value) {
                this.waitCheApi.resolve(cheApiEnv.value);
            } else {
                this.waitCheApi.reject('Failed to get Eclipse CHE api endPoint');
            }
        });
        this._backend = WorkspaceClient.getRestBackend();
    }

    async restClient(): Promise<IRemoteAPI> {
        const cheApi = await this.waitCheApi.promise;

        return WorkspaceClient.getRestApi({
            baseUrl: cheApi
            });
    }

    get backend(): IBackend {
        return this._backend;
    }
}
