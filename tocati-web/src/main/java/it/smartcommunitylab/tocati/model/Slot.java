package it.smartcommunitylab.tocati.model;

import java.util.Date;
import java.util.List;

import com.google.common.collect.Lists;

public class Slot {
	private Date date;
	private List<TimeSlot> slots = Lists.newArrayList();
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public List<TimeSlot> getSlots() {
		return slots;
	}
	public void setSlots(List<TimeSlot> slots) {
		this.slots = slots;
	}
}
