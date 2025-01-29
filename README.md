
## Core Repository Overview

### Purpose and Structure

The core repository serves as the foundational codebase for managing and deploying multiple projects within a single, cohesive environment. It is designed to facilitate modular development, allowing teams to work on isolated components while ensuring seamless integration. The structure is organized to support scalability, maintainability, and ease of collaboration. It typically includes multiple directories for applications, libraries, tools, and configuration files, all managed through a monorepo approach to streamline development processes.

## Core Components

### Description of Key Components

- **Applications (apps/)**: Contains the various applications, each with its own configuration and source code. For example, the `beneficiary` application includes specific services, controllers, and modules necessary for its functionality.
- **Libraries (libs/)**: Shared libraries that can be utilized by multiple applications to promote code reuse and consistency.
- **Prisma (prisma/)**: Manages database migrations and schema definitions, ensuring data integrity and ease of database management.
- **Tools (tools/)**: Scripts and configurations for development tools, such as Docker compose files and utility scripts for setting up and managing the development environment.
  - **docker-compose/**: Contains Docker Compose configurations for setting up various development environments.
    - **dev-tools/**: Configuration files and scripts for setting up development tools using Docker Compose.
      - **.env.example**: Example environment variables file.
      - **docker-compose.yml**: Docker Compose configuration file for development tools.
      - **.env**: Environment variables file.
    - **graph/**: Configuration files for setting up graph-related services using Docker Compose.
      - **docker-compose.yml**: Docker Compose configuration file for graph services.
  - **scripts/**: Utility scripts for setting up, managing, and maintaining the development environment.
    - **getEth.ts**: Script to obtain test ETH for development purposes.
    - **setupDevTools.sh**: Shell script to set up development tools.
    - **utils.sh**: Shell script containing utility functions.
    - **bootstrap.sh**: Shell script to bootstrap the development environment.
    - **mn.ts**: Script for managing mnemonic phrases for test accounts.
    - **publish.mjs**: Script to publish packages.
    - **reset.sh**: Shell script to reset the development environment.
- **Configuration Files**: Includes ESLint, Prettier, Jest, and other configuration files (`.eslintrc.json`, `jest.config.ts`, `tsconfig.base.json`, etc.) to enforce coding standards and streamline the development workflow.
- **Documentation (README.md, CONTRIBUTING.md)**: Provides guidelines for contributing to the repository, setup instructions, and an overview of the repository's purpose and structure.

## Integration

### How to Integrate with Project Repositories

Follow the steps below to set up and run the project in a development environment:

#### Prerequisites

Before you begin, ensure your system has the following dependencies installed:

- Docker: Version 20.10.7 or higher
- Node.js: Version 20.10.0 or higher
- pnpm (Package Manager): Version 6.16.1 or higher

#### Setup

1. **Clone the Repository**

   Use the following command to clone the repository:

   ```bash
   git clone git@github.com:rahataid/rahat-platform-nx.git
   ```

2. **Bootstrap Rahat Core Services**

   This step installs the dependencies and runs all necessary services in Docker, as well as scripts to set up the project:

   ```bash
   pnpm bootstrap
   ```

3. **Clone the Desired Project**

   Rahat currently supports the following projects:

   - [rahat-project-c2c](https://github.com/rahataid/rahat-project-c2c)

   Clone the project you want to run and follow the instructions in its README.md file.

4. **Run the Rahat Project**

   Initiate the Rahat Core by executing the following commands in separate terminals:

   ```bash
   pnpm rahat
   ```

   ```bash
   pnpm beneficiary
   ```

   Note: If you require ETH in your MetaMask account, you can use the following command to get some test ETH. You will be asked to enter the wallet address to which you want to send the test ETH.

   ```bash
   pnpm getEth
   ```

5. **Access API Documentation**

   You can explore the API documentation at: [http://localhost:5501/swagger](http://localhost:5501/swagger)

Explore the functionalities provided by the Rahat Platform locally. If you encounter any issues, refer to the troubleshooting section within the documentation or contact the project maintainers for assistance.

# Production deployment

Refer to [deployment](docs/deployments.md) file for deployment steps.

# License
This project is licensed under the Mozilla Public License 2.0. See the [LICENSE](LICENSE) file for details.