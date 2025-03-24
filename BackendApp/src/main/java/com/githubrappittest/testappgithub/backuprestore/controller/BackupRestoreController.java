package com.githubrappittest.testappgithub.backuprestore.controller;

import com.githubrappittest.testappgithub.base.backuprestore.controller.BackupRestoreBaseController;
import com.githubrappittest.testappgithub.backuprestore.service.BackupRestoreService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/snapshot/", produces = "application/json")
public class BackupRestoreController extends BackupRestoreBaseController<BackupRestoreService> {

  public BackupRestoreController(BackupRestoreService backupRestoreService) {
    super(backupRestoreService);
  }
}
