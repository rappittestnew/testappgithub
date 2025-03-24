package com.githubrappittest.testappgithub.controller;

import com.vs.rappit.base.model.PaginationRequest;
import com.vs.rappit.base.model.PaginationResponse;
import com.vs.rappit.base.model.Primary;
import org.springframework.http.ResponseEntity;
import com.vs.rappit.jersey.webservice.mapper.DatatableJson;

public interface IChangelogController {
  PaginationResponse getChangelog(
      DatatableJson request,
      String entityName,
      String entityId,
      String fieldName,
      Long fromModifiedDate);
}
