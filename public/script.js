document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navReverseShells = document.getElementById('nav-reverse-shells');
  const navServicesPentest = document.getElementById('nav-services-pentest');
  const navPrivesc = document.getElementById('nav-privesc');
  const reverseShellsSection = document.getElementById('reverse-shells');
  const servicesPentestSection = document.getElementById('services-pentest');
  const privescSection = document.getElementById('privesc');

  // Reverse Shells elements
  const shellTypeSelect = document.getElementById('shell-type');
  const shellIpInput = document.getElementById('shell-ip');
  const shellPortInput = document.getElementById('shell-port');
  const shellGenerateBtn = document.getElementById('shell-generate-btn');
  const shellOutputDiv = document.getElementById('shell-output-div');
  const shellOutput = document.getElementById('shell-output');
  const shellCopyBtn = document.getElementById('shell-copy-btn');

  // Services Pentesting elements
  const serviceTypeSelect = document.getElementById('service-type');
  const serviceIpInput = document.getElementById('service-ip');
  const servicePortInput = document.getElementById('service-port');
  const serviceGenerateBtn = document.getElementById('service-generate-btn');
  const serviceOutputDiv = document.getElementById('service-output-div');
  const serviceOutput = document.getElementById('service-output');
  const serviceCopyBtn = document.getElementById('service-copy-btn');

  // Privilege Escalation elements
  const privescSearchInput = document.getElementById('privesc-search');
  const privescTagsDiv = document.getElementById('privesc-tags');
  const privescResultsDiv = document.getElementById('privesc-results');
  const privescSelectedInput = document.getElementById('privesc-selected');
  const privescCommandInput = document.getElementById('privesc-command');
  const privescGenerateBtn = document.getElementById('privesc-generate-btn');
  const privescOutputDiv = document.getElementById('privesc-output-div');
  const privescOutput = document.getElementById('privesc-output');
  const privescDescription = document.getElementById('privesc-description');
  const privescCopyBtn = document.getElementById('privesc-copy-btn');

  // Navigation logic
  function showSection(sectionId) {
    const sections = [reverseShellsSection, servicesPentestSection, privescSection];
    const navs = [navReverseShells, navServicesPentest, navPrivesc];
    sections.forEach(section => section.classList.add('hidden'));
    navs.forEach(nav => {
      nav.classList.remove('text-blue-500', 'border-b-2', 'border-blue-500');
      nav.classList.add('text-gray-500');
    });

    if (sectionId === 'reverse-shells') {
      reverseShellsSection.classList.remove('hidden');
      navReverseShells.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
    } else if (sectionId === 'services-pentest') {
      servicesPentestSection.classList.remove('hidden');
      navServicesPentest.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
    } else if (sectionId === 'privesc') {
      privescSection.classList.remove('hidden');
      navPrivesc.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
    }
  }

  navReverseShells.addEventListener('click', () => showSection('reverse-shells'));
  navServicesPentest.addEventListener('click', () => showSection('services-pentest'));
  navPrivesc.addEventListener('click', () => showSection('privesc'));

  // Debounce function
  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }

  // Load Reverse Shells
  fetch('shells.json')
    .then(response => response.json())
    .then(data => {
      data.shells.forEach(shell => {
        const option = document.createElement('option');
        option.value = shell.id;
        option.textContent = `${shell.name} (${shell.language})`;
        shellTypeSelect.appendChild(option);
      });
      window.shells = data.shells;
    })
    .catch(error => console.error('Error loading shells:', error));

  // Load Services Pentesting
  fetch('services.json')
    .then(response => response.json())
    .then(data => {
      data.services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.name} (${service.protocol})`;
        serviceTypeSelect.appendChild(option);
      });
      window.services = data.services;
    })
    .catch(error => console.error('Error loading services:', error));

  // Privilege Escalation Search and Tags
  let selectedTechniqueId = null;
  let activeTags = [];

  function renderPrivescTags() {
    const tags = [...new Set(window.techniques.flatMap(t => t.tags))];
    privescTagsDiv.innerHTML = '';
    tags.forEach(tag => {
      const button = document.createElement('button');
      button.textContent = tag;
      button.className = `px-2 py-1 rounded-md text-sm ${activeTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
      button.addEventListener('click', () => {
        if (activeTags.includes(tag)) {
          activeTags = activeTags.filter(t => t !== tag);
        } else {
          activeTags.push(tag);
        }
        renderPrivescResults();
        renderPrivescTags();
      });
      privescTagsDiv.appendChild(button);
    });
  }

  function renderPrivescResults() {
    const query = privescSearchInput.value.trim().toLowerCase();
    let filteredTechniques = window.techniques;

    if (query) {
      filteredTechniques = filteredTechniques.filter(t =>
        t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      );
    }

    if (activeTags.length > 0) {
      filteredTechniques = filteredTechniques.filter(t =>
        activeTags.every(tag => t.tags.includes(tag))
      );
    }

    privescResultsDiv.innerHTML = '';
    if (filteredTechniques.length === 0) {
      privesResultsDiv.innerHTML = '<p class="text-gray-500">No techniques found.</p>';
      return;
    }

    filteredTechniques.forEach(technique => {
      const div = document.createElement('div');
      div.className = 'p-2 border rounded-md cursor-pointer hover:bg-blue-100';
      div.innerHTML = `
        <h3 class="text-sm font-semibold">${technique.name}</h3>
        <p class="text-xs text-gray-600">${technique.description}</p>
      `;
      div.addEventListener('click', () => {
        selectedTechniqueId = technique.id;
        privescSelectedInput.value = technique.name;
        generatePrivescCommand();
      });
      privescResultsDiv.appendChild(div);
    });
  }

  // Load Privilege Escalation Techniques
  fetch('privesc.json')
    .then(response => response.json())
    .then(data => {
      window.techniques = data.techniques;
      renderPrivescTags();
      renderPrivescResults();
    })
    .catch(error => console.error('Error loading privesc:', error));

  privescSearchInput.addEventListener('input', debounce(renderPrivescResults, 300));

  // Generate Reverse Shell
  function generateShell() {
    const shellId = shellTypeSelect.value;
    const ip = shellIpInput.value.trim();
    const port = shellPortInput.value.trim();

    if (!shellId || !ip || !port) {
      shellOutputDiv.classList.add('hidden');
      return;
    }

    const shell = window.shells.find(s => s.id === shellId);
    if (!shell) {
      shellOutput.textContent = 'Error: Selected shell not found.';
      shellOutputDiv.classList.remove('hidden');
      return;
    }

    let command = shell.command;
    command = command.replace('{IP}', ip).replace('{PORT}', port);

    shellOutput.textContent = command;
    shellOutputDiv.classList.remove('hidden');

    shellCopyBtn.onclick = () => {
      navigator.clipboard.writeText(command)
        .then(() => alert('Command copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    };
  }

  // Generate Service Pentesting Command
  function generateServiceCommand() {
    const serviceId = serviceTypeSelect.value;
    const ip = serviceIpInput.value.trim();
    const port = servicePortInput.value.trim();

    if (!serviceId || !ip || !port) {
      serviceOutputDiv.classList.add('hidden');
      return;
    }

    const service = window.services.find(s => s.id === serviceId);
    if (!service) {
      serviceOutput.textContent = 'Error: Selected service not found.';
      serviceOutputDiv.classList.remove('hidden');
      return;
    }

    let command = service.command;
    command = command.replace('{IP}', ip).replace('{PORT}', port);

    serviceOutput.textContent = command;
    serviceOutputDiv.classList.remove('hidden');

    serviceCopyBtn.onclick = () => {
      navigator.clipboard.writeText(command)
        .then(() => alert('Command copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    };
  }

  // Generate Privilege Escalation Command
  function generatePrivescCommand() {
    const commandInput = privescCommandInput.value.trim();

    if (!selectedTechniqueId || !commandInput) {
      privescOutputDiv.classList.add('hidden');
      return;
    }

    const technique = window.techniques.find(t => t.id === selectedTechniqueId);
    if (!technique) {
      privescOutput.textContent = 'Error: Selected technique not found.';
      privescOutputDiv.classList.remove('hidden');
      return;
    }

    let command = techniquevoice.command;
    command = command.replace('{COMMAND}', commandInput);

    privescOutput.textContent = command;
    privescDescription.textContent = technique.description;
    privescOutputDiv.classList.remove('hidden');

    privescCopyBtn.onclick = () => {
      navigator.clipboard.writeText(command)
        .then(() => alert('Command copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    };
  }

  // Auto-generate with debounce
  const debouncedShellGenerate = debounce(generateShell, 300);
  const debouncedServiceGenerate = debounce(generateServiceCommand, 300);
  const debouncedPrivescGenerate = debounce(generatePrivescCommand, 300);

  // Reverse Shells event listeners
  shellTypeSelect.addEventListener('change', generateShell);
  shellIpInput.addEventListener('input', debouncedShellGenerate);
  shellPortInput.addEventListener('input', debouncedShellGenerate);
  shellGenerateBtn.addEventListener('click', generateShell);

  // Services Pentesting event listeners
  serviceTypeSelect.addEventListener('change', generateServiceCommand);
  serviceIpInput.addEventListener('input', debouncedServiceGenerate);
  servicePortInput.addEventListener('input', debouncedServiceGenerate);
  serviceGenerateBtn.addEventListener('click', generateServiceCommand);

  // Privilege Escalation event listeners
  privescCommandInput.addEventListener('input', debouncedPrivescGenerate);
  privescGenerateBtn.addEventListener('click', generatePrivescCommand);

  // Initialize with Reverse Shells section
  showSection('reverse-shells');
});
