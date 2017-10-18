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


import java.util.List;

/**
 * Data Holder to hold required details of Output Streams in {@link SiddhiTopology}
 */
public class OutputStreamDataHolder {
    private String streamName;
    private String streamDefinition;
    private String streamType;
    private List<PublishingStrategyDataHolder> publishingStrategyList;
    private boolean isUserGiven;

    public String getStreamDefinition() {
        return streamDefinition;
    }

    public void setStreamDefinition(String streamDefinition) {
        this.streamDefinition = streamDefinition;
    }

    public String getStreamType() {
        return streamType;
    }

    public void setStreamType(String streamType) {
        this.streamType = streamType;
    }

    public OutputStreamDataHolder(String streamName,
                                  List<PublishingStrategyDataHolder> publishingStrategyList, boolean isUserGiven) {
        this.streamName = streamName;
        this.publishingStrategyList = publishingStrategyList;
        this.isUserGiven = isUserGiven;
    }

    public String getStreamName() {
        return streamName;
    }

    public List<PublishingStrategyDataHolder> getPublishingStrategyList() {
        return publishingStrategyList;
    }

    public boolean isUserGiven() {
        return isUserGiven;
    }
}


