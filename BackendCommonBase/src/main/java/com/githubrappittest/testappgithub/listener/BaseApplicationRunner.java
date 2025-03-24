package com.githubrappittest.testappgithub.listener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import com.githubrappittest.testappgithub.model.ApplicationUser;
import com.vs.rappit.base.authentication.logic.AppUserPrivilegeCache;
import com.vs.rappit.base.cache.CacheManager;
import com.vs.rappit.base.crypto.loader.CipheCryptoConfig;
import com.vs.rappit.base.crypto.loader.CipherCryptoConfigConstants;
import com.vs.rappit.base.crypto.provider.CipherCryptoConfigKeys;
import com.vs.rappit.base.dal.providers.PersistenceType;
import com.vs.rappit.base.exception.BaseEvaException;
import com.vs.rappit.base.factory.DeployerFactory;
import com.vs.rappit.base.listener.BaseApplicationConfiguration;
import com.vs.rappit.base.listener.EvaStartupCoordinationHandler;
import com.vs.rappit.base.logger.Logger;
import com.vs.rappit.base.logger.LoggerFactory;
import com.vs.rappit.base.provider.RegistrationProvider;
import com.vs.rappit.base.util.Constants;
import com.vs.rappit.gcs.CloudStorage;
import com.vs.rappit.logging.LoggingRequest;

public class BaseApplicationRunner implements ApplicationRunner, EvaStartupCoordinationHandler {

  private static Logger LOGGER = LoggerFactory.getLogger(BaseApplicationRunner.class);

  @Autowired private BaseApplicationConfiguration evaConfiguration;

  @Autowired private CloudStorage cloudStorage;

  @Autowired
  @Qualifier("applicationCacheManager")
  private CacheManager cacheManager;

  @Autowired private AppUserPrivilegeCache<ApplicationUser> appUserPrivilegeCache;

  @Autowired private BaseApplicationConfiguration applicationConfiguration;

  @Autowired private LoggingRequest loggingRequest;

  @Override
  public void run(ApplicationArguments args) throws Exception {
    LOGGER.info("Entering run ...");
    try {
      loggingRequest.setupLogger();
      System.setProperty(BaseEvaException.ERROR_MSG_SYSTEM_PROPERTY, "custom_error_messages");
      contextInitialized();
    } finally {
      LOGGER.info("Leaving run ...");
    }
  }

  @Override
  public void registerCache() {
    LOGGER.debug("Registering application user and menu Cache");
    cacheManager.registerCache(appUserPrivilegeCache);
  }

  @Override
  public void initializeRESTAPIProviders() {}

  @Override
  public void registerDeployers() {}

  @Override
  public void initializeConfigurations() {
    Map<CipherCryptoConfigKeys, Object> config = new HashMap<>();

    /*config.put(GoogleCipherCryptoConfigKeys.PROJECT_ID, AppEngineProperty.PROJECT_ID);
    config.put(GoogleCipherCryptoConfigKeys.KEY_RING_ID, loader.get(GoogleCipherCryptoConfigConstants.KEY_RING_ID));
    config.put(GoogleCipherCryptoConfigKeys.KEY_LOCATION_ID, loader.get(GoogleCipherCryptoConfigConstants.KEY_LOCATION_ID));
    config.put(GoogleCipherCryptoConfigKeys.KEY_ID, loader.get(GoogleCipherCryptoConfigConstants.KEY_ID));
    CipherCryptoProviderFactory.getProvider().configure(config);*/
    try {
      LOGGER.debug("Configuring properties for email providers");
      // EmailProviderFactory.configureProviderProperties();
    } catch (Exception e) {
      LOGGER.error("Exception while Configuring properties for email providers", e);
    }
  }

  @Override
  public void registerTxnManagers() {
    // TODO Auto-generated method stub

  }

  @Override
  public void registerProvider() {
    // TODO Auto-generated method stub

  }

  @Override
  public List<RegistrationProvider> initialized() {
    // TODO Auto-generated method stub
    return new ArrayList<>();
  }

  @Override
  public List<RegistrationProvider> destroyed() {
    // TODO Auto-generated method stub
    return new ArrayList<>();
  }
}
