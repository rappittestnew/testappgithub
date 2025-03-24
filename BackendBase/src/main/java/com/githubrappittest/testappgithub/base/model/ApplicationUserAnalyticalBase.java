package com.githubrappittest.testappgithub.base.model;

import com.vs.rappit.base.annotations.Table;
import com.vs.rappit.base.model.BaseAnalyticalModel;

@Table(name = "ApplicationUser")
public class ApplicationUserAnalyticalBase extends BaseAnalyticalModel {
  private static final long serialVersionUID = -1653584662510644834L;
  private String sid;

  public String getSid() {
    return sid;
  }

  public void setSid(String sid) {
    this.sid = sid;
  }
}
