package it.smartcommunitylab.tocati.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;

public class UserData extends BaseObject {
	private String userId;
	private String name;
	private String surname;
	private String displayName;

	private String email;
	private String language;

	private Map<String, String> customData;

	private List<Checkin> checkinList = new ArrayList<Checkin>();
	private int points;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public List<Checkin> getCheckinList() {
		return checkinList;
	}
	public void setCheckinList(List<Checkin> checkinList) {
		this.checkinList = checkinList;
	}
	public int getPoints() {
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public Map<String, String> getCustomData() {
		if (customData == null) customData = new HashMap<String, String>();
		return customData;
	}
	public void setCustomData(Map<String, String> customData) {
		this.customData = customData;
	}
	public void updateDisplayName() {
		String dn = "";
		if (StringUtils.hasText(name)) dn += name;
		if (StringUtils.hasText(surname)) dn += " " + surname;
		dn = dn.trim();
		if (dn.length() == 0) displayName = dn;
	}


}
