import {useState, useEffect} from "react";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from 'firebase/database'

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

export const useIsConnected = board => {
  const lastConnected = useLastConnected(board);
  const now = new Date();
  const epoch = now.getTime();
  // if board did not ping for over 2 seconds,
  // declare disconnected.
  return epoch - lastConnected < 2;
}

export const usePresses = board => {
  const [presses, setPresses] = useState({});
  const boardRef = ref(database, board + "/presses");
  useEffect(() => {
    onValue(boardRef, snapshot => {
      snapshot.forEach(child => {
        setPresses(old => ({...old, [child.key]: child.val()}));
      });
    });
  }, []);
  return presses;
}

