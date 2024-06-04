# Order Management System

## Overview

The Order Management System (OMS) is a comprehensive web application designed to streamline and optimize the order management process for businesses. This system provides an integrated solution to monitor and manage various logistics activities, including order creation, schedule coordination, route monitoring, cost management, and reporting.

## Demo

You can access the live demo of the application [here](https://orlist.vercel.app).

## Features

- **Product Management**: Add, edit, and delete products with detailed information such as name, images, descriptions, prices, and availability.
- **Order Management**: Create, edit, and delete orders, track order status, and send notifications to customers regarding their order status.
- **Receiver/Store Management**: Manage detailed information about stores and receivers, and generate reports.
- **Payment Management**: Support for two payment methods: cash on delivery (COD) and advance payment, with accurate processing of both successful and failed transactions.
- **Shipping Management**: Track shipping progress, handle order cancellations, and provide accurate delivery information to customers.
- **Staff Management**: Manage staff accounts, assign roles and permissions, and facilitate communication among team members.
- **Reporting Management**: Generate detailed reports on key metrics such as revenue, profit margins, top-selling products, and customer preferences.
- **Guest Access**: Allow guests to track order status with limited information.

## Technologies Used

- **Frontend**: Next.js, Redux
- **Backend**: Spring Framework, Spring Boot
- **Database**: MySQL
- **Containerization**: Docker
- **Testing**: JUnit 5
- **Deployment**: Microsoft Visual Studio Code Dev Tunnel, Vercel

## Installation

1. **Clone the Repositories**
   ```bash
   # Clone frontend repository
   git clone https://github.com/HThanh-how/order-management.git
   cd order-management

   # Clone backend repository
   git clone https://github.com/tuannguyenhcmuut/CP_RTTH.git
   cd CP_RTTH

   # Clone Android repository
   git clone https://github.com/HThanh-how/Expo-Delivery-App.git
   cd Expo-Delivery-App
   ```

2. **Setup Backend**
   - Navigate to the backend directory.
   - Build the Spring Boot application.
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Setup Frontend**
   - Navigate to the frontend directory.
   - Install dependencies.
   ```bash
   npm install
   ```
   - Start the development server.
   ```bash
   npm run dev
   ```

4. **Run Docker Containers**
   - Ensure Docker is installed and running.
   - Build and run the Docker containers.
   ```bash
   docker-compose up --build
   ```

## Usage

1. **Access the Application**
   - Open your web browser and navigate to `http://localhost:3000` for the frontend.
   - The backend API is available at `http://localhost:8080`.

2. **Create and Manage Orders**
   - Log in as a shop owner or staff.
   - Navigate to the order management section to create, edit, or delete orders.
   - Track order status and update as needed.

3. **Manage Products**
   - Navigate to the product management section.
   - Add, edit, or delete products from the catalog.
   - Search and sort products by various criteria.

4. **Monitor Shipping**
   - View the shipping progress of orders.
   - Handle order cancellations and update statuses.

## API Documentation

The API documentation is available at `http://localhost:8080/api-docs`. This provides detailed information on all available endpoints, request parameters, and response formats.

## Contributors

- [**Cao Anh Huân**](https://github.com/ah2909)
- [**Phạm Huy Thanh**](https://github.com/HThanh-how/)
- [**Nguyễn Đức Tuấn**](https://github.com/ndtuanftd)

## Acknowledgements

We would like to express our sincere gratitude to PhD. Trương Tuấn Anh for his invaluable support and guidance throughout this project. We also thank Ho Chi Minh City University of Technology for providing a professional environment to conduct our research.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Release

You can find the release version of the project [here](https://github.com/HThanh-how/order-management/releases).

