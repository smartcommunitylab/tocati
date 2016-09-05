/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
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
 ******************************************************************************/
package it.smartcommunitylab.tocati.security;

import it.smartcommunitylab.tocati.common.Utils;
import it.smartcommunitylab.tocati.model.UserData;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * @author raman
 *
 */
@Service
public class GOEvWayAuthenticator {

	private static final transient Logger logger = LoggerFactory.getLogger(GOEvWayAuthenticator.class);

	@Autowired
	@Value("${evway.apitoken}")
	private String apitoken;


	public UserData login(String username, String password, String lang) throws Exception {
		UserData result = new UserData();

		result.setLanguage(lang);
		result.setEmail(username);
		result.setDisplayName(username);
		result.setObjectId(Utils.getUUID());

		Map<String, String> params = new HashMap<String, String>();
		params.put("username", username);
		params.put("password", password);
		params.put("language", lang);
		String res = sendPost("https://evway.net/api/v2/userLogin", params);
		if (res == null) return null;

		JsonNode node = Utils.readJsonFromString(res);
		if (node.get("status").get("errorCode").asInt() > 0) {
			logger.error("Error in login: "+ res);
			return null;
		}

		JsonNode user = node.get("data").get("user");
		result.setUserId(user.get("userid").asText());
		result.getCustomData().put("token", user.get("token").asText());

		return result;
	}



	/**
	 * @param email
	 * @return
	 * @throws Exception 
	 */
	public String resetPwd(String email) throws Exception {
		Map<String, String> params = new HashMap<String, String>();
		params.put("email", email);
		String res = sendPost("https://evway.net/api/v2/userResetPassword", params);
		if (res == null) return null;

		JsonNode node = Utils.readJsonFromString(res);
		if (node.get("status").get("errorCode").asInt() > 0) {
			logger.error("Error in register: "+ res);
			return null;
		}
		return "ok";
	}
	
	public UserData register(String username, String password, String lang) throws Exception {
		UserData result = new UserData();

		result.setLanguage(lang);
		result.setEmail(username);
		result.setDisplayName(username);
		result.setObjectId(Utils.getUUID());

		Map<String, String> params = new HashMap<String, String>();
		params.put("username", username);
		params.put("email", username);
		params.put("password", password);
		params.put("language", lang);
		String res = sendPost("https://evway.net/api/v2/userRegister", params);
		if (res == null) return null;

		JsonNode node = Utils.readJsonFromString(res);
		if (node.get("status").get("errorCode").asInt() > 0) {
			logger.error("Error in register: "+ res);
			return null;
		}
		JsonNode user = node.get("data").get("user");

		result.setUserId(user.get("userid").asText());
		result.getCustomData().put("token", user.get("token").asText());
		result.getCustomData().put("evcoId", user.get("evco-id").asText());

		return result;
	}


	public String sendPost(String url, Map<String,String> params) throws Exception {

		HttpClient client =new DefaultHttpClient();
		HttpPost post = new HttpPost(url);

		post.addHeader("Auth-Key", apitoken);

		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		for (Entry<String,String> entry : params.entrySet()) {
			urlParameters.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
		}

		post.setEntity(new UrlEncodedFormEntity(urlParameters));

		HttpResponse response = client.execute(post);
		String resp = EntityUtils.toString(response.getEntity());
		if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
			return resp;
		}
		return null;
	}

}
