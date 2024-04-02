import {useState, useEffect} from "react";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, query, onChildAdded, get, startAt } from 'firebase/database'

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

export const useHistory = board => {
  const [initialLastKey, setInitialLastKey] = useState(null);
  const [history, setHistory] = useState({});
  
  const boardRef = ref(database, board + "/state_and_time");
  useEffect(() => {
    if (initialLastKey === null) {
      get(boardRef).then(snapshot => {
        const data = snapshot.toJSON();
        const values = Object.values(data);
        const keys = Object.keys(data);
        setHistory(
          Object.fromEntries(
            values.map(
              child => [child["timeStamp"], child["state"]]
        )));
        setInitialLastKey(keys[keys.length - 1]);
      }).catch(error => {
          console.error(`error fetching data from board '${board}'`)
        });
      return () => {};
    }    

    const newBoardRef = query(boardRef, startAt(initialLastKey));
    return onChildAdded(newBoardRef, snapshot => {
      setHistory(oldHistory => ({...oldHistory, [snapshot.child("timeStamp").val()]: snapshot.child("state").val()}));
    });
  }, [initialLastKey]);

  return history;
};
