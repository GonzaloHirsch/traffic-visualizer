#!/usr/bin/env node

const { spawn } = require('child_process');

// Function to execute a command asynchronously
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    const parts = command.split(' ');
    const cmd = parts.shift();
    const args = parts;

    const childProcess = spawn(cmd, args);

    // Log stdout
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    // Log stderr
    childProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    // Resolve or reject based on process exit
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};

// Function to start frontend and backend concurrently
const startApp = async () => {
  try {
    // Start backend server
    console.log('Starting backend and frontend server...');
    await executeCommand('npm run visualizer');
  } catch (error) {
    console.error('Error starting application:', error);
  }
};

// Run the application
startApp();
