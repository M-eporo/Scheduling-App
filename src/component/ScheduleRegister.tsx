import React, { useState } from 'react'
import Input from './Input'

const Scheduleregister = () => {
  const [form, setForm] = useState({
    title: "",
    allDay: false,
    startTime: "",
    endTime: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="タイトル"
        name="title"
        id="title"
        value={form}
        onChange={handleChange}
      />
      <Input
        type="checkbox"
        placeholder="終日"
        name="allDay"
        id="allDay"
        value={form}
        onChange={handleChange}
      />
      <Input
        type="time"
        placeholder="開始時間"
        name="startTime"
        id="startTime"
        value={form}
        onChange={handleChange}
      />
      <Input
        type="time"
        placeholder="終了時間"
        name="endTime"
        id="endTime"
        value={form}
        onChange={handleChange}
      />
    </div>
  )
};

export default Scheduleregister;