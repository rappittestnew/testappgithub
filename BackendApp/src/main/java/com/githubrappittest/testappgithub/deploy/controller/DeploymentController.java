package com.githubrappittest.testappgithub.deploy.controller;

import com.githubrappittest.testappgithub.deploy.service.DeploymentService;
import com.githubrappittest.testappgithub.base.deploy.controller.DeploymentBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping(path = "/rest/deploy/", produces = "application/json")
public class DeploymentController extends DeploymentBaseController<DeploymentService> {

  public DeploymentController(DeploymentService deploymentService) {
    super(deploymentService);
  }
}
