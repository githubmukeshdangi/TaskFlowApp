# TaskFlow – Task Management App

TaskFlow is a simple task management mobile application built using React Native, Expo, and TypeScript.

It helps users create, update, delete, and manage their daily tasks.

## Features

* Add, edit, and delete tasks
* Mark tasks as completed
* Search and filter tasks
* Sort tasks
* Dashboard with task statistics
* Bulk task import using CSV
* CSV validation and duplicate detection
* Light and Dark theme
* Local data storage using AsyncStorage

## Tech Stack

* React Native
* Expo
* TypeScript
* React Navigation
* AsyncStorage
* PapaParse
* Moment.js

## Installation

Prerequisites :
* Node.js
* npm
* Expo Go or an Android emulator
* Git


Clone the repository:

```bash
git clone https://github.com/githubmukeshdangi/TaskFlowApp.git
```

Go to the project directory:

```bash
cd TaskFlow
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npx expo start
```

## CSV Upload

A sample CSV file is provided in the `sample-data/tasks.csv` folder.

Supported columns:

```csv
id,title,description,category,priority,start_date,due_date,status
```

Users can select a CSV file, validate records, preview tasks, and import valid records.

Task data is read dynamically from the CSV file and is not hard-coded in the application.

## Data Storage

The application uses AsyncStorage to save tasks locally on the device.

## Author

**Mukesh Dangi**
