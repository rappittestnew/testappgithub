package com.githubrappittest.testappgithub.base.deploy.controller;

import org.springframework.http.ResponseEntity;
import com.githubrappittest.testappgithub.base.deploy.service.DeploymentBaseService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestParam;

public class DeploymentBaseController<T extends DeploymentBaseService> {

  private T bl;

  public DeploymentBaseController(T bl) {
    this.bl = bl;
  }

  @PostMapping("/setup")
  public ResponseEntity setup(@RequestParam("action") String action) {
    bl.setup("1.0", action);
    return ResponseEntity.ok().build();
  }
}
