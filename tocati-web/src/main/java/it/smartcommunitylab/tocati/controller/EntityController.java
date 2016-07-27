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

import it.smartcommunitylab.tocati.common.EntityNotFoundException;
import it.smartcommunitylab.tocati.common.UnauthorizedException;
import it.smartcommunitylab.tocati.common.Utils;
import it.smartcommunitylab.tocati.model.ChargingPoint;
import it.smartcommunitylab.tocati.model.Poi;
import it.smartcommunitylab.tocati.model.UserData;
import it.smartcommunitylab.tocati.storage.DataSetSetup;
import it.smartcommunitylab.tocati.storage.RepositoryManager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@Controller
public class EntityController {
	private static final transient Logger logger = LoggerFactory.getLogger(EntityController.class);
	
	@Autowired
	private RepositoryManager storage;

	@Autowired
	private DataSetSetup dataSetSetup;
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/api/users/{ownerId}", method = RequestMethod.GET)
	public @ResponseBody List<UserData> getUsers(@PathVariable String ownerId, 
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		List<UserData> result = (List<UserData>) storage.findData(UserData.class, null, null, ownerId);
		if(logger.isInfoEnabled()) {
			logger.info(String.format("getUsers[%s]:%d", ownerId, result.size()));
		}
		return result;
	}
	
	@RequestMapping(value = "/api/users/{ownerId}/{userId}", method = RequestMethod.GET)
	public @ResponseBody UserData getUser(@PathVariable String ownerId, @PathVariable String userId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		Criteria criteria = Criteria.where("userId").is(userId);
		UserData result = storage.findOneData(UserData.class, criteria, ownerId);
		if(logger.isInfoEnabled()) {
			logger.info(String.format("getUser[%s]:%s", ownerId, userId));
		}
		if(result == null) {
			throw new EntityNotFoundException(String.format("Profile for user %s not found", userId));
		}
		return result;
	}
	
	@RequestMapping(value = "/api/users/{ownerId}/{userId}/login", method = RequestMethod.POST)
	public @ResponseBody UserData userLogin(@RequestBody UserData user, @PathVariable String ownerId, 
			@PathVariable String userId, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("userLogin[%s]:%s", ownerId, user.getDisplayName()));
		}
		UserData result = null;
		
		user.setOwnerId(ownerId);
		user.setUserId(userId);
		
		Criteria criteria = Criteria.where("userId").is(userId);
		UserData userDB = storage.findOneData(UserData.class, criteria, ownerId);
		if(userDB == null) {
			user.setObjectId(Utils.getUUID());
			result = storage.addUser(user);
		} else {
			result = userDB;
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/api/chargingPoints/{ownerId}", method = RequestMethod.GET)
	public @ResponseBody List<ChargingPoint> getChargingPoints(@PathVariable String ownerId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("getChargingPoints[%s]", ownerId));
		}
		List<ChargingPoint> result = null;
		//TODO geoquery 
		result = (List<ChargingPoint>) storage.findData(ChargingPoint.class, null, null, ownerId);
		return result;
	}

	@RequestMapping(value = "/api/chargingPoints/{ownerId}/{pointId}/pois", method = RequestMethod.GET)
	public @ResponseBody List<Poi> getPois(@PathVariable String ownerId, @PathVariable String pointId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("getChargingPoints[%s]", ownerId));
		}
		List<Poi> result = null;
		result = storage.findPois(ownerId, pointId);
		return result;
	}
	
	@RequestMapping(value = "/api/chargingPoints/{ownerId}/{userId}/{pointId}/pois/{poiId}/checkin", method = RequestMethod.GET)
	public @ResponseBody UserData checkin(@PathVariable String ownerId, @PathVariable String userId, 
			@PathVariable String pointId, @PathVariable String poiId,	
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("checkin[%s] - %s - %s - %s", ownerId, userId, pointId, poiId));
		}
		UserData result = null;
		result = storage.userCheckin(ownerId, userId, pointId, poiId);
		return result;
	}
		
	@ExceptionHandler(EntityNotFoundException.class)
	@ResponseStatus(value=HttpStatus.BAD_REQUEST)
	@ResponseBody
	public Map<String,String> handleEntityNotFoundError(HttpServletRequest request, Exception exception) {
		return Utils.handleError(exception);
	}
	
	@ExceptionHandler(UnauthorizedException.class)
	@ResponseStatus(value=HttpStatus.FORBIDDEN)
	@ResponseBody
	public Map<String,String> handleUnauthorizedError(HttpServletRequest request, Exception exception) {
		return Utils.handleError(exception);
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public Map<String,String> handleGenericError(HttpServletRequest request, Exception exception) {
		return Utils.handleError(exception);
	}
	
}
