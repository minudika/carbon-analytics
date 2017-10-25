/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.das.jobmanager.core.model;

import java.io.Serializable;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ResourceMapping implements Serializable {
    private static final long serialVersionUID = -8833806835587236260L;
    private Map<String, Heartbeat> heartbeatMap;
    private String groupId;

    public ResourceMapping(String groupId) {
        this.groupId = groupId;
        this.heartbeatMap = new ConcurrentHashMap<>();
    }

    public Map<String, Heartbeat> getHeartbeatMap() {
        return heartbeatMap;
    }

    public void setHeartbeatMap(Map<String, Heartbeat> heartbeatMap) {
        this.heartbeatMap = heartbeatMap;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }
}
