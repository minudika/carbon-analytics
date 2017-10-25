/*
 *  Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// Material-UI
import TemplateGroupSelector from "../components/TemplateGroupSelector";
import BusinessRulesConstants from "./BusinessRulesConstants";
import RuleTemplateSelector from "../components/RuleTemplateSelector";
import BusinessRuleEditor from "../components/BusinessRuleEditor";
import BusinessRuleFromScratchCreator from "../components/BusinessRuleFromScratchCreator";
import {Typography} from "material-ui";
import { CircularProgress } from 'material-ui/Progress';
import BusinessRuleCreator from "../components/BusinessRuleCreator";
import BusinessRulesAPICaller from "./BusinessRulesAPICaller";
import BusinessRuleFromTemplateForm from "../components/BusinessRuleFromTemplateForm";
import BusinessRuleFromScratchForm from "../components/BusinessRuleFromScratchForm";
import BusinessRulesMessages from "./BusinessRulesMessages";
import BusinessRulesManager from "../components/BusinessRulesManager";
import ProgressDisplay from "../components/ProgressDisplay";


class BusinessRulesUtilityFunctions {
    /**
     * Loads the form, that represents an existing form for viewing. Editable mode as specified
     * @param editable
     * @param businessRuleUUID
     */
    static viewBusinessRuleForm(editable,businessRuleUUID){
        let businessRulePromise = this.getBusinessRule(businessRuleUUID)
        businessRulePromise.then(function(businessRuleResponse){
            let gotBusinessRule = businessRuleResponse.data

            // Get the template group
            let templateGroupPromise = BusinessRulesUtilityFunctions.getTemplateGroup(gotBusinessRule.templateGroupUUID)
            templateGroupPromise.then(function (response) {
                let templateGroup = response.data

                // Get rule templates
                let ruleTemplatesPromise = BusinessRulesUtilityFunctions.getRuleTemplates(templateGroup.uuid)
                ruleTemplatesPromise.then(function(ruleTemplatesResponse){
                    // Filter rule template types
                    let templateRuleTemplates = []
                    let inputRuleTemplates = []
                    let outputRuleTemplates = []
                    for(let ruleTemplate of ruleTemplatesResponse.data){
                        if(ruleTemplate.type === BusinessRulesConstants.RULE_TEMPLATE_TYPE_TEMPLATE){
                            templateRuleTemplates.push(ruleTemplate)
                        }else if(ruleTemplate.type === BusinessRulesConstants.RULE_TEMPLATE_TYPE_INPUT){
                            inputRuleTemplates.push(ruleTemplate)
                        } else {
                            outputRuleTemplates.push(ruleTemplate)
                        }
                    }

                    // If Business Rule has been created from a template
                    if (gotBusinessRule.type === BusinessRulesConstants.BUSINESS_RULE_TYPE_TEMPLATE) {
                        // Get 'template' type rule template, from which the Business Rule has been created
                        let ruleTemplatePromise = BusinessRulesUtilityFunctions.getRuleTemplate(
                            gotBusinessRule.templateGroupUUID,
                            gotBusinessRule.ruleTemplateUUID
                        )

                        ruleTemplatePromise.then(function(ruleTemplateResponse){
                            // Render the form
                            ReactDOM.render (
                                <BusinessRuleFromTemplateForm
                                    businessRuleType={BusinessRulesConstants.BUSINESS_RULE_TYPE_TEMPLATE}
                                    formMode={
                                        (editable)?(BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_EDIT):
                                            (BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_VIEW)
                                    }
                                    businessRuleName={gotBusinessRule.name}
                                    businessRuleUUID={gotBusinessRule.uuid}
                                    selectedTemplateGroup={templateGroup}
                                    selectedRuleTemplate={ruleTemplateResponse.data}
                                    templateRuleTemplates={templateRuleTemplates}
                                    businessRuleProperties={gotBusinessRule.properties}
                                />,
                                document.getElementById('root')
                            )
                        })
                    } else {
                        // If business rule has been created from scratch

                        // Get input rule template, from which the business rule has been created
                        let inputRuleTemplatePromise = BusinessRulesUtilityFunctions.getRuleTemplate(
                            gotBusinessRule.templateGroupUUID,
                            gotBusinessRule.inputRuleTemplateUUID
                        )
                        inputRuleTemplatePromise.then(function(inputRuleTemplateResponse){
                            let inputRuleTemplate = inputRuleTemplateResponse.data

                            // Get output rule template, from which the business rule has been created
                            let outputRuleTemplatePromise = BusinessRulesUtilityFunctions.getRuleTemplate(
                                gotBusinessRule.templateGroupUUID,
                                gotBusinessRule.outputRuleTemplateUUID
                            )
                            outputRuleTemplatePromise.then(function(outputRuleTemplateResponse){
                                let outputRuleTemplate = outputRuleTemplateResponse.data

                                // Render the form
                                ReactDOM.render (
                                    <BusinessRuleFromScratchForm
                                        businessRuleType={BusinessRulesConstants.BUSINESS_RULE_TYPE_SCRATCH}
                                        formMode={
                                            (editable)?(BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_EDIT):
                                                (BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_VIEW)
                                        }
                                        businessRuleName={gotBusinessRule.name}
                                        businessRuleUUID={gotBusinessRule.uuid}
                                        selectedTemplateGroup={templateGroup}
                                        selectedInputRuleTemplate={inputRuleTemplate}
                                        selectedOutputRuleTemplate={outputRuleTemplate}
                                        inputRuleTemplates={inputRuleTemplates}
                                        outputRuleTemplates={outputRuleTemplates}
                                        businessRuleProperties={gotBusinessRule.properties}
                                    />,
                                    document.getElementById('root')
                                )
                            })
                        })
                    }
                })
            })
        })
    }

    /**
     * Loads business rule creator, which shows options to create a business rule from template, or scratch
     */
    static loadBusinessRuleCreator() {
        ReactDOM.render(
            <BusinessRuleCreator/>,
            document.getElementById('root')
        );
    }

    /**
     * Shows available Template Groups as thumbnails,
     * to select one for creating a Business Rule in the given mode
     *
     * @param mode 'scratch' or 'template'
     */
    static loadTemplateGroupSelector(mode) {
        let templateGroupsPromise = this.getTemplateGroups()
        templateGroupsPromise.then(function (templateGroupsResponse) {
            ReactDOM.render(
                <TemplateGroupSelector
                    templateGroups={templateGroupsResponse.data}
                    mode={mode}
                />, document.getElementById('root'))
        }).catch(function(error){
            console.error('Failed to load template groups.')
            ReactDOM.render(<ProgressDisplay error={BusinessRulesMessages.API_FAILURE_ERROR}/>,
                document.getElementById('root'))
        })
        ReactDOM.render(<ProgressDisplay/>,document.getElementById('root'))
    }

    /**
     * Shows form to create a BusinessRule from scratch,
     * with available input & output rule templates from the template group, identified by the given UUID
     *
     * @param templateGroupUUID
     */
    static loadBusinessRuleFromScratchCreator(templateGroupUUID) {
        let that = this
        let templateGroupPromise = this.getTemplateGroup(templateGroupUUID)
        templateGroupPromise.then(function(templateGroupResponse){
            // Load template group
            let templateGroup = templateGroupResponse.data
            let ruleTemplatesPromise = that.getRuleTemplates(templateGroupUUID)
            ruleTemplatesPromise.then(function(ruleTemplatesResponse){
                let inputRuleTemplates = []
                let outputRuleTemplates = []

                // Get input & output templates into different arrays
                for (let ruleTemplate of ruleTemplatesResponse.data) {
                    if (ruleTemplate.type === BusinessRulesConstants.RULE_TEMPLATE_TYPE_INPUT) {
                        inputRuleTemplates.push(ruleTemplate)
                    } else if (ruleTemplate.type === BusinessRulesConstants.RULE_TEMPLATE_TYPE_OUTPUT) {
                        outputRuleTemplates.push(ruleTemplate)
                    }
                }
                ReactDOM.render(
                    <BusinessRuleFromScratchForm
                        formMode={BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_CREATE}
                        selectedTemplateGroup={templateGroup}
                        inputRuleTemplates={inputRuleTemplates}
                        outputRuleTemplates={outputRuleTemplates}
                    />, document.getElementById('root'))
            })
        })
    }

    /**
     * Loads the business rule modifier, with snackbar with given message when a message is passed as parameter
     *
     * @param snackbarMessage
     */
    static loadBusinessRulesManager(snackbarMessage){
        // Load available Business Rules
        let businessRulesPromise = BusinessRulesUtilityFunctions.getBusinessRules()
        businessRulesPromise.then(function(response){
            ReactDOM.render(
                <BusinessRulesManager
                    businessRules={response.data}
                    displaySnackBar={!!(snackbarMessage)}
                    snackbarMessage={(snackbarMessage)?(snackbarMessage):('')}
                />, document.getElementById("root"))
        }).catch(function(error){
            console.error('Failed to load business rules.')
            ReactDOM.render(<ProgressDisplay error={BusinessRulesMessages.CONNECTION_FAILURE_ERROR}/>,
                document.getElementById("root"))
        })
        ReactDOM.render(<ProgressDisplay/>, document.getElementById("root"))
    }

    /**
     * Loads the form for creating a business rule from template by selecting a rule template,
     * that belongs to the template group which is identified by the given UUID
     */
    static loadBusinessRulesFromTemplateCreator(templateGroupUUID) {
        // Get the template group
        let templateGroupPromise = this.getTemplateGroup(templateGroupUUID)
        templateGroupPromise.then(function(templateGroupResponse){
            let ruleTemplatesPromise = BusinessRulesUtilityFunctions.getRuleTemplates(templateGroupUUID)
            ruleTemplatesPromise.then(function(ruleTemplatesResponse){
                // Filter and get the rule templates, only of type 'template'
                let templateRuleTemplates = []
                for(let ruleTemplate of ruleTemplatesResponse.data){
                    if(ruleTemplate.type === BusinessRulesConstants.RULE_TEMPLATE_TYPE_TEMPLATE){
                        templateRuleTemplates.push(ruleTemplate)
                    }
                }

                ReactDOM.render(
                    <BusinessRuleFromTemplateForm
                        formMode={BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_CREATE}
                        selectedTemplateGroup={templateGroupResponse.data}
                        templateRuleTemplates={templateRuleTemplates}
                    />,
                    document.getElementById('root')
                )
            }).catch(function(error){
                console.error("Failed to load rule templates from template group '" + templateGroupUUID + "'.")
                ReactDOM.render(<ProgressDisplay error={BusinessRulesMessages.API_FAILURE_ERROR}/>,
                    document.getElementById('root'))
            })
        }).catch(function(error){
            console.error("Failed to load template group '" + templateGroupUUID + "'.")
            ReactDOM.render(<ProgressDisplay error={BusinessRulesMessages.API_FAILURE_ERROR}/>,
                document.getElementById('root'))
        })
    }

    /*
    * Functions that have API calls within them
    */

    /**
     * Returns promise for available template groups
     *
     * @returns {*}
     */
    static getTemplateGroups() {
        let apis = new BusinessRulesAPICaller(BusinessRulesConstants.BASE_URL);
        let gotTemplateGroupsPromise = apis.getTemplateGroups();
        return gotTemplateGroupsPromise;
    }

    /** [2]
     * Returns promise for available Rule Templates, belong to the given Template Group
     * todo: from API
     *
     * @param templateGroupName
     */
    static getRuleTemplates(templateGroupUUID) {
        let apis = new BusinessRulesAPICaller(BusinessRulesConstants.BASE_URL)
        let gotRuleTemplates = apis.getRuleTemplates(templateGroupUUID)
        return gotRuleTemplates
    }

    /** [3]
     * Get available Properties, belong to the given Template Group and Rule Template
     * todo: from API
     *
     * @param templateGroupName
     * @param ruleTemplateName
     * @returns {*|Array}
     */
    static getRuleTemplateProperties(templateGroupName, ruleTemplateName) {
        // todo: remove hardcode ******************************
        var ruleTemplates
        for (let templateGroup of this.availableTemplateGroups) {
            if (templateGroup.name === templateGroupName) {
                ruleTemplates = templateGroup.ruleTemplates
                break
            }
        }
        for (let ruleTemplate of ruleTemplates) {
            if (ruleTemplate.name === ruleTemplateName) {
                return ruleTemplate.properties
            }
        }
        // todo: **********************************************
        // todo: Return Properties from API
    }

    /** [5]
     * Returns promise for BusinessRulesCreator
     * todo: from API
     *
     * @returns {[null,null]}
     */
    static getBusinessRules() {
        let apis = new BusinessRulesAPICaller(BusinessRulesConstants.BASE_URL);
        let gotBusinessRules = apis.getBusinessRules();

        return gotBusinessRules;

        // todo: remove hardcode *****************************
        // todo: *********************************************
        // todo: Get BusinessRulesCreator from API ******************
    }

// End of Functions that have API calls unnecessarily //////////////////////////

    /* End of Methods related to API calls ****************************************/

    /** [6]
     * Gets the BusinessRule with the given UUID
     * todo: from API
     *
     * @param businessRuleUUID
     * @returns {null|null}
     */
    static getBusinessRule(businessRuleUUID) {
        let apis = new BusinessRulesAPICaller(BusinessRulesConstants.BASE_URL)
        let gotBusinessRule = apis.getBusinessRule(businessRuleUUID)

        return gotBusinessRule
        // // todo: remove hardcode ******************************
        // for (let businessRule of this.getBusinessRules()) {
        //     if (businessRuleUUID === businessRule.uuid) {
        //         return businessRule
        //     }
        // }
        // // todo: *********************************************
        // // todo: Get BusinessRule from API *******************

    }

// Functions that have API calls unnecessarily /////////////////////////////////
    /**
     * Returns promise of the found Template Group with the given name
     * todo: from API (We have available templateGroups in front end itself)
     *
     * @param templateGroupName
     * @returns {*}
     */
    static getTemplateGroup(templateGroupUUID) {
        let apis = new BusinessRulesAPICaller(BusinessRulesConstants.BASE_URL);
        let gotTemplateGroup = apis.getTemplateGroup(templateGroupUUID);

        return gotTemplateGroup;
    }

    /**
     * Returns promise of the Rule Template with the given name, that belongs to the given Template Group name
     * todo: from API (We have available templateGroups in front end itself)
     * todo: make sure to assign the belonging templateGroup for ruleTemplate
     *
     * @param templateGroupName
     * @param ruleTemplateName
     * @returns {*}
     */
    static getRuleTemplate(templateGroupUUID, ruleTemplateUUID) {
        let apis = new BusinessRulesAPICaller(BusinessRulesConstants.BASE_URL);
        let gotRuleTemplate = apis.getRuleTemplate(templateGroupUUID, ruleTemplateUUID);

        return gotRuleTemplate;
    }

    /**
     * TODO : Implement
     * Gets the deployment status of a given Business Rule
     *
     * @param businessRuleUUID
     */
    static getBusinessRuleDeploymentStatus(businessRuleUUID) {
        // Generates a random status for now
        let statuses = [
            BusinessRulesConstants.BUSINESS_RULE_DEPLOYMENT_STATUS_DEPLOYED,
            BusinessRulesConstants.BUSINESS_RULE_DEPLOYMENT_STATUS_NOT_DEPLOYED
        ]

        return statuses[Math.floor(Math.random() * statuses.length)]
    }

    /* Roughly implemented functions *//////////////////////////////////////////////////////////////////////////////////////

    /* End of Roughly implemented functions *///////////////////////////////////////////////////////////////////////////////

    /**
     * Generates UUID for a given Business Rule name
     *
     * @param businessRuleName
     * @returns {string}
     */
    static generateBusinessRuleUUID(businessRuleName) {
        return businessRuleName.toLowerCase().split(' ').join('-')
    }

    /**
     * Checks whether a given object is empty or not
     *
     * @param object
     * @returns {boolean}
     */
    static isEmpty(object) {
        for(var key in object) {
            if(object.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}

export default BusinessRulesUtilityFunctions;
