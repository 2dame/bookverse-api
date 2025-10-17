/**
 * File Manager Utility with Mutex for concurrent file operations
 * Handles reading and writing JSON data files safely
 */
const fs = require('fs').promises;
const path = require('path');
const { Mutex } = require('async-mutex');

// Create mutexes for each data file to prevent race conditions
const fileMutexes = {
  books: new Mutex(),
  users: new Mutex(),
  reviews: new Mutex()
};

/**
 * Read JSON data from file with mutex lock
 * @param {string} filename - Name of the data file (books, users, reviews)
 * @returns {Promise<Object>} - Parsed JSON data
 */
async function readData(filename) {
  const mutex = fileMutexes[filename];
  const release = await mutex.acquire();
  
  try {
    const filePath = path.join(__dirname, '..', 'data', `${filename}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}.json:`, error);
    return { [filename]: [] };
  } finally {
    release();
  }
}

/**
 * Write JSON data to file with mutex lock
 * @param {string} filename - Name of the data file (books, users, reviews)
 * @param {Object} data - Data object to write
 * @returns {Promise<void>}
 */
async function writeData(filename, data) {
  const mutex = fileMutexes[filename];
  const release = await mutex.acquire();
  
  try {
    const filePath = path.join(__dirname, '..', 'data', `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filename}.json:`, error);
    throw error;
  } finally {
    release();
  }
}

module.exports = {
  readData,
  writeData
};

