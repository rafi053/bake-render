// deploy-render.js - Run with `node deploy-render.js`
import axios from "axios";

// ----- Configuration -----
const RENDER_API_KEY = "rnd_FSXntAzjIKZqB4uZCQ9WjSvb6dms";
const SERVICE_NAME = "back-render"; // Change to your desired service name
const OWNER_ID = "tea-csp7rqrgbbvc73d1os1g"; // Your workspace ID from debugging

// ----- Deployment Code -----
const api = axios.create({
  baseURL: "https://api.render.com/v1",
  headers: { Authorization: `Bearer ${RENDER_API_KEY}` }
});

async function run() {
  try {
    console.log(`Using owner ID: ${OWNER_ID}`);
    console.log(`Target service name: ${SERVICE_NAME}`);
    
    // Get list of services
    console.log("Checking for existing services...");
    const servicesResponse = await api.get("/services");
    const services = servicesResponse.data.map(item => item.service);
    
    // Check if service already exists
    const existingService = services.find(service => service && service.name === SERVICE_NAME);
    
    if (existingService) {
      console.log(`Found existing service: ${existingService.name} (${existingService.id})`);
      
      // Trigger deployment
      console.log(`Triggering deployment to existing service...`);
      const deployResponse = await api.post(`/services/${existingService.id}/deploys`, {});
      console.log(`Deployment triggered! ID: ${deployResponse.data.id}`);
      console.log(`Monitor at: ${existingService.dashboardUrl}`);
    } else {
      console.log(`Service '${SERVICE_NAME}' not found. Creating new service...`);
      
      // Create new service
      const newServicePayload = {
        type: "web_service",
        name: SERVICE_NAME,
        ownerId: OWNER_ID,
        region: "frankfurt",
        autoDeploy: true,
        env: "node",
        repo: "https://github.com/Aharon-Bruchim/minio", // Using one of your existing repos as an example
        // Including required serviceDetails for non-static services
        serviceDetails: {
          buildCommand: "npm install && npm run build",
          startCommand: "npm start",
          plan: "starter",
          pullRequestPreviewsEnabled: false,
          envSpecificDetails: {
          nodeVersion: "18"
        }
      }
    };
    console.log("Service Configuration:", JSON.stringify(newServicePayload, null, 2));

      console.log("Creating service with configuration:", JSON.stringify(newServicePayload, null, 2));
      
      try {
        const newServiceResponse = await api.post("/services", newServicePayload);
        console.log(`New service created successfully!`);
        console.log(`Service ID: ${newServiceResponse.data.id}`);
        console.log(`Dashboard URL: ${newServiceResponse.data.dashboardUrl || 'Check your Render dashboard'}`);
      } catch (createError) {
        // console.error("Error creating service:", createError.message);
        console.error("Error creating service:", createError);
        // console.error("Error response:", error.response ? error.response.data : error.message);

        if (createError.response) {
          console.error("Status:", createError.response.status);
          console.error("Details:", JSON.stringify(createError.response.data, null, 2));
          
          console.log("\nSuggestion: Looking at your existing services in Render, try to create a service");
          console.log("manually first through the dashboard, then use this script only for deployments.");
        }
      }
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Details:", JSON.stringify(error.response.data, null, 2));
      console.error("Error response:", error.response?.data || error.message);

    }
  }
}

// Execute
run();