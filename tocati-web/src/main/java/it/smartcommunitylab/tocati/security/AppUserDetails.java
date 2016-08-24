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

package it.smartcommunitylab.tocati.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AppUserDetails implements UserDetails {
	private static final long serialVersionUID = 6683382113206745598L;
	public static final String TOCATI = "TOCATI";
	public static final Collection<? extends GrantedAuthority> TOCATI_AUTHORITIES = Collections.singletonList(new SimpleGrantedAuthority(TOCATI));
	
	private String user;
	
	/**
	 * @param username
	 */
	public AppUserDetails(String username) {
		this.user = username;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.unmodifiableCollection(TOCATI_AUTHORITIES);
	}

	@Override
	public String getPassword() {
		return user;
	}

	@Override
	public String getUsername() {
		return user;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	/**
	 * @param authentication
	 * @return
	 */
	public static boolean isAppUser(Authentication authentication) {
		if (authentication.getAuthorities() == null || authentication.getAuthorities().isEmpty()) {
			return false;
		}
		for (GrantedAuthority a : authentication.getAuthorities()) {
			if (a.getAuthority().equals(TOCATI)) {
				return true;
			}
		}
		return false;
	}

}
