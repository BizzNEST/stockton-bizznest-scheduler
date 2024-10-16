# nestHub

This project is a Randomized Scheduling Application for bizzNEST built with HTML, CSS, and JavaScript. It allows users to group and pair interns from different locations and departments based on customizable rules. Key features include intern data management, randomized scheduling, selection and filtering, rule configuration, manual overrides, edge case handling, and a responsive UI. The application is entirely frontend-based and optimized for lightweight, fast performance.

## Table of Contents

- [Project Requirements](#project-requirements)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Features](#features)
- [Development Process](#development-process)
- [License](#license)

# Project Requirements

To run this project, you will need:

1. A modern web browser (e.g., Chrome, Firefox, Edge)
2. A code editor (e.g., Visual Studio Code)
3. Live Server extension for Visual Studio Code

## Installation

Step-by-step instructions on how to get the development environment running.

1. Clone the repository:
    ```sh
    git clone https://github.com/BizzNEST/stockton-bizznest-scheduler.git
    ```
2. Navigate to the project directory:
    ```sh
    cd stockton-bizznest-scheduler
    ```
3. Open the project in Visual Studio Code:
    ```sh
    code .
    ```
4. Install the Live Server extension in Visual Studio Code if you haven't already:
    - Go to the Extensions view by clicking on the Extensions icon in the Sidebar or pressing `Ctrl+Shift+X`.
    - Search for "Live Server" and install it.


## Running the project

1. Start the Live Server:
    - Right-click on the `index.html` file in the Explorer and select "Open with Live Server".
    - Alternatively, press `Alt+L` followed by `Alt+O` to start the Live Server.

Your project should now be running in your default web browser.


## Usage

Instructions and examples for using the project.

1. **Start Pairing**:
    - On the index/home page, click the "Start Pairing" button.

2. **Select Interns**:
    - A modal will appear displaying the interns, their departments, and locations.
    - Select the interns you want to include in the pairing.
    - Use the filter options to filter by location and department.
    - Toggle the location and department options if you want the interns to be paired according to those criteria.

3. **Generate Pairs**:
    - After selecting the interns, click the "Pair" button.
    - You will be taken to the results page, which lists the pairs in a table.


4. **Edit Mode**:
    - Click the "Edit Mode" button to manually override the pairs.
    - Remove an intern from a pair to reassign them.

5. **Download Pairs**:
    - Click the "Download" button to download the pairs as a CSV file.

6. **Reset**:
    - Click the "Reset" button to return to the index page and restart the process.

7. **Edge Case Handling**:
    - The web app provides a pop-up message when edge cases are encountered, such as uneven numbers of interns.

8. **Accuracy Rating**:
    - An accuracy rating is displayed in the right corner of the results page, giving a percentage rating of how successful the pairing was based on the criteria.


## Features

- **Intern Data Management**: Store and display intern data from a static JSON object.
- **Randomized Scheduling**: Automatically generate schedules based on configurable rules, such as pairing interns from different cities or departments.
- **Selection and Filtering**: Include/exclude interns and apply filters based on location and department.
- **Rule Configuration**: Customize pairing rules and add new ones.
- **Manual Overrides**: Adjust schedules manually if needed.
- **Edge Case Handling**: Handle uneven numbers and conflicting criteria.
- **Responsive UI**: Provide a clean, accessible interface for both desktop and mobile.
- **CSV Export**: Download the generated pairs as a CSV file.
- **Edit Mode**: Manually override the pairs by removing and reassigning interns.
- **Reset Functionality**: Restart the pairing process from the index page.
- **GitHub Integration**: Follow structured commit and coding practices.


## Development Process

1. **Create a feature branch**:
    ```sh
    git checkout develop
    git pull origin develop
    git checkout -b feature/your-feature-name
    ```

2. **Make changes and commit**:
    ```sh
    git add .
    git commit -m "Description of your changes"
    ```

3. **Push and open a Pull Request**:
    ```sh
    git push origin feature/your-feature-name
    ```
    - Open a pull request from your feature branch into `Development`.

4. **Code Review and Merge**:
    - Address feedback, then merge the PR once approved.

5. **Update `Development` branch**:
    ```sh
    git checkout develop
    git pull origin develop
    ```


## License

This project is owned by Digital NEST. All rights reserved.