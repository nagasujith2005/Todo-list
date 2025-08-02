// TaskMaster Pro - Professional Task Management
class TaskMasterPro {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.currentFilter = 'all';
    this.currentCategoryFilter = '';
    this.currentPriorityFilter = '';
    this.searchQuery = '';
    this.settings = this.loadSettings();
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderTasks();
    this.updateStats();
    this.showEmptyState();
    this.applySettings();
  }

  loadSettings() {
    const defaultSettings = {
      showCompleted: true,
      showDueDates: true,
      showCategories: true
    };
    return JSON.parse(localStorage.getItem('settings')) || defaultSettings;
  }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  bindEvents() {
    // Add task button
    document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
    
    // Enter key in input
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTask();
      }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderTasks();
      this.showEmptyState();
      
      const clearBtn = document.getElementById('clearSearch');
      if (this.searchQuery) {
        clearBtn.style.display = 'block';
      } else {
        clearBtn.style.display = 'none';
      }
    });

    document.getElementById('clearSearch').addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      this.searchQuery = '';
      this.renderTasks();
      this.showEmptyState();
      document.getElementById('clearSearch').style.display = 'none';
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Category and priority filters
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.currentCategoryFilter = e.target.value;
      this.renderTasks();
      this.showEmptyState();
    });

    document.getElementById('priorityFilter').addEventListener('change', (e) => {
      this.currentPriorityFilter = e.target.value;
      this.renderTasks();
      this.showEmptyState();
    });

    // Bulk actions
    document.getElementById('bulkComplete').addEventListener('click', () => {
      this.showConfirmModal('Complete All Tasks', 'Are you sure you want to mark all visible tasks as completed?', () => {
        this.bulkCompleteTasks();
      });
    });

    document.getElementById('bulkDelete').addEventListener('click', () => {
      this.showConfirmModal('Delete All Tasks', 'Are you sure you want to delete all visible tasks? This action cannot be undone.', () => {
        this.bulkDeleteTasks();
      });
    });

    // Settings modal
    document.getElementById('settingsBtn').addEventListener('click', () => {
      this.showSettingsModal();
    });

    document.getElementById('closeSettings').addEventListener('click', () => {
      this.hideSettingsModal();
    });

    // Help modal
    document.getElementById('helpBtn').addEventListener('click', () => {
      this.showHelpModal();
    });

    document.getElementById('closeHelp').addEventListener('click', () => {
      this.hideHelpModal();
    });

    // Contact support button
    document.getElementById('contactSupportBtn').addEventListener('click', () => {
      this.hideHelpModal();
      this.showContactModal();
    });

    // Contact modal
    document.getElementById('closeContact').addEventListener('click', () => {
      this.hideContactModal();
    });

    document.getElementById('cancelContact').addEventListener('click', () => {
      this.hideContactModal();
    });

    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactForm();
    });

    // Privacy modal
    document.getElementById('privacyLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showPrivacyModal();
    });

    document.getElementById('privacyFooterLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showPrivacyModal();
    });

    document.getElementById('closePrivacy').addEventListener('click', () => {
      this.hidePrivacyModal();
    });

    // Terms modal
    document.getElementById('termsLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showTermsModal();
    });

    document.getElementById('termsFooterLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showTermsModal();
    });

    document.getElementById('closeTerms').addEventListener('click', () => {
      this.hideTermsModal();
    });

    // Footer links
    document.getElementById('contactLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showContactModal();
    });

    document.getElementById('contactFooterLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showContactModal();
    });

    // Settings checkboxes
    document.getElementById('showCompleted').addEventListener('change', (e) => {
      this.settings.showCompleted = e.target.checked;
      this.saveSettings();
      this.renderTasks();
    });

    document.getElementById('showDueDates').addEventListener('change', (e) => {
      this.settings.showDueDates = e.target.checked;
      this.saveSettings();
      this.renderTasks();
    });

    document.getElementById('showCategories').addEventListener('change', (e) => {
      this.settings.showCategories = e.target.checked;
      this.saveSettings();
      this.renderTasks();
    });

    // Data management
    document.getElementById('exportData').addEventListener('click', () => {
      this.exportData();
    });

    document.getElementById('importData').addEventListener('click', () => {
      this.importData();
    });

    document.getElementById('clearAllData').addEventListener('click', () => {
      this.showConfirmModal('Clear All Data', 'Are you sure you want to delete all tasks and settings? This action cannot be undone.', () => {
        this.clearAllData();
      });
    });

    // Confirmation modal
    document.getElementById('closeConfirm').addEventListener('click', () => {
      this.hideConfirmModal();
    });

    document.getElementById('cancelAction').addEventListener('click', () => {
      this.hideConfirmModal();
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hideSettingsModal();
        this.hideHelpModal();
        this.hideContactModal();
        this.hidePrivacyModal();
        this.hideTermsModal();
        this.hideConfirmModal();
      }
    });

    // Footer feature links (placeholder functionality)
    this.bindFooterLinks();
  }

  bindFooterLinks() {
    const footerLinks = [
      'featuresLink', 'pricingLink', 'roadmapLink', 'changelogLink',
      'helpCenterLink', 'faqLink', 'feedbackLink', 'aboutLink', 'cookiesLink'
    ];

    footerLinks.forEach(linkId => {
      const element = document.getElementById(linkId);
      if (element) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.showNotification('This feature is coming soon!', 'info');
        });
      }
    });
  }

  addTask() {
    const input = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const prioritySelect = document.getElementById('prioritySelect');
    const dueDateInput = document.getElementById('dueDateInput');
    
    const text = input.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (text === '') {
      this.showNotification('Please enter a task', 'error');
      return;
    }

    if (text.length > 100) {
      this.showNotification('Task is too long (max 100 characters)', 'error');
      return;
    }

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      category: category,
      priority: priority,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.showEmptyState();

    // Clear inputs
    input.value = '';
    categorySelect.value = '';
    prioritySelect.value = 'medium';
    dueDateInput.value = '';
    input.focus();

    this.showNotification('Task added successfully!', 'success');
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
    }
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
      this.showEmptyState();
      this.showNotification('Task deleted', 'info');
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    this.renderTasks();
    this.showEmptyState();
  }

  getFilteredTasks() {
    let filtered = this.tasks;

    // Apply status filter
    switch (this.currentFilter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => !task.completed && task.dueDate && new Date(task.dueDate) < new Date());
        break;
    }

    // Apply category filter
    if (this.currentCategoryFilter) {
      filtered = filtered.filter(task => task.category === this.currentCategoryFilter);
    }

    // Apply priority filter
    if (this.currentPriorityFilter) {
      filtered = filtered.filter(task => task.priority === this.currentPriorityFilter);
    }

    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(this.searchQuery) ||
        (task.category && task.category.toLowerCase().includes(this.searchQuery))
      );
    }

    // Apply settings filter
    if (!this.settings.showCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    return filtered;
  }

  renderTasks() {
    const taskList = document.getElementById('taskList');
    const filteredTasks = this.getFilteredTasks();
    
    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.priority}`;
      li.dataset.taskId = task.id;

      // Add overdue class if task is overdue
      if (!task.completed && task.dueDate && new Date(task.dueDate) < new Date()) {
        li.classList.add('overdue');
      }

      const checkbox = document.createElement('div');
      checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
      checkbox.innerHTML = task.completed ? '<i class="fas fa-check"></i>' : '';
      checkbox.addEventListener('click', () => this.toggleTask(task.id));

      const content = document.createElement('div');
      content.className = 'task-content';

      const text = document.createElement('span');
      text.className = `task-text ${task.completed ? 'completed' : ''}`;
      text.textContent = task.text;

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      // Add category if enabled and exists
      if (this.settings.showCategories && task.category) {
        const category = document.createElement('span');
        category.className = 'task-category';
        category.innerHTML = this.getCategoryIcon(task.category);
        meta.appendChild(category);
      }

      // Add priority if exists
      if (task.priority) {
        const priority = document.createElement('span');
        priority.className = 'task-priority';
        priority.innerHTML = this.getPriorityIcon(task.priority);
        meta.appendChild(priority);
      }

      // Add due date if enabled and exists
      if (this.settings.showDueDates && task.dueDate) {
        const due = document.createElement('span');
        due.className = 'task-due';
        due.innerHTML = `<i class="fas fa-calendar"></i> ${this.formatDate(task.dueDate)}`;
        meta.appendChild(due);
      }

      content.appendChild(text);
      content.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      actions.appendChild(deleteBtn);
      li.appendChild(checkbox);
      li.appendChild(content);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  getCategoryIcon(category) {
    const icons = {
      work: '💼',
      personal: '👤',
      shopping: '🛒',
      health: '🏥',
      finance: '💰',
      education: '📚',
      home: '🏠',
      other: '📝'
    };
    return icons[category] || '📝';
  }

  getPriorityIcon(priority) {
    const icons = {
      urgent: '🚨',
      high: '🔴',
      medium: '⚪',
      low: '🟢'
    };
    return icons[priority] || '⚪';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = this.tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('overdueTasks').textContent = overdue;
  }

  showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const taskList = document.getElementById('taskList');
    
    if (this.getFilteredTasks().length === 0) {
      emptyState.style.display = 'block';
      taskList.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      taskList.style.display = 'flex';
    }
  }

  bulkCompleteTasks() {
    const filteredTasks = this.getFilteredTasks();
    filteredTasks.forEach(task => {
      task.completed = true;
    });
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.showNotification(`${filteredTasks.length} tasks completed`, 'success');
  }

  bulkDeleteTasks() {
    const filteredTasks = this.getFilteredTasks();
    const taskIds = filteredTasks.map(task => task.id);
    this.tasks = this.tasks.filter(task => !taskIds.includes(task.id));
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.showEmptyState();
    this.showNotification(`${filteredTasks.length} tasks deleted`, 'info');
  }

  // Modal Management
  showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('show');
  }

  hideSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('show');
  }

  showHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.classList.add('show');
  }

  hideHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.classList.remove('show');
  }

  showContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('show');
    // Clear form
    document.getElementById('contactForm').reset();
  }

  hideContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
  }

  showPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    modal.classList.add('show');
  }

  hidePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    modal.classList.remove('show');
  }

  showTermsModal() {
    const modal = document.getElementById('termsModal');
    modal.classList.add('show');
  }

  hideTermsModal() {
    const modal = document.getElementById('termsModal');
    modal.classList.remove('show');
  }

  showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmAction');

    titleEl.textContent = title;
    messageEl.textContent = message;

    // Remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
      onConfirm();
      this.hideConfirmModal();
    });

    modal.classList.add('show');
  }

  hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('show');
  }

  // Contact Form Handler
  handleContactForm() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return;
    }

    // Simulate form submission
    this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    this.hideContactModal();
    
    // In a real application, you would send this data to your server
    console.log('Contact Form Submission:', { name, email, subject, message });
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  applySettings() {
    document.getElementById('showCompleted').checked = this.settings.showCompleted;
    document.getElementById('showDueDates').checked = this.settings.showDueDates;
    document.getElementById('showCategories').checked = this.settings.showCategories;
  }

  exportData() {
    const data = {
      tasks: this.tasks,
      settings: this.settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('Data exported successfully', 'success');
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (data.tasks && Array.isArray(data.tasks)) {
              this.tasks = data.tasks;
              if (data.settings) {
                this.settings = { ...this.settings, ...data.settings };
                this.saveSettings();
                this.applySettings();
              }
              this.saveTasks();
              this.renderTasks();
              this.updateStats();
              this.showEmptyState();
              this.showNotification('Data imported successfully', 'success');
            } else {
              this.showNotification('Invalid file format', 'error');
            }
          } catch (error) {
            this.showNotification('Error importing data', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  clearAllData() {
    this.tasks = [];
    this.settings = {
      showCompleted: true,
      showDueDates: true,
      showCategories: true
    };
    this.saveTasks();
    this.saveSettings();
    this.applySettings();
    this.renderTasks();
    this.updateStats();
    this.showEmptyState();
    this.showNotification('All data cleared', 'info');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${this.getNotificationIcon(type)}"></i>
      <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }

  getNotificationColor(type) {
    switch (type) {
      case 'success': return '#48bb78';
      case 'error': return '#f56565';
      case 'warning': return '#ed8936';
      default: return '#667eea';
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new TaskMasterPro();
});
