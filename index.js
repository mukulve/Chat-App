document.getElementById("theme").addEventListener("click", changetheme);

function changetheme() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyBOKSahwHjpIMuvSWsa8jzL1XmQCzbWHYw",
  authDomain: "fir-2d08c.firebaseapp.com",
  databaseURL: "https://fir-2d08c-default-rtdb.firebaseio.com",
  projectId: "fir-2d08c",
  storageBucket: "fir-2d08c.appspot.com",
  messagingSenderId: "495256019593",
  appId: "1:495256019593:web:2f4cc29755335d3cff5c58",
};

//intantiate firebase
firebase.initializeApp(firebaseConfig);
//intailize firebase auth
const auth = firebase.auth();

var database = firebase.database().ref("databasename");

function sendmessage() {
  //check if user is logged in
  const monitorauth = async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        var message = document.getElementById("messagecontent").value;
        var inputform = database.push();
        inputform.set({
          message: message,
        });
        document.getElementById("messagecontent").value = "";
      } else {
        document.getElementById("message").style.display = "none";
        document.getElementById("header").style.display = "block";
        document.getElementById("login").style.display = "block";
        document.getElementById("logo").style.color = "transparent";
      }
    });
  };
  monitorauth();
}

//get data from firebase
database.on("child_added", function (snapshot) {
  var data = snapshot.val();
});

//get all data from firebase
database.on("value", function (snapshot) {
  const monitorauth = async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        document.getElementById("chat").innerHTML = "";
        var data = snapshot;
        var s = data.val();
        var k = Object.keys(s);
        for (var i = 0; i < k.length; i++) {
          var j = k[i];
          const para = document.createElement("a");
          const node = document.createTextNode(s[j].message);
          para.appendChild(node);
          const element = document.getElementById("chat");
          element.appendChild(para);
        }
      } else {
        document.getElementById("message").style.display = "none";
        document.getElementById("header").style.display = "block";
        document.getElementById("login").style.display = "block";
        document.getElementById("logo").style.color = "transparent";
      }
    });
  };
  monitorauth();
});

//login with username and password
const loginemailpassword = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  try {
    const usercred = await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {}
};

//create an account
const createaccount = async () => {
  const email = document.getElementById("emailsignup").value;
  const password = document.getElementById("passsignup").value;
  try {
    const usercred = await auth.createUserWithEmailAndPassword(email, password);
  } catch (e) {}
};

//check if user is logged in
const monitorauth = async () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("login").style.display = "none";
      document.getElementById("header").style.display = "none";
      document.getElementById("message").style.display = "block";
      document.getElementById("logo").style.color = "var(--text)";
    } else {
      document.getElementById("message").style.display = "none";
      document.getElementById("header").style.display = "block";
      document.getElementById("login").style.display = "block";
      document.getElementById("logo").style.color = "transparent";
    }
  });
};

monitorauth();

//logout
const logout = async () => {
  await auth.signOut();
  document.getElementById("message").style.display = "none";
  document.getElementById("header").style.display = "block";
  document.getElementById("login").style.display = "block";
  document.getElementById("logo").style.color = "transparent";
};
