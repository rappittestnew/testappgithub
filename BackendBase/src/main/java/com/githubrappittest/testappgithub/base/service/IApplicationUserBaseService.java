package com.githubrappittest.testappgithub.base.service;

import com.vs.rappit.base.authentication.IAppUserPrivilegeBL;
import com.vs.rappit.base.dal.Filter;
import com.githubrappittest.testappgithub.base.model.ApplicationUserBase;
import com.vs.rappit.base.mail.model.EmailAddress;
import java.util.List;
import com.vs.rappit.base.model.wrapper.UserPrivilegePerimeter;
import java.util.Map;

public interface IApplicationUserBaseService<T extends ApplicationUserBase>
    extends IAppUserPrivilegeBL<T> {
  public T getByemailprimaryIndex(String email);

  public List<EmailAddress> getUsersByRole(
      UserPrivilegePerimeter rolePerimeterInfo, Integer page, Integer pageSize);

  public Map<String, String> getAllRolesMap();

  public boolean updateUserLang(Map<String, String> userLanguage);
}
