package com.githubrappittest.testappgithub.config;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import com.vs.rappit.base.transaction.ITransactionManager;
import com.vs.rappit.gaelibrary.queue.connection.QueueTransactionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.LinkedHashMap;
import java.util.Map;
import com.vs.rappit.base.dal.providers.PersistenceType;
import com.vs.rappit.sql.connection.JPATransactionManager;
import com.vs.rappit.gcp.bq.connection.BQTransactionManager;

@AutoConfiguration
public class ApplicationTransactionManagersAutoConfig {

  @Autowired private JPATransactionManager jpaTransactionManager;
  @Autowired private BQTransactionManager bqTransactionManager;
  @Autowired private QueueTransactionManager queueTransactionManager;

  @Bean("transactionsManager")
  public Map<PersistenceType, ITransactionManager<?>> initTransactionManagers() {
    Map<PersistenceType, ITransactionManager<?>> transactionTypes = new LinkedHashMap<>();
    transactionTypes.put(PersistenceType.DB, jpaTransactionManager);
    transactionTypes.put(PersistenceType.ANALYTICAL, bqTransactionManager);
    transactionTypes.put(PersistenceType.SEARCH, jpaTransactionManager);
    transactionTypes.put(PersistenceType.QUEUE, queueTransactionManager);
    return transactionTypes;
  }
}
