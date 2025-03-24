package com.githubrappittest.testappgithub.model;

import java.util.HashMap;
import java.util.Map;

public enum Roles {
	APP_ADMIN(1,"App Admin");

	private static final Map<String, Roles> roleNameMap = new HashMap<String, Roles>();
	static {
		for (Roles roleNameEnum : Roles.values()) {
			roleNameMap.put(roleNameEnum.getRoleName(), roleNameEnum);
		}
	}
	
	private Integer roleId;
	private String roleName;

	Roles(Integer roleId,String roleName) {
		this.setRoleId(roleId);
		this.setRoleName(roleName);
	}

	public static Roles getRoleNameEnum(String roleName) {
		return roleNameMap.get(roleName);
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	
	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
}
