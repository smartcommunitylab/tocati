package it.smartcommunitylab.tocati.model;

import java.util.List;

import com.google.common.collect.Lists;

public class Poi extends BaseObject {
	private String name;
	private String description;
	private String address;
	private String imageUrl;
	private String category;
	private List<Slot> when = Lists.newArrayList();
	private int points;
	private double[] coordinates;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public int getPoints() {
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
	public double[] getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(double[] coordinates) {
		this.coordinates = coordinates;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public List<Slot> getWhen() {
		return when;
	}
	public void setWhen(List<Slot> when) {
		this.when = when;
	}
	
}
