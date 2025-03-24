package com.githubrappittest.testappgithub.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import org.springframework.http.ResponseEntity;
import com.vs.rappit.base.model.PaginationRequest;
import com.vs.rappit.base.model.PaginationResponse;
import com.vs.rappit.base.service.changelog.IChangelogBL;
import com.vs.rappit.jersey.base.webservice.BaseWebService;
import com.vs.rappit.base.factory.InstanceFactory;
import com.vs.rappit.base.model.Changelog;
import com.githubrappittest.testappgithub.service.ChangelogService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import com.vs.rappit.jersey.webservice.mapper.DatatableJson;

@RestController
@RequestMapping(path = "/rest/changelogs/", produces = "application/json")
public class ChangelogController extends BaseWebService<IChangelogBL, Changelog>
    implements IChangelogController {
  public ChangelogController(ChangelogService changelogService) {
    super(changelogService);
  }

  // @PreAuthorize("hasAccess('/changelogs/datatable/{entityName}/{entityId}/{fieldName}/{fromModifiedDate}')")
  @PostMapping("/datatable/{entityName}/{entityId}/{fieldName}/{fromModifiedDate}")
  public PaginationResponse getChangelog(
      @RequestBody DatatableJson datatableJson,
      @PathVariable("entityName") String entityName,
      @PathVariable("entityId") String entityId,
      @PathVariable("fieldName") String fieldName,
      @PathVariable("fromModifiedDate") Long fromModifiedDate) {
    PaginationRequest request = convertToPaginationRequest(datatableJson);
    if ("null".equalsIgnoreCase(fieldName)) fieldName = null;
    PaginationResponse ResponseEntity = new PaginationResponse(request);
    List<Changelog> changeLogList =
        logic.getChangeLogsByEntityNameAndEntityId(
            entityName, entityId, fieldName, fromModifiedDate, request);
    ResponseEntity.setResults(changeLogList);
    return ResponseEntity;
  }
}
