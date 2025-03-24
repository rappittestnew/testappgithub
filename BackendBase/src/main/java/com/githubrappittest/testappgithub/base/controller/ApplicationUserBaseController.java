package com.githubrappittest.testappgithub.base.controller;

import java.util.List;
import org.apache.commons.lang3.StringUtils;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import com.vs.rappit.base.dal.providers.PersistenceType;
import com.vs.rappit.base.model.PaginationRequest;
import com.vs.rappit.base.model.PaginationResponse;
import com.vs.rappit.base.model.Primary;
import com.vs.rappit.base.rest.APIConstants;
import com.vs.rappit.jersey.base.webservice.BaseWebService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import com.githubrappittest.testappgithub.base.model.ApplicationUserBase;
import com.githubrappittest.testappgithub.base.service.IApplicationUserBaseService;
import org.springframework.security.access.prepost.PreAuthorize;
import com.vs.rappit.jersey.webservice.mapper.DatatableJson;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Base64;
import com.vs.rappit.base.authentication.logic.AppUserPrivilegeCache;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import com.vs.rappit.base.exception.InternalException;
import com.vs.rappit.base.logger.Logger;
import com.vs.rappit.base.logger.LoggerFactory;
import java.util.List;
import java.util.ArrayList;
import com.vs.rappit.base.dal.Filter;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

public class ApplicationUserBaseController<
        SERVICE extends IApplicationUserBaseService<M>, M extends ApplicationUserBase>
    extends BaseWebService<SERVICE, M> {

  private Logger LOGGER = LoggerFactory.getLogger(ApplicationUserBaseController.class);

  @Autowired private AppUserPrivilegeCache<M> userCache;

  public ApplicationUserBaseController(SERVICE logic) {
    super(logic);
  }

  // @PreAuthorize("hasAccess('/applicationusers/user-details')")
  @GetMapping("user-details")
  public M getCurrentUser() {
    return logic.getCurrentUserWithMenu();
  }

  // @PreAuthorize("hasAccess('/applicationusers/')")
  @PostMapping
  public M createAppUser(@RequestBody M modelObj) {
    M existingObj = super.getById(new Primary(modelObj.getEmail()));
    if (existingObj == null) {
      return super.save(modelObj);
    } else {
      return super.update(modelObj);
    }
  }

  // @PreAuthorize("hasAccess('/applicationusers/')")
  @PutMapping
  public M updateAppUser(@RequestBody M modelObj) {
    return super.update(modelObj);
  }

  @PutMapping("/userlanguage")
  public boolean updateUserLanguage(@RequestBody Map<String, String> userLanguage) {
    return logic.updateUserLang(userLanguage);
  }

  // @PreAuthorize("hasAccess('/applicationusers/{sid}')")
  @GetMapping(path = "/{sid}", produces = "application/json")
  public M getApplicationUserBySid(@PathVariable("sid") Primary sid) {
    return super.getById(sid);
  }

  // @PreAuthorize("hasAccess('/applicationusers/datatable')")
  @PostMapping("/datatable")
  public PaginationResponse getAllAppUsers(@RequestBody DatatableJson datatableJson) {
    PaginationRequest dataTable = convertToPaginationRequest(datatableJson);
    return logic.getAllByPage(PersistenceType.SEARCH, dataTable);
  }

  // @PreAuthorize("hasAccess('/applicationusers/{ids}')")
  @DeleteMapping("/{ids}")
  public ResponseEntity deleteApplicationUsers(@PathVariable("ids") String ids) {
    boolean isDeleted = super.delete(ids);
    if (isDeleted) return ResponseEntity.ok().build();
    else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  // @PreAuthorize("hasAccess('/applicationusers/autosuggest')")
  @GetMapping(path = "/autosuggest", produces = "application/json")
  public List<Object> autoSuggestService(@RequestParam MultiValueMap<String, Object> queryParams) {
    Map<String, Object> params = queryParams.toSingleValueMap();
    List<Filter> filters = new ArrayList<>();

    return super.autosuggest(filters, params);
  }

  @GetMapping("roles")
  public Map<String, String> getRoles() {
    return logic.getAllRolesMap();
  }

  @PostMapping(path = "/invalidateAppUser")
  public ResponseEntity<String> processMessage(@RequestBody ObjectNode objectNode) {
    LOGGER.info("Entering processMessage ...");
    try {
      if (objectNode == null) {
        LOGGER.error("The recieved pubsub message is invalid or empty.");
        throw new InternalException("The recieved pubsub message is invalid or empty.");
      }
      LOGGER.debug("processMessage : objectNode : " + objectNode);
      if (objectNode.has("data")) {
        String userEmailEncoded = objectNode.get("data").asText();
        LOGGER.debug("processMessage : userEmailEncoded : " + userEmailEncoded);
        String userEmail = new String(Base64.getDecoder().decode(userEmailEncoded));
        LOGGER.debug("processMessage : userEmailEncoded : " + userEmail);
        userCache.invalidate(userEmail);
      }
      return ResponseEntity.ok("Success");
    } finally {
      LOGGER.info("Leaving processMessage ...");
    }
  }
}
