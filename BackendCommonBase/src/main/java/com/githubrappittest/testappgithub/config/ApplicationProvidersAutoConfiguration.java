package com.githubrappittest.testappgithub.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;

import com.vs.rappit.base.crypto.provider.ICipherCryptoProvider;
import com.vs.rappit.base.listener.BaseApplicationConfiguration;
import com.vs.rappit.base.logger.Logger;
import com.vs.rappit.base.logger.LoggerFactory;
import com.vs.rappit.base.vault.provider.IVaultProvider;
import com.vs.rappit.gcplibrary.crypto.GoogleCipherCryptoProvider;
import com.vs.rappit.gcplibrary.vault.GoogleSecret;
import com.vs.rappit.gcplibrary.vault.GoogleSecretVaultProvider;
import com.vs.rappit.gcs.CloudStorage;
import com.vs.rappit.base.mail.providers.IEmailProvider;
import com.vs.rappit.base.mail.model.EmailDetails;
import org.springframework.core.env.Environment;
import com.vs.rappit.base.appconfiguration.AppConfigurationCache;
import com.vs.rappit.base.tasks.logic.IExecutionManager;
import com.vs.rappit.base.tasks.logic.TaskService;
import com.vs.rappit.base.transaction.TransactionManager;
import com.vs.rappit.gaelibrary.task.GaeTaskExecution;
import com.vs.rappit.gaelibrary.task.GaeTaskExecutionHandler;
import com.vs.rappit.gcplibrary.credential.CredentialFactory;
import com.vs.rappit.jwt.JWTService;
import com.vs.rappit.base.mail.providers.SendGridEmailProvider;

@AutoConfiguration
public class ApplicationProvidersAutoConfiguration {

  private static final Logger LOGGER =
      LoggerFactory.getLogger(ApplicationProvidersAutoConfiguration.class);

  @Autowired private GoogleSecret googleSecret;

  @Autowired private BaseApplicationConfiguration applicationConfiguration;

  @Autowired private TransactionManager txnMgr;

  @Autowired private AppConfigurationCache cache;

  @Autowired private TaskService taskService;

  @Autowired private CredentialFactory credentialFactory;

  @Autowired private Environment env;

  @Autowired private GaeTaskExecutionHandler gaeTaskExecutionHandler;

  @Autowired private JWTService jwtService;

  @Bean("VAULT")
  public IVaultProvider registerVaultProvider() {
    return new GoogleSecretVaultProvider(googleSecret, applicationConfiguration);
  }

  @Bean("CRYPTO")
  public ICipherCryptoProvider registerCryptoProvider() {
    return new GoogleCipherCryptoProvider(applicationConfiguration);
  }

  @Bean("FILES")
  public CloudStorage registerCloudStorage() {
    return new CloudStorage();
  }

  @Bean("EMAIL")
  public IEmailProvider<EmailDetails> registerEmailProvider() {
    return new SendGridEmailProvider();
  }

  @Bean("TASK_EXECUTOR")
  public IExecutionManager taskExecutionManager() {
    return new GaeTaskExecution(
        applicationConfiguration,
        txnMgr,
        gaeTaskExecutionHandler,
        cache,
        taskService,
        credentialFactory,
        env,
        jwtService);
  }
}
