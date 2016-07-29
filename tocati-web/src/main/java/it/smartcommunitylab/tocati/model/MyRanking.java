package it.smartcommunitylab.tocati.model;

import java.util.ArrayList;
import java.util.List;

public class MyRanking {
	private int position;
	private int points;
	private List<Ranking> ranking = new ArrayList<Ranking>();
	
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
	public List<Ranking> getRanking() {
		return ranking;
	}
	public void setRanking(List<Ranking> ranking) {
		this.ranking = ranking;
	}
}
