import React, { useState } from 'react';
import './App.css';

// Main Component
const ReservationForm = () => {
  const [reservationDetails, setReservationDetails] = useState({}); // State for reservation details

  const handleChange = (e) => {
    setReservationDetails({
      ...reservationDetails,
      [e.target.name]: e.target.value // Using computed property names to handle multiple input fields
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if the number of people and customers is less than or equal to the maximum allowed
    const room = reservationDatas.find(room => room.RoomNo === reservationDetails.RoomNo);
    if (room && parseInt(room.Persons) >= parseInt(reservationDetails.numberOfPeople)) {
      // Format the output
      const formattedOutput = reservationDetails.RoomNo + " " + room.RoomName + " " + reservationDetails.numberOfPeople + " " + room.Prices;
      
      // Display the formatted output
      alert(formattedOutput);

      // Reset the form fields after submission
      setReservationDetails({});
    } else {
      alert("The number of people exceeds the maximum allowed for this room.");
    }
  };

  // 예약 정보 데이터
  const reservationDatas = [
    { RoomName: "Lemon", RoomNo: "101", Persons: "2", Hours: "10:00" ,Prices:"55000"},
    { RoomName: "Ocean", RoomNo: "102", Persons: "3", Hours: "14:30" ,Prices:"30000"},
    { RoomName: "Cloud", RoomNo: "103", Persons: "2", Hours:"16.00",  Prices:"65000"},
    { RoomName:"React" ,RoomNo:"104" ,Hours:"16.00",Persons:"4",Prices:"98000"}
  ];

  // 방 조회 함수
  const handleRoomSearch = () => {
    const popup = window.open('', 'Room Search', 'width=400,height=400');
    if (popup) {
      // 팝업 창 내용 작성
      popup.document.write(`
        <html>
          <head>
            <title>Room Search</title>
          </head>
          <body>
            <h2>Room Search</h2>
            <p>팝업 창 내용</p>
          </body>
        </html>
      `);
      popup.document.close();
    } else {
      alert("Please enable pop-ups for this site to proceed with the room search.");
    }
  };

  return (
    <>
      <h2>Meeting Rooms Reservation</h2>
      <h2>예약 가능한 미팅룸 리스트</h2>
      <table>
        <thead>
          <tr>
            <th>Room No</th>
            <th>Room Name</th>
            <th>Persons</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {reservationDatas.map((reservationData, index) => (
            <tr key={index}>
              <td>{reservationData.RoomNo}</td>
              <td>{reservationData.RoomName}</td>
              <td>{reservationData.Persons}</td>
              <td>{reservationData.Prices}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleRoomSearch}>방 조회</button>

      {/* 예약 양식 */}
      <form onSubmit={handleSubmit}>
        <label>룸 번호 : 
          <input type="text" name="RoomNo" className="submit-button" value={reservationDetails.RoomNo || ''} onChange={handleChange} />
        </label><br/>
        <label>고객명 :
          <input type="text" name="name" className="submit-button" value={reservationDetails.name || ''} onChange={handleChange} />
        </label><br/>
        <label>인원수 : 
          <input type="number" name="numberOfPeople" className="submit-button" value={reservationDetails.numberOfPeople || ''} onChange={handleChange} min="0" />
        </label><br/>
        <label>예약 시간 : 
          <input type="time" name="useTime" className="submit-button" value={reservationDetails.useTime || ''} onChange={handleChange} style={{width: '6.3rem'}}/>
        </label><br/>
        <button type="submit">Submit</button>
      </form>

      {/* 매칭된 예약 표시 */}
    </>
  );
};

export default ReservationForm;