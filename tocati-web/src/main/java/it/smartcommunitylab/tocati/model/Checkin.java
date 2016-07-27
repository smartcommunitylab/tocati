package it.smartcommunitylab.tocati.model;

import java.util.Date;

public class Checkin {
	private Date timestamp;
	private Poi poi;
	
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	public Poi getPoi() {
		return poi;
	}
	public void setPoi(Poi poi) {
		this.poi = poi;
	}
}
