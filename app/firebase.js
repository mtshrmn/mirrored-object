import {useState, useEffect} from "react";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, query, onChildAdded, get, startAt, orderByChild } from 'firebase/database'


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
export const useLastConnected = (cube) => {
  const [lastConnected, setLastConnected] = useState(0);
  // Assuming 'cube' is the cube identifier like 'cube_a'
  const boardRef = ref(database, `${cube}/last_connected`);

  useEffect(() => {
    const unsubscribe = onValue(boardRef, (snapshot) => {
      const epoch = snapshot.val();
      setLastConnected(epoch);
    });

    return () => unsubscribe();
  }, [cube]);

  return lastConnected;
};

export const useCurrentState = (cube) => {
  const [currentState, setCurrentState] = useState('');

  const stateRef = ref(database, `${cube}/state`);

  useEffect(() => {
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state  === 5) {
        setCurrentState(2);
      } else if (state === 6){
        setCurrentState(4);
      } else {
        setCurrentState(state); // Assuming the state is directly the value you need
      }
    });

    return () => unsubscribe();
  }, [cube]);

  return currentState;
};



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

export const useHistory = board => {
  const [initialLastKey, setInitialLastKey] = useState(null);
  const [history, setHistory] = useState({});
  const [shouldUpdateHistory, setShouldUpdateHistory] = useState(false);
  
  const boardRef = query(ref(database, board + "/state_and_time"), orderByChild("timeStamp"));
  useEffect(() => {
    console.log(initialLastKey);
    if (initialLastKey === null) {
      get(boardRef).then(snapshot => {
        const data = snapshot.toJSON();
        const values = Object.values(data);
        const keys = Object.keys(data);
        const historyData = Object.fromEntries(
            values.map(
              child => {
                if (child["state"] === 5) {
                  return [child["timeStamp"], 2];
                }
                if (child["state"] === 6) {
                  return [child["timeStamp"], 4];
                }
                return [child["timeStamp"], child["state"]];
              }
        ));
        delete historyData["0"];
        setHistory(historyData);
        console.log("setting initial time" + values[values.length - 1]["timeStamp"]);
        setInitialLastKey(parseInt(values[values.length - 1]["timeStamp"]));
      }).catch(error => {
          console.error(`${board}: error fetching database, reason "${error}"`)
        });
      return () => {};
    }    


    console.log("setting up onChildAdded hook");
    onChildAdded(boardRef, snapshot => {
      console.log(" " + snapshot.child("timeStamp").val() + " " + initialLastKey);
      if (parseInt(snapshot.child("timeStamp").val()) >= parseInt(initialLastKey)) {
        console.log("child added");
        const rawState = snapshot.child("state").val();
        const state = rawState === 5 ? 2 : rawState === 6 ? 4 : rawState;
        setHistory(oldHistory => ({...oldHistory, [snapshot.child("timeStamp").val()]: state}));
      }
    });
  }, [initialLastKey]);

  return history;
};


