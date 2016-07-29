package it.smartcommunitylab.tocati.model;

import java.util.ArrayList;
import java.util.List;

public class UserData extends BaseObject {
	private String userId;
	private String name;
	private String surname;
	private String displayName;
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
}
