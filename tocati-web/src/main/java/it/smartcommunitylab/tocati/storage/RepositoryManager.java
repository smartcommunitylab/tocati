package it.smartcommunitylab.tocati.storage;

import it.smartcommunitylab.tocati.common.EntityNotFoundException;
import it.smartcommunitylab.tocati.model.ChargingPoint;
import it.smartcommunitylab.tocati.model.Checkin;
import it.smartcommunitylab.tocati.model.MyRanking;
import it.smartcommunitylab.tocati.model.Poi;
import it.smartcommunitylab.tocati.model.Ranking;
import it.smartcommunitylab.tocati.model.UserData;
import it.smartcommunitylab.tocati.security.DataSetInfo;
import it.smartcommunitylab.tocati.security.Token;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.GeospatialIndex;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.NearQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

public class RepositoryManager {
	private static final transient Logger logger = LoggerFactory.getLogger(RepositoryManager.class);
	
	private MongoTemplate mongoTemplate;
	private String defaultLang;
	
	public RepositoryManager(MongoTemplate template, String defaultLang) {
		this.mongoTemplate = template;
		this.defaultLang = defaultLang;
		this.mongoTemplate.indexOps(ChargingPoint.class).ensureIndex(new GeospatialIndex("coordinates"));
	}
	
	public String getDefaultLang() {
		return defaultLang;
	}

	public Token findTokenByToken(String token) {
		Query query = new Query(new Criteria("token").is(token));
		Token result = mongoTemplate.findOne(query, Token.class);
		return result;
	}
	
	public List<DataSetInfo> getDataSetInfo() {
		List<DataSetInfo> result = mongoTemplate.findAll(DataSetInfo.class);
		return result;
	}
	
	public void saveDataSetInfo(DataSetInfo dataSetInfo) {
		Query query = new Query(new Criteria("ownerId").is(dataSetInfo.getOwnerId()));
		DataSetInfo appInfoDB = mongoTemplate.findOne(query, DataSetInfo.class);
		if (appInfoDB == null) {
			mongoTemplate.save(dataSetInfo);
		} else {
			Update update = new Update();
			update.set("password", dataSetInfo.getPassword());
			update.set("token", dataSetInfo.getToken());
			mongoTemplate.updateFirst(query, update, DataSetInfo.class);
		}
	}
	
	public void saveAppToken(String name, String token) {
		Query query = new Query(new Criteria("name").is(name));
		Token tokenDB = mongoTemplate.findOne(query, Token.class);
		if(tokenDB == null) {
			Token newToken = new Token();
			newToken.setToken(token);
			newToken.setName(name);
			newToken.getPaths().add("/api");
			mongoTemplate.save(newToken);
		} else {
			Update update = new Update();
			update.set("token", token);
			mongoTemplate.updateFirst(query, update, Token.class);
		}
	}
	
	public List<?> findData(Class<?> entityClass, Criteria criteria, Sort sort, String ownerId)
			throws ClassNotFoundException {
		Query query = null;
		if (criteria != null) {
			query = new Query(new Criteria("ownerId").is(ownerId).andOperator(criteria));
		} else {
			query = new Query(new Criteria("ownerId").is(ownerId));
		}
		if (sort != null) {
			query.with(sort);
		}
		query.limit(5000);
		List<?> result = mongoTemplate.find(query, entityClass);
		return result;
	}

	public <T> T findOneData(Class<T> entityClass, Criteria criteria, String ownerId)
			throws ClassNotFoundException {
		Query query = null;
		if (criteria != null) {
			query = new Query(new Criteria("ownerId").is(ownerId).andOperator(criteria));
		} else {
			query = new Query(new Criteria("ownerId").is(ownerId));
		}
		T result = mongoTemplate.findOne(query, entityClass);
		return result;
	}
	
	public UserData addUser(UserData user) {
		Date now = new Date();
		user.setCreationDate(now);
		user.setLastUpdate(now);
		user.setPoints(0);
		user.getCheckinList().clear();
		mongoTemplate.save(user);
		return user;
	}
	
	public ChargingPoint addChargingPoint(ChargingPoint point) {
		Date now = new Date();
		point.setCreationDate(now);
		point.setLastUpdate(now);
		mongoTemplate.save(point);
		return point;
	}
	
	public Poi addPoi(Poi poi) {
		Date now = new Date();
		poi.setCreationDate(now);
		poi.setLastUpdate(now);
		mongoTemplate.save(poi);
		return poi;
	}
	
	public void cleanChargingPoint(String ownerId) {
		Query query = new Query(new Criteria("ownerId").is(ownerId));
		mongoTemplate.remove(query, ChargingPoint.class);
	}
	
	public void cleanPoi(String ownerId) {
		Query query = new Query(new Criteria("ownerId").is(ownerId));
		mongoTemplate.remove(query, Poi.class);
	}

	@SuppressWarnings("unchecked")
	public List<Poi> findPois(String ownerId, String pointId) throws ClassNotFoundException {	
		List<Poi> result = new ArrayList<Poi>();
		Criteria criteria = Criteria.where("objectId").is(pointId);
		ChargingPoint chargingPoint = findOneData(ChargingPoint.class, criteria, ownerId);
		if(chargingPoint == null) {
			return result;
		}
		Criteria searchCriteria = null;
		if(chargingPoint.getPoiList().size() > 0) {
			searchCriteria = new Criteria("objectId").in(chargingPoint.getPoiList());
		}
		result = (List<Poi>) findData(Poi.class, searchCriteria, null, ownerId);
		return result;
	}

	public UserData userCheckin(String ownerId, String userId, String pointId, String poiId) 
			throws ClassNotFoundException, EntityNotFoundException {
		Query userQuery = new Query(new Criteria("ownerId").is(ownerId).and("userId").is(userId));
		UserData userData = mongoTemplate.findOne(userQuery, UserData.class);
		if(userData == null) {
			throw new EntityNotFoundException(String.format("Profile for user %s not found", userId));
		}
		
		Criteria criteriaChargingPoint = Criteria.where("objectId").is(pointId);
		ChargingPoint chargingPoint = findOneData(ChargingPoint.class, criteriaChargingPoint, ownerId);
		if(chargingPoint == null) {
			throw new EntityNotFoundException(String.format("ChargingPoint %s not found", pointId));
		}
		
		Criteria criteriaPoi = Criteria.where("objectId").is(poiId);
		Poi poi = findOneData(Poi.class, criteriaPoi, ownerId);
		if(poi == null) {
			throw new EntityNotFoundException(String.format("Poi %s not found", poiId));
		}
		if(!chargingPoint.getPoiList().contains(poiId)) {
			throw new EntityNotFoundException(String.format("Poi %s not found in ChargingPoint %s", poiId, pointId));
		}
		//check if user has already done the checkin
		for(Checkin checkin : userData.getCheckinList()) {
			if(checkin.getPoi().getObjectId().equals(poiId)) {
				throw new EntityNotFoundException(String.format("Poi %s already checked in", poiId));
			}
		}
		
		Date now = new Date();
		
		Checkin checkin = new Checkin();
		checkin.setPoi(poi);
		checkin.setTimestamp(now);
		
		userData.getCheckinList().add(checkin);
		userData.setPoints(userData.getPoints() + poi.getPoints());
		
		Update update = new Update();
		update.set("checkinList", userData.getCheckinList());
		update.set("points", userData.getPoints());
		update.set("lastUpdate", now);
		mongoTemplate.updateFirst(userQuery, update, UserData.class);
		
		return userData;
	}

	public MyRanking getMyRanking(String ownerId, String userId, int startPage, int maxItemsPerPage) throws EntityNotFoundException {
		Query userQuery = new Query(new Criteria("ownerId").is(ownerId).and("userId").is(userId));
		UserData userData = mongoTemplate.findOne(userQuery, UserData.class);
		if(userData == null) {
			throw new EntityNotFoundException(String.format("Profile for user %s not found", userId));
		}
		Query rankQuery = new Query(new Criteria("ownerId").is(ownerId));
		rankQuery.with(new Sort(Sort.Direction.DESC, "points", "creationDate"));
		List<UserData> classification = mongoTemplate.find(rankQuery, UserData.class);
		MyRanking myRanking = new MyRanking();
		int minIndex = ((startPage -1) * maxItemsPerPage) + 1;
		int maxIndex = startPage * maxItemsPerPage;
		int index = 1;
		for(UserData user : classification) {
			if(user.getUserId().equals(userId)) {
				myRanking.setPoints(user.getPoints());
				myRanking.setPosition(index);
			}
			if((minIndex <= index) && (index <= maxIndex)) {
				Ranking ranking = new Ranking();
				ranking.setData(user);
				ranking.setPosition(index);
				ranking.setPoints(user.getPoints());
				myRanking.getRanking().add(ranking);
			}
			index++;
		}
		return myRanking;
	}

	public List<ChargingPoint> findChargingPoints(String ownerId, double[] position, double radius) {
		List<ChargingPoint> result = new ArrayList<ChargingPoint>();
		if((position != null) && (position.length == 2) && (radius >= 0)) {
			Point location = new Point(position[0], position[1]);
			NearQuery query = NearQuery.near(location).maxDistance(new Distance(radius, Metrics.KILOMETERS));
			query.query(Query.query(Criteria.where("ownerId").is(ownerId)));
			GeoResults<ChargingPoint> geoNear = mongoTemplate.geoNear(query, ChargingPoint.class);
			for(GeoResult<ChargingPoint> geoResult : geoNear.getContent()) {
				result.add(geoResult.getContent());
			}
		} else {
			Criteria criteria = new Criteria("ownerId").is(ownerId);
			Query query = new Query(criteria);
			result = mongoTemplate.find(query, ChargingPoint.class);
		}
		return result;
	}
}
