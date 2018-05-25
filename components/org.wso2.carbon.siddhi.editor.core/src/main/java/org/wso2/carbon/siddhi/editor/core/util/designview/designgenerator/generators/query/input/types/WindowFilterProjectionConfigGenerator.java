/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.siddhi.editor.core.util.designview.designgenerator.generators.query.input.types;

import org.wso2.carbon.siddhi.editor.core.util.designview.beans.configs.siddhielements.query.input.QueryWindowConfig;
import org.wso2.carbon.siddhi.editor.core.util.designview.beans.configs.siddhielements.query.input.windowfilterprojection.WindowFilterProjectionConfig;
import org.wso2.carbon.siddhi.editor.core.util.designview.beans.configs.siddhielements.query.streamhandler.StreamHandlerConfig;
import org.wso2.carbon.siddhi.editor.core.util.designview.designgenerator.generators.query.streamhandler.StreamHandlerConfigGenerator;
import org.wso2.carbon.siddhi.editor.core.util.designview.utilities.ConfigBuildingUtilities;
import org.wso2.siddhi.query.api.execution.query.input.handler.Filter;
import org.wso2.siddhi.query.api.execution.query.input.handler.StreamHandler;
import org.wso2.siddhi.query.api.execution.query.input.handler.Window;
import org.wso2.siddhi.query.api.execution.query.input.stream.BasicSingleInputStream;
import org.wso2.siddhi.query.api.execution.query.input.stream.InputStream;
import org.wso2.siddhi.query.api.execution.query.input.stream.SingleInputStream;
import org.wso2.siddhi.query.api.expression.Expression;

import java.util.ArrayList;
import java.util.List;

/**
 * Generates WindowFilterProjectionConfig with given Siddhi elements
 */
public class WindowFilterProjectionConfigGenerator {
    private String siddhiAppString;

    public WindowFilterProjectionConfigGenerator(String siddhiAppString) {
        this.siddhiAppString = siddhiAppString;
    }

    /**
     * Generates a WindowFilterProjectionConfig object, from the given Siddhi Query InputStream object
     * @param queryInputStream      Siddhi Query InputStream object
     * @return                      WindowFilterProjectionConfig object
     */
    public WindowFilterProjectionConfig generateWindowFilterProjectionConfig(InputStream queryInputStream) {
        StreamHandlerConfigGenerator streamHandlerConfigGenerator = new StreamHandlerConfigGenerator(siddhiAppString);
        List<StreamHandlerConfig> streamHandlerConfigs = new ArrayList<>();
        for (StreamHandler streamHandler : ((SingleInputStream) queryInputStream).getStreamHandlers()) {
            streamHandlerConfigs.add(streamHandlerConfigGenerator.generateStreamHandlerConfig(streamHandler));
        }

        return new WindowFilterProjectionConfig(
                getType(queryInputStream).toString(),
                queryInputStream.getUniqueStreamIds().get(0),
                streamHandlerConfigs);
    }

    /**
     * Returns the type of WindowFilterProjection Config to generate, from the given Siddhi Query object
     * @param queryInputStream     Siddhi Query InputStream object
     * @return                     Type of WindowFilterProjection Query to generate
     */
    private WindowFilterProjectionQueryType getType(InputStream queryInputStream) {
        List<StreamHandler> streamHandlers = ((SingleInputStream) queryInputStream).getStreamHandlers();
        if (streamHandlers.isEmpty()) {
            return WindowFilterProjectionQueryType.PROJECTION;
        } else {
            for (StreamHandler streamHandler : streamHandlers) {
                if (streamHandler instanceof Window) {
                    return WindowFilterProjectionQueryType.WINDOW;
                }
            }
            return WindowFilterProjectionQueryType.FILTER;
        }
    }

    /**
     * Specific Type of the WindowFilterProjection Query
     */
    private enum WindowFilterProjectionQueryType {
        PROJECTION,
        FILTER,
        WINDOW
    }
}
