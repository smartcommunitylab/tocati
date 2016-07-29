package it.smartcommunitylab.tocati.model;

public class Ranking {
	private UserData data;
	private int position;
	private int points;
	
	public UserData getData() {
		return data;
	}
	public void setData(UserData data) {
		this.data = data;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public int getPoints() {
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
}
