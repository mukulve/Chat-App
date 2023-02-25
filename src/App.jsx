import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyD_cfAmnYxCtvEY-8mB88gQtCNJ-PW0a8g",
  authDomain: "chatapp-90d14.firebaseapp.com",
  projectId: "chatapp-90d14",
  storageBucket: "chatapp-90d14.appspot.com",
  messagingSenderId: "438666659440",
  appId: "1:438666659440:web:7bb60d9322a276eafd16b5",
};

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

function App() {
  const [authUser, authLoading, authError] = useAuthState(auth);
  return <div className="App">{authUser ? <Chatroom /> : <Signin />}</div>;
}

function Signin() {
  const login = () => {
    signInWithPopup(auth, provider);
  };

  return (
    <div className="Login">
      <h2>Chat App</h2>
      <button onClick={login}>Login With Google</button>
    </div>
  );
}

function Messages() {
  const [messagesArr, setMessagesArr] = useState([]);

  const [collectionData, collectionLoading, collectionError] =
    useCollectionData(
      query(collection(firestore, "Messages"), orderBy("time", "desc"))
    );

  useEffect(() => {
    let tempArr = [];
    if (collectionData) {
      tempArr = [];
      collectionData.forEach((element) => {
        tempArr.push(element.text);
      });
      setMessagesArr(tempArr);
    }
  }, [collectionData]);

  return (
    <div className="messages">
      {messagesArr.map((user, i) => (
        <h3 key={i}>{user}</h3>
      ))}
    </div>
  );
}

function Chatroom() {
  const [authUser, authLoading, authError] = useAuthState(auth);
  const [collectionData, collectionLoading, collectionError] =
    useCollectionData(query(collection(firestore, "Messages")));
  const [messageToSend, setMessageToSend] = useState("");
  const handleChange = (e) => setMessageToSend(e.target.value);
  const logout = () => {
    signOut(auth);
  };

  async function sendmessage() {
    await addDoc(collection(firestore, "Messages"), {
      text: messageToSend,
      time: new Date(),
    });
    setMessageToSend("");
  }

  return (
    <>
      <header>
        <h2>{authUser.displayName}</h2>
        <button onClick={logout}>Logout</button>
      </header>
      <main>{collectionData ? <Messages /> : collectionError}</main>
      <footer>
        <input
          type="text"
          value={messageToSend}
          onChange={handleChange}
        ></input>
        <button onClick={sendmessage}>Send</button>
      </footer>
    </>
  );
}

export default App;
