# MongoDB Atlas Connection Setup

## Get Your Connection String

1. **Go to your cluster**: https://cloud.mongodb.com/v2/68ef5169afbf2d600c27ea98#/clusters/detail/Trackardemo

2. **Click the "Connect" button** on your Trackardemo cluster

3. **Choose "Drivers"** (or "Connect your application")

4. **Select**:
   - Driver: Node.js
   - Version: 5.5 or later

5. **Copy the connection string** - it will look like:
   ```
   mongodb+srv://<username>:<password>@trackardemo.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Replace**:
   - `<username>` with your MongoDB Atlas username
   - `<password>` with your MongoDB Atlas password
   - Add `/trackar` before the `?` to specify the database name

   Final format:
   ```
   mongodb+srv://username:password@trackardemo.xxxxx.mongodb.net/trackar?retryWrites=true&w=majority
   ```

7. **Share the complete connection string** with me, and I'll update the `.env` file

## If You Haven't Created a Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and password
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

## Network Access

Make sure your IP is whitelisted:
1. Go to "Network Access" in the left sidebar  
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"
