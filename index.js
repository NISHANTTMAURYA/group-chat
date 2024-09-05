window.onload = function() {
  const firebaseConfig = {
    apiKey: "AIzaSyA9mrQcvLx-8wMEmmTdBiCeAdl7XlirDtc",
    authDomain: "chat-a55e0.firebaseapp.com",
    databaseURL: "https://chat-a55e0-default-rtdb.firebaseio.com",
    projectId: "chat-a55e0",
    storageBucket: "chat-a55e0.appspot.com",
    messagingSenderId: "468035006755",
    appId: "1:468035006755:web:e7d10c31246097f1a61c96"
  };
  

  firebase.initializeApp(firebaseConfig);
  var db = firebase.database();
  var storage = firebase.storage();

  function handleFileUpload(file, callback) {
    const storageRef = storage.ref('uploads/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function(snapshot) {
        // Handle progress if desired
    }, function(error) {
        console.error('Upload failed:', error);
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL); // Debug: Log the URL
            callback(downloadURL);
        }).catch(function(error) {
            console.error('Failed to get download URL:', error);
        });
    });
  }

  class DoctorPatientChat {
    send_message(message, fileURL = '') {
      var dbRef = firebase.database().ref('chats/');
      var sender = localStorage.getItem('name');
      var imgData = localStorage.getItem('profile_pic') || 'default_profile_pic_url';
      
      var msg = {
          sender: sender,
          message: message,
          image: imgData,
          media: fileURL // Ensure fileURL is passed here
      };
      
      dbRef.push(msg)
          .then(() => {
              console.log('Message sent successfully');
          })
          .catch((error) => {
              console.error('Error sending message:', error);
          });
    }

    home() {
      document.body.innerHTML = '';
      this.create_title();
      this.create_join_form();
    }

    chat() {
      this.create_title();
      this.create_chat();
    }

    create_title() {
      var title_container = document.createElement('div');
      title_container.setAttribute('id', 'title_container');
      var title_inner_container = document.createElement('div');
      title_inner_container.setAttribute('id', 'title_inner_container');

      var title = document.createElement('h1');
      title.setAttribute('id', 'title');
      title.textContent = 'Doctor-Patient Chat';
      

      title_inner_container.append(title);
      title_container.append(title_inner_container);
      document.body.append(title_container);
    }

    create_join_form() {
      var parent = this;

      var join_container = document.createElement('div');
      join_container.setAttribute('id', 'join_container');
      var join_inner_container = document.createElement('div');
      join_inner_container.setAttribute('id', 'join_inner_container');

      var profile_pic_container = document.createElement('div');
      profile_pic_container.setAttribute('id', 'profile_pic_container');

      var profile_pic_input = document.createElement('input');
      profile_pic_input.setAttribute('type', 'file');
      profile_pic_input.setAttribute('id', 'profile_pic_input');

      profile_pic_input.onchange = function(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          localStorage.setItem('profile_pic', e.target.result);
        }
        reader.readAsDataURL(file);
      }

      var join_input_container = document.createElement('div');
      join_input_container.setAttribute('id', 'join_input_container');

      var join_input = document.createElement('input');
      join_input.setAttribute('id', 'join_input');
      join_input.setAttribute('maxlength', 15);
      join_input.placeholder = 'Enter your name';

      var join_button_container = document.createElement('div');
      join_button_container.setAttribute('id', 'join_button_container');

      var join_button = document.createElement('button');
      join_button.setAttribute('id', 'join_button');
      join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>';

      join_input.onkeyup = function() {
        if (join_input.value.length > 0) {
          join_button.classList.add('enabled');
          join_button.onclick = function() {
            parent.save_name(join_input.value);
          }
        } else {
          join_button.classList.remove('enabled');
        }
      }

      join_input_container.append(join_input);
      join_button_container.append(join_button);
      profile_pic_container.append(profile_pic_input);
      join_inner_container.append(profile_pic_container, join_input_container, join_button_container);
      join_container.append(join_inner_container);
      document.body.append(join_container);
    }

    save_name(name) {
      localStorage.setItem('name', name);
      this.create_load_screen();
    }

    create_load_screen() {
      document.body.innerHTML = '';

      var loader_container = document.createElement('div');
      loader_container.setAttribute('class', 'loader_container');

      var loader = document.createElement('div');
      loader.setAttribute('class', 'loader');

      loader_container.append(loader);
      document.body.append(loader_container);

      var parent = this;

      setTimeout(function() {
        parent.chat();
      }, 500);
    }

    create_chat() {
      var parent = this;
      document.body.innerHTML = '';
  
      var title_container = document.createElement('div');
      title_container.setAttribute('id', 'title_container');
      title_container.classList.add('chat_title_container');
  
      var title_inner_container = document.createElement('div');
      title_inner_container.setAttribute('id', 'title_inner_container');
  
      var title = document.createElement('h1');
      title.setAttribute('id', 'title');
      title.classList.add('chat_title');
      title.textContent = 'ONLINE GROUP CHAT';
  
      var chat_logout_container = document.createElement('div');
      chat_logout_container.setAttribute('id', 'chat_logout_container');
  
      var chat_logout = document.createElement('button');
      chat_logout.setAttribute('id', 'chat_logout');
      chat_logout.innerHTML = 'Logout <i class="fas fa-sign-out-alt"></i>';
  
      chat_logout.onclick = function() {
          localStorage.clear();
          parent.home();
      }
  
      chat_logout_container.append(chat_logout);
      title_inner_container.append(title);
      title_container.append(title_inner_container, chat_logout_container);
  
      var chat_container = document.createElement('div');
      chat_container.setAttribute('id', 'chat_container');
      var chat_inner_container = document.createElement('div');
      chat_inner_container.setAttribute('id', 'chat_inner_container');
  
      var chat_content_container = document.createElement('div');
      chat_content_container.setAttribute('id', 'chat_content_container');
  
      var chat_input_container = document.createElement('div');
      chat_input_container.setAttribute('id', 'chat_input_container');
  
      var chat_input = document.createElement('input');
      chat_input.setAttribute('id', 'chat_input');
      chat_input.setAttribute('maxlength', 1000);
      chat_input.placeholder =  "Say something...";
  
      var chat_input_send = document.createElement('button');
      chat_input_send.setAttribute('id', 'chat_input_send');
      chat_input_send.setAttribute('disabled', true);
  
      // Original file input
      var chat_input_file = document.createElement('input');
      chat_input_file.setAttribute('type', 'file');
      chat_input_file.setAttribute('id', 'chat_input_file');
      chat_input_file.setAttribute('accept', 'image/*,video/*');
  
      // Custom label for the file input
      var custom_file_label = document.createElement('label');
      custom_file_label.setAttribute('for', 'chat_input_file');
      custom_file_label.setAttribute('id', 'custom_file_label');
      custom_file_label.innerHTML = '<i class="fas fa-paperclip"></i>'; // Use an icon or custom HTML for the label
  
      //************************************************************************************************************************* */
      // added this for send button to be only enabled/visible when there is a input 
      // Inside create_chat function

      // Check if the send button should be shown or hidden
      function updateSendButtonState() {
        if (chat_input.value.trim().length > 0 || chat_input_file.files.length > 0) {
            chat_input_send.classList.add('enabled');
        } else {
            chat_input_send.classList.remove('enabled');
        }
      }

      // Event listener for text input
      chat_input.addEventListener('input', updateSendButtonState);

      // Event listener for file input
      chat_input_file.addEventListener('change', updateSendButtonState);

      // Send button click handler
      chat_input_send.addEventListener('click', function() {
        var message = chat_input.value;
        var file = chat_input_file.files[0];

        if (file) {
            handleFileUpload(file, function(fileURL) {
                parent.send_message('', fileURL);
            });
        } else {
            parent.send_message(message);
        }

        // Clear input fields
        chat_input.value = '';
        chat_input_file.value = '';

        // Reset send button state
        updateSendButtonState();
      });

      // Enter key event listener
      chat_input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) { // Only trigger on Enter key without Shift
          event.preventDefault(); // Prevent newline insertion
          chat_input_send.click(); // Simulate click on the send button
        }
      });
      //****************************************************************************************************************************** */
  
      chat_input.onkeyup = function() {
          if (chat_input.value.length > 0 || chat_input_file.files.length > 0) {
              chat_input_send.removeAttribute('disabled');
              chat_input_send.classList.add('enabled');
              chat_input_send.classList.remove('disabled');
          } else {
              chat_input_send.setAttribute('disabled', true);
              chat_input_send.classList.remove('enabled');
              chat_input_send.classList.add('disabled');
          }
      };
  
      // Append elements in the desired order
      chat_input_container.append(chat_input, custom_file_label, chat_input_file, chat_input_send);
      chat_inner_container.append(chat_content_container, chat_input_container);
      chat_container.append(chat_inner_container);
      document.body.append(title_container, chat_container);
  
      this.display_messages(chat_content_container);
    }
  
    display_messages(container) {
      var dbRef = firebase.database().ref('chats/');
      dbRef.on('child_added', function(snapshot) {
          var message = snapshot.val();
    
          // Skip empty messages
          if (!message.message && !message.media) return;
    
          var message_container = document.createElement('div');
          message_container.setAttribute('class', 'message_container');
          message_container.style.padding = '10px';
          message_container.style.marginBottom = '11px';
          
          
          message_container.style.borderRadius = '14px';
          message_container.style.backgroundColor = 'rgb(255, 212, 212)'; /* Light background color for messages */
    
          var message_inner_container = document.createElement('div');
          message_inner_container.setAttribute('class', 'message_inner_container');
          message_inner_container.style.display = 'flex';
          message_inner_container.style.alignItems = 'flex-start';
    
          var message_user_container = document.createElement('div');
          message_user_container.setAttribute('class', 'message_user_container');
          message_user_container.style.display = 'flex';
          message_user_container.style.alignItems = 'center';
    
          var profile_pic = document.createElement('img');
          profile_pic.setAttribute('class', 'message_profile_pic');
          profile_pic.src = message.image ? message.image : 'default_profile_pic_url';
          profile_pic.style.width = '45px';
          profile_pic.style.height = '45px';
          profile_pic.style.borderRadius = '50%';
          profile_pic.style.marginRight = '10px';
    
          var message_user = document.createElement('span');
          message_user.setAttribute('class', 'message_user');
          message_user.textContent = message.sender + ': ';
          message_user.style.fontWeight = 'bold';
    
          var message_content_container = document.createElement('div');
          message_content_container.setAttribute('class', 'message_content_container');
          message_content_container.style.display = 'flex';
          message_content_container.style.flexDirection = 'column';
    
          // Handle media if present
          if (message.media) {
              var media_element;
              if (message.media.match(/\.(jpg|jpeg|png)$/i)) {
                  media_element = document.createElement('img');
                  media_element.src = message.media;
                  media_element.setAttribute('class', 'media_image');
                  media_element.style.maxWidth = '60%'; // Responsive width
                  media_element.style.borderRadius = '8px'; // Rounded corners
              } else if (message.media.match(/\.(mp4|mov)$/i)) {
                  media_element = document.createElement('video');
                  media_element.src = message.media;
                  media_element.setAttribute('controls', 'controls');
                  media_element.setAttribute('class', 'media_video');
                 // Responsive width
                  media_element.style.borderRadius = '8px'; // Rounded corners
              } else {
                  // Display the file URL as a link with specified styles
                  var file_link = document.createElement('a');
                  file_link.href = message.media;
                  file_link.textContent = 'View file';
                  file_link.target = '_blank'; // Open in a new tab
                  file_link.style.display = 'inline-block';
                  file_link.style.color = 'red';
                  file_link.style.textDecoration = 'none'; // Remove underline
                  file_link.style.fontSize = '14px'; // Font size
                  file_link.style.marginTop = '5px'; // Margin top
                  file_link.style.background = '#54a4e6 '; // Background color
                  file_link.style.padding = '10px'; // Padding
                  file_link.style.borderRadius = '10px'; // Rounded corners
                  file_link.style.maxWidth = '60%'; // Max width
                  file_link.style.maxHeight = '100%';
                  file_link.style.overflow = 'hidden'; // Hide overflow if text is too long
                  file_link.style.whiteSpace = 'nowrap'; // Prevent text wrapping
                  file_link.style.textOverflow = 'ellipsis'; // Add ellipsis for overflow text
                  file_link.style.transition = 'background-color 0.3s ease'; // Smooth background color transition
    
                  file_link.onmouseover = function() {
                      file_link.style.backgroundColor = '#54a4e6'; // Darker background color on hover
                  };
    
                  file_link.onmouseout = function() {
                      file_link.style.backgroundColor = '#54a4e6'; // Reset background color on mouse out
                  };
    
                  message_content_container.append(file_link);
              }
    
              if (media_element) {
                  message_content_container.append(media_element);
              }
          }
    
          // Add the message text if present
          if (message.message) {
              var message_content = document.createElement('span');
              message_content.setAttribute('class', 'message_content');
              message_content.textContent = message.message;
              message_content_container.append(message_content);
          }
    
          message_user_container.append(profile_pic, message_user);
          message_inner_container.append(message_user_container, message_content_container);
          message_container.append(message_inner_container);
          container.append(message_container);
          container.scrollTop = container.scrollHeight;
      });
    }
  }
  
  var app = new DoctorPatientChat();

  if (localStorage.getItem('name')) {
    app.chat();
  } else {
    app.home();
  }
}
