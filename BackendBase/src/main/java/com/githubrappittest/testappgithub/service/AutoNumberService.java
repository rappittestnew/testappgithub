package com.githubrappittest.testappgithub.service;

import com.vs.rappit.base.autonumber.logic.AutoNumberBLBaseImpl;
import com.vs.rappit.base.autonumber.logic.IAutoNumberBL;
import com.vs.rappit.base.autonumber.model.AutoNumber;
import org.springframework.stereotype.Service;

@Service
public class AutoNumberService extends AutoNumberBLBaseImpl implements IAutoNumberBL<AutoNumber> {}
