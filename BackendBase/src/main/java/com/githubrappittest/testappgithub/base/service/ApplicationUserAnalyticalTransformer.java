package com.githubrappittest.testappgithub.base.service;

import com.vs.rappit.base.model.IModelTransformer;
import com.githubrappittest.testappgithub.base.model.ApplicationUserBase;
import com.githubrappittest.testappgithub.base.model.ApplicationUserAnalyticalBase;
import com.vs.rappit.base.util.Configuration;
import java.util.stream.Collectors;

public class ApplicationUserAnalyticalTransformer<
        T extends ApplicationUserBase, M extends ApplicationUserAnalyticalBase>
    implements IModelTransformer<T, M> {
  private static final String SEPARATOR = "#@$%!*&";

  @Override
  public M writeTo(T model) {
    ApplicationUserAnalyticalBase applicationUserAnalyticalBase =
        new ApplicationUserAnalyticalBase();

    applicationUserAnalyticalBase.setSid(model.getSid());
    return (M) applicationUserAnalyticalBase;
  }

  @Override
  public Object readFrom(M data) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public Class<T> getSourceClass() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public Class<M> getTargetClass() {
    // TODO Auto-generated method stub
    return null;
  }
}
