# BusinessCounter

This Software is for all Businesses where GST Billes getting Generated and they can manage all there oprations in one place. Also, We will going to integrate ONDC in future to connect to delivery services. It will give a boom to this.


.env
DB_NAME=Business-counter-db
DB_USER=postgres
DB_PASS=1234
DB_HOST=localhost
JWT_SECRET=jddssisadidm
PORT=3000


I've made the following changes:

1. Created a new success.html page in the public/auth/google/ directory that:
Shows a success message
Displays the JWT token
Provides a copy button for the token
Has a clean, modern design
2. Updated server.js to:
Serve static files from the public directory
Add proper ES module support for __dirname
3. Updated the auth route to:
Redirect to the local success page instead of the frontend URL
Use the correct path for the success page

Now when you sign in with Google:

Visit http://localhost:3000/api/v1/auth/google
After successful authentication, you'll be redirected to a nice success page
You'll see your JWT token and can copy it for future use