import {useState, useEffect} from "react";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyABl_UJRO3JkxAhHKfxys7xxDQHMSz4exg",
  authDomain: "mirrored-object.firebaseapp.com",
  databaseURL: "https://mirrored-object-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mirrored-object",
  storageBucket: "mirrored-object.appspot.com",
  messagingSenderId: "947634420073",
  appId: "1:947634420073:web:010e4876085fc6347965f8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



export const useTotalPresses = board => {
  const [count, setCount] = useState(0);  
  const boardRef = ref(database, board + "/total_presses");
  useEffect(() => {
    onValue(boardRef, snapshot => {
      const presses = snapshot.val();
      setCount(presses);
    });
  }, []);
  return count;
}

// in epoch time
export const useLastConnected = board => {
  const [lastConnected, setLastConnected] = useState(0);
  const boardRef = ref(database, board + "/last_connected");
  useEffect(() => {
    onValue(boardRef, snapshot => {
      const epoch = snapshot.val();
      setLastConnected(epoch);
    })
  }, []);
  return lastConnected;
}

export const useConnectedDelta = board => {
  const [seconds, setSeconds] = useState(Infinity);
  useEffect(() => {
    const interval = setInterval(() => {
    const date = new Date();
    const time = date.getTime() / 1000;
    setSeconds(time);
  }, 1000);

  return () => clearInterval(interval);
  }, []);

  const lastConnected = useLastConnected(board);
  return seconds - lastConnected;
}

export const getPresses = async (board, setter) => {
    const boardRef = ref(database, board + "/presses");
    let presses = {};
    await get(boardRef).then((snapshot) => {
      if (snapshot.exists()) {
        // Optional: Log each child if needed
        snapshot.forEach((child) => {
          presses[child.child('timeStamp').val()] = child.child('pressesCount').val();
        });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("Error getting data:", error);
    }); // Runs once if 'board' doesn't change

  setter(presses);
}


