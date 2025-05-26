import { setupFormHandlers } from './formHandlers.js';
import { initPasswordOptions } from './passwordUtils.js';
import { initUsernameGeneration } from './usernameUtils.js';

document.addEventListener('DOMContentLoaded', () => {
  initPasswordOptions();
  initUsernameGeneration();
  setupFormHandlers();
});
