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
// Material UI Components
// App Components
import BusinessRuleFromTemplateForm from "./BusinessRuleFromTemplateForm";
import BusinessRuleFromScratchForm from "./BusinessRuleFromScratchForm";
// App Utilities
import BusinessRulesUtilityFunctions from "../utils/BusinessRulesUtilityFunctions";
import BusinessRulesConstants from "../utils/BusinessRulesConstants";
// CSS
import '../index.css';

/**
 * Allows to edit a Business Rule
 * todo: try to refactor as 'BusinessRuleViewer' and enable / disable edit for EDIT/VIEW
 * todo: new description : responsible for selecting the mentioned stuff and opening a form
 */
class BusinessRuleEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            businessRule: props.businessRule,
            editable: props.editable // Form's editable status
        }
    }

    static test() {
        // // Get the Template Group
        // var templateGroup =
        //     BusinessRulesUtilityFunctions.getTemplateGroup(this.state.businessRule.templateGroupUUID)
        let that = this

        let templateGroupPromise = BusinessRulesUtilityFunctions.getTemplateGroup(this.state.businessRule.templateGroupUUID)
        templateGroupPromise.then(function (response) {
            let templateGroup = response.data

            // If Business Rule has been created from a template
            if (that.state.businessRule.type === BusinessRulesConstants.BUSINESS_RULE_TYPE_TEMPLATE) {
                // Get rule Template, from which the Business Rule has been created
                let ruleTemplatePromise = BusinessRulesUtilityFunctions.getRuleTemplate(
                    that.state.businessRule.templateGroupUUID,
                    that.state.businessRule.ruleTemplateUUID
                )

                ruleTemplatePromise.then(function (ruleTemplateResponse) {
                    // Render the form
                    ReactDOM.render(
                        <BusinessRuleFromTemplateForm
                            businessRuleType={BusinessRulesConstants.BUSINESS_RULE_TYPE_TEMPLATE}
                            formMode={BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_EDIT}
                            businessRuleName={that.state.businessRule.name}
                            businessRuleUUID={that.state.businessRule.uuid}
                            selectedTemplateGroup={templateGroup}
                            selectedRuleTemplate={ruleTemplateResponse.data}
                            businessRuleProperties={that.state.businessRule.properties}
                        />,
                        document.getElementById('root')
                    )
                })
            } else {
                // Get input rule template
                let inputRuleTemplatePromise = BusinessRulesUtilityFunctions.getRuleTemplate(
                    that.state.businessRule.templateGroupUUID,
                    that.state.businessRule.inputRuleTemplateUUID
                )

                inputRuleTemplatePromise.then(function (inputRuleTemplateResponse) {
                    let inputRuleTemplate = inputRuleTemplateResponse.data

                    // Get output rule template
                    let outputRuleTemplatePromise = BusinessRulesUtilityFunctions.getRuleTemplate(
                        this.state.businessRule.templateGroupUUID,
                        this.state.businessRule.outputRuleTemplateUUID
                    )

                    outputRuleTemplatePromise.then(function (outputRuleTemplateResponse) {
                        let outputRuleTemplate = outputRuleTemplateResponse.data

                        // Business Rule has been created from scratch
                        ReactDOM.render(
                            <BusinessRuleFromScratchForm
                                businessRuleType={BusinessRulesConstants.BUSINESS_RULE_TYPE_SCRATCH}
                                formMode={BusinessRulesConstants.BUSINESS_RULE_FORM_MODE_EDIT}
                                businessRuleName={this.state.businessRule.name}
                                businessRuleUUID={this.state.businessRule.uuid}
                                selectedTemplateGroup={templateGroup}
                                selectedInputRuleTemplate={inputRuleTemplate}
                                selectedOutputRuleTemplate={outputRuleTemplate}
                                businessRuleProperties={this.state.businessRule.properties}
                            />,
                            document.getElementById('root')
                        )
                    })

                })
            }
        })

        // return(
        //     <Typography type="title">TET</Typography>
        // )
    }
}

export default BusinessRuleEditor;
