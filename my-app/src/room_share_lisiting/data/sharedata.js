import room1 from "../assets/room1.jpg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.htm";

const roomShareData = [
  {
    id: 1,
    title: "Looking for a roommate near IIT",
    location: "Colombo 07",
    rent: 25000,
    gender: "any",
    description: "Fully furnished room with shared kitchen.",
    image: room1,
    latitude: 6.9011,   
    longitude: 79.8612
  },
  {
    id: 2,
    title: "Roommate needed – female only",
    location: "Dehiwala",
    rent: 20000,
    gender: "male",
    description: "Calm environment, close to bus routes.",
    image: room2,
    latitude: 6.8418,   
    longitude: 79.8670
  },
  {
    id: 3,
    title: "Shared apartment near university",
    location: "Malabe",
    rent: 35000,
    gender: "female",
    description: "Ideal for students, WiFi included.",
    image: room3,
    latitude: 6.9270,   
    longitude: 79.9925
  },
  {
    id: 4,
    title: "Shared apartment near school",
    location: "Colombo",
    rent: 24000,
    gender: "any",
    description: "Ideal for students, WiFi included.",
    image: "",
    latitude: 6.9271,   
    longitude: 79.8612
  }
];

export default roomShareData;
