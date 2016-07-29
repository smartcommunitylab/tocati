package it.smartcommunitylab.tocati.model;

import java.util.ArrayList;
import java.util.List;

public class ChargingPoint extends BaseObject {
	private String name;
	private String description;
	private String imageUrl;
	private List<String> poiList = new ArrayList<String>();
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
	public double[] getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(double[] coordinates) {
		this.coordinates = coordinates;
	}
	public List<String> getPoiList() {
		return poiList;
	}
	public void setPoiList(List<String> poiList) {
		this.poiList = poiList;
	}
}
