// 5. b.
// Table of contents
// Speech Recognition - Browser API 1 - Line 152
// Text-To-Speech - Browser API 2 - Line 173
// Keypress Detection API - Bonus 1 - Line 182
// Google Maps API - Bonus 2 - Line 245


var app = new Vue({
  el: "#app",

  mounted: function() {
    // Mockaroo User Data
    // const domain = 'my.api.mockaroo.com'
    // const headers = { "X-API-Key": mockarooApiKey }

    // fetch(`http://${domain}/emailusers.json`, { headers })
    //   .then(response => response.json())

    // fetch("https://my.api.mockaroo.com/emailusers.json?key=5ef6e200")
    // fetch("http://${domain}/emailusers.json")

    fetch("https://randomuser.me/api/?results=5")
      .then(res => res.json())
      .then(emails => {
        this.emails = emails.results;
        this.selectedEmail = this.emails[0];
      })
      .catch(err => console.log(err));
  },

  data: {
    emails: [],
    selectedEmail: "",
    view: "inbox" // options are inbox, trash, etc.
  },

  methods: {
    // return avatar so that img src attribute knows where to get pic
    getPic: function(emailObj) {
      return emailObj.picture.thumbnail;
    },

    // return alt text for image for avatar
    getAlt(emailObj) {
      return `${emailObj.name.first} ${emailObj.name.last}'s avatar`;
    },

    // when user clicks an email make email display on main part of page and add css
    clickedEmail: function(emailObj) {
      this.selectedEmail = emailObj;
    },

    // is used to determine whether the css class for selected should be shown
    // Is what I clicked on the same object as currently selectedEmail?
    // If true, then value will be used in v-bind:class="{ 'email-item-selected': isSelected(email) }
    isSelected: function(emailObj) {
      // returns boolean value
      return emailObj == this.selectedEmail;
    },

    // if user clicks compose button, fetch new email and insert into inbox
    incomingEmail() {
      fetch("https://randomuser.me/api/?results=1")
        .then(res => res.json())
        .then(emails => {
          this.emails.unshift(emails.results[0]);
        })
        .catch(err => console.log(err));
    },

    // used with v-for=email in currentView()
    // IF user clicks Inbox, then show emails that don't have deleted:true
    // If user clicks Trash, then show emails that do have deleted:true
    currentView() {
      switch (this.view) {
        case "inbox":
          return this.emails.filter(email => !email.deleted);
          break;
        case "trash":
          return this.emails.filter(email => email.deleted);
          break;
      }
    },

    // if user clicks Inbox, or Trash, then store it so that currentView()
    // will know which filter to use so to return the appropriate array of emails
    setView(clickedView) {
      this.view = clickedView;
    },

    // if user clicks delete, then store it in the email object, but have to use $set
    // so Vue 'sees' it and reacts to it if any changes happen
    deleteEmail() {
      this.$set(this.selectedEmail, "deleted", true);
    }
  }
});









// Assignment 2b

// 1. a.
// Call the fetch function passing the url of the API as a parameter
fetch1(url) 
.then(function() {
})
// Catch errors if there are any
.catch(function() {
});


// fetch1() {
//   fetch("")
//     .then(res => res.json())
//     .then(emails => {
//       this.emails.unshift(emails.results[0]);
//     })
//     .catch(err => console.log(err));
// },

fetch1().then(function(response) {
  if(response.ok) {
    return response.blob();
  }
  throw new Error('Error');
}).then(function(myBlob) { 
  var objectURL = URL.createObjectURL(myBlob); 
  myImage.src = objectURL; 
}).catch(function(error) {
  console.log('There was an error with your fetch: ', error.message);
});

// 2. a. 
// fetch/ await/ async 
async function fetch2() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);
  app.items.push(data); 
}
getUserInfo(); 

// 3. 
// Speech Recognition - Browser API 1
window.SpeechRecognition = window.SpeechRecognition || window.
webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
const transcript = Array.from(e.results)
.map(result => result[0])
.map(result => result.transcript)
.join('')

p.textContent = transcript;
if(e.results[0].isFinal) {
p = document.createElement('p');
words.appendChild(p);
}
if(transcript.includes('get the weather')) {
console.log('Getting the weather');
}
console.log(transcript);
});
recognition.addEventListener('end', recognition.start);
recognition.start();

// Text-To-Speech - Browser API 2
const msg = new SpeechSynthesisUtterance();
  let voices = [];
  const voicesDropdown = document.querySelector('[name="voice"]');
  const options = document.querySelectorAll('[type="range"], [name="text"]');
  const speakButton = document.querySelector('#speak');
  const stopButton = document.querySelector('#stop');
  msg.text = document.querySelector('[name="text"]').value;

  function populateVoices() {
      voices = this.getVoices();
      voicesDropdown.innerHTML = voices
          .filter(voice => voice.lang.includes('en'))
          .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
          .join('');
  }
  // Listen for voices
  function setVoice() {
      msg.voice = voices.find(voice => voice.name === this.value);
      toggle();
  }
  // Starting listening again when speech has stopped 
  function toggle(startOver = true) {
      speechSynthesis.cancel();
      if (startOver) {
          speechSynthesis.speak(msg);
      }
  }
  // Display text
  function setOption() {
      console.log(this.name, this.value);
      msg[this.name] = this.value;
      toggle();
  }
  // Allow for the user to click buttons to start or stop speaking
  speechSynthesis.addEventListener('voicechanged', populateVoices);
  voicesDropdown.addEventListener('chnage', setVoice);
  options.forEach(option => option.addEventListener('chnage', setOption));
  speakButton.addEventListener('click', toggle);
  stopButton.addEventListener('click', () => toggle(false)); 


// 4.
// Keypress Detection API - Bonus 1
function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key=${e.keyCode}"]`);
  // stop the whole function 
  if(!audio) return;
  // rewind the function 
  audio.currentTime = 0; 
  audio.play();
  key.classList.add('playing'); 
}
function removeTransition(e) {
  if(e.propertyName !== 'transform') return; 
  this.classList.remove('playing');
}
// Play a unique sound when each key is pressed
const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playSound);

// Google Maps API - Bonus 2
function initMap() {
  // Choose your latitude and longitude for the map to be at
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  // Add in a marker to point to where you chose
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}


