

let apiData;

document.addEventListener('DOMContentLoaded', function () {

  

  // Realizar requisição para a API
  fetch('http://localhost:8080/solicitacao')
    .then(response => response.json()) // Transformar a resposta em JSON
    .then(data => {
      apiData = data;
      fillTableWithData(apiData);
    })
    .catch(error => {
      console.error('Ocorreu um erro na requisição:', error);
    });

  const filterStartDateInput = document.getElementById('filterStartDate');
  const filterEndDateInput = document.getElementById('filterEndDate');
  const btnFilter = document.getElementById('btnFilter');
  const btnClearFilter = document.getElementById('btnClearFilter');
  const tableData = document.getElementById('tableData');
  const detailsModal = document.getElementById('detailsModal');
  const btnSaveChanges = document.getElementById('btnSaveChanges');
  const modalStatus = document.getElementById('modalStatus');
  const modalConsideracao = document.getElementById('modalConsideracao');
  const modalClose = document.getElementsByClassName('close')[0];

  let sortedColumn = null;
  let sortOrder = 'asc';

  // Evento do botão para filtrar os dados
  btnFilter.addEventListener('click', function () {
    applyFilter();
  });

  // Evento do botão para limpar o filtro
  btnClearFilter.addEventListener('click', function () {
    clearFilter();
  });

  // Função para aplicar o filtro
  function applyFilter() {
    const filterStartDate = filterStartDateInput.value;
    const filterEndDate = filterEndDateInput.value;

    const filteredData = apiData.filter(item => {
      const itemDate = new Date(item.data.split('/').reverse().join('-'));
      const startDate = filterStartDate ? new Date(filterStartDate) : null;
      const endDate = filterEndDate ? new Date(filterEndDate) : null;

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      } else if (endDate) {
        return itemDate <= endDate;
      } else {
        return true;
      }
    });

    fillTableWithFilteredData(filteredData);
  }

  // Função para limpar o filtro
  function clearFilter() {
    filterStartDateInput.value = '';
    filterEndDateInput.value = '';
    fillTableWithData(apiData);
    sortTable();
  }

   // Função para gerar o relatório com os dados filtrados
   function generateReport(filteredData) {
    const table = document.createElement('table');
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();

    const headerRow = tableHead.insertRow();
    const tableHeaders = ['ID', 'Nome', 'Data', 'Email', 'Telefone', 'Setor', 'Prioridade', 'Descrição', 'Status', 'Consideração'];
    for (let header of tableHeaders) {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    }

    for (let item of filteredData) {
      const row = tableBody.insertRow();
      const rowData = [
        item.id,
        item.nome,
        item.data,
        item.email,
        item.telefone,
        item.setor,
        item.prioridade,
        item.desc_solicitacao,
        item.status ? item.status : '',
        item.consideracao ? item.consideracao : ''
      ];
      for (let data of rowData) {
        const td = document.createElement('td');
        td.textContent = data;
        row.appendChild(td);
      }
    }

    return table;
  }


  // Função para preencher a tabela com os dados da API
  function fillTableWithData(apiData) {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = '';

    apiData.forEach(item => {
      const row = tbody.insertRow();
      const dateParts = item.data.split('/');
      const itemDate = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
      const formattedDate = itemDate.toLocaleDateString('pt-BR');

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${formattedDate}</td>
        <td>${item.email}</td>
        <td>${item.telefone}</td>
        <td>${item.setor}</td>
        <td>${item.prioridade}</td>
        <td>${item.desc_solicitacao}</td>
        <td>${item.status ? item.status : ''}</td>
        <td>${item.consideracao ? item.consideracao : ''}</td>
      `;

      row.addEventListener('click', function () {
        showModal(item);
      });
    });

    // Adicionar evento de ordenação nas colunas
    const headers = tableData.getElementsByTagName('th');
    for (let i = 0; i < headers.length; i++) {
      headers[i].addEventListener('click', function () {
        sortTable(i);
      });
    }
  }

  // Função para preencher a tabela com os dados filtrados da API
  function fillTableWithFilteredData(apiData) {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = '';

    apiData.forEach(item => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${item.data}</td>
        <td>${item.email}</td>
        <td>${item.telefone}</td>
        <td>${item.setor}</td>
        <td>${item.prioridade}</td>
        <td>${item.desc_solicitacao}</td>
        <td>${item.status ? item.status : ''}</td>
        <td>${item.consideracao ? item.consideracao : ''}</td>
      `;

      row.addEventListener('click', function () {
        showModal(item);
      });
    });
  }

  // Função para exibir o modal com os detalhes da solicitação
  function showModal(solicitacao) {
    const modalSolicitacaoId = document.getElementById('modalSolicitacaoId');
    const modalSolicitacaoNome = document.getElementById('modalSolicitacaoNome');
    const modalSolicitacaoData = document.getElementById('modalSolicitacaoData');
    const modalSolicitacaoEmail = document.getElementById('modalSolicitacaoEmail');
    const modalSolicitacaoTelefone = document.getElementById('modalSolicitacaoTelefone');
    const modalSolicitacaoSetor = document.getElementById('modalSolicitacaoSetor');
    const modalSolicitacaoPrioridade = document.getElementById('modalSolicitacaoPrioridade');
    const modalSolicitacaoDescricao = document.getElementById('modalSolicitacaoDescricao');
    const modalSolicitacaoStatus = document.getElementById('modalSolicitacaoStatus');
    const modalSolicitacaoConsideracao = document.getElementById('modalSolicitacaoConsideracao');
    const modalStatus = document.getElementById('modalStatus');
    const modalConsideracao = document.getElementById('modalConsideracao');
    const detailsModal = document.getElementById('detailsModal');
    


    modalSolicitacaoId.textContent = `ID: ${solicitacao.id}`;
    modalSolicitacaoNome.innerHTML = `Nome: <strong>${solicitacao.nome}</strong>`;
    modalSolicitacaoData.textContent = `Data: ${solicitacao.data}`;
    modalSolicitacaoEmail.textContent = `Email: ${solicitacao.email}`;
    modalSolicitacaoTelefone.textContent = `Telefone: ${solicitacao.telefone}`;
    modalSolicitacaoSetor.textContent = `Setor: ${solicitacao.setor}`;
    modalSolicitacaoPrioridade.innerHTML = `Prioridade: <strong>${solicitacao.prioridade}</strong>`;
    modalSolicitacaoDescricao.textContent = `Descrição: ${solicitacao.desc_solicitacao}`;
    modalSolicitacaoStatus.textContent = solicitacao.status ? solicitacao.status : 'Não informado';
    modalSolicitacaoConsideracao.textContent = solicitacao.consideracao ? solicitacao.consideracao : '';

    modalStatus.value = solicitacao.status ? solicitacao.status : '';
    modalConsideracao.value = solicitacao.consideracao ? solicitacao.consideracao : '';

    detailsModal.style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    detailsModal.style.display = 'none';
  }

  // Evento do botão para salvar as alterações no modal
  btnSaveChanges.addEventListener('click', function () {
    const newStatus = modalStatus.value;
    const newConsideracao = modalConsideracao.value;

    // Atualizar os valores no modal
    modalSolicitacaoStatus.textContent = newStatus;
    modalSolicitacaoConsideracao.textContent = newConsideracao;

    // Atualizar os valores na API
    const solicitacaoId = modalSolicitacaoId.textContent.replace('ID: ', '');
    const solicitacao = apiData.find(item => item.id === Number(solicitacaoId));
    if (solicitacao) {
      solicitacao.status = newStatus;
      solicitacao.consideracao = newConsideracao;

      // Enviar a requisição para a API para atualizar a solicitação no banco de dados
      const url = `http://localhost:8080/solicitacao`;

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solicitacao)
      })
        .then(response => {
          if (response.ok) {
            console.log('Alterações salvas com sucesso');
          } else {
            console.error('Ocorreu um erro ao salvar as alterações');
          }
          closeModal();
        })
        .catch(error => {
          console.error('Ocorreu um erro na requisição:', error);
          closeModal();
        });
    }
  });

  // Evento para fechar o modal ao clicar no botão de fechar
  modalClose.addEventListener('click', function () {
    closeModal();
  });

  // Evento para fechar o modal ao clicar fora dele
  window.addEventListener('click', function (event) {
    if (event.target === detailsModal) {
      closeModal();
    }
  });

  function sortTable(columnIndex) {
    const tbody = tableData.querySelector('tbody');
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    const comparator = (rowA, rowB) => {
      const cellA = rowA.getElementsByTagName('td')[columnIndex].textContent;
      const cellB = rowB.getElementsByTagName('td')[columnIndex].textContent;

      // Converter os valores para números
      const valueA = parseFloat(cellA);
      const valueB = parseFloat(cellB);

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return valueA - valueB;
      } else {
        return cellA.localeCompare(cellB, 'pt-BR');
      }
    };

    if (sortedColumn === columnIndex) {
      rows.reverse();
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      rows.sort(comparator);
      sortedColumn = columnIndex;
      sortOrder = 'asc';
    }

    tbody.innerHTML = '';
    rows.forEach(row => {
      tbody.appendChild(row);
    });
  }


  // Evento do botão para limpar o filtro
  btnClearFilter.addEventListener('click', function () {
    clearFilter();
  });

  // Evento do botão para gerar o relatório
const btnGenerateReport = document.getElementById('btnGenerateReport');
btnGenerateReport.addEventListener('click', function () {
  handleGenerateReport();
  
});

// Função para gerar o relatório com os dados filtrados
function handleGenerateReport() {
  const filterStartDate = filterStartDateInput.value;
  const filterEndDate = filterEndDateInput.value;

  const filteredData = apiData.filter(item => {
    const itemDate = new Date(item.data.split('/').reverse().join('-'));
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;

    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    } else {
      return true;
    }
  });

  const reportTable = generateReport(filteredData);

  // Abrir o relatório em uma nova janela
  const newWindow = window.open();
  newWindow.document.write('<html><head><title>Relatório de Solicitações</title></head><body>');
  newWindow.document.write('<h1>Relatório de Solicitações</h1>');
  newWindow.document.write('<style>table { border-collapse: collapse; }');
  newWindow.document.write('table, th, td { border: 1px solid black; padding: 8px; }</style>');
  newWindow.document.write(reportTable.outerHTML);
  newWindow.document.write('</body></html>');
  newWindow.document.close();
}

});

/*
let apiData;

document.addEventListener('DOMContentLoaded', function () {

  

  // Realizar requisição para a API
  fetch('http://localhost:8080/solicitacao')
    .then(response => response.json()) // Transformar a resposta em JSON
    .then(data => {
      apiData = data;
      fillTableWithData(apiData);
    })
    .catch(error => {
      console.error('Ocorreu um erro na requisição:', error);
    });

  const filterStartDateInput = document.getElementById('filterStartDate');
  const filterEndDateInput = document.getElementById('filterEndDate');
  const btnFilter = document.getElementById('btnFilter');
  const btnClearFilter = document.getElementById('btnClearFilter');
  const tableData = document.getElementById('tableData');
  const detailsModal = document.getElementById('detailsModal');
  const btnSaveChanges = document.getElementById('btnSaveChanges');
  const modalStatus = document.getElementById('modalStatus');
  const modalConsideracao = document.getElementById('modalConsideracao');
  const modalClose = document.getElementsByClassName('close')[0];

  let sortedColumn = null;
  let sortOrder = 'asc';

  // Evento do botão para filtrar os dados
  btnFilter.addEventListener('click', function () {
    applyFilter();
  });

  // Evento do botão para limpar o filtro
  btnClearFilter.addEventListener('click', function () {
    clearFilter();
  });

  // Função para aplicar o filtro
  function applyFilter() {
    const filterStartDate = filterStartDateInput.value;
    const filterEndDate = filterEndDateInput.value;

    const filteredData = apiData.filter(item => {
      const itemDate = new Date(item.data.split('/').reverse().join('-'));
      const startDate = filterStartDate ? new Date(filterStartDate) : null;
      const endDate = filterEndDate ? new Date(filterEndDate) : null;

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      } else if (endDate) {
        return itemDate <= endDate;
      } else {
        return true;
      }
    });

    fillTableWithFilteredData(filteredData);
  }

  // Função para limpar o filtro
  function clearFilter() {
    filterStartDateInput.value = '';
    filterEndDateInput.value = '';
    fillTableWithData(apiData);
    sortTable();
  }

   // Função para gerar o relatório com os dados filtrados
   function generateReport(filteredData) {
    const table = document.createElement('table');
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();

    const headerRow = tableHead.insertRow();
    const tableHeaders = ['ID', 'Nome', 'Data', 'Email', 'Telefone', 'Setor', 'Prioridade', 'Descrição', 'Status', 'Consideração'];
    for (let header of tableHeaders) {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    }

    for (let item of filteredData) {
      const row = tableBody.insertRow();
      const rowData = [
        item.id,
        item.nome,
        item.data,
        item.email,
        item.telefone,
        item.setor,
        item.prioridade,
        item.desc_solicitacao,
        item.status ? item.status : '',
        item.consideracao ? item.consideracao : ''
      ];
      for (let data of rowData) {
        const td = document.createElement('td');
        td.textContent = data;
        row.appendChild(td);
      }
    }

    return table;
  }


  // Função para preencher a tabela com os dados da API
  function fillTableWithData(apiData) {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = '';

    apiData.forEach(item => {
      const row = tbody.insertRow();
      const dateParts = item.data.split('/');
      const itemDate = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
      const formattedDate = itemDate.toLocaleDateString('pt-BR');

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${formattedDate}</td>
        <td>${item.email}</td>
        <td>${item.telefone}</td>
        <td>${item.setor}</td>
        <td>${item.prioridade}</td>
        <td>${item.desc_solicitacao}</td>
        <td>${item.status ? item.status : ''}</td>
        <td>${item.consideracao ? item.consideracao : ''}</td>
      `;

      row.addEventListener('click', function () {
        showModal(item);
      });
    });

    // Adicionar evento de ordenação nas colunas
    const headers = tableData.getElementsByTagName('th');
    for (let i = 0; i < headers.length; i++) {
      headers[i].addEventListener('click', function () {
        sortTable(i);
      });
    }
  }

  // Função para preencher a tabela com os dados filtrados da API
  function fillTableWithFilteredData(apiData) {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = '';

    apiData.forEach(item => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${item.data}</td>
        <td>${item.email}</td>
        <td>${item.telefone}</td>
        <td>${item.setor}</td>
        <td>${item.prioridade}</td>
        <td>${item.desc_solicitacao}</td>
        <td>${item.status ? item.status : ''}</td>
        <td>${item.consideracao ? item.consideracao : ''}</td>
      `;

      row.addEventListener('click', function () {
        showModal(item);
      });
    });
  }

  // Função para exibir o modal com os detalhes da solicitação
  function showModal(solicitacao) {
    const modalSolicitacaoId = document.getElementById('modalSolicitacaoId');
    const modalSolicitacaoNome = document.getElementById('modalSolicitacaoNome');
    const modalSolicitacaoData = document.getElementById('modalSolicitacaoData');
    const modalSolicitacaoEmail = document.getElementById('modalSolicitacaoEmail');
    const modalSolicitacaoTelefone = document.getElementById('modalSolicitacaoTelefone');
    const modalSolicitacaoSetor = document.getElementById('modalSolicitacaoSetor');
    const modalSolicitacaoPrioridade = document.getElementById('modalSolicitacaoPrioridade');
    const modalSolicitacaoDescricao = document.getElementById('modalSolicitacaoDescricao');
    const modalSolicitacaoStatus = document.getElementById('modalSolicitacaoStatus');
    const modalSolicitacaoConsideracao = document.getElementById('modalSolicitacaoConsideracao');
    const modalStatus = document.getElementById('modalStatus');
    const modalConsideracao = document.getElementById('modalConsideracao');
    const detailsModal = document.getElementById('detailsModal');
    


    modalSolicitacaoId.textContent = `ID: ${solicitacao.id}`;
    modalSolicitacaoNome.innerHTML = `Nome: <strong>${solicitacao.nome}</strong>`;
    modalSolicitacaoData.textContent = `Data: ${solicitacao.data}`;
    modalSolicitacaoEmail.textContent = `Email: ${solicitacao.email}`;
    modalSolicitacaoTelefone.textContent = `Telefone: ${solicitacao.telefone}`;
    modalSolicitacaoSetor.textContent = `Setor: ${solicitacao.setor}`;
    modalSolicitacaoPrioridade.innerHTML = `Prioridade: <strong>${solicitacao.prioridade}</strong>`;
    modalSolicitacaoDescricao.textContent = `Descrição: ${solicitacao.desc_solicitacao}`;
    modalSolicitacaoStatus.textContent = solicitacao.status ? solicitacao.status : 'Não informado';
    modalSolicitacaoConsideracao.textContent = solicitacao.consideracao ? solicitacao.consideracao : '';

    modalStatus.value = solicitacao.status ? solicitacao.status : '';
    modalConsideracao.value = solicitacao.consideracao ? solicitacao.consideracao : '';

    detailsModal.style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    detailsModal.style.display = 'none';
  }

  // Evento do botão para salvar as alterações no modal
  btnSaveChanges.addEventListener('click', function () {
    const newStatus = modalStatus.value;
    const newConsideracao = modalConsideracao.value;

    // Atualizar os valores no modal
    modalSolicitacaoStatus.textContent = newStatus;
    modalSolicitacaoConsideracao.textContent = newConsideracao;

    // Atualizar os valores na API
    const solicitacaoId = modalSolicitacaoId.textContent.replace('ID: ', '');
    const solicitacao = apiData.find(item => item.id === Number(solicitacaoId));
    if (solicitacao) {
      solicitacao.status = newStatus;
      solicitacao.consideracao = newConsideracao;

      // Enviar a requisição para a API para atualizar a solicitação no banco de dados
      const url = `http://localhost:8080/solicitacao`;

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solicitacao)
      })
        .then(response => {
          if (response.ok) {
            console.log('Alterações salvas com sucesso');
          } else {
            console.error('Ocorreu um erro ao salvar as alterações');
          }
          closeModal();
        })
        .catch(error => {
          console.error('Ocorreu um erro na requisição:', error);
          closeModal();
        });
    }
  });

  // Evento para fechar o modal ao clicar no botão de fechar
  modalClose.addEventListener('click', function () {
    closeModal();
  });

  // Evento para fechar o modal ao clicar fora dele
  window.addEventListener('click', function (event) {
    if (event.target === detailsModal) {
      closeModal();
    }
  });

  function sortTable(columnIndex) {
    const tbody = tableData.querySelector('tbody');
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    const comparator = (rowA, rowB) => {
      const cellA = rowA.getElementsByTagName('td')[columnIndex].textContent;
      const cellB = rowB.getElementsByTagName('td')[columnIndex].textContent;

      // Converter os valores para números
      const valueA = parseFloat(cellA);
      const valueB = parseFloat(cellB);

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return valueA - valueB;
      } else {
        return cellA.localeCompare(cellB, 'pt-BR');
      }
    };

    if (sortedColumn === columnIndex) {
      rows.reverse();
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      rows.sort(comparator);
      sortedColumn = columnIndex;
      sortOrder = 'asc';
    }

    tbody.innerHTML = '';
    rows.forEach(row => {
      tbody.appendChild(row);
    });
  }


  // Evento do botão para limpar o filtro
  btnClearFilter.addEventListener('click', function () {
    clearFilter();
  });

// Evento do botão para gerar o relatório
const btnGenerateReport = document.getElementById('btnGenerateReport');
btnGenerateReport.addEventListener('click', function () {
  handleGenerateReport();
});

// Função para gerar o relatório com os dados filtrados
function handleGenerateReport() {
  const filterStartDate = filterStartDateInput.value;
  const filterEndDate = filterEndDateInput.value;

  const filteredData = apiData.filter(item => {
    const itemDate = new Date(item.data.split('/').reverse().join('-'));
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;

    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    } else {
      return true;
    }
  });

  const reportTable = generateReport(filteredData);

  // Abrir o relatório em uma nova janela
  const newWindow = window.open();
  newWindow.document.write('<html><head><title>Relatório de Solicitações</title>');
  newWindow.document.write('<style>table { border-collapse: collapse; }');
  newWindow.document.write('table, th, td { border: 1px solid black; padding: 8px; }</style>');
  newWindow.document.write('</head><body>');
  newWindow.document.write('<h1>Relatório de Solicitações</h1>');
  newWindow.document.write('<table>');
  //newWindow.document.write('<thead><tr><th>ID</th><th>Nome</th><th>Data</th><th>Email</th><th>Telefone</th><th>Setor</th><th>Prioridade</th><th>Descrição</th><th>Status</th><th>Consideração</th></tr></thead>');
  newWindow.document.write('<tbody>');
  newWindow.document.write(reportTable.innerHTML);
  //newWindow.document.write('</tbody></table>');
  newWindow.document.write('</body></html>');
  newWindow.document.close();
}

newWindow.document.write(reportTable.outerHTML);
newWindow.document.write('</body></html>');

});*/