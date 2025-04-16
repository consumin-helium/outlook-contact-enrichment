export async function getContactInfo(token: string, senderEmail: string) {
    try {
      const response = await fetch(`https://localhost:5000/api/contact/${senderEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      const contactDetails = document.getElementById('contact-details');
      if (contactDetails) {
        contactDetails.innerHTML = `
          <p>Company: ${data.company}</p>
          <p>Title: ${data.title}</p>
          <p>LinkedIn: <a href="${data.linkedin}">${data.linkedin}</a></p>
        `;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }