package it.smartcommunitylab.tocati.game;

import it.smartcommunitylab.tocati.common.HTTPUtils;
import it.smartcommunitylab.tocati.common.Utils;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.google.common.collect.Maps;

public class GamificationEngineManager {
	private static final transient Logger logger = LoggerFactory.getLogger(GamificationEngineManager.class);
	
	@Autowired
	@Value("${gamification.user}")
	private String gamificationUser;

	@Autowired
	@Value("${gamification.password}")
	private String gamificationPassword;
	
	@Autowired
	@Value("${gamification.url}")
	private String gamificationURL;
	
	@Autowired
	@Value("${gamification.action}")
	private String actionName;
	
	@Autowired
	@Value("${gamification.score}")
	private String scoreName;
	
	public void sendScores(String gameId, String userId, int score) {
		if(Utils.isNotEmpty(gameId) && Utils.isNotEmpty(userId)) {
			String address = gamificationURL + "/gengine/execute";
			
			ExecutionDataDTO ed = new ExecutionDataDTO();
			ed.setGameId(gameId);
			ed.setPlayerId(userId);
			ed.setActionId(actionName);
			
			Map<String, Object> data = Maps.newTreeMap();
			data.put(scoreName, score);
			ed.setData(data);
			try {
				
				HTTPUtils.post(address, ed, null, gamificationUser, gamificationPassword);
			} catch (Exception e) {
				logger.error("sendScores error", e);
			}
		}
	}
}
