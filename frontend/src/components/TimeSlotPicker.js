import React from 'react';

export default function TimeSlotPicker({ slots, selected, onSelect }) {
  if (!slots || slots.length === 0)
    return <p style={{ color:'#999', fontSize:13, textAlign:'center', padding:'20px 0' }}>No available slots for this day.</p>;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(90px, 1fr))', gap:10 }}>
      {slots.map((slot) => {
        const isSelected = selected === slot.time;
        const base = {
          padding:'10px 8px', borderRadius:12, fontSize:13, fontWeight:600,
          border:'1.5px solid', textAlign:'center', transition:'all 0.18s', cursor: slot.available ? 'pointer' : 'not-allowed'
        };
        if (!slot.available) return (
          <div key={slot.time} style={{ ...base, borderColor:'#EBEBEB', background:'#F8F8F8', color:'#CCC', textDecoration:'line-through' }}>
            {slot.time}
          </div>
        );
        if (isSelected) return (
          <div key={slot.time} style={{ ...base, borderColor:'#5B2EFF', background:'#5B2EFF', color:'#fff' }} onClick={() => onSelect(slot.time)}>
            {slot.time}
          </div>
        );
        return (
          <div key={slot.time} style={{ ...base, borderColor:'#EBEBEB', background:'#fff', color:'#1A1A1A' }}
            onClick={() => onSelect(slot.time)}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#5B2EFF'; e.currentTarget.style.color='#5B2EFF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#EBEBEB'; e.currentTarget.style.color='#1A1A1A'; }}>
            {slot.time}
          </div>
        );
      })}
    </div>
  );
}
