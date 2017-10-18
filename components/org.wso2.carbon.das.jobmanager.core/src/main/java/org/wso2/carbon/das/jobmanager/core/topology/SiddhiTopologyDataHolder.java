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

package org.wso2.carbon.das.jobmanager.core.topology;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Map;

public class SiddhiTopologyDataHolder {

    private String SiddhiAppName;
    private String userDefinedSiddhiApp;
    private Map<String, String> inmemoryMap;
    private Map<String, LinkedList<String>> partitionTypeMap;
    private Map<String,SiddhiQueryGroup> siddhiQueryGroupMap;

    public SiddhiTopologyDataHolder(String siddhiAppName) {
        SiddhiAppName = siddhiAppName;
        siddhiQueryGroupMap= new LinkedHashMap<>();
        partitionTypeMap = new HashMap<>();
        inmemoryMap= new HashMap<>();
    }

    public Map<String, String> getInmemoryMap() {
        return inmemoryMap;
    }

    public String getSiddhiAppName() {
        return SiddhiAppName;
    }

    public void setSiddhiAppName(String siddhiAppName) {
        SiddhiAppName = siddhiAppName;
    }

    public String getUserDefinedSiddhiApp() {
        return userDefinedSiddhiApp;
    }

    public void setUserDefinedSiddhiApp(String userDefinedSiddhiApp) {
        this.userDefinedSiddhiApp = userDefinedSiddhiApp;
    }

    public Map<String, SiddhiQueryGroup> getSiddhiQueryGroupMap() {
        return siddhiQueryGroupMap;
    }

    public Map<String, LinkedList<String>> getPartitionTypeMap() {
        return partitionTypeMap;
    }

    public void setPartitionTypeMap(Map<String, LinkedList<String>> partitionTypeMap) {
        this.partitionTypeMap = partitionTypeMap;
    }

    public void addSiddhiQueryGroup(String execGroup, SiddhiQueryGroup siddhiQueryGroup){
        siddhiQueryGroupMap.put(execGroup,siddhiQueryGroup);

    }
}
