package com.githubrappittest.testappgithub.base.backuprestore.controller;

import com.githubrappittest.testappgithub.base.backuprestore.service.BackupRestoreBaseService;
import com.vs.rappit.base.backuprestore.model.BackupRestoreInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

public class BackupRestoreBaseController<T extends BackupRestoreBaseService> {

  private T bl;

  public BackupRestoreBaseController(T bl) {
    this.bl = bl;
  }

  @PostMapping("/backup/table")
  public ResponseEntity backupTable(
      @RequestParam("action") String action, @RequestBody BackupRestoreInfo info)
      throws IOException {
    if (info.getTables() != null && info.getTables().size() == 1) {
      bl.backUpTable(
          action,
          info.getRepoName(),
          info.getSnapshot(),
          info.getTables().get(0),
          info.getBasePath());
    } else if (info.getTables() != null && info.getTables().size() > 1) {
      bl.backUpTables(
          action, info.getRepoName(), info.getSnapshot(), info.getTables(), info.getBasePath());
    } else {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok().build();
  }

  @PostMapping("/backup/schedule")
  public ResponseEntity backupSchedule(
      @RequestParam("action") String action, @RequestBody BackupRestoreInfo info)
      throws IOException {
    bl.createBackUpSchedule(
        action,
        info.getSnapshot(),
        info.getRepoName(),
        info.getTables(),
        info.getScheduleConfig(),
        info.getBasePath());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/restore/table")
  public ResponseEntity restoreTable(
      @RequestParam("action") String action, @RequestBody BackupRestoreInfo info)
      throws IOException {
    if (info.getTables() != null && info.getTables().size() == 1) {
      bl.restoreBackupTable(
          action, info.getRepoName(), info.getSnapshot(), info.getTables().get(0));
    } else if (info.getTables() != null && info.getTables().size() > 1) {
      bl.restoreBackupTables(action, info.getRepoName(), info.getSnapshot(), info.getTables());
    } else {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok().build();
  }
}
