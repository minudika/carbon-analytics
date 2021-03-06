/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.carbon.analytics.auth.rest.api;

import io.swagger.annotations.ApiParam;
import org.osgi.service.component.annotations.Component;
import org.wso2.carbon.analytics.auth.rest.api.dto.UserDTO;
import org.wso2.carbon.analytics.auth.rest.api.factories.LoginApiServiceFactory;
import org.wso2.msf4j.Microservice;
import org.wso2.msf4j.Request;
import org.wso2.msf4j.formparam.FormDataParam;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 * Login API class.
 */
@Component(
        name = "LoginApi",
        service = Microservice.class,
        immediate = true
)
@Path("/login")
@Consumes({"application/json"})
@Produces({"application/json"})
@ApplicationPath("/login")
@io.swagger.annotations.Api(description = "the login API")
public class LoginApi implements Microservice {
    private final LoginApiService delegate = LoginApiServiceFactory.getLoginApi();

    @POST
    @Path("/{appName:(.*)}")
    @Consumes({"application/x-www-form-urlencoded", "multipart/form-data"})
    @Produces({"application/json"})
    @io.swagger.annotations.ApiOperation(value = "", notes = "Login Request to Stream Processor.",
            response = UserDTO.class, tags = {})
    @io.swagger.annotations.ApiResponses(value = {
            @io.swagger.annotations.ApiResponse(code = 200, message = "Authorization Request Successful.",
                    response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 302, message = "Redirection for OAuth2 authorization " +
                    "grant type.", response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 401, message = "Invalid Authorization Header",
                    response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 500, message = "An unexpected error occurred.",
                    response = UserDTO.class)})
    public Response loginAppNamePost(
            @ApiParam(value = "AppName", required = true) @PathParam("appName") String appName
            , @ApiParam(value = "") @FormDataParam("username") String username
            , @ApiParam(value = "") @FormDataParam("password") String password
            , @ApiParam(value = "") @FormDataParam("grantType") String grantType
            , @ApiParam(value = "", defaultValue = "false") @FormDataParam("rememberMe") Boolean rememberMe
            , @ApiParam(value = "") @FormDataParam("appId") String appId
            , @Context Request request)
            throws NotFoundException {
        return delegate.loginAppNamePost(appName, username, password, grantType, rememberMe, appId, request);
    }

    @GET
    @Path("/callback/{appName:(.*)}")
    @Consumes({"application/json"})
    @Produces({"application/json"})
    @io.swagger.annotations.ApiOperation(value = "", notes = "Login Request callback for Authorization Code grant " +
            "type.",
            response = UserDTO.class, tags = {})
    @io.swagger.annotations.ApiResponses(value = {
            @io.swagger.annotations.ApiResponse(code = 200, message = "Authorization Request Successful.",
                    response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 401, message = "Invalid Authorization Header",
                    response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 500, message = "An unexpected error occurred.",
                    response = UserDTO.class)})
    public Response loginCallbackAppNameGet(@ApiParam(value = "AppName", required = true)
                                            @PathParam("appName") String appName,
                                            @QueryParam("code") String authorizationCode, @Context Request request)
            throws NotFoundException {
        Response response = delegate.loginCallbackAppNameGet(appName, authorizationCode, request);
        return response;
    }

    @GET
    @Path("/auth-type")
    @io.swagger.annotations.ApiOperation(value = "", notes = "Login type check Request to Stream Processor.",
            response = UserDTO.class, tags = {})
    @io.swagger.annotations.ApiResponses(value = {
            @io.swagger.annotations.ApiResponse(code = 200, message = "Type Check Request Successful.",
                    response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 401, message = "Invalid Authorization Header",
                    response = UserDTO.class),

            @io.swagger.annotations.ApiResponse(code = 500, message = "An unexpected error occurred.",
                    response = UserDTO.class)})
    public Response getAuthType() {
        return delegate.getAuthType();
    }
}
