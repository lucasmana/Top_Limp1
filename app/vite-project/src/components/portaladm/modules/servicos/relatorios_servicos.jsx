import React, { useState, useMemo } from 'react';
import './relatorios_servicos.css';



const RelatoriosServicos = ({ servico, onClose, isVisible }) => {

  const [camposSelecionados, setCamposSelecionados] = useState({

    cliente: true,

    numeroOrcamento: true,

    tipoServico: true,

    status: true,

    descricao: true,

    datasExecucao: true,

    ultimaExecucao: true,

    proximaExecucao: true,

    horario: true,

    local: true,

    cidade: true,

    supervisor: true,

    equipe: true,

    veiculoPlaca: true,

    estruturasRealizadas: true,

    acompanhanteAssinatura: false,

    ocorrenciasProblemas: false,

    descricaoProblemas: false,

    observacoesGerais: false,

    certificadoEnviado: false,

    coletaRealizada: false,

    numeroPCColeta: false,

    numeroNotaFiscal: false,

    dataEmissaoNF: false

  });



  const relatorioData = useMemo(() => {

    if (!servico) {

      return {

        cliente: '',

        numeroOrcamento: '',

        tipoServico: '',

        status: '',

        descricao: '',

        datasExecucao: [],

        ultimaExecucao: '',

        proximaExecucao: '',

        horario: '',

        local: '',

        cidade: '',

        supervisor: '',

        equipe: '',

        veiculoPlaca: '',

        estruturasRealizadas: '',

        acompanhanteAssinatura: '',

        ocorrenciasProblemas: '',

        descricaoProblemas: '',

        observacoesGerais: '',

        certificadoEnviado: '',

        coletaRealizada: '',

        numeroPCColeta: '',

        numeroNotaFiscal: '',

        dataEmissaoNF: ''

      };

    }

    

    const formatDate = (value) => {
      if (!value) return 'N/A';
      if (typeof value === 'string' && value.includes('/')) return value;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('pt-BR');
    };

    return {
      cliente: servico.clienteNome || servico.cliente || servico.razaoSocial || 'N/A',
      numeroOrcamento: servico.numeroOrcamento || servico.numeroOrcament || servico.numero || 'N/A',
      tipoServico: servico.tipoServico || servico.tipo || 'N/A',
      status: servico.status || 'N/A',
      descricao: servico.descricao || servico.referente || 'N/A',
      datasExecucao: servico.datasExecucao || [],
      ultimaExecucao: servico.ultimaExecucao ? formatDate(servico.ultimaExecucao) : 'N/A',
      proximaExecucao: servico.proximaExecucao ? formatDate(servico.proximaExecucao) : 'N/A',
      horario: servico.horario || 'N/A',
      local: servico.local || servico.localEndereco || 'N/A',
      cidade: servico.cidade || 'N/A',
      supervisor: servico.supervisor || servico.supervisorResponsavel || 'N/A',
      equipe: servico.equipe || servico.equipeMembros || 'N/A',
      veiculoPlaca: servico.veiculoPlaca || 'N/A',
      estruturasRealizadas: servico.estruturasRealizadas || 'N/A',
      acompanhanteAssinatura: servico.acompanhanteAssinatura || 'N/A',
      ocorrenciasProblemas: servico.ocorrenciasProblemas || 'N/A',
      descricaoProblemas: servico.descricaoProblemas || 'N/A',
      observacoesGerais: servico.observacoesGerais || servico.observacoes || 'N/A',
      certificadoEnviado: servico.certificadoEnviado || 'N/A',
      coletaRealizada: servico.coletaRealizada || 'N/A',
      numeroPCColeta: servico.numeroPCColeta || 'N/A',
      numeroNotaFiscal: servico.numeroNotaFiscal || 'N/A',
      dataEmissaoNF: servico.dataEmissaoNF ? formatDate(servico.dataEmissaoNF) : 'N/A'
    };

  }, [servico]);

  const colunasPreview = useMemo(() => {
    const fields = [];
    const addField = (key, label, value, weight = 1, customContent) => {
      fields.push({
        key,
        weight,
        node: (
          <div key={key} className="relatorio-field">
            <p>{label}:</p>
            {customContent ?? <p>{value}</p>}
          </div>
        )
      });
    };

    const indicadorCampos = new Set([
      'acompanhanteAssinatura',
      'descricaoProblemas',
      'certificadoEnviado',
      'coletaRealizada',
      'numeroNotaFiscal',
      'ocorrenciasProblemas',
      'observacoesGerais',
      'numeroPCColeta',
      'dataEmissaoNF'
    ]);

    const indicadorNaoCampos = new Set([
      'certificadoEnviado',
      'coletaRealizada',
      'ocorrenciasProblemas',
      'numeroPCColeta',
      'numeroNotaFiscal',
      'observacoesGerais',
      'dataEmissaoNF',
      'descricaoProblemas'
    ]);

    const getIndicadorValor = (campo) => {
      if (camposSelecionados[campo]) return 'Sim';
      return indicadorNaoCampos.has(campo) ? 'Não' : 'N/A';
    };

    if (camposSelecionados.cliente) addField('cliente', 'Cliente', relatorioData.cliente);
    if (camposSelecionados.numeroOrcamento) addField('numeroOrcamento', 'Número do Orçamento', relatorioData.numeroOrcamento);
    if (camposSelecionados.tipoServico) addField('tipoServico', 'Tipo de Serviço', relatorioData.tipoServico);
    if (camposSelecionados.status) addField('status', 'Status', relatorioData.status);
    if (camposSelecionados.descricao) addField('descricao', 'Descrição', relatorioData.descricao, 2);

    if (camposSelecionados.datasExecucao) {
      const datas = Array.isArray(relatorioData.datasExecucao) ? relatorioData.datasExecucao : [];
      addField(
        'datasExecucao',
        'Datas de Execução',
        '',
        Math.max(2, Math.min(6, 2 + datas.length)),
        datas.length > 0 ? (
          <div className="relatorio-datas">
            {datas.map((data, index) => (
              <div key={index} className="relatorio-data-row">
                <p>{data?.data ? new Date(data.data).toLocaleDateString('pt-BR') : 'N/A'}</p>
                <p>{data?.status || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma data de execução registrada</p>
        )
      );
    }

    if (camposSelecionados.ultimaExecucao) addField('ultimaExecucao', 'Última Execução', relatorioData.ultimaExecucao);
    if (camposSelecionados.proximaExecucao) addField('proximaExecucao', 'Próxima Execução', relatorioData.proximaExecucao);
    if (camposSelecionados.horario) addField('horario', 'Horário', relatorioData.horario);
    if (camposSelecionados.local) addField('local', 'Local', relatorioData.local);
    if (camposSelecionados.cidade) addField('cidade', 'Cidade', relatorioData.cidade);
    if (camposSelecionados.supervisor) addField('supervisor', 'Supervisor', relatorioData.supervisor);
    if (camposSelecionados.equipe) addField('equipe', 'Equipe', relatorioData.equipe);
    if (camposSelecionados.veiculoPlaca) addField('veiculoPlaca', 'Veículo (Placa)', relatorioData.veiculoPlaca);
    if (camposSelecionados.estruturasRealizadas) addField('estruturasRealizadas', 'Estruturas Realizadas', relatorioData.estruturasRealizadas, 2);

    indicadorCampos.forEach((campo) => {
      const labelMap = {
        acompanhanteAssinatura: 'Acompanhante / Assinatura',
        descricaoProblemas: 'Descrição de Problemas',
        certificadoEnviado: 'Certificado Enviado',
        coletaRealizada: 'Coleta Realizada',
        numeroNotaFiscal: 'Nº Nota Fiscal',
        ocorrenciasProblemas: 'Ocorrências/Problemas',
        observacoesGerais: 'Observações Gerais',
        numeroPCColeta: 'Nº PC Coleta',
        dataEmissaoNF: 'Data Emissão NF'
      };
      addField(campo, labelMap[campo] || campo, getIndicadorValor(campo));
    });

    const left = [];
    const right = [];
    let leftWeight = 0;
    let rightWeight = 0;

    fields.forEach((f) => {
      if (leftWeight <= rightWeight) {
        left.push(f.node);
        leftWeight += f.weight;
      } else {
        right.push(f.node);
        rightWeight += f.weight;
      }
    });

    return { left, right };
  }, [camposSelecionados, relatorioData]);



  const handleCampoChange = (campo) => {

    setCamposSelecionados(prev => ({

      ...prev,

      [campo]: !prev[campo]

    }));

  };



  const handleSelectAll = () => {

    const todosAtivos = Object.keys(camposSelecionados).reduce((acc, key) => {

      acc[key] = true;

      return acc;

    }, {});

    setCamposSelecionados(todosAtivos);

  };



  const handleDeselectAll = () => {

    const todosInativos = Object.keys(camposSelecionados).reduce((acc, key) => {

      acc[key] = false;

      return acc;

    }, {});

    setCamposSelecionados(todosInativos);

  };



  const handlePrint = () => {
    const printRoot = document.getElementById('relatorio-content');
    if (!printRoot) return;

    const printGrid = printRoot.querySelector('.relatorio-grid');
    const prev = {
      rootWidth: printRoot.style.width,
      rootHeight: printRoot.style.height,
      rootPadding: printRoot.style.padding,
      rootOverflow: printRoot.style.overflow,
      rootBoxSizing: printRoot.style.boxSizing,
      gridZoom: printGrid?.style.zoom,
      gridTransform: printGrid?.style.transform,
      gridTransformOrigin: printGrid?.style.transformOrigin,
      gridPosition: printGrid?.style.position,
      gridLeft: printGrid?.style.left,
      gridTop: printGrid?.style.top
    };

    const measure = document.createElement('div');
    measure.style.position = 'fixed';
    measure.style.left = '-10000px';
    measure.style.top = '0';
    measure.style.width = '210mm';
    measure.style.height = '297mm';
    measure.style.padding = '6mm';
    measure.style.boxSizing = 'border-box';
    measure.style.overflow = 'hidden';
    document.body.appendChild(measure);
    const pageWidth = measure.clientWidth;
    const pageHeight = measure.clientHeight;
    document.body.removeChild(measure);

    printRoot.style.width = '210mm';
    printRoot.style.height = '297mm';
    printRoot.style.padding = '6mm';
    printRoot.style.boxSizing = 'border-box';
    printRoot.style.overflow = 'hidden';

    if (printGrid) {
      const availableWidth = pageWidth;
      const availableHeight = pageHeight;
      printGrid.style.zoom = 1;
      printGrid.style.transform = 'none';

      const scaleX = availableWidth / Math.max(1, printGrid.scrollWidth);
      const scaleY = availableHeight / Math.max(1, printGrid.scrollHeight);
      let scale = Math.max(0.2, Math.min(1, scaleX, scaleY));

      const applyScale = () => {
        if (typeof printGrid.style.zoom !== 'undefined') {
          printGrid.style.position = '';
          printGrid.style.left = '';
          printGrid.style.top = '';
          printGrid.style.transform = 'none';
          printGrid.style.zoom = scale;
        } else {
          printGrid.style.zoom = '';
          printGrid.style.position = 'absolute';
          printGrid.style.left = '0';
          printGrid.style.top = '0';
          printGrid.style.transformOrigin = 'top left';
          printGrid.style.transform = 'scale(' + scale + ')';
        }
      };

      applyScale();

      for (let i = 0; i < 30; i++) {
        const rect = printGrid.getBoundingClientRect();
        const rootRect = printRoot.getBoundingClientRect();
        if (rect.width <= rootRect.width + 0.5 && rect.height <= rootRect.height + 0.5) break;
        scale = Math.max(0.2, scale - 0.02);
        applyScale();
      }
    }

    const cleanup = () => {
      printRoot.style.width = prev.rootWidth;
      printRoot.style.height = prev.rootHeight;
      printRoot.style.padding = prev.rootPadding;
      printRoot.style.overflow = prev.rootOverflow;
      printRoot.style.boxSizing = prev.rootBoxSizing;
      if (printGrid) {
        printGrid.style.zoom = prev.gridZoom;
        printGrid.style.transform = prev.gridTransform;
        printGrid.style.transformOrigin = prev.gridTransformOrigin;
        printGrid.style.position = prev.gridPosition;
        printGrid.style.left = prev.gridLeft;
        printGrid.style.top = prev.gridTop;
      }
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();

  };

  const handlePrintOrSavePdf = async () => {
    const shouldSavePdf = window.confirm('Deseja salvar em PDF?\n\nOK = Salvar PDF\nCancelar = Apenas imprimir');
    if (shouldSavePdf) {
      await handleSavePdf();
      return;
    }
    handlePrint();
  };

  const buildPdfFilename = () => {
    const rawCliente = relatorioData?.cliente || 'Cliente';
    const cliente = String(rawCliente)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\\/:*?"<>|]+/g, ' ')
      .trim();

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    return `Relatorio de servico de ${cliente} - ${stamp}.pdf`;
  };

  const handleSavePdf = async () => {
    const node = document.getElementById('relatorio-content');
    if (!node) return;

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);

    const prevWidth = node.style.width;
    const prevHeight = node.style.height;
    const prevPadding = node.style.padding;
    const prevOverflow = node.style.overflow;
    const prevBoxSizing = node.style.boxSizing;

    node.classList.add('relatorio-export');
    node.style.width = '210mm';
    node.style.height = '297mm';
    node.style.padding = '6mm';
    node.style.overflow = 'hidden';
    node.style.boxSizing = 'border-box';

    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true
    });

    node.classList.remove('relatorio-export');
    node.style.width = prevWidth;
    node.style.height = prevHeight;
    node.style.padding = prevPadding;
    node.style.overflow = prevOverflow;
    node.style.boxSizing = prevBoxSizing;

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const props = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (props.height * imgWidth) / props.width;

    let renderWidth = imgWidth;
    let renderHeight = imgHeight;
    if (renderHeight > pdfHeight) {
      renderHeight = pdfHeight;
      renderWidth = (props.width * renderHeight) / props.height;
    }

    const x = (pdfWidth - renderWidth) / 2;
    const y = 0;
    pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);

    pdf.save(buildPdfFilename());
  };

  if (!isVisible) return null;



  return (

    <div className="relatorio-overlay">

      <div className="relatorio-modal">

        <div className="relatorio-header">

          <h2>

            <i className="fas fa-file-lines"></i>

            Gerar Relatório do Serviço

          </h2>

          <button className="btn-fechar" onClick={onClose}>

            <i className="fas fa-times"></i>

          </button>

        </div>

        

        <div className="relatorio-body">

          <div className="relatorio-sidebar">

            <div className="campos-selecao">

              <h3>Selecione os campos que deseja incluir no relatório:</h3>

              

              <div className="campos-grupo">

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.cliente}

                    onChange={() => handleCampoChange('cliente')}

                  />

                  <span>Cliente</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.numeroOrcamento}

                    onChange={() => handleCampoChange('numeroOrcamento')}

                  />

                  <span>Nº Orçamento</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.tipoServico}

                    onChange={() => handleCampoChange('tipoServico')}

                  />

                  <span>Tipo de Serviço</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.status}

                    onChange={() => handleCampoChange('status')}

                  />

                  <span>Status</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.descricao}

                    onChange={() => handleCampoChange('descricao')}

                  />

                  <span>Descrição</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.datasExecucao}

                    onChange={() => handleCampoChange('datasExecucao')}

                  />

                  <span>Datas de Execução</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.ultimaExecucao}

                    onChange={() => handleCampoChange('ultimaExecucao')}

                  />

                  <span>Última Execução</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.proximaExecucao}

                    onChange={() => handleCampoChange('proximaExecucao')}

                  />

                  <span>Próxima Execução</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.horario}

                    onChange={() => handleCampoChange('horario')}

                  />

                  <span>Horário</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.local}

                    onChange={() => handleCampoChange('local')}

                  />

                  <span>Local</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.cidade}

                    onChange={() => handleCampoChange('cidade')}

                  />

                  <span>Cidade</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.supervisor}

                    onChange={() => handleCampoChange('supervisor')}

                  />

                  <span>Supervisor</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.equipe}

                    onChange={() => handleCampoChange('equipe')}

                  />

                  <span>Equipe</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.veiculoPlaca}

                    onChange={() => handleCampoChange('veiculoPlaca')}

                  />

                  <span>Veículo (Placa)</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.estruturasRealizadas}

                    onChange={() => handleCampoChange('estruturasRealizadas')}

                  />

                  <span>Estruturas Realizadas</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.acompanhanteAssinatura}

                    onChange={() => handleCampoChange('acompanhanteAssinatura')}

                  />

                  <span>Acompanhante / Assinatura</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.ocorrenciasProblemas}

                    onChange={() => handleCampoChange('ocorrenciasProblemas')}

                  />

                  <span>Ocorrências/Problemas</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.descricaoProblemas}

                    onChange={() => handleCampoChange('descricaoProblemas')}

                  />

                  <span>Descrição de Problemas</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.observacoesGerais}

                    onChange={() => handleCampoChange('observacoesGerais')}

                  />

                  <span>Observações Gerais</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.certificadoEnviado}

                    onChange={() => handleCampoChange('certificadoEnviado')}

                  />

                  <span>Certificado Enviado</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.coletaRealizada}

                    onChange={() => handleCampoChange('coletaRealizada')}

                  />

                  <span>Coleta Realizada</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.numeroPCColeta}

                    onChange={() => handleCampoChange('numeroPCColeta')}

                  />

                  <span>Nº PC Coleta</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.numeroNotaFiscal}

                    onChange={() => handleCampoChange('numeroNotaFiscal')}

                  />

                  <span>Nº Nota Fiscal</span>

                </label>

                

                <label className="campo-checkbox">

                  <input 

                    type="checkbox" 

                    checked={camposSelecionados.dataEmissaoNF}

                    onChange={() => handleCampoChange('dataEmissaoNF')}

                  />

                  <span>Data Emissão NF</span>

                </label>

              </div>

              <div className="campos-acoes">
                <button type="button" className="btn-selecionar-todos" onClick={handleSelectAll}>
                  Selecionar todos
                </button>
                <button type="button" className="btn-desselecionar-todos" onClick={handleDeselectAll}>
                  Desselecionar todos
                </button>
              </div>

            </div>

          </div>


          

          <div id="relatorio-content" className="relatorio-content">

            <div className="relatorio-print-header">
              <img src="/img/logo2.png" alt="Top Limp" />
              <h2>Relatório de Serviço - Top Limp</h2>
            </div>

            <div className="relatorio-grid">
              <div className="relatorio-col">
                {colunasPreview.left}
              </div>
              <div className="relatorio-col">
                {colunasPreview.right}
              </div>
            </div>

          </div>

        </div>



        <div className="relatorio-actions">

          <button className="btn-imprimir" onClick={handlePrintOrSavePdf}>

            <i className="fas fa-print"></i>

            Imprimir/Salvar PDF

          </button>



          

        </div>

      </div>

    </div>

  );

};



export default RelatoriosServicos;
