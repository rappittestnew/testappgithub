package com.githubrappittest.testappgithub.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import com.vs.rappit.base.workflow.config.WorkflowConfigurationInfo;
import com.vs.rappit.base.workflow.config.WorkflowConfigurationInfoBL;
import com.vs.rappit.base.workflow.config.util.WorkflowConfiguration;
import com.vs.rappit.jersey.base.webservice.BaseWebService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping(path = "/rest/workflowconfig/", produces = "application/json")
public class WorkflowConfigurationController
    extends BaseWebService<WorkflowConfigurationInfoBL, WorkflowConfigurationInfo> {

  public WorkflowConfigurationController(WorkflowConfigurationInfoBL workflowConfigurationInfoBL) {
    super(workflowConfigurationInfoBL);
  }

  // @PreAuthorize("hasAccess('/workflowconfig/getconfig/{workflowType}')")
  @GetMapping(path = "/getconfig/{workflowType}", produces = "application/json")
  public WorkflowConfiguration getWorkflowConfiguration(
      @PathVariable("workflowType") String workflowType) {
    return logic.getWorkflowConfiguration(workflowType);
  }
}
