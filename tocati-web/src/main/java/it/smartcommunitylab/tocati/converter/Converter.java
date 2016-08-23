package it.smartcommunitylab.tocati.converter;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import it.smartcommunitylab.tocati.common.Utils;
import it.smartcommunitylab.tocati.model.ChargingPoint;
import it.smartcommunitylab.tocati.model.Poi;
import it.smartcommunitylab.tocati.model.Slot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class Converter {
	private static final transient Logger logger = LoggerFactory.getLogger(Converter.class);
	
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
		String address = featureNode.get("properties").get("address").asText();
		String image = featureNode.get("properties").get("image").asText();
		String category = featureNode.get("properties").get("category").asText();
		String points = featureNode.get("properties").get("points").toString();
		JsonNode when = featureNode.get("properties").get("when");
		String coordinates = featureNode.get("geometry").get("coordinates").toString();
		if(Utils.isEmpty(id) || Utils.isEmpty(name) || Utils.isEmpty(description) || Utils.isEmpty(category) 
				|| Utils.isEmpty(address) || Utils.isEmpty(coordinates) || Utils.isEmpty(points)) {
			return null;
		}
		
		Poi poi = new Poi();
		poi.setObjectId(id);
		poi.setOwnerId(ownerId);
		poi.setName(name);
		poi.setDescription(description);
		poi.setAddress(address);
		poi.setCategory(category);
		poi.setPoints(Integer.valueOf(points));
		
		if(Utils.isNotEmpty(image)) {
			poi.setImageUrl(image);
		}
		
		if((when != null) && (when.isArray())) {
			Iterator<JsonNode> elements = when.elements();
			while(elements.hasNext()) {
				JsonNode slotNode = elements.next();
				try {
					Slot slot = Utils.toObject(slotNode, Slot.class);
					poi.getWhen().add(slot);
				} catch (JsonProcessingException e) {
					logger.warn("convertPoi:" + e.getMessage());
				}
			}
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
