package it.smartcommunitylab.tocati.converter;

import java.util.Arrays;
import java.util.List;

import it.smartcommunitylab.tocati.common.Utils;
import it.smartcommunitylab.tocati.model.ChargingPoint;
import it.smartcommunitylab.tocati.model.Poi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class Converter {
	public static ChargingPoint convertChargingPoint(String ownerId, JsonNode featureNode) {
		String id = featureNode.get("properties").get("id").asText();
		String name = featureNode.get("properties").get("name").asText();
		String description = featureNode.get("properties").get("description").asText();
		String image = featureNode.get("properties").get("image").asText();
		String pois = featureNode.get("properties").get("pois").asText();
		String coordinates = featureNode.get("geometry").get("coordinates").toString();
		if(Utils.isEmpty(id) || Utils.isEmpty(name) || Utils.isEmpty(description) || Utils.isEmpty(pois) || Utils.isEmpty(coordinates)) {
			return null;
		}
		
		ChargingPoint chargingPoint = new ChargingPoint();
		chargingPoint.setOwnerId(ownerId);
		chargingPoint.setObjectId(id);
		chargingPoint.setName(name);
		chargingPoint.setDescription(description);
		
		if(Utils.isNotEmpty(image)) {
			chargingPoint.setImageUrl(image);
		}
		
		List<String> asList = Arrays.asList(pois.split(","));
		chargingPoint.setPoiList(asList);
		
		double[] coordinatesArray = new double[2];
		if(featureNode.get("geometry").get("coordinates").isArray()) {
			ArrayNode arrayNode = (ArrayNode) featureNode.get("geometry").get("coordinates");
			int index = 0;
			for(JsonNode node : arrayNode) {
				coordinatesArray[index] = node.asDouble();
				index++;
			}
			chargingPoint.setCoordinates(coordinatesArray);
		}
		
		return chargingPoint;
	}

	public static Poi convertPoi(String ownerId, JsonNode featureNode) {
		String id = featureNode.get("properties").get("id").asText();
		String name = featureNode.get("properties").get("name").asText();
		String description = featureNode.get("properties").get("description").asText();
		String image = featureNode.get("properties").get("image").asText();
		String category = featureNode.get("properties").get("category").asText();
		String points = featureNode.get("properties").get("points").toString();
		String when = featureNode.get("properties").get("when").toString();
		String opening = featureNode.get("properties").get("opening").toString();
		String coordinates = featureNode.get("geometry").get("coordinates").toString();
		if(Utils.isEmpty(id) || Utils.isEmpty(name) || Utils.isEmpty(description) || Utils.isEmpty(category) 
				|| Utils.isEmpty(coordinates) || Utils.isEmpty(points)) {
			return null;
		}
		
		Poi poi = new Poi();
		poi.setObjectId(id);
		poi.setOwnerId(ownerId);
		poi.setName(name);
		poi.setDescription(description);
		poi.setCategory(category);
		poi.setPoints(Integer.valueOf(points));
		
		if(Utils.isNotEmpty(image)) {
			poi.setImageUrl(image);
		}
		
		if(Utils.isNotEmpty(when)) {
			poi.setWhen(when);
		}
		
		if(Utils.isNotEmpty(opening)) {
			poi.setOpening(opening);
		}
		
		double[] coordinatesArray = new double[2];
		if(featureNode.get("geometry").get("coordinates").isArray()) {
			ArrayNode arrayNode = (ArrayNode) featureNode.get("geometry").get("coordinates");
			int index = 0;
			for(JsonNode node : arrayNode) {
				coordinatesArray[index] = node.asDouble();
				index++;
			}
			poi.setCoordinates(coordinatesArray);
		}
		
		return poi;
	}
	
}
