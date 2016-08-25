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
package it.smartcommunitylab.tocati.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

import eu.trentorise.smartcampus.aac.model.TokenData;

/**
 * @author raman
 *
 */
public class LoginData implements Serializable {
	private static final long serialVersionUID = -2910531818686092824L;
	
	private TokenData tokenData;
	private String username;
	@Id
	private String userAACId;

	public LoginData() {
		super();
	}
	/**
	 * @param username
	 * @param tokenData
	 */
	public LoginData(String username, String userAACId, TokenData tokenData) {
		this.username = username;
		this.tokenData = tokenData;
		this.userAACId = userAACId;
	}
	public TokenData getTokenData() {
		return tokenData;
	}
	public void setTokenData(TokenData tokenData) {
		this.tokenData = tokenData;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getUserAACId() {
		return userAACId;
	}
	public void setUserId(String userAACId) {
		this.userAACId = userAACId;
	}
	
}
