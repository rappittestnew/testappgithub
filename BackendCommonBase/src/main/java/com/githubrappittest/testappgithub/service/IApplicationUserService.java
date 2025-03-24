package com.githubrappittest.testappgithub.service;

import com.githubrappittest.testappgithub.base.service.IApplicationUserBaseService;
import com.githubrappittest.testappgithub.model.ApplicationUser;

public interface IApplicationUserService<T extends ApplicationUser>
    extends IApplicationUserBaseService<T> {}
