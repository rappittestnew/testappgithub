package com.githubrappittest.testappgithub.base.model;

import com.vs.rappit.base.annotations.Table;
import com.vs.rappit.base.util.ValidationErrorConstants;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Id;
import com.vs.rappit.base.authentication.UserPrivilege;

@MappedSuperclass
@jakarta.persistence.Table(
    name = "ApplicationUser",
    uniqueConstraints = {
      @UniqueConstraint(
          name = "SIDUnique",
          columnNames = {"sid"})
    })
@Table(
    name = "ApplicationUser",
    keys = {"sid"})
public class ApplicationUserBase extends UserPrivilege {
  private String sid;

  private Boolean appAdmin = false;

  public Boolean isAppAdmin() {
    return appAdmin;
  }

  public void setAppAdmin(Boolean appAdmin) {
    this.appAdmin = appAdmin;
  }

  public String getSid() {
    return sid;
  }

  public void setSid(String sid) {
    this.sid = sid;
  }
}
