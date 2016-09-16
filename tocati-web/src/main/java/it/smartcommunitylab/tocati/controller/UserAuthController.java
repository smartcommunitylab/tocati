/**
 * Copyright 2015 Smart Community Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package it.smartcommunitylab.tocati.controller;

import it.smartcommunitylab.tocati.common.UnauthorizedException;
import it.smartcommunitylab.tocati.common.Utils;
import it.smartcommunitylab.tocati.model.LoginData;
import it.smartcommunitylab.tocati.model.RegUser;
import it.smartcommunitylab.tocati.model.UserData;
import it.smartcommunitylab.tocati.security.AppUserDetails;
import it.smartcommunitylab.tocati.security.GOEvWayAuthenticator;
import it.smartcommunitylab.tocati.security.PermissionsManager;
import it.smartcommunitylab.tocati.storage.DataSetSetup;
import it.smartcommunitylab.tocati.storage.RepositoryManager;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import eu.trentorise.smartcampus.aac.AACException;
import eu.trentorise.smartcampus.aac.model.TokenData;
import eu.trentorise.smartcampus.network.JsonUtils;
import eu.trentorise.smartcampus.profileservice.model.BasicProfile;

@Controller
public class UserAuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(UserAuthController.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private RepositoryManager storageManager;

	@Autowired
	private DataSetSetup dataSetSetup;

	@Autowired
	private PermissionsManager permissions;

	@Autowired
	private GOEvWayAuthenticator evwayAuth;

	@RequestMapping("/userlogin/{ownerId}")
	public void login(@PathVariable String ownerId, HttpServletRequest request, HttpServletResponse response) throws IOException, UnauthorizedException {
//		if(!Utils.validateAPIRequest(request, dataSetSetup, storageManager)) {
//			throw new UnauthorizedException("Unauthorized Exception: token not valid");
//		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("userAuth[%s]", ownerId));
		}

		request.getSession().setAttribute("ownerId", ownerId);

		response.sendRedirect(permissions.getAuthorizationURL(null));
	}
	@RequestMapping("/userlogin/{ownerId}/{authority}")
	public void loginAuthority(@PathVariable String ownerId, @PathVariable String authority, @RequestParam(required=false) String token, HttpServletRequest request, HttpServletResponse response) throws IOException, UnauthorizedException {
//		if(!Utils.validateAPIRequest(request, dataSetSetup, storageManager)) {
//			throw new UnauthorizedException("Unauthorized Exception: token not valid");
//		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("userAuth[%s]", ownerId));
		}

		request.getSession().setAttribute("ownerId", ownerId);


		String url = permissions.getAuthorizationURL("/"+authority);
		if (token != null) {
			url += "&token="+token;
		}
		response.sendRedirect(url);
	}
	@RequestMapping("/userlogininternal")
	public @ResponseBody BasicProfile loginInternal(@RequestParam String email, @RequestParam String password, HttpServletRequest request, HttpServletResponse response) throws IOException {
		String url = permissions.getLoginURL(email, password);

		try {
			HttpResponse postResult = Utils.postJSON(url, "");
			int status = postResult.getStatusLine().getStatusCode();
			if (status == 200) {
				String str = EntityUtils.toString(postResult.getEntity(),"UTF-8");
				TokenData data = TokenData.valueOf(str);
				return permissions.authenticate(request, response, data, true);
			}
			response.setStatus(status);
		} catch (Exception e) {
			response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
		}
		return null;
	}

	@RequestMapping("/{ownerId}/userregisterevway")
	public @ResponseBody UserData registerEVWay(@PathVariable String ownerId, @RequestParam String email, @RequestParam String password, @RequestParam String language, @RequestParam(required=false) String name, @RequestParam(required=false) String surname, HttpServletRequest request, HttpServletResponse response) throws IOException, UnauthorizedException {
//		if(!Utils.validateAPIRequest(request, dataSetSetup, storageManager)) {
//			throw new UnauthorizedException("Unauthorized Exception: token not valid");
//		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("loginEVWay[%s] register: %s", ownerId, email));
		}

		try {
			UserData userData = evwayAuth.register(email, password, language);
			if (userData == null) {
				response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
				return null;
			}

			userData.setOwnerId(ownerId);
			userData.setDisplayName(email);
			userData.setName(name);
			userData.setSurname(surname);

			Criteria criteria = Criteria.where("userId").is(userData.getUserId());
			UserData userDB = storageManager.findOneData(UserData.class, criteria, userData.getOwnerId());
			if(userDB == null) {
				userData.setObjectId(Utils.getUUID());
				userData = storageManager.addUser(userData);
			} else {
				response.setStatus(HttpStatus.SC_CONFLICT);
				return null;
			}
			return userData;

		} catch (Exception e) {
			response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
		}
		return null;
	}
	@RequestMapping("/{ownerId}/userloginevway")
	public @ResponseBody UserData loginEVWay(@PathVariable String ownerId, @RequestParam String email, @RequestParam String password, @RequestParam String language, HttpServletRequest request, HttpServletResponse response) throws IOException, UnauthorizedException {
//		if(!Utils.validateAPIRequest(request, dataSetSetup, storageManager)) {
//			throw new UnauthorizedException("Unauthorized Exception: token not valid");
//		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("loginEVWay[%s] login: %s", ownerId, email));
		}

		try {
			UserData userData = evwayAuth.login(email, password, language);
			if (userData == null) {
				response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
				return null;
			}

			userData.setOwnerId(ownerId);
			userData.setDisplayName(email);

			Criteria criteria = Criteria.where("userId").is(userData.getUserId());
			UserData userDB = storageManager.findOneData(UserData.class, criteria, userData.getOwnerId());
			if(userDB == null) {
				userData.setObjectId(Utils.getUUID());
				userData = storageManager.addUser(userData);
			} else {
				userData = userDB;
			}

			LoginData loginData = new LoginData(email, userData.getUserId(), null);
			UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
					email, loginData, AppUserDetails.TOCATI_AUTHORITIES);

			token.setDetails(new WebAuthenticationDetails(request));
			Authentication authenticatedUser = authenticationManager.authenticate(token);
			SecurityContextHolder.getContext().setAuthentication(authenticatedUser);

			return userData;

		} catch (Exception e) {
			response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
		}
		return null;
	}
	
	@RequestMapping("/{ownerId}/resetpwdevway")
	public @ResponseBody String resetPwdEVWay(@PathVariable String ownerId, @RequestParam String email, HttpServletRequest request, HttpServletResponse response) throws IOException, UnauthorizedException {
//		if(!Utils.validateAPIRequest(request, dataSetSetup, storageManager)) {
//			throw new UnauthorizedException("Unauthorized Exception: token not valid");
//		}
		if(logger.isInfoEnabled()) {
			logger.info(String.format("loginEVWay[%s]", ownerId));
		}

		try {
			String result = evwayAuth.resetPwd(email);
			if (result == null) {
				response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
				return null;
			}
			return result;

		} catch (Exception e) {
			response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
		}
		return null;
	}
	
	@RequestMapping(value="/register", method=RequestMethod.POST)
	public void register(@RequestBody RegUser user, HttpServletResponse response) {
		String url = permissions.getRegisterURL();
		try {
			int result = Utils.postJSON(url, new ObjectMapper().writeValueAsString(user)).getStatusLine().getStatusCode();
			response.setStatus(result);
		} catch (Exception e) {
			response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
			e.printStackTrace();
		}
	}
	/**
	 * This is a callback for the external AAC OAuth2.0 authentication.
	 * Exchanges code for token, recover the profile and creates the user.
	 *
	 * @param request
	 * @param response
	 * @throws AACException
	 * @throws SecurityException
	 * @throws IOException
	 */
	@RequestMapping("/ext_callback")
	public void callback(HttpServletRequest request, HttpServletResponse response) {
		try {
			TokenData tokenData = permissions.codeToToken(request.getParameter("code"));
					
			BasicProfile basicProfile = permissions.authenticate(request, response, tokenData, true);
			if(logger.isInfoEnabled()) {
				logger.info("ext_callback:" + basicProfile.getName() + " " + basicProfile.getSurname() + " - " + basicProfile.getUserId());
			}

			UserData user = new UserData();

			user.setOwnerId((String)request.getSession().getAttribute("ownerId"));
			user.setUserId(basicProfile.getUserId());
			user.setName(basicProfile.getName());
			user.setSurname(basicProfile.getSurname());
			String email = permissions.getUserId();
			user.setDisplayName(email);

			Criteria criteria = Criteria.where("userId").is(user.getUserId());
			UserData userDB = storageManager.findOneData(UserData.class, criteria, user.getOwnerId());
			if(userDB == null) {
				user.setObjectId(Utils.getUUID());
				user = storageManager.addUser(user);
			} else {
				user = userDB;
			}
			response.sendRedirect("userloginsuccess?profile="
					+ URLEncoder.encode(JsonUtils.toJSON(basicProfile), "UTF-8"));
		} catch (Exception e) {
			try {
				response.sendRedirect("userloginerror?error=" + e.getMessage());
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
	}

	@RequestMapping("/userloginsuccess")
	public String success(HttpServletRequest request, HttpServletResponse response) throws IOException {
		return "userloginsuccess";
	}

	@RequestMapping("/userloginerror")
	public String error(HttpServletRequest request, HttpServletResponse response) throws IOException {
		return "userloginerror";
	}
}
