/**
 *    Copyright 2015 Fondazione Bruno Kessler - Trento RISE
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package it.smartcommunitylab.tocati.controller;

import it.smartcommunitylab.tocati.common.UnauthorizedException;
import it.smartcommunitylab.tocati.common.Utils;
import it.smartcommunitylab.tocati.converter.Converter;
import it.smartcommunitylab.tocati.model.ChargingPoint;
import it.smartcommunitylab.tocati.model.Poi;
import it.smartcommunitylab.tocati.security.DataSetInfo;
import it.smartcommunitylab.tocati.storage.DataSetSetup;
import it.smartcommunitylab.tocati.storage.RepositoryManager;

import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.databind.JsonNode;


@Controller
public class AdminController {
	private static final transient Logger logger = LoggerFactory.getLogger(AdminController.class);
			
	@Autowired
	private RepositoryManager storage;

	@Autowired
	private DataSetSetup dataSetSetup;
	
	@RequestMapping(method = RequestMethod.GET, value = "/ping")
	public @ResponseBody
	String ping(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		return "PONG";
	}
	
	@RequestMapping(value = "/dataset/{ownerId}", method = RequestMethod.POST)
	public @ResponseBody String updateDataSetInfo(@RequestBody DataSetInfo dataSetInfo, 
			@PathVariable String ownerId, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		storage.saveAppToken(dataSetInfo.getOwnerId(), dataSetInfo.getToken());
		storage.saveDataSetInfo(dataSetInfo);
		dataSetSetup.init();
		if(logger.isInfoEnabled()) {
			logger.info("add dataSet");
		}
		return "{\"status\":\"OK\"}";
	}
	
	@RequestMapping(value = "/reload/{ownerId}", method = RequestMethod.GET)
	public @ResponseBody String reload(@PathVariable String ownerId, 
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		dataSetSetup.init();
		if(logger.isInfoEnabled()) {
			logger.info("reload dataSet");
		}
		return "{\"status\":\"OK\"}";
	}
	
	@RequestMapping(value = "/import/chargingPoints/{ownerId}/{datasetId}", method = RequestMethod.POST)
	public @ResponseBody String importChargingPoint(@PathVariable String ownerId, @PathVariable String datasetId,
			@RequestBody String geoJson, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("importChargingPoint[%s]", datasetId));
		}
		JsonNode rootNode = Utils.readJsonFromString(geoJson);
		storage.cleanChargingPoint(datasetId);
		Iterator<JsonNode> elements = rootNode.get("features").elements();
		while(elements.hasNext()) {
			JsonNode featureNode = elements.next();
			ChargingPoint chargingPoint = Converter.convertChargingPoint(datasetId, featureNode);
			if(chargingPoint != null) {
				storage.addChargingPoint(chargingPoint);
			}
		}
		return "{\"status\":\"OK\"}";
	}

	@RequestMapping(value = "/import/pois/{ownerId}/{datasetId}", method = RequestMethod.POST)
	public @ResponseBody String importPoi(@PathVariable String ownerId, @PathVariable String datasetId,
			@RequestBody String geoJson, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("importPoi[%s]", datasetId));
		}
		JsonNode rootNode = Utils.readJsonFromString(geoJson);
		storage.cleanPoi(datasetId);
		Iterator<JsonNode> elements = rootNode.get("features").elements();
		while(elements.hasNext()) {
			JsonNode featureNode = elements.next();
			Poi poi = Converter.convertPoi(datasetId, featureNode);
			if(poi != null) {
				storage.addPoi(poi);
			}
		}
		return "{\"status\":\"OK\"}";
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public Map<String,String> handleError(HttpServletRequest request, Exception exception) {
		exception.printStackTrace();
		return Utils.handleError(exception);
	}
	
}
