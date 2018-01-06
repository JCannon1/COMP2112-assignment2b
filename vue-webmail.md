# Transforming Webmail into Vue

1. Download email template, embed Vue's script, embed our index.js script after that.
1. Create a new `<div id="app">` and wrap it around the entire `<div id="layout"...` section
1. in mounted(), fetch new data and store emails in Vue's emails; make first email the selectedEmail;

   ```js
    var app = new Vue({
        el: "#app",
        mounted: function() {
            fetch("https://randomuser.me/api/?results=5") // I'm using a different API than assignment just for simplicity
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
        },
   ```

* Test it: Run the webpage, and in console, test if we got the emails: `app.emails` and `app.selectedEmail`

1. Delete the html code that is redundant

1. Use a `<template v-for="email in emails">` and replace HTML text with {{ variables }}

   ```html
       <h5 class="email-name">{{ email.name.first }} {{ email.name.last }}</h5>
       <h4 class="email-subject">{{ email.location.street }}</h4>
       <p class="email-desc">
           {{ email.cell }}
       </p>
   ```

* For picture/avatar must use v-bind and I created a function that passes the current email object, and a method to get alt text

  ```html
      <img... v-bind:src="getPic(email)" ... v-bind:alt="getAlt(email)">
  ```

  ```js
    getPic: function(emailObj) {
        return emailObj.picture.thumbnail;
    },

    getAlt(emailObj) {
      return `${emailObj.name.first} ${emailObj.name.last}'s avatar`;
    },
  ```

* Test it: Run the webpage and see if the emails display

1. Add @click event handler to appropriate html element so that upon click, selectedEmail is set
   ```html
        <div class="email-item pure-g" @click="clickedEmail(email)"
   ```
   ```js
    clickedEmail: function(emailObj) {
        this.selectedEmail = emailObj;
    },
   ```

* Test it: Run webpage, click a random email, in console type: app.selectedEmail to see if it set

1. Now that selectedEmail works, make main part of page show content (I'm using random fields for simplicity)

```html
    <div class="pure-u-1-2">
        <h1 class="email-content-title">{{ selectedEmail.location.street }}</h1>
        <p class="email-content-subtitle">
            From
            <a>{{ selectedEmail.name.first }} {{ selectedEmail.name.last }}</a> at
            <span>{{ selectedEmail.dob }}</span>
        </p>
    </div>
    .
    .
    .
    <div class="email-content-body">
        <p>{{ selectedEmail.cell }}</p>
    </div>
```

* Test it: Run webpage, click random email to see if main part shows

1. Add css class to selected email via v-bind:class

   ```html
       <div class="email-item pure-g" @click="clickedEmail(email)" v-bind:class="{ 'email-item-selected': isSelected(email) }">
   ```

   ```js
       isSelected: function(emailObj) {
       return emailObj == this.selectedEmail;
       },
   ```

1. Make compose button fetch another api entry and insert it into inbox

   ```html
       <button class="primary-button pure-button" @click="incomingEmail">Compose</button>
   ```

   ```js
    incomingEmail() {
      fetch("https://randomuser.me/api/?results=1")
        .then(res => res.json())
        .then(emails => {
          this.emails.unshift(emails.results[0]);
        })
        .catch(err => console.log(err));
    },
   ```

1. Handle delete button. But now you have to think architecturally about how you want to accomplish that. I will choose the same method as before, where I add a new key/value pair to the existing email object, then as the user clicks inbox/trash, it filters the view based on what was clicked.

   ```html
       <!-- change template v-for="email in emails" to .... -->
       <template v-for="email in currentView()">
   ```

   ```html
       <a href="#" class="pure-menu-link" @click="setView('inbox')">Inbox
        ...
       <a href="#" class="pure-menu-link" @click="setView('trash')">Trash</a>
       ...
       <button class="secondary-button pure-button" @click="deleteEmail">Delete</button>
   ```

   ```js
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

    setView(clickedView) {
        this.view = clickedView;
    },

    deleteEmail() {
        this.$set(this.selectedEmail, "deleted", true);
    }
   ```
