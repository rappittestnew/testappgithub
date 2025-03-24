package com.githubrappittest.testappgithub.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.vs.rappit.base.model.PaginationRequest;
import com.vs.rappit.base.model.PaginationResponse;
import com.vs.rappit.base.model.Primary;
import com.vs.rappit.base.workflow.history.IWorkflowHistoryBL;
import com.vs.rappit.base.workflow.history.WorkflowHistory;
import com.vs.rappit.jersey.base.webservice.BaseWebService;
import com.githubrappittest.testappgithub.service.WorkflowHistoryService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.access.prepost.PreAuthorize;
import com.vs.rappit.jersey.webservice.mapper.DatatableJson;

@RestController
@RequestMapping(path = "/rest/workflowhistory/", produces = "application/json")
public class WorkflowHistoryController extends BaseWebService<IWorkflowHistoryBL, WorkflowHistory> {

  public WorkflowHistoryController(WorkflowHistoryService workflowHistoryService) {
    super(workflowHistoryService);
  }

  // @PreAuthorize("hasAccess('/workflowhistory/{workflowType}/{modelid}/datatable')")
  @PostMapping(path = "/{workflowType}/{modelid}/datatable", produces = "application/json")
  public PaginationResponse getWorkflowHistory(
      @PathVariable("workflowType") String workflowType,
      @PathVariable("modelid") Primary modelId,
      @RequestBody DatatableJson datatableJson) {
    PaginationRequest dataTable = convertToPaginationRequest(datatableJson);
    return logic.getWorkflowHistory(workflowType, modelId.getAsString(), dataTable);
  }
}
