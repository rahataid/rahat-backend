# Rahat Core and Projects Deployment Guide

This document outlines the steps required to deploy **Rahat Core** and associated **Rahat Projects** after server setup.

---

## Rahat Core Deployment Steps

1. **Update the User Seed Script:**

   - Modify the `seed.user.ts` script to include project-specific details such as user names and credentials.

2. **Configure Environment Variables:**

   - Update the `.env` file with the appropriate server setup details.
   - Ensure the database IP is exposed and accessible.

3. **Seed User Data:**

   - Run the `seed.user.ts` script to add users to the system.

   ```bash
   npx ts-node ./prisma/seed.user.ts
   ```

4. **Seed Dashboard Statistics:**

   - Execute the relevant script to populate data sources for the core and project dashboard.

5. **Add SMTP Credentials:**

   - Use Swagger to call the `settings` POST API.
   - Add SMTP credentials required for email services.
   - To Get the app password credentials you can follow the google support [documentation](https://support.google.com/accounts/answer/185833?hl=en&sjid=7987607368651998383-AP)

   ```bash
      {
   "name": "SMTP",
   "value": {
    "host": "smtp.gmail.com",
    "Port": 465,
    "secure": true,
    "username": "username",
    "password": "test"
   },
   "requiredFields": [
    "host",
    "port",
    "secure",
    "username",
    "PASSWORD"
   ],
   "isReadOnly": false,
   "isPrivate": true
   }
   ```

6. **Add New Project Details:**

   - Call the `project` POST API to add the new project.
   - Retrieve the UUID of the new project and update it in the `.env` file.

   ```bash
   {
   "name": "Cash Distribution",
   "description": "Cash Distribution for the flood victims",
   "type": "el",
   "extras": {
    "test": "test"
   },
   "contractAddress": "0x123"
   }
   ```

   - Project types available for now are:
     1. el
     2. el-kenya
     3. c2c
     4. rp
     5. cva
     6. el-cambodia

7. **Sync Server Credentials:**

   - Update the `tools/scripts/production-setup/.env.setup` file with the server-side `.env` credentials.
   - Example of .env.setup is available [here](../tools/scripts/production-setup/.env.setup.example)

8. **Deploy Rahat Core Contracts:**

   - Run the `_setup-deployment.ts` [script](../tools/scripts/production-setup/_setup-deployment.ts) to deploy Rahat Core contracts.

   ```bash
   pnpm deploy:prodcontracts
   ```

   - Deployed contracts are saved [here](../tools/scripts/production-setup/deployments/contracts.json).

9. **Update Database with Deployed Contracts:**

   - Execute the `update-deployment.ts` [script](../tools/scripts/production-setup/update-deployment.ts) to save the deployed contracts and blockchain network information in the database.

   ```bash
   pnpm update:prodsettings
   ```

10. **Set Forwarder Address:**

    - Update the `ERC2771_FORWARDER_ADDRESS` in the environment variables with the address of the newly deployed `ERC2771Forwarder` contract.

11. **Update the communication settings:**
    - Update the `URL` and `APP_ID` value in the seed.communication-settings.
    - Run the seed.communication-settings to add the communication settings.
    ```bash
    npx ts-node ./prisma/seed.communication-settings.ts
    ```

---

## Rahat Projects Deployment Steps

1. **Update Environment Files:**

   - Modify the `.env` and `tools/project-scripts/production-setup/.env.setup` files with the project server settings.
   - `env.setup.example` contains the environment variables required for production-setup.

2. **Deploy Project-Specific Contracts:**

   - Run the `_setup-deployment.ts` script to deploy contracts for the specific project.
   - To deploy the contracts in kenya project we can run the following command in rahat-kenya after updating `.env.setup`

   ```bash
   npx ts-node ./tools/project-scripts/production-setup/_setup-deployment.ts
   ```

3. **Update Graph Network Configuration:**

   - Edit the `apps/graph/networks.json` file in the project repository to include the blockchain network details.
   - Can run the `modify-graph-contracts `script to update the network details for graph.
   - To update the network details in kenya project we can run the following command

   ```bash
   npx ts-node ./tools/project-scripts/production-setup/_modify-graph-contracts.ts
   ```

4. **Generate and Build Graph Code:**

   - Run the following commands:
     ```bash
     pnpm graph:codegen
     pnpm graph:build
     ```

5. **Authorize Graph Deployment:**

   - Follow the graph documentation to create the new subgraph using subgraph studio [documetation](https://thegraph.com/docs/en/deploying/deploy-using-subgraph-studio/)

   - Authenticate with The Graph Studio using:
     ```bash
     graph auth --studio <deployment_key>
     ```

6. **Deploy the Subgraph:**

   - Use the deployment script defined in `package.json` to deploy the subgraph for the specified network.
   - Sample to update the script in package.json.

   ```bash
   "graph:studio:deploy-name": cd ./apps/graph && graph deploy --studio --network network_name subgraph_slug
   ```

   - Example to create the script to deploy the subgraph in `base-sepolia` for subgraph-slug `kenya-stage`

   ```bash
   "graph:studio:deploy-base-sepolia-stage": cd ./apps/graph && graph deploy --studio --network base-sepolia kenya-stage
   ```

   - Now run the script to deploy the graph for new contracts.
   - Need to provide the version value for subgraph deployment. `version value = one version greater than latest version`

7. **Update Subgraph Endpoints:**

   - Add the subgraph endpoint details to the `project_id.json` file in the `deployments` folder.
   - Get the subgraph endpoint url from the subgraph profile.(https://thegraph.com/studio/subgraph/${subgraph_slug})
   - Use the following format:
     ```json
     "subgraphUrl": {
       "url": "https://api.studio.thegraph.com/query/<project_id>/<project_name>/version/latest"
     }
     ```

8. **Update Database with Contracts and Settings:**

   - Execute the `update-deployment.ts` script to update the project database with the deployed contracts and blockchain configurations.
   - To update the deployment settings for kenya-project we can run the following command:

   ```bash
    npx ts-node ./tools/project-scripts/production-setup/update-deployment.ts
   ```

9. **Run Project Specific Scripts:**

   - If there are any project specific scripts execute those scripts as per details mentioned in project Readme .

10. **Update the Rahat Claim Address:**
    - If the project requires the otp server update the `contractToListen` value with Rahat Claim address after contract deployments.

---

By following these steps, you can successfully deploy Rahat Core and its projects while ensuring synchronization across environments.
