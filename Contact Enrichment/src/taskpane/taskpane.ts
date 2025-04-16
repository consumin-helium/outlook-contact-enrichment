import { getContactInfo } from '../services/contact';

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    console.log("Add-in loaded");
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "block";
    
    // Add form submit handler
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(event: Event) {
  event.preventDefault();
  const statusDiv = document.getElementById('login-status');
  
  try {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    
    console.log("Attempting login...");
    const response = await fetch('https://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      console.log("Login successful");
      localStorage.setItem('jwt_token', data.token);
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('contact-info').style.display = 'block';
      await displayContactInfo();
    }
  } catch (error) {
    console.error('Login error:', error);
    if (statusDiv) {
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.style.color = 'red';
    }
  }
}

async function displayContactInfo() {
  try {
    // Check if we're in a mail context
    if (Office.context.mailbox.item) {
      const sender = Office.context.mailbox.item.sender;
      const senderEmail = sender.emailAddress;
      console.log("Got sender email:", senderEmail);
      
      const token = localStorage.getItem('jwt_token');
      if (token) {
        const contactInfo = await getContactInfo(token, senderEmail);
        const detailsDiv = document.getElementById('contact-details');
        if (detailsDiv && contactInfo) {
          detailsDiv.innerHTML = `
            <p>Company: ${contactInfo.company}</p>
            <p>Title: ${contactInfo.title}</p>
            <p>LinkedIn: <a href="${contactInfo.linkedin}">${contactInfo.linkedin}</a></p>
          `;
        }
      }
    } else {
      console.error('Not in mail item context');
    }
  } catch (error) {
    console.error('Error displaying contact info:', error);
    const detailsDiv = document.getElementById('contact-details');
    if (detailsDiv) {
      detailsDiv.innerHTML = `<p style="color: red;">Error loading contact information</p>`;
    }
  }
}